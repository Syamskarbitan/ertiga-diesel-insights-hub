import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { elm327BLE } from '@/lib/bluetooth-le';
import { wifiELM327, WiFiELM327Device } from '@/lib/wifi-elm327';
import { BleDevice } from '@capacitor-community/bluetooth-le';
import { Capacitor } from '@capacitor/core';

export type ConnectionType = 'bluetooth' | 'wifi' | null;
export type ELM327Device = BleDevice | WiFiELM327Device;

export interface ELM327ConnectionHook {
  // Connection state
  connectionType: ConnectionType;
  isConnected: boolean;
  isConnecting: boolean;
  currentDevice: ELM327Device | null;
  error: string | null;
  
  // BLE scanning
  scanResults: BleDevice[];
  isScanning: boolean;
  scanForDevices: () => Promise<void>;
  
  // Connection methods
  connectToBluetoothDevice: (device: BleDevice) => Promise<void>;
  connectToWiFiDevice: (ipAddress: string, port: number) => Promise<void>;
  disconnect: () => Promise<void>;
  
  // Command methods
  sendCommand: (command: string) => Promise<string>;
  startMonitoring: (callback: (data: string) => void) => Promise<void>;
  stopMonitoring: () => Promise<void>;
  
  // Helpers
  getConnectionStatusText: () => string;
}

/**
 * Hook for handling ELM327 connections (both Bluetooth and WiFi)
 */
export function useELM327Connection(): ELM327ConnectionHook {
  // State
  const [connectionType, setConnectionType] = useState<ConnectionType>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<ELM327Device | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // BLE Scanning
  const [scanResults, setScanResults] = useState<BleDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  
  const { toast } = useToast();
  
  // Initialize BLE on mount
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      elm327BLE.initialize().catch(err => {
        console.error('Error initializing BLE:', err);
        setError('Failed to initialize Bluetooth: ' + (err.message || 'Unknown error'));
      });
    }
  }, []);
  
  /**
   * Scan for Bluetooth ELM327 devices
   */
  const scanForDevices = useCallback(async () => {
    if (isScanning) return;
    
    try {
      setIsScanning(true);
      setError(null);
      setScanResults([]);
      
      toast({
        title: "Scanning for ELM327 devices",
        description: "Please make sure your adapter is powered on and in range.",
        duration: 3000,
      });
      
      const devices = await elm327BLE.scanForDevices(10);
      setScanResults(devices);
      
      if (devices.length === 0) {
        toast({
          title: "No devices found",
          description: "No ELM327 Bluetooth devices were found. Please check your adapter.",
          variant: "destructive",
        });
      } else {
        toast({
          title: `Found ${devices.length} device(s)`,
          description: "Select a device to connect.",
        });
      }
    } catch (err: any) {
      console.error('Error scanning for devices:', err);
      setError('Failed to scan for devices: ' + (err.message || 'Unknown error'));
      
      toast({
        title: "Scan failed",
        description: err.message || 'Failed to scan for devices',
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  }, [isScanning, toast]);
  
  /**
   * Connect to a Bluetooth ELM327 device
   */
  const connectToBluetoothDevice = useCallback(async (device: BleDevice) => {
    if (isConnecting) return;
    
    try {
      setIsConnecting(true);
      setError(null);
      
      // Disconnect from any existing connection
      if (isConnected) {
        await disconnect();
      }
      
      toast({
        title: "Connecting",
        description: `Connecting to ${device.name || device.deviceId}...`,
      });
      
      await elm327BLE.connectToDevice(device);
      
      setConnectionType('bluetooth');
      setIsConnected(true);
      setCurrentDevice(device);
      
      toast({
        title: "Connected",
        description: `Connected to ${device.name || device.deviceId}`,
      });
    } catch (err: any) {
      console.error('Error connecting to device:', err);
      setError('Failed to connect: ' + (err.message || 'Unknown error'));
      
      toast({
        title: "Connection failed",
        description: err.message || 'Failed to connect to the device',
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, isConnected, disconnect, toast]);
  
  /**
   * Connect to a WiFi ELM327 device
   */
  const connectToWiFiDevice = useCallback(async (ipAddress: string, port: number = 35000) => {
    if (isConnecting) return;
    
    try {
      setIsConnecting(true);
      setError(null);
      
      // Disconnect from any existing connection
      if (isConnected) {
        await disconnect();
      }
      
      toast({
        title: "Connecting",
        description: `Connecting to ELM327 at ${ipAddress}:${port}...`,
      });
      
      const device = await wifiELM327.connect(ipAddress, port);
      
      setConnectionType('wifi');
      setIsConnected(true);
      setCurrentDevice(device);
      
      toast({
        title: "Connected",
        description: `Connected to ${device.name}`,
      });
    } catch (err: any) {
      console.error('Error connecting to WiFi device:', err);
      setError('Failed to connect: ' + (err.message || 'Unknown error'));
      
      toast({
        title: "Connection failed",
        description: err.message || 'Failed to connect to the device',
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, isConnected, disconnect, toast]);
  
  /**
   * Disconnect from the current device
   */
  const disconnect = useCallback(async () => {
    try {
      if (connectionType === 'bluetooth' && elm327BLE.isDeviceConnected()) {
        await elm327BLE.disconnect();
      } else if (connectionType === 'wifi' && wifiELM327.isDeviceConnected()) {
        await wifiELM327.disconnect();
      }
      
      setConnectionType(null);
      setIsConnected(false);
      setCurrentDevice(null);
      
      toast({
        title: "Disconnected",
        description: "Disconnected from ELM327 device",
      });
    } catch (err: any) {
      console.error('Error disconnecting:', err);
      setError('Failed to disconnect: ' + (err.message || 'Unknown error'));
      
      toast({
        title: "Disconnect failed",
        description: err.message || 'Failed to disconnect from the device',
        variant: "destructive",
      });
    }
  }, [connectionType, toast]);
  
  /**
   * Send a command to the ELM327
   */
  const sendCommand = useCallback(async (command: string): Promise<string> => {
    if (!isConnected) {
      throw new Error('Not connected to any device');
    }
    
    try {
      if (connectionType === 'bluetooth') {
        return await elm327BLE.sendCommand(command);
      } else if (connectionType === 'wifi') {
        return await wifiELM327.sendCommand(command);
      } else {
        throw new Error('Unknown connection type');
      }
    } catch (err: any) {
      console.error('Error sending command:', err);
      setError('Command failed: ' + (err.message || 'Unknown error'));
      throw err;
    }
  }, [isConnected, connectionType]);
  
  /**
   * Start monitoring for data from the ELM327
   */
  const startMonitoring = useCallback(async (callback: (data: string) => void): Promise<void> => {
    if (!isConnected) {
      throw new Error('Not connected to any device');
    }
    
    try {
      if (connectionType === 'bluetooth') {
        await elm327BLE.startNotifications(callback);
      } else if (connectionType === 'wifi') {
        wifiELM327.setMessageCallback(callback);
      }
    } catch (err: any) {
      console.error('Error starting monitoring:', err);
      setError('Failed to start monitoring: ' + (err.message || 'Unknown error'));
      throw err;
    }
  }, [isConnected, connectionType]);
  
  /**
   * Stop monitoring data from the ELM327
   */
  const stopMonitoring = useCallback(async (): Promise<void> => {
    try {
      if (connectionType === 'bluetooth' && elm327BLE.isDeviceConnected()) {
        await elm327BLE.stopNotifications();
      } else if (connectionType === 'wifi' && wifiELM327.isDeviceConnected()) {
        wifiELM327.removeMessageCallback();
      }
    } catch (err: any) {
      console.error('Error stopping monitoring:', err);
      setError('Failed to stop monitoring: ' + (err.message || 'Unknown error'));
      throw err;
    }
  }, [connectionType]);
  
  /**
   * Get human-readable connection status
   */
  const getConnectionStatusText = useCallback((): string => {
    if (isConnecting) return 'Connecting...';
    if (!isConnected) return 'Disconnected';
    
    if (connectionType === 'bluetooth') {
      const device = currentDevice as BleDevice;
      return `Connected via Bluetooth: ${device.name || device.deviceId}`;
    } else if (connectionType === 'wifi') {
      const device = currentDevice as WiFiELM327Device;
      return `Connected via WiFi: ${device.ipAddress}:${device.port}`;
    }
    
    return 'Connected';
  }, [isConnecting, isConnected, connectionType, currentDevice]);
  
  return {
    connectionType,
    isConnected,
    isConnecting,
    currentDevice,
    error,
    
    scanResults,
    isScanning,
    scanForDevices,
    
    connectToBluetoothDevice,
    connectToWiFiDevice,
    disconnect,
    
    sendCommand,
    startMonitoring,
    stopMonitoring,
    
    getConnectionStatusText
  };
}