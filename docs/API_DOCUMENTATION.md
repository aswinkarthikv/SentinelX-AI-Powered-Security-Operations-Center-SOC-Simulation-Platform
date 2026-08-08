# SentinelX API Reference Guide

Live OpenAPI / Swagger documentation is available interactively at `http://localhost:5000/api/docs`.

## Key REST Endpoints

### Authentication
- `POST /api/auth/register`: Register new user (Roles: Admin, SOC Analyst, Security Engineer, Viewer).
- `POST /api/auth/login`: Authenticate and obtain JWT Access & Refresh Tokens.
- `GET /api/auth/me`: Get authenticated user profile.

### Dashboard & Analytics
- `GET /api/dashboard/stats`: Get real-time active alerts, critical count, open incidents, and threat score (0-100).
- `GET /api/dashboard/attack-timeline`: 24-hour attack velocity trend datasets.
- `GET /api/dashboard/geo-map`: Inbound attack country geographic coordinates.

### SIEM Ingestion
- `GET /api/siem/logs`: Paginated log event stream. Filter by `source`, `level`, and `search`.
- `POST /api/siem/simulate`: Trigger automated attack scenario injection (`brute_force`, `sqli`, `ransomware`, `port_scan`).
- `POST /api/siem/clear`: Clear log repository.

### Detection Rules & Sigma
- `GET /api/rules/`: List all enabled Sigma & Custom detection rules.
- `POST /api/rules/`: Create new Sigma rule signature.
- `POST /api/rules/<id>/toggle`: Enable or disable detection rule.

### Threat Intelligence
- `GET /api/threat-intel/lookup?ioc=<value>`: Search IP, Domain, URL, or File Hash across CTI feeds.

### AI Security Analyst
- `POST /api/ai-analyst/chat`: Send prompt to Claude 3.5 Sonnet / Gemini API SOC model.
- `POST /api/ai-analyst/explain-alert`: Technical breakdown of triggered security alert.
- `POST /api/ai-analyst/containment`: Generate bash/powershell host isolation scripts.

### Incident Response & Reports
- `GET /api/incidents/`: List all incidents.
- `PUT /api/incidents/<id>/status`: Update incident lifecycle status (`New` -> `Assigned` -> `Investigating` -> `Contained` -> `Resolved` -> `Closed`).
- `GET /api/reports/export-pdf`: Download official executive PDF report.
