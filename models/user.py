import sqlite3
import hashlib
import os

DB_PATH = os.path.join(os.path.dirname(__file__), '../database/student_management.db')


class User:
    def __init__(self, username, password, role):
        self.username = username
        self.password = password
        self.role = role

    def register(self):
        """
        Registers a new user into the database with a hashed password.
        """
        hashed_password = self.hash_password(self.password)
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            (self.username, hashed_password, self.role)
        )
        conn.commit()
        conn.close()
        return True

    def login(self):
        """
        Logs in a user by verifying the username and password.
        """
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            'SELECT id, username, password, role FROM users WHERE username=?',
            (self.username,)
        )
        user = cursor.fetchone()
        conn.close()

        if user:
            user_id, username, password_hash, role = user
            if self.verify_password(self.password, password_hash):
                return {
                    'id': user_id,
                    'username': username,
                    'role': role
                }
        return None

    @staticmethod
    def hash_password(password):
        """
        Hashes a password using SHA256.
        """
        return hashlib.sha256(password.encode()).hexdigest()

    @staticmethod
    def verify_password(password, password_hash):
        """
        Verifies a password by comparing it with the hash.
        """
        return hashlib.sha256(password.encode()).hexdigest() == password_hash

    @staticmethod
    def get_all_users():
        """
        Fetches all users from the database.
        """
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            'SELECT id, username, role FROM users'
        )
        users = cursor.fetchall()
        conn.close()
        return users

    @staticmethod
    def delete_user(user_id):
        """
        Deletes a user from the database based on user ID.
        """
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            'DELETE FROM users WHERE id=?',
            (user_id,)
        )
        conn.commit()
        conn.close()
        return True

    @staticmethod
    def get_user_by_id(user_id):
        """
        Fetches a single user by ID.
        """
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            'SELECT id, username, role FROM users WHERE id=?',
            (user_id,)
        )
        user = cursor.fetchone()
        conn.close()
        return user
