import React, { useState } from 'react';
import { Shield, Search, Bell, Sparkles, User as UserIcon, LogOut, Terminal, Activity } from 'lucide-react';
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

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-[#080c14]/90 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between">
        {/* Left Brand Title */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 pulse-cyan">
            <Shield className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-slate-100 tracking-wider">SENTINEL<span className="text-cyan-400">X</span></h1>
              <span className="px-2 py-0.5 text-[10px] uppercase tracking-widest font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 rounded">ENTERPRISE SOC</span>
            </div>
            <p className="text-[11px] text-slate-400">Security Operations Center Simulation Platform</p>
          </div>
        </div>

        {/* Center Live Threat Bar */}
        <div className="hidden md:flex items-center gap-4 bg-slate-900/90 border border-slate-800 px-4 py-1.5 rounded-full text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-slate-300 font-medium flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-emerald-400" /> SIEM Pipeline Active
            </span>
          </div>
          <div className="h-4 w-px bg-slate-800"></div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Threat Level:</span>
            <span className={`font-bold ${threatScore > 70 ? 'text-rose-400' : 'text-amber-400'}`}>
              {threatScore > 70 ? 'ELEVATED (HIGH)' : 'MODERATE'}
            </span>
          </div>
        </div>

        {/* Right Tools & Profile */}
        <div className="flex items-center gap-3">
          {/* Global Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:border-slate-700 transition"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Search (Cmd+K)</span>
          </button>

          {/* AI Security Analyst Drawer Toggle */}
          <button
            onClick={onToggleAIChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600/30 to-cyan-600/30 border border-purple-500/40 text-xs font-semibold text-purple-300 hover:border-purple-400 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin-slow" />
            <span>AI Analyst</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 glass-panel rounded-xl border border-slate-800 p-4 shadow-2xl z-50">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <h4 className="text-xs font-semibold text-slate-200">Real-Time Alerts</h4>
                  <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">3 New</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-red-300">
                    <p className="font-semibold">Critical SQL Injection</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Target: WEB-PROD-01 from 185.220.101.5</p>
                  </div>
                  <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300">
                    <p className="font-semibold">Brute Force Velocity Warning</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Target: DC-01 Account 'admin'</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-xs">
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-slate-200">{user?.username || 'Analyst'}</p>
              <p className="text-[10px] text-cyan-400">{user?.role || 'SOC Analyst'}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
