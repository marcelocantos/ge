# Squz Remote - Mobile Receiver Setup

Squz Remote is a mobile companion app that renders the game on an iOS or Android device. The game runs as a headless server on your Mac, streaming WebGPU draw calls over the local network to the phone/tablet via Dawn's wire protocol.

You don't need to modify Squz Remote to develop the game. The mobile app is a thin receiver - all game logic runs in the parent repo. This guide covers how to build the receiver, install it on a device, and connect it to your development server.

## How it works

1. `make run` starts the game as a wire server and prints a QR code in the terminal
2. Squz Remote on the phone scans the QR code to discover the server's IP and port
3. The server streams all rendering commands over TCP; the phone replays them on its GPU
4. Touch input on the phone is sent back to the server

When the phone disconnects (app backgrounded, Wi-Fi drop, etc.), the server waits for a new connection and resumes from where it left off.

## Prerequisites

Both platforms require a one-time Dawn cross-compilation. The prebuilt libraries are committed to the repo via Git LFS, so **if you just cloned the repo you already have them** and can skip the "Build dependencies" step.

You only need to re-run `build-deps.sh` if you update the Dawn version (the commit hash at the top of each script).

### Common

- macOS with Xcode Command Line Tools
- The `sq` submodule fully initialised: `git submodule update --init --recursive`

### iOS

- Xcode (full install, not just CLI tools)
- An Apple Developer account (free is fine for personal devices)

### Android

- [Android Studio](https://developer.android.com/studio) with:
  - Android SDK (API 35)
  - Android NDK (any recent version, e.g. 27+)
  - CMake (via SDK Manager > SDK Tools)
- A USB-connected Android device with Developer Mode enabled
- Java 17+ (bundled with Android Studio, or install separately)

## iOS

### Build dependencies (one-time)

Skip this if the prebuilt libraries already exist at `sq/vendor/dawn/lib/ios-arm64/`.

```bash
cd sq/tools/ios
bash build-deps.sh      # Cross-compiles Dawn and SDL3 for iOS (~20 min)
```

### Generate Xcode project

```bash
make sq/ios
```

This runs CMake to generate `sq/tools/ios/build/xcode/Receiver.xcodeproj`.

### Build and run

1. Open `sq/tools/ios/build/xcode/Receiver.xcodeproj` in Xcode
2. Select your iOS device as the build target
3. Set the development team in Signing & Capabilities (your Apple ID)
4. Build and run (Cmd+R)

The app opens a camera viewfinder for QR scanning.

### Connect to the game server

In a separate terminal:

```bash
make run
```

The server prints a QR code in the terminal. Point the phone's camera at it. The game should appear on the phone within a few seconds.

## Android

### Build dependencies (one-time)

Skip this if the prebuilt libraries already exist at `sq/vendor/dawn/lib/android-arm64/`.

```bash
cd sq/tools/android
bash build-deps.sh      # Cross-compiles Dawn for Android arm64 (~20 min)
```

The script auto-detects the NDK from `~/Library/Android/sdk/ndk/`. Set `ANDROID_NDK_ROOT` if yours is elsewhere.

### Configure local SDK path

Create `sq/tools/android/local.properties` (git-ignored) with your SDK path:

```
sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk
```

### Build the APK

```bash
make sq/android
```

Or equivalently:

```bash
cd sq/tools/android
./gradlew assembleDebug
```

The APK is at `sq/tools/android/app/build/outputs/apk/debug/app-debug.apk`.

### Install on device

With your Android device connected via USB:

```bash
adb install sq/tools/android/app/build/outputs/apk/debug/app-debug.apk
```

Or combine build + install:

```bash
cd sq/tools/android
./gradlew installDebug
```

### Connect to the game server

In a separate terminal:

```bash
make run
```

Launch "Squz Remote" from the app drawer. It opens Google's barcode scanner to scan the QR code printed in the terminal. The game should appear on the phone within a few seconds.

## Troubleshooting

### Server shows "Waiting for receiver connection..." but the phone doesn't connect

- Both devices must be on the same Wi-Fi network
- Check that port 42069 isn't blocked by a firewall
- The QR code encodes `squz-remote://<lan-ip>:42069` - verify the IP is reachable from the phone

### Android: "SDK location not found"

Create `sq/tools/android/local.properties` with `sdk.dir=<path to your Android SDK>`.

### Android: QR scanner doesn't open

Google Code Scanner requires Google Play Services. It won't work on emulators or devices without Play Services.

### build-deps.sh fails

The script clones Dawn into a local build directory on first run. If it fails partway through, delete the build directory and retry:

```bash
rm -rf sq/tools/ios/build    # or sq/tools/android/build
```

### Server dies on disconnect

This was fixed - the server now waits for a new connection when the receiver disconnects. If you're seeing crashes, make sure you have the latest code.
