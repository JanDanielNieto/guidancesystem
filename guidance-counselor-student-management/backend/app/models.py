from app import db
from datetime import datetime

class StudentRecord(db.Model):
    __tablename__ = 'student_information'

    id = db.Column(db.Integer, primary_key=True)
    lrn = db.Column(db.String(12), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    grade = db.Column(db.String(20), nullable=False)
    section = db.Column(db.String(50), nullable=False)
    sex = db.Column(db.String(10))
    birthdate = db.Column(db.Date)
    mother_tongue = db.Column(db.String(50))
    religion = db.Column(db.String(50))
    barangay = db.Column(db.String(100))
    municipality_city = db.Column(db.String(100))
    father_name = db.Column(db.String(100))
    mother_name = db.Column(db.String(100))
    guardian_name = db.Column(db.String(100))
    contact_number = db.Column(db.String(15))
    date_time = db.Column(db.DateTime, default=datetime.utcnow)
    profile_image = db.Column(db.String(255), nullable=True)  # New field for storing the profile image path

    def to_dict(self):
        return {
            'id': self.id,
            'lrn': self.lrn,
            'name': self.name,
            'grade': self.grade,
            'section': self.section,
            'sex': self.sex,
            'birthdate': self.birthdate.strftime('%Y-%m-%d') if self.birthdate else None,
            'mother_tongue': self.mother_tongue,
            'religion': self.religion,
            'barangay': self.barangay,
            'municipality_city': self.municipality_city,
            'father_name': self.father_name,
            'mother_name': self.mother_name,
            'guardian_name': self.guardian_name,
            'contact_number': self.contact_number,
            'date_time': self.date_time.strftime('%Y-%m-%d %H:%M:%S') if self.date_time else None,
            'profile_image': self.profile_image  # Include the profile image path in the dictionary
        }

class OffenseRecord(db.Model):
    __tablename__ = 'offense_records'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_information.id'), nullable=False)
    offense_type = db.Column(db.String(100), nullable=False)
    reason = db.Column(db.String(200), nullable=True)
    additional_info = db.Column(db.String(500))
    date_time = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,  # Include the offense ID
            'type': self.offense_type,
            'reason': self.reason,
            'date': self.date_time.strftime('%Y-%m-%d %H:%M:%S') if self.date_time else None
        }