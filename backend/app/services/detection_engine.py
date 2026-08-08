from datetime import datetime, timedelta
import yaml
import json
from app.extensions import db
from app.models.alert import Alert
from app.models.incident import Incident
from app.models.rule import DetectionRule

DEFAULT_RULES = [
    {
        "name": "Multiple Failed Authentication Attempts (Brute Force)",
        "description": "Detects high frequency of failed login attempts from a single source IP indicating credential brute force.",
        "rule_type": "Sigma",
        "severity": "High",
        "category": "Brute Force",
        "mitre_technique_id": "T1110",
        "mitre_tactic": "Credential Access",
        "condition_expression": "event_id == '4625' or 'failed' in raw_message.lower()",
        "sigma_yaml": """title: Brute Force Authentication Failure
id: 5f102f6e-9310-449e-b76c-31a90c1f2110
status: production
description: Detects multiple failed authentication attempts
logsource:
  category: authentication
  product: windows
detection:
  selection:
    EventID: 4625
  condition: selection
level: high"""
    },
    {
        "name": "SQL Injection Pattern Detected in Web Logs",
        "description": "Identifies common SQL injection signatures such as UNION SELECT, OR 1=1, or SQL error messages in HTTP requests.",
        "rule_type": "Custom",
        "severity": "Critical",
        "category": "SQL Injection",
        "mitre_technique_id": "T1190",
        "mitre_tactic": "Initial Access",
        "condition_expression": "'union select' in raw_message.lower() or 'or 1=1' in raw_message.lower() or 'sql syntax' in raw_message.lower()",
        "sigma_yaml": """title: Web Application SQL Injection Attempt
id: a8d93f11-1200-410a-bc99-281b94231a45
status: production
description: Detects SQL injection attempt in web server logs
logsource:
  category: web_access
detection:
  keywords:
    - "UNION SELECT"
    - "OR 1=1"
    - "DROP TABLE"
  condition: keywords
level: critical"""
    },
    {
        "name": "Ransomware Mass Encryption Activity",
        "description": "Detects rapid creation of encrypted file extensions or unauthorized process spawning in system directories.",
        "rule_type": "Sigma",
        "severity": "Critical",
        "category": "Ransomware",
        "mitre_technique_id": "T1486",
        "mitre_tactic": "Impact",
        "condition_expression": "'wannacry' in raw_message.lower() or '.locked' in raw_message.lower() or 'mass file renaming' in raw_message.lower()",
        "sigma_yaml": """title: Ransomware File Encryption Activity
id: e3124801-77b8-4e12-9c10-5819aa400192
status: production
description: Detects ransomware behavior and file encryption
logsource:
  category: process_creation
detection:
  selection:
    Image|endswith:
      - 'wannacry.exe'
      - 'vssadmin.exe'
  condition: selection
level: critical"""
    },
    {
        "name": "Port Scanning Activity Detected",
        "description": "Detects sequential connection attempts across multiple ports from a single external IP.",
        "rule_type": "Custom",
        "severity": "Medium",
        "category": "Port Scan",
        "mitre_technique_id": "T1046",
        "mitre_tactic": "Discovery",
        "condition_expression": "'deny syn' in raw_message.lower() or 'port' in raw_message.lower()",
        "sigma_yaml": """title: Network Port Scanning
id: 76f92110-33a1-4d10-8b11-9481aa012111
status: production
description: Network firewall rule match for port scanning behavior
logsource:
  category: network_flow
level: medium"""
    },
    {
        "name": "Privilege Escalation via Sudo or Process Injection",
        "description": "Detects unauthorized privilege escalation attempts or privilege token manipulation.",
        "rule_type": "Sigma",
        "severity": "High",
        "category": "Privilege Escalation",
        "mitre_technique_id": "T1068",
        "mitre_tactic": "Privilege Escalation",
        "condition_expression": "'euid=0' in raw_message.lower() or 'event id 4672' in raw_message.lower()",
        "sigma_yaml": """title: Privilege Token Manipulation
id: c4882091-1002-48aa-b112-9481cc001192
status: production
description: Detects privilege token elevation
logsource:
  category: authentication
level: high"""
    }
]

def seed_default_rules():
    """Ensure default detection rules exist in the database."""
    if DetectionRule.query.count() == 0:
        for r in DEFAULT_RULES:
            rule = DetectionRule(
                name=r["name"],
                description=r["description"],
                rule_type=r["rule_type"],
                severity=r["severity"],
                category=r["category"],
                mitre_technique_id=r["mitre_technique_id"],
                mitre_tactic=r["mitre_tactic"],
                condition_expression=r["condition_expression"],
                sigma_yaml=r["sigma_yaml"],
                enabled=True
            )
            db.session.add(rule)
        db.session.commit()

def evaluate_log_against_rules(log):
    """
    Evaluates a single log against enabled detection rules.
    If matching, creates an Alert and optionally an Incident.
    """
    rules = DetectionRule.query.filter_by(enabled=True).all()
    created_alerts = []

    for rule in rules:
        matched = False
        raw = log.raw_message.lower()

        if rule.condition_expression:
            try:
                # Basic string match keywords derived from condition expression
                keywords = [k.strip("'\" ") for k in rule.condition_expression.split("or")]
                for kw in keywords:
                    if kw and kw in raw:
                        matched = True
                        break
            except Exception:
                matched = False

        if matched:
            alert = Alert(
                title=f"Alert: {rule.name}",
                description=f"Rule '{rule.name}' triggered on log #{log.id}: {log.raw_message[:200]}",
                severity=rule.severity,
                status='Open',
                rule_name=rule.name,
                rule_id=rule.id,
                log_id=log.id,
                mitre_technique_id=rule.mitre_technique_id,
                mitre_tactic=rule.mitre_tactic,
                source_ip=log.source_ip,
                destination_ip=log.destination_ip,
                affected_asset=log.hostname or log.user_affected or 'Internal Asset',
                created_at=datetime.utcnow()
            )
            db.session.add(alert)
            db.session.flush()  # populate alert.id
            created_alerts.append(alert)

            # Auto-create incident for Critical or High alerts
            if rule.severity in ['Critical', 'High']:
                sla_hours = 1 if rule.severity == 'Critical' else 4
                priority = 'P1' if rule.severity == 'Critical' else 'P2'
                
                incident = Incident(
                    title=f"Security Incident: {rule.category} Detected on {alert.affected_asset}",
                    description=f"Automated incident generated from {rule.severity} alert '{alert.title}'. Attacker IP: {log.source_ip}",
                    status='New',
                    priority=priority,
                    severity=rule.severity,
                    created_at=datetime.utcnow(),
                    sla_expire_at=datetime.utcnow() + timedelta(hours=sla_hours),
                    timeline_json=json.dumps([{
                        'timestamp': datetime.utcnow().isoformat(),
                        'event': 'Incident created automatically by SentinelX Detection Engine',
                        'actor': 'System Sentinel Engine'
                    }]),
                    evidence_json=json.dumps([{
                        'type': 'Log Artifact',
                        'log_id': log.id,
                        'source_ip': log.source_ip,
                        'raw_log': log.raw_message
                    }]),
                    notes_json=json.dumps([{
                        'timestamp': datetime.utcnow().isoformat(),
                        'author': 'Sentinel AI System',
                        'text': f"High priority indicator matched technique {rule.mitre_technique_id} ({rule.mitre_tactic}). Immediate containment recommended."
                    }])
                )
                db.session.add(incident)

    if created_alerts:
        db.session.commit()

    return created_alerts
