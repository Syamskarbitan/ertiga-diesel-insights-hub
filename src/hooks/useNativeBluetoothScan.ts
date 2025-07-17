import { useState } from 'react';
import { BleClient, BleDevice } from '@capacitor-community/bluetooth-le';
import { requestBluetoothPermissions } from './useBluetoothPermissions';

export function useNativeBluetoothScan() {
  const [devices, setDevices] = useState<BleDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scanDevices = async () => {
    setIsScanning(true);
    setError(null);
    setDevices([]);
    try {
      await requestBluetoothPermissions();
      await BleClient.initialize();
      const found: BleDevice[] = [];
      await BleClient.requestLEScan({ services: [] }, (result) => {
        if (result.device && !found.find(d => d.deviceId === result.device.deviceId)) {
          found.push(result.device);
          setDevices([...found]);
        }
      });
      setTimeout(async () => {
        await BleClient.stopLEScan();
        setIsScanning(false);
      }, 5000);
    } catch (e: any) {
      setError(e.message || 'Scan failed');
      setIsScanning(false);
    }
  };

  return { devices, isScanning, error, scanDevices };
}
