from flask import Blueprint, jsonify
import json

bland_properties = Blueprint("bland_properties", __name__)

def load_property_data():
    """Loads property data from JSON file."""
    with open("properties.json", "r") as file:
        return json.load(file)["properties"]

@bland_properties.route("/bland-properties", methods=["POST"])
def bland_properties_handler():
    properties = load_property_data()

    if not properties:
        # optional fallback memory
        return jsonify({
            "memory": {
                "properties": []
            }
        })

    return jsonify({
        "response": None,  # Don't say anything
        "memory": {
            "properties": properties[:2]  # Store in Bland memory
        }
    })
