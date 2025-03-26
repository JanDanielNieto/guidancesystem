from app import create_app
from flask import request, redirect, url_for, render_template
from werkzeug.utils import secure_filename
import os
from app.models import populate_database_from_excel

app = create_app()

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            return redirect(request.url)
        if file:
            filename = secure_filename(file.filename)
            upload_directory = os.path.join(os.getcwd(), 'uploads')
            os.makedirs(upload_directory, exist_ok=True)  # Ensure the directory exists
            file_path = os.path.join(upload_directory, filename)
            file.save(file_path)
            populate_database_from_excel(file_path)
            return redirect(url_for('upload_file'))
    return render_template('upload.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=os.getenv('FLASK_DEBUG', 'false').lower() == 'true')