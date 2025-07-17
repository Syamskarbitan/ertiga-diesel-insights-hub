$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:Path += ";$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\emulator"

# Create project directory
Write-Host "Creating project directory..."
New-Item -ItemType Directory -Path "gadies-cordova-final" -Force
Set-Location "gadies-cordova-final"

# Create project structure
Write-Host "Creating project structure..."
New-Item -ItemType Directory -Path "www" -Force
New-Item -ItemType Directory -Path "platforms" -Force
New-Item -ItemType Directory -Path "plugins" -Force

# Copy web assets
Write-Host "Copying web assets..."
Copy-Item -Path "..\..\dist\*" -Destination "www" -Recurse -Force

# Create config.xml
Write-Host "Creating config.xml..."
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

$configContent | Set-Content config.xml -Encoding UTF8

# Create package.json
Write-Host "Creating package.json..."
$packageContent = @"
{
    "name": "gadies-app",
    "version": "1.0.0",
    "description": "GADIES - Ertiga Diesel Diagnostic Tool",
    "dependencies": {
        "cordova-android": "^11.0.0",
        "cordova-plugin-bluetooth-le": "^4.6.0",
        "cordova-plugin-whitelist": "^1.3.5",
        "cordova-plugin-battery-status": "^3.0.0",
        "cordova-plugin-ble-central": "^1.5.1",
        "cordova-plugin-device": "^2.0.3",
        "cordova-plugin-statusbar": "^2.4.3"
    }
}
"@

$packageContent | Set-Content package.json -Encoding UTF8

# Install Cordova globally
Write-Host "Installing Cordova..."
npm install -g cordova

# Initialize Cordova project
Write-Host "Initializing Cordova project..."
cordova create . com.gadies.obdii GADIES

# Add Android platform
Write-Host "Adding Android platform..."
cordova platform add android

# Add plugins
Write-Host "Adding plugins..."
cordova plugin add cordova-plugin-bluetooth-le
cordova plugin add cordova-plugin-whitelist
cordova plugin add cordova-plugin-battery-status
cordova plugin add cordova-plugin-ble-central
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-statusbar

# Clean and build project
Write-Host "Cleaning and building project..."
cordova clean
cordova build android

Write-Host "Setup completed!"
