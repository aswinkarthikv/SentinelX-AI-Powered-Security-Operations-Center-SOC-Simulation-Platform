import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { ShieldAlert, Zap } from 'lucide-react';

interface ThreatScoreGaugeProps {
  score: number;
}

export const ThreatScoreGauge: React.FC<ThreatScoreGaugeProps> = ({ score = 74 }) => {
  const getScoreColor = (val: number) => {
    if (val > 75) return 'text-rose-500 stroke-rose-500';
    if (val > 50) return 'text-amber-500 stroke-amber-500';
    return 'text-emerald-500 stroke-emerald-500';
  };

  const strokeDashoffset = 283 - (283 * score) / 100;

  return (
    <GlassCard className="flex flex-col items-center justify-center p-6 text-center">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-amber-400" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">System Threat Score Index</h3>
      </div>

      <div className="relative w-36 h-36 flex items-center justify-center my-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            className="stroke-slate-800"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            className={`transition-all duration-1000 ease-out ${getScoreColor(score)}`}
            strokeWidth="8"
            strokeDasharray="283"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold tracking-tight text-slate-100 font-mono">{score}</span>
          <span className="text-[10px] uppercase font-bold text-rose-400 tracking-widest mt-0.5">HIGH RISK</span>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 max-w-xs mt-2">
        Weighted aggregate based on active critical alerts, unresolved incidents, and attack velocity.
      </p>
    </GlassCard>
  );
};
