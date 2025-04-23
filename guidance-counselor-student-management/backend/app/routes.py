from flask import Blueprint, jsonify, request, send_from_directory
from app.models import StudentRecord, OffenseRecord
from dateutil.parser import parse
from datetime import datetime
from app import db
import pandas as pd
import os

main = Blueprint('main', __name__)

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
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file_path, encoding='utf-8')
        else:
            df = pd.read_excel(file_path)

        # Normalize column names
        df.columns = [col.strip().lower() for col in df.columns]
        df = df.where(pd.notnull(df), None)

        column_mapping = {key.lower(): value for key, value in COLUMN_MAPPING.items()}
        df.rename(columns=column_mapping, inplace=True)

        required_columns = ['lrn', 'name', 'section', 'grade']
        for col in required_columns:
            if col not in df.columns:
                return jsonify({'error': f'Missing required column: {col}'}), 400

        total_rows = len(df)
        inserted_count = 0
        updated_count = 0
        skipped_rows = []  # To track skipped rows

        for index, row in df.iterrows():
            try:
                raw_lrn = str(row.get('lrn')).strip() if row.get('lrn') else None
                lrn = raw_lrn.split('.')[0] if raw_lrn and '.' in raw_lrn else raw_lrn
                name = row.get('name')
                section = row.get('section')
                grade = row.get('grade')

                # Skip incomplete rows and log the reason
                if not lrn:
                    skipped_rows.append({'index': index + 1, 'reason': 'Missing LRN', 'row': row.to_dict()})
                    continue
                if not name:
                    skipped_rows.append({'index': index + 1, 'reason': 'Missing Name', 'row': row.to_dict()})
                    continue
                if not section:
                    skipped_rows.append({'index': index + 1, 'reason': 'Missing Section', 'row': row.to_dict()})
                    continue
                if not grade:
                    skipped_rows.append({'index': index + 1, 'reason': 'Missing Grade', 'row': row.to_dict()})
                    continue

                # Parse birthdate safely
                birthdate = None
                raw_birthdate = row.get('birthdate')
                if raw_birthdate:
                    try:
                        birthdate = parse(str(raw_birthdate)).date()
                    except Exception:
                        birthdate = None

                student_data = {
                    'lrn': lrn,
                    'name': name.strip() if name else None,
                    'grade': grade.strip() if grade else None,
                    'section': section.strip() if section else None,
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
            'offenses': [offense.to_dict() for offense in offenses]
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
        # Log the error and return a meaningful message
        return jsonify({'error': f'An error occurred while deleting the student: {str(e)}'}), 500

@main.route('/api/delete_all_students', methods=['DELETE'])
def delete_all_students():
    try:
        db.session.query(StudentRecord).delete()
        db.session.commit()
        return jsonify({'message': 'All student records deleted successfully!'}), 200
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
def add_offense(student_id):
        data = request.json
        student = StudentRecord.query.get(student_id)
    
        if not student:
            return jsonify({'error': 'Student not found'}), 404
    
        try:
            new_offense = OffenseRecord(
                student_id=student_id,
                offense_type=data['offense_type'],
                reason=data['reason'],
                additional_info=data.get('additional_info', ''),
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
        # Validate required fields
        if not data.get('type'):
            return jsonify({'error': 'Offense type is required'}), 400
        if not data.get('reason'):
            return jsonify({'error': 'Reason is required'}), 400
        if not data.get('date'):
            return jsonify({'error': 'Date is required'}), 400

        # Update offense fields
        offense.offense_type = data.get('type', offense.offense_type)
        offense.reason = data.get('reason', offense.reason)
        offense.date_time = parse(data.get('date')) if data.get('date') else offense.date_time

        db.session.commit()
        return jsonify({'message': 'Offense updated successfully!'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500  