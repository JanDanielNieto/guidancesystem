from flask import Blueprint, render_template, request, redirect, url_for, flash
from .models import db, StudentRecord, OffenseRecord, User
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
    search = request.args.get('search')
    if search:
        records = OffenseRecord.query.join(StudentRecord).filter(
            (StudentRecord.name.ilike(f'%{search}%')) | 
            (OffenseRecord.offense_type.ilike(f'%{search}%')) |
            (StudentRecord.lrn.ilike(f'%{search}%'))
        ).all()
    else:
        records = OffenseRecord.query.all()
    return render_template('manage_records.html', records=records)

@main.route('/view_records')
def view_records():
    search = request.args.get('search')
    if search:
        records = StudentRecord.query.filter(
            (StudentRecord.name.ilike(f'%{search}%')) |
            (StudentRecord.lrn.ilike(f'%{search}%'))
        ).all()
    else:
        records = StudentRecord.query.all()
    return render_template('view_records.html', records=records)

@main.route('/view_profile/<int:student_id>')
def view_profile(student_id):
    student = StudentRecord.query.get_or_404(student_id)
    offenses = OffenseRecord.query.filter_by(student_id=student_id).all()
    return render_template('profile.html', student=student, offenses=offenses)

@main.route('/add_student', methods=['GET', 'POST'])
def add_student():
    if request.method == 'POST':
        lrn = request.form['lrn']
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

        new_record = StudentRecord(
            lrn=lrn,
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
            contact_number=contact_number
        )
        db.session.add(new_record)
        db.session.commit()

        return redirect(url_for('main.view_records'))

    return render_template('add_new_student.html')

@main.route('/add_offense/<int:student_id>', methods=['GET', 'POST'])
def add_offense(student_id):
    student = StudentRecord.query.get_or_404(student_id)
    if request.method == 'POST':
        offense_type = request.form['offense_type']
        reason = request.form['reason']
        additional_info = request.form['additional_info']

        new_offense = OffenseRecord(
            student_id=student_id,
            offense_type=offense_type,
            reason=reason,
            additional_info=additional_info
        )
        db.session.add(new_offense)
        db.session.commit()

        return redirect(url_for('main.view_profile', student_id=student_id))

    return render_template('add_student_offense.html', student=student)

@main.route('/edit_offense/<int:offense_id>', methods=['GET', 'POST'])
def edit_offense(offense_id):
    offense = OffenseRecord.query.get_or_404(offense_id)
    if request.method == 'POST':
        offense.offense_type = request.form['offense_type']
        offense.reason = request.form['reason']
        offense.additional_info = request.form['additional_info']
        db.session.commit()
        return redirect(url_for('main.manage_records'))

    return render_template('edit_offense.html', offense=offense)

@main.route('/delete_offense/<int:offense_id>', methods=['POST'])
def delete_offense(offense_id):
    offense = OffenseRecord.query.get_or_404(offense_id)
    db.session.delete(offense)
    db.session.commit()
    return redirect(url_for('main.manage_records'))

@main.route('/add_report', methods=['GET', 'POST'])
def add_report():
    query = request.args.get('query')
    students = []
    purposes = [
        "Academic Offenses", "Behavioral Offenses", "Physical and Verbal Misconduct",
        "Substance-Related Offenses", "Cyber Offenses", "Attendance-Related Offenses",
        "Theft and Property Offenses", "Weapons and Safety Violations", "Sexual Misconduct",
        "Gang and Group-Related Offenses"
    ]
    if query:
        students = StudentRecord.query.filter(
            (StudentRecord.name.ilike(f'%{query}%')) |
            (StudentRecord.lrn.ilike(f'%{query}%'))
        ).all()
    if request.method == 'POST':
        student_id = request.form['student_id']
        offense_type = request.form['offense_type']
        description = request.form['description']

        new_offense = OffenseRecord(
            student_id=student_id,
            offense_type=offense_type,
            reason=description
        )
        db.session.add(new_offense)
        db.session.commit()

        return redirect(url_for('main.manage_records'))

    return render_template('add_report.html', students=students, purposes=purposes)

@main.route('/logout')
def logout():
    # Placeholder for logout functionality
    return redirect(url_for('main.index'))

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