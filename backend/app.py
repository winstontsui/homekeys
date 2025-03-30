import logging
from flask import Flask
from flask_socketio import SocketIO, emit

from routes.call_start import call_start
from routes.call_response import call_response
from routes.bland_properties import bland_properties

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")
app.register_blueprint(call_start)
app.register_blueprint(call_response)
app.register_blueprint(bland_properties)

@app.route("/push-property", methods=["GET"])
def push_property():
    new_property = {
        "id": 3,
        "image": "/lovable-uploads/3.png",
        "address": "123 New Street",
        "price": "$1,450,000",
        "status": "For Sale",
        "type": "Townhouse",
        "bedsBaths": "3/2",
        "sqft": "1800"
    }
    socketio.emit("new_property", new_property)
    return "Property pushed", 200


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
