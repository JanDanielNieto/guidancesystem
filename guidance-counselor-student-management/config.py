import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgresql://guidance_user:pupdit31@localhost/guidance_system'
    SQLALCHEMY_TRACK_MODIFICATIONS = False