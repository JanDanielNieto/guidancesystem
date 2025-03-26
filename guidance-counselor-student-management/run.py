from flask import request, redirect, url_for, render_template
from app import create_app
import os
from werkzeug.utils import secure_filename

# Initialize the Flask app
app = create_app()

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # Check if the POST request has the file part
        if 'file' not in request.files:
            return redirect(request.url)
        file = request.files['file']
        # If the user does not select a file, the browser submits an empty part
        if file.filename == '':
            return redirect(request.url)
        if file:
            # Secure the filename and save the file
            filename = secure_filename(file.filename)
            upload_directory = app.config['UPLOAD_FOLDER']
            os.makedirs(upload_directory, exist_ok=True)  # Ensure the directory exists
            file_path = os.path.join(upload_directory, filename)
            # Placeholder for the function to process the file
            # Define the populate_database_from_excel function
            def populate_database_from_excel(file_path):
                # Add logic to process the Excel file and populate the database
                print(f"Processing file: {file_path}")
                # Example: Connect to the database and process the file
                pass

            # Process the file (e.g., populate the database)
            populate_database_from_excel(file_path)
            return redirect(url_for('upload_file'))
    return render_template('upload.html')

if __name__ == '__main__':
    app.run()