import { BleClient, BleDevice, ScanResult, dataViewToText, textToDataView } from '@capacitor-community/bluetooth-le';
import { Capacitor } from '@capacitor/core';

// UUID Services and Characteristics for ELM327 (standard SPP service for most OBD adapters)
const SPP_SERVICE = '0000ffe0-0000-1000-8000-00805f9b34fb';
const SPP_CHARACTERISTIC = '0000ffe1-0000-1000-8000-00805f9b34fb';

// This is the mock implementation for the web environment (npm run dev)
const mockBleClient = {
  initialize: async () => console.log('Mock BLE initialized'),
  requestDevice: async ({ services }: { services: string[] }) => {
    console.log(`Mock requesting device with services: ${services}`);
    return {
      deviceId: 'MOCK-ELM327-LE',
      name: 'ELM327 BLE Mock',
      services: [SPP_SERVICE]
    } as BleDevice;
  },
  connect: async (deviceId: string) => console.log(`Mock connecting to ${deviceId}`),
  disconnect: async (deviceId: string) => console.log(`Mock disconnecting from ${deviceId}`),
  write: async (deviceId: string, service: string, characteristic: string, value: DataView) => {
    const command = dataViewToText(value);
    console.log(`Mock writing to ${deviceId}: ${command}`);
  },
  read: async (deviceId: string, service: string, characteristic: string) => {
    console.log(`Mock reading from ${deviceId}`);
    return textToDataView('OK\r\n>');
  },
  startNotifications: async (
    deviceId: string, 
    service: string, 
    characteristic: string, 
    callback: (value: DataView) => void
  ) => {
    console.log(`Mock starting notifications for ${deviceId}`);
    callback(textToDataView('MOCK NOTIFICATION\r\n>'));
  },
  stopNotifications: async (deviceId: string, service: string, characteristic: string) => {
    console.log(`Mock stopping notifications for ${deviceId}`);
  },
  scan: async (services: string[], callback: (result: ScanResult) => void, seconds: number) => {
    console.log(`Mock scanning for ${seconds} seconds`);
    // Simulate finding an ELM327 device
    setTimeout(() => {
      callback({
        device: {
          deviceId: 'MOCK-ELM327-LE',
          name: 'ELM327 BLE Mock',
          services: [SPP_SERVICE]
        } as BleDevice,
        rssi: -60,
        manufacturerData: new DataView(new ArrayBuffer(0)),
        localName: 'ELM327 BLE Mock',
        serviceData: {},
        txPower: 0
      });
    }, 1000);
    
    // Simulate scan completion
    setTimeout(() => {
      console.log('Mock scan complete');
    }, seconds * 1000);
  },
  isEnabled: async () => ({ value: true }),
  requestLEScan: async (options: any) => console.log('Mock scan requested'),
  stopLEScan: async () => console.log('Mock scan stopped')
};

// The BLE client we'll use (real or mock)
export const bleClient = Capacitor.isNativePlatform() ? BleClient : mockBleClient;

/**
 * A class to handle ELM327 BLE communication
 */
export class ELM327BLE {
  private deviceId: string | null = null;
  private isConnected = false;
  private notificationCallback: ((data: string) => void) | null = null;
  
  /**
   * Initialize the BLE client
   */
  async initialize(): Promise<void> {
    try {
      await bleClient.initialize();
      console.log('BLE initialized');
    } catch (error) {
      console.error('Error initializing BLE:', error);
      throw error;
    }
  }
  
  /**
   * Scan for ELM327 devices
   * @param timeoutSeconds How long to scan in seconds
   * @returns An array of found devices
   */
  async scanForDevices(timeoutSeconds: number = 10): Promise<BleDevice[]> {
    try {
      const devices: BleDevice[] = [];
      
      await bleClient.scan([SPP_SERVICE], (result) => {
        console.log('Found device:', result.device);
        if (result.device.name?.includes('ELM') || 
            result.device.name?.includes('OBD') || 
            result.localName?.includes('ELM') || 
            result.localName?.includes('OBD')) {
          devices.push(result.device);
        }
      }, timeoutSeconds);
      
      return devices;
    } catch (error) {
      console.error('Error scanning for devices:', error);
      throw error;
    }
  }
  
  /**
   * Connect to an ELM327 device
   * @param device The device to connect to
   */
  async connectToDevice(device: BleDevice): Promise<void> {
    try {
      await bleClient.connect(device.deviceId);
      this.deviceId = device.deviceId;
      this.isConnected = true;
      console.log(`Connected to ${device.name || device.deviceId}`);
      
      // Initialize the ELM327
      await this.sendCommand('ATZ'); // Reset
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for reset
      await this.sendCommand('ATE0'); // Echo off
      await this.sendCommand('ATL0'); // Linefeeds off
      await this.sendCommand('ATSP0'); // Auto protocol
    } catch (error) {
      console.error('Error connecting to device:', error);
      this.isConnected = false;
      this.deviceId = null;
      throw error;
    }
  }
  
  /**
   * Disconnect from the current device
   */
  async disconnect(): Promise<void> {
    if (!this.deviceId) return;
    
    try {
      if (this.notificationCallback) {
        await bleClient.stopNotifications(this.deviceId, SPP_SERVICE, SPP_CHARACTERISTIC);
        this.notificationCallback = null;
      }
      
      await bleClient.disconnect(this.deviceId);
      this.isConnected = false;
      this.deviceId = null;
      console.log('Disconnected');
    } catch (error) {
      console.error('Error disconnecting:', error);
      throw error;
    }
  }
  
  /**
   * Send a command to the ELM327
   * @param command The command to send
   * @returns The response from the ELM327
   */
  async sendCommand(command: string): Promise<string> {
    if (!this.deviceId || !this.isConnected) {
      throw new Error('Not connected to a device');
    }
    
    try {
      // Add carriage return if not present
      if (!command.endsWith('\r')) {
        command += '\r';
      }
      
      const dataView = textToDataView(command);
      await bleClient.write(this.deviceId, SPP_SERVICE, SPP_CHARACTERISTIC, dataView);
      
      // Read the response
      const response = await bleClient.read(this.deviceId, SPP_SERVICE, SPP_CHARACTERISTIC);
      return dataViewToText(response);
    } catch (error) {
      console.error('Error sending command:', error);
      throw error;
    }
  }
  
  /**
   * Start listening for notifications from the ELM327
   * @param callback The function to call when data is received
   */
  async startNotifications(callback: (data: string) => void): Promise<void> {
    if (!this.deviceId || !this.isConnected) {
      throw new Error('Not connected to a device');
    }
    
    try {
      this.notificationCallback = callback;
      await bleClient.startNotifications(
        this.deviceId, 
        SPP_SERVICE, 
        SPP_CHARACTERISTIC,
        (data: DataView) => {
          const text = dataViewToText(data);
          callback(text);
        }
      );
      console.log('Started notifications');
    } catch (error) {
      console.error('Error starting notifications:', error);
      throw error;
    }
  }
  
  /**
   * Stop listening for notifications
   */
  async stopNotifications(): Promise<void> {
    if (!this.deviceId || !this.isConnected || !this.notificationCallback) {
      return;
    }
    
    try {
      await bleClient.stopNotifications(this.deviceId, SPP_SERVICE, SPP_CHARACTERISTIC);
      this.notificationCallback = null;
      console.log('Stopped notifications');
    } catch (error) {
      console.error('Error stopping notifications:', error);
      throw error;
    }
  }
  
  /**
   * Check if we're connected to a device
   */
  isDeviceConnected(): boolean {
    return this.isConnected;
  }
  
  /**
   * Get the ID of the connected device
   */
  getConnectedDeviceId(): string | null {
    return this.deviceId;
  }
}

// Singleton instance
export const elm327BLE = new ELM327BLE();