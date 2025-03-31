import logging
import json
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS

from routes.call_start import call_start
from routes.call_response import call_response
from routes.bland_properties import bland_properties
from routes.bland_call_start import bland_call_start
from routes.import_properties import import_properties
from config import Config
from mongoengine import connect

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)
connect(host=Config.MONGO_DB)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")
app.register_blueprint(call_start)
app.register_blueprint(call_response)
app.register_blueprint(bland_properties)
app.register_blueprint(bland_call_start)

saved_properties = []

def load_property_data():
    """Loads property data from JSON file."""
    with open("properties.json", "r") as file:
        return json.load(file)["properties"]

@app.route("/push-property-by-id", methods=["POST"])
def push_property_by_id():
    data = request.get_json()

    try:
        property_id = int(data.get("propertyId"))
        print(f"Parsed propertyId: {property_id}")
    except (TypeError, ValueError):
        print("Missing or invalid propertyId")
        return jsonify({"error": "Missing or invalid propertyId"}), 400

    try:
        properties = load_property_data()
    except Exception as e:
        print("Failed to load properties:", str(e))
        return jsonify({"error": f"Failed to load properties: {str(e)}"}), 500

    selected_property = next((prop for prop in properties if prop.get("id") == property_id), None)

    if not selected_property:
        print(f"Property with id {property_id} not found")
        return jsonify({"error": "Property not found"}), 404

    new_property = {
        "id": selected_property["id"],
        "image": f"/lovable-uploads/{selected_property['id']}.png",
        "address": selected_property["address"],
        "price": f"${selected_property['price']:,}",
        "status": "For Sale",
        "type": "House",
        "bedsBaths": f"{selected_property['bedrooms']}/{selected_property['bathrooms']}",
        "sqft": str(selected_property["square_footage"])
    }

    saved_properties.append(new_property)

    return jsonify({"message": "Property pushed", "propertyId": property_id}), 200

@app.route("/saved-properties", methods=["GET"])
def get_saved_properties():
    """Returns the list of saved properties."""
    return jsonify(saved_properties), 200

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
