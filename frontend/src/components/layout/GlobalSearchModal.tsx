import React, { useState, useEffect } from 'react';
import { Search, X, ShieldAlert, AlertTriangle, User, Globe, Grid, ExternalLink } from 'lucide-react';
import { api } from '../../services/api';
import { SearchResult } from '../../types';
import { useNavigate } from 'react-router-dom';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      api.globalSearch(query)
        .then(res => setResults(res.results))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Alert': return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'Incident': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'User': return <User className="w-4 h-4 text-cyan-400" />;
      case 'Threat IOC': return <Globe className="w-4 h-4 text-purple-400" />;
      case 'MITRE Technique': return <Grid className="w-4 h-4 text-emerald-400" />;
      default: return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="glass-panel w-full max-w-2xl rounded-xl border border-slate-700/80 overflow-hidden shadow-2xl">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            type="text"
            placeholder="Search IPs, Hashes, Domains, Users, Alerts, MITRE IDs (e.g. 185.220.101.5, T1110)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none text-slate-100 placeholder-slate-500 focus:outline-none text-sm"
            autoFocus
          />
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Stream */}
        <div className="max-h-96 overflow-y-auto p-3">
          {loading && <p className="text-xs text-slate-400 text-center py-6">Searching SOC dataset...</p>}
          {!loading && query.length >= 2 && results.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-6">No matching records found for "{query}".</p>
          )}
          {!loading && results.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                navigate(item.link);
                onClose();
              }}
              className="p-3 rounded-lg hover:bg-slate-800/80 cursor-pointer flex items-center justify-between transition border border-transparent hover:border-slate-700 mb-1"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  {getCategoryIcon(item.category)}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-100 flex items-center gap-2">
                    <span>{item.title}</span>
                    <span className="text-[10px] uppercase font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">{item.category}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.subtitle}</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
