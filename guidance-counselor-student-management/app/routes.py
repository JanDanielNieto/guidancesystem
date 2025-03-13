from flask import Blueprint, render_template, request, redirect, url_for
from .models import db, StudentRecord

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

@main.route('/add_student', methods=['GET', 'POST'])
def add_student():
    if request.method == 'POST':
        name = request.form['name']
        reason = request.form['reason']
        type_of_offense = request.form['type_of_offense']
        additional_info = request.form['additional_info']

        new_record = StudentRecord(
            name=name,
            reason=reason,
            type_of_offense=type_of_offense,
            additional_info=additional_info
        )
        db.session.add(new_record)
        db.session.commit()

        return redirect(url_for('main.manage_records'))

    return render_template('add_student_offense.html')

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