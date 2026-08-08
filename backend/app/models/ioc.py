from datetime import datetime
from app.extensions import db

class ThreatIOC(db.Model):
    __tablename__ = 'threat_iocs'

    id = db.Column(db.Integer, primary_key=True)
    ioc_value = db.Column(db.String(255), unique=True, nullable=False, index=True)
    ioc_type = db.Column(db.String(50), nullable=False)  # IP, Domain, URL, Hash
    reputation_score = db.Column(db.Integer, default=0)  # 0 to 100
    confidence_score = db.Column(db.Integer, default=0)  # 0 to 100
    risk_level = db.Column(db.String(20), default='Low')  # Malicious, Suspicious, Safe, Unknown
    threat_actor = db.Column(db.String(100), nullable=True)
    malware_family = db.Column(db.String(100), nullable=True)
    country = db.Column(db.String(50), nullable=True)
    provider_source = db.Column(db.String(100), default='Combined CTI Feed')
    raw_response_json = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'ioc_value': self.ioc_value,
            'ioc_type': self.ioc_type,
            'reputation_score': self.reputation_score,
            'confidence_score': self.confidence_score,
            'risk_level': self.risk_level,
            'threat_actor': self.threat_actor,
            'malware_family': self.malware_family,
            'country': self.country,
            'provider_source': self.provider_source,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
