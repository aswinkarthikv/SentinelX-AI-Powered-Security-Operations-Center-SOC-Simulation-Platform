import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'critical' | 'high' | 'medium' | 'low' | 'info' | 'success' | 'warning' | 'purple';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'info', size = 'md' }) => {
  const variantStyles = {
    critical: 'bg-red-500/15 text-red-400 border-red-500/30 pulse-red',
    high: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    low: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    info: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30 pulse-cyan',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 pulse-emerald',
    warning: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30'
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold'
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md border font-medium uppercase tracking-wider',
        variantStyles[variant],
        sizeStyles[size]
      )}
    >
      {children}
    </span>
  );
};
