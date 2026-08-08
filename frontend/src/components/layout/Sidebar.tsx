import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Terminal, 
  ShieldCheck, 
  Grid, 
  Globe, 
  Bot, 
  AlertTriangle, 
  FileSpreadsheet, 
  FileCode2,
  FileText,
  Activity
} from 'lucide-react';
import { clsx } from 'clsx';

export const Sidebar: React.FC = () => {
  const navItems = [
    { label: 'SOC Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'SIEM Live Stream', path: '/siem', icon: Terminal, badge: 'LIVE' },
    { label: 'Detection Rules', path: '/rules', icon: ShieldCheck },
    { label: 'MITRE ATT&CK', path: '/mitre-attack', icon: Grid },
    { label: 'Threat Intel (CTI)', path: '/threat-intel', icon: Globe },
    { label: 'AI Security Analyst', path: '/ai-analyst', icon: Bot, badge: 'AI' },
    { label: 'Incident Response', path: '/incidents', icon: AlertTriangle, badge: '3' },
    { label: 'Reports & Analytics', path: '/reports', icon: FileSpreadsheet },
    { label: 'Audit Trail', path: '/audit-logs', icon: FileText }
  ];

  return (
    <aside className="w-64 bg-[#080c14] border-r border-slate-800/80 flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)] select-none">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">SOC PLATFORM MENU</p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150',
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-500/5 text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={clsx(
                    'px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider',
                    item.badge === 'LIVE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse' :
                    item.badge === 'AI' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                    'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  )}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* API Docs quick link */}
        <div className="pt-4 border-t border-slate-800/80">
          <p className="px-3 text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">DEVELOPER ACCESS</p>
          <a
            href="http://127.0.0.1:5000/api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-cyan-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition"
          >
            <div className="flex items-center gap-3">
              <FileCode2 className="w-4 h-4 text-cyan-400" />
              <span>OpenAPI / Swagger</span>
            </div>
            <span className="text-[10px] text-cyan-400">DOCS</span>
          </a>
        </div>
      </div>

      {/* Footer SOC Status Card */}
      <div className="glass-panel p-3 rounded-xl border border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200">SentinelX Engine</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-tight">
          Logs Ingested: <span className="text-slate-200 font-mono font-bold">14,289</span>/min<br />
          Latency: <span className="text-emerald-400 font-mono">1.2ms</span>
        </p>
      </div>
    </aside>
  );
};
