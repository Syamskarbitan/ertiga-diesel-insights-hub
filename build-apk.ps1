$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:Path += ";$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\emulator"

# Navigate to project directory
Write-Host "Navigating to project directory..."
Set-Location "gadies-cordova-android"

# Clean project
Write-Host "Cleaning project..."
cordova clean

# Build debug APK
Write-Host "Building debug APK..."
cordova build android

# Build release APK
Write-Host "Building release APK..."
cordova build android --release

# Check if APKs were generated
$debugApkPath = "platforms\android\app\build\outputs\apk\debug\app-debug.apk"
$releaseApkPath = "platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk"

if (Test-Path $debugApkPath) {
    Write-Host "Debug APK generated successfully: $debugApkPath"
}

if (Test-Path $releaseApkPath) {
    Write-Host "Release APK generated successfully: $releaseApkPath"
}

Write-Host "Build process completed!"
