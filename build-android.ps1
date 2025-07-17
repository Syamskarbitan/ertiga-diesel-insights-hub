#!/usr/bin/env pwsh
# GADIES Android Build Script - PowerShell Version
# Created for ertiGA-DiESel Jatim by Samsul

Write-Host "========================================" -ForegroundColor Yellow
Write-Host "GADIES Android Build Script" -ForegroundColor Yellow
Write-Host "ertiGA-DiESel Jatim by Samsul" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

# Set Java and Android environment variables
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
if (Test-Path $env:LOCALAPPDATA\Android\Sdk) {
    $env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
} else {
    $env:ANDROID_HOME = "$env:USERPROFILE\AppData\Local\Android\Sdk"
}

Write-Host "Step 1: Building web assets..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Web build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Syncing with Android..." -ForegroundColor Cyan
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Capacitor sync failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 3: Building Android project..." -ForegroundColor Cyan
Set-Location android
./gradlew assembleDebug
if ($LASTEXITCODE -ne 0) {
    Set-Location ..
    Write-Host "ERROR: Android build failed!" -ForegroundColor Red
    exit 1
}

Set-Location ..
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "BUILD SUCCESSFUL!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Debug APK location:" -ForegroundColor Yellow
Write-Host "$((Get-Location).Path)\android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor Yellow
Write-Host ""
Write-Host "To build release APK, run:" -ForegroundColor Cyan
Write-Host "cd android && ./gradlew assembleRelease" -ForegroundColor Cyan
Write-Host ""