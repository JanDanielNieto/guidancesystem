from app import create_app, db
from app.models import User
from werkzeug.security import generate_password_hash  # Import for password hashing

# Create the Flask app
app = create_app()

# Update the password for counselor2
with app.app_context():
    # Ensure the database tables exist
    db.create_all()

    # Query for the user counselor2
    counselor2 = User.query.filter_by(username='counselor2').first()
    if counselor2:
        # Update the password
        counselor2.password = generate_password_hash('apexbssaaGD2', method='sha256')
        db.session.commit()
        print('Password for counselor2 updated successfully!')
    else:
        print('User counselor2 not found!')