import { Capacitor } from '@capacitor/core';

// This is the mock implementation for the web environment (npm run dev)
const mockBluetoothSerial = {
  requestPermissions: async () => ({ granted: true }),
  enable: async () => console.log('Mock Bluetooth enabled'),
  list: async () => {
    console.log('Scanning for mock devices...');
    return { devices: [{ name: 'ELM327-Web-Mock', address: 'MOCK-ADDRESS-123' }] };
  },
  connect: async ({ address }: { address: string }) => console.log(`Mock connecting to ${address}`),
  disconnect: async () => console.log('Mock disconnected'),
  write: async ({ value }: { value: string }) => console.log(`Mock writing: ${value}`),
  read: async () => ({ value: 'OK >' }),
  isConnected: async () => ({ connected: false }),
};

let finalBluetoothSerial;

if (Capacitor.isNativePlatform()) {
  // On native, we can safely import the real plugin.
  finalBluetoothSerial = require('@capacitor-community/bluetooth-serial').BluetoothSerial;
} else {
  // On web, we return the mock.
  finalBluetoothSerial = mockBluetoothSerial;
}

export const BluetoothSerial = finalBluetoothSerial;
