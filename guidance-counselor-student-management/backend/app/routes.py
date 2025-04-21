from flask import Blueprint, jsonify, request, send_from_directory
from app.models import StudentRecord
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
    if not file.filename.endswith('.csv'):
        return jsonify({'error': 'Invalid file format. Please upload a CSV file.'}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    try:
        df = pd.read_csv(file_path, encoding='ISO-8859-1')
        df.columns = [col.strip().lower() for col in df.columns]
        df = df.where(pd.notnull(df), None)
        column_mapping = {key.lower(): value for key, value in COLUMN_MAPPING.items()}
        df.rename(columns=column_mapping, inplace=True)

        required_columns = ['lrn', 'name', 'section']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            return jsonify({'error': f'Missing required columns: {", ".join(missing_columns)}'}), 400

        skipped_rows = []
        chunk_size = 500

        for i in range(0, len(df), chunk_size):
            chunk = df.iloc[i:i + chunk_size]
            for index, row in chunk.iterrows():
                if not row.get('lrn') or not row.get('name') or not row.get('section'):
                    skipped_rows.append(index)
                    continue

                birthdate = row.get('birthdate')
                if birthdate:
                    try:
                        birthdate = datetime.strptime(birthdate, '%m/%d/%Y').strftime('%Y-%m-%d')
                    except ValueError:
                        try:
                            birthdate = datetime.strptime(birthdate, '%m-%d-%Y').strftime('%Y-%m-%d')
                        except ValueError:
                            skipped_rows.append(index)
                            continue

                student_data = {
                    'lrn': row['lrn'],
                    'name': row['name'],
                    'grade': row.get('grade', 'Unknown'),
                    'section': row['section'],
                    'sex': row.get('sex'),
                    'birthdate': birthdate,
                    'mother_tongue': row.get('mother_tongue'),
                    'religion': row.get('religion'),
                    'barangay': row.get('barangay'),
                    'municipality_city': row.get('municipality_city'),
                    'father_name': row.get('father_name'),
                    'mother_name': row.get('mother_name'),
                    'guardian_name': row.get('guardian_name'),
                    'contact_number': row.get('contact_number'),
                }

                student_data = {key: (None if pd.isna(value) else value) for key, value in student_data.items()}
                existing_student = StudentRecord.query.filter_by(lrn=student_data['lrn']).first()
                if existing_student:
                    continue

                student = StudentRecord(**student_data)
                db.session.add(student)

            db.session.commit()

        return jsonify({
            'message': 'File uploaded and data inserted successfully!',
            'skipped_rows': skipped_rows,
            'total_inserted': len(df) - len(skipped_rows)
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@main.route('/api/students', methods=['GET'])
def get_students():
    students = StudentRecord.query.all()
    return jsonify([student.to_dict() for student in students])

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
    student = StudentRecord.query.get(id)

    if not student:
        return jsonify({'error': 'Student not found'}), 404

    db.session.delete(student)
    db.session.commit()
    return jsonify({'message': 'Student deleted successfully!'}), 200

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