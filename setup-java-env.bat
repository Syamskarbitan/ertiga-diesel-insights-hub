@echo off

:: Set Java environment variables
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%PATH%;%JAVA_HOME%\bin

:: Set Android environment variables
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%ANDROID_HOME%\emulator

:: Verify setup
echo Java version:
java -version
echo Android SDK location:
echo %ANDROID_HOME%
