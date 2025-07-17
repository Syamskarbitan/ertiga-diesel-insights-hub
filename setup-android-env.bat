@echo off

:: Set Android environment variables
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%ANDROID_HOME%\emulator

:: Start Android Studio
call "%LOCALAPPDATA%\Android\Android Studio\bin\studio64.exe"
