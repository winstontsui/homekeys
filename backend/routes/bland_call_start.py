from flask import Blueprint, request, jsonify
import requests
from config import Config

bland_call_start = Blueprint("bland_call_start", __name__)

@bland_call_start.route("/bland-start-call", methods=["POST"])
def start_call():
    data = request.get_json()
    phone_number = data.get("phone")

    if not phone_number:
        return jsonify({"error": "Phone number is required"}), 400

    headers = {
        "Authorization": f"Bearer {Config.BLAND_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "phone_number": phone_number,
        "pathway_id": "9c28befe-308e-40eb-893f-c56503491b64",
        "voice": "june",
    }

    try:
        response = requests.post("https://api.bland.ai/v1/calls", json=payload, headers=headers)
        response.raise_for_status()
        return jsonify({"message": "Call started successfully"}), 200
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500