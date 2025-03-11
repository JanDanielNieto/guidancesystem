import time
from controllers.auth import Auth


class SessionChecker:
    def __init__(self, token):
        self.token = token

    def is_active(self):
        """
        Check if session is still valid.
        """
        return Auth.is_authenticated(self.token)

    def auto_logout(self):
        """
        Automatically logs out user after 30 minutes.
        """
        if not self.is_active():
            print("🔒 Session Expired. Logging Out.")
            return False
        return True
