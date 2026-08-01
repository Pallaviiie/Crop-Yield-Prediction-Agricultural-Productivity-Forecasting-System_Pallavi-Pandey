from pathlib import Path
import pandas as pd

# backend folder
BASE_DIR = Path(__file__).resolve().parent.parent

# backend/datasets
DATASET_DIR = BASE_DIR / "datasets"

crop_df = pd.read_csv(DATASET_DIR / "crop_yield.csv")
soil_df = pd.read_csv(DATASET_DIR / "soil.csv")
rainfall_df = pd.read_csv(DATASET_DIR / "rainfall.csv")
temperature_df = pd.read_csv(DATASET_DIR / "temperature.csv")
pesticide_df = pd.read_csv(DATASET_DIR / "pesticides.csv")