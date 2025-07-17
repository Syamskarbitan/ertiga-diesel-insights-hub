@echo off
echo ========================================
echo GADIES APK Build Script
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
echo Step 2: Adding Android platform...
call npx @capacitor/cli add android
if %errorlevel% neq 0 (
    echo WARNING: Android platform may already exist, continuing...
)

echo Step 3: Syncing with Android...
call npx @capacitor/cli sync android
if %errorlevel% neq 0 (
    echo ERROR: Capacitor sync failed!
    pause
    exit /b 1
)

echo.
echo Step 4: Building Android project...
cd android
call gradlew assembleDebug
if %errorlevel% neq 0 (
    echo ERROR: Android build failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo BUILD SUCCESSFUL!
echo ========================================
echo.
echo Debug APK location:
echo %cd%\app\build\outputs\apk\debug\app-debug.apk
echo.
echo To build release APK, run:
echo gradlew assembleRelease
echo.
pause
