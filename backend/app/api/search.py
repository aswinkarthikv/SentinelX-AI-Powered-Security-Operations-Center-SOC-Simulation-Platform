from flask import Blueprint, request, jsonify
from app.models.user import User
from app.models.alert import Alert
from app.models.log import Log
from app.models.incident import Incident
from app.models.ioc import ThreatIOC
from app.services.mitre_mapper import MITRE_ATTACK_TACTICS

search_bp = Blueprint('search', __name__, url_prefix='/api/search')

@search_bp.route('/', methods=['GET'])
def global_search():
    q = request.args.get('q', '').strip()
    if not q or len(q) < 2:
        return jsonify({'results': []}), 200

    results = []

    # Search Alerts
    alerts = Alert.query.filter(
        (Alert.title.ilike(f'%{q}%')) | (Alert.source_ip.ilike(f'%{q}%')) | (Alert.mitre_technique_id.ilike(f'%{q}%'))
    ).limit(5).all()
    for a in alerts:
        results.append({
            'category': 'Alert',
            'title': a.title,
            'subtitle': f"Severity: {a.severity} | Source: {a.source_ip}",
            'link': '/dashboard'
        })

    # Search Incidents
    incidents = Incident.query.filter(
        (Incident.title.ilike(f'%{q}%')) | (Incident.description.ilike(f'%{q}%'))
    ).limit(5).all()
    for i in incidents:
        results.append({
            'category': 'Incident',
            'title': i.title,
            'subtitle': f"Status: {i.status} | Priority: {i.priority}",
            'link': f'/incidents/{i.id}'
        })

    # Search Users
    users = User.query.filter(
        (User.username.ilike(f'%{q}%')) | (User.email.ilike(f'%{q}%'))
    ).limit(5).all()
    for u in users:
        results.append({
            'category': 'User',
            'title': u.username,
            'subtitle': f"Role: {u.role} | Dept: {u.department}",
            'link': '/audit-logs'
        })

    # Search Threat IOCs
    iocs = ThreatIOC.query.filter(
        ThreatIOC.ioc_value.ilike(f'%{q}%')
    ).limit(5).all()
    for i in iocs:
        results.append({
            'category': 'Threat IOC',
            'title': i.ioc_value,
            'subtitle': f"Type: {i.ioc_type} | Risk: {i.risk_level}",
            'link': '/threat-intel'
        })

    # Search MITRE Techniques
    for tactic in MITRE_ATTACK_TACTICS:
        for tech in tactic['techniques']:
            if q.lower() in tech['id'].lower() or q.lower() in tech['name'].lower():
                results.append({
                    'category': 'MITRE Technique',
                    'title': f"{tech['id']} - {tech['name']}",
                    'subtitle': f"Tactic: {tactic['name']}",
                    'link': '/mitre-attack'
                })

    return jsonify({'query': q, 'count': len(results), 'results': results}), 200
