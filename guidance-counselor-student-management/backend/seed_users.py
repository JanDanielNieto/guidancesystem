from app import create_app, db
from app.models import User
from werkzeug.security import generate_password_hash  # Import for password hashing

app = create_app()

with app.app_context():
    db.create_all()

    # Add guidance counselors with hashed passwords
    counselor1 = User(username='counselor1', password=generate_password_hash('apexbssaaGD1', method='sha256'))
    counselor2 = User(username='counselor2', password=generate_password_hash('apexbssaaaGD2', method='sha256'))

    db.session.add(counselor1)
    db.session.add(counselor2)
    db.session.commit()

    print('Guidance counselors added successfully!')