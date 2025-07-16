import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface OBDDataCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  status?: 'normal' | 'warning' | 'danger';
  threshold?: {
    warning: number;
    danger: number;
  };
  className?: string;
}

export const OBDDataCard: React.FC<OBDDataCardProps> = ({
  title,
  value,
  unit = '',
  icon,
  status = 'normal',
  threshold,
  className
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'warning':
        return 'border-warning bg-warning/10';
      case 'danger':
        return 'border-danger bg-danger/10 animate-pulse-glow';
      default:
        return 'border-border';
    }
  };

  const getValueColor = () => {
    switch (status) {
      case 'warning':
        return 'text-warning';
      case 'danger':
        return 'text-danger';
      default:
        return 'text-primary';
    }
  };

  return (
    <Card className={cn(
      "p-4 transition-all duration-300 hover:shadow-glow",
      getStatusColor(),
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && (
          <div className="text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className={cn(
          "text-2xl font-bold",
          getValueColor()
        )}>
          {value}
        </span>
        {unit && (
          <span className="text-sm text-muted-foreground">{unit}</span>
        )}
      </div>
      
      {status !== 'normal' && (
        <Badge 
          variant={status === 'warning' ? 'secondary' : 'destructive'}
          className="mt-2 text-xs"
        >
          {status === 'warning' ? 'Warning' : 'Critical'}
        </Badge>
      )}
    </Card>
  );
};