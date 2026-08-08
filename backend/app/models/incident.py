from datetime import datetime
import json
from app.extensions import db

class Incident(db.Model):
    __tablename__ = 'incidents'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(30), default='New')  # New, Assigned, Investigating, Contained, Resolved, Closed
    priority = db.Column(db.String(20), default='P2')  # P1 - Critical, P2 - High, P3 - Medium, P4 - Low
    severity = db.Column(db.String(20), default='High')  # Critical, High, Medium, Low
    assigned_to_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    assigned_to_username = db.Column(db.String(80), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    sla_expire_at = db.Column(db.DateTime, nullable=True)
    timeline_json = db.Column(db.Text, default='[]')  # JSON array of events
    evidence_json = db.Column(db.Text, default='[]')  # JSON array of IOCs / log snippets
    notes_json = db.Column(db.Text, default='[]')  # JSON array of analyst notes

    def to_dict(self):
        def parse_json_field(val):
            try:
                return json.loads(val) if val else []
            except Exception:
                return []

        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'severity': self.severity,
            'assigned_to_id': self.assigned_to_id,
            'assigned_to_username': self.assigned_to_username,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'sla_expire_at': self.sla_expire_at.isoformat() if self.sla_expire_at else None,
            'timeline': parse_json_field(self.timeline_json),
            'evidence': parse_json_field(self.evidence_json),
            'notes': parse_json_field(self.notes_json)
        }
