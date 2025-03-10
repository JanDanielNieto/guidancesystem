from PyQt5.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QWidget, QPushButton, QLabel

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Guidance Counselor System")
        self.setGeometry(100, 100, 800, 600)

        self.initUI()

    def initUI(self):
        layout = QVBoxLayout()

        self.label = QLabel("Welcome to the Guidance Counselor System", self)
        layout.addWidget(self.label)

        self.report_button = QPushButton("Generate Report", self)
        self.report_button.clicked.connect(self.generate_report)
        layout.addWidget(self.report_button)

        container = QWidget()
        container.setLayout(layout)
        self.setCentralWidget(container)

    def generate_report(self):
        # Logic to generate report will be implemented here
        self.label.setText("Report generation functionality is not yet implemented.")

if __name__ == "__main__":
    import sys
    app = QApplication(sys.argv)
    mainWin = MainWindow()
    mainWin.show()
    sys.exit(app.exec_())