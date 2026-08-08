import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Globe, ShieldAlert } from 'lucide-react';

interface CountryAttack {
  country: string;
  code: string;
  lat: number;
  lng: number;
  attacks: number;
  threat_level: string;
}

interface GeoAttackMapProps {
  data?: CountryAttack[];
}

export const GeoAttackMap: React.FC<GeoAttackMapProps> = ({ data = [] }) => {
  const sampleData: CountryAttack[] = data.length > 0 ? data : [
    { country: 'Russia', code: 'RU', lat: 55.7558, lng: 37.6173, attacks: 1420, threat_level: 'Critical' },
    { country: 'China', code: 'CN', lat: 39.9042, lng: 116.4074, attacks: 980, threat_level: 'High' },
    { country: 'United States', code: 'US', lat: 37.0902, lng: -95.7129, attacks: 430, threat_level: 'Medium' },
    { country: 'Netherlands', code: 'NL', lat: 52.3676, lng: 4.9041, attacks: 310, threat_level: 'High' },
    { country: 'Brazil', code: 'BR', lat: -14.2350, lng: -51.9253, attacks: 210, threat_level: 'Medium' }
  ];

  return (
    <GlassCard className="h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">Geographic Attack Heatmap</h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
          GLOBAL INBOUND RADAR
        </span>
      </div>

      {/* Cyberpunk Map SVG Grid Representation */}
      <div className="relative h-56 w-full rounded-xl bg-[#060a12] border border-slate-800/80 p-4 flex items-center justify-center overflow-hidden">
        {/* World Grid Lines Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30"></div>

        {/* Global Attack Vectors & Hotspots */}
        <div className="relative z-10 w-full h-full flex flex-wrap items-center justify-around gap-4 p-2">
          {sampleData.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl hover:border-cyan-500/40 transition">
              <div className="relative flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
                <span className="absolute w-2 h-2 rounded-full bg-rose-400"></span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-100">{item.country} ({item.code})</p>
                <p className="text-[10px] text-slate-400 font-mono">{item.attacks.toLocaleString()} Attacks • <span className="text-rose-400 font-bold">{item.threat_level}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};
