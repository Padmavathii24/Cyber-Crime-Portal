from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import uuid
import os

app = Flask(__name__)
CORS(app)

# Set the database URI - add this after app initialization
basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(basedir, 'cyber_crime.db')

# Configure SQLite database with absolute path
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True  # Automatically commit on session close

# Ensure the instance folder exists
os.makedirs(os.path.dirname(db_path), exist_ok=True)

db = SQLAlchemy(app)

# Define User model
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='Citizen')
    admin_code = db.Column(db.String(100))
    date_registered = db.Column(db.DateTime, default=datetime.utcnow)

# Base Report Model
class Report(db.Model):
    __tablename__ = 'reports'
    id = db.Column(db.Integer, primary_key=True)
    tracking_id = db.Column(db.String(20), unique=True, nullable=False)
    citizen_email = db.Column(db.String(120), nullable=False)
    fraud_type = db.Column(db.String(50), nullable=False)
    sub_type = db.Column(db.String(50))
    status = db.Column(db.String(20), default='pending')
    date_submitted = db.Column(db.DateTime, default=datetime.utcnow)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    priority = db.Column(db.String(20), default='normal')
    assigned_to = db.Column(db.String(120))
    notes = db.Column(db.Text)
    resolution = db.Column(db.Text)

    def get_specific_details(self):
        if self.fraud_type == 'Banking Fraud':
            details = BankingFraudReport.query.filter_by(report_id=self.id).first()
        elif self.fraud_type == 'Job Fraud':
            details = JobFraudReport.query.filter_by(report_id=self.id).first()
        elif self.fraud_type == 'Online Payment Fraud':
            details = PaymentFraudReport.query.filter_by(report_id=self.id).first()
        else:
            details = OtherCrimeReport.query.filter_by(report_id=self.id).first()
        return details

    def to_dict(self):
        specific_details = self.get_specific_details()
        base_dict = {
            'id': self.id,
            'trackingId': self.tracking_id,
            'citizenEmail': self.citizen_email,
            'fraudType': self.fraud_type,
            'subType': self.sub_type,
            'status': self.status,
            'dateSubmitted': self.date_submitted.strftime('%Y-%m-%d %H:%M:%S'),
            'lastUpdated': self.last_updated.strftime('%Y-%m-%d %H:%M:%S'),
            'priority': self.priority,
            'assignedTo': self.assigned_to,
            'notes': self.notes,
            'resolution': self.resolution
        }
        
        if specific_details:
            if isinstance(specific_details, BankingFraudReport):
                base_dict['details'] = {
                    'fraudSubtype': specific_details.fraud_subtype,
                    'bankName': specific_details.bank_name,
                    'accountNumber': specific_details.account_number,
                    'transactionDate': specific_details.transaction_date.strftime('%Y-%m-%d %H:%M:%S') if specific_details.transaction_date else None,
                    'amount': specific_details.amount,
                    'description': specific_details.description,
                    'evidenceFiles': specific_details.evidence_files
                }
            elif isinstance(specific_details, JobFraudReport):
                base_dict['details'] = {
                    'companyName': specific_details.company_name,
                    'jobTitle': specific_details.job_title,
                    'fraudDescription': specific_details.fraud_description,
                    'amountPaid': specific_details.amount_paid,
                    'communicationMode': specific_details.communication_mode,
                    'recruiterDetails': specific_details.recruiter_details,
                    'evidenceFiles': specific_details.evidence_files
                }
            elif isinstance(specific_details, PaymentFraudReport):
                base_dict['details'] = {
                    'platformName': specific_details.platform_name,
                    'transactionId': specific_details.transaction_id,
                    'amount': specific_details.amount,
                    'paymentMethod': specific_details.payment_method,
                    'merchantDetails': specific_details.merchant_details,
                    'dateOfTransaction': specific_details.date_of_transaction.strftime('%Y-%m-%d %H:%M:%S') if specific_details.date_of_transaction else None,
                    'evidenceFiles': specific_details.evidence_files
                }
            else:
                base_dict['details'] = {
                    'crimeType': specific_details.crime_type,
                    'platformUsed': specific_details.platform_used,
                    'incidentDate': specific_details.incident_date.strftime('%Y-%m-%d %H:%M:%S') if specific_details.incident_date else None,
                    'description': specific_details.description,
                    'evidenceFiles': specific_details.evidence_files
                }
        
        return base_dict

# Banking Fraud Report
class BankingFraudReport(db.Model):
    __tablename__ = 'banking_fraud_reports'
    id = db.Column(db.Integer, primary_key=True)
    report_id = db.Column(db.Integer, db.ForeignKey('reports.id'), nullable=False)
    fraud_subtype = db.Column(db.Enum(
        'Fraud Call / Vishing',
        'Cheating by Impersonation',
        'Profile Hacking / Identity Theft',
        'Demat / Depository Fraud / Other Cyber',
        'Online Matrimonial Fraud',
        name='banking_fraud_types'
    ), nullable=False)
    bank_name = db.Column(db.String(100))
    account_number = db.Column(db.String(50))
    transaction_date = db.Column(db.DateTime)
    amount = db.Column(db.Float)
    description = db.Column(db.Text)
    evidence_files = db.Column(db.JSON)

# Job Fraud Report
class JobFraudReport(db.Model):
    __tablename__ = 'job_fraud_reports'
    id = db.Column(db.Integer, primary_key=True)
    report_id = db.Column(db.Integer, db.ForeignKey('reports.id'), nullable=False)
    fraud_subtype = db.Column(db.Enum(
        'Online Job Fraud',
        'Cheating by Impersonation (Pretending to be another person)',
        'Fake Profile',
        name='job_fraud_types'
    ), nullable=False)
    company_name = db.Column(db.String(100))
    job_title = db.Column(db.String(100))
    fraud_description = db.Column(db.Text)
    amount_paid = db.Column(db.Float)
    communication_mode = db.Column(db.String(50))
    recruiter_details = db.Column(db.Text)
    evidence_files = db.Column(db.JSON)

# Online Payment Fraud Report
class PaymentFraudReport(db.Model):
    __tablename__ = 'payment_fraud_reports'
    id = db.Column(db.Integer, primary_key=True)
    report_id = db.Column(db.Integer, db.ForeignKey('reports.id'), nullable=False)
    fraud_subtype = db.Column(db.Enum(
        'UPI Fraud',
        'Debit/Credit/Sim Swap Fraud',
        'Internet Banking Related Fraud',
        'E-Wallet Related Fraud',
        'Online Gambling',
        'Cryptocurrency Fraud',
        'Email Phishing',
        name='payment_fraud_types'
    ), nullable=False)
    platform_name = db.Column(db.String(100))
    transaction_id = db.Column(db.String(100))
    amount = db.Column(db.Float)
    payment_method = db.Column(db.String(50))
    merchant_details = db.Column(db.Text)
    date_of_transaction = db.Column(db.DateTime)
    evidence_files = db.Column(db.JSON)

# Other Cyber Crime Report
class OtherCrimeReport(db.Model):
    __tablename__ = 'other_crime_reports'
    id = db.Column(db.Integer, primary_key=True)
    report_id = db.Column(db.Integer, db.ForeignKey('reports.id'), nullable=False)
    fraud_subtype = db.Column(db.Enum(
        'Cyber Bullying / Stalking / Sexting',
        'Provocative Speech for Unlawful Acts',
        'Cyber Terrorism',
        'Demat / Depository Fraud / Other Cyber',
        name='other_crime_types'
    ), nullable=False)
    crime_type = db.Column(db.String(100))
    platform_used = db.Column(db.String(100))
    incident_date = db.Column(db.DateTime)
    description = db.Column(db.Text)
    evidence_files = db.Column(db.JSON)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    admin_code = data.get('adminCode')

    if not email or not password or not role:
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400

    user = User.query.filter_by(email=email, role=role).first()
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 401

    # Check password
    if not check_password_hash(user.password, password):
        return jsonify({'success': False, 'message': 'Invalid password'}), 401

    # For admin users, verify admin code
    if role == 'admin' and user.admin_code != admin_code:
        return jsonify({'success': False, 'message': 'Invalid admin code'}), 401

    return jsonify({
        'success': True,
        'role': user.role,
        'email': user.email,
        'name': user.name
    })

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate required fields
    if not data.get('email') or not data.get('password') or not data.get('role') or not data.get('name'):
        return jsonify({
            'success': False, 
            'message': 'Missing required fields'
        }), 400

    # Check if email already exists
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({
            'success': False, 
            'message': 'Email already exists'
        }), 400

    # Role-specific validation
    if data.get('role') == 'admin' and not data.get('adminCode'):
        return jsonify({
            'success': False, 
            'message': 'Admin code required for admin registration'
        }), 400

    try:
        # Hash the password
        hashed_password = generate_password_hash(data.get('password'))
        
        new_user = User(
            name=data.get('name'),
            email=data.get('email'),
            password=hashed_password,
            role=data.get('role'),
            admin_code=data.get('adminCode') if data.get('role') == 'admin' else None
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'User registered successfully'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Registration failed: {str(e)}'
        }), 500

@app.route('/api/test/admin', methods=['GET'])
def test_admin():
    admin = User.query.filter_by(role='admin').first()
    if admin:
        return jsonify({
            'email': admin.email,
            'role': admin.role,
            'admin_code': admin.admin_code,
            'password': admin.password
        })
    return jsonify({'message': 'No admin found'})

@app.route('/api/submit-report', methods=['POST'])
def submit_report():
    try:
        data = request.get_json()
        print("Received data:", data)  # Debug print
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400

        tracking_id = f"CR{uuid.uuid4().hex[:8].upper()}"
        
        # Process file attachments if any
        evidence_files = []
        if 'attachments' in data:
            for file in data['attachments']:
                file_data = {
                    'name': file.get('filename'),
                    'type': file.get('type'),
                    'size': file.get('size'),
                    'content': file.get('content', ''),  # Base64 content
                    'uploaded_at': datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
                }
                evidence_files.append(file_data)
        
        # Create base report
        new_report = Report(
            tracking_id=tracking_id,
            citizen_email=data.get('citizenEmail'),
            fraud_type=data.get('fraudType'),
            sub_type=data.get('subType'),
            status='pending',
            date_submitted=datetime.utcnow(),
            priority=data.get('priority', 'normal'),
            notes=data.get('notes', '')
        )
        
        db.session.add(new_report)
        db.session.flush()  # Get the ID of the base report
        
        # Create specific report based on fraud type
        details = data.get('details', {})
        details['evidence_files'] = evidence_files
        
        if data.get('fraudType') == 'Banking Fraud':
            specific_report = BankingFraudReport(
                report_id=new_report.id,
                fraud_subtype=data.get('subType'),
                bank_name=details.get('bankName'),
                account_number=details.get('accountNumber'),
                transaction_date=datetime.strptime(details.get('transactionDate'), '%Y-%m-%d %H:%M:%S') if details.get('transactionDate') else None,
                amount=float(details.get('amount', 0)),
                description=details.get('description'),
                evidence_files=evidence_files
            )
        elif data.get('fraudType') == 'Job Fraud':
            specific_report = JobFraudReport(
                report_id=new_report.id,
                fraud_subtype=data.get('subType'),
                company_name=details.get('companyName'),
                job_title=details.get('jobTitle'),
                fraud_description=details.get('fraudDescription'),
                amount_paid=float(details.get('amountPaid', 0)),
                communication_mode=details.get('communicationMode'),
                recruiter_details=details.get('recruiterDetails'),
                evidence_files=evidence_files
            )
        elif data.get('fraudType') == 'Online Payment Fraud':
            specific_report = PaymentFraudReport(
                report_id=new_report.id,
                fraud_subtype=data.get('subType'),
                platform_name=details.get('platformName'),
                transaction_id=details.get('transactionId'),
                amount=float(details.get('amount', 0)),
                payment_method=details.get('paymentMethod'),
                merchant_details=details.get('merchantDetails'),
                date_of_transaction=datetime.strptime(details.get('dateOfTransaction'), '%Y-%m-%d %H:%M:%S') if details.get('dateOfTransaction') else None,
                evidence_files=evidence_files
            )
        else:  # Other Cyber Crime
            specific_report = OtherCrimeReport(
                report_id=new_report.id,
                fraud_subtype=data.get('subType'),
                crime_type=details.get('crimeType'),
                platform_used=details.get('platformUsed'),
                incident_date=datetime.strptime(details.get('incidentDate'), '%Y-%m-%d %H:%M:%S') if details.get('incidentDate') else None,
                description=details.get('description'),
                evidence_files=evidence_files
            )
        
        db.session.add(specific_report)
        db.session.commit()
        print("Report committed to database")  # Debug print
        
        return jsonify({
            'success': True,
            'trackingId': tracking_id,
            'message': f'Report submitted successfully. Your tracking ID is {tracking_id}'
        })

    except Exception as e:
        print("Error saving report:", str(e))  # Debug print
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Failed to save report: {str(e)}'
        }), 500

@app.route('/api/track-report/<tracking_id>', methods=['GET'])
def track_report(tracking_id):
    try:
        report = Report.query.filter_by(tracking_id=tracking_id).first()
        
        if not report:
            return jsonify({
                'success': False,
                'message': 'Track ID not found. Please enter a valid ID.'
            }), 404
            
        return jsonify({
            'success': True,
            'report': report.to_dict()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/admin/reports', methods=['GET'])
def get_all_reports():
    try:
        reports = Report.query.order_by(Report.date_submitted.desc()).all()
        return jsonify({
            'success': True,
            'reports': [report.to_dict() for report in reports]
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/admin/update-report/<tracking_id>', methods=['PUT'])
def update_report_status(tracking_id):
    try:
        data = request.get_json()
        report = Report.query.filter_by(tracking_id=tracking_id).first()
        
        if not report:
            return jsonify({
                'success': False,
                'message': 'Report not found'
            }), 404

        report.status = data.get('status')
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Status updated successfully'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/citizen-reports/<email>', methods=['GET'])
def get_citizen_reports(email):
    reports = Report.query.filter_by(citizen_email=email).all()
    
    return jsonify({
        'success': True,
        'reports': [report.to_dict() for report in reports]
    })

@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        users_list = []
        for user in users:
            users_list.append({
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': user.role
            })
        return jsonify({
            'success': True,
            'users': users_list
        })
    except Exception as e:
        print(f"Error fetching users: {str(e)}")  # Add logging for debugging
        return jsonify({
            'success': False,
            'message': 'Failed to fetch users'
        }), 500

@app.route('/api/reports', methods=['GET'])
def get_reports():
    try:
        # Get all reports from the database ordered by submission date
        reports = Report.query.order_by(Report.date_submitted.desc()).all()
        
        # Convert reports to dictionary format
        reports_data = []
        for report in reports:
            report_dict = {
                'tracking_id': report.tracking_id,
                'fraud_type': report.fraud_type,
                'sub_type': report.sub_type,
                'citizen_email': report.citizen_email,
                'date_submitted': report.date_submitted.strftime('%Y-%m-%d %H:%M:%S'),
                'status': report.status,
                'priority': report.priority,
                'assigned_to': report.assigned_to,
                'notes': report.notes,
                'resolution': report.resolution
            }
            reports_data.append(report_dict)
        
        print(f"Found {len(reports_data)} reports")  # Debug print
        
        return jsonify({
            'success': True,
            'reports': reports_data
        })
    except Exception as e:
        print(f"Error fetching reports: {str(e)}")  # Debug print
        return jsonify({
            'success': False,
            'message': f'Failed to fetch reports: {str(e)}'
        }), 500

# Add CORS headers
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

def init_db():
    with app.app_context():
        # Create all tables
        db.create_all()
        print("Database tables created successfully!")
        
        # Check if admin user exists
        admin = User.query.filter_by(email='neha@gmail.com').first()
        if not admin:
            # Create default users
            users = [
                User(
                    name='Neha Singh',
                    email='neha@gmail.com',
                    password='admin123',
                    role='Admin'
                ),
                User(
                    name='Priya Sharma',
                    email='priya@gmail.com',
                    password='citizen123',
                    role='Citizen'
                ),
                User(
                    name='Rohan Verma',
                    email='rohan@gmail.com',
                    password='law123',
                    role='Law Enforcement'
                )
            ]
            
            try:
                db.session.bulk_save_objects(users)
                db.session.commit()
                print("Database initialized with default users")
            except Exception as e:
                print(f"Error initializing database: {str(e)}")
                db.session.rollback()

# Create tables if they don't exist
with app.app_context():
    init_db()
    print("Database initialization completed!")

if __name__ == '__main__':
    app.run(debug=True, port=5000)