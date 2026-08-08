from datetime import datetime
from app.extensions import db

class DetectionRule(db.Model):
    __tablename__ = 'detection_rules'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=False)
    rule_type = db.Column(db.String(50), default='Sigma')  # Sigma, Custom, Regex, Threshold
    severity = db.Column(db.String(20), default='High')  # Critical, High, Medium, Low
    category = db.Column(db.String(100), default='Authentication')  # Privilege Escalation, Ransomware, etc.
    mitre_technique_id = db.Column(db.String(50), nullable=True)  # T1110, T1059, etc.
    mitre_tactic = db.Column(db.String(100), nullable=True)
    sigma_yaml = db.Column(db.Text, nullable=True)
    condition_expression = db.Column(db.Text, nullable=True)
    enabled = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'rule_type': self.rule_type,
            'severity': self.severity,
            'category': self.category,
            'mitre_technique_id': self.mitre_technique_id,
            'mitre_tactic': self.mitre_tactic,
            'sigma_yaml': self.sigma_yaml,
            'condition_expression': self.condition_expression,
            'enabled': self.enabled,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
