# IAP Testing — studio-wide protocol

Cross-portfolio sandbox + license-tester setup for the `ge::iap` stack (🎯T65).
Same pattern as the studio-wide match repo (🎯T64.1): one tester pool per platform,
shared across every squz + minicadesmobile game, credentials in the shared password
manager.

## iOS — sandbox testers

Sandbox testers are synthetic Apple IDs created in App Store Connect with no real
payment methods. Signed in via **Settings → App Store → Sandbox Account** on the
device. Purchases are signature-verified by Apple's sandbox infrastructure;
subscriptions tick at ~5 min per month for testing. No card is ever charged.

**Pool location**: App Store Connect → Users and Access → Sandbox Testers.

**Naming convention** (one per engineer, plus one shared rotating account for
multi-device testing):

| Tester | Apple ID | Notes |
|---|---|---|
| `marcelo+sb@…` | (in password manager) | Marcelo's primary |
| `<engineer>+sb@…` | (in password manager) | Per-engineer primary |
| `shared+sb@…` | (in password manager) | Multi-device QA |

**On-device setup** (per engineer, per device, one-time):
1. Settings → App Store → Sandbox Account.
2. Sign in with the assigned sandbox Apple ID.
3. Confirm via two-factor prompt sent to the assigned recovery email.
4. The account stays signed in until manually changed; production purchases
   continue to use the device's main Apple ID.

**Adding a new game**: register the SKUs (`com.squz.<game>.<sku>`) in App Store
Connect → My Apps → <game> → Monetization → In-App Purchases. Sandbox testers
work against any registered SKU automatically; no per-game tester setup.

## Android — license testers

License testers are real Google accounts on an allowlist in Play Console. Test
purchases run the full Play Billing flow (UI, "Buy" button, order created) but
are tagged as test purchases — the card is **never charged** at any point.
Holds on internal, closed, open, and production tracks.

**Pool location**: Play Console → Setup → License testing (top-level, applies
to every app in the organisation).

**Naming convention** (one per engineer; same Google account as the engineer
uses for development, no synthetic accounts):

| Tester | Google account | Notes |
|---|---|---|
| `marcelo@…` | (in password manager) | Marcelo's primary |
| `<engineer>@…` | (in password manager) | Per-engineer primary |

**Onboarding order matters** — add the account to license testers in Play
Console *before* the engineer installs the build. An installed-then-added
flow leaves a window where a real charge can occur if the engineer purchases
something. Defensive default: never tap "Buy" on Android until you've
confirmed your Google account is on the license tester list for the
target track.

**Adding a new game**: register the SKUs (`com.squz.<game>.<sku>`) in
Play Console → <app> → Monetize → Products → In-app products (or
Subscriptions). License testers work against any registered SKU
automatically; no per-game tester setup.

## TestFlight / Play Internal — production-grade with free purchases

Both tester pools above also work against TestFlight builds (iOS) and Play
Internal Testing builds (Android). These are the canonical end-to-end
verification path before a build promotes to external beta or production.

**iOS**: build → upload to TestFlight via fastlane (🎯T64.6) → install via
TestFlight app → sign in to sandbox account → buy product → receipt is
signature-verified, entitlement persists in Keychain (🎯T65.5).

**Android**: build → upload AAB to Play Internal Testing via fastlane →
install via Play Store opt-in URL → log in with a license tester Google
account → buy product → receipt is signature-verified, entitlement persists
in EncryptedSharedPreferences (🎯T65.5).

## Local-only dev iteration

For inner-loop work, neither sandbox nor license testers are needed. Use
the in-engine debug panel (🎯T65.6) to toggle entitlements directly —
long-press the top-right corner of a debug build, tap a product to flip
its owned state. Compiled out of release builds.

If you specifically want to validate the platform framework path without
sandbox credentials, use `GE_IAP_MODE=local` (🎯T65.4): iOS reads from a
committed `.storekit` file, Android uses the reserved `android.test.*` SKUs.

## Credentials

All sandbox Apple IDs and license tester Google account credentials live in
the shared 1Password vault under **"IAP testers — studio-wide"**. Vault
access is per-engineer; ask Marcelo for the invite link. Never check
credentials into a repo, including ge.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| iOS sandbox sign-in fails with "Cannot connect to iTunes Store" | Sandbox tester was created less than ~30 min ago | Wait; Apple's sandbox propagation takes time |
| iOS purchase prompt asks for production Apple ID password | No sandbox tester signed in | Settings → App Store → Sandbox Account → sign in |
| Android "Authentication is required" loop | Google account not on the license tester list | Add the account in Play Console → Setup → License testing |
| Android "Item not found" | SKU not registered in Play Console, OR app not uploaded to a track that the tester account can install | Register the SKU; upload at least one build to Internal Testing |
| `owned()` returns false right after a successful `buy()` callback | Cache write hasn't completed yet | T65.5 makes this synchronous; if pre-T65.5, re-query after the next render frame |
