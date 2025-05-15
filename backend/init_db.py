from app import app, db, User, Report
import os

def init_database():
    print("Starting database initialization...")
    
    with app.app_context():
        # Drop all tables
        db.drop_all()
        print("Dropped existing tables")
        
        # Create all tables with new schema
        db.create_all()
        print("Created tables with new schema")
        
        # Create a test admin user
        from werkzeug.security import generate_password_hash
        admin_user = User(
            name="Admin User",
            email="admin@example.com",
            password=generate_password_hash("admin123"),
            role="admin",
            admin_code="admin123"
        )
        db.session.add(admin_user)
        
        # Create a test citizen user
        citizen_user = User(
            name="Test Citizen",
            email="citizen@example.com",
            password=generate_password_hash("citizen123"),
            role="Citizen"
        )
        db.session.add(citizen_user)
        
        db.session.commit()
        print("Created test users")
        
        # Set proper file permissions
        try:
            os.chmod('cyber_crime.db', 0o666)
            print("Database file permissions set")
        except Exception as e:
            print(f"Warning: Could not set file permissions: {e}")
        
        print("Database initialization complete!")
        print("Note: The database has been reset with the new schema")

if __name__ == "__main__":
    init_database() 