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
cordova platform add android --save

# Add required plugins
Write-Host "Adding plugins..."
cordova plugin add cordova-plugin-bluetooth-le --save
cordova plugin add cordova-plugin-whitelist --save
cordova plugin add cordova-plugin-battery-status --save
cordova plugin add cordova-plugin-ble-central --save
cordova plugin add cordova-plugin-device --save
cordova plugin add cordova-plugin-statusbar --save

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

# Clean project
Write-Host "Cleaning project..."
cordova clean

# Build project with detailed output
Write-Host "Building project with detailed output..."
cordova build android --verbose

# Check build output
Write-Host "Checking build output..."
if (Test-Path "platforms\android\app\build\outputs\apk\debug\app-debug.apk") {
    Write-Host "Build successful! APK located at: platforms\android\app\build\outputs\apk\debug\app-debug.apk"
} else {
    Write-Host "Build failed. Checking logs..."
    Get-Content "platforms\android\app\build\outputs\logs\build.log" -ErrorAction SilentlyContinue
}

Write-Host "Setup completed!"
