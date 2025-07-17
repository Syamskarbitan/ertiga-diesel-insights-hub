@echo off

:: Set up environment
echo Setting up environment...
set JAVA_HOME=C:\Program Files\Java\jdk-17
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%ANDROID_HOME%\emulator;%PATH%

:: Install Cordova
echo Installing Cordova...
npm install -g cordova

:: Create Cordova project
echo Creating Cordova project...
cordova create . com.gadies.obdii GADIES

:: Add Android platform
echo Adding Android platform...
cordova platform add android

:: Add plugins
echo Adding plugins...
cordova plugin add cordova-plugin-bluetooth-le
cordova plugin add cordova-plugin-whitelist
cordova plugin add cordova-plugin-battery-status
cordova plugin add cordova-plugin-ble-central
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-statusbar

:: Copy web assets
echo Copying web assets...
xcopy /E /I /Y ..\dist\* www\

:: Update config.xml
echo Updating config.xml...
set CONFIG_FILE=config.xml
set TEMP_FILE=config.temp.xml

(echo ^<?xml version='1.0' encoding='UTF-8'^?^>) > %TEMP_FILE%
(echo ^<widget id="com.gadies.obdii" version="1.0.0" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0"^>) >> %TEMP_FILE%
(echo     ^<name^>GADIES^</name^>) >> %TEMP_FILE%
(echo     ^<description^>GADIES - Ertiga Diesel Diagnostic Tool^</description^>) >> %TEMP_FILE%
(echo     ^<author email="contact@gadies.com" href="https://gadies.com"^>) >> %TEMP_FILE%
(echo         GADIES Team^</author^>) >> %TEMP_FILE%
(echo     ^<content src="index.html" /^>) >> %TEMP_FILE%
(echo     ^<access origin="*" /^>) >> %TEMP_FILE%
(echo     ^<allow-navigation href="*" /^>) >> %TEMP_FILE%
(echo     ^<allow-intent href="*" /^>) >> %TEMP_FILE%
(echo     ^<preference name="DisallowOverscroll" value="true" /^>) >> %TEMP_FILE%
(echo     ^<preference name="android-minSdkVersion" value="21" /^>) >> %TEMP_FILE%
(echo     ^<preference name="android-targetSdkVersion" value="33" /^>) >> %TEMP_FILE%
(echo     ^<preference name="android-compileSdkVersion" value="33" /^>) >> %TEMP_FILE%
(echo     ^<preference name="android-buildToolsVersion" value="33.0.0" /^>) >> %TEMP_FILE%
(echo     ^<preference name="android-gradlePluginVersion" value="7.0.4" /^>) >> %TEMP_FILE%
(echo     ^<feature name="BluetoothLe"^>) >> %TEMP_FILE%
(echo         ^<param name="android-package" value="cordova-plugin-bluetooth-le" /^>) >> %TEMP_FILE%
(echo     ^</feature^>) >> %TEMP_FILE%
(echo     ^<plugin name="cordova-plugin-bluetooth-le" /^>) >> %TEMP_FILE%
(echo     ^<plugin name="cordova-plugin-whitelist" /^>) >> %TEMP_FILE%
(echo     ^<plugin name="cordova-plugin-battery-status" /^>) >> %TEMP_FILE%
(echo     ^<plugin name="cordova-plugin-ble-central" /^>) >> %TEMP_FILE%
(echo     ^<plugin name="cordova-plugin-device" /^>) >> %TEMP_FILE%
(echo     ^<plugin name="cordova-plugin-statusbar" /^>) >> %TEMP_FILE%
(echo ^</widget^>) >> %TEMP_FILE%

del %CONFIG_FILE%
move %TEMP_FILE% %CONFIG_FILE%

:: Build project
echo Building project...
cordova build android

:: Show build location
echo Build completed! APK should be located in: platforms\android\app\build\outputs\apk\debug\app-debug.apk

pause
