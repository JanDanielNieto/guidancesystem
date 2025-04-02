from app import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class StudentRecord(db.Model):
    __tablename__ = 'student_records'

    id = db.Column(db.Integer, primary_key=True)
    lrn = db.Column(db.String(12), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    grade = db.Column(db.String(20), nullable=False)
    section = db.Column(db.String(50), nullable=False)

class OffenseRecord(db.Model):
    __tablename__ = 'offense_records'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_records.id'), nullable=False)
    offense_type = db.Column(db.String(100), nullable=False)
    reason = db.Column(db.String(200), nullable=False)
    date_time = db.Column(db.DateTime, nullable=False)