from app import create_app
from pymongo import MongoClient

# Initialize the Flask app
app = create_app()

# Configure MongoDB connection
client = MongoClient('mongodb://localhost:27017')  # Replace with your MongoDB URI
app.db = client['guidance_system']  # Replace with your database name

if __name__ == '__main__':
    app.run()