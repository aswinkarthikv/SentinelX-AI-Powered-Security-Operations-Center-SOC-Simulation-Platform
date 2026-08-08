import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Globe, ShieldAlert, Crosshair, Filter } from 'lucide-react';
import { clsx } from 'clsx';

interface CountryAttack {
  country: string;
  code: string;
  x: number;
  y: number;
  attacks: number;
  threat_level: 'Critical' | 'High' | 'Medium';
}

interface GeoAttackMapProps {
  data?: any[];
  onSelectCountry?: (country: string) => void;
}

export const GeoAttackMap: React.FC<GeoAttackMapProps> = ({ onSelectCountry }) => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const targets: CountryAttack[] = [
    { country: 'Russia', code: 'RU', x: 68, y: 30, attacks: 1420, threat_level: 'Critical' },
    { country: 'China', code: 'CN', x: 80, y: 45, attacks: 980, threat_level: 'High' },
    { country: 'North Korea', code: 'KP', x: 84, y: 40, attacks: 840, threat_level: 'Critical' },
    { country: 'United States', code: 'US', x: 25, y: 40, attacks: 430, threat_level: 'Medium' },
    { country: 'Netherlands', code: 'NL', x: 50, y: 32, attacks: 310, threat_level: 'High' },
    { country: 'Brazil', code: 'BR', x: 35, y: 70, attacks: 210, threat_level: 'Medium' }
  ];

  const handleCountryClick = (c: CountryAttack) => {
    const newSel = selectedCountry === c.country ? null : c.country;
    setSelectedCountry(newSel);
    if (onSelectCountry) onSelectCountry(newSel || '');
  };

  return (
    <GlassCard className="h-full flex flex-col justify-between p-5 border border-slate-800/80">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Crosshair className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Global Cyber Warfare Threat Radar Map</h3>
            <p className="text-[10px] text-slate-400">Real-time target telemetry & attack origin nodes</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedCountry && (
            <button
              onClick={() => { setSelectedCountry(null); if (onSelectCountry) onSelectCountry(''); }}
              className="px-2 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-semibold flex items-center gap-1"
            >
              <Filter className="w-3 h-3" /> Clear Filter: {selectedCountry}
            </button>
          )}
          <span className="px-2.5 py-1 rounded text-[10px] uppercase font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 pulse-red flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span> RADAR SWEEP ACTIVE
          </span>
        </div>
      </div>

      {/* Cyber Warfare Radar Container */}
      <div className="relative h-64 w-full rounded-xl bg-[#030712] border border-slate-800/90 p-2 overflow-hidden flex items-center justify-center">
        {/* World Grid Lines Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(30,41,59,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(30,41,59,0.3)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-40"></div>

        {/* Concentric Radar Rings */}
        <div className="absolute w-48 h-48 rounded-full border border-cyan-500/20 pointer-events-none"></div>
        <div className="absolute w-32 h-32 rounded-full border border-cyan-500/30 pointer-events-none"></div>
        <div className="absolute w-16 h-16 rounded-full border border-cyan-500/40 pointer-events-none"></div>

        {/* Rotating 360 Degree Radar Sweep Beam */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 rounded-full animate-radar-sweep relative overflow-hidden opacity-30">
            <div className="absolute top-0 left-1/2 w-1/2 h-1/2 bg-gradient-to-br from-cyan-400/40 via-cyan-500/10 to-transparent origin-bottom-left transform -rotate-45"></div>
          </div>
        </div>

        {/* Target Nodes Overlay */}
        <div className="relative z-10 w-full h-full">
          {targets.map((t, idx) => {
            const isSelected = selectedCountry === t.country;
            return (
              <div
                key={idx}
                onClick={() => handleCountryClick(t)}
                style={{ left: `${t.x}%`, top: `${t.y}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              >
                {/* Pulsating Ping Target */}
                <div className="relative flex items-center justify-center">
                  <span className={clsx(
                    "w-4 h-4 rounded-full animate-ping absolute opacity-75",
                    t.threat_level === 'Critical' ? "bg-rose-500" : (t.threat_level === 'High' ? "bg-orange-500" : "bg-amber-500")
                  )}></span>
                  <span className={clsx(
                    "w-3 h-3 rounded-full border border-white/60 shadow-lg relative z-10 transition-transform group-hover:scale-125",
                    t.threat_level === 'Critical' ? "bg-rose-500" : (t.threat_level === 'High' ? "bg-orange-500" : "bg-amber-500"),
                    isSelected && "ring-4 ring-cyan-400 scale-125"
                  )}></span>
                </div>

                {/* Target Tooltip Hover Badge */}
                <div className={clsx(
                  "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-30 pointer-events-none",
                  isSelected && "!flex"
                )}>
                  <div className="glass-panel px-2.5 py-1.5 rounded-lg border border-cyan-500/40 text-[10px] font-mono whitespace-nowrap shadow-2xl space-y-0.5">
                    <p className="font-bold text-slate-100 flex items-center gap-1">
                      <span>{t.country} ({t.code})</span>
                      <span className={t.threat_level === 'Critical' ? 'text-rose-400' : 'text-amber-400'}>[{t.threat_level}]</span>
                    </p>
                    <p className="text-cyan-400">{t.attacks.toLocaleString()} Attacks Logged</p>
                  </div>
                  <div className="w-2 h-2 bg-slate-900 border-r border-b border-cyan-500/40 transform rotate-45 -mt-1"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Country Telemetry Cards Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-3">
        {targets.map((t, idx) => (
          <button
            key={idx}
            onClick={() => handleCountryClick(t)}
            className={clsx(
              "p-2 rounded-lg border text-left text-[10px] transition font-mono",
              selectedCountry === t.country
                ? "bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                : "bg-slate-900/80 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200"
            )}
          >
            <p className="font-bold text-slate-200 truncate">{t.code} • {t.country}</p>
            <p className={t.threat_level === 'Critical' ? 'text-rose-400 font-bold' : 'text-amber-400'}>
              {t.attacks} reqs
            </p>
          </button>
        ))}
      </div>
    </GlassCard>
  );
};
