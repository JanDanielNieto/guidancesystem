from datetime import datetime, date
import pandas as pd
from werkzeug.security import generate_password_hash, check_password_hash
from .extensions import db

class StudentRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lrn = db.Column(db.String(12), nullable=False, unique=True)
    name = db.Column(db.String(100), nullable=False)
    grade = db.Column(db.String(20), nullable=False)
    section = db.Column(db.String(50), nullable=False)
    birthdate = db.Column(db.Date, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    mother_tongue = db.Column(db.String(50), nullable=False)
    ethnic_group = db.Column(db.String(50), nullable=True)
    religion = db.Column(db.String(50), nullable=False)
    address_house_no = db.Column(db.String(100), nullable=True)  # Changed to nullable=True
    address_barangay = db.Column(db.String(100), nullable=False)
    address_city = db.Column(db.String(100), nullable=False)
    address_province = db.Column(db.String(100), nullable=True)  # Changed to nullable=True
    mother_name = db.Column(db.String(100), nullable=False)
    mother_contact = db.Column(db.String(15), nullable=True)
    father_name = db.Column(db.String(100), nullable=False)
    father_contact = db.Column(db.String(15), nullable=True)
    guardian_name = db.Column(db.String(100), nullable=True)
    guardian_contact = db.Column(db.String(15), nullable=True)
    reason = db.Column(db.String(200), nullable=True)
    type_of_offense = db.Column(db.String(100), nullable=True)
    date_time = db.Column(db.DateTime, default=datetime.utcnow)
    additional_info = db.Column(db.Text, nullable=True)
    profile_picture = db.Column(db.String(100), nullable=True)
    offenses = db.relationship('OffenseRecord', backref='student', lazy=True)
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



def populate_database_from_excel(file_path):
    sheets = {
        'Grade 10': {
            'lrn': 'LRN',
            'name': 'NAME',
            'section': 'Section',
            'birthdate': 'BIRTH DATE (mm/dd/yyyy)',
            'age': 'Age as of October 31',
            'gender': 'SEX',
            'mother_tongue': 'MOTHER TONGUE',
            'ethnic_group': 'IP',
            'religion': 'RELIGION',
            'address_house_no': 'House No',  # Update this if necessary
            'address_barangay': 'Barangay',
            'address_city': 'Municipality/City',
            'address_province': 'Province',  # Update this if necessary
            'mother_name': "Mother's Maiden Name(Last Name, First Name, Middle Name)",
            'mother_contact': 'Mother Contact',  # Update this if necessary
            'father_name': "Father's Name(Last Name, First Name, Middle Name)",
            'father_contact': 'Father Contact',  # Update this if necessary
            'guardian_name': 'Guardian Name',
            'guardian_contact': 'Contact Number of Parent or Guardian'
        },
        'Grade 9': {
            'lrn': 'LRN',
            'name': 'NAME',
            'section': 'Section',
            'birthdate': 'BIRTH DATE (mm/dd/yyyy)',
            'age': 'Age as of October 31',
            'gender': 'SEX',
            'mother_tongue': 'MOTHER TONGUE',
            'ethnic_group': 'IP',
            'religion': 'RELIGION',
            'address_house_no': 'House No',  # Update this if necessary
            'address_barangay': 'Barangay',
            'address_city': 'Municipality/City',
            'address_province': 'Province',  # Update this if necessary
            'mother_name': "Mother's Maiden Name(Last Name, First Name, Middle Name)",
            'mother_contact': 'Mother Contact',  # Update this if necessary
            'father_name': "Father's Name(Last Name, First Name, Middle Name)",
            'father_contact': 'Father Contact',  # Update this if necessary
            'guardian_name': 'Guardian Name',
            'guardian_contact': 'Contact Number of Parent or Guardian'
        },
        'Grade 8': {
            'lrn': 'LRN',
            'name': 'NAME',
            'section': 'Section',
            'birthdate': 'BIRTH DATE (mm/dd/yyyy)',
            'age': 'Age as of October 31',
            'gender': 'SEX',
            'mother_tongue': 'MOTHER TONGUE',
            'ethnic_group': 'IP',
            'religion': 'RELIGION',
            'address_house_no': 'House No',  # Update this if necessary
            'address_barangay': 'Barangay',
            'address_city': 'Municipality/City',
            'address_province': 'Province',  # Update this if necessary
            'mother_name': "Mother's Maiden Name(Last Name, First Name, Middle Name)",
            'mother_contact': 'Mother Contact',  # Update this if necessary
            'father_name': "Father's Name(Last Name, First Name, Middle Name)",
            'father_contact': 'Father Contact',  # Update this if necessary
            'guardian_name': 'Guardian Name',
            'guardian_contact': 'Contact Number of Parent or Guardian'
        },
        'Grade 7': {
            'lrn': 'LRN',
            'name': 'NAME',
            'section': 'Section',
            'birthdate': 'BIRTH DATE (mm/dd/yyyy)',
            'age': 'Age as of October 31',
            'gender': 'SEX',
            'mother_tongue': 'MOTHER TONGUE',
            'ethnic_group': 'IP',
            'religion': 'RELIGION',
            'address_house_no': 'House No',  # Update this if necessary
            'address_barangay': 'Barangay',
            'address_city': 'Municipality/City',
            'address_province': 'Province',  # Update this if necessary
            'mother_name': "Mother's Maiden Name(Last Name, First Name, Middle Name)",
            'mother_contact': 'Mother Contact',  # Update this if necessary
            'father_name': "Father's Name(Last Name, First Name, Middle Name)",
            'father_contact': 'Father Contact',  # Update this if necessary
            'guardian_name': 'Guardian Name',
            'guardian_contact': 'Contact Number of Parent or Guardian'
        }
    }

    for sheet, columns in sheets.items():
        grade = sheet.split()[1]  # Extract the grade from the sheet name
        data = pd.read_excel(file_path, sheet_name=sheet)
        print(f"Columns in {sheet}: {data.columns.tolist()}")  # Print the column names
        for index, row in data.iterrows():
            birthdate = row[columns['birthdate']]
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
                birthdate = None  # Handle unexpected types

            # Ensure required fields are not None
            lrn = row.get(columns['lrn'], None)
            name = row.get(columns['name'], None)
            section = row.get(columns['section'], None)
            age = row.get(columns['age'], None)
            gender = row.get(columns['gender'], None)
            mother_tongue = row.get(columns['mother_tongue'], None)
            ethnic_group = row.get(columns['ethnic_group'], None)
            religion = row.get(columns['religion'], None)
            address_house_no = row.get(columns['address_house_no'], None)
            address_barangay = row.get(columns['address_barangay'], None)
            address_city = row.get(columns['address_city'], None)
            address_province = row.get(columns['address_province'], None)
            mother_name = row.get(columns['mother_name'], None)
            mother_contact = row.get(columns['mother_contact'], None)
            father_name = row.get(columns['father_name'], None)
            father_contact = row.get(columns['father_contact'], None)
            guardian_name = row.get(columns['guardian_name'], None)
            guardian_contact = row.get(columns['guardian_contact'], None)

            # Skip rows with missing required fields
            if not all([lrn, name, section, age, gender, religion, ethnic_group]):
                continue

            student = StudentRecord(
                lrn=lrn,
                name=name,
                grade=grade,
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