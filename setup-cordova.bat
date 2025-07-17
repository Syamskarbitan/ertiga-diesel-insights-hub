@echo off
echo Creating project directory structure...
mkdir gadies-cordova-final
cd gadies-cordova-final
mkdir www
mkdir platforms
mkdir plugins

echo Copying web assets...
xcopy /E /I /Y ..\dist\* www\

echo Creating config.xml...
echo ^<?xml version='1.0' encoding='UTF-8'^?^> > config.xml
echo ^<widget id="com.gadies.obdii" version="1.0.0" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0"^> >> config.xml
echo     ^<name^>GADIES^</name^> >> config.xml
echo     ^<description^>GADIES - Ertiga Diesel Diagnostic Tool^</description^> >> config.xml
echo     ^<author email="contact@gadies.com" href="https://gadies.com"^> >> config.xml
echo         GADIES Team >> config.xml
echo     ^</author^> >> config.xml
echo     ^<content src="index.html" /^> >> config.xml
echo     ^<access origin="*" /^> >> config.xml
echo     ^<allow-navigation href="*" /^> >> config.xml
echo     ^<allow-intent href="*" /^> >> config.xml
echo     ^<preference name="DisallowOverscroll" value="true" /^> >> config.xml
echo     ^<preference name="android-minSdkVersion" value="21" /^> >> config.xml
echo     ^<preference name="android-targetSdkVersion" value="33" /^> >> config.xml
echo     ^<preference name="android-compileSdkVersion" value="33" /^> >> config.xml
echo     ^<preference name="android-buildToolsVersion" value="33.0.0" /^> >> config.xml
echo     ^<preference name="android-gradlePluginVersion" value="7.0.4" /^> >> config.xml
echo     ^<feature name="BluetoothLe"^> >> config.xml
echo         ^<param name="android-package" value="cordova-plugin-bluetooth-le" /^> >> config.xml
echo     ^</feature^> >> config.xml
echo     ^<plugin name="cordova-plugin-bluetooth-le" /^> >> config.xml
echo     ^<plugin name="cordova-plugin-whitelist" /^> >> config.xml
echo     ^<plugin name="cordova-plugin-battery-status" /^> >> config.xml
echo     ^<plugin name="cordova-plugin-ble-central" /^> >> config.xml
echo     ^<plugin name="cordova-plugin-device" /^> >> config.xml
echo     ^<plugin name="cordova-plugin-statusbar" /^> >> config.xml
echo ^</widget^> >> config.xml

echo Creating package.json...
echo { >> package.json
echo     "name": "gadies-app", >> package.json
echo     "version": "1.0.0", >> package.json
echo     "description": "GADIES - Ertiga Diesel Diagnostic Tool", >> package.json
echo     "dependencies": { >> package.json
echo         "cordova-android": "^11.0.0", >> package.json
echo         "cordova-plugin-bluetooth-le": "^4.6.0", >> package.json
echo         "cordova-plugin-whitelist": "^1.3.5", >> package.json
echo         "cordova-plugin-battery-status": "^3.0.0", >> package.json
echo         "cordova-plugin-ble-central": "^1.5.1", >> package.json
echo         "cordova-plugin-device": "^2.0.3", >> package.json
echo         "cordova-plugin-statusbar": "^2.4.3" >> package.json
echo     } >> package.json
echo } >> package.json

echo Installing Cordova globally...
set JAVA_HOME=C:\Program Files\Java\jdk-17
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%ANDROID_HOME%\emulator;%PATH%
npm install -g cordova

echo Initializing Cordova project...
cordova create . com.gadies.obdii GADIES

echo Adding Android platform...
cordova platform add android

echo Adding plugins...
cordova plugin add cordova-plugin-bluetooth-le
cordova plugin add cordova-plugin-whitelist
cordova plugin add cordova-plugin-battery-status
cordova plugin add cordova-plugin-ble-central
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-statusbar

echo Cleaning and building project...
cordova clean
cordova build android

echo Setup completed!
