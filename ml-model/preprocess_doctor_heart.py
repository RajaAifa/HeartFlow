

import pandas as pd
import numpy as np




DROP_COLS = ["doc", "id"]

TARGET = "resultat_1_pos0_neg"

FINAL_FEATURES = [
    "age",
    "sexe_1_H0_F",
    "tabac_1_oui0_non",
    "ethylisme_1_oui0_non",
    "ATCD_perso_1_oui0_non",
    "ATCD_fam_Db_1_oui0_non",
    "ATCD_fam_HTA_1_oui0_non",
    "ATCD_fam_IR_1_oui0_non",
    "ATCD_fam_Cardio_1_oui0_non",
    "poidskg",
    "taillem",
    "BMI",
    "TA",
    "glycemie_jeun",
    "HbA1c",
    "creatinine",
    "uree",
    "chol_total",
    "HDL_chol",
    "triglycerides",
    "albuminurie",
    "ECG",
    "age_group",
    "bmi_category",
    "family_risk_score",
    "metabolic_risk_score",
    "lipid_ratio",
    "is_smoker_drinker",
    "cardio_family_history",
]


def rename_columns(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = (
        df.columns
        .str.replace("\n", "_", regex=False)
        .str.replace("(", "",  regex=False)
        .str.replace(")", "",  regex=False)
        .str.replace(",",  "", regex=False)
        .str.replace("=",  "_", regex=False)
        .str.replace(" ",  "", regex=False)
    )
    return df




def validate_columns(df: pd.DataFrame) -> None:
    """Call AFTER rename_columns."""
    base = [c for c in FINAL_FEATURES if c not in (
        "age_group", "bmi_category", "family_risk_score",
        "metabolic_risk_score", "lipid_ratio",
        "is_smoker_drinker", "cardio_family_history"
    )]
    missing = [c for c in base if c not in df.columns]
    if missing:
        raise ValueError(f"[preprocess_doctor_heart] Missing columns after rename: {missing}")




def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    
    df = df.copy()

    drop = [c for c in DROP_COLS if c in df.columns]
    if drop:
        df = df.drop(columns=drop)

    df = rename_columns(df)

    obj_cols = df.select_dtypes(include="object").columns
    for col in obj_cols:
        df[col] = pd.to_numeric(
            df[col].replace(r"^\s*$", np.nan, regex=True),
            errors="coerce"
        )

    df = df.drop_duplicates()

    df.loc[~df["age"].between(1, 120),        "age"]     = np.nan
    df.loc[~df["poidskg"].between(20, 300),   "poidskg"] = np.nan
    df.loc[~df["taillem"].between(0.5, 2.5),  "taillem"] = np.nan
    df.loc[~df["BMI"].between(10, 80),        "BMI"]     = np.nan

    df = df.reset_index(drop=True)
    return df




def add_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    df["age_group"] = pd.cut(
        df["age"],
        bins=[0, 29, 44, 59, 120],
        labels=[0, 1, 2, 3]
    ).astype("Int64").astype(float)

    df["bmi_category"] = pd.cut(
        df["BMI"],
        bins=[0, 18.5, 25, 30, 999],
        labels=[0, 1, 2, 3],
        right=False
    ).astype("Int64").astype(float)

    fam_cols = [
        "ATCD_fam_Db_1_oui0_non",
        "ATCD_fam_HTA_1_oui0_non",
        "ATCD_fam_IR_1_oui0_non",
        "ATCD_fam_Cardio_1_oui0_non",
    ]
    df["family_risk_score"] = df[fam_cols].fillna(0).sum(axis=1)

    df["metabolic_risk_score"] = (
        df["glycemie_jeun"].fillna(0).astype(int) +
        df["HbA1c"].fillna(0).astype(int) +
        df["chol_total"].fillna(0).astype(int) +
        df["ECG"].fillna(0).astype(int)
    )

    hdl = df["HDL_chol"].replace(0, np.nan)
    df["lipid_ratio"] = df["chol_total"] / hdl

    df["is_smoker_drinker"] = (
        (df["tabac_1_oui0_non"].fillna(0) == 1) &
        (df["ethylisme_1_oui0_non"].fillna(0) == 1)
    ).astype(int)

    df["cardio_family_history"] = df["ATCD_fam_Cardio_1_oui0_non"].fillna(0).astype(int)

    return df




def get_target_col(df: pd.DataFrame) -> str:
    matches = [c for c in df.columns if "resultat" in c.lower()]
    if not matches:
        raise ValueError("[preprocess_doctor_heart] Could not find target column containing 'resultat'")
    return matches[0]



def preprocess_data(df: pd.DataFrame) -> pd.DataFrame:
    
    df = clean_data(df)       # drops doc/id, renames, NaN-cleans
    validate_columns(df)
    df = add_features(df)
    return df