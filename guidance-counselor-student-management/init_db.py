from app import create_app, db
from app.extensions import db
from app.models import User, StudentRecord, OffenseRecord  # Import your models here

# Create the Flask app instance
app = create_app()

# Use the application context to initialize the database
with app.app_context():
    db.create_all()  # Create all tables defined in your models
    print("Database tables created successfully.")