from flask import Blueprint, jsonify, request, send_from_directory
from app.models import StudentRecord
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
    'SEX': 'sex',  # Map 'SEX' to 'sex'
    'BIRTH DATE (mm/dd/yyyy)': 'birthdate',  # Map 'BIRTH DATE (mm/dd/yyyy)' to 'birthdate'
    'Mother Tongue': 'mother_tongue',
    'RELIGION': 'religion',
    'Barangay': 'barangay',
    'Municipality/City': 'municipality_city',
    "Father's Name(Last Name, First Name, Middle Name)": 'father_name',  # Map Father's Name
    "Mother's Maiden Name(Last Name, First Name, Middle Name)": 'mother_name',  # Map Mother's Maiden Name
    'Guardian Name': 'guardian_name',  # Map Guardian Name
    'Contact Number of Parent or Guardian': 'contact_number',  # Map Contact Number
}

@main.route('/api/upload', methods=['POST'])
def upload_excel():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if not file.filename.endswith('.xlsx'):
        return jsonify({'error': 'Invalid file format. Please upload an Excel file.'}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    try:
        # Read the Excel file and get the sheet name
        excel_file = pd.ExcelFile(file_path)
        sheet_name = excel_file.sheet_names[0]  # Assume the first sheet contains the data
        df = excel_file.parse(sheet_name)

        # Extract grade from the sheet name
        grade_from_sheet = sheet_name.strip()  # Use the sheet name as the grade

        # Normalize column names in the Excel file
        df.columns = [col.strip().lower() for col in df.columns]

        # Replace NaN values with None
        df = df.where(pd.notnull(df), None)

        # Check if required columns are present
        required_columns = ['lrn', 'name', 'section']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            return jsonify({'error': f'Missing required columns: {", ".join(missing_columns)}'}), 400

        # Iterate through the rows and insert data into the database
        for _, row in df.iterrows():
            student_data = {
                'lrn': row['lrn'],
                'name': row['name'],
                'grade': row.get('grade', grade_from_sheet),  # Use grade column if it exists, otherwise sheet name
                'section': row['section'],
                'sex': row.get('sex'),  # Populate if the column exists
                'birthdate': row.get('birthdate'),  # Populate if the column exists
                'mother_tongue': row.get('mother_tongue'),  # Populate if the column exists
                'religion': row.get('religion'),  # Populate if the column exists
                'barangay': row.get('barangay'),  # Populate if the column exists
                'municipality_city': row.get('municipality_city'),  # Populate if the column exists
                'father_name': row.get('father_name'),  # Populate if the column exists
                'mother_name': row.get('mother_name'),  # Populate if the column exists
                'guardian_name': row.get('guardian_name'),  # Populate if the column exists
                'contact_number': row.get('contact_number'),  # Populate if the column exists
            }

            # Ensure grade is not null
            if not student_data['grade']:
                return jsonify({'error': 'Grade cannot be null. Ensure the sheet name or column provides a grade.'}), 400

            # Create a new StudentRecord instance
            student = StudentRecord(**student_data)
            db.session.add(student)

        db.session.commit()
        return jsonify({'message': 'File uploaded and data inserted successfully!'}), 200

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

    # Update student fields
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