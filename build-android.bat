@echo off
echo ========================================
echo GADIES Android Build Script
echo ertiGA-DiESel Jatim by Samsul
echo ========================================

echo.
echo Step 1: Building web assets...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Web build failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Syncing with Android...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ERROR: Capacitor sync failed!
    pause
    exit /b 1
)

echo.
echo Step 3: Building Android project...
cd android
call gradlew assembleDebug
if %errorlevel% neq 0 (
    cd ..
    echo ERROR: Android build failed!
    pause
    exit /b 1
)

cd ..
echo.
echo ========================================
echo BUILD SUCCESSFUL!
echo ========================================
echo.
echo Debug APK location:
echo %cd%\android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo To build release APK, run:
echo cd android && gradlew assembleRelease
echo.
pause