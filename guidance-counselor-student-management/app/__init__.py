from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os

db = SQLAlchemy()  # Initialize SQLAlchemy
migrate = Migrate()  # Initialize Flask-Migrate

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://guidance_user:pupdit31@localhost/guidance_system'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = b'\x81kP\xfc\xc2\xef%\x85\xde\xd4\xa7\xab\x08U7\xb7S4\r\xc8Ep5\xde'

    # Configure upload folder
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

    db.init_app(app)  # Bind SQLAlchemy to the app
    migrate.init_app(app, db)  # Bind Flask-Migrate to the app and db

    from .routes import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app