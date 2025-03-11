from PyQt5.QtWidgets import QMainWindow, QMessageBox
from PyQt5.uic import loadUi
from models.user import User
from middleware.session_checker import Session
from views.dashboard import DashboardWindow


class LoginWindow(QMainWindow):
    def __init__(self):
        super(LoginWindow, self).__init__()
        loadUi('ui/login.ui', self)

        # Connect Login Button
        self.loginButton.clicked.connect(self.handle_login)

    def handle_login(self):
        username = self.usernameInput.text()
        password = self.passwordInput.text()

        if username == '' or password == '':
            QMessageBox.warning(self, 'Input Error', 'Please fill in all fields.')
            return

        # Authenticate user
        user = User(username, password, None)
        user_data = user.login()

        if user_data:
            # Create session
            session = Session(user_data['id'])
            token = session.create_session()

            QMessageBox.information(self, 'Success', f'Welcome {user_data["username"]}!')

            # Open Dashboard based on role
            self.open_dashboard(user_data['role'], token)
        else:
            QMessageBox.warning(self, 'Login Failed', 'Invalid username or password.')

    def open_dashboard(self, role, token):
        """
        Open different dashboards based on the role.
        """
        self.hide()
        self.dashboard_window = DashboardWindow(role, token)
        self.dashboard_window.show()
