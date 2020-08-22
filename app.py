# ----------------------
# CSCI S-14a 2020
# G6
# ----------------------
from flask import Flask, render_template, send_from_directory
import os
from flask_heroku import Heroku
import pandas as pd

app = Flask(__name__)
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'static/favicon.ico', mimetype='image/vnd.microsoft.icon')
# GET /
@app.route("/", methods=['GET'])
def index():
    return render_template("index.html")
