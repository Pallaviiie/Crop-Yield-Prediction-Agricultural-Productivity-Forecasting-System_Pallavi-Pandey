from app.database.db import engine, Base

from app.models.prediction_review import PredictionReview

print("Creating prediction_reviews table...")

Base.metadata.create_all(
    bind=engine,
    tables=[
        PredictionReview.__table__
    ],
)

print("Done.")