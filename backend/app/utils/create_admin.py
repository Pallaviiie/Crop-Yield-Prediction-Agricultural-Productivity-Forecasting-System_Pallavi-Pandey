from app.database.db import SessionLocal

# ============================================================
# IMPORT ALL RELATED MODELS FIRST
# This prevents SQLAlchemy relationship mapper errors.
# ============================================================
from app.models.conversation import Conversation
from app.models.message import Message
from app.models.prediction_history import PredictionHistory
from app.models.admin_dataset import AdminDataset
from app.models.user import User

from app.routers.users import hash_password


# ============================================================
# ADMIN DETAILS
# ============================================================

ADMIN_NAME = "Admin User"
ADMIN_EMAIL = "admin@yieldsense.ai"
ADMIN_PASSWORD = "Admin@12345"


# ============================================================
# CREATE / UPDATE ADMIN
# ============================================================

def main():

    db = SessionLocal()

    try:

        # --------------------------------------------------------
        # Check whether admin already exists
        # --------------------------------------------------------

        existing_admin = (
            db.query(User)
            .filter(User.email == ADMIN_EMAIL)
            .first()
        )

        # ========================================================
        # UPDATE EXISTING ADMIN
        # ========================================================

        if existing_admin:

            existing_admin.full_name = ADMIN_NAME
            existing_admin.role = "admin"
            existing_admin.password_hash = hash_password(
                ADMIN_PASSWORD
            )

            # These fields exist in your User model
            existing_admin.country = "India"

            db.commit()

            print()
            print("Admin account updated successfully.")

        # ========================================================
        # CREATE NEW ADMIN
        # ========================================================

        else:

            admin = User(
                full_name=ADMIN_NAME,
                email=ADMIN_EMAIL,
                password_hash=hash_password(ADMIN_PASSWORD),
                role="admin",
                country="India",
            )

            db.add(admin)
            db.commit()
            db.refresh(admin)

            print()
            print("Admin account created successfully.")

        # ========================================================
        # LOGIN INFORMATION
        # ========================================================

        print()
        print("================================")
        print("         ADMIN LOGIN")
        print("================================")
        print(f"Email    : {ADMIN_EMAIL}")
        print(f"Password : {ADMIN_PASSWORD}")
        print("Role     : admin")
        print("================================")
        print()

    except Exception as e:

        db.rollback()

        print()
        print("Error creating admin:")
        print(e)
        print()

    finally:

        db.close()


# ============================================================
# RUN SCRIPT
# ============================================================

if __name__ == "__main__":
    main()