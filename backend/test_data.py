from app import app, db, User, Report, BankingFraudReport, JobFraudReport, PaymentFraudReport, OtherCrimeReport
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash

def create_sample_data():
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()
        print("Database tables created")

        # Create sample users
        users = [
            {
                'name': 'Admin User',
                'email': 'admin@example.com',
                'password': generate_password_hash('admin123'),
                'role': 'admin',
                'admin_code': 'admin123'
            },
            {
                'name': 'Test Citizen',
                'email': 'citizen@example.com',
                'password': generate_password_hash('citizen123'),
                'role': 'Citizen'
            }
        ]

        for user_data in users:
            user = User(**user_data)
            db.session.add(user)
        
        db.session.commit()
        print("Sample users created")

        # Sample Banking Fraud Reports
        banking_reports = [
            {
                'base': {
                    'tracking_id': 'CR1234ABCD',
                    'citizen_email': 'victim1@example.com',
                    'fraud_type': 'Banking Fraud',
                    'sub_type': 'Fraud Call / Vishing',
                    'status': 'pending'
                },
                'details': {
                    'fraud_subtype': 'Fraud Call / Vishing',
                    'bank_name': 'Example Bank',
                    'account_number': '1234567890',
                    'transaction_date': datetime.now() - timedelta(days=2),
                    'amount': 5000.00,
                    'description': 'Received a fake bank call asking for OTP',
                    'evidence_files': [{'name': 'call_recording.mp3', 'type': 'audio/mp3'}]
                }
            },
            {
                'base': {
                    'tracking_id': 'CR5678EFGH',
                    'citizen_email': 'victim2@example.com',
                    'fraud_type': 'Banking Fraud',
                    'sub_type': 'Profile Hacking / Identity Theft',
                    'status': 'investigating'
                },
                'details': {
                    'fraud_subtype': 'Profile Hacking / Identity Theft',
                    'bank_name': 'Second Bank',
                    'account_number': '0987654321',
                    'transaction_date': datetime.now() - timedelta(days=5),
                    'amount': 2500.00,
                    'description': 'Unauthorized access to online banking profile',
                    'evidence_files': [{'name': 'transaction_history.pdf', 'type': 'application/pdf'}]
                }
            }
        ]

        # Sample Job Fraud Reports
        job_reports = [
            {
                'base': {
                    'tracking_id': 'CR9012IJKL',
                    'citizen_email': 'victim3@example.com',
                    'fraud_type': 'Job Fraud',
                    'sub_type': 'Online Job Fraud',
                    'status': 'pending'
                },
                'details': {
                    'fraud_subtype': 'Online Job Fraud',
                    'company_name': 'Fake Corp Ltd',
                    'job_title': 'Software Developer',
                    'fraud_description': 'Paid registration fee for fake job offer',
                    'amount_paid': 1000.00,
                    'communication_mode': 'Email',
                    'recruiter_details': 'John Doe, claiming to be HR Manager',
                    'evidence_files': [{'name': 'fake_offer_letter.pdf', 'type': 'application/pdf'}]
                }
            }
        ]

        # Sample Payment Fraud Reports
        payment_reports = [
            {
                'base': {
                    'tracking_id': 'CR3456MNOP',
                    'citizen_email': 'victim4@example.com',
                    'fraud_type': 'Online Payment Fraud',
                    'sub_type': 'UPI Fraud',
                    'status': 'resolved'
                },
                'details': {
                    'fraud_subtype': 'UPI Fraud',
                    'platform_name': 'QuickPay',
                    'transaction_id': 'TXN123456789',
                    'amount': 3000.00,
                    'payment_method': 'UPI',
                    'merchant_details': 'Fake Online Store',
                    'date_of_transaction': datetime.now() - timedelta(days=1),
                    'evidence_files': [{'name': 'payment_screenshot.jpg', 'type': 'image/jpeg'}]
                }
            }
        ]

        # Sample Other Cyber Crime Reports
        other_reports = [
            {
                'base': {
                    'tracking_id': 'CR7890QRST',
                    'citizen_email': 'victim5@example.com',
                    'fraud_type': 'Other',
                    'sub_type': 'Cyber Bullying / Stalking / Sexting',
                    'status': 'investigating'
                },
                'details': {
                    'fraud_subtype': 'Cyber Bullying / Stalking / Sexting',
                    'crime_type': 'Cyber Bullying',
                    'platform_used': 'Social Media',
                    'incident_date': datetime.now() - timedelta(days=3),
                    'description': 'Receiving threatening messages and harassment',
                    'evidence_files': [{'name': 'screenshots.zip', 'type': 'application/zip'}]
                }
            }
        ]

        # Insert all reports
        for report_data in banking_reports + job_reports + payment_reports + other_reports:
            # Create base report
            base_report = Report(**report_data['base'])
            db.session.add(base_report)
            db.session.flush()  # Get the ID of the base report

            # Create specific report
            if report_data['base']['fraud_type'] == 'Banking Fraud':
                specific_report = BankingFraudReport(report_id=base_report.id, **report_data['details'])
            elif report_data['base']['fraud_type'] == 'Job Fraud':
                specific_report = JobFraudReport(report_id=base_report.id, **report_data['details'])
            elif report_data['base']['fraud_type'] == 'Online Payment Fraud':
                specific_report = PaymentFraudReport(report_id=base_report.id, **report_data['details'])
            else:
                specific_report = OtherCrimeReport(report_id=base_report.id, **report_data['details'])

            db.session.add(specific_report)

        # Commit all changes
        db.session.commit()
        print("Sample data inserted successfully!")

if __name__ == '__main__':
    create_sample_data() 