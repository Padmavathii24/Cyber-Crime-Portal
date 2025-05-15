from app import app, db, Report
from datetime import datetime
import os
import logging

# Set up SQL logging
logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

def test_database_operations():
    print("\n=== Testing Database Operations ===")
    
    # Print database path
    db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'cyber_crime.db')
    print(f"\nDatabase path: {db_path}")
    print(f"Database exists: {os.path.exists(db_path)}")
    
    # Print table names
    print("\nAvailable tables:")
    with app.app_context():
        inspector = db.inspect(db.engine)
        for table_name in inspector.get_table_names():
            print(f"- {table_name}")
    
    # Test data
    test_report = {
        'tracking_id': 'TEST123',
        'citizen_email': 'test@example.com',
        'fraud_type': 'Test Fraud',
        'sub_type': 'Test Subtype',
        'details': {'test': 'data'},
        'status': 'pending',
        'date_submitted': datetime.utcnow()
    }
    
    try:
        # Create test report
        print("\n1. Creating test report...")
        print(f"Test data: {test_report}")
        new_report = Report(**test_report)
        db.session.add(new_report)
        db.session.commit()
        print("✓ Report created successfully")
        
        # Verify all reports in database
        print("\nAll reports in database:")
        all_reports = Report.query.all()
        for report in all_reports:
            print(f"- {report.to_dict()}")
        
        # Fetch the specific test report
        print("\n2. Fetching test report...")
        fetched_report = Report.query.filter_by(tracking_id='TEST123').first()
        if fetched_report:
            print("✓ Report found in database")
            print(f"Report details: {fetched_report.to_dict()}")
        else:
            print("✗ Report not found in database")
        
        # Clean up
        print("\n3. Cleaning up test data...")
        if fetched_report:
            db.session.delete(fetched_report)
            db.session.commit()
            print("✓ Test data cleaned up")
        
        # Verify cleanup
        remaining_reports = Report.query.all()
        print(f"\nRemaining reports in database: {len(remaining_reports)}")
        
    except Exception as e:
        print(f"\n✗ Error during testing: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        import traceback
        print("Traceback:")
        print(traceback.format_exc())
        db.session.rollback()
    
    print("\n=== Test Complete ===\n")

if __name__ == '__main__':
    with app.app_context():
        test_database_operations()