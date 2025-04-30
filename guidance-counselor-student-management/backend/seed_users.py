from app import create_app, db
from app.models import User

app = create_app()

with app.app_context():
    db.create_all()

    # Add guidance counselors with plain text passwords
    counselor1 = User(username='counselor1', password='apexbssaaGD1')  # Plain text password
    counselor2 = User(username='counselor2', password='apexbssaaaGD2')  # Plain text password

    db.session.add(counselor1)
    db.session.add(counselor2)
    db.session.commit()

    print('Guidance counselors added successfully!')