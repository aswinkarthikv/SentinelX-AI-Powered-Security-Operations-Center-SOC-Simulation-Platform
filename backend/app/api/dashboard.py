from flask import Blueprint, jsonify
from datetime import datetime, timedelta
from app.models.alert import Alert
from app.models.incident import Incident
from app.models.log import Log
from app.services.mitre_mapper import calculate_coverage

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

@dashboard_bp.route('/stats', methods=['GET'])
def stats():
    total_logs = Log.query.count()
    active_alerts = Alert.query.filter_by(status='Open').count()
    critical_alerts = Alert.query.filter_by(severity='Critical', status='Open').count()
    total_incidents = Incident.query.count()
    open_incidents = Incident.query.filter(Incident.status.in_(['New', 'Assigned', 'Investigating'])).count()

    # Threat Score calculation (0-100)
    threat_score = min(100, (critical_alerts * 20) + (active_alerts * 3) + (open_incidents * 8) + 35)

    mitre_coverage = calculate_coverage()

    return jsonify({
        "total_logs": total_logs,
        "active_alerts": active_alerts,
        "critical_alerts": critical_alerts,
        "total_incidents": total_incidents,
        "open_incidents": open_incidents,
        "threat_score": threat_score,
        "mttd": "3.5 mins",
        "mttr": "14.2 mins",
        "security_score": round(100 - (threat_score * 0.4), 1),
        "mitre_coverage_percentage": mitre_coverage["coverage_percentage"]
    }), 200

@dashboard_bp.route('/attack-timeline', methods=['GET'])
def attack_timeline():
    # 24 hour trend sample
    now = datetime.utcnow()
    hours = []
    for i in range(12, -1, -1):
        t = (now - timedelta(hours=i)).strftime('%H:00')
        hours.append(t)

    return jsonify({
        "labels": hours,
        "datasets": [
            {
                "label": "Brute Force",
                "data": [12, 19, 3, 5, 2, 3, 20, 35, 42, 28, 15, 10, 8]
            },
            {
                "label": "SQL Injection",
                "data": [1, 5, 10, 2, 0, 1, 4, 12, 18, 9, 4, 2, 1]
            },
            {
                "label": "Port Scan",
                "data": [45, 60, 52, 30, 25, 40, 75, 90, 110, 85, 60, 45, 30]
            }
        ]
    }), 200

@dashboard_bp.route('/geo-map', methods=['GET'])
def geo_map():
    # Attack geographic sources
    return jsonify([
        {"country": "Russia", "code": "RU", "lat": 55.7558, "lng": 37.6173, "attacks": 1420, "threat_level": "Critical"},
        {"country": "China", "code": "CN", "lat": 39.9042, "lng": 116.4074, "attacks": 980, "threat_level": "High"},
        {"country": "United States", "code": "US", "lat": 37.0902, "lng": -95.7129, "attacks": 430, "threat_level": "Medium"},
        {"country": "Netherlands", "code": "NL", "lat": 52.3676, "lng": 4.9041, "attacks": 310, "threat_level": "High"},
        {"country": "Brazil", "code": "BR", "lat": -14.2350, "lng": -51.9253, "attacks": 210, "threat_level": "Medium"}
    ]), 200

@dashboard_bp.route('/analyst-queue', methods=['GET'])
def analyst_queue():
    incidents = Incident.query.order_by(Incident.created_at.desc()).limit(5).all()
    return jsonify([i.to_dict() for i in incidents]), 200
