from datetime import datetime
from . import db
from werkzeug.security import generate_password_hash, check_password_hash

class StudentRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lrn = db.Column(db.String(12), nullable=False, unique=True)
    name = db.Column(db.String(100), nullable=False)
    grade_section = db.Column(db.String(50), nullable=False)
    birthdate = db.Column(db.Date, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    mother_tongue = db.Column(db.String(50), nullable=False)
    ethnic_group = db.Column(db.String(50), nullable=True)
    religion = db.Column(db.String(50), nullable=False)
    address_house_no = db.Column(db.String(100), nullable=False)
    address_barangay = db.Column(db.String(100), nullable=False)
    address_city = db.Column(db.String(100), nullable=False)
    address_province = db.Column(db.String(100), nullable=False)
    mother_name = db.Column(db.String(100), nullable=False)
    father_name = db.Column(db.String(100), nullable=False)
    guardian_name = db.Column(db.String(100), nullable=True)
    offenses = db.relationship('OffenseRecord', backref='student', cascade='all, delete-orphan', lazy=True)

class OffenseRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_record.id'), nullable=False)
    offense_type = db.Column(db.String(100), nullable=False)
    reason = db.Column(db.String(200), nullable=False)
    additional_info = db.Column(db.Text, nullable=True)
    date_time = db.Column(db.DateTime, default=datetime.utcnow)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)