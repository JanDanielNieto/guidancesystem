from flask import Flask
from pymongo import MongoClient

def create_app():
    app = Flask(__name__)
    app.config['UPLOAD_FOLDER'] = 'uploads'

    # Initialize MongoDB
    client = MongoClient('mongodb://localhost:27017')  # Replace with your MongoDB URI
    app.db = client['guidance_system']  # Replace with your database name

    # Register blueprints
    from app.routes import main
    app.register_blueprint(main)

    return app