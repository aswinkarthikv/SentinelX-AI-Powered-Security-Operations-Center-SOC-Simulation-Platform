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
    // Generate printable executive document window in static/browser mode
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>SentinelX SOC Report - ${reportType}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; color: #0f172a; }
          .header { border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 24px; }
          .title { font-size: 24px; font-weight: bold; color: #0284c7; margin: 0; }
          .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; }
          .metric-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .metric-table th, .metric-table td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 13px; }
          .metric-table th { background-color: #0f172a; color: white; }
          .section { margin-top: 28px; }
          .section-title { font-size: 16px; font-weight: bold; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">SentinelX Security Operations Center</h1>
          <p class="subtitle">${reportType} | Generated: ${new Date().toUTCString()} | Confidential Executive Summary</p>
        </div>

        <div class="section">
          <h2 class="section-title">Key SOC Metrics Summary</h2>
          <table class="metric-table">
            <thead>
              <tr>
                <th>Metric Category</th>
                <th>Value</th>
                <th>Status / SLA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Alerts Monitored</td>
                <td>14,289</td>
                <td>Active Continuous Pipeline</td>
              </tr>
              <tr>
                <td>Critical Threat Detections</td>
                <td>7</td>
                <td>Contained by Sigma Rules</td>
              </tr>
              <tr>
                <td>Mean Time To Detect (MTTD)</td>
                <td>3.5 mins</td>
                <td>Target Met (&lt; 5 mins)</td>
              </tr>
              <tr>
                <td>Mean Time To Respond (MTTR)</td>
                <td>14.2 mins</td>
                <td>Optimal Triage Speed</td>
              </tr>
              <tr>
                <td>MITRE ATT&CK Matrix Coverage</td>
                <td>75.0%</td>
                <td>15 of 20 Techniques Covered</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2 class="section-title">Executive Action Items & Mitigation Plan</h2>
          <p style="font-size: 13px; line-height: 1.6; color: #334155;">
            1. Enforce strict geographic sub-net block for high-velocity IP 185.220.101.5.<br/>
            2. Apply web application firewall rate-limiting to suppress SQL injection signature patterns.<br/>
            3. Expand MITRE ATT&CK coverage rules for Technique T1078 (Valid Accounts).
          </p>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
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
