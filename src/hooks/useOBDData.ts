import { useState, useEffect, useRef } from 'react';

export interface OBDData {
  // Engine Parameters
  rpm: number;
  speed: number;
  engineTemp: number;
  throttlePosition: number;
  engineLoad: number;
  
  // Battery & Electrical
  batteryVoltage: number;
  batteryCurrent: number;
  batterySOC: number;
  batteryTemp: number;
  
  // Fuel System
  fuelRailPressure: number;
  fuelFlow: number;
  
  // Air & Pressure
  mapPressure: number;
  boostPressure: number;
  intakeTemp: number;
  
  // Status
  dtcCount: number;
  glowPlugStatus: boolean;
  connected: boolean;
  
  // Timestamps
  timestamp: number;
}

export interface HistoricalData {
  engineTemp: Array<{ time: string; value: number }>;
  batteryVoltage: Array<{ time: string; value: number }>;
  rpm: Array<{ time: string; value: number }>;
  boostPressure: Array<{ time: string; value: number }>;
}

export const useOBDData = () => {
  const [data, setData] = useState<OBDData>({
    rpm: 800,
    speed: 0,
    engineTemp: 88,
    throttlePosition: 0,
    engineLoad: 15,
    batteryVoltage: 12.4,
    batteryCurrent: -2.1,
    batterySOC: 85,
    batteryTemp: 24,
    fuelRailPressure: 180,
    fuelFlow: 0.8,
    mapPressure: 101.3,
    boostPressure: 0,
    intakeTemp: 22,
    dtcCount: 0,
    glowPlugStatus: false,
    connected: true,
    timestamp: Date.now()
  });

  const [historicalData, setHistoricalData] = useState<HistoricalData>({
    engineTemp: [],
    batteryVoltage: [],
    rpm: [],
    boostPressure: []
  });

  const intervalRef = useRef<NodeJS.Timeout>();

  const simulateRealisticData = (): OBDData => {
    const baseTemp = 88;
    const baseVoltage = 12.4;
    const baseRPM = 800;
    
    // Add some realistic variation
    const tempVariation = (Math.random() - 0.5) * 4; // ±2°C
    const voltageVariation = (Math.random() - 0.5) * 0.4; // ±0.2V
    const rpmVariation = (Math.random() - 0.5) * 200; // ±100 RPM
    
    return {
      ...data,
      engineTemp: Math.round((baseTemp + tempVariation) * 10) / 10,
      batteryVoltage: Math.round((baseVoltage + voltageVariation) * 10) / 10,
      rpm: Math.round(baseRPM + rpmVariation),
      boostPressure: Math.max(0, Math.round((Math.random() * 15) * 10) / 10),
      throttlePosition: Math.round(Math.random() * 20), // Light throttle when idling
      engineLoad: Math.round(15 + Math.random() * 10),
      fuelFlow: Math.round((0.8 + Math.random() * 0.4) * 10) / 10,
      intakeTemp: Math.round((22 + (Math.random() - 0.5) * 6) * 10) / 10,
      timestamp: Date.now()
    };
  };

  const addHistoricalPoint = (newData: OBDData) => {
    const timeStr = new Date().toLocaleTimeString();
    
    setHistoricalData(prev => ({
      engineTemp: [...prev.engineTemp.slice(-29), { time: timeStr, value: newData.engineTemp }],
      batteryVoltage: [...prev.batteryVoltage.slice(-29), { time: timeStr, value: newData.batteryVoltage }],
      rpm: [...prev.rpm.slice(-29), { time: timeStr, value: newData.rpm }],
      boostPressure: [...prev.boostPressure.slice(-29), { time: timeStr, value: newData.boostPressure }]
    }));
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const newData = simulateRealisticData();
      setData(newData);
      addHistoricalPoint(newData);
    }, 1000); // Update every second

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const getStatus = (value: number, warning: number, danger: number): 'normal' | 'warning' | 'danger' => {
    if (value >= danger) return 'danger';
    if (value >= warning) return 'warning';
    return 'normal';
  };

  const getVoltageStatus = (voltage: number): 'normal' | 'warning' | 'danger' => {
    if (voltage < 12.0) return 'danger';
    if (voltage < 12.2) return 'warning';
    return 'normal';
  };

  return {
    data,
    historicalData,
    getStatus,
    getVoltageStatus,
    isConnected: data.connected
  };
};