declare module '@capacitor-community/bluetooth-serial' {
  export interface BluetoothDevice {
    address: string;
    name: string;
  }

  export interface BluetoothListResult {
    devices: BluetoothDevice[];
  }

  export interface BluetoothConnectOptions {
    address: string;
  }

  export interface BluetoothWriteOptions {
    value: string;
  }

  export interface BluetoothReadOptions {
    delimiter?: string;
    timeout?: number;
  }

  export interface BluetoothReadResult {
    value: string;
  }

  export interface BluetoothPermissionResult {
    granted: boolean;
  }

  export class BluetoothSerial {
    static requestPermissions(): Promise<BluetoothPermissionResult>;
    static enable(): Promise<void>;
    static list(): Promise<BluetoothListResult>;
    static connect(options: BluetoothConnectOptions): Promise<void>;
    static disconnect(): Promise<void>;
    static write(options: BluetoothWriteOptions): Promise<void>;
    static read(options?: BluetoothReadOptions): Promise<BluetoothReadResult>;
    static isConnected(): Promise<{ connected: boolean }>;
  }
}
