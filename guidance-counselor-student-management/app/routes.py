from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app, jsonify, session
from bson.objectid import ObjectId
from datetime import datetime, date
from werkzeug.utils import secure_filename
import os
import pandas as pd
from werkzeug.security import generate_password_hash, check_password_hash

ALLOWED_EXTENSIONS = {'xlsx'}

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return redirect(url_for('main.register'))

@main.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@main.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        user_collection = current_app.db['users']
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm_password']

        if password != confirm_password:
            flash('Passwords do not match!', 'danger')
            return redirect(url_for('main.register'))

        # Check if email already exists
        if user_collection.find_one({'email': email}):
            flash('Email already registered!', 'danger')
            return redirect(url_for('main.register'))

        # Hash the password and save the user
        hashed_password = generate_password_hash(password)
        user = {
            'name': name,
            'email': email,
            'password': hashed_password
        }
        user_collection.insert_one(user)
        flash('Account created successfully!', 'success')
        return redirect(url_for('main.login'))
    return render_template('register.html')


@main.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user_collection = current_app.db['users']
        email = request.form['email']
        password = request.form['password']

        # Find the user by email
        user = user_collection.find_one({'email': email})
        if user and check_password_hash(user['password'], password):
            session['user_id'] = str(user['_id'])
            session['user_name'] = user['name']
            flash('Logged in successfully!', 'success')
            return redirect(url_for('main.dashboard'))
        else:
            flash('Invalid email or password', 'danger')
            return redirect(url_for('main.login'))
    return render_template('login.html')


@main.route('/logout')
def logout():
    session.clear()
    flash('Logged out successfully!', 'success')
    return redirect(url_for('main.login'))


@main.route('/manage_records', methods=['GET'])
def manage_records():
    search_query = request.args.get('search', '')
    offense_collection = current_app.db['offenses']
    student_collection = current_app.db['students']

    # Search offenses and join with student data
    if search_query:
        offenses = list(offense_collection.find({
            "$or": [
                {"offense_type": {"$regex": search_query, "$options": "i"}},
                {"reason": {"$regex": search_query, "$options": "i"}}
            ]
        }))
    else:
        offenses = list(offense_collection.find())

    # Add student name to each offense
    for offense in offenses:
        student = student_collection.find_one({"_id": ObjectId(offense['student_id'])})
        offense['student_name'] = student['name'] if student else 'Unknown'
        offense['_id'] = str(offense['_id'])  # Convert ObjectId to string

    return render_template('manage_records.html', records=offenses)


@main.route('/add_student_offense/<string:student_id>', methods=['GET', 'POST'])
def add_student_offense(student_id):
    student_collection = current_app.db['students']
    offense_collection = current_app.db['offenses']
    student = student_collection.find_one({"_id": ObjectId(student_id)})

    if not student:
        flash('Student not found!', 'danger')
        return redirect(url_for('main.manage_records'))

    if request.method == 'POST':
        offense = {
            "student_id": student_id,
            "offense_type": request.form['offense_type'],
            "reason": request.form['reason'],
            "additional_info": request.form['additional_info'],
            "date_time": datetime.utcnow()
        }
        offense_collection.insert_one(offense)
        flash('Offense record added successfully!', 'success')
        return redirect(url_for('main.manage_records'))

    student['_id'] = str(student['_id'])  # Convert ObjectId to string
    return render_template('add_student_offense.html', student=student)


@main.route('/delete_offense/<string:offense_id>', methods=['POST'])
def delete_offense(offense_id):
    offense_collection = current_app.db['offenses']
    offense_collection.delete_one({"_id": ObjectId(offense_id)})
    flash('Offense record deleted successfully!', 'success')
    return redirect(url_for('main.manage_records'))

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@main.route('/manage_students', methods=['GET', 'POST'])
def manage_students():
    search_query = request.args.get('search', '')
    student_collection = current_app.db['students']
    if search_query:
        students = list(student_collection.find({
            "$or": [
                {"name": {"$regex": search_query, "$options": "i"}},
                {"lrn": {"$regex": search_query, "$options": "i"}}
            ]
        }))
    else:
        students = list(student_collection.find())
    for student in students:
        student['_id'] = str(student['_id'])  # Convert ObjectId to string
    return render_template('manage_students.html', students=students)

@main.route('/edit_student/<string:id>', methods=['GET', 'POST'])
def edit_student(id):
    student_collection = current_app.db['students']
    student = student_collection.find_one({"_id": ObjectId(id)})
    if request.method == 'POST':
        updated_data = {
            "lrn": request.form['lrn'],
            "name": request.form['name'],
            "grade_section": request.form['grade_section'],
            "birthdate": request.form['birthdate'],
            "age": int(request.form['age']),
            "gender": request.form['gender'],
            "mother_tongue": request.form['mother_tongue'],
            "ethnic_group": request.form['ethnic_group'],
            "religion": request.form['religion'],
            "address_house_no": request.form['address_house_no'],
            "address_barangay": request.form['address_barangay'],
            "address_city": request.form['address_city'],
            "address_province": request.form['address_province'],
            "mother_name": request.form['mother_name'],
            "mother_contact": request.form['mother_contact'],
            "father_name": request.form['father_name'],
            "father_contact": request.form['father_contact'],
            "guardian_name": request.form['guardian_name'],
            "guardian_contact": request.form['guardian_contact']
        }
        student_collection.update_one({"_id": ObjectId(id)}, {"$set": updated_data})
        flash('Student record updated successfully', 'success')
        return redirect(url_for('main.manage_students'))
    student['_id'] = str(student['_id'])  # Convert ObjectId to string
    return render_template('edit_student.html', student=student)

@main.route('/delete_student/<string:id>', methods=['POST'])
def delete_student(id):
    student_collection = current_app.db['students']
    student_collection.delete_one({"_id": ObjectId(id)})
    flash('Student deleted successfully', 'success')
    return redirect(url_for('main.manage_students'))

@main.route('/add_student', methods=['GET', 'POST'])
def add_student():
    if request.method == 'POST':
        student_collection = current_app.db['students']
        new_student = {
            "lrn": request.form['lrn'],
            "name": request.form['name'],
            "grade_section": request.form['grade_section'],
            "birthdate": request.form['birthdate'],
            "age": int(request.form['age']),
            "gender": request.form['gender'],
            "mother_tongue": request.form['mother_tongue'],
            "ethnic_group": request.form['ethnic_group'],
            "religion": request.form['religion'],
            "address_house_no": request.form['address_house_no'],
            "address_barangay": request.form['address_barangay'],
            "address_city": request.form['address_city'],
            "address_province": request.form['address_province'],
            "mother_name": request.form['mother_name'],
            "mother_contact": request.form['mother_contact'],
            "father_name": request.form['father_name'],
            "father_contact": request.form['father_contact'],
            "guardian_name": request.form['guardian_name'],
            "guardian_contact": request.form['guardian_contact']
        }
        student_collection.insert_one(new_student)
        flash('New student added successfully', 'success')
        return redirect(url_for('main.manage_students'))
    return render_template('add_new_student.html')

@main.route('/upload_excel', methods=['GET', 'POST'])
def upload_excel():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part in the request', 'danger')
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            flash('No selected file', 'danger')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            upload_directory = current_app.config['UPLOAD_FOLDER']
            os.makedirs(upload_directory, exist_ok=True)
            file_path = os.path.join(upload_directory, filename)
            file.save(file_path)
            print(f"File saved to: {file_path}")  # Debug print

            try:
                populate_database_from_excel(file_path)
                flash(f'Database populated successfully from {filename}!', 'success')
            except Exception as e:
                print(f"Error during file processing: {e}")  # Debug print
                flash(f'Error populating database: {str(e)}', 'danger')
            return redirect(url_for('main.manage_students'))
    return render_template('upload.html')

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def populate_database_from_excel(file_path):
    try:
        student_collection = current_app.db['students']
        excel_data = pd.ExcelFile(file_path)
        print(f"Excel file loaded: {file_path}")  # Debug print

        for sheet_name in excel_data.sheet_names:
            print(f"Processing sheet: {sheet_name}")  # Debug print
            data = pd.read_excel(file_path, sheet_name=sheet_name)

            for index, row in data.iterrows():
                print(f"Processing row {index}: {row}")  # Debug print
                student = {
                    "lrn": str(int(row.get('LRN', 0))).zfill(12) if pd.notna(row.get('LRN')) else None,
                    "name": row.get('NAME', None),
                    "grade_section": row.get('Section', None),
                    "birthdate": row.get('BIRTH DATE (mm/dd/yyyy)', None),
                    "age": row.get('Age as of October 31', None),
                    "gender": row.get('SEX', None),
                    "mother_tongue": row.get('MOTHER TONGUE', None),
                    "ethnic_group": row.get('IP', None),
                    "religion": row.get('RELIGION', None),
                    "address_house_no": row.get('House No', None),
                    "address_barangay": row.get('Barangay', None),
                    "address_city": row.get('Municipality/City', None),
                    "address_province": row.get('Province', None),
                    "mother_name": row.get("Mother's Maiden Name(Last Name, First Name, Middle Name)", None),
                    "mother_contact": row.get('Mother Contact', None),
                    "father_name": row.get("Father's Name(Last Name, First Name, Middle Name)", None),
                    "father_contact": row.get('Father Contact', None),
                    "guardian_name": row.get('Guardian Name', None),
                    "guardian_contact": row.get('Contact Number of Parent or Guardian', None)
                }
                student_collection.insert_one(student)
        print("Database populated successfully!")  # Debug print
    except Exception as e:
        print(f"Error in populate_database_from_excel: {e}")  # Debug print
        raise