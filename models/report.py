import sqlite3
import os

# Path to the database
DB_PATH = os.path.join(os.path.dirname(__file__), '../database/student_management.db')


class Report:
    def __init__(self, student_id, subject, grade, remarks):
        self.student_id = student_id
        self.subject = subject
        self.grade = grade
        self.remarks = remarks

    def add_report(self):
        """
        Add a new report for a student.
        """
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        try:
            cursor.execute(
                '''
                INSERT INTO reports (student_id, subject, grade, remarks)
                VALUES (?, ?, ?, ?)
                ''',
                (self.student_id, self.subject, self.grade, self.remarks)
            )
            conn.commit()
            return True
        except Exception as e:
            print(e)
            return False
        finally:
            conn.close()

    @staticmethod
    def get_reports_by_student(student_id):
        """
        Retrieve reports by student ID.
        """
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            '''
            SELECT subject, grade, remarks
            FROM reports
            WHERE student_id=?
            ''',
            (student_id,)
        )
        reports = cursor.fetchall()
        conn.close()
        return reports

    @staticmethod
    def delete_report(student_id):
        """
        Delete a report by student ID.
        """
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        try:
            cursor.execute('DELETE FROM reports WHERE student_id=?', (student_id,))
            conn.commit()
            return True
        except Exception as e:
            print(e)
            return False
        finally:
            conn.close()
