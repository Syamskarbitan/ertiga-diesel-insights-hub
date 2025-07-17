$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:Path += ";$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\emulator"

# Install Cordova globally
Write-Host "Installing Cordova..."
npm install -g cordova

# Create Cordova project
Write-Host "Creating Cordova project..."
cordova create . com.gadies.obdii GADIES

# Add Android platform
Write-Host "Adding Android platform..."
cordova platform add android

# Add Bluetooth plugin
Write-Host "Adding Bluetooth plugin..."
cordova plugin add cordova-plugin-bluetooth-le

# Copy web assets
Write-Host "Copying web assets..."
Copy-Item -Path "..\dist\*" -Destination "www" -Recurse -Force

# Build project
Write-Host "Building project..."
cordova build android

Write-Host "Build completed! APK should be located in: platforms\android\app\build\outputs\apk\debug\app-debug.apk"
