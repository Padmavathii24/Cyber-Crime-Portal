from app import app, db, User, Report
from datetime import datetime

def test_database_persistence():
    print("\n=== Testing Database Persistence ===")
    
    with app.app_context():
        # 1. Count existing records
        print("\n1. Current Database State:")
        user_count = User.query.count()
        report_count = Report.query.count()
        print(f"- Existing Users: {user_count}")
        print(f"- Existing Reports: {report_count}")
        
        # 2. Add test data
        print("\n2. Adding Test Data:")
        
        # Add test user if not exists
        test_email = "test@persistence.com"
        if not User.query.filter_by(email=test_email).first():
            test_user = User(
                email=test_email,
                password="test123",
                role="citizen"
            )
            db.session.add(test_user)
            print("- Added test user")
        
        # Add test report
        test_report = Report(
            tracking_id=f"TEST{datetime.now().strftime('%H%M%S')}",
            citizen_email=test_email,
            fraud_type="Test Fraud",
            sub_type="Persistence Test",
            details={"test": "data"},
            status="pending",
            date_submitted=datetime.utcnow()
        )
        db.session.add(test_report)
        print("- Added test report")
        
        # Commit changes
        db.session.commit()
        print("- Changes committed to database")
        
        # 3. Verify data was added
        print("\n3. Updated Database State:")
        new_user_count = User.query.count()
        new_report_count = Report.query.count()
        print(f"- Total Users: {new_user_count} (Added: {new_user_count - user_count})")
        print(f"- Total Reports: {new_report_count} (Added: {new_report_count - report_count})")
        
        # 4. Print some report details
        print("\n4. Recent Reports:")
        reports = Report.query.order_by(Report.date_submitted.desc()).limit(5).all()
        for report in reports:
            print(f"- {report.tracking_id}: {report.fraud_type} ({report.status})")
    
    print("\n=== Test Complete ===")
    print("Now you can restart the server to verify data persistence!")

if __name__ == '__main__':
    test_database_persistence() 