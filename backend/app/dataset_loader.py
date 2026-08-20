import os
import pandas as pd


BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

DATASET_DIR = os.path.join(
    BASE_DIR,
    "datasets"
)


def load_dataset(filename):
    file_path = os.path.join(DATASET_DIR, filename)

    if not os.path.exists(file_path):
        print(f"WARNING: Dataset not found: {file_path}")
        return pd.DataFrame()

    try:
        df = pd.read_csv(file_path)

        print(
            f"Loaded {filename} successfully "
            f"({len(df)} rows)"
        )

        return df

    except Exception as error:
        print(
            f"Error loading {filename}: {error}"
        )
        return pd.DataFrame()


# ==========================================
# LOAD ALL DATASETS
# ==========================================

crop_df = load_dataset("crop_yield.csv")

soil_df = load_dataset("soil.csv")

rainfall_df = load_dataset("rainfall.csv")

temperature_df = load_dataset("temperature.csv")

pesticide_df = load_dataset("pesticides.csv")