Write-Host "Setting up Android environment..."

# Set environment variables
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:Path += ";$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\emulator"

# Create Android project structure
Write-Host "Creating Android project structure..."
New-Item -ItemType Directory -Path "platforms\android" -Force

# Copy Android template files
Write-Host "Copying Android template files..."
Copy-Item -Path "C:\Users\$env:USERNAME\AppData\Roaming\npm\node_modules\cordova-android\bin\templates\project\*" -Destination "platforms\android" -Recurse -Force

# Update Android configuration
Write-Host "Updating Android configuration..."
$manifestPath = "platforms\android\app\src\main\AndroidManifest.xml"
$manifestContent = @"
<?xml version='1.0' encoding='utf-8'?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <supports-screens
        android:largeScreens="true"
        android:normalScreens="true"
        android:smallScreens="true"
        android:xlargeScreens="true"
        android:resizeable="true"
        android:anyDensity="true" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.BLUETOOTH" />
    <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.BLUETOOTH_SCAN" android:usesPermissionFlags="neverForLocation" />
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
    <uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE" />
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        <activity
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:label="@string/app_name"
            android:launchMode="singleTop"
            android:name="MainActivity"
            android:theme="@style/LaunchTheme"
            android:windowSoftInputMode="adjustResize">
            <intent-filter android:label="@string/launcher_name">
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
"@

$manifestContent | Set-Content $manifestPath -Encoding UTF8

# Update build.gradle
$buildGradlePath = "platforms\android\app\build.gradle"
$buildGradleContent = @"
apply plugin: 'com.android.application'

android {
    namespace "com.gadies.obdii"
    compileSdkVersion 33
    defaultConfig {
        applicationId "com.gadies.obdii"
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        aaptOptions {
            ignoreAssetsPattern '!.svn:!.git:!.ds_store:!*.scc:.*:!CVS:!thumbs.db:!picasa.ini:!*~'
        }
    }
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    implementation fileTree(include: ['*.jar'], dir: 'libs')
    implementation "androidx.appcompat:appcompat:1.6.1"
    implementation "androidx.core:core-ktx:1.10.1"
    implementation project(':capacitor-android')
}
"@

$buildGradleContent | Set-Content $buildGradlePath -Encoding UTF8

Write-Host "Project setup completed! Now you can run:"
Write-Host "1. cd platforms\android"
Write-Host "2. ./gradlew clean"
Write-Host "3. ./gradlew assembleDebug"
