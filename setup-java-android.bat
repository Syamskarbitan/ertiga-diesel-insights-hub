@echo off

:: Set up Java environment
echo Setting up Java environment...
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%

:: Verify Java installation
echo Verifying Java installation...
java -version

:: Set up Android environment
echo Setting up Android environment...
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%ANDROID_HOME%\emulator

:: Verify Android SDK installation
echo Verifying Android SDK installation...
adb version

:: Set up Gradle environment
echo Setting up Gradle environment...
set GRADLE_HOME=%LOCALAPPDATA%\Android\Android Studio\jbr
echo JAVA_HOME=%JAVA_HOME% > gradle.properties
echo org.gradle.java.home=%JAVA_HOME% >> gradle.properties

:: Clean and rebuild project
echo Cleaning and rebuilding project...
cd android
gradlew clean
gradlew assembleDebug

:: Verify build
echo Build completed! APK should be located in:
echo android\app\build\outputs\apk\debug\app-debug.apk

pause
