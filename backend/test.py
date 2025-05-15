from app import app, db, User
from tabulate import tabulate

def view_users():
    with app.app_context():
        users = User.query.all()
        
        # Create a list of user data for tabulation
        user_data = []
        for user in users:
            # Get only first 20 chars of hashed password for readability
            short_hash = user.password[:20] + "..." if user.password else ""
            
            user_data.append([
                user.email,
                user.role,
                short_hash,
                user.badge_id or "N/A",
                user.admin_code or "N/A"
            ])

        # Print table using tabulate
        headers = ["Email", "Role", "Password Hash (truncated)", "Badge ID", "Admin Code"]
        print("\nUsers in Database:")
        print(tabulate(user_data, headers=headers, tablefmt="grid"))

if __name__ == "__main__":
    view_users()