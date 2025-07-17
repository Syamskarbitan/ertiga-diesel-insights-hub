$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:Path += ";$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\emulator"

Write-Host "Creating project directory..."
New-Item -ItemType Directory -Path "gadies-cordova-simple" -Force
Set-Location "gadies-cordova-simple"

Write-Host "Creating Cordova project..."
cordova create . com.gadies.obdii GADIES

Write-Host "Adding Android platform..."
cordova platform add android

Write-Host "Adding plugins..."
cordova plugin add cordova-plugin-bluetooth-le
cordova plugin add cordova-plugin-whitelist
cordova plugin add cordova-plugin-battery-status
cordova plugin add cordova-plugin-ble-central
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-statusbar

Write-Host "Copying web assets..."
Copy-Item -Path "..\..\dist\*" -Destination "www" -Recurse -Force

Write-Host "Building project..."
cordova build android

Write-Host "Setup completed!"
