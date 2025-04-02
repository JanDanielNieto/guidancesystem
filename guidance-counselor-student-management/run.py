from app import create_app
import mysql.connector

# Initialize the Flask app
app = create_app()

# Configure MySQL connection
db_config = {
    'host': 'localhost',
    'user': 'your_username',
    'password': 'your_password',
    'database': 'guidance_system'
}

try:
    connection = mysql.connector.connect(**db_config)
    app.db = connection
    print("Connected to MySQL database.")
except mysql.connector.Error as err:
    print(f"Error: {err}")
    app.db = None

if __name__ == '__main__':
    app.run()