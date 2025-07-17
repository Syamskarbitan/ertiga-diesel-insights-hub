import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OBDDataCardProps {
  title: string;
  value: number | string;
  unit?: string;
  icon?: React.ReactNode;
  status?: 'normal' | 'warning' | 'danger';
}

export const OBDDataCard: React.FC<OBDDataCardProps> = ({
  title,
  value,
  unit,
  icon,
  status = 'normal'
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'warning':
        return {
          card: 'border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10',
          badge: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
          icon: '⚠️'
        };
      case 'danger':
        return {
          card: 'border-red-500/30 bg-red-500/5 hover:bg-red-500/10',
          badge: 'bg-red-500/20 text-red-700 dark:text-red-400',
          icon: '🔴'
        };
      default:
        return {
          card: 'border-green-500/30 bg-green-500/5 hover:bg-green-500/10',
          badge: 'bg-green-500/20 text-green-700 dark:text-green-400',
          icon: '✅'
        };
    }
  };

  const statusStyles = getStatusStyles();

  return (
    <Card className={`${statusStyles.card} border-2 transition-all duration-300 hover:shadow-lg card-hover glass-effect`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <Badge className={`${statusStyles.badge} text-xs px-2 py-1`}>
          {statusStyles.icon}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold flex items-baseline gap-1">
          <span className="tabular-nums">{value}</span>
          {unit && (
            <span className="text-sm font-normal text-muted-foreground">
              {unit}
            </span>
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
      </CardContent>
    </Card>
  );
};