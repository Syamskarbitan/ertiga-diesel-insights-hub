#!/bin/bash
# GADIES Android Build Script - Shell Version
# Created for ertiGA-DiESel Jatim by Samsul

echo "========================================"
echo "GADIES Android Build Script"
echo "ertiGA-DiESel Jatim by Samsul"
echo "========================================"
echo ""

# Set Java and Android environment variables if needed
# export JAVA_HOME=/path/to/jdk
# export ANDROID_HOME=$HOME/Android/Sdk

echo "Step 1: Building web assets..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Web build failed!"
    exit 1
fi

echo ""
echo "Step 2: Syncing with Android..."
npx cap sync android
if [ $? -ne 0 ]; then
    echo "ERROR: Capacitor sync failed!"
    exit 1
fi

echo ""
echo "Step 3: Building Android project..."
cd android
./gradlew assembleDebug
if [ $? -ne 0 ]; then
    cd ..
    echo "ERROR: Android build failed!"
    exit 1
fi

cd ..
echo ""
echo "========================================"
echo "BUILD SUCCESSFUL!"
echo "========================================"
echo ""
echo "Debug APK location:"
echo "$(pwd)/android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "To build release APK, run:"
echo "cd android && ./gradlew assembleRelease"
echo ""