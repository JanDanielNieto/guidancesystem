from datetime import datetime
from . import db

class StudentRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    reason = db.Column(db.String(200), nullable=False)
    type_of_offense = db.Column(db.String(100), nullable=False)
    date_time = db.Column(db.DateTime, default=datetime.utcnow)
    additional_info = db.Column(db.Text, nullable=True)