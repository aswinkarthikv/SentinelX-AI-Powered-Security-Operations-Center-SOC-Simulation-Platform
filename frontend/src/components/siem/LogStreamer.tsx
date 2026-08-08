import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { Terminal, Play, Pause, RefreshCw, Zap, Search, Eye, Filter } from 'lucide-react';
import { Log } from '../../types';
import { api } from '../../services/api';

export const LogStreamer: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(true);
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [simulating, setSimulating] = useState(false);

  const fetchLogs = () => {
    setLoading(true);
    api.getLogs({
      source: selectedSource !== 'ALL' ? selectedSource : undefined,
      level: selectedLevel !== 'ALL' ? selectedLevel : undefined,
      search: searchTerm || undefined
    })
      .then(res => setLogs(res.logs))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedSource, selectedLevel]);

  // Live Auto-Stream Interval
  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      api.simulateAttack('random', 1)
        .then(() => fetchLogs())
        .catch(console.error);
    }, 4000);
    return () => clearInterval(interval);
  }, [isStreaming, selectedSource, selectedLevel]);

  const handleSimulateAttack = (attackType: string) => {
    setSimulating(true);
    api.simulateAttack(attackType, 5)
      .then(res => {
        fetchLogs();
      })
      .catch(console.error)
      .finally(() => setSimulating(false));
  };

  const sources = ['ALL', 'Windows', 'Linux', 'Firewall', 'IDS', 'WebServer', 'Cloud'];
  const levels = ['ALL', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'];

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL': return <Badge variant="critical">CRITICAL</Badge>;
      case 'ERROR': return <Badge variant="high">ERROR</Badge>;
      case 'WARNING': return <Badge variant="medium">WARNING</Badge>;
      default: return <Badge variant="info">INFO</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Simulation Trigger Bar */}
      <GlassCard className="p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200">SIEM Log Ingestion Pipeline</h3>
            <p className="text-xs text-slate-400">Real-time log ingestion, normalization, and detection engine</p>
          </div>
        </div>

        {/* Attack Simulator Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">Simulate Attack:</span>
          <button
            onClick={() => handleSimulateAttack('brute_force')}
            disabled={simulating}
            className="px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition flex items-center gap-1"
          >
            <Zap className="w-3.5 h-3.5" /> Brute Force
          </button>
          <button
            onClick={() => handleSimulateAttack('sqli')}
            disabled={simulating}
            className="px-2.5 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold hover:bg-orange-500/20 transition flex items-center gap-1"
          >
            <Zap className="w-3.5 h-3.5" /> SQL Injection
          </button>
          <button
            onClick={() => handleSimulateAttack('ransomware')}
            disabled={simulating}
            className="px-2.5 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold hover:bg-purple-500/20 transition flex items-center gap-1"
          >
            <Zap className="w-3.5 h-3.5" /> Ransomware
          </button>
          <button
            onClick={() => handleSimulateAttack('port_scan')}
            disabled={simulating}
            className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition flex items-center gap-1"
          >
            <Zap className="w-3.5 h-3.5" /> Port Scan
          </button>
        </div>
      </GlassCard>

      {/* Filter and Control Toolbar */}
      <GlassCard className="p-4 border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Source Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 overflow-x-auto">
            <span className="px-2 text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Source:
            </span>
            {sources.map(s => (
              <button
                key={s}
                onClick={() => setSelectedSource(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedSource === s
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Controls: Stream Toggle & Search */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
                isStreaming
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 pulse-emerald'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isStreaming ? 'Streaming Active' : 'Paused'}</span>
            </button>

            <button
              onClick={fetchLogs}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Log Table Stream */}
      <GlassCard className="p-0 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0f172a] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Source</th>
                <th className="p-3">Level</th>
                <th className="p-3">Event ID</th>
                <th className="p-3">Source IP</th>
                <th className="p-3">Destination IP</th>
                <th className="p-3">User / Host</th>
                <th className="p-3">Raw Payload</th>
                <th className="p-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 text-slate-400 whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="p-3 font-semibold text-cyan-400">{log.source}</td>
                  <td className="p-3">{getLevelBadge(log.log_level)}</td>
                  <td className="p-3 text-slate-300 font-bold">{log.event_id || 'N/A'}</td>
                  <td className="p-3 text-rose-400">{log.source_ip || 'N/A'}</td>
                  <td className="p-3 text-emerald-400">{log.destination_ip || 'N/A'}</td>
                  <td className="p-3 text-slate-300">{log.user_affected || log.hostname || 'System'}</td>
                  <td className="p-3 max-w-xs truncate text-slate-400 font-mono" title={log.raw_message}>
                    {log.raw_message}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="p-1 rounded bg-slate-900 border border-slate-700 text-slate-400 hover:text-cyan-400 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Log Detail Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl rounded-xl border border-slate-700 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" /> SIEM Log Inspector #{selectedLog.id}
              </h3>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-slate-500">Source:</span> <span className="text-cyan-400 font-bold">{selectedLog.source}</span></div>
              <div><span className="text-slate-500">Level:</span> {getLevelBadge(selectedLog.log_level)}</div>
              <div><span className="text-slate-500">Source IP:</span> <span className="text-rose-400 font-mono">{selectedLog.source_ip}</span></div>
              <div><span className="text-slate-500">Destination IP:</span> <span className="text-emerald-400 font-mono">{selectedLog.destination_ip}</span></div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 mb-1">Raw Event Payload:</p>
              <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                {selectedLog.raw_message}
              </pre>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
