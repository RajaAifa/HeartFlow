

import pandas as pd
import numpy as np



REQUIRED_RAW_COLS = [
    "age_years", "gender", "height", "weight",
    "bmi_category", "bp_category", "cholesterol_level",
    "glucose_level", "smoke", "alcohol", "physical_activity"
]

FINAL_FEATURES = [
    "age",
    "gender",
    "height",
    "weight",
    "bmi_category",
    "bp_category",
    "cholesterol_level",
    "glucose_level",
    "smoke",
    "alcohol",
    "physical_activity",
    # engineered
    "age_group",
    "bmi_bp_risk",
    "lifestyle_risk_score",
    "chol_glucose_combined",
    "is_smoker_drinker",
]




def validate_columns(df: pd.DataFrame) -> None:
    """Raise if any expected raw column is missing."""
    missing = [c for c in REQUIRED_RAW_COLS if c not in df.columns
               and c.replace("age_years", "age") not in df.columns]
    if missing:
        raise ValueError(f"[preprocess] Missing columns: {missing}")


def rename_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Standardise column names coming from the raw CSV."""
    return df.rename(columns={"age_years": "age", "cardio": "target"}, errors="ignore")



def clean_data(df: pd.DataFrame) -> pd.DataFrame:
   
    df = df.drop_duplicates()

    df = df[df["age"].between(1, 120)]
    df = df[df["height"].between(50, 250)]
    df = df[df["weight"].between(10, 300)]

    df = df[df["bmi_category"].isin([0, 1, 2, 3])]
    df = df[df["bp_category"].isin([0, 1, 2, 3])]
    df = df[df["cholesterol_level"].isin([1, 2, 3])]
    df = df[df["glucose_level"].isin([1, 2, 3])]

    df = df.dropna(subset=FINAL_FEATURES[:11])   # core columns only
    df = df.reset_index(drop=True)
    return df



def add_features(df: pd.DataFrame) -> pd.DataFrame:
    
    df = df.copy()

   
    df["age_group"] = pd.cut(
        df["age"],
        bins=[0, 39, 49, 59, 120],
        labels=[0, 1, 2, 3]
    ).astype(int)

    
    df["bmi_bp_risk"] = df["bmi_category"] * df["bp_category"]

   
    df["lifestyle_risk_score"] = (
        df["smoke"].astype(int) +
        df["alcohol"].astype(int) +
        (1 - df["physical_activity"].astype(int))   # inactive = 1 point
    )

    
    df["chol_glucose_combined"] = (df["cholesterol_level"] - 1) * (df["glucose_level"] - 1)

    df["is_smoker_drinker"] = (
        (df["smoke"] == 1) & (df["alcohol"] == 1)
    ).astype(int)

    return df



def preprocess(df: pd.DataFrame) -> pd.DataFrame:
    
    validate_columns(df)
    df = rename_columns(df)
    df = clean_data(df)
    df = add_features(df)
    return df