import { Capacitor } from '@capacitor/core';

/**
 * Interface for WiFi ELM327 device
 */
export interface WiFiELM327Device {
  id: string;
  name: string;
  ipAddress: string;
  port: number;
  connected: boolean;
  lastConnected?: Date;
}

/**
 * Class to handle WiFi ELM327 communication
 */
export class WiFiELM327 {
  private socket: WebSocket | null = null;
  private device: WiFiELM327Device | null = null;
  private isConnected = false;
  private messageCallback: ((data: string) => void) | null = null;
  private commandQueue: { command: string; resolve: (value: string) => void; reject: (reason: any) => void }[] = [];
  private currentCommand: { command: string; resolve: (value: string) => void; reject: (reason: any) => void } | null = null;
  private buffer = '';
  private responseTimeout: NodeJS.Timeout | null = null;

  /**
   * Connect to a WiFi ELM327 device
   * @param ipAddress The IP address of the device
   * @param port The port number (default: 35000)
   * @returns The connected device
   */
  async connect(ipAddress: string, port: number = 35000): Promise<WiFiELM327Device> {
    // Validate IP address format
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(ipAddress)) {
      throw new Error('Invalid IP address format');
    }

    // If we're already connected, disconnect first
    if (this.isConnected) {
      await this.disconnect();
    }

    return new Promise((resolve, reject) => {
      try {
        // In web environment, create a mock
        if (!Capacitor.isNativePlatform()) {
          console.log(`Mock connecting to WiFi ELM327 at ${ipAddress}:${port}`);
          
          // Create a mock device
          const mockDevice: WiFiELM327Device = {
            id: `wifi-${ipAddress}-${port}`,
            name: `ELM327 WiFi (${ipAddress})`,
            ipAddress,
            port,
            connected: true,
            lastConnected: new Date()
          };
          
          this.device = mockDevice;
          this.isConnected = true;
          
          setTimeout(() => {
            this.initializeELM327();
            resolve(mockDevice);
          }, 1000);
          
          return;
        }

        // For native platforms, create a real WebSocket connection
        const wsUrl = `ws://${ipAddress}:${port}`;
        const socket = new WebSocket(wsUrl);
        this.socket = socket;

        // Connection timeout
        const connectionTimeout = setTimeout(() => {
          reject(new Error('Connection timeout'));
          socket.close();
        }, 10000);

        socket.onopen = () => {
          clearTimeout(connectionTimeout);
          
          const device: WiFiELM327Device = {
            id: `wifi-${ipAddress}-${port}`,
            name: `ELM327 WiFi (${ipAddress})`,
            ipAddress,
            port,
            connected: true,
            lastConnected: new Date()
          };
          
          this.device = device;
          this.isConnected = true;
          
          this.initializeELM327();
          resolve(device);
        };

        socket.onclose = (event) => {
          clearTimeout(connectionTimeout);
          console.log('WebSocket closed:', event.code, event.reason);
          this.isConnected = false;
          this.device = null;
          this.socket = null;
        };

        socket.onerror = (error) => {
          clearTimeout(connectionTimeout);
          console.error('WebSocket error:', error);
          reject(new Error('WebSocket connection failed'));
        };

        socket.onmessage = (event) => {
          this.handleIncomingData(event.data);
        };
      } catch (error) {
        console.error('Error connecting to WiFi ELM327:', error);
        reject(error);
      }
    });
  }

  /**
   * Initialize the ELM327 device with standard settings
   */
  private async initializeELM327(): Promise<void> {
    try {
      // Reset the device
      await this.sendCommand('ATZ');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Configure the device
      await this.sendCommand('ATE0'); // Echo off
      await this.sendCommand('ATL0'); // Linefeeds off
      await this.sendCommand('ATH0'); // Headers off
      await this.sendCommand('ATS0'); // Spaces off
      await this.sendCommand('ATSP0'); // Auto protocol selection
      
      console.log('ELM327 initialized');
    } catch (error) {
      console.error('Error initializing ELM327:', error);
    }
  }

  /**
   * Handle incoming data from the ELM327
   * @param data The data received
   */
  private handleIncomingData(data: string): void {
    // Add data to buffer
    this.buffer += data;
    
    // Check if the response is complete (ends with '>' prompt)
    if (this.buffer.includes('>')) {
      // Clear response timeout
      if (this.responseTimeout) {
        clearTimeout(this.responseTimeout);
        this.responseTimeout = null;
      }
      
      // Clean up the response
      const response = this.buffer.trim();
      this.buffer = '';
      
      // Call the message callback if set
      if (this.messageCallback) {
        this.messageCallback(response);
      }
      
      // Resolve the current command
      if (this.currentCommand) {
        this.currentCommand.resolve(response);
        this.currentCommand = null;
        
        // Process next command in queue
        this.processCommandQueue();
      }
    }
  }

  /**
   * Process the next command in the queue
   */
  private processCommandQueue(): void {
    if (this.commandQueue.length > 0 && !this.currentCommand) {
      const nextCommand = this.commandQueue.shift();
      if (nextCommand) {
        this.executeCommand(nextCommand.command, nextCommand.resolve, nextCommand.reject);
      }
    }
  }

  /**
   * Execute a command on the ELM327
   * @param command The command to send
   * @param resolve Function to call on success
   * @param reject Function to call on failure
   */
  private executeCommand(
    command: string, 
    resolve: (value: string) => void, 
    reject: (reason: any) => void
  ): void {
    if (!this.isConnected || (this.socket === null && Capacitor.isNativePlatform())) {
      reject(new Error('Not connected to WiFi ELM327'));
      return;
    }

    try {
      // Set current command
      this.currentCommand = { command, resolve, reject };
      
      // Add carriage return if not present
      if (!command.endsWith('\r')) {
        command += '\r';
      }

      // In web environment, mock the response
      if (!Capacitor.isNativePlatform()) {
        console.log(`Mock sending command: ${command}`);
        
        setTimeout(() => {
          let mockResponse: string;
          
          if (command.includes('ATZ')) {
            mockResponse = 'ELM327 v1.5\r\n>';
          } else if (command.includes('AT')) {
            mockResponse = 'OK\r\n>';
          } else if (command.includes('0105')) { // Engine coolant temp
            mockResponse = '4105' + Math.floor(Math.random() * 255).toString(16).padStart(2, '0') + '\r\n>';
          } else if (command.includes('010C')) { // RPM
            const rpm = Math.floor(1000 + Math.random() * 3000);
            const hex = Math.floor(rpm * 4).toString(16).padStart(4, '0');
            mockResponse = '410C' + hex + '\r\n>';
          } else if (command.includes('0142')) { // Battery voltage
            const voltage = (12 + Math.random()).toFixed(1);
            const hex = Math.floor(parseFloat(voltage) * 10).toString(16).padStart(2, '0');
            mockResponse = '4142' + hex + '\r\n>';
          } else if (command.includes('03')) { // DTCs
            mockResponse = 'NO DATA\r\n>';
          } else {
            mockResponse = 'NO DATA\r\n>';
          }
          
          this.handleIncomingData(mockResponse);
        }, 300);
        
        return;
      }

      // Send the command
      this.socket!.send(command);
      
      // Set timeout for response
      this.responseTimeout = setTimeout(() => {
        if (this.currentCommand) {
          this.currentCommand.reject(new Error('Command timeout'));
          this.currentCommand = null;
          this.processCommandQueue();
        }
      }, 5000); // 5 second timeout
    } catch (error) {
      reject(error);
      this.currentCommand = null;
      this.processCommandQueue();
    }
  }

  /**
   * Send a command to the ELM327
   * @param command The command to send
   * @returns The response from the ELM327
   */
  async sendCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        reject(new Error('Not connected to WiFi ELM327'));
        return;
      }
      
      // Add command to queue
      this.commandQueue.push({ command, resolve, reject });
      
      // Process queue if no command is currently being executed
      if (!this.currentCommand) {
        this.processCommandQueue();
      }
    });
  }

  /**
   * Disconnect from the ELM327
   */
  async disconnect(): Promise<void> {
    if (!this.isConnected) return;
    
    try {
      // In web environment, just reset state
      if (!Capacitor.isNativePlatform()) {
        console.log('Mock disconnecting from WiFi ELM327');
        this.isConnected = false;
        this.device = null;
        return;
      }

      // Close the socket
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
      
      this.isConnected = false;
      this.device = null;
      this.buffer = '';
      
      // Clear any pending commands
      if (this.currentCommand) {
        this.currentCommand.reject(new Error('Disconnected'));
        this.currentCommand = null;
      }
      
      this.commandQueue.forEach(cmd => {
        cmd.reject(new Error('Disconnected'));
      });
      
      this.commandQueue = [];
      
      if (this.responseTimeout) {
        clearTimeout(this.responseTimeout);
        this.responseTimeout = null;
      }
    } catch (error) {
      console.error('Error disconnecting from WiFi ELM327:', error);
    }
  }

  /**
   * Set a callback for incoming messages
   * @param callback Function to call when data is received
   */
  setMessageCallback(callback: (data: string) => void): void {
    this.messageCallback = callback;
  }

  /**
   * Remove the message callback
   */
  removeMessageCallback(): void {
    this.messageCallback = null;
  }

  /**
   * Check if connected to an ELM327
   * @returns True if connected
   */
  isDeviceConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Get the connected device
   * @returns The connected device or null
   */
  getConnectedDevice(): WiFiELM327Device | null {
    return this.device;
  }
}

// Singleton instance
export const wifiELM327 = new WiFiELM327();