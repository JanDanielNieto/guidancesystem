from flask import Flask
from flask_sqlalchemy import SQLAlchemy
<<<<<<< HEAD

db = SQLAlchemy()
=======
from flask_migrate import Migrate
import os
from .extensions import db

migrate = Migrate()
>>>>>>> 348e156 (fixed bug with flask_uploads (removed flask_uploads))

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/guidancesystem'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
<<<<<<< HEAD

    db.init_app(app)
=======
    app.config['SECRET_KEY'] = b'\x81kP\xfc\xc2\xef%\x85\xde\xd4\xa7\xab\x08U7\xb7S4\r\xc8Ep5\xde'

    # Configure upload folder
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

    db.init_app(app)
    migrate.init_app(app, db)
>>>>>>> 348e156 (fixed bug with flask_uploads (removed flask_uploads))

    from app.routes import main
    app.register_blueprint(main)

    with app.app_context():
        from app import models

    return app