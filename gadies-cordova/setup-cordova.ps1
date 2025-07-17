$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:Path += ";$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\emulator"

# Create required directories
Write-Host "Creating project structure..."
New-Item -ItemType Directory -Path "platforms" -Force
New-Item -ItemType Directory -Path "plugins" -Force
New-Item -ItemType Directory -Path "www" -Force

# Copy web assets
Write-Host "Copying web assets..."
Copy-Item -Path "..\dist\*" -Destination "www" -Recurse -Force

# Create package.json
Write-Host "Creating package.json..."
$packageJson = @"
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

$packageJson | Set-Content package.json -Encoding UTF8

# Create cordova.js
Write-Host "Creating cordova.js..."
$cordovaJs = @"
// Cordova bridge initialization code here
var cordova = {
    initialize: function() {
        // Initialize Cordova plugins
    },
    plugins: {
        bluetoothle: {
            startScan: function() {},
            connect: function() {},
            stopScan: function() {}
        }
    }
};
"@

$cordovaJs | Set-Content www\cordova.js -Encoding UTF8

Write-Host "Project setup completed! Now you can run:"
Write-Host "1. cordova platform add android"
Write-Host "2. cordova build android"
Write-Host "3. cordova run android"
