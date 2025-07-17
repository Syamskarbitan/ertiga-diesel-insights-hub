import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  ChevronDown,
  ChevronUp,
  Bluetooth,
  Activity,
  Settings as SettingsIcon,
  History,
  BarChart3,
  Cable
} from 'lucide-react';

const DashboardContent: React.FC<{
  data: any;
  historicalData: any;
  getStatus: any;
  getVoltageStatus: any;
  isConnected: boolean;
}> = ({ data, historicalData, getStatus, getVoltageStatus, isConnected }) => {
  const [expandedSections, setExpandedSections] = useState({
    engine: false,
    electrical: false,
    fuel: false,
    air: false,
    diagnostics: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getOverallStatus = () => {
    const tempStatus = getStatus(data.engineTemp, 95, 105);
    const voltageStatus = getVoltageStatus(data.batteryVoltage);
    
    if (tempStatus === 'danger' || voltageStatus === 'danger') return 'danger';
    if (tempStatus === 'warning' || voltageStatus === 'warning') return 'warning';
    return 'normal';
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card className={`p-4 ${
        overallStatus === 'danger' ? 'border-danger bg-danger/10' :
        overallStatus === 'warning' ? 'border-warning bg-warning/10' :
        'border-success bg-success/10'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            <span className="font-medium">System Status</span>
          </div>
          <Badge variant={
            overallStatus === 'danger' ? 'destructive' :
            overallStatus === 'warning' ? 'secondary' : 'default'
          }>
            {overallStatus === 'danger' ? '🔴 Critical' :
             overallStatus === 'warning' ? '⚠️ Warning' : '✅ Normal'}
          </Badge>
        </div>
      </Card>

      {/* Main Dashboard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <OBDDataCard
          title="Engine Temp"
          value={data.engineTemp}
          unit="°C"
          icon={<Thermometer className="w-4 h-4" />}
          status={getStatus(data.engineTemp, 95, 105)}
        />
        <OBDDataCard
          title="Battery"
          value={data.batteryVoltage}
          unit="V"
          icon={<Battery className="w-4 h-4" />}
          status={getVoltageStatus(data.batteryVoltage)}
        />
        <OBDDataCard
          title="RPM"
          value={data.rpm}
          unit="rpm"
          icon={<Gauge className="w-4 h-4" />}
          status="normal"
        />
        <OBDDataCard
          title="DTC Count"
          value={data.dtcCount}
          icon={<AlertTriangle className="w-4 h-4" />}
          status={data.dtcCount > 0 ? 'warning' : 'normal'}
        />
      </div>

      {/* Live Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LiveChart
          title="Engine Temperature"
          data={historicalData.engineTemp}
          unit="°C"
          color="hsl(var(--warning))"
          warningThreshold={95}
          dangerThreshold={105}
        />
        <LiveChart
          title="Battery Voltage"
          data={historicalData.batteryVoltage}
          unit="V"
          color="hsl(var(--primary))"
          warningThreshold={12.2}
          dangerThreshold={12.0}
        />
      </div>

      {/* Expandable Sections */}
      <div className="space-y-4">
        {/* Engine Parameters */}
        <Collapsible 
          open={expandedSections.engine} 
          onOpenChange={() => toggleSection('engine')}
        >
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                Engine Parameters
              </span>
              {expandedSections.engine ? 
                <ChevronUp className="w-4 h-4" /> : 
                <ChevronDown className="w-4 h-4" />
              }
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <OBDDataCard
                title="Engine Load"
                value={data.engineLoad}
                unit="%"
                status="normal"
              />
              <OBDDataCard
                title="Throttle Position"
                value={data.throttlePosition}
                unit="%"
                status="normal"
              />
              <OBDDataCard
                title="Vehicle Speed"
                value={data.speed}
                unit="km/h"
                status="normal"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Electrical System */}
        <Collapsible 
          open={expandedSections.electrical} 
          onOpenChange={() => toggleSection('electrical')}
        >
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Electrical System
              </span>
              {expandedSections.electrical ? 
                <ChevronUp className="w-4 h-4" /> : 
                <ChevronDown className="w-4 h-4" />
              }
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <OBDDataCard
                title="Battery Current"
                value={data.batteryCurrent}
                unit="A"
                status="normal"
              />
              <OBDDataCard
                title="Battery SOC"
                value={data.batterySOC}
                unit="%"
                status={data.batterySOC < 70 ? 'warning' : 'normal'}
              />
              <OBDDataCard
                title="Battery Temp"
                value={data.batteryTemp}
                unit="°C"
                status="normal"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Fuel System */}
        <Collapsible 
          open={expandedSections.fuel} 
          onOpenChange={() => toggleSection('fuel')}
        >
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Fuel className="w-4 h-4" />
                Fuel System
              </span>
              {expandedSections.fuel ? 
                <ChevronUp className="w-4 h-4" /> : 
                <ChevronDown className="w-4 h-4" />
              }
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <OBDDataCard
                title="Fuel Rail Pressure"
                value={data.fuelRailPressure}
                unit="bar"
                status={data.fuelRailPressure < 150 ? 'warning' : 'normal'}
              />
              <OBDDataCard
                title="Fuel Flow"
                value={data.fuelFlow}
                unit="L/h"
                status="normal"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Air & Pressure */}
        <Collapsible 
          open={expandedSections.air} 
          onOpenChange={() => toggleSection('air')}
        >
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Wind className="w-4 h-4" />
                Air & Pressure
              </span>
              {expandedSections.air ? 
                <ChevronUp className="w-4 h-4" /> : 
                <ChevronDown className="w-4 h-4" />
              }
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <OBDDataCard
                title="MAP Pressure"
                value={data.mapPressure}
                unit="kPa"
                status="normal"
              />
              <OBDDataCard
                title="Boost Pressure"
                value={data.boostPressure}
                unit="psi"
                status="normal"
              />
              <OBDDataCard
                title="Intake Temp"
                value={data.intakeTemp}
                unit="°C"
                status="normal"
              />
            </div>
            <div className="mt-4">
              <LiveChart
                title="Boost Pressure"
                data={historicalData.boostPressure}
                unit="psi"
                color="hsl(var(--success))"
                filled={true}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const { data, historicalData, getStatus, getVoltageStatus, isConnected } = useOBDData();
  const [showDashboard, setShowDashboard] = useState(false);

  // Show dashboard when connected
  useEffect(() => {
    if (isConnected) {
      const timer = setTimeout(() => {
        setShowDashboard(true);
      }, 1000); // 1 second delay
      
      return () => clearTimeout(timer);
    } else {
      // Reset states when disconnected
      setShowDashboard(false);
    }
  }, [isConnected]);

  // Show welcome screen if not connected
  if (!isConnected) {
    return <WelcomeScreen />;
  }

  // Show loading or transition if needed
  if (!showDashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
        {/* Garage Door Animation */}
        <div className="relative w-full h-screen">
          {/* Top Door Panel */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-slate-700 to-slate-600 border-b-4 border-slate-500 transform transition-transform duration-2000 ease-in-out animate-garage-door-top shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-500/20 to-transparent"></div>
            {/* Door panels texture */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] bg-[length:100px_100%]"></div>
          </div>
          
          {/* Bottom Door Panel */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-700 to-slate-600 border-t-4 border-slate-500 transform transition-transform duration-2000 ease-in-out animate-garage-door-bottom shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-500/20 to-transparent"></div>
            {/* Door panels texture */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] bg-[length:100px_100%]"></div>
          </div>
          
          {/* Center Logo and Text */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center space-y-4 animate-fade-in-up">
              <img 
                src="/lovable-uploads/3125d971-3639-4b49-9be1-c74769a884f4.png" 
                alt="GADIES Logo" 
                className="h-24 w-auto mx-auto drop-shadow-2xl animate-pulse"
              />
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent animate-gradient">
                  GADIES
                </h1>
                <p className="text-white/80 text-lg font-medium">
                  Sistem Diagnostik Terhubung
                </p>
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                  <span className="text-sm font-medium">Membuka Dashboard...</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Ambient lighting effects */}
          <div className="absolute inset-0 bg-gradient-radial from-orange-500/10 via-transparent to-transparent animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Show dashboard if connected and animation completed
  if (!showDashboard) {
    return <WelcomeScreen />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Alert System */}
      <AlertSystem data={data} />
      
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/3125d971-3639-4b49-9be1-c74769a884f4.png" 
              alt="GADIES Logo" 
              className="h-12 w-auto drop-shadow-md"
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                GADIES
              </h1>
              <p className="text-sm text-muted-foreground">
                ertiGA-DiESel Jatim by Samsul
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
              <Bluetooth className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-card">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Charts
          </TabsTrigger>
          <TabsTrigger value="connection" className="flex items-center gap-2">
            <Cable className="w-4 h-4" />
            Connection
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <SettingsIcon className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="p-4">
          <DashboardContent 
            data={data}
            historicalData={historicalData}
            getStatus={getStatus}
            getVoltageStatus={getVoltageStatus}
            isConnected={isConnected}
          />
        </TabsContent>

        <TabsContent value="charts" className="p-4">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Live Performance Charts</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LiveChart
                title="Engine Temperature"
                data={historicalData.engineTemp}
                unit="°C"
                color="hsl(var(--warning))"
                warningThreshold={95}
                dangerThreshold={105}
              />
              <LiveChart
                title="Battery Voltage"
                data={historicalData.batteryVoltage}
                unit="V"
                color="hsl(var(--primary))"
                warningThreshold={12.2}
                dangerThreshold={12.0}
              />
              <LiveChart
                title="Engine RPM"
                data={historicalData.rpm}
                unit="rpm"
                color="hsl(var(--success))"
                filled={true}
              />
              <LiveChart
                title="Boost Pressure"
                data={historicalData.boostPressure}
                unit="psi"
                color="hsl(var(--primary-glow))"
                filled={true}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="connection" className="p-4">
          <ConnectionManager />
        </TabsContent>

        <TabsContent value="settings">
          <Settings />
        </TabsContent>
      </Tabs>
    </div>
  );
};