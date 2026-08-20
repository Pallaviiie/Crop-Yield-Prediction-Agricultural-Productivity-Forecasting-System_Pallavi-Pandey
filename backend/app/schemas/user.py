from datetime import datetime
from typing import Optional, Literal

from pydantic import (
    BaseModel,
    EmailStr,
    Field,
    ConfigDict,
)


# ============================================================
# REGISTER
# ============================================================

class UserRegister(BaseModel):

    full_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    email: EmailStr

    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
    )

    phone: Optional[str] = None

    role: Literal[
        "farmer",
        "consultant",
        "admin",
    ] = "farmer"

    city: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None

    country: Optional[str] = "India"

    farm_location: Optional[str] = None

    farm_size: Optional[float] = Field(
        None,
        gt=0,
    )

    soil_type: Optional[str] = None

    primary_crop: Optional[str] = None

    specialization: Optional[str] = None
    experience: Optional[str] = None
    qualification: Optional[str] = None
    license_number: Optional[str] = None


# ============================================================
# LOGIN
# ============================================================

class UserLogin(BaseModel):

    email: EmailStr

    password: str = Field(
        ...,
        min_length=1,
        max_length=128,
    )


# ============================================================
# USER RESPONSE
# ============================================================

class UserResponse(BaseModel):

    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int

    full_name: Optional[str] = None

    email: EmailStr

    role: str


# ============================================================
# PROFILE UPDATE
# ============================================================

class UserProfileUpdate(BaseModel):

    full_name: Optional[str] = None

    phone: Optional[str] = None

    city: Optional[str] = None

    district: Optional[str] = None

    state: Optional[str] = None

    village: Optional[str] = None

    country: Optional[str] = None

    farm_location: Optional[str] = None

    farm_size: Optional[float] = Field(
        None,
        gt=0,
    )

    farm_size_unit: Optional[str] = None

    primary_crop: Optional[str] = None

    soil_type: Optional[str] = None

    farming_experience: Optional[int] = Field(
        None,
        ge=0,
    )

    irrigation_type: Optional[str] = None


# ============================================================
# PROFILE RESPONSE
# ============================================================

class UserProfileResponse(BaseModel):

    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int

    full_name: Optional[str] = None

    email: EmailStr

    role: str

    phone: Optional[str] = None

    mobile_number: Optional[str] = None

    city: Optional[str] = None

    district: Optional[str] = None

    state: Optional[str] = None

    village: Optional[str] = None

    country: Optional[str] = None

    farm_location: Optional[str] = None

    farm_size: Optional[float] = None

    farm_size_unit: Optional[str] = None

    primary_crop: Optional[str] = None

    primary_crops: Optional[str] = None

    soil_type: Optional[str] = None

    farming_experience: Optional[int] = None

    irrigation_type: Optional[str] = None

    created_at: Optional[datetime] = None

    updated_at: Optional[datetime] = None