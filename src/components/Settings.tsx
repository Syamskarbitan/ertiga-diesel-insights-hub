import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, Palette, Bell, Download, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Settings: React.FC = () => {
  const { toast } = useToast();
  const [thresholds, setThresholds] = useState({
    engineTempWarning: 95,
    engineTempDanger: 105,
    batteryVoltageWarning: 12.2,
    batteryVoltageDanger: 12.0,
    fuelPressureWarning: 150,
    fuelPressureDanger: 120
  });

  const [alerts, setAlerts] = useState({
    pushNotifications: true,
    voiceAlerts: false,
    soundEnabled: true
  });

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');

  const handleThresholdChange = (key: keyof typeof thresholds, value: number) => {
    setThresholds(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAlertChange = (key: keyof typeof alerts, value: boolean) => {
    setAlerts(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = () => {
    // In a real app, this would save to localStorage or send to API
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const exportData = () => {
    toast({
      title: "Data Export",
      description: "Historical data exported to Downloads folder.",
    });
  };

  const clearHistory = () => {
    toast({
      title: "History Cleared",
      description: "All historical data has been removed.",
      variant: "destructive"
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="thresholds" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        {/* Threshold Settings */}
        <TabsContent value="thresholds" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Alert Thresholds</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-warning">Engine Temperature</h4>
                <div className="space-y-2">
                  <Label htmlFor="tempWarning">Warning Threshold (°C)</Label>
                  <Input
                    id="tempWarning"
                    type="number"
                    value={thresholds.engineTempWarning}
                    onChange={(e) => handleThresholdChange('engineTempWarning', parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tempDanger">Danger Threshold (°C)</Label>
                  <Input
                    id="tempDanger"
                    type="number"
                    value={thresholds.engineTempDanger}
                    onChange={(e) => handleThresholdChange('engineTempDanger', parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-primary">Battery Voltage</h4>
                <div className="space-y-2">
                  <Label htmlFor="voltWarning">Warning Threshold (V)</Label>
                  <Input
                    id="voltWarning"
                    type="number"
                    step="0.1"
                    value={thresholds.batteryVoltageWarning}
                    onChange={(e) => handleThresholdChange('batteryVoltageWarning', parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="voltDanger">Danger Threshold (V)</Label>
                  <Input
                    id="voltDanger"
                    type="number"
                    step="0.1"
                    value={thresholds.batteryVoltageDanger}
                    onChange={(e) => handleThresholdChange('batteryVoltageDanger', parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-success">Fuel Pressure</h4>
                <div className="space-y-2">
                  <Label htmlFor="fuelWarning">Warning Threshold (bar)</Label>
                  <Input
                    id="fuelWarning"
                    type="number"
                    value={thresholds.fuelPressureWarning}
                    onChange={(e) => handleThresholdChange('fuelPressureWarning', parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuelDanger">Danger Threshold (bar)</Label>
                  <Input
                    id="fuelDanger"
                    type="number"
                    value={thresholds.fuelPressureDanger}
                    onChange={(e) => handleThresholdChange('fuelPressureDanger', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Alert Settings */}
        <TabsContent value="alerts" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for critical alerts
                  </p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={alerts.pushNotifications}
                  onCheckedChange={(checked) => handleAlertChange('pushNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="voiceAlerts">Voice Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Spoken warnings for critical conditions
                  </p>
                </div>
                <Switch
                  id="voiceAlerts"
                  checked={alerts.voiceAlerts}
                  onCheckedChange={(checked) => handleAlertChange('voiceAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="soundEnabled">Sound Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Play alert sounds for warnings
                  </p>
                </div>
                <Switch
                  id="soundEnabled"
                  checked={alerts.soundEnabled}
                  onCheckedChange={(checked) => handleAlertChange('soundEnabled', checked)}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Display Settings */}
        <TabsContent value="display" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Display Preferences
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-base">Theme</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    onClick={() => setTheme('light')}
                    className="h-20 flex-col gap-2"
                  >
                    ☀️
                    <span>Light</span>
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => setTheme('dark')}
                    className="h-20 flex-col gap-2"
                  >
                    🌙
                    <span>Dark</span>
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'outline'}
                    onClick={() => setTheme('system')}
                    className="h-20 flex-col gap-2"
                  >
                    🌓
                    <span>System</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Data Management */}
        <TabsContent value="data" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Data Management</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Export Historical Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Download your OBD data as CSV file
                  </p>
                </div>
                <Button onClick={exportData} className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Clear Historical Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Remove all stored readings and logs
                  </p>
                </div>
                <Button variant="destructive" onClick={clearHistory} className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Clear Data
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Storage Usage</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Historical readings:</span>
                    <Badge variant="secondary">2.4 MB</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Alert logs:</span>
                    <Badge variant="secondary">0.8 MB</Badge>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>Total:</span>
                    <Badge>3.2 MB</Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={saveSettings} className="px-8">
          Save All Settings
        </Button>
      </div>
    </div>
  );
};