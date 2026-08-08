import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { ShieldCheck, Plus, CheckCircle2, XCircle, Code2, Play } from 'lucide-react';
import { DetectionRule } from '../types';
import { api } from '../services/api';

export const RulesPage: React.FC = () => {
  const [rules, setRules] = useState<DetectionRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Rule Form State
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [severity, setSeverity] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('High');
  const [category, setCategory] = useState('Custom');
  const [mitreId, setMitreId] = useState('T1110');
  const [sigmaYaml, setSigmaYaml] = useState('title: Custom Rule Example\nstatus: production\nlevel: high');

  const fetchRules = () => {
    setLoading(true);
    api.getRules()
      .then(setRules)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleToggle = (id: number) => {
    api.toggleRule(id).then(fetchRules).catch(console.error);
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    api.createRule({
      name,
      description: desc,
      rule_type: 'Sigma',
      severity,
      category,
      mitre_technique_id: mitreId,
      sigma_yaml: sigmaYaml,
      condition_expression: "'failed' in raw_message.lower()"
    }).then(() => {
      setShowCreateModal(false);
      fetchRules();
    }).catch(console.error);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 tracking-tight">Detection Rules Engine (Sigma Rules)</h1>
          <p className="text-xs text-slate-400">Configure automated threat detection signatures and Sigma rule matching</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Custom Sigma Rule
        </button>
      </div>

      {/* Rules Table */}
      <GlassCard className="p-0 border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f172a] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Status</th>
                <th className="p-4">Rule Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Severity</th>
                <th className="p-4">MITRE ATT&CK</th>
                <th className="p-4">Type</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4">
                    <button
                      onClick={() => handleToggle(rule.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition ${
                        rule.enabled
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {rule.enabled ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{rule.enabled ? 'ENABLED' : 'DISABLED'}</span>
                    </button>
                  </td>
                  <td className="p-4 font-semibold text-slate-100 max-w-xs">
                    {rule.name}
                    <p className="text-[11px] text-slate-400 font-normal line-clamp-1 mt-0.5">{rule.description}</p>
                  </td>
                  <td className="p-4 font-mono text-cyan-400">{rule.category}</td>
                  <td className="p-4"><Badge variant={rule.severity.toLowerCase() as any}>{rule.severity}</Badge></td>
                  <td className="p-4 font-mono text-slate-300 font-bold">{rule.mitre_technique_id || 'N/A'}</td>
                  <td className="p-4"><span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-mono">{rule.rule_type}</span></td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggle(rule.id)}
                      className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 text-xs transition"
                    >
                      Toggle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Create Rule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-xl rounded-xl border border-slate-700 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" /> Create Custom Sigma Rule
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Rule Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <input
                  type="text"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Severity</label>
                  <select
                    value={severity}
                    onChange={(e: any) => setSeverity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">MITRE Tech ID</label>
                  <input
                    type="text"
                    value={mitreId}
                    onChange={(e) => setMitreId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Sigma YAML Spec</label>
                <textarea
                  rows={4}
                  value={sigmaYaml}
                  onChange={(e) => setSigmaYaml(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-emerald-400 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                >
                  Save & Deploy Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
