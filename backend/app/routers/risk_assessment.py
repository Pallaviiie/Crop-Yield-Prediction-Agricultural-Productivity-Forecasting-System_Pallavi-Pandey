from fastapi import APIRouter
from pydantic import BaseModel

from app.services.risk_assessment_service import calculate_risk_assessment


router = APIRouter(
    prefix="/risk-assessment",
    tags=["Risk Assessment"]
)


class RiskAssessmentRequest(BaseModel):
    rainfall: float = 0
    temperature: float = 0
    soil_ph: float = 0
    fertilizer: float = 0
    pesticide: float = 0


@router.post("/")
def assess_farm_risk(data: RiskAssessmentRequest):

    return calculate_risk_assessment(data.model_dump())