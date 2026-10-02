

import pandas as pd
import numpy as np



REQUIRED_RAW_COLS = [
    "HighBP", "HighChol", "BMI", "Smoker", "PhysActivity",
    "Fruits", "Veggies", "HvyAlcoholConsump", "GenHlth",
    "MentHlth", "PhysHlth", "DiffWalk", "Stroke",
    "HeartDiseaseorAttack", "Sex", "Age"
]

TARGET = "Diabetes_binary"

FINAL_FEATURES = [
    "HighBP",
    "HighChol",
    "BMI",
    "Smoker",
    "PhysActivity",
    "Fruits",
    "Veggies",
    "HvyAlcoholConsump",
    "GenHlth",
    "MentHlth",
    "PhysHlth",
    "DiffWalk",
    "Stroke",
    "HeartDiseaseorAttack",
    "Sex",
    "Age",
    # engineered
    "bmi_category",
    "cardio_risk_score",
    "health_burden_score",
    "lifestyle_score",
    "age_group",
    "bp_chol_combined",
]




def validate_columns(df: pd.DataFrame) -> None:
    missing = [c for c in REQUIRED_RAW_COLS if c not in df.columns]
    if missing:
        raise ValueError(f"[preprocess_diabetes] Missing columns: {missing}")



def clean_data(df: pd.DataFrame) -> pd.DataFrame:
   
    df = df.drop_duplicates()

    df = df[df["BMI"].between(10, 100)]

    df = df[df["Age"].between(1, 13)]

    df = df[df["GenHlth"].between(1, 5)]

    df = df[df["MentHlth"].between(0, 30)]
    df = df[df["PhysHlth"].between(0, 30)]

    binary_cols = [
        "HighBP", "HighChol", "Smoker", "Stroke", "HeartDiseaseorAttack",
        "PhysActivity", "Fruits", "Veggies", "HvyAlcoholConsump",
        "DiffWalk", "Sex"
    ]
    for col in binary_cols:
        df = df[df[col].isin([0, 1, 0.0, 1.0])]

    # Target
    if TARGET in df.columns:
        df[TARGET] = df[TARGET].astype(int)

    df = df.dropna(subset=REQUIRED_RAW_COLS)
    df = df.reset_index(drop=True)
    return df



def add_features(df: pd.DataFrame) -> pd.DataFrame:
   
    df = df.copy()

    
    df["bmi_category"] = pd.cut(
        df["BMI"],
        bins=[0, 18.5, 25, 30, 999],
        labels=[0, 1, 2, 3],
        right=False
    ).astype(int)

    df["cardio_risk_score"] = (
        df["HighBP"].astype(int) +
        df["HighChol"].astype(int) +
        df[["HeartDiseaseorAttack", "Stroke"]].max(axis=1).astype(int)
    )

   
    df["health_burden_score"] = df["MentHlth"] + df["PhysHlth"]

   
    df["lifestyle_score"] = (
        df["PhysActivity"].astype(int) +
        df["Fruits"].astype(int) +
        df["Veggies"].astype(int) -
        df["HvyAlcoholConsump"].astype(int) -
        df["Smoker"].astype(int)
    ).clip(lower=0)   

    df["age_group"] = pd.cut(
        df["Age"],
        bins=[0, 3, 7, 11, 13],
        labels=[0, 1, 2, 3]
    ).astype(int)

    df["bp_chol_combined"] = df["HighBP"].astype(int) * df["HighChol"].astype(int)

    return df



def preprocess_data(df: pd.DataFrame) -> pd.DataFrame:
    
    validate_columns(df)
    df = clean_data(df)
    df = add_features(df)
    return df