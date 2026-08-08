# Changelog

All notable changes to SentinelX – AI-Powered Security Operations Center (SOC) Simulation Platform will be documented in this file.

## [1.0.0] - 2026-08-08
### Initial Release
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS dark SOC theme with glassmorphism UI.
- **Backend**: Python Flask REST API + SQLAlchemy ORM + JWT Auth (Access & Refresh tokens).
- **SIEM Engine**: Real-time log ingestion simulator across Windows 4624/4625, Linux, ASA Firewall, Snort IDS, Web Server SQLi, AWS CloudTrail.
- **Sigma Detection Engine**: Rule parser and match evaluator supporting Brute Force, Port Scanning, SQLi, XSS, Ransomware, Phishing, PrivEsc, Exfiltration.
- **MITRE ATT&CK**: Matrix visualization, technique coverage calculator, and attack kill chain visualizer.
- **Threat Intelligence**: IOC lookup tool for IP, Domain, Hash, and URL integrating VirusTotal, AbuseIPDB, AlienVault OTX.
- **AI Security Analyst**: Anthropic Claude 3.5 Sonnet / Gemini API SOC assistant generating alert explanations, containment scripts, and executive summaries.
- **Incident Response**: Kanban workflow board (New -> Assigned -> Investigating -> Contained -> Resolved -> Closed), evidence locker, timeline, SLA timers, and notes.
- **Reporting**: ReportLab PDF exporter and JSON generator.
- **Deployment**: Docker, Docker Compose, Nginx, GitHub Actions CI pipeline, and Swagger OpenAPI documentation (`/api/docs`).
