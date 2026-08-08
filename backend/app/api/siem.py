from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.log import Log
from app.services.siem_engine import generate_random_log, simulate_attack_scenario
from app.services.detection_engine import evaluate_log_against_rules

siem_bp = Blueprint('siem', __name__, url_prefix='/api/siem')

@siem_bp.route('/logs', methods=['GET'])
def get_logs():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 25, type=int)
    source = request.args.get('source')
    level = request.args.get('level')
    search = request.args.get('search')

    query = Log.query.order_by(Log.timestamp.desc())

    if source:
        query = query.filter_by(source=source)
    if level:
        query = query.filter_by(log_level=level)
    if search:
        query = query.filter(Log.raw_message.ilike(f'%{search}%'))

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'logs': [l.to_dict() for l in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    }), 200

@siem_bp.route('/simulate', methods=['POST'])
def simulate():
    data = request.get_json() or {}
    attack_type = data.get('attack_type', 'random')
    count = data.get('count', 1)

    generated_logs = []
    created_alerts_count = 0

    if attack_type != 'random':
        logs = simulate_attack_scenario(attack_type)
        for log in logs:
            db.session.add(log)
            db.session.flush()
            alerts = evaluate_log_against_rules(log)
            created_alerts_count += len(alerts)
            generated_logs.append(log.to_dict())
    else:
        for _ in range(count):
            log = generate_random_log()
            db.session.add(log)
            db.session.flush()
            alerts = evaluate_log_against_rules(log)
            created_alerts_count += len(alerts)
            generated_logs.append(log.to_dict())

    db.session.commit()

    return jsonify({
        'message': f'Successfully ingested {len(generated_logs)} logs into SIEM pipeline.',
        'generated_count': len(generated_logs),
        'alerts_triggered': created_alerts_count,
        'logs': generated_logs[:5]
    }), 200

@siem_bp.route('/clear', methods=['POST'])
def clear_logs():
    Log.query.delete()
    db.session.commit()
    return jsonify({'message': 'SIEM log repository cleared successfully.'}), 200
