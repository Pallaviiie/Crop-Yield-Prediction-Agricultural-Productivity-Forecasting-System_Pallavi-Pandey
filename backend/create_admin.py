from app.database.db import SessionLocal
from app.models.user import User
from app.utils.security import hash_password


ADMIN_NAME = "YieldSense Admin"
ADMIN_EMAIL = "admin@yieldsense.com"
ADMIN_PASSWORD = "Admin@123456"


db = SessionLocal()

try:
    existing_admin = (
        db.query(User)
        .filter(User.email == ADMIN_EMAIL)
        .first()
    )

    if existing_admin:
        print("Admin already exists.")

    else:
        admin = User(
            full_name=ADMIN_NAME,
            email=ADMIN_EMAIL,
            password=hash_password(ADMIN_PASSWORD),
            role="admin"
        )

        db.add(admin)
        db.commit()
        db.refresh(admin)

        print("Admin created successfully.")
        print("Admin ID:", admin.id)

finally:
    db.close()