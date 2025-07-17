import { useState, useEffect } from 'react';
import { useClassicBluetooth } from './useClassicBluetooth';
import { useWiFiELM327 } from './useWiFiELM327';

export type ConnectionType = 'bluetooth' | 'wifi' | null;

export interface ConnectionManager {
  connectionType: ConnectionType;
  isConnected: boolean;
  currentDevice: any;
  error: string | null;
  disconnect: () => Promise<void>;
  getConnectionStatus: () => string;
}

export function useConnectionManager(): ConnectionManager {
  const bluetoothHook = useClassicBluetooth();
  const wifiHook = useWiFiELM327();
  const [connectionType, setConnectionType] = useState<ConnectionType>(null);

  // Determine active connection type
  useEffect(() => {
    if (bluetoothHook.isConnected) {
      setConnectionType('bluetooth');
    } else if (wifiHook.isConnected) {
      setConnectionType('wifi');
    } else {
      setConnectionType(null);
    }
  }, [bluetoothHook.isConnected, wifiHook.isConnected]);

  const isConnected = bluetoothHook.isConnected || wifiHook.isConnected;
  const currentDevice = bluetoothHook.currentDevice || wifiHook.currentDevice;
  const error = bluetoothHook.error || wifiHook.error;

  const disconnect = async () => {
    if (bluetoothHook.isConnected) {
      await bluetoothHook.disconnect();
    }
    if (wifiHook.isConnected) {
      await wifiHook.disconnect();
    }
  };

  const getConnectionStatus = () => {
    if (!isConnected) return 'Disconnected';
    if (connectionType === 'bluetooth') return `Connected via Bluetooth: ${currentDevice?.name}`;
    if (connectionType === 'wifi') return `Connected via WiFi: ${currentDevice?.name}`;
    return 'Connected';
  };

  return {
    connectionType,
    isConnected,
    currentDevice,
    error,
    disconnect,
    getConnectionStatus
  };
}
