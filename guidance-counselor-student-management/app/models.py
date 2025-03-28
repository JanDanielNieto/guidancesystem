from datetime import datetime, date
import pandas as pd
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db


class StudentRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lrn = db.Column(db.String(12), nullable=True, unique=True)
    name = db.Column(db.String(100), nullable=True)
    grade = db.Column(db.String(20), nullable=True)
    section = db.Column(db.String(50), nullable=True)
    birthdate = db.Column(db.Date, nullable=True)
    age = db.Column(db.Integer, nullable=True)
    gender = db.Column(db.String(10), nullable=True)
    mother_tongue = db.Column(db.String(50), nullable=True)
    ethnic_group = db.Column(db.String(50), nullable=True)
    religion = db.Column(db.String(50), nullable=True)
    address_house_no = db.Column(db.String(100), nullable=True)
    address_barangay = db.Column(db.String(100), nullable=True)
    address_city = db.Column(db.String(100), nullable=True)
    address_province = db.Column(db.String(100), nullable=True)
    mother_name = db.Column(db.String(100), nullable=True)
    mother_contact = db.Column(db.String(15), nullable=True)
    father_name = db.Column(db.String(100), nullable=True)
    father_contact = db.Column(db.String(15), nullable=True)
    guardian_name = db.Column(db.String(100), nullable=True)
    guardian_contact = db.Column(db.String(15), nullable=True)
    profile_picture = db.Column(db.String(100), nullable=True)
    offenses = db.relationship('OffenseRecord', backref='student', lazy=True)


class OffenseRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_record.id'), nullable=False)
    offense_type = db.Column(db.String(100), nullable=True)
    reason = db.Column(db.String(200), nullable=True)
    additional_info = db.Column(db.Text, nullable=True)
    date_time = db.Column(db.DateTime, default=datetime.utcnow)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


def calculate_age(birthdate):
    today = date.today()
    age = today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))
    return age


def populate_database_from_excel(file_path):
    # Read the Excel file
    excel_data = pd.ExcelFile(file_path)

    # Iterate over each sheet in the Excel file
    for sheet_name in excel_data.sheet_names:
        data = pd.read_excel(file_path, sheet_name=sheet_name)

        # Iterate over each row in the sheet
        for index, row in data.iterrows():
            lrn = row.get('LRN', None)
            if pd.notna(lrn):
                lrn = str(int(lrn)).zfill(12)  # Ensure LRN is 12 digits
            else:
                lrn = None

            name = row.get('NAME', None)
            section = row.get('Section', None)
            birthdate = row.get('BIRTH DATE (mm/dd/yyyy)', None)
            age = row.get('Age as of October 31', None)
            gender = row.get('SEX', None)
            mother_tongue = row.get('MOTHER TONGUE', None)
            ethnic_group = row.get('IP', None)
            religion = row.get('RELIGION', None)
            address_house_no = row.get('House No', None)
            address_barangay = row.get('Barangay', None)
            address_city = row.get('Municipality/City', None)
            address_province = row.get('Province', None)
            mother_name = row.get("Mother's Maiden Name(Last Name, First Name, Middle Name)", None)
            mother_contact = row.get('Mother Contact', None)
            father_name = row.get("Father's Name(Last Name, First Name, Middle Name)", None)
            father_contact = row.get('Father Contact', None)
            guardian_name = row.get('Guardian Name', None)
            guardian_contact = row.get('Contact Number of Parent or Guardian', None)

            # Convert birthdate to date object
            if isinstance(birthdate, str):
                try:
                    birthdate = datetime.strptime(birthdate, '%m/%d/%Y').date()
                except ValueError:
                    birthdate = datetime.strptime(birthdate, '%m-%d-%Y').date()
            elif isinstance(birthdate, datetime):
                birthdate = birthdate.date()
            elif isinstance(birthdate, date):
                birthdate = birthdate
            else:
                birthdate = None

            # Calculate age if birthdate is available
            if birthdate:
                age = calculate_age(birthdate)

            # Create a new StudentRecord object
            student = StudentRecord(
                lrn=lrn,
                name=name,
                grade=sheet_name.split()[1],  # Extract the grade from the sheet name
                section=section,
                birthdate=birthdate,
                age=age,
                gender=gender,
                mother_tongue=mother_tongue,
                ethnic_group=ethnic_group,
                religion=religion,
                address_house_no=address_house_no,
                address_barangay=address_barangay,
                address_city=address_city,
                address_province=address_province,
                mother_name=mother_name,
                mother_contact=mother_contact,
                father_name=father_name,
                father_contact=father_contact,
                guardian_name=guardian_name,
                guardian_contact=guardian_contact
            )
            db.session.add(student)
    db.session.commit()