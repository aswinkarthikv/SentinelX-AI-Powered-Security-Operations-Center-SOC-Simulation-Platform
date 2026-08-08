import { User, Log, Alert, Incident, DetectionRule, ThreatIOC, MITRETactic, DashboardStats, SearchResult } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('sentinelx_access_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE}${url}`, { ...options, headers });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errorData.error || `HTTP error ${response.status}`);
  }
  return response.json();
}

export const api = {
  // Auth
  login: (credentials: { username: string; password: string }) =>
    fetchJson<{ access_token: string; refresh_token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  register: (user: Partial<User> & { password: string }) =>
    fetchJson<{ message: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(user)
    }),

  getCurrentUser: () => fetchJson<{ user: User }>('/auth/me'),

  // Dashboard
  getDashboardStats: () => fetchJson<DashboardStats>('/dashboard/stats'),
  getAttackTimeline: () => fetchJson<{ labels: string[]; datasets: any[] }>('/dashboard/attack-timeline'),
  getGeoMapData: () => fetchJson<any[]>('/dashboard/geo-map'),
  getAnalystQueue: () => fetchJson<Incident[]>('/dashboard/analyst-queue'),

  // SIEM
  getLogs: (params: { page?: number; per_page?: number; source?: string; level?: string; search?: string } = {}) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchJson<{ logs: Log[]; total: number; pages: number; current_page: number }>(`/siem/logs?${query}`);
  },
  simulateAttack: (attackType: string, count: number = 1) =>
    fetchJson<{ message: string; alerts_triggered: number; logs: Log[] }>('/siem/simulate', {
      method: 'POST',
      body: JSON.stringify({ attack_type: attackType, count })
    }),
  clearLogs: () => fetchJson<{ message: string }>('/siem/clear', { method: 'POST' }),

  // Rules
  getRules: () => fetchJson<DetectionRule[]>('/rules/'),
  createRule: (rule: Partial<DetectionRule>) =>
    fetchJson<{ message: string; rule: DetectionRule }>('/rules/', {
      method: 'POST',
      body: JSON.stringify(rule)
    }),
  toggleRule: (id: number) => fetchJson<{ message: string; rule: DetectionRule }>(`/rules/${id}/toggle`, { method: 'POST' }),
  parseSigma: (yamlText: string) =>
    fetchJson<{ valid: boolean; title?: string; error?: string }>('/rules/parse-sigma', {
      method: 'POST',
      body: JSON.stringify({ yaml_text: yamlText })
    }),

  // MITRE ATT&CK
  getMitreMatrix: () => fetchJson<MITRETactic[]>('/mitre/matrix'),
  getMitreCoverage: () => fetchJson<{ total_techniques: number; covered_techniques: number; coverage_percentage: number }>('/mitre/coverage'),
  getAttackChain: () => fetchJson<any[]>('/mitre/attack-chain'),

  // Threat Intel
  lookupIOC: (ioc: string) => fetchJson<ThreatIOC>(`/threat-intel/lookup?ioc=${encodeURIComponent(ioc)}`),

  // AI Security Analyst
  askAIAnalyst: (prompt: string, alertContext?: any) =>
    fetchJson<{ prompt: string; response: string }>('/ai-analyst/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt, alert_context: alertContext })
    }),
  explainAlert: (alert: Partial<Alert>) =>
    fetchJson<{ explanation: string }>('/ai-analyst/explain-alert', {
      method: 'POST',
      body: JSON.stringify(alert)
    }),
  getContainmentPlaybook: (sourceIp: string) =>
    fetchJson<{ containment_playbook: string }>('/ai-analyst/containment', {
      method: 'POST',
      body: JSON.stringify({ source_ip: sourceIp })
    }),

  // Incidents
  getIncidents: (params: { status?: string; severity?: string } = {}) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchJson<Incident[]>(`/incidents/?${query}`);
  },
  getIncidentDetail: (id: number) => fetchJson<Incident>(`/incidents/${id}`),
  updateIncidentStatus: (id: number, status: string, username: string) =>
    fetchJson<{ message: string; incident: Incident }>(`/incidents/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, username })
    }),
  addIncidentNote: (id: number, text: string, author: string) =>
    fetchJson<{ message: string; note: any }>(`/incidents/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ text, author })
    }),

  // Reports & Search
  generateReport: (reportType: string) => fetchJson<any>(`/reports/generate?type=${encodeURIComponent(reportType)}`),
  getExportPdfUrl: (reportType: string) => `/api/reports/export-pdf?type=${encodeURIComponent(reportType)}`,
  globalSearch: (q: string) => fetchJson<{ query: string; results: SearchResult[] }>(`/search/?q=${encodeURIComponent(q)}`)
};
