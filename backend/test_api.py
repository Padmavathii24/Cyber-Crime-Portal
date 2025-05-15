import requests
import json
import base64
from datetime import datetime
from pathlib import Path

def create_sample_evidence():
    """Create sample evidence files"""
    evidence_dir = Path("cyber/backend/sample_evidence")
    evidence_dir.mkdir(exist_ok=True)
    
    # Create sample bank statement
    bank_statement = """
    STATE BANK OF INDIA
    Account Statement
    Date: 2024-04-07
    Transaction ID: TXN123456
    Amount: Rs. 25,000
    Status: DEBIT
    """
    with open(evidence_dir / "bank_statement.txt", "w") as f:
        f.write(bank_statement)
    
    # Create sample UPI screenshot
    upi_screenshot = """
    Google Pay
    Transaction Details
    Date: 2024-04-07 15:45:00
    Amount: Rs. 10,000
    UPI ID: fraud@ybl
    Status: COMPLETED
    """
    with open(evidence_dir / "upi_screenshot.txt", "w") as f:
        f.write(upi_screenshot)
    
    # Create sample job offer letter
    job_offer = """
    Tech Solutions Inc.
    Job Offer Letter
    Position: Software Developer
    Salary: 12 LPA
    Start Date: 2024-05-01
    """
    with open(evidence_dir / "fake_job_offer.txt", "w") as f:
        f.write(job_offer)
    
    # Create sample crypto transaction
    crypto_tx = """
    CryptoTrade Platform
    Transaction Hash: 0x123...abc
    Amount: 0.5 BTC
    Value: Rs. 100,000
    Status: CONFIRMED
    """
    with open(evidence_dir / "crypto_transaction.txt", "w") as f:
        f.write(crypto_tx)
    
    return evidence_dir

def read_file_as_base64(file_path):
    """Read file and convert to base64"""
    with open(file_path, "rb") as f:
        return base64.b64encode(f.read()).decode()

def test_submit_report():
    print("\n=== Testing Report Submission API ===")
    
    # Create sample evidence files
    evidence_dir = create_sample_evidence()
    
    # Test cases for different fraud types
    test_cases = [
        # Banking Fraud Reports
        {
            "citizenEmail": "ananthakumar0305@gmail.com",
            "fraudType": "Banking Fraud",
            "subType": "Fraud Call / Vishing",
            "details": {
                "Did you receive a suspicious phone call asking for your bank details?": "Yes",
                "What was the caller claiming to be (e.g., bank official)?": "SBI Bank Manager",
                "Did you share any OTP, PIN, or password with the caller?": "Yes, shared OTP",
                "What was the date and time of the call?": "2024-04-07 10:30 AM",
                "Did the caller ask you to install any app?": "Yes, AnyDesk",
                "How much money did you lose (if any)?": "25000",
                "From which account was the money deducted?": "SBI Savings Account",
                "Have you reported this to your bank?": "Yes",
                "Have you filed a police complaint?": "No",
                "evidence_files": [
                    {
                        "filename": "bank_statement.txt",
                        "content": read_file_as_base64(evidence_dir / "bank_statement.txt"),
                        "type": "text/plain"
                    }
                ]
            },
            "status": "pending",
            "priority": "high"
        },
        {
            "citizenEmail": "ananthakumar0305@gmail.com",
            "fraudType": "Banking Fraud",
            "subType": "Cheating by Impersonation",
            "details": {
                "Who was impersonated?": "Bank Official",
                "How did they contact you?": "Phone and WhatsApp",
                "What message did they convey?": "Account blocked due to KYC",
                "Did you transfer any money?": "Yes",
                "Amount transferred": "30000",
                "What personal details shared?": "Account number and OTP",
                "Have you filed a complaint?": "Yes",
                "evidence_files": [
                    {
                        "filename": "whatsapp_chat.txt",
                        "content": "Sample WhatsApp chat evidence",
                        "type": "text/plain"
                    }
                ]
            },
            "status": "pending",
            "priority": "high"
        },
        {
            "citizenEmail": "ananthakumar0305@gmail.com",
            "fraudType": "Banking Fraud",
            "subType": "Profile Hacking / Identity Theft",
            "details": {
                "Which profile was hacked?": "Internet Banking",
                "When did you notice?": "2024-04-06",
                "What was misused?": "Fund transfer facility",
                "Amount lost": "45000",
                "Have you blocked the account?": "Yes",
                "Police complaint filed?": "Yes",
                "evidence_files": [
                    {
                        "filename": "unauthorized_transaction.txt",
                        "content": "Sample transaction evidence",
                        "type": "text/plain"
                    }
                ]
            },
            "status": "under_investigation",
            "priority": "high"
        },
        # Job Fraud Reports
        {
            "citizenEmail": "ananthakumar0305@gmail.com",
            "fraudType": "Job Fraud",
            "subType": "Online Job Fraud",
            "details": {
                "Your Full Name": "Anantha Kumar",
                "Company Name": "Tech Solutions Inc",
                "Job Position": "Software Developer",
                "How did you find this job?": "LinkedIn",
                "What was the promised salary?": "12 LPA",
                "Did you pay any registration/processing fee?": "Yes",
                "How much did you pay?": "15000",
                "Payment method used": "UPI",
                "Recruiter's contact details": "john.doe@techsolutions.fake",
                "Have you contacted the real company?": "Yes",
                "Did you report to job portal?": "Yes",
                "Any additional details": "The recruiter asked for payment for background verification",
                "evidence_files": [
                    {
                        "filename": "fake_job_offer.txt",
                        "content": read_file_as_base64(evidence_dir / "fake_job_offer.txt"),
                        "type": "text/plain"
                    }
                ]
            },
            "status": "pending",
            "priority": "normal"
        },
        # Online Payment Fraud Reports
        {
            "citizenEmail": "ananthakumar0305@gmail.com",
            "fraudType": "Online Payment Fraud",
            "subType": "UPI Fraud",
            "details": {
                "Your Full Name": "Anantha Kumar",
                "Phone Number Used for UPI": "9876543210",
                "UPI App Name (Google Pay, PhonePe, etc.)": "Google Pay",
                "Transaction ID (if any)": "GPay123456",
                "Date and Time of Fraud": "2024-04-07 15:45:00",
                "Amount Involved": "10000",
                "Fraudster's UPI ID or Phone Number": "fraud@ybl",
                "Brief Description of the Incident": "Received a call claiming to be from Google Pay support",
                "Did you click any suspicious link?": "Yes",
                "Have you already filed a police complaint?": "No",
                "evidence_files": [
                    {
                        "filename": "upi_screenshot.txt",
                        "content": read_file_as_base64(evidence_dir / "upi_screenshot.txt"),
                        "type": "text/plain"
                    }
                ]
            },
            "status": "pending",
            "priority": "high"
        },
        {
            "citizenEmail": "ananthakumar0305@gmail.com",
            "fraudType": "Online Payment Fraud",
            "subType": "Cryptocurrency Fraud",
            "details": {
                "Your Full Name": "Anantha Kumar",
                "Platform/Exchange Name": "CryptoTrade",
                "Type of Crypto Involved (e.g., BTC, ETH)": "Bitcoin",
                "Wallet Address (if known)": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
                "Date and Time of Incident": "2024-04-06 20:30:00",
                "Amount in Crypto or INR": "100000",
                "Did someone ask you to transfer crypto?": "Yes, for high returns",
                "Describe how the fraud happened": "Invested in fake crypto mining scheme",
                "evidence_files": [
                    {
                        "filename": "crypto_transaction.txt",
                        "content": read_file_as_base64(evidence_dir / "crypto_transaction.txt"),
                        "type": "text/plain"
                    }
                ]
            },
            "status": "under_investigation",
            "priority": "high"
        },
        # Other Cyber Crime Reports
        {
            "citizenEmail": "ananthakumar0305@gmail.com",
            "fraudType": "Other",
            "subType": "Cyber Bullying / Stalking / Sexting",
            "details": {
                "Platform where incident occurred": "Instagram",
                "Nature of harassment": "Cyberstalking and threatening messages",
                "Duration of harassment": "2 weeks",
                "Have you blocked the person?": "Yes",
                "Have you reported to platform?": "Yes",
                "Description of incident": "Receiving threatening messages and fake profile creation",
                "evidence_files": [
                    {
                        "filename": "harassment_messages.txt",
                        "content": "Sample threatening messages evidence",
                        "type": "text/plain"
                    }
                ]
            },
            "status": "pending",
            "priority": "high"
        }
    ]
    
    # Submit each test case
    for case in test_cases:
        try:
            response = requests.post(
                'http://localhost:5000/api/submit-report',
                json=case
            )
            result = response.json()
            
            if result.get('success'):
                print(f"\nSuccessfully submitted {case['fraudType']} - {case['subType']} report")
                print(f"Tracking ID: {result['trackingId']}")
            else:
                print(f"\nFailed to submit {case['fraudType']} - {case['subType']} report")
                print(f"Error: {result.get('message')}")
                
        except Exception as e:
            print(f"\nError submitting {case['fraudType']} - {case['subType']} report:")
            print(str(e))

if __name__ == "__main__":
    test_submit_report() 