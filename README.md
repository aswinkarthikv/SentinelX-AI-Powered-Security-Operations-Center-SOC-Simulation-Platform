# SentinelX – AI-Powered Security Operations Center (SOC) Simulation Platform

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/aswinkarthikv/SentinelX-AI-Powered-Security-Operations-Center-SOC-Simulation-Platform)
[![GitHub Pages](https://img.shields.io/badge/Live%20Website-GitHub%20Pages-0284c7.svg)](https://aswinkarthikv.github.io/SentinelX-AI-Powered-Security-Operations-Center-SOC-Simulation-Platform/)
[![React](https://img.shields.io/badge/Frontend-React%2019-0284c7.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178c6.svg)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Backend-Python%20Flask-3776ab.svg)](https://flask.palletsprojects.org/)
[![Docker](https://img.shields.io/badge/Deployment-Docker%20Compose-2496ed.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

🌐 **Live GitHub Pages Website**: [https://aswinkarthikv.github.io/SentinelX-AI-Powered-Security-Operations-Center-SOC-Simulation-Platform/](https://aswinkarthikv.github.io/SentinelX-AI-Powered-Security-Operations-Center-SOC-Simulation-Platform/)

---

## 🛠️ GitHub Pages One-Click Setup Guide

If your site is currently showing the `README.md` markdown text instead of the interactive website app:

1. Open your repository on GitHub: [https://github.com/aswinkarthikv/SentinelX-AI-Powered-Security-Operations-Center-SOC-Simulation-Platform](https://github.com/aswinkarthikv/SentinelX-AI-Powered-Security-Operations-Center-SOC-Simulation-Platform)
2. Click on **Settings** (⚙️ top tab) ➔ Click **Pages** in the left navigation sidebar.
3. Under **Build and deployment**:
   - Change **Source** from `Deploy from a branch` to **`GitHub Actions`** (OR select Branch **`gh-pages`** and folder **`/(root)`**).
4. Save settings. The full interactive React website will launch immediately at `https://aswinkarthikv.github.io/SentinelX-AI-Powered-Security-Operations-Center-SOC-Simulation-Platform/`.

---

## Key Features

### 🛡️ Enterprise SIEM Simulation Engine
- **Real-Time Log Pipeline**: Ingests, parses, and normalizes logs across 6 enterprise sources:
  - **Windows Event Logs**: Event ID 4624 (Successful Logon), 4625 (Failed Logon), 4688 (Process Spawn), 4672 (Admin Privileges).
  - **Linux Syslog / auth.log**: SSH publickey acceptances, pam_unix authentication failures.
  - **Network Firewalls**: Cisco ASA / Fortinet rule match drop/allow events.
  - **IDS / IPS**: Snort & Suricata rule signature alerts.
  - **Web Application Servers**: Nginx / Apache access logs with SQL Injection and XSS signatures.
  - **Cloud Infrastructure**: AWS CloudTrail console login & IAM policy changes.
- **Normalization Pipeline**: Normalizes raw payloads into **ECS (Elastic Common Schema)** and **CEF** JSON standard formats.
- **Attack Simulator Engine**: Live attack simulation injections for **Brute Force**, **Port Scanning**, **SQL Injection**, and **Ransomware Mass Encryption**.

---

### 🔍 Sigma & Custom Detection Rules Engine
- **Sigma Rule Parser**: Supports standard YAML-defined Sigma rules for cross-platform threat signatures.
- **Custom Rule Builder**: Threshold-based and regex detection rule creation interface.
- **Automated Rule Triggers**: Live matching triggers instant Security Alerts and auto-creates high-priority Incidents.

---

### 🎯 MITRE ATT&CK Framework Integration
- **Interactive ATT&CK Matrix Grid**: Real-time matrix view covering Initial Access, Execution, Persistence, Privilege Escalation, Defense Evasion, Credential Access, Discovery, Lateral Movement, Exfiltration, and Impact.
- **Matrix Coverage Calculator**: Dynamically calculates active rule coverage percentage.
- **Attack Kill Chain Visualizer**: Visualizes multi-stage adversary campaign execution flows.

---

### 🌐 Threat Intelligence Engine (CTI)
- **IOC Search Utility**: Instant search for **IP Addresses**, **Domains**, **URLs**, and **File Hashes (MD5/SHA256)**.
- **API Feed Integration**: Interfaced with **VirusTotal**, **AbuseIPDB**, and **AlienVault OTX**.
- **CTI Profile Display**: Reputation score dial (0-100), risk level rating, malware family attribution, known threat actor mapping (e.g. APT29, Lazarus Group, FIN7), and WHOIS geolocation.

---

### 🤖 AI Security Analyst (Claude & Gemini API)
- **Interactive AI Assistant Drawer**: Cyberpunk conversational workbench powered by Anthropic Claude 3.5 Sonnet / Gemini API with SOC expert fallback mode.
- **Automated Playbook Generation**: Generates immediate host containment scripts:
  - Linux `iptables` and `ufw` block commands
  - Windows PowerShell `New-NetFirewallRule` commands
  - EDR host isolation playbooks
- **Executive Alert Summaries**: Translates technical log payloads into clear executive briefs.

---

### 📋 Incident Response Workflow Board
- **Lifecycle Kanban Board**: Manage incidents across `New` ➔ `Assigned` ➔ `Investigating` ➔ `Contained` ➔ `Resolved` ➔ `Closed`.
- **Evidence Locker**: Captured PCAP snippets, log artifacts, and IOC hashes.
- **SLA Countdown Timers**: Automated SLA tracking (P1 Critical: 15m, P2 High: 1h).
- **Incident Timeline & Analyst Thread**: Chronological audit timeline and collaborative notes.

---

### 📊 Executive Reports & PDF Export
- **Report Generator**: Daily SOC Report, Weekly Operational Brief, Executive CTI Brief, Incident Post-Mortem.
- **PDF Export Engine**: Built-in ReportLab & client-side binary PDF generator for compliance and management reviews.

---

## Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, TanStack React Query v5, React Router v7, Chart.js, Lucide Icons, Framer Motion |
| **Backend** | Python 3.14, Flask REST API, SQLAlchemy ORM, Flask-JWT-Extended, PyYAML, ReportLab |
| **Database & Cache** | PostgreSQL, SQLite, Redis |
| **Deployment** | Docker, Docker Compose, Nginx, Gunicorn |
| **CI/CD** | GitHub Actions Workflow |

---

## License

This project is licensed under the [MIT License](LICENSE).

Developed by **Aswin Karthik** — Portfolio Quality SDE / Security Operations Center Simulation Platform.
