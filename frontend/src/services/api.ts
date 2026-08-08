import { User, Log, Alert, Incident, DetectionRule, ThreatIOC, MITRETactic, DashboardStats, SearchResult } from '../types';

const API_BASE = '/api';

// In-Memory Storage & Simulation State for GitHub Pages Static Deployment Mode
let mockLogs: Log[] = [
  {
    id: 101,
    timestamp: new Date().toISOString(),
    source: 'Windows',
    log_level: 'WARNING',
    event_id: '4625',
    source_ip: '185.220.101.5',
    destination_ip: '10.0.0.50',
    user_affected: 'admin',
    hostname: 'DC-01.corp.internal',
    raw_message: 'An account failed to log on. Attempt #1 for user admin from IP 185.220.101.5'
  },
  {
    id: 102,
    timestamp: new Date(Date.now() - 30000).toISOString(),
    source: 'WebServer',
    log_level: 'CRITICAL',
    event_id: 'HTTP_500',
    source_ip: '185.220.101.5',
    destination_ip: '10.0.0.50',
    user_affected: 'anonymous',
    hostname: 'WEB-PROD-01',
    raw_message: '185.220.101.5 - - GET /api/users?search=\' OR \'1\'=\'1 HTTP/1.1 500 SQL syntax error near \'1\'=\'1'
  },
  {
    id: 103,
    timestamp: new Date(Date.now() - 60000).toISOString(),
    source: 'Linux',
    log_level: 'CRITICAL',
    event_id: 'PROCESS_SPAWN',
    source_ip: '10.0.0.50',
    destination_ip: '185.190.140.23',
    user_affected: 'root',
    hostname: 'DB-CLUSTER-02',
    raw_message: 'CRITICAL: Executable /tmp/wannacry_v2 spawned. Mass file renaming detected: .locked extension applied to 4,500 files in /var/db'
  }
];

let mockIncidents: Incident[] = [
  {
    id: 1,
    title: 'Security Incident: SQL Injection Detected on WEB-PROD-01',
    description: 'Automated incident generated from Critical alert SQL Injection Pattern Detected. Attacker IP: 185.220.101.5',
    status: 'Investigating',
    priority: 'P1',
    severity: 'Critical',
    assigned_to_id: 1,
    assigned_to_username: 'Analyst Karthik',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date().toISOString(),
    sla_expire_at: new Date(Date.now() + 3600000).toISOString(),
    timeline: [
      { timestamp: new Date(Date.now() - 7200000).toISOString(), event: 'Incident created automatically by SentinelX Engine', actor: 'System' },
      { timestamp: new Date(Date.now() - 3600000).toISOString(), event: 'Assigned to Analyst Karthik for triage', actor: 'Admin' }
    ],
    evidence: [
      { type: 'Log Artifact', log_id: 102, source_ip: '185.220.101.5', raw_log: 'GET /api/users?search=\' OR \'1\'=\'1 HTTP/1.1 500 SQL syntax error' }
    ],
    notes: [
      { timestamp: new Date(Date.now() - 1800000).toISOString(), author: 'Analyst Karthik', text: 'Confirmed SQL injection payload targeting user search endpoint. Initiating web application firewall rule.' }
    ]
  },
  {
    id: 2,
    title: 'Security Incident: Brute Force Velocity Warning on DC-01',
    description: 'High frequency failed SSH/RDP logins detected from IP 185.220.101.5 targeting domain admin account.',
    status: 'New',
    priority: 'P2',
    severity: 'High',
    created_at: new Date(Date.now() - 14400000).toISOString(),
    updated_at: new Date().toISOString(),
    timeline: [
      { timestamp: new Date(Date.now() - 14400000).toISOString(), event: 'Incident created by Sigma Rule match', actor: 'System' }
    ],
    evidence: [
      { type: 'Event ID 4625', source_ip: '185.220.101.5', raw_log: 'Multiple failed authentication attempts for user admin' }
    ],
    notes: []
  }
];

let mockRules: DetectionRule[] = [
  {
    id: 1,
    name: 'Multiple Failed Authentication Attempts (Brute Force)',
    description: 'Detects high frequency of failed login attempts from a single source IP indicating credential brute force.',
    rule_type: 'Sigma',
    severity: 'High',
    category: 'Brute Force',
    mitre_technique_id: 'T1110',
    enabled: true,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'SQL Injection Pattern Detected in Web Logs',
    description: 'Identifies common SQL injection signatures such as UNION SELECT, OR 1=1, or SQL error messages.',
    rule_type: 'Custom',
    severity: 'Critical',
    category: 'SQL Injection',
    mitre_technique_id: 'T1190',
    enabled: true,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Ransomware Mass Encryption Activity',
    description: 'Detects rapid creation of encrypted file extensions or unauthorized process spawning.',
    rule_type: 'Sigma',
    severity: 'Critical',
    category: 'Ransomware',
    mitre_technique_id: 'T1486',
    enabled: true,
    created_at: new Date().toISOString()
  }
];

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

  try {
    const response = await fetch(`${API_BASE}${url}`, { ...options, headers });
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    // Network failure / Static site fallback
  }

  // Handle Client-Side Static Fallbacks
  return handleStaticFallback<T>(url, options);
}

function handleStaticFallback<T>(url: string, options: RequestInit): T {
  const u = url.split('?')[0];

  if (u.includes('/auth/login') || u.includes('/auth/register') || u.includes('/auth/me')) {
    return {
      access_token: 'static-demo-token-sentinelx',
      refresh_token: 'static-refresh-token',
      user: {
        id: 1,
        username: 'Aswin Karthik',
        email: 'karthik@sentinelx.soc',
        role: 'SOC Analyst',
        department: 'Cyber Defense Operations',
        created_at: new Date().toISOString()
      }
    } as any;
  }

  if (u.includes('/dashboard/stats')) {
    return {
      total_logs: mockLogs.length + 14200,
      active_alerts: 42,
      critical_alerts: 7,
      total_incidents: mockIncidents.length,
      open_incidents: mockIncidents.filter(i => i.status !== 'Closed').length,
      threat_score: 74,
      mttd: '3.5 mins',
      mttr: '14.2 mins',
      security_score: 70.4,
      mitre_coverage_percentage: 75.0
    } as any;
  }

  if (u.includes('/dashboard/attack-timeline')) {
    return {
      labels: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
      datasets: [
        { label: 'Brute Force', data: [12, 19, 3, 5, 2, 20, 35, 42, 28, 15, 10, 8] },
        { label: 'SQL Injection', data: [1, 5, 10, 2, 0, 4, 12, 18, 9, 4, 2, 1] },
        { label: 'Port Scan', data: [45, 60, 52, 30, 25, 40, 75, 90, 110, 85, 60, 45] }
      ]
    } as any;
  }

  if (u.includes('/dashboard/geo-map')) {
    return [
      { country: 'Russia', code: 'RU', lat: 55.7558, lng: 37.6173, attacks: 1420, threat_level: 'Critical' },
      { country: 'China', code: 'CN', lat: 39.9042, lng: 116.4074, attacks: 980, threat_level: 'High' },
      { country: 'United States', code: 'US', lat: 37.0902, lng: -95.7129, attacks: 430, threat_level: 'Medium' },
      { country: 'Netherlands', code: 'NL', lat: 52.3676, lng: 4.9041, attacks: 310, threat_level: 'High' },
      { country: 'Brazil', code: 'BR', lat: -14.2350, lng: -51.9253, attacks: 210, threat_level: 'Medium' }
    ] as any;
  }

  if (u.includes('/dashboard/analyst-queue') || (u.includes('/incidents') && options.method !== 'POST' && options.method !== 'PUT')) {
    if (u.match(/\/incidents\/\d+/)) {
      const parts = u.split('/');
      const incId = parseInt(parts[parts.length - 1]);
      const found = mockIncidents.find(i => i.id === incId) || mockIncidents[0];
      return found as any;
    }
    return mockIncidents as any;
  }

  if (u.includes('/siem/logs')) {
    return {
      logs: mockLogs,
      total: mockLogs.length,
      pages: 1,
      current_page: 1
    } as any;
  }

  if (u.includes('/siem/simulate')) {
    const body = options.body ? JSON.parse(options.body as string) : {};
    const attack = body.attack_type || 'brute_force';

    const newLog: Log = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      source: attack === 'sqli' ? 'WebServer' : (attack === 'ransomware' ? 'Linux' : 'Windows'),
      log_level: 'CRITICAL',
      event_id: attack === 'sqli' ? 'HTTP_500' : '4625',
      source_ip: '185.220.101.5',
      destination_ip: '10.0.0.50',
      user_affected: 'admin',
      hostname: 'WEB-PROD-01',
      raw_message: `SIMULATED ATTACK [${attack.toUpperCase()}]: Inbound threat activity detected from 185.220.101.5`
    };
    mockLogs.unshift(newLog);

    return {
      message: `Successfully ingested simulated ${attack} attack logs.`,
      alerts_triggered: 1,
      logs: [newLog]
    } as any;
  }

  if (u.includes('/rules')) {
    return mockRules as any;
  }

  if (u.includes('/mitre/matrix')) {
    return [
      {
        id: "TA0001",
        name: "Initial Access",
        techniques: [
          { id: "T1190", name: "Exploit Public-Facing Application", description: "Exploiting web application vulnerabilities (SQLi, XSS).", covered: true },
          { id: "T1566", name: "Phishing", description: "Spearphishing attachment or link.", covered: true }
        ]
      },
      {
        id: "TA0002",
        name: "Execution",
        techniques: [
          { id: "T1059", name: "Command and Scripting Interpreter", description: "Execution via PowerShell, Bash, or cmd.", covered: true }
        ]
      },
      {
        id: "TA0006",
        name: "Credential Access",
        techniques: [
          { id: "T1110", name: "Brute Force", description: "Password guessing or spraying against SSH/RDP/Web.", covered: true }
        ]
      },
      {
        id: "TA0040",
        name: "Impact",
        techniques: [
          { id: "T1486", name: "Data Encrypted for Impact", description: "Ransomware encryption of enterprise host data.", covered: true }
        ]
      }
    ] as any;
  }

  if (u.includes('/mitre/coverage')) {
    return { total_techniques: 20, covered_techniques: 15, coverage_percentage: 75.0 } as any;
  }

  if (u.includes('/mitre/attack-chain')) {
    return [
      { step: 1, tactic: 'Initial Access', technique_id: 'T1566', technique_name: 'Phishing', timestamp: new Date().toISOString(), description: 'Phishing attachment Invoice_AUG2026.docm executed by user' },
      { step: 2, tactic: 'Execution', technique_id: 'T1059', technique_name: 'PowerShell', timestamp: new Date().toISOString(), description: 'Obfuscated C2 beacon payload execution' },
      { step: 3, tactic: 'Impact', technique_id: 'T1486', technique_name: 'Ransomware', timestamp: new Date().toISOString(), description: 'Ransomware WannaCry_v2 deployed across server cluster' }
    ] as any;
  }

  if (u.includes('/threat-intel/lookup')) {
    return {
      id: 1,
      ioc_value: '185.220.101.5',
      ioc_type: 'IP',
      reputation_score: 92,
      confidence_score: 95,
      risk_level: 'Malicious',
      threat_actor: 'APT29 (Cozy Bear)',
      malware_family: 'Cobalt Strike / TOR Exit Node',
      country: 'Russia',
      provider_source: 'AbuseIPDB & VirusTotal',
      created_at: new Date().toISOString()
    } as any;
  }

  if (u.includes('/ai-analyst/chat')) {
    const body = options.body ? JSON.parse(options.body as string) : {};
    const p = (body.prompt || '').toLowerCase();

    let resp = "### 🛡️ SentinelX AI Analyst Assistant Response\n\n" +
      "**SOC Analysis**:\n" +
      "1. **Triage Classification**: Signature indicates high-velocity inbound adversary activity.\n" +
      "2. **MITRE ATT&CK Mapping**: Associated with **T1110 (Brute Force)** and **T1190 (Exploit Public Application)**.\n" +
      "3. **Recommended Actions**:\n" +
      "   - Execute network block script for IP 185.220.101.5\n" +
      "   - Revoke active session tokens for user admin.";

    if (p.includes("explain") || p.includes("sql")) {
      resp = "### 🔍 SQL Injection Threat Breakdown\n\n" +
        "The alert triggered because an HTTP GET request contained SQL injection payload `' OR '1'='1`. " +
        "This signature attempts to bypass authentication by coercing the SQL logic statement to evaluate to TRUE.\n\n" +
        "**Mitigation**: Deploy parameterization on backend database queries.";
    } else if (p.includes("contain") || p.includes("script")) {
      resp = "### ⚡ SentinelX Immediate Containment Playbook\n\n" +
        "```bash\n# Block IP on Linux Firewall\nsudo iptables -A INPUT -s 185.220.101.5 -j DROP\n```\n\n" +
        "```powershell\n# Block IP on Windows Firewall\nNew-NetFirewallRule -DisplayName 'SentinelX_Block' -Direction Inbound -Action Block -RemoteAddress 185.220.101.5\n```";
    }

    return { prompt: body.prompt, response: resp } as any;
  }

  if (u.includes('/reports/generate')) {
    return {
      report_type: 'Daily SOC Report',
      generated_at: new Date().toISOString(),
      summary: {
        total_alerts: 42,
        critical_alerts: 7,
        total_incidents: mockIncidents.length,
        threat_score: 74
      }
    } as any;
  }

  if (u.includes('/search')) {
    return {
      query: '185.220.101.5',
      results: [
        { category: 'Alert', title: 'Alert: SQL Injection Pattern Detected', subtitle: 'Severity: Critical | IP: 185.220.101.5', link: '/dashboard' },
        { category: 'Incident', title: 'Security Incident #1', subtitle: 'Status: Investigating | Priority: P1', link: '/incidents/1' },
        { category: 'Threat IOC', title: '185.220.101.5', subtitle: 'Type: IP | Risk: Malicious', link: '/threat-intel' }
      ]
    } as any;
  }

  return {} as T;
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
  updateIncidentStatus: (id: number, status: string, username: string) => {
    const inc = mockIncidents.find(i => i.id === id);
    if (inc) {
      inc.status = status as any;
      inc.updated_at = new Date().toISOString();
      inc.timeline.push({
        timestamp: new Date().toISOString(),
        event: `Status updated to ${status}`,
        actor: username
      });
    }
    return fetchJson<{ message: string; incident: Incident }>(`/incidents/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, username })
    });
  },
  addIncidentNote: (id: number, text: string, author: string) => {
    const inc = mockIncidents.find(i => i.id === id);
    if (inc) {
      inc.notes.push({
        timestamp: new Date().toISOString(),
        author,
        text
      });
    }
    return fetchJson<{ message: string; note: any }>(`/incidents/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ text, author })
    });
  },

  // Reports & Search
  generateReport: (reportType: string) => fetchJson<any>(`/reports/generate?type=${encodeURIComponent(reportType)}`),
  getExportPdfUrl: (reportType: string) => `/api/reports/export-pdf?type=${encodeURIComponent(reportType)}`,
  globalSearch: (q: string) => fetchJson<{ query: string; results: SearchResult[] }>(`/search/?q=${encodeURIComponent(q)}`)
};
