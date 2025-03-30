import logging
from flask import Flask

from routes.call_start import call_start
from routes.call_response import call_response

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    app = Flask(__name__)
    app.register_blueprint(call_start)
    app.register_blueprint(call_response)
    app.run(host='0.0.0.0', port=5000, debug=True)
