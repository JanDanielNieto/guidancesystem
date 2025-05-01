from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager
from flask_migrate import Migrate  # Import Flask-Migrate

db = SQLAlchemy()
login_manager = LoginManager()
migrate = Migrate()  # Initialize Flask-Migrate


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins

    # PostgreSQL database configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:sabando28@localhost/guidance_system'
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