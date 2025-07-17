Write-Host "Building Android app..."

# Set environment variables
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:Path += ";$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\emulator"

# Add Android platform
Write-Host "Adding Android platform..."
node .\node_modules\cordova\bin\cordova platform add android

# Update Android configuration
Write-Host "Updating Android configuration..."
$androidConfig = "platforms\android\app\src\main\AndroidManifest.xml"
$androidContent = Get-Content $androidConfig -Raw
$androidContent = $androidContent -replace '</manifest>', @"
    <uses-permission android:name="android.permission.BLUETOOTH" />
    <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.BLUETOOTH_SCAN" android:usesPermissionFlags="neverForLocation" />
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
    <uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE" />
</manifest>
"@

$androidContent | Set-Content $androidConfig -Encoding UTF8

# Build project
Write-Host "Building project..."
node .\node_modules\cordova\bin\cordova build android

Write-Host "Build completed! APK should be located in: platforms\android\app\build\outputs\apk\debug\app-debug.apk"
