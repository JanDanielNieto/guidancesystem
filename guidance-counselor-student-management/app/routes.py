from flask import Blueprint, render_template, request, redirect, url_for, flash
from .models import db, StudentRecord, User
from datetime import datetime

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return redirect(url_for('main.registration'))

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


@main.route('/registration', methods=['GET', 'POST'])
def registration():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm_password']

        if password != confirm_password:
            flash('Passwords do not match!')
            return redirect(url_for('main.registration'))

        user = User(name=name, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        flash('Account created successfully!')
        return redirect(url_for('main.dashboard'))

    return render_template('registration.html')

@main.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()

        if user is None or not user.check_password(password):
            flash('Invalid email or password')
            return redirect(url_for('main.login'))

        flash('Logged in successfully!')
        return redirect(url_for('main.dashboard'))

    return render_template('login.html')