$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:Path += ";$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\emulator"

Write-Host "Environment variables set:"
Write-Host "JAVA_HOME: $env:JAVA_HOME"
Write-Host "ANDROID_HOME: $env:ANDROID_HOME"

Write-Host "Navigating to project directory..."
Set-Location "gadies-cordova-simple"

Write-Host "Cleaning project..."
cordova clean

Write-Host "Building Android..."
cordova build android

Write-Host "Build completed! APK should be located in: platforms\android\app\build\outputs\apk\debug\app-debug.apk"
