import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { Globe, Search, ShieldAlert, AlertTriangle, CheckCircle, Database } from 'lucide-react';
import { ThreatIOC } from '../../types';
import { api } from '../../services/api';

export const IOCLookup: React.FC = () => {
  const [query, setQuery] = useState('185.220.101.5');
  const [iocData, setIocData] = useState<ThreatIOC | null>({
    id: 1,
    ioc_value: '185.220.101.5',
    ioc_type: 'IP',
    reputation_score: 92,
    confidence_score: 95,
    risk_level: 'Malicious',
    threat_actor: 'APT29 (Cozy Bear)',
    malware_family: 'Cobalt Strike / TOR Exit Node',
    country: 'Russia',
    provider_source: 'AbuseIPDB & VirusTotal',
    created_at: new Date().toISOString()
  });
  const [loading, setLoading] = useState(false);

  const handleLookup = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query) return;
    setLoading(true);
    api.lookupIOC(query)
      .then(setIocData)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Malicious': return <Badge variant="critical">MALICIOUS IOC</Badge>;
      case 'Suspicious': return <Badge variant="warning">SUSPICIOUS IOC</Badge>;
      case 'Safe': return <Badge variant="success">SAFE / CLEAN</Badge>;
      default: return <Badge variant="info">UNKNOWN</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Input Bar */}
      <GlassCard className="p-6 border border-slate-800">
        <form onSubmit={handleLookup} className="space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">Cyber Threat Intelligence (CTI) Lookup</h3>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Enter IP Address, Domain Name, URL, or File Hash (MD5/SHA256)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition flex items-center gap-2"
            >
              {loading ? 'Querying APIs...' : 'Analyze IOC'}
            </button>
          </div>
          <div className="flex gap-2 text-[11px] text-slate-400">
            <span>Quick Samples:</span>
            <button type="button" onClick={() => { setQuery('185.220.101.5'); handleLookup(); }} className="text-cyan-400 hover:underline font-mono">185.220.101.5 (IP)</button>
            <span>•</span>
            <button type="button" onClick={() => { setQuery('evil-phish-portal.com'); handleLookup(); }} className="text-cyan-400 hover:underline font-mono">evil-phish-portal.com (Domain)</button>
            <span>•</span>
            <button type="button" onClick={() => { setQuery('44d88612fea8a8f36de82e1278abb02f'); handleLookup(); }} className="text-cyan-400 hover:underline font-mono">44d88612fea8a8... (Hash)</button>
          </div>
        </form>
      </GlassCard>

      {/* Intelligence Result Card */}
      {iocData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Risk Card */}
          <GlassCard className="p-6 border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-slate-400">{iocData.ioc_type} INDICATOR</span>
                {getRiskBadge(iocData.risk_level)}
              </div>
              <h2 className="text-lg font-bold font-mono text-slate-100 break-all">{iocData.ioc_value}</h2>
              <p className="text-xs text-slate-400 mt-2">Provider Feed: <span className="text-cyan-400">{iocData.provider_source}</span></p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between text-xs">
              <div>
                <p className="text-slate-400">Country Origin</p>
                <p className="font-bold text-slate-200 mt-0.5">{iocData.country || 'Global'}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400">Confidence</p>
                <p className="font-bold text-emerald-400 mt-0.5">{iocData.confidence_score}%</p>
              </div>
            </div>
          </GlassCard>

          {/* Reputation Score Card */}
          <GlassCard className="p-6 flex flex-col items-center justify-center text-center border-slate-700/80">
            <p className="text-xs uppercase font-bold text-slate-400 mb-2">Threat Reputation Score</p>
            <div className="text-4xl font-extrabold font-mono text-rose-400 my-2">{iocData.reputation_score}/100</div>
            <p className="text-xs text-slate-400">Scores &gt; 70 indicate verified malicious C2 or phishing infrastructure.</p>
          </GlassCard>

          {/* Attribution Card */}
          <GlassCard className="p-6 space-y-4 border-slate-700/80">
            <h3 className="text-xs uppercase font-bold text-slate-400 border-b border-slate-800 pb-2">Threat Attribution & Malware</h3>
            <div className="space-y-3 text-xs">
              <div>
                <p className="text-slate-400">Associated Threat Actor</p>
                <p className="font-bold text-rose-400 mt-0.5">{iocData.threat_actor || 'Unassigned APT'}</p>
              </div>
              <div>
                <p className="text-slate-400">Malware Family / Kit</p>
                <p className="font-bold text-purple-400 mt-0.5">{iocData.malware_family || 'Generic Trojan'}</p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
