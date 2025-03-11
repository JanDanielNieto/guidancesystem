from PyQt5.QtWidgets import QMainWindow, QMessageBox
from PyQt5.uic import loadUi
from models.student import Student
from views.dashboard import DashboardWindow


class AddStudentWindow(QMainWindow):
    def __init__(self):
        super(AddStudentWindow, self).__init__()
        loadUi('ui/add_student.ui', self)

        # Connect Buttons
        self.saveButton.clicked.connect(self.add_student)
        self.cancelButton.clicked.connect(self.go_back)

    def add_student(self):
        """
        Add a new student to the database.
        """
        name = self.nameInput.text()
        age = self.ageInput.text()
        grade = self.gradeInput.text()
        email = self.emailInput.text()

        if name == '' or age == '' or grade == '' or email == '':
            QMessageBox.warning(self, 'Input Error', 'All fields are required.')
            return

        # Add student to the database
        student = Student(name, age, grade, email)
        result = student.add_student()

        if result:
            QMessageBox.information(self, 'Success', 'Student added successfully.')
            self.go_back()
        else:
            QMessageBox.warning(self, 'Error', 'Failed to add student.')

    def go_back(self):
        """
        Return to the Dashboard.
        """
        self.hide()
        self.dashboard_window = DashboardWindow('Admin', 'token_placeholder')
        self.dashboard_window.show()
