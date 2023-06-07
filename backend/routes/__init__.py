from flask import Flask
from flask_cors import CORS

app = Flask(__name__)


app = Flask(__name__)
CORS(app, allow_headers="application/json")
