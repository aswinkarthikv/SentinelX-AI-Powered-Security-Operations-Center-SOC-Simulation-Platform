from flask import Blueprint, request, jsonify, send_file
import io
from app.services.report_generator import generate_report_json, generate_report_pdf_bytes

reports_bp = Blueprint('reports', __name__, url_prefix='/api/reports')

@reports_bp.route('/generate', methods=['GET', 'POST'])
def generate_report():
    data = request.get_json() if request.method == 'POST' else {}
    report_type = data.get('report_type', request.args.get('type', 'Daily SOC'))

    result = generate_report_json(report_type)
    return jsonify(result), 200

@reports_bp.route('/export-pdf', methods=['GET'])
def export_pdf():
    report_type = request.args.get('type', 'Daily SOC Report')
    pdf_bytes = generate_report_pdf_bytes(report_type)

    return send_file(
        io.BytesIO(pdf_bytes),
        mimetype='application/pdf',
        as_attachment=True,
        download_name=f"SentinelX_Report_{report_type.replace(' ', '_')}.pdf"
    )
