from datetime import datetime
from app.extensions import db

class Alert(db.Model):
    __tablename__ = 'alerts'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    severity = db.Column(db.String(20), nullable=False, default='Medium')  # Critical, High, Medium, Low, Info
    status = db.Column(db.String(30), default='Open')  # Open, Investigating, Resolved, False Positive
    rule_name = db.Column(db.String(150), nullable=True)
    rule_id = db.Column(db.Integer, db.ForeignKey('detection_rules.id'), nullable=True)
    log_id = db.Column(db.Integer, db.ForeignKey('logs.id'), nullable=True)
    mitre_technique_id = db.Column(db.String(50), nullable=True)  # T1110, T1046, etc.
    mitre_tactic = db.Column(db.String(100), nullable=True)  # Credential Access, Discovery, etc.
    source_ip = db.Column(db.String(50), nullable=True)
    destination_ip = db.Column(db.String(50), nullable=True)
    affected_asset = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'severity': self.severity,
            'status': self.status,
            'rule_name': self.rule_name,
            'rule_id': self.rule_id,
            'log_id': self.log_id,
            'mitre_technique_id': self.mitre_technique_id,
            'mitre_tactic': self.mitre_tactic,
            'source_ip': self.source_ip,
            'destination_ip': self.destination_ip,
            'affected_asset': self.affected_asset,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
