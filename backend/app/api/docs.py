from flask import Blueprint, jsonify, render_template_string

docs_bp = Blueprint('docs', __name__, url_prefix='/api/docs')

SWAGGER_HTML = """
<!DOCTYPE html>
<html>
<head>
    <title>SentinelX SOC API Documentation</title>
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.css" />
    <style>
        body { margin: 0; background-color: #0b0f19; color: #fff; }
        .swagger-ui { filter: invert(88%) hue-rotate(180deg); }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-bundle.js"></script>
    <script>
        window.onload = function() {
            SwaggerUIBundle({
                url: "/api/docs/openapi.json",
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIBundle.SwaggerUIStandalonePreset
                ]
            });
        };
    </script>
</body>
</html>
"""

OPENAPI_SPEC = {
    "openapi": "3.0.0",
    "info": {
        "title": "SentinelX AI-Powered SOC Simulation Platform API",
        "version": "1.0.0",
        "description": "Production-ready REST API for enterprise Security Operations Center (SOC) simulation."
    },
    "paths": {
        "/api/auth/login": {
            "post": {
                "summary": "Authenticate user and get JWT tokens",
                "responses": {"200": {"description": "JWT tokens issued"}}
            }
        },
        "/api/dashboard/stats": {
            "get": {
                "summary": "Retrieve real-time SOC metrics and threat score",
                "responses": {"200": {"description": "SOC Stats object"}}
            }
        },
        "/api/siem/logs": {
            "get": {
                "summary": "Retrieve paginated SIEM log stream",
                "responses": {"200": {"description": "Logs list"}}
            }
        },
        "/api/threat-intel/lookup": {
            "get": {
                "summary": "Query Threat Intelligence for IP, Domain, Hash, or URL",
                "responses": {"200": {"description": "CTI Intelligence profile"}}
            }
        },
        "/api/ai-analyst/chat": {
            "post": {
                "summary": "Interact with AI Security Analyst (Claude/Gemini)",
                "responses": {"200": {"description": "AI analysis response"}}
            }
        }
    }
}

@docs_bp.route('/', methods=['GET'])
def swagger_ui():
    return render_template_string(SWAGGER_HTML)

@docs_bp.route('/openapi.json', methods=['GET'])
def openapi_json():
    return jsonify(OPENAPI_SPEC), 200
