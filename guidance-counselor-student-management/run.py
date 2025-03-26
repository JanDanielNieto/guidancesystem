from app import create_app
from flask import request, redirect, url_for, render_template
from werkzeug.utils import secure_filename
import os
from app.models import populate_database_from_excel

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
            file.save(file_path)
            # Process the file (e.g., populate the database)
            populate_database_from_excel(file_path)
            return redirect(url_for('upload_file'))
    return render_template('upload.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=os.getenv('FLASK_DEBUG', 'false').lower() == 'true')