from flask import Flask
from app.extensions import db, migrate
import os

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://guidance_user:pupdit31@localhost/guidance_system'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'your-secret-key'

    # Configure upload folder
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    from app.routes import main
    app.register_blueprint(main)

    return app