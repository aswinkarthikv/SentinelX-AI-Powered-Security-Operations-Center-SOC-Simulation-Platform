from flask import Blueprint, request, jsonify
from app.services.threat_intel_service import lookup_ioc

threat_intel_bp = Blueprint('threat_intel', __name__, url_prefix='/api/threat-intel')

@threat_intel_bp.route('/lookup', methods=['GET', 'POST'])
def ioc_lookup():
    if request.method == 'GET':
        query = request.args.get('ioc', '')
    else:
        data = request.get_json() or {}
        query = data.get('ioc', '')

    if not query:
        return jsonify({'error': 'An IOC string (IP, Domain, URL, or Hash) is required.'}), 400

    result = lookup_ioc(query)
    return jsonify(result), 200
