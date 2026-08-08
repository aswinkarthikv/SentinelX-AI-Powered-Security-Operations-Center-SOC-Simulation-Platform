import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Bot, Send, Sparkles, X, Terminal, Shield, FileText, Zap, Copy, Check } from 'lucide-react';
import { api } from '../../services/api';

interface AIChatDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  standalone?: boolean;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({ isOpen = true, onClose, standalone = false }) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: "### 🛡️ SentinelX AI Security Analyst Ready\n\nGreetings Senior Analyst **Aswin Karthik**. I am your AI SOC Assistant powered by Claude-3.5 Sonnet / Gemini API model.\n\nHow can I assist with threat triage, Linux/Windows containment playbooks, or executive summaries today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleSend = async (promptToSend?: string) => {
    const prompt = promptToSend || input;
    if (!prompt.trim() || loading) return;

    const newMessages = [...messages, { role: 'user' as const, content: prompt }];
    setMessages(newMessages);
    if (!promptToSend) setInput('');
    setLoading(true);

    try {
      const res = await api.askAIAnalyst(prompt);
      setMessages([...newMessages, { role: 'assistant', content: res.response }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: '⚠️ Unable to connect to AI Analyst service.' }]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const quickPrompts = [
    "Explain critical SQL injection alert",
    "Generate containment playbook for IP 185.220.101.5",
    "Suggest remediation steps for Brute Force SSH",
    "Generate executive SOC summary report"
  ];

  if (!standalone && !isOpen) return null;

  const content = (
    <div className="h-full flex flex-col justify-between space-y-4">
      {/* Drawer Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 pulse-purple">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <span>SentinelX AI Security Analyst</span>
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin-slow" />
            </h3>
            <p className="text-[10px] text-purple-300 font-mono">Claude-3.5 Sonnet / Gemini API Model</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[500px]">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] p-4 rounded-2xl text-xs space-y-2 leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-cyan-600/30 border border-cyan-500/40 text-cyan-100 shadow-md'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 shadow-xl'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800/60 pb-1 mb-2">
                <span className="font-mono font-bold text-cyan-400">{msg.role === 'user' ? 'Aswin Karthik' : 'SentinelX AI Assistant'}</span>
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => copyToClipboard(msg.content, idx)}
                    className="flex items-center gap-1 text-[10px] text-purple-400 hover:text-purple-300 transition"
                  >
                    {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>
              <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-purple-400 animate-pulse p-2">
            <Bot className="w-4 h-4" />
            <span>AI Analyst synthesizing threat payload...</span>
          </div>
        )}
      </div>

      {/* Quick Action Pills */}
      <div className="flex flex-wrap gap-1.5">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:border-purple-500/40 hover:text-purple-300 transition"
          >
            ⚡ {qp}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="flex gap-2 border-t border-slate-800 pt-3">
        <input
          type="text"
          placeholder="Ask AI Analyst to explain alerts, build containment bash scripts..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 font-sans"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center gap-1 shadow-lg"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  if (standalone) {
    return <GlassCard className="p-6 border-purple-500/30">{content}</GlassCard>;
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md glass-panel border-l border-purple-500/30 p-6 shadow-2xl">
      {content}
    </div>
  );
};
