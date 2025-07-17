import { useState, useCallback } from 'react';
import { BluetoothSerial } from '@/lib/bluetooth';
import { useToast } from '@/hooks/use-toast';

export interface ClassicBluetoothDevice {
  address: string;
  name: string;
  connected?: boolean;
}

export function useClassicBluetooth() {
  const [devices, setDevices] = useState<ClassicBluetoothDevice[]>([]);
  const [currentDevice, setCurrentDevice] = useState<ClassicBluetoothDevice | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const scanDevices = useCallback(async () => {
    setIsScanning(true);
    setError(null);
    try {
      const permission = await BluetoothSerial.requestPermissions();
      if (!permission.granted) {
        throw new Error('Bluetooth permission not granted');
      }
      await BluetoothSerial.enable();
      const result = await BluetoothSerial.list();
      setDevices(result.devices);
      toast({
        title: "Scan Complete",
        description: `Found ${result.devices.length} paired devices`,
      });
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : 'Scan failed';
      setError(errorMsg);
      toast({
        title: "Scan Failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  }, [toast]);

  const connectDevice = useCallback(async (address: string) => {
    setIsConnecting(true);
    setError(null);
    try {
      await BluetoothSerial.connect({ address });
      setIsConnected(true);

      // Initialize ELM327 device
      await sendCommand('ATZ'); // Reset device
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for reset
      await sendCommand('ATE0'); // Echo off
      await sendCommand('ATL0'); // Linefeeds off
      await sendCommand('ATSP0'); // Set protocol to auto

      const device = devices.find(d => d.address === address);
      if (device) {
        setCurrentDevice({ ...device, connected: true });
        setDevices(prev => prev.map(d => 
          d.address === address ? { ...d, connected: true } : { ...d, connected: false }
        ));
      }
      toast({
        title: "Connected",
        description: `Successfully initialized ${device?.name || address}`,
      });
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : 'Connection failed';
      setError(errorMsg);
      toast({
        title: "Connection Failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  }, [devices, toast]);

  const disconnect = useCallback(async () => {
    try {
      await BluetoothSerial.disconnect();
      setIsConnected(false);
      setCurrentDevice(null);
      toast({
        title: "Disconnected",
        description: "Disconnected from ELM327 device",
      });
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : 'Disconnect failed';
      console.error('Disconnect error:', errorMsg);
      toast({
        title: "Disconnect Failed",
        description: errorMsg,
        variant: "destructive",
      });
    }
  }, [toast]);

  const sendCommand = useCallback(async (command: string): Promise<string> => {
    if (!isConnected) {
      throw new Error('Not connected to a device.');
    }
    try {
      await BluetoothSerial.write({ value: command + '\r' });
      const result = await BluetoothSerial.read({ delimiter: '>' });
      return result.value.trim();
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : 'Failed to send command';
      console.error('SendCommand Error:', errorMsg);
      throw new Error(errorMsg);
    }
  }, [isConnected]);

  return { 
    devices, 
    currentDevice,
    isScanning, 
    isConnecting, 
    isConnected,
    error, 
    scanDevices, 
    connectDevice,
    disconnect,
    sendCommand
  };
}
