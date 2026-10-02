

import pandas as pd
import numpy as np




REQUIRED_RAW_COLS = [
    "Pregnancies", "Glucose", "BloodPressure", "SkinThickness",
    "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"
]

TARGET = "Outcome"

FINAL_FEATURES = [
    # base
    "Pregnancies",
    "Glucose",
    "BloodPressure",
    "SkinThickness",
    "Insulin",
    "BMI",
    "DiabetesPedigreeFunction",
    "Age",
    # engineered
    "glucose_category",
    "bmi_category",
    "age_group",
    "insulin_missing",
    "glucose_bmi_interaction",
    "pedigree_age_interaction",
    "metabolic_risk_score",
]




def validate_columns(df: pd.DataFrame) -> None:
    missing = [c for c in REQUIRED_RAW_COLS if c not in df.columns]
    if missing:
        raise ValueError(f"[preprocess_doctor_diabetes] Missing columns: {missing}")




def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    
    df = df.copy()
    df = df.drop_duplicates()

    zero_as_missing = ["Glucose", "BloodPressure", "SkinThickness", "BMI"]
    for col in zero_as_missing:
        median = df.loc[df[col] != 0, col].median()
        df[col] = df[col].replace(0, median)


    df = df[df["Glucose"].between(50, 300)]
    df = df[df["BloodPressure"].between(30, 180)]
    df = df[df["BMI"].between(10, 80)]
    df = df[df["Age"].between(1, 120)]
    df = df[df["Pregnancies"].between(0, 20)]
    df = df[df["SkinThickness"].between(0, 100)]
    df = df[df["Insulin"].between(0, 900)]
    df = df[df["DiabetesPedigreeFunction"] >= 0]

    df = df.dropna(subset=REQUIRED_RAW_COLS)
    df = df.reset_index(drop=True)
    return df




def add_features(df: pd.DataFrame) -> pd.DataFrame:
   
    df = df.copy()

    df["glucose_category"] = pd.cut(
        df["Glucose"],
        bins=[0, 99.9, 125.9, 999],
        labels=[0, 1, 2]
    ).astype(int)

    df["bmi_category"] = pd.cut(
        df["BMI"],
        bins=[0, 18.5, 25, 30, 999],
        labels=[0, 1, 2, 3],
        right=False
    ).astype(int)

    
    df["age_group"] = pd.cut(
        df["Age"],
        bins=[0, 29, 44, 59, 999],
        labels=[0, 1, 2, 3]
    ).astype(int)

    df["insulin_missing"] = (df["Insulin"] == 0).astype(int)

    df["glucose_bmi_interaction"] = df["Glucose"] * df["BMI"]

    df["pedigree_age_interaction"] = df["DiabetesPedigreeFunction"] * df["Age"]

    df["metabolic_risk_score"] = (
        (df["Glucose"] >= 126).astype(int) +
        (df["BMI"] >= 30).astype(int) +
        (df["BloodPressure"] >= 90).astype(int) +
        (df["DiabetesPedigreeFunction"] >= 0.5).astype(int)
    )

    return df



def preprocess_data(df: pd.DataFrame) -> pd.DataFrame:
    
    validate_columns(df)
    df = clean_data(df)
    df = add_features(df)
    return df