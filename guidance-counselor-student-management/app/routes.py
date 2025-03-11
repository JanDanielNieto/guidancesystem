from flask import Blueprint, render_template, request, redirect, url_for
from .models import StudentRecord
from . import db

main = Blueprint('main', __name__)

@main.route('/')
def index():
    records = StudentRecord.query.all()
    return render_template('index.html', records=records)

@main.route('/add', methods=['GET', 'POST'])
def add_record():
    if request.method == 'POST':
        student_id = request.form['student_id']
        name = request.form['name']
        reason = request.form['reason']
        offence_type = request.form['offence_type']
        date = request.form['date']
        time = request.form['time']
        
        new_record = StudentRecord(student_id=student_id, name=name, reason=reason,
                                   offence_type=offence_type, date=date, time=time)
        db.session.add(new_record)
        db.session.commit()
        return redirect(url_for('main.index'))
    
    return render_template('add_record.html')

@main.route('/student/<int:student_id>')
def student(student_id):
    record = StudentRecord.query.get_or_404(student_id)
    return render_template('student.html', record=record)