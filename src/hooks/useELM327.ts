import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ELM327Device {
  id: string;
  name: string;
  type: 'bluetooth' | 'wifi';
  connected: boolean;
  lastConnected?: Date;
}

export interface ELM327Config {
  autoConnect: boolean;
  connectionTimeout: number;
  retryAttempts: number;
  preferredDevice?: string;
}

export const useELM327 = () => {
  const [devices, setDevices] = useState<ELM327Device[]>([]);
  const [currentDevice, setCurrentDevice] = useState<ELM327Device | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [config, setConfig] = useState<ELM327Config>({
    autoConnect: true,
    connectionTimeout: 10000,
    retryAttempts: 3,
  });

  const { toast } = useToast();

  // Check if Web Bluetooth API is available
  const isBluetoothSupported = typeof navigator !== 'undefined' && 'bluetooth' in navigator;

  // Scan for Bluetooth ELM327 devices
  const scanBluetoothDevices = useCallback(async () => {
    if (!isBluetoothSupported) {
      toast({
        title: "Bluetooth not supported",
        description: "Your browser doesn't support Web Bluetooth API",
        variant: "destructive",
      });
      return [];
    }

    setIsScanning(true);
    try {
      // Request Bluetooth device with ELM327 service
      const device = await (navigator as any).bluetooth.requestDevice({
        filters: [
          { namePrefix: 'ELM327' },
          { namePrefix: 'OBDII' },
          { namePrefix: 'OBD' },
          { services: ['0000fff0-0000-1000-8000-00805f9b34fb'] }
        ],
        optionalServices: ['0000fff0-0000-1000-8000-00805f9b34fb']
      });

      const elm327Device: ELM327Device = {
        id: device.id,
        name: device.name || 'ELM327 Device',
        type: 'bluetooth',
        connected: false,
      };

      setDevices(prev => {
        const existing = prev.find(d => d.id === elm327Device.id);
        if (existing) return prev;
        return [...prev, elm327Device];
      });

      toast({
        title: "Device found",
        description: `Found ${elm327Device.name}`,
      });

      return [elm327Device];
    } catch (error) {
      console.error('Bluetooth scan error:', error);
      toast({
        title: "Scan failed",
        description: "Failed to scan for Bluetooth devices",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsScanning(false);
    }
  }, [isBluetoothSupported, toast]);

  // Add WiFi ELM327 device manually
  const addWiFiDevice = useCallback((ip: string, port: number = 35000) => {
    const wifiDevice: ELM327Device = {
      id: `wifi-${ip}:${port}`,
      name: `ELM327 WiFi (${ip})`,
      type: 'wifi',
      connected: false,
    };

    setDevices(prev => {
      const existing = prev.find(d => d.id === wifiDevice.id);
      if (existing) return prev;
      return [...prev, wifiDevice];
    });

    toast({
      title: "WiFi device added",
      description: `Added ELM327 WiFi device at ${ip}:${port}`,
    });

    return wifiDevice;
  }, [toast]);

  // Connect to ELM327 device
  const connectDevice = useCallback(async (device: ELM327Device) => {
    setIsConnecting(true);
    setCurrentDevice(device);

    try {
      if (device.type === 'bluetooth') {
        // Connect to Bluetooth ELM327
        const bluetoothDevice = await (navigator as any).bluetooth.getDevices()
          .then((devices: any[]) => devices.find(d => d.id === device.id));

        if (!bluetoothDevice) {
          throw new Error('Bluetooth device not found');
        }

        const server = await bluetoothDevice.gatt?.connect();
        if (!server) {
          throw new Error('Failed to connect to GATT server');
        }

        // Get ELM327 service and characteristic
        const service = await server.getPrimaryService('0000fff0-0000-1000-8000-00805f9b34fb');
        const characteristic = await service.getCharacteristic('0000fff2-0000-1000-8000-00805f9b34fb');

        // Initialize ELM327
        await sendCommand(characteristic, 'ATZ\r'); // Reset
        await new Promise(resolve => setTimeout(resolve, 1000));
        await sendCommand(characteristic, 'ATE0\r'); // Echo off
        await sendCommand(characteristic, 'ATL0\r'); // Linefeeds off
        await sendCommand(characteristic, 'ATS0\r'); // Spaces off
        await sendCommand(characteristic, 'ATSP0\r'); // Auto protocol

        setIsConnected(true);
        setDevices(prev => prev.map(d => 
          d.id === device.id ? { ...d, connected: true, lastConnected: new Date() } : d
        ));

        toast({
          title: "Connected",
          description: `Connected to ${device.name}`,
        });

      } else if (device.type === 'wifi') {
        // For WiFi, we would use WebSocket or fetch API
        // This is a simplified implementation
        const [ip, port] = device.id.replace('wifi-', '').split(':');
        
        // Simulate connection (in real app, you'd use WebSocket)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setIsConnected(true);
        setDevices(prev => prev.map(d => 
          d.id === device.id ? { ...d, connected: true, lastConnected: new Date() } : d
        ));

        toast({
          title: "Connected",
          description: `Connected to WiFi ELM327 at ${ip}`,
        });
      }

    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection failed",
        description: `Failed to connect to ${device.name}`,
        variant: "destructive",
      });
      setCurrentDevice(null);
    } finally {
      setIsConnecting(false);
    }
  }, [toast]);

  // Send OBD command
  const sendCommand = async (characteristic: any, command: string) => {
    const encoder = new TextEncoder();
    await characteristic.writeValue(encoder.encode(command));
    
    // Wait for response (simplified)
    return new Promise((resolve) => {
      setTimeout(() => resolve('OK'), 100);
    });
  };

  // Disconnect from current device
  const disconnect = useCallback(() => {
    if (currentDevice) {
      setIsConnected(false);
      setDevices(prev => prev.map(d => 
        d.id === currentDevice.id ? { ...d, connected: false } : d
      ));
      setCurrentDevice(null);

      toast({
        title: "Disconnected",
        description: "Disconnected from ELM327 device",
      });
    }
  }, [currentDevice, toast]);

  // Auto-connect to preferred device
  useEffect(() => {
    if (config.autoConnect && config.preferredDevice && !isConnected) {
      const preferredDevice = devices.find(d => d.id === config.preferredDevice);
      if (preferredDevice && !preferredDevice.connected) {
        connectDevice(preferredDevice);
      }
    }
  }, [config.autoConnect, config.preferredDevice, devices, isConnected, connectDevice]);

  return {
    devices,
    currentDevice,
    isScanning,
    isConnecting,
    isConnected,
    isBluetoothSupported,
    config,
    setConfig,
    scanBluetoothDevices,
    addWiFiDevice,
    connectDevice,
    disconnect,
  };
};