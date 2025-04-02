from flask import Blueprint, jsonify, request
from app.models import StudentRecord, OffenseRecord
from app import db

main = Blueprint('main', __name__)

@main.route('/api/students', methods=['GET'])
def get_students():
    students = StudentRecord.query.all()
    student_list = [
        {
            'id': student.id,
            'name': student.name,
            'grade': student.grade,
            'section': student.section,
            'gender': student.gender,
            'birthdate': student.birthdate,
            'address': {
                'house_no': student.address_house_no,
                'barangay': student.address_barangay,
                'city': student.address_city,
                'province': student.address_province
            },
            'father_name': student.father_name,
            'mother_name': student.mother_name,
            'guardian_name': student.guardian_name
        }
        for student in students
    ]
    return jsonify(student_list)

@main.route('/api/students', methods=['POST'])
def add_student():
    data = request.json
    new_student = StudentRecord(
        lrn=data['lrn'],
        name=data['name'],
        grade=data['grade'],
        section=data['section'],
        gender=data['gender'],
        birthdate=data['birthdate'],
        address_house_no=data['address']['house_no'],
        address_barangay=data['address']['barangay'],
        address_city=data['address']['city'],
        address_province=data['address']['province'],
        father_name=data['father_name'],
        mother_name=data['mother_name'],
        guardian_name=data['guardian_name']
    )
    db.session.add(new_student)
    db.session.commit()
    return jsonify({'message': 'Student added successfully!'}), 201