$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:Path += ";$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\emulator"

# Create required directories
New-Item -ItemType Directory -Path "platforms" -Force
New-Item -ItemType Directory -Path "plugins" -Force
New-Item -ItemType Directory -Path "www" -Force

# Copy web assets
Write-Host "Copying web assets..."
Copy-Item -Path "..\dist\*" -Destination "www" -Recurse -Force

# Install Cordova
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

# Build project
Write-Host "Building project..."
cordova build android

Write-Host "Build completed! APK should be located in: platforms\android\app\build\outputs\apk\debug\app-debug.apk"
