from flask import Blueprint, jsonify
from app.services.mitre_mapper import get_mitre_matrix, calculate_coverage, get_attack_chain_sample

mitre_bp = Blueprint('mitre', __name__, url_prefix='/api/mitre')

@mitre_bp.route('/matrix', methods=['GET'])
def matrix():
    return jsonify(get_mitre_matrix()), 200

@mitre_bp.route('/coverage', methods=['GET'])
def coverage():
    return jsonify(calculate_coverage()), 200

@mitre_bp.route('/attack-chain', methods=['GET'])
def attack_chain():
    return jsonify(get_attack_chain_sample()), 200
