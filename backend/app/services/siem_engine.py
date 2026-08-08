import random
import json
from datetime import datetime
from app.extensions import db
from app.models.log import Log

SOURCES = ['Windows', 'Linux', 'Firewall', 'IDS', 'WebServer', 'Cloud']
LOG_LEVELS = ['INFO', 'INFO', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']

SAMPLE_HOSTS = ['DC-01.corp.internal', 'WEB-PROD-01', 'FW-PRIMARY', 'K8S-NODE-03', 'DB-CLUSTER-02', 'WORKSTATION-882']
SAMPLE_USERS = ['admin', 'j.smith', 'a.karthik', 'root', 'service_acc', 'system', 'anonymous']

SAMPLE_IPS = [
    '185.220.101.5', '45.33.32.156', '192.168.1.105', '10.0.0.12', '198.51.100.42',
    '103.21.244.0', '185.190.140.23', '172.16.0.4', '192.168.1.1', '203.0.113.195'
]

def generate_random_log():
    source = random.choice(SOURCES)
    level = random.choice(LOG_LEVELS)
    src_ip = random.choice(SAMPLE_IPS)
    dst_ip = random.choice(['10.0.0.50', '10.0.0.100', '172.16.10.4', '8.8.8.8'])
    user = random.choice(SAMPLE_USERS)
    hostname = random.choice(SAMPLE_HOSTS)

    if source == 'Windows':
        event_ids = ['4624', '4625', '4672', '4688', '7045']
        event_id = random.choice(event_ids)
        if event_id == '4625':
            level = 'WARNING'
            msg = f"An account failed to log on. Subject: Security ID: S-1-5-18, Account Name: {user}, Workstation: {hostname}, Source IP: {src_ip}"
            cat = 'authentication'
        elif event_id == '4688':
            msg = f"A new process has been created. Process Name: C:\\Windows\\System32\\cmd.exe, Creator Account: {user}, Parent Process: powershell.exe"
            cat = 'process_creation'
        else:
            msg = f"Event ID {event_id}: Successful logon for user {user} from {src_ip} on host {hostname}"
            cat = 'authentication'
            
    elif source == 'Linux':
        event_id = 'SSH_AUTH'
        if level in ['ERROR', 'CRITICAL']:
            msg = f"pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost={src_ip} user={user}"
            cat = 'authentication'
        else:
            msg = f"Accepted publickey for {user} from {src_ip} port 49210 ssh2: RSA SHA256:8xK..."
            cat = 'authentication'

    elif source == 'Firewall':
        event_id = 'FW_RULE_MATCH'
        action = random.choice(['DENY', 'ALLOW', 'DROP'])
        if action == 'DROP':
            level = 'WARNING'
        msg = f"%ASA-4-106023: Deny tcp src outside:{src_ip}/54321 dst inside:{dst_ip}/443 by access-group 'OUTSIDE_IN' [0x0, 0x0]"
        cat = 'network_flow'

    elif source == 'IDS':
        event_id = 'ET_EXPLOIT'
        level = 'CRITICAL' if random.random() > 0.4 else 'WARNING'
        msg = f"[1:2014781:4] ET EXPLOIT Possible SQL Injection Attempt in HTTP URI ({src_ip}:54212 -> {dst_ip}:80)"
        cat = 'ids_alert'

    elif source == 'WebServer':
        event_id = 'HTTP_200'
        method = random.choice(['GET', 'POST', 'PUT'])
        uri = random.choice(['/api/v1/login', '/admin/upload.php', '/index.html', '/products?id=1%27%20OR%201=1--'])
        msg = f"{src_ip} - - [{datetime.utcnow().strftime('%d/%b/%Y:%H:%M:%S +0000')}] \"{method} {uri} HTTP/1.1\" 200 4521"
        cat = 'web_access'

    else:  # Cloud
        event_id = 'ConsoleLogin'
        msg = f"AWS CloudTrail Event: User {user} logged into AWS Console from {src_ip} without MFA"
        cat = 'cloud_activity'

    parsed = {
        'source_ip': src_ip,
        'destination_ip': dst_ip,
        'user': user,
        'hostname': hostname,
        'event_id': event_id,
        'log_level': level,
        'category': cat,
        'raw': msg
    }

    return Log(
        timestamp=datetime.utcnow(),
        source=source,
        log_level=level,
        event_id=event_id,
        source_ip=src_ip,
        destination_ip=dst_ip,
        user_affected=user,
        hostname=hostname,
        raw_message=msg,
        parsed_json=json.dumps(parsed),
        normalized_category=cat
    )

def simulate_attack_scenario(attack_type):
    """
    Generate a specific batch of logs for simulating selected attack vectors.
    Supported: brute_force, port_scan, sqli, xss, malware, ransomware, phishing, priv_esc, exfiltration
    """
    logs = []
    attacker_ip = '185.220.101.5'
    target_ip = '10.0.0.50'
    target_host = 'WEB-PROD-01'
    
    if attack_type == 'brute_force':
        for i in range(15):
            logs.append(Log(
                timestamp=datetime.utcnow(),
                source='Windows',
                log_level='WARNING',
                event_id='4625',
                source_ip=attacker_ip,
                destination_ip=target_ip,
                user_affected='admin',
                hostname=target_host,
                raw_message=f"An account failed to log on. Attempt #{i+1} for user admin from IP {attacker_ip}",
                parsed_json=json.dumps({'attacker': attacker_ip, 'attempt': i+1, 'attack': 'brute_force'}),
                normalized_category='authentication'
            ))
    elif attack_type == 'sqli':
        sqli_payloads = ["' OR '1'='1", "UNION SELECT username, password FROM users--", "'; DROP TABLE logs;--"]
        for p in sqli_payloads:
            logs.append(Log(
                timestamp=datetime.utcnow(),
                source='WebServer',
                log_level='CRITICAL',
                event_id='HTTP_500',
                source_ip=attacker_ip,
                destination_ip=target_ip,
                user_affected='anonymous',
                hostname=target_host,
                raw_message=f"{attacker_ip} - - GET /api/users?search={p} HTTP/1.1 500 SQL syntax error near {p}",
                parsed_json=json.dumps({'attacker': attacker_ip, 'payload': p, 'attack': 'sqli'}),
                normalized_category='web_access'
            ))
    elif attack_type == 'ransomware':
        logs.append(Log(
            timestamp=datetime.utcnow(),
            source='Linux',
            log_level='CRITICAL',
            event_id='PROCESS_SPAWN',
            source_ip=target_ip,
            destination_ip='185.190.140.23',
            user_affected='root',
            hostname='DB-CLUSTER-02',
            raw_message="CRITICAL: Executable /tmp/wannacry_v2 spawned. Mass file renaming detected: .locked extension applied to 4,500 files in /var/db",
            parsed_json=json.dumps({'attack': 'ransomware', 'path': '/tmp/wannacry_v2', 'affected_files': 4500}),
            normalized_category='process_creation'
        ))
    elif attack_type == 'port_scan':
        for port in [21, 22, 23, 80, 443, 3306, 3389, 8080]:
            logs.append(Log(
                timestamp=datetime.utcnow(),
                source='Firewall',
                log_level='WARNING',
                event_id='FW_DENY',
                source_ip=attacker_ip,
                destination_ip=target_ip,
                user_affected='N/A',
                hostname='FW-PRIMARY',
                raw_message=f"%ASA-4-106023: Deny SYN packet from {attacker_ip}:{random.randint(10000, 60000)} to {target_ip}:{port}",
                parsed_json=json.dumps({'attack': 'port_scan', 'port': port}),
                normalized_category='network_flow'
            ))
    else:
        # Default generic simulation
        logs.append(generate_random_log())

    return logs
