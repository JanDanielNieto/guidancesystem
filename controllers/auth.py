import sqlite3
import os
import secrets

DB_PATH = 'database/student_management.db'


class Auth:
    @staticmethod
    def login(username, password):
        """
        Authenticate a user.
        """
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute("SELECT id, role FROM users WHERE username=? AND password=?", (username, password))
        user = cursor.fetchone()

        if user:
            # Generate Token
            token = secrets.token_hex(16)
            user_id = user[0]

            # Save session
            cursor.execute("INSERT INTO sessions (user_id, token) VALUES (?, ?)", (user_id, token))
            conn.commit()
            conn.close()
            return token, user[1]  # Return token & role
        else:
            conn.close()
            return None, None

    @staticmethod
    def is_authenticated(token):
        """
        Verify if a user session is still valid.
        """
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute("SELECT user_id FROM sessions WHERE token=?", (token,))
        session = cursor.fetchone()
        conn.close()

        return session is not None

    @staticmethod
    def logout(token):
        """
        Destroy user session.
        """
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute("DELETE FROM sessions WHERE token=?", (token,))
        conn.commit()
        conn.close()
