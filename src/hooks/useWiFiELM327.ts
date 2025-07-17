import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface WiFiELM327Device {
  id: string;
  name: string;
  ip: string;
  port: number;
  connected: boolean;
  lastConnected?: Date;
}

export const useWiFiELM327 = () => {
  const [currentDevice, setCurrentDevice] = useState<WiFiELM327Device | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();

  // Connect to WiFi ELM327
  const connect = useCallback(async (ip: string, port: number = 35000) => {
    setIsConnecting(true);
    
    try {
      // Validate IP address format
      const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!ipRegex.test(ip)) {
        throw new Error('Invalid IP address format');
      }

      // Test connection with HTTP first (most WiFi ELM327 have web interface)
      const testResponse = await fetch(`http://${ip}:${port}`, {
        method: 'GET',
        mode: 'no-cors',
        signal: AbortSignal.timeout(5000)
      }).catch(() => null);

      // Create WebSocket connection to ELM327 WiFi adapter
      const wsUrl = `ws://${ip}:${port}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, 10000);

        ws.onopen = () => {
          clearTimeout(timeout);
          
          const device: WiFiELM327Device = {
            id: `wifi-${ip}:${port}`,
            name: `ELM327 WiFi (${ip})`,
            ip,
            port,
            connected: true,
            lastConnected: new Date()
          };
          
          setCurrentDevice(device);
          setIsConnected(true);
          
          // Initialize ELM327
          ws.send('ATZ\r'); // Reset
          setTimeout(() => ws.send('ATE0\r'), 500); // Echo off
          setTimeout(() => ws.send('ATL0\r'), 1000); // Linefeeds off
          setTimeout(() => ws.send('ATSP0\r'), 1500); // Auto protocol
          
          toast({
            title: "Connected",
            description: `Connected to ELM327 WiFi at ${ip}:${port}`,
          });
          
          resolve();
        };
        
        ws.onerror = (error) => {
          clearTimeout(timeout);
          console.error('WebSocket error:', error);
          reject(new Error('WebSocket connection failed'));
        };
        
        ws.onclose = (event) => {
          clearTimeout(timeout);
          console.log('WebSocket closed:', event.code, event.reason);
          setIsConnected(false);
          setCurrentDevice(null);
          wsRef.current = null;
        };

        ws.onmessage = (event) => {
          console.log('ELM327 Response:', event.data);
        };
      });
      
    } catch (error) {
      console.error('WiFi connection error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      toast({
        title: "Connection failed",
        description: `Failed to connect to ELM327 WiFi at ${ip}:${port}. ${errorMessage}`,
        variant: "destructive",
      });
      
      // Clean up on error
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    } finally {
      setIsConnecting(false);
    }
  }, [toast]);

  // Send command to ELM327
  const sendCommand = useCallback(async (command: string): Promise<string> => {
    if (!isConnected || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      throw new Error('Not connected to WiFi ELM327');
    }
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Command timeout'));
      }, 5000);

      const handleMessage = (event: MessageEvent) => {
        clearTimeout(timeout);
        wsRef.current?.removeEventListener('message', handleMessage);
        resolve(event.data);
      };

      wsRef.current.addEventListener('message', handleMessage);
      wsRef.current.send(command);
    });
  }, [isConnected]);

  // Disconnect
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    if (currentDevice) {
      setIsConnected(false);
      setCurrentDevice(null);
      
      toast({
        title: "Disconnected",
        description: "Disconnected from WiFi ELM327",
      });
    }
  }, [currentDevice, toast]);

  return {
    currentDevice,
    isConnected,
    isConnecting,
    connect,
    sendCommand,
    disconnect
  };
}
