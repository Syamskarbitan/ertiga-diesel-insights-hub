@echo off

:: Set up Java environment
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%PATH%;%JAVA_HOME%\bin

:: Set up Android environment
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%ANDROID_HOME%\emulator

:: Verify Java installation
echo Verifying Java installation...
java -version

:: Verify Android SDK installation
echo Verifying Android SDK installation...
adb version

:: Create environment variables file
echo JAVA_HOME=%JAVA_HOME% > .env
echo ANDROID_HOME=%ANDROID_HOME% >> .env

:: Start Android Studio
echo Starting Android Studio...
start "" "%LOCALAPPDATA%\Android\Android Studio\bin\studio64.exe"

:: Wait for Android Studio to open
timeout /t 10

:: Open SDK Manager in Android Studio
echo Opening SDK Manager...
adb shell am start -n com.android.sdkmanager/.MainActivity

:: Wait for SDK Manager to open
timeout /t 5

:: Verify setup completed
echo Environment setup completed!
echo Please ensure the following are installed in SDK Manager:
echo - Android 13 (API 33)
echo - Android SDK Platform-Tools
echo - Android SDK Build-Tools
echo - Android Emulator
echo - Android SDK Tools

pause
