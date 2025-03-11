import sqlite3

DB_PATH = 'database/student_management.db'

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Run SQL file
with open('database/init.sql', 'r') as sql_file:
    sql_script = sql_file.read()
    cursor.executescript(sql_script)

print("✅ Database migrated successfully!")
conn.close()
