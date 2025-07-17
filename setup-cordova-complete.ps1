$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:Path += ";$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\emulator"

# Create project directory
Write-Host "Creating project directory..."
New-Item -ItemType Directory -Path "gadies-cordova-final" -Force
Set-Location "gadies-cordova-final"

# Install Cordova
Write-Host "Installing Cordova..."
npm install -g cordova

# Create Cordova project
Write-Host "Creating Cordova project..."
cordova create . com.gadies.obdii GADIES

# Add Android platform
Write-Host "Adding Android platform..."
cordova platform add android

# Add required plugins
Write-Host "Adding plugins..."
cordova plugin add cordova-plugin-bluetooth-le
cordova plugin add cordova-plugin-whitelist
cordova plugin add cordova-plugin-battery-status
cordova plugin add cordova-plugin-ble-central
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-statusbar

# Copy web assets
Write-Host "Copying web assets..."
Copy-Item -Path "..\..\dist\*" -Destination "www" -Recurse -Force

# Update config.xml
Write-Host "Updating config.xml..."
$configPath = "config.xml"
$configContent = @"
<?xml version='1.0' encoding='UTF-8'?>
<widget id="com.gadies.obdii" version="1.0.0" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
    <name>GADIES</name>
    <description>GADIES - Ertiga Diesel Diagnostic Tool</description>
    <author email="contact@gadies.com" href="https://gadies.com">
        GADIES Team
    </author>
    <content src="index.html" />
    <access origin="*" />
    <allow-navigation href="*" />
    <allow-intent href="*" />
    <preference name="DisallowOverscroll" value="true" />
    <preference name="android-minSdkVersion" value="21" />
    <preference name="android-targetSdkVersion" value="33" />
    <preference name="android-compileSdkVersion" value="33" />
    <preference name="android-buildToolsVersion" value="33.0.0" />
    <preference name="android-gradlePluginVersion" value="7.0.4" />
    <feature name="BluetoothLe">
        <param name="android-package" value="cordova-plugin-bluetooth-le" />
    </feature>
    <plugin name="cordova-plugin-bluetooth-le" />
    <plugin name="cordova-plugin-whitelist" />
    <plugin name="cordova-plugin-battery-status" />
    <plugin name="cordova-plugin-ble-central" />
    <plugin name="cordova-plugin-device" />
    <plugin name="cordova-plugin-statusbar" />
</widget>
"@

$configContent | Set-Content $configPath -Encoding UTF8

# Update Android manifest
Write-Host "Updating Android manifest..."
$manifestPath = "platforms\android\app\src\main\AndroidManifest.xml"
$manifestContent = @"
<?xml version='1.0' encoding='utf-8'?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <supports-screens
        android:largeScreens="true"
        android:normalScreens="true"
        android:smallScreens="true"
        android:xlargeScreens="true"
        android:resizeable="true"
        android:anyDensity="true" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.BLUETOOTH" />
    <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.BLUETOOTH_SCAN" android:usesPermissionFlags="neverForLocation" />
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
    <uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE" />
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        <activity
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:label="@string/app_name"
            android:launchMode="singleTop"
            android:name="MainActivity"
            android:theme="@style/LaunchTheme"
            android:windowSoftInputMode="adjustResize">
            <intent-filter android:label="@string/launcher_name">
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
"@

$manifestContent | Set-Content $manifestPath -Encoding UTF8

# Build project
Write-Host "Building project..."
cordova build android

# Run on emulator
Write-Host "Running on emulator..."
cordova run android

Write-Host "Setup completed! APK should be located in: platforms\android\app\build\outputs\apk\debug\app-debug.apk"
