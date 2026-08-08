import React, { useState, useEffect } from 'react';
import { Shield, Search, Bell, Sparkles, User as UserIcon, LogOut, Terminal, Activity, Zap, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GlobalSearchModal } from './GlobalSearchModal';

interface NavbarProps {
  onToggleAIChat: () => void;
  threatScore?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleAIChat, threatScore = 74 }) => {
  const { user, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [eventRate, setEventRate] = useState(285);

  useEffect(() => {
    const interval = setInterval(() => {
      setEventRate(prev => Math.floor(270 + Math.random() * 40));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#030712]/90 backdrop-blur-md border-b border-slate-800/80">
        {/* Top Marquee Attack Event Ticker */}
        <div className="bg-[#0b0f19] border-b border-slate-800/60 py-1 px-4 overflow-hidden flex items-center text-[10px] font-mono text-slate-400 select-none">
          <span className="flex-shrink-0 font-bold uppercase text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 mr-3 flex items-center gap-1">
            <Zap className="w-3 h-3 text-rose-400 animate-pulse" /> LIVE ATTACK STREAM:
          </span>
          <div className="overflow-hidden relative w-full">
            <div className="animate-marquee whitespace-nowrap space-x-6">
              <span className="text-slate-300">🚨 <strong className="text-rose-400">CRITICAL:</strong> SQL Injection payload matched on WEB-PROD-01 from 185.220.101.5</span>
              <span>•</span>
              <span className="text-slate-300">⚠️ <strong className="text-amber-400">WARNING:</strong> High velocity SSH login failures (4,521 req/min) on DC-01</span>
              <span>•</span>
              <span className="text-slate-300">☣️ <strong className="text-purple-400">RANSOMWARE:</strong> Wannacry_v2 process spawn suppressed on DB-CLUSTER-02</span>
              <span>•</span>
              <span className="text-slate-300">🌐 <strong className="text-cyan-400">CTI MATCH:</strong> Tor Exit Node 185.220.101.5 queried against AbuseIPDB</span>
            </div>
          </div>
        </div>

        {/* Main Navbar Controls */}
        <div className="h-16 px-6 flex items-center justify-between">
          {/* Left Brand Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 pulse-cyan">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg text-slate-100 tracking-wider">SENTINEL<span className="text-cyan-400">X</span></h1>
                <span className="px-2 py-0.5 text-[10px] uppercase tracking-widest font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 rounded-md">ENTERPRISE SOC</span>
              </div>
              <p className="text-[11px] text-slate-400">AI-Powered Security Operations Platform</p>
            </div>
          </div>

          {/* Center Telemetry & Event Velocity Meter */}
          <div className="hidden md:flex items-center gap-4 bg-slate-900/90 border border-slate-800 px-4 py-1.5 rounded-full text-xs shadow-inner">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-slate-300 font-medium flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-emerald-400" /> Velocity: <strong className="text-emerald-400 font-mono">{eventRate} eps</strong>
              </span>
            </div>
            <div className="h-4 w-px bg-slate-800"></div>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-slate-400">Threat Index:</span>
              <span className={`font-bold ${threatScore > 70 ? 'text-rose-400' : 'text-amber-400'}`}>
                {threatScore} / 100 ({threatScore > 70 ? 'ELEVATED' : 'MODERATE'})
              </span>
            </div>
          </div>

          {/* Right Tools & Profile */}
          <div className="flex items-center gap-3">
            {/* Global Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:border-cyan-500/40 hover:text-slate-200 transition"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline font-mono">Cmd + K</span>
            </button>

            {/* AI Security Analyst Toggle */}
            <button
              onClick={onToggleAIChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600/30 to-cyan-600/30 border border-purple-500/40 text-xs font-semibold text-purple-300 hover:border-purple-400 shadow-lg transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin-slow" />
              <span>AI Analyst</span>
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 glass-panel rounded-2xl border border-slate-800 p-4 shadow-2xl z-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-xs font-semibold text-slate-200">Real-Time Threat Alerts</h4>
                    <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30">3 New Alerts</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 space-y-0.5">
                      <p className="font-bold flex items-center justify-between">
                        <span>Critical SQL Injection</span>
                        <span className="text-[9px] text-red-400">Just now</span>
                      </p>
                      <p className="text-[10px] text-slate-400">Target: WEB-PROD-01 from IP 185.220.101.5</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 space-y-0.5">
                      <p className="font-bold flex items-center justify-between">
                        <span>Brute Force Velocity</span>
                        <span className="text-[9px] text-amber-400">2m ago</span>
                      </p>
                      <p className="text-[10px] text-slate-400">Target: DC-01 Account 'admin'</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-extrabold text-xs pulse-cyan">
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-200">{user?.username || 'Aswin Karthik'}</p>
                <p className="text-[10px] text-cyan-400 font-mono">{user?.role || 'Senior SOC Analyst'}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
