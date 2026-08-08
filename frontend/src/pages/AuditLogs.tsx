import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { FileText, Shield, User, Clock } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const auditLogs = [
    { id: 1, action: 'USER_LOGIN', username: 'analyst_karthik', target: 'SOC Portal', ip: '192.168.1.105', timestamp: new Date().toISOString() },
    { id: 2, action: 'INCIDENT_STATUS_UPDATE', username: 'analyst_karthik', target: 'Incident #1', ip: '192.168.1.105', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 3, action: 'RULE_TOGGLE', username: 'admin', target: 'Rule: Brute Force', ip: '10.0.0.12', timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: 4, action: 'REPORT_EXPORT', username: 'analyst_karthik', target: 'Daily SOC PDF', ip: '192.168.1.105', timestamp: new Date(Date.now() - 14400000).toISOString() }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-100 tracking-tight">SOC System Audit Trail</h1>
        <p className="text-xs text-slate-400">Immutable audit logs for compliance and administrative actions</p>
      </div>

      <GlassCard className="p-0 border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0f172a] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Action</th>
                <th className="p-4">User</th>
                <th className="p-4">Target Resource</th>
                <th className="p-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-4"><span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold">{log.action}</span></td>
                  <td className="p-4 text-slate-100 font-semibold">{log.username}</td>
                  <td className="p-4 text-slate-300">{log.target}</td>
                  <td className="p-4 text-emerald-400">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
