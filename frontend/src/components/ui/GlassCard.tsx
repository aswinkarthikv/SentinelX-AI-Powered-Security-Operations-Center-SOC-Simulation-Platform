import React from 'react';
import { clsx } from 'clsx';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, hover = true, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'glass-panel rounded-xl p-5 border border-slate-800/80',
        hover && 'glass-card-hover',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};
