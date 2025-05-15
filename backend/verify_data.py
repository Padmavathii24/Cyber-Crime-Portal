from app import app, db, Report, BankingFraudReport, JobFraudReport, PaymentFraudReport, OtherCrimeReport

def verify_data():
    with app.app_context():
        print("\n=== Verifying Database Contents ===\n")
        
        # Check all reports
        reports = Report.query.all()
        print(f"Total Reports Found: {len(reports)}\n")
        
        for report in reports:
            print(f"=== Report {report.tracking_id} ===")
            print(f"Type: {report.fraud_type}")
            print(f"Status: {report.status}")
            print(f"Submitted by: {report.citizen_email}")
            print(f"Date: {report.date_submitted}")
            
            # Get specific details
            details = report.get_specific_details()
            print("\nDetailed Information:")
            
            if isinstance(details, BankingFraudReport):
                print(f"Bank Name: {details.bank_name}")
                print(f"Account Number: {details.account_number}")
                print(f"Amount: ${details.amount}")
                print(f"Description: {details.description}")
            
            elif isinstance(details, JobFraudReport):
                print(f"Company: {details.company_name}")
                print(f"Job Title: {details.job_title}")
                print(f"Amount Paid: ${details.amount_paid}")
                print(f"Communication Mode: {details.communication_mode}")
            
            elif isinstance(details, PaymentFraudReport):
                print(f"Platform: {details.platform_name}")
                print(f"Transaction ID: {details.transaction_id}")
                print(f"Amount: ${details.amount}")
                print(f"Payment Method: {details.payment_method}")
            
            elif isinstance(details, OtherCrimeReport):
                print(f"Crime Type: {details.crime_type}")
                print(f"Platform: {details.platform_used}")
                print(f"Description: {details.description}")
            
            print("\nEvidence Files:")
            if hasattr(details, 'evidence_files') and details.evidence_files:
                for file in details.evidence_files:
                    print(f"- {file['name']} ({file['type']})")
            else:
                print("No evidence files attached")
            
            print("\n" + "="*50 + "\n")

if __name__ == '__main__':
    verify_data() 