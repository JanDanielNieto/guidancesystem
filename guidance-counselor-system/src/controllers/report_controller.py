class ReportController:
    def __init__(self):
        self.reports = []

    def create_report(self, student_id, report_data):
        report = {
            'student_id': student_id,
            'data': report_data
        }
        self.reports.append(report)
        return report

    def update_report(self, student_id, report_data):
        for report in self.reports:
            if report['student_id'] == student_id:
                report['data'] = report_data
                return report
        return None

    def get_report(self, student_id):
        for report in self.reports:
            if report['student_id'] == student_id:
                return report
        return None

    def get_all_reports(self):
        return self.reports