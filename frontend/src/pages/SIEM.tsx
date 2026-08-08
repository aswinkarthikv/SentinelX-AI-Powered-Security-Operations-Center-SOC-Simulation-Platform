import React from 'react';
import { LogStreamer } from '../components/siem/LogStreamer';

export const SIEMPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-100 tracking-tight">SIEM Log Ingestion & Real-Time Stream</h1>
        <p className="text-xs text-slate-400">Windows, Linux, Firewall, IDS, Web Server, and CloudTrail event pipeline</p>
      </div>
      <LogStreamer />
    </div>
  );
};
