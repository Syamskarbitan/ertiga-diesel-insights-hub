import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useELM327 } from '@/hooks/useELM327';
import { 
  Bluetooth, 
  Wifi, 
  Search, 
  Plus, 
  Power, 
  PowerOff,
  Loader2
} from 'lucide-react';

export const ConnectionManager: React.FC = () => {
  const {
    devices,
    currentDevice,
    isScanning,
    isConnecting,
    isConnected,
    isBluetoothSupported,
    scanBluetoothDevices,
    addWiFiDevice,
    connectDevice,
    disconnect,
  } = useELM327();

  const [wifiIP, setWifiIP] = useState('192.168.0.10');
  const [wifiPort, setWifiPort] = useState('35000');

  const handleAddWiFiDevice = () => {
    if (wifiIP && wifiPort) {
      addWiFiDevice(wifiIP, parseInt(wifiPort));
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bluetooth className="w-5 h-5" />
            ELM327 Connection Status
          </CardTitle>
          <CardDescription>
            Connect to your ELM327 v1.5 device via Bluetooth or WiFi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={isConnected ? 'default' : 'destructive'}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </Badge>
              {currentDevice && (
                <span className="text-sm text-muted-foreground">
                  {currentDevice.name}
                </span>
              )}
            </div>
            {isConnected && currentDevice && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={disconnect}
                className="flex items-center gap-1"
              >
                <PowerOff className="w-3 h-3" />
                Disconnect
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bluetooth Devices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bluetooth className="w-5 h-5" />
            Bluetooth ELM327 Devices
          </CardTitle>
          <CardDescription>
            Scan for and connect to Bluetooth ELM327 adapters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={scanBluetoothDevices}
              disabled={isScanning || !isBluetoothSupported}
              className="flex items-center gap-2"
            >
              {isScanning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              {isScanning ? 'Scanning...' : 'Scan Devices'}
            </Button>
            {!isBluetoothSupported && (
              <Badge variant="destructive">Bluetooth not supported</Badge>
            )}
          </div>

          <div className="space-y-2">
            {devices.filter(d => d.type === 'bluetooth').map((device) => (
              <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Bluetooth className="w-4 h-4" />
                  <div>
                    <div className="font-medium">{device.name}</div>
                    {device.lastConnected && (
                      <div className="text-xs text-muted-foreground">
                        Last connected: {device.lastConnected.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={device.connected ? 'default' : 'secondary'}>
                    {device.connected ? 'Connected' : 'Available'}
                  </Badge>
                  {!device.connected && (
                    <Button
                      size="sm"
                      onClick={() => connectDevice(device)}
                      disabled={isConnecting}
                      className="flex items-center gap-1"
                    >
                      {isConnecting ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Power className="w-3 h-3" />
                      )}
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* WiFi Devices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="w-5 h-5" />
            WiFi ELM327 Devices
          </CardTitle>
          <CardDescription>
            Add and connect to WiFi ELM327 adapters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="wifi-ip">IP Address</Label>
              <Input
                id="wifi-ip"
                value={wifiIP}
                onChange={(e) => setWifiIP(e.target.value)}
                placeholder="192.168.0.10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wifi-port">Port</Label>
              <Input
                id="wifi-port"
                value={wifiPort}
                onChange={(e) => setWifiPort(e.target.value)}
                placeholder="35000"
              />
            </div>
            <div className="space-y-2">
              <Label className="invisible">Action</Label>
              <Button 
                onClick={handleAddWiFiDevice}
                className="w-full flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Device
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {devices.filter(d => d.type === 'wifi').map((device) => (
              <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4" />
                  <div>
                    <div className="font-medium">{device.name}</div>
                    {device.lastConnected && (
                      <div className="text-xs text-muted-foreground">
                        Last connected: {device.lastConnected.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={device.connected ? 'default' : 'secondary'}>
                    {device.connected ? 'Connected' : 'Available'}
                  </Badge>
                  {!device.connected && (
                    <Button
                      size="sm"
                      onClick={() => connectDevice(device)}
                      disabled={isConnecting}
                      className="flex items-center gap-1"
                    >
                      {isConnecting ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Power className="w-3 h-3" />
                      )}
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Connection Info */}
      <Card>
        <CardHeader>
          <CardTitle>ELM327 v1.5 Compatibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <p><strong>Supported protocols:</strong></p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>ISO 15765-4 (CAN)</li>
              <li>ISO 14230-4 (KWP2000)</li>
              <li>ISO 9141-2</li>
              <li>J1850 PWM</li>
              <li>J1850 VPW</li>
            </ul>
            <Separator />
            <p><strong>For Suzuki Ertiga Diesel (D13A SHVS):</strong></p>
            <p className="text-muted-foreground">
              Uses ISO 15765-4 (CAN) protocol on pins 6 & 14 of the OBD-II connector.
              The ELM327 will auto-detect the protocol when connected.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};