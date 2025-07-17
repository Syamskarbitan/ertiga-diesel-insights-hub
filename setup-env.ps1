$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:Path += ";$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\emulator"

# Create local environment file
$envContent = @"
JAVA_HOME=$env:JAVA_HOME
ANDROID_HOME=$env:ANDROID_HOME
PATH=$env:Path
"@

$envContent | Out-File -FilePath ".env" -Encoding UTF8

# Verify setup
Write-Host "Java version:"
java -version

Write-Host "Android SDK version:"
adb version

# Set up Gradle environment
$gradleProperties = @"
org.gradle.java.home=$env:JAVA_HOME
"@

$gradleProperties | Out-File -FilePath "android\gradle.properties" -Encoding UTF8

# Build project
Write-Host "Building project..."
Set-Location android
./gradlew clean
./gradlew assembleDebug

Write-Host "Build completed! APK should be located in: android\app\build\outputs\apk\debug\app-debug.apk"
