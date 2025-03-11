import sqlite3
import os
import random

DB_PATH = 'database/student_management.db'

# Connect to the database
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Insert Admin User
cursor.execute("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", 
               ('admin', 'admin', 'Admin'))

# Insert Teacher User
cursor.execute("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", 
               ('teacher', 'teacher', 'Teacher'))

# Generate 10 Random Students
students = [
    ('John Doe', 16, '10th', 'john.doe@email.com'),
    ('Emily Smith', 15, '9th', 'emily.smith@email.com'),
    ('Michael Johnson', 17, '11th', 'michael.johnson@email.com'),
    ('Sarah Brown', 14, '8th', 'sarah.brown@email.com'),
    ('James Wilson', 15, '9th', 'james.wilson@email.com'),
    ('Jessica Taylor', 16, '10th', 'jessica.taylor@email.com'),
    ('David Lee', 18, '12th', 'david.lee@email.com'),
    ('Sophia Martinez', 17, '11th', 'sophia.martinez@email.com'),
    ('Daniel Harris', 14, '8th', 'daniel.harris@email.com'),
    ('Olivia White', 16, '10th', 'olivia.white@email.com')
]

# Insert Students
for student in students:
    cursor.execute("INSERT INTO students (name, age, grade, email) VALUES (?, ?, ?, ?)", student)
    student_id = cursor.lastrowid

    # Generate 1-2 Random Reports per Student
    for i in range(random.randint(1, 2)):
        subject = random.choice(['Math', 'Science', 'English', 'History'])
        grade = random.choice(['A', 'B', 'C', 'D', 'F'])
        remarks = random.choice(['Excellent', 'Good', 'Needs Improvement', 'Failing'])
        cursor.execute("INSERT INTO reports (student_id, subject, grade, remarks) VALUES (?, ?, ?, ?)",
                       (student_id, subject, grade, remarks))

conn.commit()
print("✅ Sample Data Created Successfully!")
conn.close()
