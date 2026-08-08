from flask import Blueprint, request, jsonify
from app.services.ai_service import AISecurityAnalyst

ai_analyst_bp = Blueprint('ai_analyst', __name__, url_prefix='/api/ai-analyst')

@ai_analyst_bp.route('/chat', methods=['POST'])
def chat():
    data = request.get_json() or {}
    prompt = data.get('prompt', '')
    alert_context = data.get('alert_context')

    if not prompt:
        return jsonify({'error': 'Prompt is required.'}), 400

    response_text = AISecurityAnalyst.query_ai_assistant(prompt, alert_context)
    return jsonify({
        'prompt': prompt,
        'response': response_text
    }), 200

@ai_analyst_bp.route('/explain-alert', methods=['POST'])
def explain_alert():
    data = request.get_json() or {}
    alert_title = data.get('title', 'Generic Alert')
    alert_desc = data.get('description', '')
    source_ip = data.get('source_ip', '185.220.101.5')

    prompt = f"Explain alert '{alert_title}' from source IP {source_ip}. Description: {alert_desc}"
    explanation = AISecurityAnalyst.explain_alert_expert(prompt, data)
    return jsonify({'explanation': explanation}), 200

@ai_analyst_bp.route('/containment', methods=['POST'])
def containment():
    data = request.get_json() or {}
    source_ip = data.get('source_ip', '185.220.101.5')
    playbook = AISecurityAnalyst.generate_containment_playbook(f"Contain host IP {source_ip}", data)
    return jsonify({'containment_playbook': playbook}), 200
