# Install Java untuk Build APK GADIES

## Langkah 1: Download dan Install JDK

1. **Download JDK 11 atau 17** (recommended untuk Android):
   - Oracle JDK: https://www.oracle.com/java/technologies/downloads/
   - OpenJDK: https://adoptium.net/temurin/releases/
   - Atau gunakan Chocolatey: `choco install openjdk11`

2. **Install JDK** dengan mengikuti wizard installer

## Langkah 2: Set Environment Variables

1. **Set JAVA_HOME:**
   ```cmd
   setx JAVA_HOME "C:\Program Files\Java\jdk-11.0.x"
   ```

2. **Add to PATH:**
   ```cmd
   setx PATH "%PATH%;%JAVA_HOME%\bin"
   ```

3. **Restart PowerShell/Command Prompt**

## Langkah 3: Verify Installation

```cmd
java -version
javac -version
```

## Langkah 4: Build APK

```cmd
cd android
.\gradlew assembleDebug
```

## Alternative: Use Android Studio

1. Open Android Studio
2. Open project: `C:\project\ertiga-diesel-insights-hub\android`
3. Build > Build Bundle(s) / APK(s) > Build APK(s)
4. APK akan tersedia di: `app\build\outputs\apk\debug\app-debug.apk`
