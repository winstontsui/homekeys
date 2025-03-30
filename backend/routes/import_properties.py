import json
from flask import Blueprint, jsonify
from models.property import Property, FinancialInfo

import_properties = Blueprint("import_properties", __name__)

def load_property_data():
    """Loads property data from JSON file."""
    with open("properties.json", "r") as file:
        return json.load(file)["properties"]

@import_properties.route("/import-properties", methods=["GET"])
def import_properties_to_mongo():
    properties = load_property_data()
    imported_count = 0

    for prop in properties:
        financial_data = prop.get("financial", {})

        property_doc = Property(
            address=prop["address"],
            price=prop["price"],
            bedrooms=prop["bedrooms"],
            bathrooms=prop["bathrooms"],
            square_footage=prop["square_footage"],
            lot_size=prop.get("lot_size"),  # can be None
            garage=prop["garage"],
            description=prop.get("description", ""),
            amenities=prop.get("amenities", []),
            financial=FinancialInfo(
                monthly_ground_rent=financial_data.get("monthly_ground_rent"),
                lease_type=financial_data.get("lease_type"),
                monthly_hoa_fees=financial_data.get("monthly_hoa_fees"),
            )
        )

        property_doc.save()
        imported_count += 1

    return jsonify({"message": f"Successfully imported {imported_count} properties."})
