from flask import current_app

def get_student_collection():
    return current_app.db['students']

def get_offense_collection():
    return current_app.db['offenses']

def get_user_collection():
    return current_app.db['users']