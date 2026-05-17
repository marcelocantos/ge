// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Java side of ge::iap's Play Billing 7+ backend (🎯T65.3).
//
// The native C++ side (src/iap_android.cpp) creates an IapBridge
// instance during AppleStore-equivalent construction; the bridge
// wires up BillingClient and forwards every state change back to
// native via the static nativeOn* JNI methods at the bottom.
//
// Gradle dependency required in the consuming app:
//   implementation 'com.android.billingclient:billing:7.x.x'
//
// Verification status: this file has NOT been verified end-to-end on
// a real Android device yet — that's part of 🎯T65.7's demonstration.
// The flow follows Google's Play Billing 7 documentation; subtle bugs
// may surface at first device run.

package ge;

import android.app.Activity;
import android.content.Context;
import android.util.Log;

import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class IapBridge implements PurchasesUpdatedListener {
    private static final String TAG = "ge.iap";

    private final Activity activity;
    private final BillingClient client;
    // Cached ProductDetails for each SKU — needed to launch a billing
    // flow. Populated by querySkus().
    private final Map<String, ProductDetails> productsBySku = new HashMap<>();

    public IapBridge(Activity activity) {
        this.activity = activity;
        this.client = BillingClient.newBuilder(activity)
                .setListener(this)
                .enablePendingPurchases(
                        PendingPurchasesParams.newBuilder()
                                .enableOneTimeProducts()
                                .build())
                .build();
        client.startConnection(new BillingClientStateListener() {
            @Override public void onBillingSetupFinished(BillingResult br) {
                if (br.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    nativeOnBillingReady();
                } else {
                    Log.e(TAG, "billing setup failed: " + br.getDebugMessage());
                }
            }
            @Override public void onBillingServiceDisconnected() {
                Log.w(TAG, "billing service disconnected; reconnect on next call");
            }
        });
    }

    public void querySkus(String[] skus, boolean[] subscriptionFlags) {
        List<QueryProductDetailsParams.Product> products = new ArrayList<>();
        for (int i = 0; i < skus.length; i++) {
            String productType = subscriptionFlags[i]
                    ? BillingClient.ProductType.SUBS
                    : BillingClient.ProductType.INAPP;
            products.add(QueryProductDetailsParams.Product.newBuilder()
                    .setProductId(skus[i])
                    .setProductType(productType)
                    .build());
        }
        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
                .setProductList(products)
                .build();
        client.queryProductDetailsAsync(params, (br, result) -> {
            if (br.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                Log.w(TAG, "queryProductDetailsAsync failed: " + br.getDebugMessage());
                return;
            }
            for (ProductDetails pd : result.getProductDetailsList()) {
                productsBySku.put(pd.getProductId(), pd);
                String price = "";
                String currency = "";
                if (pd.getOneTimePurchaseOfferDetails() != null) {
                    price    = pd.getOneTimePurchaseOfferDetails().getFormattedPrice();
                    currency = pd.getOneTimePurchaseOfferDetails().getPriceCurrencyCode();
                }
                nativeOnProductFetched(
                        pd.getProductId(),
                        pd.getTitle(),
                        pd.getDescription(),
                        price,
                        currency);
            }
        });
    }

    public void queryPurchases() {
        QueryPurchasesParams params = QueryPurchasesParams.newBuilder()
                .setProductType(BillingClient.ProductType.INAPP)
                .build();
        client.queryPurchasesAsync(params, (br, purchases) -> {
            if (br.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                Log.w(TAG, "queryPurchasesAsync failed: " + br.getDebugMessage());
                nativeOnRestoreFinished(false, br.getDebugMessage());
                return;
            }
            for (Purchase p : purchases) {
                handlePurchase(p);
            }
            nativeOnRestoreFinished(true, "");
        });
    }

    public boolean launchPurchase(String sku) {
        ProductDetails pd = productsBySku.get(sku);
        if (pd == null) {
            nativeOnPurchaseUpdate(sku, false, "product not yet fetched from store");
            return false;
        }
        BillingFlowParams.ProductDetailsParams pdp =
                BillingFlowParams.ProductDetailsParams.newBuilder()
                        .setProductDetails(pd)
                        .build();
        BillingFlowParams flow = BillingFlowParams.newBuilder()
                .setProductDetailsParamsList(java.util.Collections.singletonList(pdp))
                .build();
        BillingResult br = client.launchBillingFlow(activity, flow);
        if (br.getResponseCode() != BillingClient.BillingResponseCode.OK) {
            nativeOnPurchaseUpdate(sku, false, br.getDebugMessage());
            return false;
        }
        return true;
    }

    @Override
    public void onPurchasesUpdated(BillingResult br, List<Purchase> purchases) {
        if (br.getResponseCode() != BillingClient.BillingResponseCode.OK || purchases == null) {
            // User-cancelled and error states both reach here.
            return;
        }
        for (Purchase p : purchases) handlePurchase(p);
    }

    private void handlePurchase(Purchase p) {
        if (p.getPurchaseState() != Purchase.PurchaseState.PURCHASED) {
            // PENDING — slow payment methods. Surface as not-owned for
            // now; T65.5 cache work will add onPending handling.
            return;
        }
        // Signature verification is enforced by the Play Billing
        // library before delivering a Purchase here — additional
        // signature checks against the app's public key are
        // recommended but not added in this v1 path. Server-side
        // verification is the upgrade target when subscriptions ship.
        for (String sku : p.getProducts()) {
            nativeOnPurchaseUpdate(sku, true, "");
            // Acknowledge to prevent auto-refund after 3 days. Skip
            // for already-acknowledged purchases.
            if (!p.isAcknowledged()) {
                AcknowledgePurchaseParams ack = AcknowledgePurchaseParams.newBuilder()
                        .setPurchaseToken(p.getPurchaseToken())
                        .build();
                client.acknowledgePurchase(ack, br -> {
                    if (br.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                        Log.w(TAG, "acknowledge failed for " + sku + ": " + br.getDebugMessage());
                    }
                });
            }
        }
    }

    public void shutdown() {
        if (client.isReady()) client.endConnection();
    }

    // ── JNI hooks — defined in src/iap_android.cpp ─────────────────
    private static native void nativeOnBillingReady();
    private static native void nativeOnProductFetched(
            String sku, String title, String description, String price, String currency);
    private static native void nativeOnPurchaseUpdate(String sku, boolean ok, String error);
    private static native void nativeOnRestoreFinished(boolean ok, String error);
}
