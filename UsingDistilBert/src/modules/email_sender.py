import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from src.modules.config import ConfigLoader

class EmailSender:
    def __init__(self):
        self.config_reader = ConfigLoader()
        self.configuration = self.config_reader.read_config()
        self.smtp = smtplib.SMTP('smtp.gmail.com', 587)
        self.smtp.starttls()
        self.smtp.login(self.configuration['SENDER_EMAIL'], self.configuration['PASSWORD'])

    def send_email(self, subject, body):
        msg = MIMEMultipart()
        msg['From'] = "chatbot <chat@gmail.com>"
        msg['To'] = "chat@gmail.com"
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'html'))
        text = msg.as_string()
        self.smtp.sendmail(self.configuration['SENDER_EMAIL'], msg['To'], text)
        print("Email sent to support team!")

    def send_email_to_support(self, name, email, query_type, **kwargs):
        if query_type == 'request':
            subject = "User Request"
            body = """We have received a user query that requires attention. Here are the details: 
                    Query: {}
                    User Name: {}
                    User Email: {}
                    Please review and respond promptly.
                """.format(kwargs['user_query'], name, email)
        elif query_type == 'dashboard_issues':
            subject = "Dashboard Issues"
            body = """We have received a query regarding dashboard issues. Here are the details: 
                    Dashboard URL: {}
                    Issue Description: {}
                    User Name: {}
                    User Email: {}
                    Please investigate and take necessary actions.
                """.format(kwargs['dashboard_url'], kwargs['issue_description'], name, email)
        else:
            return "Invalid query type"

        self.send_email(subject, body)


