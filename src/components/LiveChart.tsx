import React from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface DataPoint {
  time: string;
  value: number;
}

interface LiveChartProps {
  title: string;
  data: DataPoint[];
  unit?: string;
  color?: string;
  warningThreshold?: number;
  dangerThreshold?: number;
  filled?: boolean;
}

export const LiveChart: React.FC<LiveChartProps> = ({
  title,
  data,
  unit = '',
  color = 'hsl(var(--primary))',
  warningThreshold,
  dangerThreshold,
  filled = false
}) => {
  const ChartComponent = filled ? AreaChart : LineChart;
  
  return (
    <Card className="p-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">{title}</h3>
      
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              tick={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            
            {/* Warning threshold line */}
            {warningThreshold && (
              <Line
                type="monotone"
                dataKey={() => warningThreshold}
                stroke="hsl(var(--warning))"
                strokeDasharray="5 5"
                strokeWidth={1}
                dot={false}
                connectNulls={false}
              />
            )}
            
            {/* Danger threshold line */}
            {dangerThreshold && (
              <Line
                type="monotone"
                dataKey={() => dangerThreshold}
                stroke="hsl(var(--danger))"
                strokeDasharray="5 5"
                strokeWidth={1}
                dot={false}
                connectNulls={false}
              />
            )}
            
            {filled ? (
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                fill={color}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            ) : (
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: color }}
              />
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground">
        Latest: {data[data.length - 1]?.value ?? 0}{unit}
      </div>
    </Card>
  );
};