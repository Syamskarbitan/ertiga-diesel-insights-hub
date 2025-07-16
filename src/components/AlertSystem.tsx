import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { OBDData } from '@/hooks/useOBDData';

interface AlertSystemProps {
  data: OBDData;
}

interface AlertThresholds {
  engineTemp: { warning: number; danger: number };
  batteryVoltage: { warning: number; danger: number };
  fuelPressure: { warning: number; danger: number };
  batterySOC: { warning: number; danger: number };
}

export const AlertSystem: React.FC<AlertSystemProps> = ({ data }) => {
  const { toast } = useToast();

  const thresholds: AlertThresholds = {
    engineTemp: { warning: 95, danger: 105 },
    batteryVoltage: { warning: 12.2, danger: 12.0 },
    fuelPressure: { warning: 150, danger: 120 },
    batterySOC: { warning: 70, danger: 50 }
  };

  const lastAlerts = React.useRef<{ [key: string]: number }>({});

  const shouldAlert = (key: string): boolean => {
    const now = Date.now();
    const lastAlert = lastAlerts.current[key] || 0;
    const alertCooldown = 30000; // 30 seconds between same alerts
    
    if (now - lastAlert > alertCooldown) {
      lastAlerts.current[key] = now;
      return true;
    }
    return false;
  };

  useEffect(() => {
    // Engine temperature alerts
    if (data.engineTemp >= thresholds.engineTemp.danger && shouldAlert('engineTemp-danger')) {
      toast({
        title: "🔴 CRITICAL: Engine Overheating!",
        description: `Temperature: ${data.engineTemp}°C - Stop engine immediately!`,
        variant: "destructive"
      });
    } else if (data.engineTemp >= thresholds.engineTemp.warning && shouldAlert('engineTemp-warning')) {
      toast({
        title: "⚠️ Warning: High Engine Temperature",
        description: `Temperature: ${data.engineTemp}°C - Monitor closely`,
        variant: "default"
      });
    }

    // Battery voltage alerts
    if (data.batteryVoltage <= thresholds.batteryVoltage.danger && shouldAlert('batteryVoltage-danger')) {
      toast({
        title: "🔴 CRITICAL: Low Battery Voltage!",
        description: `Voltage: ${data.batteryVoltage}V - Check charging system!`,
        variant: "destructive"
      });
    } else if (data.batteryVoltage <= thresholds.batteryVoltage.warning && shouldAlert('batteryVoltage-warning')) {
      toast({
        title: "⚠️ Warning: Low Battery Voltage",
        description: `Voltage: ${data.batteryVoltage}V - Check battery condition`,
        variant: "default"
      });
    }

    // Fuel pressure alerts
    if (data.fuelRailPressure <= thresholds.fuelPressure.danger && shouldAlert('fuelPressure-danger')) {
      toast({
        title: "🔴 CRITICAL: Low Fuel Pressure!",
        description: `Pressure: ${data.fuelRailPressure} bar - Check fuel system!`,
        variant: "destructive"
      });
    } else if (data.fuelRailPressure <= thresholds.fuelPressure.warning && shouldAlert('fuelPressure-warning')) {
      toast({
        title: "⚠️ Warning: Low Fuel Pressure",
        description: `Pressure: ${data.fuelRailPressure} bar - Monitor fuel system`,
        variant: "default"
      });
    }

    // Battery SOC alerts
    if (data.batterySOC <= thresholds.batterySOC.danger && shouldAlert('batterySOC-danger')) {
      toast({
        title: "🔴 CRITICAL: Very Low Battery SOC!",
        description: `SOC: ${data.batterySOC}% - Charge immediately!`,
        variant: "destructive"
      });
    } else if (data.batterySOC <= thresholds.batterySOC.warning && shouldAlert('batterySOC-warning')) {
      toast({
        title: "⚠️ Warning: Low Battery SOC",
        description: `SOC: ${data.batterySOC}% - Consider charging`,
        variant: "default"
      });
    }

  }, [data, toast]);

  return null; // This component only handles alerts, no UI
};