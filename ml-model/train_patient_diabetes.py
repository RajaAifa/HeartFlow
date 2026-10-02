

import pickle
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, recall_score
from imblearn.pipeline import Pipeline as ImbPipeline
from imblearn.over_sampling import SMOTE

from preprocess_patient_diabetes import preprocess_data, FINAL_FEATURES, TARGET

print(" Loading dataset...")
df = pd.read_csv("diabetes_patient.csv")
print(f"   Rows loaded: {len(df)}")

print("🔹 Preprocessing...")
df = preprocess_data(df)
print(f"   Rows after clean: {len(df)}")


X = df[FINAL_FEATURES]
y = df[TARGET]

print(f"   Class distribution before SMOTE: {y.value_counts().to_dict()}")


X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)


pipeline = ImbPipeline([
    ("scaler", StandardScaler()),
    ("smote",  SMOTE(random_state=42)),
    ("model",  RandomForestClassifier(
        n_estimators=200,
        max_depth=10,
        random_state=42,
        class_weight="balanced"   # extra safeguard on top of SMOTE
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


print("Saving model...")
with open("models/diabetes_patient.pkl", "wb") as f:
    pickle.dump(pipeline, f)
print(" Model saved to models/diabetes_patient.pkl")