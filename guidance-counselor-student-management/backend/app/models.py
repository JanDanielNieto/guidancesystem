from app import db
from datetime import datetime

class StudentRecord(db.Model):
    __tablename__ = 'student_records'

    id = db.Column(db.Integer, primary_key=True)
    lrn = db.Column(db.String(12), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    grade = db.Column(db.String(20), nullable=False)
    section = db.Column(db.String(50), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    birthdate = db.Column(db.Date, nullable=False)
    address_house_no = db.Column(db.String(50))
    address_barangay = db.Column(db.String(100))
    address_city = db.Column(db.String(100))
    address_province = db.Column(db.String(100))
    father_name = db.Column(db.String(100))
    mother_name = db.Column(db.String(100))
    guardian_name = db.Column(db.String(100))
    date_time = db.Column(db.DateTime, default=datetime.utcnow)

class OffenseRecord(db.Model):
    __tablename__ = 'offense_records'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_records.id'), nullable=False)
    offense_type = db.Column(db.String(100), nullable=False)
    reason = db.Column(db.String(200), nullable=False)
    additional_info = db.Column(db.String(500))
    date_time = db.Column(db.DateTime, default=datetime.utcnow)