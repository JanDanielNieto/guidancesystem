from app import db
from werkzeug.security import generate_password_hash, check_password_hash

# Define the User model
class User:
    __tablename__ = 'users'

    def __init__(self):
        from app import db  # Delayed import to avoid circular import
        self.id = db.Column(db.Integer, primary_key=True)
        self.name = db.Column(db.String(100), nullable=False)
        self.email = db.Column(db.String(120), unique=True, nullable=False)
        self.password_hash = db.Column(db.String(200), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class StudentRecord:
    __tablename__ = 'student_records'

    def __init__(self):
        from app import db  # Delayed import to avoid circular import
        self.id = db.Column(db.Integer, primary_key=True)
        self.lrn = db.Column(db.String(12), unique=True, nullable=False)
        self.name = db.Column(db.String(100), nullable=False)
        self.grade = db.Column(db.String(20), nullable=False)
        self.section = db.Column(db.String(50), nullable=False)


class OffenseRecord:
    __tablename__ = 'offense_records'

    def __init__(self):
        from app import db  # Delayed import to avoid circular import
        self.id = db.Column(db.Integer, primary_key=True)
        self.student_id = db.Column(db.Integer, db.ForeignKey('student_records.id'), nullable=False)
        self.offense_type = db.Column(db.String(100), nullable=False)
        self.reason = db.Column(db.String(200), nullable=False)
        self.date_time = db.Column(db.DateTime, nullable=False)