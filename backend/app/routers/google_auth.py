import os

import requests
from dotenv import load_dotenv

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import create_access_token
from app.database.db import get_db
from app.models.user import User


load_dotenv()

router = APIRouter(
    prefix="/auth",
    tags=["Google Authentication"]
)


@router.post("/google")
def google_login(
    data: dict,
    db: Session = Depends(get_db)
):
    access_token = data.get("access_token")
    selected_role = data.get("role", "farmer")

    if not access_token:
        raise HTTPException(
            status_code=400,
            detail="Google access token is required."
        )

    if selected_role not in ["farmer", "consultant"]:
        raise HTTPException(
            status_code=400,
            detail="Google login is available only for farmers and consultants."
        )

    # --------------------------------------------------------
    # Verify Google access token
    # --------------------------------------------------------

    try:
        google_response = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={
                "Authorization": f"Bearer {access_token}"
            },
            timeout=10
        )

    except requests.RequestException:
        raise HTTPException(
            status_code=503,
            detail="Unable to contact Google authentication service."
        )

    if google_response.status_code != 200:
        raise HTTPException(
            status_code=401,
            detail="Invalid Google access token."
        )

    google_user = google_response.json()

    email = google_user.get("email")
    full_name = google_user.get("name") or google_user.get("given_name")
    google_id = google_user.get("sub")

    if not email:
        raise HTTPException(
            status_code=400,
            detail="Google account email could not be retrieved."
        )

    if not google_id:
        raise HTTPException(
            status_code=400,
            detail="Google account ID could not be retrieved."
        )

    # --------------------------------------------------------
    # Find existing user
    # --------------------------------------------------------

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    # --------------------------------------------------------
    # Create user if doesn't exist
    # --------------------------------------------------------

    if not user:

        user = User(
            full_name=full_name or "Google User",
            email=email,
            role=selected_role,
            phone=None,
            city=None,
            district=None,
            state=None,
            country="India",
        )

        db.add(user)
        db.commit()
        db.refresh(user)

    else:

        # Don't allow someone to change an existing account's
        # role simply by selecting another role during login.
        selected_role = user.role

    # --------------------------------------------------------
    # Create JWT
    # --------------------------------------------------------

    jwt_token = create_access_token(
        {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
        }
    )

    return {
        "access_token": jwt_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
        }
    }