from flask import Blueprint, request, jsonify
import json
from datetime import datetime
from app.extensions import db
from app.models.incident import Incident
from app.models.audit import AuditLog

incidents_bp = Blueprint('incidents', __name__, url_prefix='/api/incidents')

@incidents_bp.route('/', methods=['GET'])
def get_incidents():
    status = request.args.get('status')
    severity = request.args.get('severity')
    query = Incident.query.order_by(Incident.created_at.desc())

    if status:
        query = query.filter_by(status=status)
    if severity:
        query = query.filter_by(severity=severity)

    incidents = query.all()
    return jsonify([i.to_dict() for i in incidents]), 200

@incidents_bp.route('/<int:incident_id>', methods=['GET'])
def get_incident(incident_id):
    incident = Incident.query.get_or_404(incident_id)
    return jsonify(incident.to_dict()), 200

@incidents_bp.route('/<int:incident_id>/status', methods=['PUT'])
def update_status(incident_id):
    incident = Incident.query.get_or_404(incident_id)
    data = request.get_json() or {}
    new_status = data.get('status')
    analyst_name = data.get('username', 'SOC Analyst')

    valid_statuses = ['New', 'Assigned', 'Investigating', 'Contained', 'Resolved', 'Closed']
    if new_status not in valid_statuses:
        return jsonify({'error': f'Invalid status. Allowed: {valid_statuses}'}), 400

    old_status = incident.status
    incident.status = new_status
    incident.updated_at = datetime.utcnow()

    # Append timeline event
    try:
        timeline = json.loads(incident.timeline_json or '[]')
    except Exception:
        timeline = []
    
    timeline.append({
        'timestamp': datetime.utcnow().isoformat(),
        'event': f"Status changed from {old_status} to {new_status}",
        'actor': analyst_name
    })
    incident.timeline_json = json.dumps(timeline)

    # Audit log
    audit = AuditLog(
        username=analyst_name,
        action='INCIDENT_STATUS_UPDATE',
        target=f"Incident #{incident.id}",
        details=f"Changed status from {old_status} to {new_status}"
    )
    db.session.add(audit)
    db.session.commit()

    return jsonify({'message': f'Incident status updated to {new_status}.', 'incident': incident.to_dict()}), 200

@incidents_bp.route('/<int:incident_id>/notes', methods=['POST'])
def add_note(incident_id):
    incident = Incident.query.get_or_404(incident_id)
    data = request.get_json() or {}
    note_text = data.get('text', '')
    author = data.get('author', 'SOC Analyst')

    if not note_text:
        return jsonify({'error': 'Note text is required.'}), 400

    try:
        notes = json.loads(incident.notes_json or '[]')
    except Exception:
        notes = []

    new_note = {
        'timestamp': datetime.utcnow().isoformat(),
        'author': author,
        'text': note_text
    }
    notes.append(new_note)
    incident.notes_json = json.dumps(notes)
    incident.updated_at = datetime.utcnow()

    db.session.commit()
    return jsonify({'message': 'Note added to incident timeline.', 'note': new_note}), 201
