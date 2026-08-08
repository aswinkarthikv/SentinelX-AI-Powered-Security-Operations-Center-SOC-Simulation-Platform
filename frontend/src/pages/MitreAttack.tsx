import React from 'react';
import { MitreMatrix } from '../components/mitre/MitreMatrix';

export const MitreAttackPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-100 tracking-tight">MITRE ATT&CK Framework Framework & Coverage</h1>
        <p className="text-xs text-slate-400">Tactics, techniques, and automated detection rule coverage matrix</p>
      </div>
      <MitreMatrix />
    </div>
  );
};
