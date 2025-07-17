@echo off
set JAVA_HOME=C:\Program Files\Java\jdk-17
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%ANDROID_HOME%\emulator;%PATH%

echo Setting up environment...
echo JAVA_HOME: %JAVA_HOME%
echo ANDROID_HOME: %ANDROID_HOME%

echo Navigating to project directory...
cd gadies-cordova-simple

echo Cleaning project...
cordova clean

echo Building Android...
cordova build android

echo Build completed! APK should be located in: platforms\android\app\build\outputs\apk\debug\app-debug.apk
