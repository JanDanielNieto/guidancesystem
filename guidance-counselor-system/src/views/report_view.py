class ReportView:
    def __init__(self, report_controller):
        self.report_controller = report_controller

    def display_report(self, report_id):
        report_data = self.report_controller.get_report(report_id)
        if report_data:
            self.render_report(report_data)
        else:
            print("Report not found.")

    def render_report(self, report_data):
        # This method would contain the logic to render the report data in the GUI.
        print("Rendering report:")
        for key, value in report_data.items():
            print(f"{key}: {value}")

    def update_report(self, report_id, new_data):
        success = self.report_controller.update_report(report_id, new_data)
        if success:
            print("Report updated successfully.")
        else:
            print("Failed to update report.")