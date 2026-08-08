import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { ShieldAlert, Zap, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
import { clsx } from 'clsx';

interface ThreatScoreGaugeProps {
  score?: number;
}

export const ThreatScoreGauge: React.FC<ThreatScoreGaugeProps> = ({ score = 74 }) => {
  const getScoreDetails = (val: number) => {
    if (val >= 75) return { color: 'text-rose-500 stroke-rose-500', bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400', label: 'ELEVATED CRITICAL THREAT' };
    if (val >= 50) return { color: 'text-amber-500 stroke-amber-500', bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400', label: 'MODERATE RISK' };
    return { color: 'text-emerald-500 stroke-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400', label: 'OPTIMAL SECURITY POSTURE' };
  };

  const details = getScoreDetails(score);
  const strokeDashoffset = 283 - (283 * score) / 100;

  return (
    <GlassCard className="h-full flex flex-col items-center justify-between p-5 text-center border border-slate-800/80">
      <div className="flex items-center gap-2 w-full justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">System Threat Index</h3>
        </div>
        <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
          <Activity className="w-3 h-3 text-cyan-400 animate-pulse" /> Live Telemetry
        </span>
      </div>

      <div className="relative w-36 h-36 flex items-center justify-center my-3">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            className="stroke-slate-800/80"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            className={clsx("transition-all duration-1000 ease-out", details.color)}
            strokeWidth="8"
            strokeDasharray="283"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold tracking-tight text-slate-100 font-mono">{score}</span>
          <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 font-mono">/ 100 SCORE</span>
        </div>
      </div>

      <div className="w-full space-y-2">
        <div className={clsx("p-2 rounded-lg border text-[10px] font-extrabold uppercase tracking-wider", details.bg)}>
          {details.label}
        </div>
        <p className="text-[11px] text-slate-400 leading-tight">
          Weighted aggregate based on active critical alerts, unresolved incidents, and attack velocity acceleration.
        </p>
      </div>
    </GlassCard>
  );
};
