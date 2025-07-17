import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { OBDDataCard } from './OBDDataCard';
import { LiveChart } from './LiveChart';
import { WelcomeScreen } from './WelcomeScreen';
import { AlertSystem } from './AlertSystem';
import { Settings } from './Settings';
import { useOBDData } from '@/hooks/useOBDData';
import { useELM327 } from '@/hooks/useELM327';
import { ConnectionManager } from './ConnectionManager';
import { 
  Thermometer, 
  Battery, 
  Gauge, 
  Zap, 
  Fuel, 
  Wind, 
  AlertTriangle,
  Bluetooth,
  Activity,
  Settings as SettingsIcon,
  BarChart3,
  Cable,
  Car,
  Droplets,
  Cpu,
  Signal,
  Power,
  TrendingUp,
  Eye,
  Wrench
} from 'lucide-react';

const StatusIndicator: React.FC<{ status: 'normal' | 'warning' | 'danger'; size?: 'sm' | 'md' | 'lg' }> = ({ 
  status, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const colorClasses = {
    normal: 'bg-status-normal',
    warning: 'bg-status-warning',
    danger: 'bg-status-danger'
  };

  return (
    <div className={`${sizeClasses[size]} ${colorClasses[status]} rounded-full animate-pulse`} />
  );
};

const MetricCard: React.FC<{
  title: string;
  value: number | string;
  unit?: string;
  icon: React.ReactNode;
  status: 'normal' | 'warning' | 'danger';
  trend?: 'up' | 'down' | 'stable';
  className?: string;
}> = ({ title, value, unit, icon, status, trend, className }) => {
  const statusColors = {
    normal: 'border-status-normal/20 bg-status-normal/5',
    warning: 'border-status-warning/20 bg-status-warning/5',
    danger: 'border-status-danger/20 bg-status-danger/5'
  };

  const trendIcons = {
    up: <TrendingUp className="w-3 h-3 text-status-normal" />,
    down: <TrendingUp className="w-3 h-3 text-status-danger rotate-180" />,
    stable: <div className="w-3 h-3" />
  };

  return (
    <Card className={`${statusColors[status]} border-2 transition-all duration-200 hover:shadow-lg ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gadies-gray-100 dark:bg-gadies-gray-800">
              {icon}
            </div>
            <StatusIndicator status={status} />
          </div>
          {trend && trendIcons[trend]}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gadies-gray-600 dark:text-gadies-gray-400">
            {title}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gadies-gray-900 dark:text-gadies-gray-100">
              {typeof value === 'number' ? value.toFixed(1) : value}
            </span>
            {unit && (
              <span className="text-sm text-gadies-gray-500 dark:text-gadies-gray-500">
                {unit}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SystemOverview: React.FC<{ data: any; getStatus: any; getVoltageStatus: any }> = ({ 
  data, 
  getStatus, 
  getVoltageStatus 
}) => {
  const engineStatus = getStatus(data.engineTemp, 95, 105);
  const batteryStatus = getVoltageStatus(data.batteryVoltage);
  const overallStatus = engineStatus === 'danger' || batteryStatus === 'danger' ? 'danger' :
                       engineStatus === 'warning' || batteryStatus === 'warning' ? 'warning' : 'normal';

  return (
    <Card className="mb-6 bg-gradient-to-r from-gadies-gray-50 to-gadies-gray-100 dark:from-gadies-gray-900 dark:to-gadies-gray-800 border-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gadies-orange/10 border border-gadies-orange/20">
              <Car className="w-6 h-6 text-gadies-orange" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gadies-gray-900 dark:text-gadies-gray-100">
                Suzuki Ertiga Diesel
              </CardTitle>
              <p className="text-sm text-gadies-gray-600 dark:text-gadies-gray-400">
                Real-time OBD-II Monitoring
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusIndicator status={overallStatus} size="lg" />
            <Badge 
              variant={overallStatus === 'danger' ? 'destructive' : 
                      overallStatus === 'warning' ? 'secondary' : 'default'}
              className="px-3 py-1"
            >
              {overallStatus === 'danger' ? 'Critical' :
               overallStatus === 'warning' ? 'Warning' : 'Normal'}
            </Badge>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

const QuickStats: React.FC<{ data: any; getStatus: any; getVoltageStatus: any }> = ({ 
  data, 
  getStatus, 
  getVoltageStatus 
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <MetricCard
        title="Engine RPM"
        value={data.rpm}
        unit="rpm"
        icon={<Gauge className="w-5 h-5 text-gadies-blue" />}
        status="normal"
        trend="stable"
      />
      <MetricCard
        title="Engine Temp"
        value={data.engineTemp}
        unit="°C"
        icon={<Thermometer className="w-5 h-5 text-gadies-red" />}
        status={getStatus(data.engineTemp, 95, 105)}
        trend={data.engineTemp > 90 ? 'up' : 'stable'}
      />
      <MetricCard
        title="Battery"
        value={data.batteryVoltage}
        unit="V"
        icon={<Battery className="w-5 h-5 text-gadies-green" />}
        status={getVoltageStatus(data.batteryVoltage)}
        trend="stable"
      />
      <MetricCard
        title="Fuel Rail"
        value={Math.round(data.fuelRailPressure / 1000)}
        unit="MPa"
        icon={<Fuel className="w-5 h-5 text-gadies-yellow" />}
        status="normal"
        trend="stable"
      />
    </div>
  );
};

const DetailedMetrics: React.FC<{ data: any; getStatus: any }> = ({ data, getStatus }) => {
  const sections = [
    {
      title: "Engine Parameters",
      icon: <Cpu className="w-5 h-5" />,
      metrics: [
        { label: "RPM", value: data.rpm, unit: "rpm", status: "normal" },
        { label: "Load", value: data.engineLoad, unit: "%", status: "normal" },
        { label: "Throttle", value: data.throttlePosition, unit: "%", status: "normal" },
        { label: "Intake Temp", value: data.intakeTemp, unit: "°C", status: "normal" },
      ]
    },
    {
      title: "Fuel System",
      icon: <Droplets className="w-5 h-5" />,
      metrics: [
        { label: "Rail Pressure", value: data.fuelRailPressure, unit: "kPa", status: "normal" },
        { label: "Flow Rate", value: data.fuelFlow, unit: "%", status: "normal" },
        { label: "MAP Pressure", value: data.mapPressure, unit: "kPa", status: "normal" },
        { label: "Boost Pressure", value: data.boostPressure, unit: "psi", status: "normal" },
      ]
    },
    {
      title: "Electrical System",
      icon: <Zap className="w-5 h-5" />,
      metrics: [
        { label: "Battery Voltage", value: data.batteryVoltage, unit: "V", status: "normal" },
        { label: "Battery Current", value: data.batteryCurrent, unit: "A", status: "normal" },
        { label: "Battery Temp", value: data.batteryTemp, unit: "°C", status: "normal" },
        { label: "Battery SOC", value: data.batterySOC, unit: "%", status: "normal" },
      ]
    },
    {
      title: "Diagnostics",
      icon: <Wrench className="w-5 h-5" />,
      metrics: [
        { label: "DTC Count", value: data.dtcCount, unit: "", status: data.dtcCount > 0 ? "warning" : "normal" },
        { label: "Glow Plugs", value: data.glowPlugStatus ? "ON" : "OFF", unit: "", status: "normal" },
        { label: "Connection", value: data.connected ? "ONLINE" : "OFFLINE", unit: "", status: data.connected ? "normal" : "danger" },
        { label: "Speed", value: data.speed, unit: "km/h", status: "normal" },
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {sections.map((section, index) => (
        <Card key={index} className="border-gadies-gray-200 dark:border-gadies-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              {section.icon}
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {section.metrics.map((metric, metricIndex) => (
              <div key={metricIndex} className="flex items-center justify-between p-3 rounded-lg bg-gadies-gray-50 dark:bg-gadies-gray-800">
                <div className="flex items-center gap-2">
                  <StatusIndicator status={metric.status as any} size="sm" />
                  <span className="text-sm font-medium text-gadies-gray-700 dark:text-gadies-gray-300">
                    {metric.label}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-bold text-gadies-gray-900 dark:text-gadies-gray-100">
                    {typeof metric.value === 'number' ? metric.value.toFixed(1) : metric.value}
                  </span>
                  {metric.unit && (
                    <span className="text-xs text-gadies-gray-500">
                      {metric.unit}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export const ModernDashboard = () => {
  const { data, historicalData, getStatus, getVoltageStatus, isConnected } = useOBDData();
  const { currentDevice } = useELM327();

  // Show welcome screen if not connected
  if (!isConnected) {
    return <WelcomeScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gadies-gray-50 to-gadies-gray-100 dark:from-gadies-gray-900 dark:to-gadies-gray-800">
      {/* Alert System */}
      <AlertSystem data={data} />
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gadies-gray-900/80 backdrop-blur-md border-b border-gadies-gray-200 dark:border-gadies-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src="/lovable-uploads/3125d971-3639-4b49-9be1-c74769a884f4.png" 
                  alt="GADIES Logo" 
                  className="h-12 w-auto drop-shadow-md"
                />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gadies-orange to-gadies-red bg-clip-text text-transparent">
                    GADIES
                  </h1>
                  <p className="text-sm text-gadies-gray-600 dark:text-gadies-gray-400">
                    ertiGA-DiESel Jatim by Samsul
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-status-normal hover:bg-status-normal/80 text-white">
                <Signal className="w-3 h-3 mr-1" />
                {currentDevice?.type === 'bluetooth' ? 'Bluetooth' : 'WiFi'} Connected
              </Badge>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                Live View
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white dark:bg-gadies-gray-800 border border-gadies-gray-200 dark:border-gadies-gray-700">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-gadies-orange data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="charts" className="flex items-center gap-2 data-[state=active]:bg-gadies-orange data-[state=active]:text-white">
              <Activity className="w-4 h-4" />
              Charts
            </TabsTrigger>
            <TabsTrigger value="connection" className="flex items-center gap-2 data-[state=active]:bg-gadies-orange data-[state=active]:text-white">
              <Cable className="w-4 h-4" />
              Connection
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-gadies-orange data-[state=active]:text-white">
              <SettingsIcon className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <SystemOverview data={data} getStatus={getStatus} getVoltageStatus={getVoltageStatus} />
            <QuickStats data={data} getStatus={getStatus} getVoltageStatus={getVoltageStatus} />
            <DetailedMetrics data={data} getStatus={getStatus} />
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-gadies-gray-200 dark:border-gadies-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-gadies-red" />
                    Engine Temperature
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LiveChart
                    title=""
                    data={historicalData.engineTemp}
                    unit="°C"
                    color="#DC2626"
                    warningThreshold={95}
                    dangerThreshold={105}
                  />
                </CardContent>
              </Card>

              <Card className="border-gadies-gray-200 dark:border-gadies-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Battery className="w-5 h-5 text-gadies-green" />
                    Battery Voltage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LiveChart
                    title=""
                    data={historicalData.batteryVoltage}
                    unit="V"
                    color="#16A34A"
                    warningThreshold={12.2}
                    dangerThreshold={12.0}
                  />
                </CardContent>
              </Card>

              <Card className="border-gadies-gray-200 dark:border-gadies-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-gadies-blue" />
                    Engine RPM
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LiveChart
                    title=""
                    data={historicalData.rpm}
                    unit="rpm"
                    color="#2563EB"
                    filled={true}
                  />
                </CardContent>
              </Card>

              <Card className="border-gadies-gray-200 dark:border-gadies-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wind className="w-5 h-5 text-gadies-yellow" />
                    Boost Pressure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LiveChart
                    title=""
                    data={historicalData.boostPressure}
                    unit="psi"
                    color="#EAB308"
                    filled={true}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="connection">
            <ConnectionManager />
          </TabsContent>

          <TabsContent value="settings">
            <Settings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
