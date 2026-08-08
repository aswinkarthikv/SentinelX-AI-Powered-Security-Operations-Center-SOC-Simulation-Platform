import React from 'react';
import { ReportExporter } from '../components/reports/ReportExporter';

export const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-100 tracking-tight">Executive Security Reports & Analytics</h1>
        <p className="text-xs text-slate-400">Generate, preview, and download official PDF & JSON SOC summaries</p>
      </div>
      <ReportExporter />
    </div>
  );
};
