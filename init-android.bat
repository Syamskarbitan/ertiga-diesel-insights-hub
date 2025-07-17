@echo off

:: Set up Java environment
echo Setting up Java environment...
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%

:: Set up Android environment
echo Setting up Android environment...
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%ANDROID_HOME%\emulator

:: Initialize Capacitor
echo Initializing Capacitor...
npx cap init GADIES com.gadies.obdii

:: Add Android platform
echo Adding Android platform...
npx cap add android

:: Copy web assets
echo Copying web assets...
npx cap copy android

:: Sync project
echo Syncing project...
npx cap sync android

:: Clean and rebuild project
echo Cleaning and rebuilding project...
cd android
gradlew clean
gradlew assembleDebug

:: Verify build
echo Build completed! APK should be located in:
echo android\app\build\outputs\apk\debug\app-debug.apk

pause
