# GADIES - ertiGA-DiESel Jatim by Samsul - Deployment Guide

## Prerequisites

### 1. Install Node.js and npm
Download and install Node.js from [nodejs.org](https://nodejs.org/)
```bash
# Verify installation
node --version
npm --version
```

### 2. Install Android Studio
Download and install Android Studio from [developer.android.com](https://developer.android.com/studio)

### 3. Install Java Development Kit (JDK)
Install JDK 8 or higher

## Build and Deployment Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Web Assets
```bash
npm run build
```

### 3. Add Android Platform (if not already added)
```bash
npx cap add android
```

### 4. Sync Capacitor
```bash
npx cap sync android
```

### 5. Open in Android Studio
```bash
npx cap open android
```

### 6. Build APK in Android Studio
1. Open the project in Android Studio
2. Wait for Gradle sync to complete
3. Go to Build → Build Bundle(s) / APK(s) → Build APK(s)
4. The APK will be generated in `android/app/build/outputs/apk/debug/`

## Development Commands

### Start Development Server
```bash
npm run dev
```

### Live Reload on Device
```bash
npx cap run android --livereload --external
```

### View Logs
```bash
npx cap run android --consolelogs
```

## Troubleshooting

### Common Issues

1. **Gradle Build Failed**
   - Ensure Android SDK is properly installed
   - Check that ANDROID_HOME environment variable is set
   - Try cleaning the project: `./gradlew clean` in android folder

2. **Bluetooth Permissions**
   - Make sure all Bluetooth permissions are granted
   - Test on physical device (Bluetooth doesn't work in emulator)

3. **Network Security**
   - WiFi ELM327 connections require cleartext traffic
   - Network security config is already configured

4. **TypeScript Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check that @types packages are properly installed

### Environment Variables
Create a `.env` file in the root directory:
```
VITE_APP_NAME=GADIES - Ertiga Diesel Insights
VITE_APP_VERSION=1.0.0
```

## Features

### Bluetooth ELM327 Support
- Web Bluetooth API for device scanning
- GATT service communication
- Automatic device reconnection

### WiFi ELM327 Support  
- WebSocket connection to WiFi adapters
- Network security configuration for cleartext traffic
- IP address validation

### OBD-II Data Monitoring
- Real-time parameter monitoring
- Historical data charts
- Alert system for critical values
- Fallback to simulated data when disconnected

### Android Optimizations
- Hardware acceleration enabled
- Proper permissions configuration
- Background service support
- File provider for data export

## Testing

### Test on Physical Device
1. Enable Developer Options on Android device
2. Enable USB Debugging
3. Connect device via USB
4. Run `npx cap run android`

### Test Bluetooth Connection
1. Ensure ELM327 adapter is paired with device
2. Grant Bluetooth permissions when prompted
3. Test device scanning and connection

### Test WiFi Connection
1. Connect to ELM327 WiFi network
2. Use default IP (usually 192.168.0.10 or 192.168.4.1)
3. Test WebSocket connection

## Production Build

### Release APK
1. Generate signed APK in Android Studio
2. Configure signing keys
3. Build release APK
4. Test on multiple devices

### Play Store Deployment
1. Create signed AAB (Android App Bundle)
2. Upload to Google Play Console
3. Configure store listing
4. Submit for review

## Support

For issues and support:
- Check the troubleshooting section above
- Review Android Studio logs
- Test on physical device with ELM327 adapter
- Ensure all permissions are granted
