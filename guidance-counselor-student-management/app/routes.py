from flask import Blueprint, render_template, request, redirect, url_for
from .models import db, StudentRecord
from datetime import datetime

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return redirect(url_for('main.dashboard'))

@main.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@main.route('/manage_records')
def manage_records():
    records = StudentRecord.query.all()
    return render_template('manage_records.html', records=records)

@main.route('/view_records')
def view_records():
    records = StudentRecord.query.all()
    return render_template('view_records.html', records=records)

@main.route('/view_profile/<int:student_id>')
def view_profile(student_id):
    student = StudentRecord.query.get_or_404(student_id)
    return render_template('profile.html', student=student)

@main.route('/add_student', methods=['GET', 'POST'])
def add_student():
    if request.method == 'POST':
        name = request.form['name']
        grade_section = request.form['grade_section']
        birthdate = datetime.strptime(request.form['birthdate'], '%Y-%m-%d')
        age = request.form['age']
        mother_tongue = request.form['mother_tongue']
        ethnic_group = request.form['ethnic_group']
        religion = request.form['religion']
        address_house_no = request.form['address_house_no']
        address_barangay = request.form['address_barangay']
        address_city = request.form['address_city']
        address_province = request.form['address_province']
        mother_name = request.form['mother_name']
        father_name = request.form['father_name']
        guardian_name = request.form['guardian_name']
        contact_number = request.form['contact_number']
        learning_modality = request.form['learning_modality']

        new_record = StudentRecord(
            name=name,
            grade_section=grade_section,
            birthdate=birthdate,
            age=age,
            mother_tongue=mother_tongue,
            ethnic_group=ethnic_group,
            religion=religion,
            address_house_no=address_house_no,
            address_barangay=address_barangay,
            address_city=address_city,
            address_province=address_province,
            mother_name=mother_name,
            father_name=father_name,
            guardian_name=guardian_name,
            contact_number=contact_number,
            learning_modality=learning_modality
        )
        db.session.add(new_record)
        db.session.commit()

        return redirect(url_for('main.manage_records'))

    return render_template('add_new_student.html')

@main.route('/add_report', methods=['GET', 'POST'])
def add_report():
    if request.method == 'POST':
        # Handle the form submission for adding a report
        pass

    return render_template('add_report.html')

@main.route('/logout')
def logout():
    # Placeholder for logout functionality
    return "Logout Page"