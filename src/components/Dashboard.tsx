import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { OBDDataCard } from './OBDDataCard';
import { LiveChart } from './LiveChart';
import { TurboLogo } from './TurboLogo';
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

export const Dashboard: React.FC = () => {
  const { data, historicalData, getStatus, getVoltageStatus } = useOBDData();
  const { isConnected } = useELM327();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Alert System */}
      <AlertSystem data={data} />
      
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <TurboLogo size={48} animated={data.rpm > 1000} />
          <div>
            <img 
              src="/lovable-uploads/3125d971-3639-4b49-9be1-c74769a884f4.png" 
              alt="GADIES Logo" 
              className="h-8 w-auto"
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-turbo bg-clip-text text-transparent">
                GADIES
              </h1>
              <p className="text-sm text-muted-foreground">
                ertiGA-DiESel Jatim by Samsul
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant={isConnected ? 'default' : 'destructive'}>
              <Bluetooth className="w-3 h-3 mr-1" />
              {isConnected ? 'Connected' : 'Disconnected'}
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