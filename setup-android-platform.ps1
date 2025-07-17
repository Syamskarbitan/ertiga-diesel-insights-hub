Write-Host "Setting up Android platform..."

# Set up environment
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:Path += ";$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\emulator"

# Initialize Capacitor
Write-Host "Initializing Capacitor..."
npx cap init GADIES com.gadies.obdii

# Add Android platform with Cordova
Write-Host "Adding Android platform with Cordova..."
npx cap add android --cordova

# Copy web assets
Write-Host "Copying web assets..."
npx cap copy android

# Sync project
Write-Host "Syncing project..."
npx cap sync android

# Update Android configuration
Write-Host "Updating Android configuration..."

# Update Android manifest
$manifestPath = "android\app\src\main\AndroidManifest.xml"
$manifestContent = Get-Content $manifestPath -Raw
$manifestContent = $manifestContent -replace '</manifest>', @"
    <uses-permission android:name="android.permission.BLUETOOTH" />
    <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.BLUETOOTH_SCAN" android:usesPermissionFlags="neverForLocation" />
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
    <uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE" />
</manifest>
"@

$manifestContent | Set-Content $manifestPath -Encoding UTF8

# Update app build.gradle
$buildGradlePath = "android\app\build.gradle"
$buildGradleContent = Get-Content $buildGradlePath -Raw
$buildGradleContent = $buildGradleContent -replace 'compileSdk rootProject.ext.compileSdkVersion', 'compileSdkVersion 33'
$buildGradleContent = $buildGradleContent -replace 'minSdkVersion rootProject.ext.minSdkVersion', 'minSdkVersion 21'
$buildGradleContent = $buildGradleContent -replace 'targetSdkVersion rootProject.ext.targetSdkVersion', 'targetSdkVersion 33'

$buildGradleContent | Set-Content $buildGradlePath -Encoding UTF8

# Build project
Write-Host "Building project..."
Set-Location android
./gradlew clean
./gradlew assembleDebug

Write-Host "Build completed! APK should be located in: android\app\build\outputs\apk\debug\app-debug.apk"
