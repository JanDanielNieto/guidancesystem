from PyQt5.QtWidgets import QMainWindow, QTableWidgetItem, QMessageBox
from PyQt5.uic import loadUi
from models.student import Student
from models.report import Report
from views.dashboard import DashboardWindow


class ViewRecordsWindow(QMainWindow):
    def __init__(self):
        super(ViewRecordsWindow, self).__init__()
        loadUi('ui/view_records.ui', self)

        # Load records instantly
        self.load_records()

        # Connect Buttons
        self.searchButton.clicked.connect(self.search_records)
        self.deleteButton.clicked.connect(self.delete_record)
        self.backButton.clicked.connect(self.go_back)

    def load_records(self):
        """
        Load all students and their reports.
        """
        self.recordsTable.setRowCount(0)
        students = Student.get_all_students_with_reports()

        for row_number, data in enumerate(students):
            self.recordsTable.insertRow(row_number)
            self.recordsTable.setItem(row_number, 0, QTableWidgetItem(str(data[0])))  # Student ID
            self.recordsTable.setItem(row_number, 1, QTableWidgetItem(data[1]))       # Name
            self.recordsTable.setItem(row_number, 2, QTableWidgetItem(data[2]))       # Grade
            self.recordsTable.setItem(row_number, 3, QTableWidgetItem(data[3]))       # Subject
            self.recordsTable.setItem(row_number, 4, QTableWidgetItem(data[4]))       # Report Grade
            self.recordsTable.setItem(row_number, 5, QTableWidgetItem(data[5]))       # Remarks

    def search_records(self):
        """
        Search records by name, grade, or subject.
        """
        keyword = self.searchInput.text()
        if keyword == '':
            QMessageBox.warning(self, 'Input Error', 'Enter something to search.')
            return

        self.recordsTable.setRowCount(0)
        results = Student.search_student_reports(keyword)

        for row_number, data in enumerate(results):
            self.recordsTable.insertRow(row_number)
            self.recordsTable.setItem(row_number, 0, QTableWidgetItem(str(data[0])))
            self.recordsTable.setItem(row_number, 1, QTableWidgetItem(data[1]))
            self.recordsTable.setItem(row_number, 2, QTableWidgetItem(data[2]))
            self.recordsTable.setItem(row_number, 3, QTableWidgetItem(data[3]))
            self.recordsTable.setItem(row_number, 4, QTableWidgetItem(data[4]))
            self.recordsTable.setItem(row_number, 5, QTableWidgetItem(data[5]))

    def delete_record(self):
        """
        Delete selected student record.
        """
        selected_row = self.recordsTable.currentRow()
        if selected_row == -1:
            QMessageBox.warning(self, 'Error', 'Please select a record to delete.')
            return

        student_id = self.recordsTable.item(selected_row, 0).text()
        result = Student.delete_student(student_id)

        if result:
            QMessageBox.information(self, 'Success', 'Record deleted successfully.')
            self.load_records()
        else:
            QMessageBox.warning(self, 'Error', 'Failed to delete record.')

    def go_back(self):
        """
        Return to Dashboard.
        """
        self.hide()
        self.dashboard_window = DashboardWindow('Admin', 'token_placeholder')
        self.dashboard_window.show()
