Write-Host "Setting up Cordova environment..."

# Set up environment
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:Path += ";$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\emulator"

# Install Cordova
Write-Host "Installing Cordova..."
npm install -g cordova

# Create Cordova project
Write-Host "Creating Cordova project..."
New-Item -ItemType Directory -Path "cordova-app" -Force
Set-Location cordova-app
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
Copy-Item -Path "..\dist\*" -Destination "www" -Recurse -Force

# Update config.xml
Write-Host "Updating config.xml..."
$configPath = "config.xml"
$configContent = Get-Content $configPath -Raw
$configContent = $configContent -replace '</widget>', @"
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
</widget>
"@

$configContent | Set-Content $configPath -Encoding UTF8

# Build project
Write-Host "Building project..."
cordova build android

Write-Host "Build completed! APK should be located in: platforms\android\app\build\outputs\apk\debug\app-debug.apk"
