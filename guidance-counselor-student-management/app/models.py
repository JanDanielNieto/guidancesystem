from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class StudentRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    reason = db.Column(db.String(200), nullable=False)
    offence_type = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)

    def __repr__(self):
        return f'<StudentRecord {self.student_id} - {self.name}>'