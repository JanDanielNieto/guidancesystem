import sqlite3
import os
import uuid

# Path to the database
DB_PATH = os.path.join(os.path.dirname(__file__), '../database/student_management.db')


class Session:
    def __init__(self, user_id):
        self.user_id = user_id
        self.token = str(uuid.uuid4())

    def create_session(self):
        """
        Creates a new session for the logged-in user.
        """
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Invalidate any existing session for the user
        cursor.execute('DELETE FROM sessions WHERE user_id=?', (self.user_id,))

        # Create a new session
        cursor.execute(
            'INSERT INTO sessions (user_id, token) VALUES (?, ?)',
            (self.user_id, self.token)
        )
        conn.commit()
        conn.close()
        return self.token

    @staticmethod
    def get_user_by_token(token):
        """
        Returns user data based on the session token.
        """
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            '''
            SELECT users.id, users.username, users.role
            FROM users
            INNER JOIN sessions ON users.id = sessions.user_id
            WHERE sessions.token=?
            ''',
            (token,)
        )
        user = cursor.fetchone()
        conn.close()
        return user

    @staticmethod
    def destroy_session(token):
        """
        Logs out a user by deleting the session token.
        """
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            'DELETE FROM sessions WHERE token=?',
            (token,)
        )
        conn.commit()
        conn.close()
        return True

    @staticmethod
    def clear_all_sessions():
        """
        Destroys all sessions (used for logout all feature).
        """
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            'DELETE FROM sessions'
        )
        conn.commit()
        conn.close()
        return True
