import os
import uuid
import random

from datetime import datetime, timedelta, timezone
from pydantic import BaseModel, EmailStr

from app.models.password_reset import PasswordReset
from app.utils.email import send_password_reset_otp

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    status,
)

from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials,
)

from jose import (
    JWTError,
    jwt,
)

from passlib.context import CryptContext

from sqlalchemy.orm import Session

from app.database.db import get_db

from app.models.user import User

from app.schemas.user import (
    UserLogin,
    UserRegister,
)
from app.utils.activity_logger import log_activity

# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)
# ============================================================
# PASSWORD RESET SCHEMAS
# ============================================================

class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class VerifyResetOTPRequest(BaseModel):
    email: EmailStr
    otp: str


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

# ============================================================
# JWT CONFIGURATION
# ============================================================

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "yieldsense-development-secret-key-change-this",
)

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24


# ============================================================
# PASSWORD HASHING
# ============================================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


def hash_password(password: str) -> str:

    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:

    return pwd_context.verify(
        plain_password,
        hashed_password,
    )


# ============================================================
# JWT
# ============================================================

def create_access_token(
    data: dict,
    expires_delta: timedelta | None = None,
):

    to_encode = data.copy()

    if expires_delta:

        expire = (
            datetime.now(timezone.utc)
            + expires_delta
        )

    else:

        expire = (
            datetime.now(timezone.utc)
            + timedelta(
                minutes=ACCESS_TOKEN_EXPIRE_MINUTES
            )
        )

    to_encode.update(
        {
            "exp": expire,
        }
    )

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )

    return encoded_jwt


# ============================================================
# HTTP BEARER
# ============================================================

security = HTTPBearer()


# ============================================================
# AUTHENTICATED USER
# ============================================================

def get_authenticated_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    ),
    db: Session = Depends(get_db),
):

    token = credentials.credentials

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate authentication credentials",
        headers={
            "WWW-Authenticate": "Bearer",
        },
    )

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        user_id = payload.get("sub")

        if user_id is None:
            raise credentials_exception

        try:

            user_id = int(user_id)

        except (
            TypeError,
            ValueError,
        ):

            raise credentials_exception

    except JWTError:

        raise credentials_exception

    user = (
        db.query(User)
        .filter(
            User.id == user_id
        )
        .first()
    )

    if user is None:

        raise credentials_exception

    return user


# ============================================================
# USER RESPONSE
# ============================================================

def user_response(user: User):

    return {

        "id": user.id,

        "full_name": user.full_name,

        "email": user.email,

        "role": user.role,

        "phone": getattr(
            user,
            "phone",
            None,
        ),

        "location": getattr(
            user,
            "location",
            None,
        ),

        "state": getattr(
            user,
            "state",
            None,
        ),

        "country": getattr(
            user,
            "country",
            None,
        ),
        "city": getattr(
            user,
           "city",
           None,
        ),

        "district": getattr(
            user,
            "district",
            None,
        ),

        "license_number": getattr(
            user,
            "license_number",
            None,
        ),
        "specialization": getattr(
            user,
           "specialization",
           None,
       ),

       "experience": getattr(
           user,
           "experience",
           None,
        ),

        "qualification": getattr(
            user,
           "qualification",
            None,
        ),

        "farm_location": getattr(
            user,
            "farm_location",
            None,
        ),

        "farm_size": getattr(
            user,
            "farm_size",
            None,
        ),

        "soil_type": getattr(
            user,
            "soil_type",
            None,
        ),

        "primary_crops": getattr(
            user,
            "primary_crops",
            None,
        ),

        "profile_image": getattr(
            user,
            "profile_image",
            None,
        ),

        "created_at": getattr(
            user,
            "created_at",
            None,
        ),

    }


# ============================================================
# REGISTER
# ============================================================

@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
)
def register_user(
    user_data: UserRegister,
    db: Session = Depends(get_db),
):

    full_name = user_data.get(
        "full_name",
        "",
    ).strip()

    email = user_data.get(
        "email",
        "",
    ).strip().lower()

    password = user_data.get(
        "password",
        "",
    )

    role = user_data.get(
        "role",
        "farmer",
    )

    # --------------------------------------------------------
    # VALIDATION
    # --------------------------------------------------------

    if not full_name:

        raise HTTPException(
            status_code=400,
            detail="Full name is required.",
        )

    if not email:

        raise HTTPException(
            status_code=400,
            detail="Email is required.",
        )

    if not password:

        raise HTTPException(
            status_code=400,
            detail="Password is required.",
        )

    if role not in [
        "farmer",
        "consultant",
    ]:

        raise HTTPException(
            status_code=400,
            detail="Invalid role.",
        )

    # --------------------------------------------------------
    # EXISTING USER
    # --------------------------------------------------------

    existing_user = (
        db.query(User)
        .filter(
            User.email == email
        )
        .first()
    )

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered.",
        )

    # --------------------------------------------------------
    # CREATE USER
    # --------------------------------------------------------

    new_user = User(

        full_name=full_name,

        email=email,

        password_hash=hash_password(
            password
        ),

        role=role,

        phone=user_data.get(
            "phone"
        ),

        location=user_data.get(
            "location"
        ),

        state=user_data.get(
            "state"
        ),

        country=user_data.get(
            "country",
            "India",
        ),
        license_number=user_data.get("license_number"),

        city=user_data.get("city"),

        district=user_data.get("district"),
        farm_location=user_data.get(
            "farm_location"
        ),

        farm_size=user_data.get(
            "farm_size"
        ),

        soil_type=user_data.get(
            "soil_type"
        ),

        primary_crops=user_data.get(
            "primary_crops"
        ),
        specialization=user_data.get("specialization"),
        experience=user_data.get("experience"),
        qualification=user_data.get("qualification"),

    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    log_activity(
       db=db,
       action=f"New {new_user.role} registered",
       actor=new_user,
       details=new_user.email,
       log_type="success",
    )

    return user_response(
        new_user
    )


# ============================================================
# LOGIN
# ============================================================

@router.post("/login")
def login_user(
    login_data: UserLogin,
    db: Session = Depends(get_db),
):

    print("\n==============================")
    print("LOGIN REQUEST")
    print("==============================")

    email = login_data.email.strip().lower()

    password = login_data.password

    print("Email:", email)

    # --------------------------------------------------------
    # FIND USER
    # --------------------------------------------------------

    user = (
        db.query(User)
        .filter(
            User.email == email
        )
        .first()
    )

    if user is None:

        print("USER NOT FOUND")

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    print(
        "User found:",
        user.id,
    )

    print(
        "Role:",
        user.role,
    )

    # --------------------------------------------------------
    # PASSWORD
    # --------------------------------------------------------

    if not verify_password(
        password,
        user.password_hash,
    ):

        print(
            "PASSWORD VERIFICATION FAILED"
        )
        log_activity(
            db=db,
            action="Failed login attempt",
            actor_name=user.email,
            actor_role=user.role,
            details="Invalid password",
            log_type="warning",
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    print(
        "PASSWORD VERIFIED"
    )

    # --------------------------------------------------------
    # CREATE JWT
    # --------------------------------------------------------

    access_token = create_access_token(

        data={

            "sub": str(
                user.id
            ),

            "email": user.email,

            "role": user.role,

        }

    )
    log_activity(
       db=db,
       action="User logged in",
       actor=user,
       details=user.email,
       log_type="success",
    )

    print(
        "JWT CREATED"
    )

    print(
        "LOGIN SUCCESS"
    )
    log_activity(
        db=db,
        action="User logged in",
        actor=user,
        details=user.email,
        log_type="success",
    )

    print("==============================\n")

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return {

        "access_token": access_token,

        "token_type": "bearer",

        "user": user_response(
            user
        ),

    }

# ============================================================
# FORGOT PASSWORD
# ============================================================

@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):

    email = request.email.lower().strip()

    # --------------------------------------------------------
    # FIND USER
    # --------------------------------------------------------

    user = (
        db.query(User)
        .filter(
            User.email == email
        )
        .first()
    )

    # --------------------------------------------------------
    # GENERIC RESPONSE
    # --------------------------------------------------------
    # We don't reveal whether an email exists.

    if user is None:

        return {
            "message": (
                "If an account exists with this email, "
                "a password reset OTP has been sent."
            )
        }

    # --------------------------------------------------------
    # DELETE OLD OTPs
    # --------------------------------------------------------

    db.query(PasswordReset).filter(
        PasswordReset.email == email
    ).delete(
        synchronize_session=False
    )

    # --------------------------------------------------------
    # GENERATE 6-DIGIT OTP
    # --------------------------------------------------------

    otp = str(
        random.randint(
            100000,
            999999,
        )
    )

    # --------------------------------------------------------
    # OTP EXPIRATION
    # --------------------------------------------------------

    expires_at = (
        datetime.utcnow()
        + timedelta(minutes=10)
    )

    # --------------------------------------------------------
    # SAVE OTP
    # --------------------------------------------------------

    reset_request = PasswordReset(
        email=email,
        otp=otp,
        expires_at=expires_at,
    )

    db.add(reset_request)
    db.commit()

    # --------------------------------------------------------
    # SEND EMAIL
    # --------------------------------------------------------

    try:

        send_password_reset_otp(
            email,
            otp,
        )

    except Exception as exc:

        print(
            "PASSWORD RESET EMAIL ERROR:",
            exc,
        )

        db.delete(reset_request)
        db.commit()

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to send password reset email. "
                "Please try again later."
            ),
        )

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return {
        "message": (
            "If an account exists with this email, "
            "a password reset OTP has been sent."
        )
    }


# ============================================================
# VERIFY RESET OTP
# ============================================================

@router.post("/verify-reset-otp")
def verify_reset_otp(
    request: VerifyResetOTPRequest,
    db: Session = Depends(get_db),
):

    email = request.email.lower().strip()

    otp = request.otp.strip()

    # --------------------------------------------------------
    # OTP FORMAT
    # --------------------------------------------------------

    if not otp.isdigit() or len(otp) != 6:

        raise HTTPException(
            status_code=400,
            detail="OTP must contain exactly 6 digits.",
        )

    # --------------------------------------------------------
    # FIND OTP
    # --------------------------------------------------------

    reset_request = (
        db.query(PasswordReset)
        .filter(
            PasswordReset.email == email,
            PasswordReset.otp == otp,
        )
        .order_by(
            PasswordReset.created_at.desc()
        )
        .first()
    )

    if reset_request is None:

        raise HTTPException(
            status_code=400,
            detail="Invalid OTP.",
        )

    # --------------------------------------------------------
    # CHECK EXPIRATION
    # --------------------------------------------------------

    if (
        datetime.utcnow()
        > reset_request.expires_at
    ):

        db.delete(reset_request)
        db.commit()

        raise HTTPException(
            status_code=400,
            detail=(
                "OTP has expired. "
                "Please request a new OTP."
            ),
        )

    return {
        "message": "OTP verified successfully."
    }


# ============================================================
# RESET PASSWORD
# ============================================================

@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db),
):

    email = request.email.lower().strip()

    otp = request.otp.strip()

    new_password = request.new_password

    # --------------------------------------------------------
    # PASSWORD VALIDATION
    # --------------------------------------------------------

    if len(new_password) < 8:

        raise HTTPException(
            status_code=400,
            detail=(
                "Password must contain at least 8 characters."
            ),
        )

    # --------------------------------------------------------
    # OTP FORMAT
    # --------------------------------------------------------

    if not otp.isdigit() or len(otp) != 6:

        raise HTTPException(
            status_code=400,
            detail="OTP must contain exactly 6 digits.",
        )

    # --------------------------------------------------------
    # FIND USER
    # --------------------------------------------------------

    user = (
        db.query(User)
        .filter(
            User.email == email
        )
        .first()
    )

    if user is None:

        raise HTTPException(
            status_code=400,
            detail="Unable to reset password.",
        )

    # --------------------------------------------------------
    # FIND OTP
    # --------------------------------------------------------

    reset_request = (
        db.query(PasswordReset)
        .filter(
            PasswordReset.email == email,
            PasswordReset.otp == otp,
        )
        .order_by(
            PasswordReset.created_at.desc()
        )
        .first()
    )

    if reset_request is None:

        raise HTTPException(
            status_code=400,
            detail="Invalid OTP.",
        )

    # --------------------------------------------------------
    # CHECK EXPIRATION
    # --------------------------------------------------------

    if (
        datetime.utcnow()
        > reset_request.expires_at
    ):

        db.delete(reset_request)
        db.commit()

        raise HTTPException(
            status_code=400,
            detail=(
                "OTP has expired. "
                "Please request a new OTP."
            ),
        )

    # --------------------------------------------------------
    # UPDATE PASSWORD
    # --------------------------------------------------------

    user.password_hash = hash_password(
        new_password
    )

    # --------------------------------------------------------
    # DELETE USED OTP
    # --------------------------------------------------------

    db.delete(reset_request)

    db.commit()

    db.refresh(user)

    # --------------------------------------------------------
    # ACTIVITY LOG
    # --------------------------------------------------------

    return {
        "message": (
            "Password reset successfully. "
            "You can now sign in with your new password."
        )
    }

# ============================================================
# CURRENT USER
# ============================================================

@router.get("/me")
def get_me(
    current_user: User = Depends(
        get_authenticated_user
    ),
):

    return user_response(
        current_user
    )


# ============================================================
# UPDATE CURRENT USER
# ============================================================

@router.put("/me")
def update_me(

    user_data: dict,

    db: Session = Depends(
        get_db
    ),

    current_user: User = Depends(
        get_authenticated_user
    ),

):

    allowed_fields = [

        "full_name",

        "phone",

        "location",

        "state",

        "country",

        "specialization",

        "experience",

        "qualification",

        "farm_location",

        "farm_size",

        "soil_type",

        "primary_crops",

    ]

    for field in allowed_fields:

        if field in user_data:

            value = user_data[field]

            if isinstance(
                value,
                str,
            ):

                value = value.strip()

            setattr(
                current_user,
                field,
                value,
            )

    db.commit()

    db.refresh(
        current_user
    )
    log_activity(
        db=db,
        action="Profile updated",
        actor=current_user,
        details="Account information updated",
        log_type="info",
    )

    return user_response(
        current_user
    )


# ============================================================
# PROFILE IMAGE
# ============================================================

BASE_DIR = os.path.abspath(

    os.path.join(

        os.path.dirname(__file__),

        "..",

        "..",

    )

)

UPLOAD_DIR = os.path.join(

    BASE_DIR,

    "uploads",

    "profiles",

)

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True,
)


@router.post("/profile-image")
async def upload_profile_image(

    file: UploadFile = File(...),

    db: Session = Depends(
        get_db
    ),

    current_user: User = Depends(
        get_authenticated_user
    ),

):

    allowed_types = {

        "image/jpeg",

        "image/jpg",

        "image/png",

        "image/webp",

    }

    if file.content_type not in allowed_types:

        raise HTTPException(

            status_code=400,

            detail=(
                "Only JPG, JPEG, PNG "
                "and WEBP images are allowed."
            ),

        )

    contents = await file.read()

    max_size = 5 * 1024 * 1024

    if len(contents) > max_size:

        raise HTTPException(

            status_code=400,

            detail=(
                "Profile image must be "
                "smaller than 5 MB."
            ),

        )

    extension_map = {

        "image/jpeg": ".jpg",

        "image/jpg": ".jpg",

        "image/png": ".png",

        "image/webp": ".webp",

    }

    extension = extension_map.get(

        file.content_type,

        ".jpg",

    )

    filename = (

        f"user_{current_user.id}_"

        f"{uuid.uuid4().hex}"

        f"{extension}"

    )

    filepath = os.path.join(

        UPLOAD_DIR,

        filename,

    )

    with open(
        filepath,
        "wb",
    ) as buffer:

        buffer.write(
            contents
        )

    # --------------------------------------------------------
    # DELETE OLD IMAGE
    # --------------------------------------------------------

    old_image = getattr(

        current_user,

        "profile_image",

        None,

    )

    if old_image:

        old_filename = os.path.basename(
            old_image
        )

        old_filepath = os.path.join(

            UPLOAD_DIR,

            old_filename,

        )

        if os.path.exists(
            old_filepath
        ):

            try:

                os.remove(
                    old_filepath
                )

            except OSError:

                pass

    # --------------------------------------------------------
    # SAVE IMAGE URL
    # --------------------------------------------------------

    current_user.profile_image = (

        f"/uploads/profiles/{filename}"

    )

    db.commit()

    db.refresh(
        current_user
    )

    return user_response(
        current_user
    )
# ============================================================
# DELETE PROFILE IMAGE
# ============================================================

@router.delete("/profile-image")
def delete_profile_image(

    db: Session = Depends(
        get_db
    ),

    current_user: User = Depends(
        get_authenticated_user
    ),

):

    # --------------------------------------------------------
    # GET CURRENT IMAGE
    # --------------------------------------------------------

    current_image = getattr(
        current_user,
        "profile_image",
        None,
    )

    # --------------------------------------------------------
    # DELETE PHYSICAL IMAGE FILE
    # --------------------------------------------------------

    if current_image:

        filename = os.path.basename(
            current_image
        )

        filepath = os.path.join(
            UPLOAD_DIR,
            filename,
        )

        if os.path.exists(filepath):

            try:

                os.remove(filepath)

            except OSError as e:

                print(
                    "Could not delete profile image file:",
                    e,
                )

    # --------------------------------------------------------
    # REMOVE IMAGE FROM DATABASE
    # --------------------------------------------------------

    current_user.profile_image = None

    db.commit()

    db.refresh(
        current_user
    )

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return user_response(
        current_user
    )