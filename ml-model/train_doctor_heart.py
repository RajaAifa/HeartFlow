
import pandas as pd
import numpy as np
import joblib
import warnings
warnings.filterwarnings("ignore")

from xgboost import XGBClassifier
from sklearn.impute import SimpleImputer
from sklearn.model_selection import StratifiedKFold, cross_validate
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline


print(" Loading dataset...")
df = pd.read_excel("heart_Doctor.xlsx")

df = df.drop(columns=["doc", "id"])

df.columns = (
    df.columns
    .str.replace("\n", "_", regex=False)
    .str.replace("(", "",  regex=False)
    .str.replace(")", "",  regex=False)
    .str.replace(",", "",  regex=False)
    .str.replace("=", "_", regex=False)
    .str.replace(" ", "",  regex=False)
)

print(f"    Loaded: {df.shape[0]} patients × {df.shape[1]} columns")

print(" Cleaning missing values...")

obj_cols = df.select_dtypes(include="object").columns
for col in obj_cols:
    df[col] = pd.to_numeric(
        df[col].replace(r"^\s*$", np.nan, regex=True),
        errors="coerce"
    )

total_nan = df.isnull().sum().sum()
print(f"    Total NaN values detected: {total_nan}")
nan_by_col = df.isnull().sum()
print(nan_by_col[nan_by_col > 0].to_string())

target_col = [c for c in df.columns if "resultat" in c][0]
X = df.drop(columns=[target_col])
y = df[target_col].astype(int)

feature_names = list(X.columns)

print(f"\n Dataset summary:")
print(f"   Features  : {len(feature_names)}")
print(f"   Samples   : {len(X)}")
print(f"   Positive  : {y.sum()} ({y.mean()*100:.1f}%)")
print(f"   Negative  : {(y==0).sum()} ({(y==0).mean()*100:.1f}%)")


print("\n  Building pipeline...")

imputer = SimpleImputer(strategy="most_frequent")

xgb = XGBClassifier(
    n_estimators=150,
    max_depth=3,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    scale_pos_weight=round((y == 0).sum() / (y == 1).sum(), 2),
    eval_metric="logloss",
    random_state=42,
    tree_method="hist"
)

pipeline = ImbPipeline([
    ("imputer", imputer),
    ("smote",   SMOTE(random_state=42, k_neighbors=3)),
    ("model",   xgb)
])

print("Running 5-fold cross-validation...")

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

results = cross_validate(
    pipeline, X, y, cv=cv,
    scoring=["accuracy", "roc_auc", "f1", "recall", "precision"],
    return_train_score=False
)

print("\n══════════════════════════════════════════════")
print("        CROSS-VALIDATION RESULTS (5-fold)     ")
print("══════════════════════════════════════════════")
print(f"  Accuracy  : {results['test_accuracy'].mean()*100:.1f}%  ± {results['test_accuracy'].std()*100:.1f}%")
print(f"  AUC-ROC   : {results['test_roc_auc'].mean():.3f}  ± {results['test_roc_auc'].std():.3f}")
print(f"  F1-Score  : {results['test_f1'].mean():.3f}  ± {results['test_f1'].std():.3f}")
print(f"  Recall    : {results['test_recall'].mean():.3f}  ± {results['test_recall'].std():.3f}")
print(f"  Precision : {results['test_precision'].mean():.3f}  ± {results['test_precision'].std():.3f}")
print("══════════════════════════════════════════════")


print("\n Training final model on full dataset...")
pipeline.fit(X, y)
print("    Training complete!")

feat_imp = pd.Series(
    pipeline.named_steps["model"].feature_importances_,
    index=feature_names
).sort_values(ascending=False)

print("\n Top 10 most important features:")
for i, (feat, imp) in enumerate(feat_imp.head(10).items(), 1):
    bar = "█" * int(imp * 100)
    print(f"   {i:2d}. {feat:35s} {imp:.3f}  {bar}")


print("\n Saving model files...")
joblib.dump(pipeline,      "heart_doctor.pkl")
joblib.dump(feature_names, "heartdoc_features.pkl")

print("    heartdoc.pkl          → full pipeline (imputer + SMOTE + XGBoost)")
print("    heartdoc_features.pkl → feature names list")

test_prob = pipeline.predict_proba(X.iloc[[0]])[0][1]
print(f"\n Sanity check — Patient 1: {test_prob*100:.1f}% cardiac risk  (actual: {'Positive' if y.iloc[0]==1 else 'Negative'})")
print("\n Done! Model ready for HeartFlow.")