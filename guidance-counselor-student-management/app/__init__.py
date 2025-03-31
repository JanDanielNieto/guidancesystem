from flask import Flask, request, jsonify, session
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId
from app.models import User
import pandas as pd

mongo = PyMongo()

class User:
    @staticmethod
    def create_user(name, email, password):
        password_hash = generate_password_hash(password)
        user = {
            "name": name,
            "email": email,
            "password_hash": password_hash
        }
        return mongo.db.users.insert_one(user)

    @staticmethod
    def find_user_by_email(email):
        return mongo.db.users.find_one({"email": email})

    @staticmethod
    def check_password(user, password):
        return check_password_hash(user['password_hash'], password)

class StudentRecord:
    @staticmethod
    def create_student(data):
        return mongo.db.students.insert_one(data)

    @staticmethod
    def find_student_by_id(student_id):
        return mongo.db.students.find_one({"_id": ObjectId(student_id)})

class OffenseRecord:
    @staticmethod
    def create_offense(student_id, offense_data):
        offense_data['student_id'] = ObjectId(student_id)
        return mongo.db.offenses.insert_one(offense_data)

    @staticmethod
    def find_offenses_by_student_id(student_id):
        return mongo.db.offenses.find({"student_id": ObjectId(student_id)})

def populate_database_from_excel(file_path):
    excel_data = pd.ExcelFile(file_path)

    for sheet_name in excel_data.sheet_names:
        data = pd.read_excel(file_path, sheet_name=sheet_name)

        for _, row in data.iterrows():
            student = {
                "lrn": str(int(row.get('LRN', 0))).zfill(12),
                "name": row.get('NAME'),
                "grade": sheet_name.split()[1] if len(sheet_name.split()) > 1 else None,
                "section": row.get('Section'),
                "birthdate": row.get('BIRTH DATE (mm/dd/yyyy)'),
                "age": row.get('Age as of October 31'),
                "gender": row.get('SEX'),
                "mother_tongue": row.get('MOTHER TONGUE'),
                "ethnic_group": row.get('IP'),
                "religion": row.get('RELIGION'),
                "address": {
                    "house_no": row.get('House No'),
                    "barangay": row.get('Barangay'),
                    "city": row.get('Municipality/City'),
                    "province": row.get('Province')
                },
                "mother": {
                    "name": row.get("Mother's Maiden Name(Last Name, First Name, Middle Name)"),
                    "contact": row.get('Mother Contact')
                },
                "father": {
                    "name": row.get("Father's Name(Last Name, First Name, Middle Name)"),
                    "contact": row.get('Father Contact')
                },
                "guardian": {
                    "name": row.get('Guardian Name'),
                    "contact": row.get('Contact Number of Parent or Guardian')
                }
            }
            mongo.db.students.insert_one(student)

def create_app():
    app = Flask(__name__)
    app.config['MONGO_URI'] = 'mongodb://localhost:27017/guidance_system'  # MongoDB connection URI
    app.config['SECRET_KEY'] = 'your-secret-key'

    # Initialize MongoDB
    mongo.init_app(app)

    # Register blueprints
    from app.routes import main
    app.register_blueprint(main)

    @app.route('/login', methods=['POST'])
    def login():
        email = request.form['email']
        password = request.form['password']

        user = User.find_user_by_email(email)
        if user and User.check_password(user, password):
            session['user_id'] = str(user['_id'])
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"message": "Invalid credentials"}), 401

    return app