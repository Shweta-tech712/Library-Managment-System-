from app import create_app
from extensions import db
from models.user import User

def seed():
    app = create_app()
    with app.app_context():
        # Check if admin exists
        admin = User.query.filter_by(role="admin").first()
        if not admin:
            admin = User(
                name="System Admin",
                email="admin@college.com",
                role="admin"
            )
            admin.set_password("admin123")
            db.session.add(admin)
            db.session.commit()
            print("✅ Admin user created: admin@college.com / admin123")
        else:
            print("ℹ️ Admin user already exists.")

if __name__ == "__main__":
    seed()
