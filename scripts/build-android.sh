#!/bin/bash

echo "========================================"
echo "GADIES - Ertiga Diesel Insights Hub"
echo "Android Build Script"
echo "========================================"

echo ""
echo "[1/6] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js is installed ($(node --version))"

echo ""
echo "[2/6] Installing dependencies..."
if ! npm install; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi
echo "✓ Dependencies installed"

echo ""
echo "[3/6] Building web assets..."
if ! npm run build; then
    echo "ERROR: Failed to build web assets"
    exit 1
fi
echo "✓ Web assets built"

echo ""
echo "[4/6] Adding Android platform..."
npx cap add android 2>/dev/null || echo "WARNING: Android platform might already exist"
echo "✓ Android platform ready"

echo ""
echo "[5/6] Syncing Capacitor..."
if ! npx cap sync android; then
    echo "ERROR: Failed to sync Capacitor"
    exit 1
fi
echo "✓ Capacitor synced"

echo ""
echo "[6/6] Opening Android Studio..."
if ! npx cap open android; then
    echo "ERROR: Failed to open Android Studio"
    echo "Please open Android Studio manually and import the android folder"
    exit 1
fi

echo ""
echo "========================================"
echo "Build process completed successfully!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Wait for Android Studio to load and sync"
echo "2. Build APK: Build → Build Bundle(s) / APK(s) → Build APK(s)"
echo "3. Test on physical device with ELM327 adapter"
echo ""
