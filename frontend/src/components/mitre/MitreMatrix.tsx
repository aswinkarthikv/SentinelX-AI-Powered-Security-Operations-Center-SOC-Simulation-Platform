import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { Grid, ShieldCheck, ArrowRight, Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import { MITRETactic, MITRETechnique } from '../../types';
import { api } from '../../services/api';

export const MitreMatrix: React.FC = () => {
  const [matrix, setMatrix] = useState<MITRETactic[]>([]);
  const [coverage, setCoverage] = useState<{ total_techniques: number; covered_techniques: number; coverage_percentage: number }>({
    total_techniques: 20,
    covered_techniques: 15,
    coverage_percentage: 75.0
  });
  const [attackChain, setAttackChain] = useState<any[]>([]);
  const [selectedTechnique, setSelectedTechnique] = useState<MITRETechnique | null>(null);
  const [activeTab, setActiveTab] = useState<'matrix' | 'chain'>('matrix');

  useEffect(() => {
    api.getMitreMatrix().then(setMatrix).catch(console.error);
    api.getMitreCoverage().then(setCoverage).catch(console.error);
    api.getAttackChain().then(setAttackChain).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Coverage Scorecard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="flex items-center justify-between border-cyan-500/30">
          <div>
            <p className="text-xs uppercase font-bold text-slate-400">Total Matrix Techniques</p>
            <h3 className="text-2xl font-extrabold text-slate-100 font-mono mt-1">{coverage.total_techniques}</h3>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Grid className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard className="flex items-center justify-between border-emerald-500/30">
          <div>
            <p className="text-xs uppercase font-bold text-slate-400">Active Rule Coverage</p>
            <h3 className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">{coverage.covered_techniques}</h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard className="flex items-center justify-between border-purple-500/30">
          <div>
            <p className="text-xs uppercase font-bold text-slate-400">ATT&CK Coverage Score</p>
            <h3 className="text-2xl font-extrabold text-purple-400 font-mono mt-1">{coverage.coverage_percentage}%</h3>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </GlassCard>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'matrix' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          MITRE ATT&CK Matrix Grid
        </button>
        <button
          onClick={() => setActiveTab('chain')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'chain' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Attack Kill Chain Visualizer
        </button>
      </div>

      {/* Matrix Tab */}
      {activeTab === 'matrix' && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1200px]">
            {matrix.map((tactic) => (
              <div key={tactic.id} className="w-60 flex-shrink-0 space-y-2">
                <div className="p-3 rounded-xl bg-[#0f172a] border border-slate-800 text-center">
                  <h4 className="text-xs font-bold text-slate-200">{tactic.name}</h4>
                  <p className="text-[10px] text-cyan-400 font-mono mt-0.5">{tactic.id}</p>
                </div>

                <div className="space-y-2">
                  {tactic.techniques.map((tech) => (
                    <div
                      key={tech.id}
                      onClick={() => setSelectedTechnique(tech)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                        tech.covered
                          ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-400 text-slate-200'
                          : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-400 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[10px] font-mono text-cyan-400">{tech.id}</span>
                        {tech.covered ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-emerald"></span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                        )}
                      </div>
                      <p className="font-semibold leading-tight line-clamp-2">{tech.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attack Chain Tab */}
      {activeTab === 'chain' && (
        <GlassCard className="p-6 border border-slate-800">
          <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" /> Multi-Stage Adversary Kill Chain Execution Flow
          </h3>
          <div className="space-y-4">
            {attackChain.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center font-extrabold text-rose-400 text-xs">
                  0{step.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="critical">{step.tactic}</Badge>
                    <span className="text-xs font-mono font-bold text-cyan-400">{step.technique_id} - {step.technique_name}</span>
                    <span className="text-[10px] text-slate-500 ml-auto">{new Date(step.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Technique Detail Modal */}
      {selectedTechnique && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-xl rounded-xl border border-slate-700 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400">{selectedTechnique.id}</span>
                <h3 className="text-sm font-bold text-slate-100">{selectedTechnique.name}</h3>
              </div>
              <button onClick={() => setSelectedTechnique(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{selectedTechnique.description}</p>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <span className="text-slate-400 font-semibold">Detection Engine Status:</span>{' '}
              {selectedTechnique.covered ? (
                <span className="text-emerald-400 font-bold">COVERED BY SIGMA RULE ENGINE</span>
              ) : (
                <span className="text-amber-400 font-bold">NO ACTIVE RULE (GAP DETECTED)</span>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedTechnique(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
