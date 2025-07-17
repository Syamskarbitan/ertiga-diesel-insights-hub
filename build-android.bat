@echo off

:: Build the web assets
npm run build

:: Copy web assets to Android
npx cap copy android

:: Open Android Studio
call gradlew.bat openAndroidStudio

:: Build and run the app
call gradlew.bat assembleDebug

:: Clean up
echo Build complete! The APK is located in android/app/build/outputs/apk/debug/
