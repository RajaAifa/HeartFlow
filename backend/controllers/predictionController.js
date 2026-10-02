import axios from "axios";

const safeNumber = (value, fallback = 0) => {
  const num = Number(value);
  return isNaN(num) ? fallback : num;
};

export const predictDisease = async (req, res) => {
  try {
    const { type, data } = req.body;

    let targetUrl = "";
    let payload = {};

    
    if (type === "patient") {
      targetUrl = `${process.env.FLASK_AI_URL || "http://127.0.0.1:5001"}/predict-patient-heart`;

      payload = {
        age: safeNumber(data.age),
        gender: safeNumber(data.gender),
        height: safeNumber(data.height),
        weight: safeNumber(data.weight),
        bmi_category: safeNumber(data.bmi_category),
        bp_category: safeNumber(data.bp_category),
        cholesterol_level: safeNumber(data.cholesterol_level),
        glucose_level: safeNumber(data.glucose_level),
        smoke: safeNumber(data.smoke),
        alcohol: safeNumber(data.alcohol),
        physical_activity: safeNumber(data.physical_activity)
      };
    }

   
    else if (type === "doctor") {
      targetUrl = `${process.env.FLASK_AI_URL || "http://127.0.0.1:5001"}/predict-doctor-heart`;

      payload = {
        age: safeNumber(data.age),
        trestbps: safeNumber(data.trestbps),
        chol: safeNumber(data.chol),
        thalach: safeNumber(data.thalach),
        oldpeak: safeNumber(data.oldpeak)
      };
    }

   
    else if (type === "diabetes") {
      targetUrl = `${process.env.FLASK_AI_URL || "http://127.0.0.1:5001"}/predict-diabetes`;

      payload = {
        Pregnancies: safeNumber(data.Pregnancies),
        Glucose: safeNumber(data.Glucose),
        BloodPressure: safeNumber(data.BloodPressure),
        SkinThickness: safeNumber(data.SkinThickness),
        Insulin: safeNumber(data.Insulin),
        BMI: safeNumber(data.BMI),
        DiabetesPedigreeFunction: safeNumber(data.DiabetesPedigreeFunction),
        Age: safeNumber(data.Age)
      };
    }

    else {
      return res.status(400).json({
        success: false,
        message: "Invalid prediction type"
      });
    }

    console.log("📤 PAYLOAD:", payload);

    const response = await axios.post(targetUrl, payload);

    const score =
      response.data.prediction ??
      response.data.probability ??
      0;

    return res.json({
      success: true,
      prediction: score > 50 ? "High Risk" : "Low Risk",
      probability: Number(score)
    });

  } catch (error) {
    console.error("❌ ML ERROR:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "AI Engine connection failed",
      error: error.message
    });
  }
};