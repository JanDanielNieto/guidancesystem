# Guidance Counselor's Student Management System

This project is a web application developed using Flask that serves as a Student Management System for guidance counselors. It allows for the management of student records, including details about offences, reasons, and timestamps.

## Features

- Add new student records
- View a list of all student records
- Display detailed information about specific student offences
- Manage different types of offences and reasons

## Project Structure

```
guidance-counselor-student-management
├── app
│   ├── __init__.py
│   ├── routes.py
│   ├── models.py
│   ├── templates
│   │   ├── base.html
│   │   ├── index.html
│   │   └── student.html
│   ├── static
│   │   ├── css
│   │   │   └── styles.css
│   │   └── js
│   │       └── scripts.js
├── config.py
├── run.py
├── requirements.txt
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/guidance-counselor-student-management.git
   ```
2. Navigate to the project directory:
   ```
   cd guidance-counselor-student-management
   ```
3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

## Usage

To run the application, execute the following command:
```
python run.py
```

The application will be accessible at `http://127.0.0.1:5000`.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for details.