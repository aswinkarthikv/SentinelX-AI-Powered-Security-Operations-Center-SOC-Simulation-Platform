import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { FileSpreadsheet, Download, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export const ReportExporter: React.FC = () => {
  const [reportType, setReportType] = useState('Daily SOC Report');
  const [previewData, setPreviewData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    'Daily SOC Report',
    'Weekly Operational Report',
    'Executive Threat Intelligence Brief',
    'Incident Post-Mortem Summary'
  ];

  const handleGeneratePreview = () => {
    setLoading(true);
    api.generateReport(reportType)
      .then(setPreviewData)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleExportPDF = () => {
    const url = api.getExportPdfUrl(reportType);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <GlassCard className="p-6 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Enterprise Executive Report Generator</h3>
            <p className="text-xs text-slate-400">Generate executive PDF & JSON summaries for leadership and compliance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {reportTypes.map((type) => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`p-3 rounded-xl border text-xs font-semibold text-left transition ${
                reportType === type
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-lg'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={handleGeneratePreview}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-2"
          >
            <Eye className="w-4 h-4 text-cyan-400" /> Generate JSON Preview
          </button>
          <button
            onClick={handleExportPDF}
            className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg"
          >
            <Download className="w-4 h-4" /> Export Official PDF Report
          </button>
        </div>
      </GlassCard>

      {/* JSON Preview Panel */}
      {previewData && (
        <GlassCard className="p-6 border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Report Preview Payload ({previewData.report_type})</h4>
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-mono overflow-x-auto">
            {JSON.stringify(previewData, null, 2)}
          </pre>
        </GlassCard>
      )}
    </div>
  );
};
