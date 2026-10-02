

import pickle
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier

from preprocess_patient_heart import preprocess, FINAL_FEATURES

print(" Loading dataset...")
df = pd.read_csv("patient_heart.csv")
print(f"   Rows loaded: {len(df)}")

print(" Preprocessing...")
df = preprocess(df)
print(f"   Rows after clean: {len(df)}")

X = df[FINAL_FEATURES]
y = df["target"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42
)

pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", RandomForestClassifier(
        n_estimators=200,
        max_depth=10,
        random_state=42
    ))
])

print(" Training model...")
pipeline.fit(X_train, y_train)

score = pipeline.score(X_test, y_test)
print(f" Accuracy: {round(score, 4)}")

print(" Saving pipeline...")
with open("models/heart_patient.pkl", "wb") as f:
    pickle.dump(pipeline, f)
print(" Model saved to models/heart_patient.pkl")