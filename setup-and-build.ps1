$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:Path += ";$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\emulator"

# Install Gradle
Write-Host "Installing Gradle..."
if (-not (Test-Path "C:\Program Files\Gradle")) {
    New-Item -ItemType Directory -Path "C:\Program Files\Gradle" -Force
}

# Download and extract Gradle
$gradleVersion = "7.0.4"
$gradleUrl = "https://services.gradle.org/distributions/gradle-$gradleVersion-bin.zip"
$gradleZip = "C:\Program Files\Gradle\gradle.zip"
$gradleDir = "C:\Program Files\Gradle\gradle-$gradleVersion"

Write-Host "Downloading Gradle..."
Invoke-WebRequest -Uri $gradleUrl -OutFile $gradleZip

Write-Host "Extracting Gradle..."
Expand-Archive -Path $gradleZip -DestinationPath "C:\Program Files\Gradle" -Force

# Add Gradle to PATH
$env:Path += ";C:\Program Files\Gradle\gradle-$gradleVersion\bin"

# Create project directory
Write-Host "Creating project directory..."
New-Item -ItemType Directory -Path "gadies-cordova-final" -Force
Set-Location "gadies-cordova-final"

# Create Cordova project
Write-Host "Creating Cordova project..."
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

# Copy web assets
Write-Host "Copying web assets..."
Copy-Item -Path "..\..\dist\*" -Destination "www" -Recurse -Force

# Build project
Write-Host "Building project..."
cordova build android

Write-Host "Setup and build completed! APK should be located in: platforms\android\app\build\outputs\apk\debug\app-debug.apk"
