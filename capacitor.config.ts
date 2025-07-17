import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gadies.ertigadieselinsights',
  appName: 'ertiGA-DiESel Jatim by Samsul',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  },
  plugins: {
    BluetoothLe: {
      displayStrings: {
        scanning: "Scanning for ELM327 devices...",
        cancel: "Cancel",
        availableDevices: "Available ELM327 Devices",
        noDeviceFound: "No ELM327 devices found"
      }
    },
    BluetoothSerial: {
      connectTimeout: 10000,
      readTimeout: 5000,
      writeTimeout: 5000,
      delimiter: "\r\n"
    },
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#FFC107",
      androidSplashResourceName: "splash",
      showSpinner: true,
      spinnerColor: "#ffffff",
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#FFC107"
    },
    Keyboard: {
      resize: "body",
      style: "DARK",
      resizeOnFullScreen: true
    }
  }
};

export default config;
