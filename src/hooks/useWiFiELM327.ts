import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface WiFiELM327Device {
  id: string;
  name: string;
  ip: string;
  port: number;
  connected: boolean;
}

export function useWiFiELM327() {
  const [currentDevice, setCurrentDevice] = useState<WiFiELM327Device | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { toast } = useToast();

  const connectDevice = useCallback(async (ip: string, port: number = 35000) => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // Create WebSocket connection to ELM327 WiFi device
      const ws = new WebSocket(`ws://${ip}:${port}`);
      
      ws.onopen = async () => {
        setSocket(ws);
        
        // Initialize ELM327
        await sendCommand('ATZ\r'); // Reset
        await new Promise(resolve => setTimeout(resolve, 1000));
        await sendCommand('ATE0\r'); // Echo off
        await sendCommand('ATL0\r'); // Linefeeds off
        await sendCommand('ATS0\r'); // Spaces off
        await sendCommand('ATSP0\r'); // Auto protocol
        
        const device: WiFiELM327Device = {
          id: `wifi-${ip}:${port}`,
          name: `ELM327 WiFi (${ip})`,
          ip,
          port,
          connected: true
        };
        
        setCurrentDevice(device);
        setIsConnected(true);
        setIsConnecting(false);
        
        toast({
          title: "Connected",
          description: `Connected to WiFi ELM327 at ${ip}:${port}`,
        });
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Failed to connect to WiFi ELM327');
        setIsConnecting(false);
        toast({
          title: "Connection Failed",
          description: `Failed to connect to ${ip}:${port}`,
          variant: "destructive",
        });
      };
      
      ws.onclose = () => {
        setIsConnected(false);
        setCurrentDevice(null);
        setSocket(null);
        toast({
          title: "Disconnected",
          description: "Disconnected from WiFi ELM327",
        });
      };
      
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : 'Connection failed';
      setError(errorMsg);
      setIsConnecting(false);
      toast({
        title: "Connection Failed",
        description: errorMsg,
        variant: "destructive",
      });
    }
  }, [toast]);

  const disconnect = useCallback(async () => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
    setIsConnected(false);
    setCurrentDevice(null);
  }, [socket]);

  const sendCommand = useCallback(async (command: string): Promise<string> => {
    if (!isConnected || !socket) {
      throw new Error('Not connected to device');
    }
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Command timeout'));
      }, 5000);
      
      const handleMessage = (event: MessageEvent) => {
        clearTimeout(timeout);
        socket.removeEventListener('message', handleMessage);
        resolve(event.data);
      };
      
      socket.addEventListener('message', handleMessage);
      socket.send(command.trim().toUpperCase() + '\r');
    });
  }, [isConnected, socket]);

  return {
    currentDevice,
    isConnecting,
    isConnected,
    error,
    connectDevice,
    disconnect,
    sendCommand
  };
}
