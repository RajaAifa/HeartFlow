

import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, recall_score, classification_report
from xgboost import XGBClassifier

from preprocess_doctor_diabetes import preprocess_data, FINAL_FEATURES, TARGET

print(" Loading dataset...")
df = pd.read_csv("diabetes_doctor.csv")
print(f"   Rows loaded: {len(df)}")


print(" Preprocessing...")
df = preprocess_data(df)
print(f"   Rows after clean: {len(df)}")


X = df[FINAL_FEATURES]
y = df[TARGET]


X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", XGBClassifier(
        n_estimators=300,
        max_depth=5,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        eval_metric="logloss",
        random_state=42
    ))
])

print(" Training model...")
pipeline.fit(X_train, y_train)

print(" Evaluating...")
y_pred = pipeline.predict(X_test)

print(f"   Accuracy : {accuracy_score(y_test, y_pred):.4f}")
print(f"   Recall   : {recall_score(y_test, y_pred):.4f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=["No Diabetes", "Diabetes"]))

print(" Saving pipeline...")
joblib.dump(pipeline, "models/diabetes_doctor.pkl")
print(" Pipeline saved to models/diabetes_doctor.pkl")