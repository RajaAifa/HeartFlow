import React, { useState } from "react";
import axios from "axios";

const PatientPrediction = () => {
  const [form, setForm] = useState({
    age: "", gender: "", height: "", weight: "",
    bp_category: "", cholesterol_level: "", glucose_level: "",
    smoke: "", alcohol: "", physical_activity: ""
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toNumber = (val) => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);

    try {
      const payload = {
        data: Object.keys(form).reduce((acc, key) => ({
          ...acc, [key]: toNumber(form[key])
        }), {})
      };

      const res = await axios.post(`${import.meta.env.VITE_ML_URL || "http://localhost:5001"}/predict-patient-heart`, payload);
      setPrediction(res.data.success ? res.data.prediction : "Error");
    } catch (err) {
      setPrediction("Error");
    }
    setLoading(false);
  };

  const inputStyle = "w-full p-4 bg-red-50/50 border-2 border-red-100 rounded-2xl focus:ring-4 focus:ring-red-200 focus:border-red-500 focus:bg-white outline-none transition-all font-medium text-slate-700";
  const labelStyle = "block mb-2 ml-1 text-xs font-black uppercase text-red-600 tracking-wider";

  return (
    <div className="max-w-4xl mx-auto mt-12 overflow-hidden bg-white shadow-2xl rounded-[2.5rem] border border-red-50">
      
      <div className="p-8 text-center text-white bg-gradient-to-br from-red-600 to-rose-800">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-3 h-3 bg-red-200 rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
          <h2 className="text-3xl font-black tracking-tight uppercase">Heart Risk Scanner</h2>
        </div>
        <p className="text-sm font-medium tracking-wide text-red-100 opacity-80">Clinical Cardiovascular Diagnostic Engine</p>
      </div>

      <div className="p-8 lg:p-12">
        <form onSubmit={handleSubmit} className="space-y-10">
          
          <div>
            <h3 className="mb-6 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase border-b border-slate-100 pb-2">01. Patient Biometrics</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className={labelStyle}>Age (Years)</label>
                <input type="number" placeholder="e.g. 45" className={inputStyle} value={form.age} onChange={(e) => handleChange("age", e.target.value)} required />
              </div>
              <div>
                <label className={labelStyle}>Biological Gender</label>
                <select className={inputStyle} value={form.gender} onChange={(e) => handleChange("gender", e.target.value)} required>
                  <option value="">Select Gender</option>
                  <option value="0">Male</option>
                  <option value="1">Female</option>
                </select>
              </div>
              <div>
                <label className={labelStyle}>Height (cm)</label>
                <input type="number" placeholder="175" className={inputStyle} value={form.height} onChange={(e) => handleChange("height", e.target.value)} required />
              </div>
              <div>
                <label className={labelStyle}>Weight (kg)</label>
                <input type="number" placeholder="70" className={inputStyle} value={form.weight} onChange={(e) => handleChange("weight", e.target.value)} required />
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase border-b border-slate-100 pb-2">02. Laboratory Indicators</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <label className={labelStyle}>Blood Pressure</label>
                <select className={inputStyle} value={form.bp_category} onChange={(e) => handleChange("bp_category", e.target.value)} required>
                  <option value="">Category</option>
                  <option value="0">Normal</option>
                  <option value="1">Elevated</option>
                  <option value="2">High Stage 1</option>
                  <option value="3">High Stage 2</option>
                </select>
              </div>
              <div>
                <label className={labelStyle}>Cholesterol</label>
                <select className={inputStyle} value={form.cholesterol_level} onChange={(e) => handleChange("cholesterol_level", e.target.value)} required>
                  <option value="">Level</option>
                  <option value="1">Normal</option>
                  <option value="2">Above Normal</option>
                  <option value="3">High</option>
                </select>
              </div>
              <div>
                <label className={labelStyle}>Glucose Level</label>
                <select className={inputStyle} value={form.glucose_level} onChange={(e) => handleChange("glucose_level", e.target.value)} required>
                  <option value="">Level</option>
                  <option value="1">Normal</option>
                  <option value="2">Above Normal</option>
                  <option value="3">High</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase border-b border-slate-100 pb-2">03. Lifestyle Factors</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <label className={labelStyle}>Smoking History</label>
                <select className={inputStyle} value={form.smoke} onChange={(e) => handleChange("smoke", e.target.value)}>
                  <option value="0">Non-Smoker</option>
                  <option value="1">Active Smoker</option>
                </select>
              </div>
              <div>
                <label className={labelStyle}>Alcohol Intake</label>
                <select className={inputStyle} value={form.alcohol} onChange={(e) => handleChange("alcohol", e.target.value)}>
                  <option value="0">Rarely/Never</option>
                  <option value="1">Regularly</option>
                </select>
              </div>
              <div>
                <label className={labelStyle}>Physical Activity</label>
                <select className={inputStyle} value={form.physical_activity} onChange={(e) => handleChange("physical_activity", e.target.value)}>
                  <option value="1">Active</option>
                  <option value="0">Sedentary</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full py-6 overflow-hidden font-black text-white uppercase transition-all bg-red-600 rounded-2xl hover:bg-red-700 active:scale-[0.98] shadow-xl shadow-red-100"
          >
            <span className="relative z-10 tracking-[0.2em] flex items-center justify-center gap-3">
              {loading ? "System Analyzing..." : "Execute Risk Assessment"}
            </span>
          </button>
        </form>

        {prediction !== null && (
          <div className="mt-12 duration-500 animate-in fade-in slide-in-from-bottom-4">
            {prediction === "Error" ? (
              <div className="p-6 font-bold tracking-widest text-center text-red-700 uppercase border-2 border-red-200 bg-red-50 rounded-2xl">
                Service Unreachable. Try again later.
              </div>
            ) : (
              <div className={`p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 ${
                prediction > 50 ? "bg-red-50 border-2 border-red-100" : "bg-emerald-50 border-2 border-emerald-100"
              }`}>
                <div className="text-center md:text-left">
                  <p className="mb-1 text-xs font-black tracking-widest uppercase text-slate-400">Resulting Risk Factor</p>
                  <h3 className={`text-4xl font-black ${prediction > 50 ? "text-red-900" : "text-emerald-900"}`}>
                    {prediction > 70 ? "Critical Warning" : prediction > 30 ? "Monitor Closely" : "Low Risk Profile"}
                  </h3>
                </div>
                <div className="flex items-center gap-4 px-8 py-4 bg-white shadow-sm rounded-2xl">
                  <span className="text-sm font-bold uppercase text-slate-400">Probability</span>
                  <span className={`text-5xl font-black ${prediction > 50 ? "text-red-600" : "text-emerald-600"}`}>
                    {prediction}<span className="text-2xl">%</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientPrediction;