# Android Development Guide

## GADIES - Ertiga Diesel Insights Hub Android App

This directory contains the Android native project for the GADIES OBD-II diagnostic application.

## Prerequisites

1. **Android Studio** (latest version)
2. **Android SDK** (API level 22-34)
3. **Java Development Kit (JDK)** 11 or higher
4. **Node.js** and npm (for Capacitor)

## Project Structure

```
android/
├── app/
│   ├── src/main/
│   │   ├── java/com/gadies/ertigadieselinsights/
│   │   │   └── MainActivity.java
│   │   ├── res/
│   │   │   ├── values/
│   │   │   │   ├── strings.xml
│   │   │   │   ├── colors.xml
│   │   │   │   └── styles.xml
│   │   │   ├── xml/
│   │   │   │   ├── network_security_config.xml
│   │   │   │   └── file_paths.xml
│   │   │   └── drawable/
│   │   │       └── splash.xml
│   │   └── AndroidManifest.xml
│   ├── build.gradle
│   ├── capacitor.build.gradle
│   └── proguard-rules.pro
├── capacitor-cordova-android-plugins/
├── gradle/wrapper/
├── build.gradle
├── settings.gradle
├── variables.gradle
└── capacitor.config.json
```

## Build Instructions

### Method 1: Using Build Scripts

**Windows:**
```bash
scripts\build-android.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/build-android.sh
./scripts/build-android.sh
```

### Method 2: Manual Build

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build web assets:**
   ```bash
   npm run build
   ```

3. **Add Android platform:**
   ```bash
   npx cap add android
   ```

4. **Sync Capacitor:**
   ```bash
   npx cap sync android
   ```

5. **Open in Android Studio:**
   ```bash
   npx cap open android
   ```

### Method 3: Using Package Scripts

```bash
# Build and open Android Studio
npm run android:build

# Just sync changes
npm run android:sync

# Open Android Studio
npm run android:open
```

## Key Features Configured

### Permissions
- **Bluetooth:** Classic and BLE scanning/connection
- **Location:** Required for Bluetooth scanning on Android 6+
- **Network:** WiFi ELM327 adapter support
- **Storage:** Data export and file operations
- **Camera:** Future QR code scanning for device pairing

### Network Security
- Cleartext traffic allowed for ELM327 WiFi adapters
- Common IP ranges: 192.168.0.x, 192.168.1.x, 192.168.4.x
- Localhost support for development

### WebView Optimizations
- Hardware acceleration enabled
- Mixed content allowed for ELM327 connections
- Debug mode enabled for development

## Testing

### Physical Device Testing
1. Enable Developer Options and USB Debugging
2. Connect device via USB
3. Build and install APK
4. Test with real ELM327 Bluetooth/WiFi adapter

### Emulator Limitations
- Bluetooth functionality limited on emulators
- WiFi ELM327 testing possible with network bridge
- UI and basic functionality can be tested

## Troubleshooting

### Common Issues

1. **Gradle Sync Failed**
   - Check Android SDK installation
   - Update Gradle wrapper if needed
   - Clear Gradle cache: `./gradlew clean`

2. **Bluetooth Permissions**
   - Ensure location permission granted
   - Check Bluetooth is enabled on device
   - Verify ELM327 device is paired (for Classic Bluetooth)

3. **Network Security**
   - Verify network_security_config.xml is properly configured
   - Check ELM327 WiFi adapter IP address
   - Ensure cleartext traffic is allowed

4. **Build Errors**
   - Clean and rebuild: `Build → Clean Project`
   - Invalidate caches: `File → Invalidate Caches and Restart`
   - Check dependencies in build.gradle files

### Debug Commands

```bash
# Check Capacitor status
npx cap doctor

# View detailed logs
npx cap run android --verbose

# Clean build
./gradlew clean
```

## Production Build

1. **Generate signed APK:**
   - `Build → Generate Signed Bundle / APK`
   - Create or use existing keystore
   - Select release build variant

2. **Optimize for release:**
   - Enable ProGuard in build.gradle
   - Test thoroughly on multiple devices
   - Verify all permissions work correctly

## Support

For issues specific to:
- **Capacitor:** [Capacitor Documentation](https://capacitorjs.com/docs)
- **Android Development:** [Android Developer Guide](https://developer.android.com/guide)
- **ELM327 Integration:** Check project documentation and hooks

## Version Information

- **Android SDK:** 22-34
- **Capacitor:** ^6.0.0
- **Gradle:** 8.0
- **Java:** 1.8 (source/target compatibility)
