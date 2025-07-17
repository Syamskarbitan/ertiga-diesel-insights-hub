$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:Path += ";$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\emulator"

# Install Cordova globally
Write-Host "Installing Cordova..."
npm install -g cordova

# Create Cordova project
Write-Host "Creating Cordova project..."
cd ..
cordova create gadies-cordova-new com.gadies.obdii GADIES
cd gadies-cordova-new

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
xcopy /E /I /Y ..\dist\* www\

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

# Build project
Write-Host "Building project..."
cordova build android

Write-Host "Build completed! APK should be located in: platforms\android\app\build\outputs\apk\debug\app-debug.apk"
