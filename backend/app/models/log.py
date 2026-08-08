from datetime import datetime
import json
from app.extensions import db

class Log(db.Model):
    __tablename__ = 'logs'

    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    source = db.Column(db.String(50), nullable=False)  # Windows, Linux, Firewall, IDS, WebServer, Cloud
    log_level = db.Column(db.String(20), default='INFO')  # INFO, WARNING, ERROR, CRITICAL
    event_id = db.Column(db.String(50), nullable=True)
    source_ip = db.Column(db.String(50), nullable=True, index=True)
    destination_ip = db.Column(db.String(50), nullable=True)
    user_affected = db.Column(db.String(100), nullable=True)
    hostname = db.Column(db.String(100), nullable=True)
    raw_message = db.Column(db.Text, nullable=False)
    parsed_json = db.Column(db.Text, nullable=True)  # JSON formatted parsed data
    normalized_category = db.Column(db.String(100), nullable=True)  # authentication, network_flow, process_creation, web_access

    def to_dict(self):
        parsed = {}
        if self.parsed_json:
            try:
                parsed = json.loads(self.parsed_json)
            except Exception:
                parsed = {}
        return {
            'id': self.id,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'source': self.source,
            'log_level': self.log_level,
            'event_id': self.event_id,
            'source_ip': self.source_ip,
            'destination_ip': self.destination_ip,
            'user_affected': self.user_affected,
            'hostname': self.hostname,
            'raw_message': self.raw_message,
            'parsed_data': parsed,
            'normalized_category': self.normalized_category
        }
