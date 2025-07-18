import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/components/theme-provider';
import { useClassicBluetooth } from '@/hooks/useClassicBluetooth';
import { useWiFiELM327 } from '@/hooks/useWiFiELM327';
import { 
  Bluetooth, 
  Wifi, 
  Loader2, 
  Search, 
  Power,
  Cable,
  Sun,
  Moon
} from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { devices, currentDevice, isScanning, isConnecting, isConnected, error, scanDevices, connectDevice, disconnect } = useClassicBluetooth();
  const { connect: connectWiFi, isConnecting: isWiFiConnecting, currentDevice: wifiDevice } = useWiFiELM327();

  const [showConnectionOptions, setShowConnectionOptions] = useState(false);
  const [connectionType, setConnectionType] = useState<'bluetooth' | 'wifi'>('bluetooth');
  const [wifiIP, setWifiIP] = useState('192.168.0.10');
  const [wifiPort, setWifiPort] = useState('35000');
  const { theme, setTheme } = useTheme();

  const handleConnectClick = () => {
    setShowConnectionOptions(true);
  };

  const handleBluetoothScan = async () => {
    setConnectionType('bluetooth');
    await scanDevices();
  };

  const handleBluetoothConnect = async (address: string) => {
    setConnectionType('bluetooth');
    await connectDevice(address);
  };

  // WiFi logic can remain as before if you support WiFi ELM327


  return (
    <div className="min-h-screen bg-gradient-to-br from-gadies-gray-50 via-white to-gadies-gray-100 dark:from-gadies-gray-900 dark:via-gadies-gray-800 dark:to-gadies-gray-900 flex items-center justify-center p-4 relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="bg-white/10 border-white/20 hover:bg-white/20 dark:bg-black/20 dark:border-black/20 dark:hover:bg-black/30"
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4 text-slate-800 dark:text-white" />
          ) : (
            <Sun className="h-4 w-4 text-slate-800 dark:text-white" />
          )}
        </Button>
      </div>

      <div className="max-w-2xl w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto w-1/2 max-w-sm mb-8 relative">
            {/* Logo dengan lingkaran hitam untuk tema terang */}
            <div className={`relative inline-block ${
              theme === 'light' 
                ? 'bg-black rounded-full p-4 shadow-2xl' 
                : 'drop-shadow-2xl'
            }`}>
              <img
                src="/gadies-logo.png"
                alt="GADIES Logo"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-3">
            GADIES
          </h1>
          <p className="text-slate-600 dark:text-gray-300 text-xl font-medium">ertiGA-DiESel Jatim by Samsul</p>
        </div>

        {/* Welcome Message */}
        <Card className="bg-white/80 dark:bg-black/20 backdrop-blur-md border-slate-200/50 dark:border-white/10 shadow-2xl">
          <CardContent className="p-8 text-center space-y-6">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
              Selamat Datang di GADIES OBD-II Diagnostic
            </h2>
            <p className="text-slate-600 dark:text-gray-300 leading-relaxed text-lg">
              Hubungkan ke adapter ELM327 OBD-II Anda untuk mulai memantau kendaraan Suzuki Ertiga Diesel.
            </p>
            
            {!showConnectionOptions ? (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                    Pilih Jenis Koneksi
                  </h3>
                  <p className="text-slate-600 dark:text-gray-300">
                    Pilih cara koneksi ke adapter ELM327 Anda
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Bluetooth Option */}
                  <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                        <Bluetooth className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 dark:text-white mb-2">
                          Bluetooth Classic
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-gray-300 mb-4">
                          Koneksi langsung ke ELM327 Bluetooth
                        </p>
                        <Button 
                          onClick={handleBluetoothScan}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                          disabled={isScanning}
                        >
                          {isScanning ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Scanning...
                            </>
                          ) : (
                            <>
                              <Search className="w-4 h-4 mr-2" />
                              Scan Bluetooth
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* WiFi Option */}
                  <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                        <Wifi className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 dark:text-white mb-2">
                          WiFi ELM327
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-gray-300 mb-4">
                          Koneksi melalui WiFi ELM327 adapter
                        </p>
                        <Button 
                          onClick={() => {
                            setConnectionType('wifi');
                            setShowConnectionOptions(true);
                          }}
                          className="w-full bg-green-500 hover:bg-green-600 text-white"
                        >
                          <Cable className="w-4 h-4 mr-2" />
                          Setup WiFi
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    Pastikan adapter ELM327 sudah terpasang di port OBD-II kendaraan
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => setConnectionType('bluetooth')}
                    variant={connectionType === 'bluetooth' ? 'default' : 'outline'}
                    className={`py-3 ${connectionType === 'bluetooth' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                      : 'bg-slate-100/80 dark:bg-white/10 border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20'
                    }`}
                  >
                    <Bluetooth className="w-5 h-5 mr-2" />
                    Bluetooth
                  </Button>
                  <Button
                    onClick={() => setConnectionType('wifi')}
                    variant={connectionType === 'wifi' ? 'default' : 'outline'}
                    className={`py-3 ${connectionType === 'wifi' 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' 
                      : 'bg-slate-100/80 dark:bg-white/10 border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20'
                    }`}
                  >
                    <Wifi className="w-5 h-5 mr-2" />
                    WiFi
                  </Button>
                </div>

                {/* Bluetooth Scan Button */}
                {connectionType === 'bluetooth' && (
                  <Button
                    onClick={scanDevices}
                    disabled={isScanning}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                  >
                    {isScanning ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <Search className="w-5 h-5 mr-2" />
                    )}
                    {isScanning ? 'Mencari...' : 'Cari Perangkat Bluetooth'}
                  </Button>
                )}

                {/* WiFi Configuration */}
                {connectionType === 'wifi' && (
                  <Card className="bg-slate-50/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                    <CardContent className="p-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="wifi-ip" className="text-slate-700 dark:text-slate-300">Alamat IP ELM327</Label>
                        <Input
                          id="wifi-ip"
                          value={wifiIP}
                          onChange={(e) => setWifiIP(e.target.value)}
                          placeholder="192.168.0.10"
                          className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="wifi-port" className="text-slate-700 dark:text-slate-300">Port</Label>
                        <Input
                          id="wifi-port"
                          value={wifiPort}
                          onChange={(e) => setWifiPort(e.target.value)}
                          placeholder="35000"
                          className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                    />
                  </div>
                  <Button 
                    onClick={() => connectWiFi(wifiIP, parseInt(wifiPort))}
                    disabled={isWiFiConnecting || !wifiIP || !wifiPort}
                    className="w-full"
                  >
                    {isWiFiConnecting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Power className="w-4 h-4 mr-2" />
                        Connect WiFi
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Available Devices */}
            {devices.length > 0 && (
              <Card>
                <CardContent className="p-4 space-y-4">
                  <h3 className="font-medium">Perangkat Bluetooth (Paired)</h3>
                  <div className="space-y-2">
                    {devices.map((device) => (
                      <div key={device.address} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <Bluetooth className="w-4 h-4" />
                          <span className="text-sm">{device.name}</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => connectDevice(device.address)}
                          disabled={isConnecting}
                        >
                          {isConnecting ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Power className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {error && (
              <div className="text-red-600 text-sm mt-2">{error}</div>
            )}

                <Separator />
                
                <Button 
                  variant="ghost" 
                  onClick={() => setShowConnectionOptions(false)}
                  className="w-full bg-slate-100/80 dark:bg-white/10 border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20"
                >
                  Kembali
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500 dark:text-gray-400">
          <p>Kompatibel dengan adapter ELM327 v1.5 Bluetooth & WiFi</p>
        </div>
      </div>
    </div>
  );
};
