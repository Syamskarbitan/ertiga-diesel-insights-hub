@echo off
echo ========================================
echo GADIES - Ertiga Diesel Insights Hub
echo Android Build Script
echo ========================================

echo.
echo [1/6] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js is installed

echo.
echo [2/6] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed

echo.
echo [3/6] Building web assets...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Failed to build web assets
    pause
    exit /b 1
)
echo ✓ Web assets built

echo.
echo [4/6] Adding Android platform...
call npx cap add android
if %errorlevel% neq 0 (
    echo WARNING: Android platform might already exist
)
echo ✓ Android platform ready

echo.
echo [5/6] Syncing Capacitor...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ERROR: Failed to sync Capacitor
    pause
    exit /b 1
)
echo ✓ Capacitor synced

echo.
echo [6/6] Opening Android Studio...
call npx cap open android
if %errorlevel% neq 0 (
    echo ERROR: Failed to open Android Studio
    echo Please open Android Studio manually and import the android folder
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build process completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Wait for Android Studio to load and sync
echo 2. Build APK: Build → Build Bundle(s) / APK(s) → Build APK(s)
echo 3. Test on physical device with ELM327 adapter
echo.
pause
