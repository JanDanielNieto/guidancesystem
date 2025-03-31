from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app
from app.models import db, StudentRecord, OffenseRecord, User
from datetime import datetime, date
from werkzeug.utils import secure_filename
from sqlalchemy import func
import os
from flask import current_app as app
from .models import populate_database_from_excel, OffenseRecord, db
from app.extensions import db
import pandas as pd

ALLOWED_EXTENSIONS = {'xlsx'}

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return redirect(url_for('main.registration'))

@main.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@main.route('/manage_students', methods=['GET', 'POST'])
def manage_students():
    search_query = request.args.get('search', '')
    if search_query:
        students = StudentRecord.query.filter(
            (StudentRecord.name.ilike(f'%{search_query}%')) |
            (StudentRecord.lrn.ilike(f'%{search_query}%'))
        ).all()
    else:
        students = StudentRecord.query.all()
    return render_template('manage_students.html', students=students)


@main.route('/edit_student/<int:id>', methods=['GET', 'POST'])
def edit_student(id):
    student = StudentRecord.query.get_or_404(id)
    if request.method == 'POST':
        student.lrn = request.form['lrn']
        student.name = request.form['name']
        student.grade_section = request.form['grade_section']
        student.birthdate = datetime.strptime(request.form['birthdate'], '%Y-%m-%d')
        student.age = request.form['age']
        student.gender = request.form['gender']
        student.mother_tongue = request.form['mother_tongue']
        student.ethnic_group = request.form['ethnic_group']
        student.religion = request.form['religion']
        student.address_house_no = request.form['address_house_no']
        student.address_barangay = request.form['address_barangay']
        student.address_city = request.form['address_city']
        student.address_province = request.form['address_province']
        student.mother_name = request.form['mother_name']
        student.mother_contact = request.form['mother_contact']
        student.father_name = request.form['father_name']
        student.father_contact = request.form['father_contact']
        student.guardian_name = request.form['guardian_name']
        student.guardian_contact = request.form['guardian_contact']
        db.session.commit()
        flash('Student record updated successfully', 'success')
        return redirect(url_for('main.manage_students'))
    return render_template('edit_student.html', student=student)

@main.route('/delete_student/<int:id>', methods=['POST'])
def delete_student(id):
    student = StudentRecord.query.get_or_404(id)
    db.session.delete(student)
    db.session.commit()
    flash('Student deleted successfully', 'success')
    return redirect(url_for('main.manage_students'))

@main.route('/add_student', methods=['GET', 'POST'])
def add_student():
    if request.method == 'POST':
        new_record = StudentRecord(
            lrn=request.form['lrn'],
            name=request.form['name'],
            grade_section=request.form['grade_section'],
            birthdate=datetime.strptime(request.form['birthdate'], '%Y-%m-%d'),
            age=request.form['age'],
            gender=request.form['gender'],
            mother_tongue=request.form['mother_tongue'],
            ethnic_group=request.form['ethnic_group'],
            religion=request.form['religion'],
            address_house_no=request.form['address_house_no'],
            address_barangay=request.form['address_barangay'],
            address_city=request.form['address_city'],
            address_province=request.form['address_province'],
            mother_name=request.form['mother_name'],
            mother_contact=request.form['mother_contact'],
            father_name=request.form['father_name'],
            father_contact=request.form['father_contact'],
            guardian_name=request.form['guardian_name'],
            guardian_contact=request.form['guardian_contact']
        )
        db.session.add(new_record)
        db.session.commit()
        flash('New student added successfully', 'success')
        return redirect(url_for('main.manage_students'))
    return render_template('add_new_student.html')

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

@main.route('/view_profile/<int:student_id>', methods=['GET', 'POST'])
def view_profile(student_id):
    student = StudentRecord.query.get_or_404(student_id)
    offenses = OffenseRecord.query.filter_by(student_id=student_id).all()
    if request.method == 'POST' and 'photo' in request.files:
        photo = request.files['photo']
        if photo.filename != '':
            filename = secure_filename(photo.filename)
            file_path = os.path.join(app.root_path, 'static', 'profilepic', filename)
            os.makedirs(os.path.dirname(file_path), exist_ok=True)  # Ensure the directory exists
            photo.save(file_path)
            student.profile_picture = filename
            db.session.commit()
            print(f"Profile picture updated to: {student.profile_picture}")  # Debug print statement
            flash('Profile picture updated successfully', 'success')
    return render_template('profile.html', student=student, offenses=offenses)
    
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

        flash('Offense added successfully', 'success')
        return redirect(url_for('main.view_profile', student_id=student_id))

    return render_template('add_student_offense.html', student=student)

@main.route('/edit_offense/<int:offense_id>', methods=['GET', 'POST'])
def edit_offense(offense_id):
    offense = OffenseRecord.query.get_or_404(offense_id)
    if request.method == 'POST':
        offense.reason = request.form['reason']
        offense.offense_type = request.form['offense_type']
        offense.date_time = datetime.strptime(request.form['date_time'], '%Y-%m-%dT%H:%M:%S')
        db.session.commit()
        flash('Offense record updated successfully!', 'success')
        return redirect(url_for('main.manage_records'))
    return render_template('edit_offense.html', offense=offense)

@main.route('/delete_offense/<int:offense_id>', methods=['POST'])
def delete_offense(offense_id):
    offense = OffenseRecord.query.get_or_404(offense_id)
    db.session.delete(offense)
    db.session.commit()
    flash('Offense deleted successfully', 'success')
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

        flash('Report added successfully', 'success')
        return redirect(url_for('main.manage_records'))

    return render_template('add_report.html', students=students, purposes=purposes)

@main.route('/logout')
def logout():
    return redirect(url_for('main.index'))

@main.route('/registration', methods=['GET', 'POST'])
def registration():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm_password']

        if password != confirm_password:
            flash('Passwords do not match!', 'danger')
            return redirect(url_for('main.registration'))

        user = User(name=name, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        flash('Account created successfully!', 'success')
        return redirect(url_for('main.dashboard'))
    return render_template('registration.html')


@main.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()

        if user is None or not user.check_password(password):
            flash('Invalid email or password', 'danger')
            return redirect(url_for('main.login'))

        flash('Logged in successfully!', 'success')
        return redirect(url_for('main.dashboard'))
    return render_template('login.html')

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
        # Read the Excel file
        excel_data = pd.ExcelFile(file_path)
        print(f"Excel file loaded: {file_path}")  # Debug print

        # Iterate over each sheet in the Excel file
        for sheet_name in excel_data.sheet_names:
            print(f"Processing sheet: {sheet_name}")  # Debug print
            data = pd.read_excel(file_path, sheet_name=sheet_name)

            # Iterate over each row in the sheet
            for index, row in data.iterrows():
                print(f"Processing row {index}: {row}")  # Debug print

                # Validate and clean LRN
                lrn = row.get('LRN', None)
                if pd.notna(lrn):
                    try:
                        lrn = str(int(lrn)).zfill(12)  # Ensure LRN is 12 digits
                    except ValueError:
                        print(f"Invalid LRN at row {index}: {lrn}")  # Debug print
                        continue  # Skip this row
                else:
                    lrn = None

                # Validate and clean Name
                name = row.get('NAME', None)
                if not isinstance(name, str) or not name.strip():
                    print(f"Invalid Name at row {index}: {name}")  # Debug print
                    continue  # Skip this row

                # Validate and clean Section
                section = row.get('Section', None)

                # Validate and clean Birthdate
                birthdate = row.get('BIRTH DATE (mm/dd/yyyy)', None)
                if isinstance(birthdate, str):
                    try:
                        birthdate = datetime.strptime(birthdate, '%m/%d/%Y').date()
                    except ValueError:
                        try:
                            birthdate = datetime.strptime(birthdate, '%m-%d-%Y').date()
                        except ValueError:
                            print(f"Invalid Birthdate at row {index}: {birthdate}")  # Debug print
                            birthdate = None
                elif isinstance(birthdate, datetime):
                    birthdate = birthdate.date()
                elif not isinstance(birthdate, date):
                    birthdate = None

                # Calculate age if birthdate is available
                age = None
                if birthdate:
                    age = (date.today().year - birthdate.year) - (
                        (date.today().month, date.today().day) < (birthdate.month, birthdate.day)
                    )

                # Validate and clean Gender
                gender = row.get('SEX', None)

                # Validate and clean other fields
                mother_tongue = row.get('MOTHER TONGUE', None)
                ethnic_group = row.get('IP', None)
                religion = row.get('RELIGION', None)
                address_house_no = row.get('House No', None)
                address_barangay = row.get('Barangay', None)
                address_city = row.get('Municipality/City', None)
                address_province = row.get('Province', None)
                mother_name = row.get("Mother's Maiden Name(Last Name, First Name, Middle Name)", None)
                mother_contact = row.get('Mother Contact', None)
                father_name = row.get("Father's Name(Last Name, First Name, Middle Name)", None)
                father_contact = row.get('Father Contact', None)
                guardian_name = row.get('Guardian Name', None)
                guardian_contact = row.get('Contact Number of Parent or Guardian', None)

                # Create a new StudentRecord object
                student = StudentRecord(
                    lrn=lrn,
                    name=name,
                    grade=sheet_name.split()[1] if len(sheet_name.split()) > 1 else None,  # Extract the grade from the sheet name
                    section=section,
                    birthdate=birthdate,
                    age=age,
                    gender=gender,
                    mother_tongue=mother_tongue,
                    ethnic_group=ethnic_group,
                    religion=religion,
                    address_house_no=address_house_no,
                    address_barangay=address_barangay,
                    address_city=address_city,
                    address_province=address_province,
                    mother_name=mother_name,
                    mother_contact=mother_contact,
                    father_name=father_name,
                    father_contact=father_contact,
                    guardian_name=guardian_name,
                    guardian_contact=guardian_contact
                )
                db.session.add(student)
        db.session.commit()
        print("Database populated successfully!")  # Debug print
    except Exception as e:
        print(f"Error in populate_database_from_excel: {e}")  # Debug print
        raise
    
@main.route('/analytics')
def analytics():
    total_students = StudentRecord.query.count()

    # Data for types of offenses chart
    offense_type_data = db.session.query(
        OffenseRecord.offense_type,
        func.count(OffenseRecord.id).label('offense_type_count')
    ).group_by(OffenseRecord.offense_type).all()
    offense_labels = [data.offense_type for data in offense_type_data]
    offense_type_counts = [data.offense_type_count for data in offense_type_data]

    # Data for number of students with offenses chart
    students_with_offenses_data = db.session.query(
        StudentRecord.name,
        func.count(OffenseRecord.id).label('offense_count')
    ).join(OffenseRecord).group_by(StudentRecord.name).having(func.count(OffenseRecord.id) > 0).all()
    students_with_offenses = [data.name for data in students_with_offenses_data]
    students_with_offenses_counts = [data.offense_count for data in students_with_offenses_data]

    return render_template(
        'analytics.html',
        total_students=total_students,
        offense_labels=offense_labels,
        offense_type_counts=offense_type_counts,
        students_with_offenses=students_with_offenses,
        students_with_offenses_counts=students_with_offenses_counts
    )

