from flask import Blueprint, request, jsonify
import yaml
from app.extensions import db
from app.models.rule import DetectionRule
from app.models.log import Log

rules_bp = Blueprint('rules', __name__, url_prefix='/api/rules')

@rules_bp.route('/', methods=['GET'])
def get_rules():
    rules = DetectionRule.query.order_by(DetectionRule.id.asc()).all()
    return jsonify([r.to_dict() for r in rules]), 200

@rules_bp.route('/', methods=['POST'])
def create_rule():
    data = request.get_json() or {}
    name = data.get('name')
    description = data.get('description', '')
    rule_type = data.get('rule_type', 'Sigma')
    severity = data.get('severity', 'High')
    category = data.get('category', 'Custom')
    mitre_technique_id = data.get('mitre_technique_id')
    mitre_tactic = data.get('mitre_tactic')
    sigma_yaml = data.get('sigma_yaml')
    condition_expression = data.get('condition_expression')

    if not name:
        return jsonify({'error': 'Rule name is required.'}), 400

    rule = DetectionRule(
        name=name,
        description=description,
        rule_type=rule_type,
        severity=severity,
        category=category,
        mitre_technique_id=mitre_technique_id,
        mitre_tactic=mitre_tactic,
        sigma_yaml=sigma_yaml,
        condition_expression=condition_expression,
        enabled=True
    )
    db.session.add(rule)
    db.session.commit()

    return jsonify({'message': 'Detection rule created successfully.', 'rule': rule.to_dict()}), 201

@rules_bp.route('/<int:rule_id>/toggle', methods=['POST'])
def toggle_rule(rule_id):
    rule = DetectionRule.query.get_or_404(rule_id)
    rule.enabled = not rule.enabled
    db.session.commit()
    return jsonify({'message': f"Rule '{rule.name}' {'enabled' if rule.enabled else 'disabled'}.", 'rule': rule.to_dict()}), 200

@rules_bp.route('/parse-sigma', methods=['POST'])
def parse_sigma():
    data = request.get_json() or {}
    yaml_text = data.get('yaml_text', '')
    try:
        parsed = yaml.safe_load(yaml_text)
        return jsonify({
            'valid': True,
            'parsed': parsed,
            'title': parsed.get('title'),
            'description': parsed.get('description'),
            'level': parsed.get('level')
        }), 200
    except Exception as e:
        return jsonify({'valid': False, 'error': str(e)}), 400
