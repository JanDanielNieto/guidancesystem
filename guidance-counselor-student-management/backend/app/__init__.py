from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager
from flask_migrate import Migrate  
from dotenv import load_dotenv
import os

load_dotenv()

db = SQLAlchemy()
login_manager = LoginManager()
migrate = Migrate()  


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "https://apexguidance.vercel.app"}})

    # PostgreSQL database configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')  # Use DATABASE_URL from .env
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'APEXGUIDANCE'  # Add a secret key for session management

    # Initialize extensions
    db.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)  # Bind Flask-Migrate to the app and database

    # Register blueprints
    from app.routes import main
    app.register_blueprint(main)

    # User loader for Flask-Login
    @login_manager.user_loader
    def load_user(user_id):
        from app.models import User
        return User.query.get(int(user_id))

    return app