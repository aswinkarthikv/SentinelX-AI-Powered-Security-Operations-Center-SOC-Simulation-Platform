import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { AlertTriangle, Clock, User, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Incident } from '../../types';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export const IncidentKanban: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchIncidents = () => {
    setLoading(true);
    api.getIncidents()
      .then(setIncidents)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const columns = ['New', 'Assigned', 'Investigating', 'Contained', 'Resolved', 'Closed'];

  const getPriorityBadge = (prio: string) => {
    switch (prio) {
      case 'P1': return <Badge variant="critical">P1 CRITICAL</Badge>;
      case 'P2': return <Badge variant="high">P2 HIGH</Badge>;
      case 'P3': return <Badge variant="medium">P3 MEDIUM</Badge>;
      default: return <Badge variant="low">P4 LOW</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" /> Incident Response Workflow Board
          </h2>
          <p className="text-xs text-slate-400">Enterprise SOC incident lifecycle and SLA tracking</p>
        </div>
        <button
          onClick={fetchIncidents}
          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-cyan-400"
        >
          Refresh Board
        </button>
      </div>

      {/* Kanban Board Grid */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1200px]">
          {columns.map((col) => {
            const colIncidents = incidents.filter(i => i.status === col);
            return (
              <div key={col} className="w-72 flex-shrink-0 space-y-3">
                {/* Column Header */}
                <div className="p-3 rounded-xl bg-[#0f172a] border border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">{col}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400">
                    {colIncidents.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-3">
                  {colIncidents.map((incident) => (
                    <GlassCard
                      key={incident.id}
                      onClick={() => navigate(`/incidents/${incident.id}`)}
                      className="p-4 border-slate-800 cursor-pointer space-y-3 hover:border-cyan-500/40"
                    >
                      <div className="flex items-center justify-between">
                        {getPriorityBadge(incident.priority)}
                        <span className="text-[10px] text-slate-500 font-mono">#{incident.id}</span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-100 line-clamp-2 leading-snug">
                        {incident.title}
                      </h4>

                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        {incident.description}
                      </p>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="flex items-center gap-1 text-rose-400">
                          <Clock className="w-3 h-3" /> SLA: 45m
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-cyan-400">
                          <User className="w-3 h-3" /> {incident.assigned_to_username || 'Unassigned'}
                        </span>
                      </div>
                    </GlassCard>
                  ))}
                  {colIncidents.length === 0 && (
                    <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center text-slate-600 text-xs py-8">
                      No incidents in {col}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
