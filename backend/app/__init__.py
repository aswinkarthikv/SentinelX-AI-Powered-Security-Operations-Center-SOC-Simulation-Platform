import os
from flask import Flask
from app.config import config_by_name
from app.extensions import db, jwt, cors
from app.services.detection_engine import seed_default_rules, evaluate_log_against_rules
from app.services.siem_engine import generate_random_log, simulate_attack_scenario

def create_app(config_name='dev'):
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    # Register API blueprints
    from app.api.auth import auth_bp
    from app.api.dashboard import dashboard_bp
    from app.api.siem import siem_bp
    from app.api.rules import rules_bp
    from app.api.mitre import mitre_bp
    from app.api.threat_intel import threat_intel_bp
    from app.api.ai_analyst import ai_analyst_bp
    from app.api.incidents import incidents_bp
    from app.api.reports import reports_bp
    from app.api.search import search_bp
    from app.api.docs import docs_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(siem_bp)
    app.register_blueprint(rules_bp)
    app.register_blueprint(mitre_bp)
    app.register_blueprint(threat_intel_bp)
    app.register_blueprint(ai_analyst_bp)
    app.register_blueprint(incidents_bp)
    app.register_blueprint(reports_bp)
    app.register_blueprint(search_bp)
    app.register_blueprint(docs_bp)

    # Seed Database on Startup
    with app.app_context():
        db.create_all()
        seed_default_rules()
        seed_initial_data()

    return app

def seed_initial_data():
    from app.models.user import User
    from app.models.log import Log
    from app.models.incident import Incident

    if User.query.count() == 0:
        admin = User(
            username='admin',
            email='admin@sentinelx.soc',
            role='Admin',
            department='SOC Executive Management'
        )
        admin.set_password('Admin@123')

        analyst = User(
            username='Aswin Karthik',
            email='karthik@sentinelx.soc',
            role='SOC Analyst',
            department='Incident Response Team'
        )
        analyst.set_password('Analyst@123')

        db.session.add_all([admin, analyst])
        db.session.commit()

    if Log.query.count() == 0:
        # Seed initial log stream and attack simulations
        simulate_attack_scenario('brute_force')
        simulate_attack_scenario('sqli')
        simulate_attack_scenario('ransomware')
        for _ in range(15):
            log = generate_random_log()
            db.session.add(log)
            db.session.flush()
            evaluate_log_against_rules(log)
        db.session.commit()
