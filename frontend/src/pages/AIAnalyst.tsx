import React from 'react';
import { AIChatDrawer } from '../components/ai_analyst/AIChatDrawer';

export const AIAnalystPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-100 tracking-tight">AI Security Analyst Workbench</h1>
        <p className="text-xs text-slate-400">Powered by Anthropic Claude 3.5 Sonnet / Gemini API for automated SOC triage</p>
      </div>
      <AIChatDrawer standalone={true} />
    </div>
  );
};
