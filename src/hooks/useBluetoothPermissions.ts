// Native Bluetooth permissions request for Android 12+
export async function requestBluetoothPermissions() {
  if ((window as any).Capacitor?.isNativePlatform) {
    const permissions = [
      'android.permission.BLUETOOTH_SCAN',
      'android.permission.BLUETOOTH_CONNECT',
      'android.permission.ACCESS_FINE_LOCATION'
    ];
    await (window as any).Capacitor.Plugins.Permissions.requestPermissions({ permissions });
  }
}
