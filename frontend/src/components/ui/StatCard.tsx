import React from 'react';
import { GlassCard } from './GlassCard';
import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: string;
  trendUp?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-cyan-400',
  trend,
  trendUp
}) => {
  return (
    <GlassCard className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">{title}</p>
        <h3 className="text-2xl font-bold text-slate-100 mt-1 tracking-tight">{value}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        {trend && (
          <p className={clsx("text-xs font-medium mt-1.5 flex items-center gap-1", trendUp ? "text-emerald-400" : "text-rose-400")}>
            <span>{trendUp ? '↑' : '↓'}</span>
            <span>{trend}</span>
          </p>
        )}
      </div>
      <div className={clsx("p-3.5 rounded-xl bg-slate-900/80 border border-slate-800", iconColor)}>
        <Icon className="w-6 h-6" />
      </div>
    </GlassCard>
  );
};
