from PyQt5.QtWidgets import QMainWindow, QMessageBox
from PyQt5.uic import loadUi
from middleware.session_checker import Session
from views.add_student import AddStudentWindow
from views.add_report import AddReportWindow
from views.view_records import ViewRecordsWindow
from views.login import LoginWindow


class DashboardWindow(QMainWindow):
    def __init__(self, role, token):
        super(DashboardWindow, self).__init__()
        loadUi('ui/dashboard.ui', self)
        self.role = role
        self.token = token

        # Set welcome message
        self.welcomeLabel.setText(f"Welcome, {role}")

        # Control role-based access
        self.configure_access(role)

        # Connect Buttons
        self.addStudentButton.clicked.connect(self.open_add_student)
        self.addReportButton.clicked.connect(self.open_add_report)
        self.viewRecordsButton.clicked.connect(self.open_view_records)
        self.logoutButton.clicked.connect(self.logout)

    def configure_access(self, role):
        """
        Control UI Access based on user role.
        """
        if role == 'Student':
            self.addStudentButton.setVisible(False)
            self.addReportButton.setVisible(False)

    def open_add_student(self):
        self.hide()
        self.add_student_window = AddStudentWindow()
        self.add_student_window.show()

    def open_add_report(self):
        self.hide()
        self.add_report_window = AddReportWindow()
        self.add_report_window.show()

    def open_view_records(self):
        self.hide()
        self.view_records_window = ViewRecordsWindow()
        self.view_records_window.show()

    def logout(self):
        """
        Destroy the session and return to login.
        """
        Session.destroy_session(self.token)
        QMessageBox.information(self, "Logout", "You have been logged out.")
        self.hide()
        self.login_window = LoginWindow()
        self.login_window.show()
