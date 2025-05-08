from flask import Blueprint, jsonify, request, send_from_directory
from app.models import StudentRecord, OffenseRecord, User
from flask_login import login_user, logout_user, login_required, current_user, LoginManager
from werkzeug.security import check_password_hash  # Ensure this is imported
from dateutil.parser import parse
from flask_cors import CORS
from datetime import datetime
from app import db
import pandas as pd
import os

main = Blueprint('main', __name__)

CORS(main, resources={r"/*": {"origins": "https://guidancesystem.vercel.app"}})


UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@main.route('/')
def home():
    return jsonify({'message': 'Welcome to the Guidance System API!'})

@main.route('/favicon.ico')
def favicon():
    return send_from_directory(
        os.path.join(main.root_path, 'static'),
        'favicon.ico',
        mimetype='image/vnd.microsoft.icon'
    )

COLUMN_MAPPING = {
    'LRN': 'lrn',
    'Name': 'name',
    'Grade': 'grade',
    'Section': 'section',
    'SEX': 'sex',
    'BIRTH DATE (mm/dd/yyyy)': 'birthdate',
    'Mother Tongue': 'mother_tongue',
    'RELIGION': 'religion',
    'Barangay': 'barangay',
    'Municipality/City': 'municipality_city',
    "Father's Name(Last Name, First Name, Middle Name)": 'father_name',
    "Mother's Maiden Name(Last Name, First Name, Middle Name)": 'mother_name',
    'Guardian Name': 'guardian_name',
    'Contact Number of Parent or Guardian': 'contact_number',
}

@main.route('/api/upload', methods=['POST'])
def upload_csv():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if not (file.filename.endswith('.csv') or file.filename.endswith('.xlsx')):
        return jsonify({'error': 'Invalid file format. Please upload a CSV or Excel file.'}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    try:
        # Read the file into a DataFrame
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file_path, encoding='utf-8')
        else:
            df = pd.read_excel(file_path)

        # Normalize column names
        df.columns = [col.strip().lower() for col in df.columns]
        df = df.where(pd.notnull(df), None)  # Replace NaN with None

        # Map column names to database fields
        column_mapping = {key.lower(): value for key, value in COLUMN_MAPPING.items()}
        df.rename(columns=column_mapping, inplace=True)

        total_rows = len(df)
        inserted_count = 0
        updated_count = 0
        skipped_rows = []  # To track skipped rows

        for index, row in df.iterrows():
            try:
                # Extract and clean data
                lrn = str(row.get('lrn')).strip() if row.get('lrn') else None
                if lrn and len(lrn) > 20:  # Truncate LRN if it exceeds the maximum length
                    lrn = lrn[:20]

                name = row.get('name', '').strip()
                grade = row.get('grade', '').strip()
                section = row.get('section', '').strip()

                # Parse birthdate safely
                birthdate = None
                raw_birthdate = row.get('birthdate')
                if raw_birthdate:
                    try:
                        birthdate = parse(str(raw_birthdate)).date()
                    except Exception:
                        birthdate = None

                # Prepare student data
                student_data = {
                    'lrn': lrn,
                    'name': name,
                    'grade': grade,
                    'section': section,
                    'sex': row.get('sex'),
                    'birthdate': birthdate,
                    'mother_tongue': row.get('mother_tongue'),
                    'religion': row.get('religion'),
                    'barangay': row.get('barangay'),
                    'municipality_city': row.get('municipality_city'),
                    'father_name': row.get('father_name'),
                    'mother_name': row.get('mother_name'),
                    'guardian_name': row.get('guardian_name'),
                    'contact_number': row.get('contact_number')
                }

                # Clean possible NaN/None
                student_data = {k: (None if pd.isna(v) else v) for k, v in student_data.items()}

                # Check if the student already exists
                existing = StudentRecord.query.filter_by(lrn=lrn).first()
                if existing:
                    for key, value in student_data.items():
                        setattr(existing, key, value)
                    updated_count += 1
                else:
                    db.session.add(StudentRecord(**student_data))
                    inserted_count += 1

            except Exception as e:
                # Log the error for the problematic row
                skipped_rows.append({'index': index + 1, 'reason': str(e), 'row': row.to_dict()})
                continue

        # Commit all changes to the database
        db.session.commit()

        return jsonify({
            'message': 'File uploaded and all rows processed!',
            'total_rows': total_rows,
            'inserted': inserted_count,
            'updated': updated_count,
            'skipped_rows': skipped_rows  # Include skipped rows in the response
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
@main.route('/api/students', methods=['GET'])
def get_students():
    students = StudentRecord.query.all()
    result = []
    for student in students:
        offenses = OffenseRecord.query.filter_by(student_id=student.id).all()
        result.append({
            **student.to_dict(),
            'offenses': [offense.to_dict() for offense in offenses]  # Include offenses
        })
    return jsonify(result)

@main.route('/api/students/<int:id>', methods=['PUT'])
def edit_student(id):
    data = request.json
    student = StudentRecord.query.get(id)

    if not student:
        return jsonify({'error': 'Student not found'}), 404

    student.name = data.get('name', student.name)
    student.grade = data.get('grade', student.grade)
    student.section = data.get('section', student.section)
    student.sex = data.get('sex', student.sex)
    student.birthdate = data.get('birthdate', student.birthdate)
    student.mother_tongue = data.get('mother_tongue', student.mother_tongue)
    student.religion = data.get('religion', student.religion)
    student.barangay = data.get('barangay', student.barangay)
    student.municipality_city = data.get('municipality_city', student.municipality_city)
    student.father_name = data.get('father_name', student.father_name)
    student.mother_name = data.get('mother_name', student.mother_name)
    student.guardian_name = data.get('guardian_name', student.guardian_name)
    student.contact_number = data.get('contact_number', student.contact_number)

    db.session.commit()
    return jsonify({'message': 'Student updated successfully!'}), 200

@main.route('/api/students/<int:id>', methods=['DELETE'])
def delete_student(id):
    try:
        # Fetch the student record by ID
        student = StudentRecord.query.get(id)

        # Check if the student exists
        if not student:
            return jsonify({'error': 'Student not found'}), 404

        # Delete all offenses associated with the student
        OffenseRecord.query.filter_by(student_id=student.id).delete()

        # Delete the student record
        db.session.delete(student)
        db.session.commit()

        return jsonify({'message': 'Student and associated offenses deleted successfully!'}), 200

    except Exception as e:
        # Rollback the transaction in case of an error
        db.session.rollback()
        return jsonify({'error': f'An error occurred while deleting the student: {str(e)}'}), 500

@main.route('/api/delete_all_students', methods=['DELETE'])
def delete_all_students():
    try:
        # Delete all offenses first
        db.session.query(OffenseRecord).delete()

        # Delete all students
        db.session.query(StudentRecord).delete()

        db.session.commit()
        return jsonify({'message': 'All students and related offenses deleted successfully.'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# New API Endpoint: Get Students by Grade
@main.route('/api/students/grade/<string:grade>', methods=['GET'])
def get_students_by_grade(grade):
    students = StudentRecord.query.filter_by(grade=grade).all()
    return jsonify([student.to_dict() for student in students])

@main.route('/api/students', methods=['POST'])
def add_student():
    data = request.json

    # Validate required fields
    required_fields = ['lrn', 'name', 'grade', 'section']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    # Check if LRN is unique
    if StudentRecord.query.filter_by(lrn=data['lrn']).first():
        return jsonify({'error': 'LRN must be unique'}), 400

    try:
        # Parse birthdate safely
        birthdate = None
        if data.get('birthdate'):
            birthdate = datetime.strptime(data['birthdate'], '%Y-%m-%d').date()

        # Create a new student record
        new_student = StudentRecord(
            lrn=data['lrn'],
            name=data['name'],
            grade=data['grade'],
            section=data['section'],
            sex=data.get('sex'),
            birthdate=birthdate,
            mother_tongue=data.get('mother_tongue'),
            religion=data.get('religion'),
            barangay=data.get('barangay'),
            municipality_city=data.get('municipality_city'),
            father_name=data.get('father_name'),
            mother_name=data.get('mother_name'),
            guardian_name=data.get('guardian_name'),
            contact_number=data.get('contact_number')
            
        )
            

        db.session.add(new_student)
        db.session.commit()

        return jsonify({'message': 'Student added successfully!'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
@main.route('/api/students/search', methods=['GET'])
def search_students():
    query = request.args.get('query', '').lower()
    students = StudentRecord.query.filter(
        (StudentRecord.name.ilike(f"%{query}%")) | (StudentRecord.lrn.ilike(f"%{query}%"))
    ).all()
    return jsonify([student.to_dict() for student in students])
    

@main.route('/api/students/<int:student_id>/offenses', methods=['POST'])
def add_student_offense(student_id):
    data = request.json
    student = StudentRecord.query.get(student_id)

    if not student:
        return jsonify({'error': 'Student not found'}), 404

    try:
        # Ensure offense_type is being saved correctly
        new_offense = OffenseRecord(
            student_id=student_id,
            offense_type=data['offense_type'],  # This must match the frontend field
            reason=data.get('reason', ''),
            date_time=datetime.now()  # Add a timestamp
        )
        db.session.add(new_offense)
        db.session.commit()
        return jsonify({'message': 'Offense added successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
        
@main.route('/api/offenses', methods=['GET'])
def get_offenses():
    offenses = OffenseRecord.query.all()
    return jsonify([offense.to_dict() for offense in offenses])

@main.route('/api/students/<string:lrn>', methods=['GET'])
def get_student_by_lrn(lrn):
    student = StudentRecord.query.filter_by(lrn=lrn).first()
    if not student:
        return jsonify({'error': 'Student not found'}), 404

    offenses = OffenseRecord.query.filter_by(student_id=student.id).all()
    student_data = student.to_dict()
    student_data['offenses'] = [offense.to_dict() for offense in offenses]

    return jsonify(student_data)

@main.route('/api/offenses/<int:id>', methods=['DELETE'])
def delete_offense(id):
    offense = OffenseRecord.query.get(id)

    if not offense:
        return jsonify({'error': 'Offense not found'}), 404

    try:
        db.session.delete(offense)
        db.session.commit()
        return jsonify({'message': 'Offense deleted successfully!'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

@main.route('/api/offenses/<int:id>', methods=['PUT'])
def edit_offense(id):
    data = request.json
    offense = OffenseRecord.query.get(id)

    if not offense:
        return jsonify({'error': 'Offense not found'}), 404

    try:
        # Update offense fields
        offense.offense_type = data.get('type', offense.offense_type)  # Ensure this matches the frontend field
        offense.reason = data.get('reason', offense.reason)
        offense.date_time = parse(data.get('date')) if data.get('date') else offense.date_time

        db.session.commit()
        return jsonify({'message': 'Offense updated successfully!'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500
    
@main.route('/api/offenses', methods=['POST'])
def add_offense():
    data = request.json
    student_id = data.get('studentId')
    offense_type = data.get('type')
    reason = data.get('reason', '')  # Optional field

    if not student_id or not offense_type:
        return jsonify({'error': 'Student ID and offense type are required'}), 400

    student = StudentRecord.query.get(student_id)
    if not student:
        return jsonify({'error': 'Student not found'}), 404

    try:
        new_offense = OffenseRecord(
            student_id=student_id,
            offense_type=offense_type,
            reason=reason,
            date_time=datetime.now()
        )
        db.session.add(new_offense)
        db.session.commit()
        return jsonify({'message': 'Offense added successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
@main.route('/api/login', methods=['POST'])
def login():
    if request.method != 'POST':
        return jsonify({'error': 'Method not allowed. Use POST instead.'}), 405

    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        # Find the user by username
        user = User.query.filter_by(username=username).first()

        # Check if the user exists and the password matches
        if user and check_password_hash(user.password, password):
            login_user(user)
            return jsonify({'message': 'Login successful'}), 200

        return jsonify({'error': 'Invalid username or password'}), 401

    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

@main.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logout successful'}), 200

# Protected route example
@main.route('/api/protected', methods=['GET'])
@login_required
def protected():
    return jsonify({'message': f'Hello, {current_user.username}! This is a protected route.'})

# Other routes (e.g., for students, offenses, etc.) remain unchanged@main.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Find the user by username
    user = User.query.filter_by(username=username).first()

    # Check if the user exists and the password matches (plain text comparison)
    if user and user.password == password:  # Compare plain text passwords
        login_user(user)
        return jsonify({'message': 'Login successful'}), 200

    return jsonify({'error': 'Invalid username or password'}), 401

@main.route('/api/sort-and-manage/students/<int:id>', methods=['PUT'])
def edit_student_sort_and_manage(id):
    data = request.json
    print(f"Received data for student ID {id}: {data}")  # Debugging log

    student = StudentRecord.query.get(id)

    if not student:
        return jsonify({'error': 'Student not found'}), 404

    try:
        # Update only the Grade and Section fields
        student.grade = data.get('grade', student.grade)
        student.section = data.get('section', student.section)

        # Commit the changes to the database
        db.session.commit()
        return jsonify({'message': 'Student updated successfully for Sort and Manage!'}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error while updating student ID {id}: {str(e)}")  # Debugging log
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500
    
@main.route('/api/sort-and-manage/students/<int:id>', methods=['DELETE'])
def delete_student_sort_and_manage(id):
    try:
        # Fetch the student record by ID
        student = StudentRecord.query.get(id)

        # Check if the student exists
        if not student:
            return jsonify({'error': 'Student not found'}), 404

        # Delete all offenses associated with the student
        OffenseRecord.query.filter_by(student_id=student.id).delete()

        # Delete the student record
        db.session.delete(student)
        db.session.commit()

        return jsonify({'message': 'Student deleted successfully for Sort and Manage!'}), 200

    except Exception as e:
        # Rollback the transaction in case of an error
        db.session.rollback()
        return jsonify({'error': f'An error occurred while deleting the student: {str(e)}'}), 500