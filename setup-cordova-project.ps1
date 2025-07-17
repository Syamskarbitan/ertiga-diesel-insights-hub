Write-Host "Setting up Cordova project..."

# Create Cordova project structure
New-Item -ItemType Directory -Path "cordova-app" -Force
Set-Location cordova-app

# Initialize Cordova project
Write-Host "Initializing Cordova project..."
Write-Host "<?xml version='1.0' encoding='UTF-8'?>" | Out-File -FilePath config.xml -Encoding UTF8
Add-Content -Path config.xml @"
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

# Create www directory and copy web assets
New-Item -ItemType Directory -Path "www" -Force
Copy-Item -Path "..\dist\*" -Destination "www" -Recurse -Force

# Create platforms directory
New-Item -ItemType Directory -Path "platforms" -Force

Write-Host "Project setup completed! Now you can run:"
Write-Host "1. cordova platform add android"
Write-Host "2. cordova build android"
Write-Host "3. cordova run android"
