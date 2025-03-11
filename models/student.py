import sqlite3
import os

# Path to the database
DB_PATH = os.path.join(os.path.dirname(__file__), '../database/student_management.db')


class Student:
    def __init__(self, name, age, grade, email):
        self.name = name
        self.age = age
        self.grade = grade
        self.email = email

    def add_student(self):
        """
        Add a new student to the database.
        """
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        try:
            cursor.execute(
                '''
                INSERT INTO students (name, age, grade, email)
                VALUES (?, ?, ?, ?)
                ''',
                (self.name, self.age, self.grade, self.email)
            )
            conn.commit()
            return True
        except Exception as e:
            print(e)
            return False
        finally:
            conn.close()

    @staticmethod
    def get_all_students_with_reports():
        """
        Retrieve all students with their reports.
        """
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            '''
            SELECT students.id, students.name, students.grade, 
                   reports.subject, reports.grade, reports.remarks
            FROM students
            LEFT JOIN reports ON students.id = reports.student_id
            '''
        )
        students = cursor.fetchall()
        conn.close()
        return students

    @staticmethod
    def search_student_reports(keyword):
        """
        Search students by name, grade, or subject.
        """
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            '''
            SELECT students.id, students.name, students.grade, 
                   reports.subject, reports.grade, reports.remarks
            FROM students
            LEFT JOIN reports ON students.id = reports.student_id
            WHERE students.name LIKE ? OR students.grade LIKE ? OR reports.subject LIKE ?
            ''',
            ('%' + keyword + '%', '%' + keyword + '%', '%' + keyword + '%')
        )
        students = cursor.fetchall()
        conn.close()
        return students

    @staticmethod
    def delete_student(student_id):
        """
        Delete a student and their reports.
        """
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        try:
            cursor.execute('DELETE FROM reports WHERE student_id=?', (student_id,))
            cursor.execute('DELETE FROM students WHERE id=?', (student_id,))
            conn.commit()
            return True
        except Exception as e:
            print(e)
            return False
        finally:
            conn.close()
