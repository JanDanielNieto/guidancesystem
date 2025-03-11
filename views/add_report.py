from PyQt5.QtWidgets import QMainWindow, QMessageBox
from PyQt5.uic import loadUi
from models.report import Report
from views.dashboard import DashboardWindow


class AddReportWindow(QMainWindow):
    def __init__(self):
        super(AddReportWindow, self).__init__()
        loadUi('ui/add_report.ui', self)

        # Connect Buttons
        self.saveButton.clicked.connect(self.add_report)
        self.cancelButton.clicked.connect(self.go_back)

    def add_report(self):
        """
        Add a new student report to the database.
        """
        student_id = self.studentIdInput.text()
        subject = self.subjectInput.text()
        grade = self.gradeInput.text()
        remarks = self.remarksInput.toPlainText()

        if student_id == '' or subject == '' or grade == '' or remarks == '':
            QMessageBox.warning(self, 'Input Error', 'All fields are required.')
            return

        # Add report to the database
        report = Report(student_id, subject, grade, remarks)
        result = report.add_report()

        if result:
            QMessageBox.information(self, 'Success', 'Report added successfully.')
            self.go_back()
        else:
            QMessageBox.warning(self, 'Error', 'Failed to add report.')

    def go_back(self):
        """
        Return to the Dashboard.
        """
        self.hide()
        self.dashboard_window = DashboardWindow('Admin', 'token_placeholder')
        self.dashboard_window.show()
