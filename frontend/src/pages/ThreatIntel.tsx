import React from 'react';
import { IOCLookup } from '../components/threat_intel/IOCLookup';

export const ThreatIntelPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-100 tracking-tight">Cyber Threat Intelligence (CTI) Engine</h1>
        <p className="text-xs text-slate-400">Integrated feeds from VirusTotal, AbuseIPDB, and AlienVault OTX</p>
      </div>
      <IOCLookup />
    </div>
  );
};
