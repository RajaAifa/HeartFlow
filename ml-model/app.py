import pandas as pd
from flask import Flask, request, jsonify
import numpy as np
import pickle
import joblib
from flask_cors import CORS


from preprocess_patient_heart    import preprocess, FINAL_FEATURES as HEART_PATIENT_FEATURES
from preprocess_patient_diabetes import preprocess_data as preprocess_patient_diabetes, FINAL_FEATURES as DIABETES_PATIENT_FEATURES
from preprocess_doctor_diabetes  import preprocess_data as preprocess_doctor_diabetes,  FINAL_FEATURES as DIABETES_DOCTOR_FEATURES

app = Flask(__name__)
CORS(app)


try:
    patient_heart_model    = pickle.load(open("models/heart_patient.pkl",     "rb"))
    doctor_heart_model     = joblib.load("models/heart_doctor.pkl")
    doctor_diabetes_model  = joblib.load("models/diabetes_doctor.pkl")
    patient_diabetes_model = pickle.load(open("models/diabetes_patient.pkl",  "rb"))

    print("✅ All models loaded successfully")

except Exception as e:
    print(f"❌ CRITICAL ERROR LOADING MODELS: {e}")



@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "HeartFlow AI Engine Online",
        "success": True
    })


@app.route("/predict-patient-heart", methods=["POST"])
def predict_patient_heart():
    try:
        payload = request.get_json()

        if not payload or "data" not in payload:
            return jsonify({"success": False, "error": "Missing 'data' in request body"}), 400

        data = payload["data"]

        raw = pd.DataFrame([{
            "age_years":        float(data["age"]),
            "gender":           int(data["gender"]),
            "height":           float(data["height"]),
            "weight":           float(data["weight"]),
            "bp_category":      int(data["bp_category"]),
            "cholesterol_level": int(data["cholesterol_level"]),
            "glucose_level":    int(data["glucose_level"]),
            "smoke":            int(data["smoke"]),
            "alcohol":          int(data["alcohol"]),
            "physical_activity": int(data["physical_activity"]),
            "bmi_category":     _bmi_category(float(data["height"]), float(data["weight"])),
            "cardio":           0,
        }])

        df = preprocess(raw)
        features = df[HEART_PATIENT_FEATURES]

        prob = float(patient_heart_model.predict_proba(features)[0][1])

        return jsonify({"prediction": round(prob * 100, 2), "success": True})

    except Exception as e:
        print("❌ Patient Heart Error:", str(e))
        return jsonify({"success": False, "error": str(e)}), 400



@app.route("/predict-doctor-heart", methods=["POST"])
def predict_doctor_heart():
    try:
        payload = request.get_json()
        data = payload.get("data", payload)

        def optional(key):
            val = data.get(key)
            if val is None or val == "" or val == "null":
                return np.nan
            return float(val)

        df = pd.DataFrame([{
            "age":                        float(data["age"]),
            "sexe_1_H0_F":                int(data["sexe"]),
            "tabac_1_oui0_non":           int(data["tabac"]),
            "ethylisme_1_oui0_non":       int(data["ethylisme"]),
            "ATCD_perso_1_oui0_non":      int(data["ATCD_perso"]),
            "ATCD_fam_Db_1_oui0_non":     int(data["ATCD_fam_Db"]),
            "ATCD_fam_HTA_1_oui0_non":    int(data["ATCD_fam_HTA"]),
            "ATCD_fam_IR_1_oui0_non":     int(data["ATCD_fam_IR"]),
            "ATCD_fam_Cardio_1_oui0_non": int(data["ATCD_fam_Cardio"]),
            "poidskg":                    float(data["poids"]),
            "taillem":                    float(data["taille"]),
            "BMI":                        float(data["BMI"]),
            "TA":                         int(data["TA"]),
            "glycemie_jeun":              int(data["glycemie_jeun"]),
            "HbA1c":                      int(data["HbA1c"]),
            "creatinine":                 optional("creatinine"),
            "uree":                       optional("uree"),
            "chol_total":                 optional("chol_total"),
            "HDL_chol":                   optional("HDL_chol"),
            "triglycerides":              optional("triglycerides"),
            "albuminurie":                optional("albuminurie"),
            "ECG":                        int(data["ECG"]),
        }])

        prob = float(doctor_heart_model.predict_proba(df)[0][1])

        return jsonify({"prediction": round(prob * 100, 2), "success": True})

    except Exception as e:
        print("❌ Doctor Heart Error:", str(e))
        return jsonify({"success": False, "error": str(e)}), 400



@app.route("/predict-diabetes", methods=["POST"])
def predict_doctor_diabetes():
    try:
        payload = request.get_json()
        data = payload.get("data", payload)

        raw = pd.DataFrame([{
            "Pregnancies":              float(data["Pregnancies"]),
            "Glucose":                  float(data["Glucose"]),
            "BloodPressure":            float(data["BloodPressure"]),
            "SkinThickness":            float(data["SkinThickness"]),
            "Insulin":                  float(data["Insulin"]),
            "BMI":                      float(data["BMI"]),
            "DiabetesPedigreeFunction": float(data["DiabetesPedigreeFunction"]),
            "Age":                      float(data["Age"]),
            "Outcome":                  0,
        }])

        df = preprocess_doctor_diabetes(raw)
        features = df[DIABETES_DOCTOR_FEATURES]

        prob = float(doctor_diabetes_model.predict_proba(features)[0][1])

        return jsonify({"prediction": round(prob * 100, 2), "success": True})

    except Exception as e:
        print("❌ Doctor Diabetes Error:", str(e))
        return jsonify({"success": False, "error": str(e)}), 400



@app.route("/predict-patient-diabetes", methods=["POST"])
def predict_patient_diabetes():
    try:
        data = request.get_json()

        raw = pd.DataFrame([{
            "Diabetes_binary":      0,   
            "HighBP":               int(data["HighBP"]),
            "HighChol":             int(data["HighChol"]),
            "CholCheck":            int(data.get("CholCheck", 1)),
            "BMI":                  float(data["BMI"]),
            "Smoker":               int(data["Smoker"]),
            "Stroke":               int(data["Stroke"]),
            "HeartDiseaseorAttack": int(data["HeartDiseaseorAttack"]),
            "PhysActivity":         int(data["PhysActivity"]),
            "Fruits":               int(data["Fruits"]),
            "Veggies":              int(data["Veggies"]),
            "HvyAlcoholConsump":    int(data["HvyAlcoholConsump"]),
            "AnyHealthcare":        int(data.get("AnyHealthcare", 1)),
            "NoDocbcCost":          int(data.get("NoDocbcCost", 0)),
            "GenHlth":              int(data["GenHlth"]),
            "MentHlth":             int(data["MentHlth"]),
            "PhysHlth":             int(data["PhysHlth"]),
            "DiffWalk":             int(data["DiffWalk"]),
            "Sex":                  int(data["Sex"]),
            "Age":                  int(data["Age"]),
            "Education":            int(data.get("Education", 4)),
            "Income":               int(data.get("Income", 4)),
        }])

        df = preprocess_patient_diabetes(raw)
        features = df[DIABETES_PATIENT_FEATURES]

        prob = float(patient_diabetes_model.predict_proba(features)[0][1])

        return jsonify({"prediction": round(prob * 100, 2), "success": True})

    except Exception as e:
        print("❌ Patient Diabetes Error:", str(e))
        return jsonify({"success": False, "error": str(e)}), 400



def _bmi_category(height_cm: float, weight_kg: float) -> int:
    
    bmi = weight_kg / ((height_cm / 100) ** 2)
    if bmi < 18.5:
        return 0
    elif bmi < 25:
        return 1
    elif bmi < 30:
        return 2
    else:
        return 3



if __name__ == "__main__":
    app.run(debug=True, port=5001)