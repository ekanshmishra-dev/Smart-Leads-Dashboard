import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color: 'primary' | 'success' | 'warning' | 'danger';
}

const colors = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-emerald-500/10 text-emerald-500',
  warning: 'bg-amber-500/10 text-amber-500',
  danger: 'bg-rose-500/10 text-rose-500',
};

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, color }) => {
  return (
    <div className="glass p-6 rounded-3xl border border-border/50 bg-card/30 hover:shadow-xl transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300", colors[color])}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={cn(
            "text-xs font-bold px-2 py-1 rounded-lg",
            trend.isUp ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
          )}>
            {trend.isUp ? '+' : '-'}{trend.value}%
          </div>
        )}
      </div>
      <div>
        <p className="text-muted-foreground text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
      </div>
    </div>
  );
};

export default StatsCard;
