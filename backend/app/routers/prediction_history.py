from fastapi import APIRouter

router = APIRouter(
    prefix="/history",
    tags=["Prediction History"]
)


@router.get("/")
def get_history():
    return {"message": "Prediction History API Working"}