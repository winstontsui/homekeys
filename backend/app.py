import logging
from flask import Flask

from routes.call_start import call_start
from routes.call_response import call_response
from routes.import_properties import import_properties
from config import Config
from mongoengine import connect

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    app = Flask(__name__)
    connect(host=Config.MONGO_DB)
    app.register_blueprint(call_start)
    app.register_blueprint(call_response)
    app.register_blueprint(import_properties)
    app.run(host='0.0.0.0', port=5000, debug=True)
