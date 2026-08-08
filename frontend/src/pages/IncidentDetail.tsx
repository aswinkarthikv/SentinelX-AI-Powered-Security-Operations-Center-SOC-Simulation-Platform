import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { AlertTriangle, ArrowLeft, Clock, User, MessageSquare, Terminal, Shield, CheckCircle2 } from 'lucide-react';
import { Incident } from '../types';
import { api } from '../services/api';

export const IncidentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');

  const fetchDetail = () => {
    if (!id) return;
    setLoading(true);
    api.getIncidentDetail(parseInt(id))
      .then(setIncident)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleStatusChange = (newStatus: string) => {
    if (!incident) return;
    api.updateIncidentStatus(incident.id, newStatus, 'Analyst Karthik')
      .then(() => fetchDetail())
      .catch(console.error);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incident || !newNote.trim()) return;
    api.addIncidentNote(incident.id, newNote, 'Analyst Karthik')
      .then(() => {
        setNewNote('');
        fetchDetail();
      })
      .catch(console.error);
  };

  if (!incident) return <div className="p-8 text-xs text-slate-400">Loading incident payload #{id}...</div>;

  return (
    <div className="space-y-6">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/incidents')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Incident Response Board
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Current Status:</span>
          <span className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-xs font-bold font-mono">
            {incident.status}
          </span>
        </div>
      </div>

      {/* Main Incident Overview */}
      <GlassCard className="p-6 border-slate-800 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={incident.severity === 'Critical' ? 'critical' : 'high'}>{incident.priority}</Badge>
              <span className="text-xs font-mono font-bold text-slate-500">INCIDENT #{incident.id}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-100">{incident.title}</h1>
            <p className="text-xs text-slate-400 mt-1">{incident.description}</p>
          </div>

          {/* Workflow Actions */}
          <div className="flex flex-wrap gap-2">
            {['Investigating', 'Contained', 'Resolved', 'Closed'].map((st) => (
              <button
                key={st}
                onClick={() => handleStatusChange(st)}
                disabled={incident.status === st}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  incident.status === st
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                Mark {st}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs pt-2">
          <div><span className="text-slate-500">Created:</span> <p className="font-mono text-slate-300 mt-0.5">{new Date(incident.created_at).toLocaleString()}</p></div>
          <div><span className="text-slate-500">Assigned Analyst:</span> <p className="font-bold text-cyan-400 mt-0.5">{incident.assigned_to_username || 'Analyst Karthik'}</p></div>
          <div><span className="text-slate-500">SLA Timer:</span> <p className="font-mono font-bold text-rose-400 mt-0.5 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 42m Remaining</p></div>
          <div><span className="text-slate-500">Impact Rating:</span> <p className="font-bold text-amber-400 mt-0.5">{incident.severity}</p></div>
        </div>
      </GlassCard>

      {/* Grid: Evidence Locker & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evidence Locker */}
        <GlassCard className="p-6 border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" /> Evidence Locker Artifacts
          </h3>
          <div className="space-y-3">
            {incident.evidence.map((ev, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-cyan-400 font-bold">{ev.type}</span>
                  <span>IP: {ev.source_ip || '185.220.101.5'}</span>
                </div>
                <p className="text-slate-300 whitespace-pre-wrap">{ev.raw_log || 'Log artifact attached to incident context.'}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Timeline Events */}
        <GlassCard className="p-6 border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" /> Incident Timeline Sequence
          </h3>
          <div className="space-y-3">
            {incident.timeline.map((ev, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-semibold text-slate-200">{ev.event}</span>
                  <span className="font-mono text-[10px]">{new Date(ev.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-[10px] text-cyan-400">Actor: {ev.actor}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Notes & Comments Section */}
      <GlassCard className="p-6 border-slate-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-cyan-400" /> SOC Analyst Notes & Triage Comments
        </h3>

        <div className="space-y-3">
          {incident.notes.map((n, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-bold text-cyan-400">{n.author}</span>
                <span className="font-mono">{new Date(n.timestamp).toLocaleString()}</span>
              </div>
              <p className="text-slate-200 mt-1">{n.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddNote} className="flex gap-2 pt-2 border-t border-slate-800">
          <input
            type="text"
            placeholder="Add analyst investigation notes or playbook references..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition"
          >
            Add Note
          </button>
        </form>
      </GlassCard>
    </div>
  );
};
