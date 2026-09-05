import os
import pandas as pd

from app.database.db import SessionLocal
from app.models.admin_dataset import AdminDataset


# ============================================================
# PATHS
# ============================================================

# backend/
#   app/
#   datasets/
#
# Therefore we go:
# app/utils/sync_admin_datasets.py
#                  ↓
# app/utils
#                  ↓
# app
#                  ↓
# backend
BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

DATASET_DIR = os.path.join(BASE_DIR, "datasets")


# ============================================================
# DATASET CONFIGURATION
# ============================================================

DATASETS = [
    {
        "filename": "crop_yield.csv",
        "name": "Crop Yield",
        "description": "Crop yield dataset used for agricultural yield prediction.",
    },
    {
        "filename": "pesticides.csv",
        "name": "Pesticides",
        "description": "Pesticide usage dataset used for agricultural analysis.",
    },
    {
        "filename": "rainfall.csv",
        "name": "Rainfall",
        "description": "Rainfall dataset used for weather and agricultural analysis.",
    },
    {
        "filename": "temperature.csv",
        "name": "Temperature",
        "description": "Temperature dataset used for weather and crop analysis.",
    },
    {
        "filename": "soil.csv",
        "name": "Soil",
        "description": "Soil dataset used for soil health and crop analysis.",
    },
]


# ============================================================
# SYNC FUNCTION
# ============================================================

def sync_datasets():
    db = SessionLocal()

    try:
        print("\n========================================")
        print("       YIELDSENSE DATASET SYNC")
        print("========================================\n")

        synced_count = 0

        for dataset_info in DATASETS:

            filename = dataset_info["filename"]
            dataset_name = dataset_info["name"]
            description = dataset_info["description"]

            file_path = os.path.join(DATASET_DIR, filename)

            print(f"Processing: {filename}")

            # ------------------------------------------------
            # CHECK FILE
            # ------------------------------------------------

            if not os.path.exists(file_path):
                print(f"  ❌ File not found: {file_path}")
                continue

            try:
                # ------------------------------------------------
                # READ CSV
                # ------------------------------------------------

                df = pd.read_csv(file_path)

                record_count = len(df)
                column_count = len(df.columns)

                print(f"  Records : {record_count:,}")
                print(f"  Columns : {column_count}")

                # ------------------------------------------------
                # CHECK IF DATASET ALREADY EXISTS
                # ------------------------------------------------

                existing_dataset = (
                    db.query(AdminDataset)
                    .filter(AdminDataset.name == dataset_name)
                    .first()
                )

                if existing_dataset:

                    # Update existing dataset
                    existing_dataset.type = "CSV"
                    existing_dataset.description = description
                    existing_dataset.records = record_count
                    existing_dataset.columns = column_count
                    existing_dataset.status = "Active"

                    print("  ✅ Existing dataset updated.")

                else:

                    # Create new dataset
                    new_dataset = AdminDataset(
                        name=dataset_name,
                        type="CSV",
                        description=description,
                        records=record_count,
                        columns=column_count,
                        status="Active",
                    )

                    db.add(new_dataset)

                    print("  ✅ New dataset added.")

                synced_count += 1

            except Exception as e:
                print(f"  ❌ Error reading {filename}: {e}")

        # --------------------------------------------------------
        # SAVE CHANGES
        # --------------------------------------------------------

        db.commit()

        print("\n========================================")
        print(f"Successfully synced: {synced_count}/5 datasets")
        print("========================================\n")

        # --------------------------------------------------------
        # SHOW DATABASE DATA
        # --------------------------------------------------------

        datasets = (
            db.query(AdminDataset)
            .order_by(AdminDataset.id)
            .all()
        )

        print("Datasets currently registered in database:\n")

        for dataset in datasets:
            print(
                f"ID: {dataset.id} | "
                f"{dataset.name} | "
                f"{dataset.records:,} records | "
                f"{dataset.columns} columns | "
                f"{dataset.status}"
            )

        print()

    except Exception as e:

        db.rollback()

        print("\n❌ Dataset synchronization failed.")
        print(f"Error: {e}")

    finally:
        db.close()


# ============================================================
# RUN SCRIPT
# ============================================================

if __name__ == "__main__":
    sync_datasets()