from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_uploads import UploadSet, configure_uploads, IMAGES

db = SQLAlchemy()
migrate = Migrate()
photos = UploadSet('photos', IMAGES)

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = b'\x81kP\xfc\xc2\xef%\x85\xde\xd4\xa7\xab\x08U7\xb7S4\r\xc8Ep5\xde'
    app.config['UPLOADED_PHOTOS_DEST'] = 'static/images'

    db.init_app(app)
    migrate.init_app(app, db)
    configure_uploads(app, photos)

    from .routes import main
    app.register_blueprint(main)

    return app