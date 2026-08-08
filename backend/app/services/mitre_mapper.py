MITRE_ATTACK_TACTICS = [
    {
        "id": "TA0001",
        "name": "Initial Access",
        "techniques": [
            {"id": "T1190", "name": "Exploit Public-Facing Application", "description": "Exploiting security vulnerabilities in web apps (SQLi, XSS).", "covered": True},
            {"id": "T1566", "name": "Phishing", "description": "Spearphishing attachment or link sent to target users.", "covered": True},
            {"id": "T1078", "name": "Valid Accounts", "description": "Obtaining valid credentials via compromise or leaks.", "covered": False}
        ]
    },
    {
        "id": "TA0002",
        "name": "Execution",
        "techniques": [
            {"id": "T1059", "name": "Command and Scripting Interpreter", "description": "Execution via PowerShell, Bash, or cmd.", "covered": True},
            {"id": "T1204", "name": "User Execution", "description": "Target user clicking malicious file or link.", "covered": False}
        ]
    },
    {
        "id": "TA0003",
        "name": "Persistence",
        "techniques": [
            {"id": "T1053", "name": "Scheduled Task/Job", "description": "Configuring cron or schtasks for persistent access.", "covered": True},
            {"id": "T1543", "name": "Create or Modify System Process", "description": "Creating rogue system services.", "covered": False}
        ]
    },
    {
        "id": "TA0004",
        "name": "Privilege Escalation",
        "techniques": [
            {"id": "T1068", "name": "Exploitation for Privilege Escalation", "description": "Exploiting kernel or service bug for elevated privilege.", "covered": True},
            {"id": "T1548", "name": "Abuse Elevation Control Mechanism", "description": "Sudo or UAC bypass.", "covered": True}
        ]
    },
    {
        "id": "TA0005",
        "name": "Defense Evasion",
        "techniques": [
            {"id": "T1070", "name": "Indicator Removal", "description": "Clearing security logs or audit trails.", "covered": True},
            {"id": "T1027", "name": "Obfuscated Files or Information", "description": "Encoding malware payloads in Base64.", "covered": False}
        ]
    },
    {
        "id": "TA0006",
        "name": "Credential Access",
        "techniques": [
            {"id": "T1110", "name": "Brute Force", "description": "Password guessing or spraying against SSH/RDP/Web.", "covered": True},
            {"id": "T1003", "name": "OS Credential Dumping", "description": "Dumping LSASS memory or SAM database.", "covered": True}
        ]
    },
    {
        "id": "TA0007",
        "name": "Discovery",
        "techniques": [
            {"id": "T1046", "name": "Network Service Discovery", "description": "Port scanning internal or external assets.", "covered": True},
            {"id": "T1083", "name": "File and Directory Discovery", "description": "Enumerating sensitive files.", "covered": False}
        ]
    },
    {
        "id": "TA0008",
        "name": "Lateral Movement",
        "techniques": [
            {"id": "T1021", "name": "Remote Services", "description": "Moving laterally via SSH, RDP, or SMB.", "covered": True},
            {"id": "T1550", "name": "Use Alternate Authentication Material", "description": "Pass-the-Hash or Kerberoasting.", "covered": False}
        ]
    },
    {
        "id": "TA0009",
        "name": "Exfiltration",
        "techniques": [
            {"id": "T1048", "name": "Exfiltration Over Alternative Protocol", "description": "Exfiltrating sensitive data via DNS or ICMP.", "covered": True},
            {"id": "T1567", "name": "Exfiltration Over Web Service", "description": "Uploading stolen data to cloud storage.", "covered": False}
        ]
    },
    {
        "id": "TA0040",
        "name": "Impact",
        "techniques": [
            {"id": "T1486", "name": "Data Encrypted for Impact", "description": "Ransomware encryption of enterprise host data.", "covered": True},
            {"id": "T1490", "name": "Inhibit System Recovery", "description": "Deleting Volume Shadow Copies.", "covered": True}
        ]
    }
]

def get_mitre_matrix():
    return MITRE_ATTACK_TACTICS

def calculate_coverage():
    total_techniques = 0
    covered_techniques = 0

    for tactic in MITRE_ATTACK_TACTICS:
        for tech in tactic["techniques"]:
            total_techniques += 1
            if tech["covered"]:
                covered_techniques += 1

    percentage = round((covered_techniques / total_techniques) * 100, 1) if total_techniques > 0 else 0
    return {
        "total_techniques": total_techniques,
        "covered_techniques": covered_techniques,
        "coverage_percentage": percentage
    }

def get_attack_chain_sample():
    """Returns a realistic multi-stage kill chain visualization dataset."""
    return [
        {
            "step": 1,
            "tactic": "Initial Access",
            "technique_id": "T1566",
            "technique_name": "Phishing",
            "timestamp": "2026-08-08T10:15:00Z",
            "description": "Malicious email attachment 'Invoice_AUG2026.docm' executed by user j.smith"
        },
        {
            "step": 2,
            "tactic": "Execution",
            "technique_id": "T1059",
            "technique_name": "Command & Scripting Interpreter",
            "timestamp": "2026-08-08T10:15:22Z",
            "description": "PowerShell spawned obfuscated payload downloading C2 beacon"
        },
        {
            "step": 3,
            "tactic": "Privilege Escalation",
            "technique_id": "T1548",
            "technique_name": "Abuse Elevation Mechanism",
            "timestamp": "2026-08-08T10:18:05Z",
            "description": "UAC bypass executed to gain NT AUTHORITY\\SYSTEM tokens"
        },
        {
            "step": 4,
            "tactic": "Discovery",
            "technique_id": "T1046",
            "technique_name": "Network Service Discovery",
            "timestamp": "2026-08-08T10:22:10Z",
            "description": "Internal subnet port scan initiated towards 10.0.0.0/24"
        },
        {
            "step": 5,
            "tactic": "Impact",
            "technique_id": "T1486",
            "technique_name": "Data Encrypted for Impact",
            "timestamp": "2026-08-08T10:30:00Z",
            "description": "Ransomware strain WannaCry_v2 deployed across DB-CLUSTER-02"
        }
    ]
