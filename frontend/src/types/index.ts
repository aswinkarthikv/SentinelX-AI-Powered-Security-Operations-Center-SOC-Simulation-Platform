export interface User {
  id: number;
  username: string;
  email: string;
  role: 'Admin' | 'SOC Analyst' | 'Security Engineer' | 'Viewer';
  department: string;
  avatar_url?: string;
  created_at: string;
  last_login?: string;
}

export interface Log {
  id: number;
  timestamp: string;
  source: 'Windows' | 'Linux' | 'Firewall' | 'IDS' | 'WebServer' | 'Cloud';
  log_level: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  event_id?: string;
  source_ip?: string;
  destination_ip?: string;
  user_affected?: string;
  hostname?: string;
  raw_message: string;
  parsed_data?: Record<string, any>;
  normalized_category?: string;
}

export interface Alert {
  id: number;
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  status: 'Open' | 'Investigating' | 'Resolved' | 'False Positive';
  rule_name?: string;
  rule_id?: number;
  log_id?: number;
  mitre_technique_id?: string;
  mitre_tactic?: string;
  source_ip?: string;
  destination_ip?: string;
  affected_asset?: string;
  created_at: string;
}

export interface TimelineEvent {
  timestamp: string;
  event: string;
  actor: string;
}

export interface EvidenceItem {
  type: string;
  log_id?: number;
  source_ip?: string;
  raw_log?: string;
}

export interface IncidentNote {
  timestamp: string;
  author: string;
  text: string;
}

export interface Incident {
  id: number;
  title: string;
  description: string;
  status: 'New' | 'Assigned' | 'Investigating' | 'Contained' | 'Resolved' | 'Closed';
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  assigned_to_id?: number;
  assigned_to_username?: string;
  created_at: string;
  updated_at: string;
  sla_expire_at?: string;
  timeline: TimelineEvent[];
  evidence: EvidenceItem[];
  notes: IncidentNote[];
}

export interface DetectionRule {
  id: number;
  name: string;
  description: string;
  rule_type: 'Sigma' | 'Custom' | 'Regex';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  category: string;
  mitre_technique_id?: string;
  mitre_tactic?: string;
  sigma_yaml?: string;
  condition_expression?: string;
  enabled: boolean;
  created_at: string;
}

export interface ThreatIOC {
  id: number;
  ioc_value: string;
  ioc_type: 'IP' | 'Domain' | 'URL' | 'Hash';
  reputation_score: number;
  confidence_score: number;
  risk_level: 'Malicious' | 'Suspicious' | 'Safe' | 'Unknown';
  threat_actor?: string;
  malware_family?: string;
  country?: string;
  provider_source: string;
  created_at: string;
}

export interface MITRETechnique {
  id: string;
  name: string;
  description: string;
  covered: boolean;
}

export interface MITRETactic {
  id: string;
  name: string;
  techniques: MITRETechnique[];
}

export interface DashboardStats {
  total_logs: number;
  active_alerts: number;
  critical_alerts: number;
  total_incidents: number;
  open_incidents: number;
  threat_score: number;
  mttd: string;
  mttr: string;
  security_score: number;
  mitre_coverage_percentage: number;
}

export interface SearchResult {
  category: string;
  title: string;
  subtitle: string;
  link: string;
}
