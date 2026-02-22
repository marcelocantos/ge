package com.marcelocantos.player;

import android.app.Activity;

import com.google.mlkit.vision.barcode.common.Barcode;
import com.google.mlkit.vision.codescanner.GmsBarcodeScanner;
import com.google.mlkit.vision.codescanner.GmsBarcodeScannerOptions;
import com.google.mlkit.vision.codescanner.GmsBarcodeScanning;

/**
 * JNI bridge for QR code scanning via Google Code Scanner API.
 * Called from native code (QRScanner_android.cpp).
 */
public class QRScannerBridge {
    private static volatile String scannedUrl = null;
    private static volatile boolean scanComplete = false;

    public static void startScan(Activity activity) {
        scannedUrl = null;
        scanComplete = false;

        GmsBarcodeScannerOptions options = new GmsBarcodeScannerOptions.Builder()
                .setBarcodeFormats(Barcode.FORMAT_QR_CODE)
                .build();

        GmsBarcodeScanner scanner = GmsBarcodeScanning.getClient(activity, options);

        activity.runOnUiThread(() ->
            scanner.startScan()
                .addOnSuccessListener(barcode -> {
                    String value = barcode.getRawValue();
                    if (value != null && value.startsWith("ge-remote://")) {
                        scannedUrl = value;
                    }
                    scanComplete = true;
                })
                .addOnFailureListener(e -> scanComplete = true)
        );
    }

    public static boolean isScanComplete() {
        return scanComplete;
    }

    public static String getScannedUrl() {
        return scannedUrl;
    }
}
