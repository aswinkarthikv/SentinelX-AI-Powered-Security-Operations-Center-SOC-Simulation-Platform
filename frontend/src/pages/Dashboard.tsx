import React, { useState, useEffect } from 'react';
import { StatCard } from '../components/ui/StatCard';
import { AttackTimelineChart } from '../components/dashboard/AttackTimelineChart';
import { ThreatScoreGauge } from '../components/dashboard/ThreatScoreGauge';
import { GeoAttackMap } from '../components/dashboard/GeoAttackMap';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { ShieldAlert, AlertTriangle, Activity, Clock, CheckCircle2, ShieldCheck, User } from 'lucide-react';
import { DashboardStats, Incident } from '../types';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    total_logs: 14280,
    active_alerts: 42,
    critical_alerts: 7,
    total_incidents: 12,
    open_incidents: 4,
    threat_score: 74,
    mttd: '3.5 mins',
    mttr: '14.2 mins',
    security_score: 70.4,
    mitre_coverage_percentage: 75.0
  });
  const [timelineData, setTimelineData] = useState<any>(null);
  const [geoData, setGeoData] = useState<any[]>([]);
  const [queue, setQueue] = useState<Incident[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.getDashboardStats().then(setStats).catch(console.error);
    api.getAttackTimeline().then(setTimelineData).catch(console.error);
    api.getGeoMapData().then(setGeoData).catch(console.error);
    api.getAnalystQueue().then(setQueue).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 tracking-tight">Enterprise SOC Command Center</h1>
          <p className="text-xs text-slate-400">Real-time threat monitoring, automated triage, and incident metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 pulse-emerald">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> SOC Operating Normally
          </span>
        </div>
      </div>

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Alerts"
          value={stats.active_alerts}
          subtitle={`${stats.critical_alerts} Critical Severity`}
          icon={ShieldAlert}
          iconColor="text-rose-400"
          trend="+12% velocity"
          trendUp={false}
        />
        <StatCard
          title="Open Incidents"
          value={stats.open_incidents}
          subtitle={`Total: ${stats.total_incidents} triage cases`}
          icon={AlertTriangle}
          iconColor="text-amber-400"
        />
        <StatCard
          title="Mean Time To Detect (MTTD)"
          value={stats.mttd}
          subtitle="Target < 5.0 mins"
          icon={Clock}
          iconColor="text-cyan-400"
          trend="0.8m improvement"
          trendUp={true}
        />
        <StatCard
          title="MITRE Coverage"
          value={`${stats.mitre_coverage_percentage}%`}
          subtitle="15 of 20 techniques mapped"
          icon={ShieldCheck}
          iconColor="text-emerald-400"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AttackTimelineChart data={timelineData} />
        </div>
        <div>
          <ThreatScoreGauge score={stats.threat_score} />
        </div>
      </div>

      {/* Map and Queue Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GeoAttackMap data={geoData} />
        </div>

        {/* Analyst Incident Triage Queue */}
        <GlassCard className="p-5 border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs uppercase font-bold text-slate-300 tracking-wider">Analyst High Priority Queue</h3>
            <button onClick={() => navigate('/incidents')} className="text-[11px] text-cyan-400 hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {queue.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/incidents/${item.id}`)}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <Badge variant={item.severity === 'Critical' ? 'critical' : 'high'}>{item.priority}</Badge>
                  <span className="text-[10px] text-slate-500 font-mono">#{item.id}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 line-clamp-1">{item.title}</h4>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Assigned: {item.assigned_to_username || 'Analyst Karthik'}</span>
                  <span className="text-cyan-400 font-semibold">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
