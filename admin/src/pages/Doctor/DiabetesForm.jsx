import { useState, useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import axios from "axios";

const downloadPDF = (formData, patientName, appointmentDate, prediction, prescription) => {
  const isPositive = prediction.value === 1;
  const score = (prediction.probability * 100).toFixed(1);
  const fields = [
    ["Pregnancies",       formData.Pregnancies],
    ["Glucose Level",     `${formData.Glucose} mg/dL`],
    ["Blood Pressure",    `${formData.BloodPressure} mm Hg`],
    ["Skin Thickness",    `${formData.SkinThickness} mm`],
    ["Insulin Level",     `${formData.Insulin} mu U/ml`],
    ["BMI Index",         `${formData.BMI} kg/m²`],
    ["Pedigree Function", formData.DiabetesPedigreeFunction],
    ["Patient Age",       `${formData.Age} years`],
  ];
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
    <style>
      body{font-family:Arial,sans-serif;padding:40px;color:#1a1a1a;font-size:13px;}
      h1{color:#C0392B;font-size:22px;margin-bottom:4px;}
      h2{font-size:14px;color:#555;border-bottom:1px solid #eee;padding-bottom:6px;margin-top:24px;}
      .meta{display:flex;gap:40px;margin:12px 0 24px;font-size:12px;color:#666;}
      table{width:100%;border-collapse:collapse;margin-top:8px;}
      td,th{border:1px solid #e5e5e5;padding:7px 10px;text-align:left;}
      th{background:#f9f9f9;font-weight:700;width:50%;}
      .verdict{margin-top:28px;padding:18px 24px;border-radius:10px;
               background:${isPositive?"#FFF7ED":"#F0FDF4"};
               border:2px solid ${isPositive?"#FED7AA":"#BBF7D0"};}
      .verdict h3{margin:0 0 6px;color:${isPositive?"#92400E":"#166534"};font-size:18px;}
      .score{font-size:42px;font-weight:900;color:${isPositive?"#D97706":"#16A34A"};}
      .prescription{margin-top:24px;padding:16px 20px;border-radius:10px;background:#F8FAFF;border:2px solid #DBEAFE;}
      .prescription h2{color:#1E40AF;border-color:#BFDBFE;}
      .prescription p{white-space:pre-wrap;color:#1e293b;line-height:1.6;}
      .disclaimer{margin-top:32px;font-size:11px;color:#999;border-top:1px solid #eee;padding-top:12px;}
    </style></head><body>
    <h1>🩸 HeartFlow — Metabolic Risk Report</h1>
    <div class="meta">
      <span><strong>Patient:</strong> ${patientName}</span>
      <span><strong>Date:</strong> ${appointmentDate}</span>
      <span><strong>Generated:</strong> ${new Date().toLocaleString()}</span>
    </div>
    <h2>Clinical Parameters</h2>
    <table>${fields.map(([k,v])=>`<tr><th>${k}</th><td>${v}</td></tr>`).join("")}</table>
    <div class="verdict">
      <h3>${isPositive?"Positive — Diabetes Detected":"Negative — No Diabetes Detected"}</h3>
      <div class="score">${score}<span style="font-size:20px">%</span></div>
      <p style="margin:8px 0 0;color:#555;">${isPositive?"High metabolic risk detected. Further clinical examination is advised.":"Low probability of diabetes based on the provided clinical parameters."}</p>
    </div>
    ${prescription ? `<div class="prescription"><h2>📋 Doctor's Prescription</h2><p>${prescription}</p></div>` : ""}
    <div class="disclaimer">⚕️ This report is a clinical decision-support tool only and does not replace a formal medical diagnosis. HeartDoc v1.0</div>
    </body></html>`;
  const win = window.open("","_blank");
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(()=>{win.print();win.close();},500);
};

const DiabetesForm = () => {
  const { getDiabetesPrediction, dToken, backendUrl } = useContext(DoctorContext);
  const [patientName,     setPatientName]     = useState("");
  const [appointmentDate, setAppointmentDate] = useState(new Date().toISOString().split("T")[0]);
  const [formData,        setFormData]        = useState({
    Pregnancies: "", Glucose: "", BloodPressure: "", SkinThickness: "",
    Insulin: "", BMI: "", DiabetesPedigreeFunction: "", Age: "",
  });
  const [prediction,   setPrediction]   = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [saved,        setSaved]        = useState(false);
  const [prescription, setPrescription] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientName.trim()) return alert("Please enter the patient name.");
    setLoading(true);
    setPrediction(null);
    setSaved(false);
    setPrescription("");
    try {
      const probability = await getDiabetesPrediction(formData);
      if (probability !== null) {
        setPrediction({ value: probability > 50 ? 1 : 0, probability: probability / 100 });
      } else {
        setPrediction({ error: "Analysis failed. Ensure AI Engine is online." });
      }
    } catch {
      setPrediction({ error: "Connection to Laboratory Engine failed." });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!prediction || prediction.error) return;
    setSaving(true);
    try {
      await axios.post(
        `${backendUrl}/api/doctor/save-analysis`,
        {
          patientName,
          appointmentDate,
          clinicalData: formData,
          prediction:   prediction.value === 1 ? "Positive — Diabetes Detected" : "Negative — No Diabetes Detected",
          probability:  prediction.probability * 100,
          type:         "diabetes",
          prescription: prescription.trim(),
        },
        { headers: { Authorization: `Bearer ${dToken}` } }
      );
      setSaved(true);
    } catch (err) {
      console.error(err);
      alert("Failed to save analysis. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { label: "Pregnancies",       name: "Pregnancies",              placeholder: "0"       },
    { label: "Glucose Level",     name: "Glucose",                  placeholder: "mg/dL"   },
    { label: "Blood Pressure",    name: "BloodPressure",            placeholder: "mm Hg"   },
    { label: "Skin Thickness",    name: "SkinThickness",            placeholder: "mm"      },
    { label: "Insulin Level",     name: "Insulin",                  placeholder: "mu U/ml" },
    { label: "BMI Index",         name: "BMI",       step: "0.1",   placeholder: "kg/m²"  },
    { label: "Pedigree Function", name: "DiabetesPedigreeFunction", step: "0.01", placeholder: "0.00" },
    { label: "Patient Age",       name: "Age",                      placeholder: "years"   },
  ];

  return (
    <div className="px-4 pb-12 mx-auto mt-8 max-w-7xl">
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-red-100/50 border border-red-50 overflow-hidden">

        <div className="flex flex-col items-center justify-between p-8 text-white bg-gradient-to-r from-red-600 to-red-700 md:flex-row">
          <div className="mb-4 text-center md:text-left md:mb-0">
            <h2 className="text-3xl font-extrabold tracking-tight">Metabolic Analysis</h2>
            <p className="text-red-100 opacity-80">AI-Powered Diabetes Predictive Screening</p>
          </div>
          <div className="px-6 py-3 border bg-white/10 backdrop-blur-md rounded-2xl border-white/20">
            <span className="block text-xs font-bold tracking-widest uppercase opacity-70">System Status</span>
            <span className="flex items-center gap-2 font-mono text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
              AI Engine Online
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10 lg:p-12">
          <div>
            <div className="flex items-center gap-3 pb-3 mb-5 border-b border-slate-100">
              <span className="text-xl">📋</span>
              <h3 className="text-lg font-extrabold tracking-tight text-slate-700">Patient Identity</h3>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="relative group">
                <label className="block mb-2 ml-1 text-sm font-bold transition-colors text-slate-500 group-focus-within:text-red-600">Full Name <span className="text-red-500">*</span></label>
                <input type="text" value={patientName} onChange={e => setPatientName(e.target.value)} placeholder="e.g. Mohamed Ben Ali" required
                  className="w-full p-4 font-semibold transition-all border-2 outline-none bg-slate-50 border-slate-100 rounded-2xl text-slate-700 focus:bg-white focus:border-red-400 focus:ring-4 focus:ring-red-100" />
              </div>
              <div className="relative group">
                <label className="block mb-2 ml-1 text-sm font-bold transition-colors text-slate-500 group-focus-within:text-red-600">Appointment Date <span className="text-red-500">*</span></label>
                <input type="date" value={appointmentDate} onChange={e => setAppointmentDate(e.target.value)} required
                  className="w-full p-4 font-semibold transition-all border-2 outline-none bg-slate-50 border-slate-100 rounded-2xl text-slate-700 focus:bg-white focus:border-red-400 focus:ring-4 focus:ring-red-100" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 pb-3 mb-5 border-b border-slate-100">
              <span className="text-xl">🩸</span>
              <h3 className="text-lg font-extrabold tracking-tight text-slate-700">Clinical Parameters</h3>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {fields.map((field) => (
                <div key={field.name} className="relative group">
                  <label className="block mb-2 ml-1 text-sm font-bold transition-colors text-slate-500 group-focus-within:text-red-600">{field.label}</label>
                  <input type="number" name={field.name} step={field.step || "1"} value={formData[field.name]} onChange={handleChange}
                    placeholder={field.placeholder} required
                    className="w-full p-4 font-semibold transition-all border-2 outline-none bg-slate-50 border-slate-100 rounded-2xl text-slate-700 focus:bg-white focus:border-red-400 focus:ring-4 focus:ring-red-100" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button type="submit" disabled={loading}
              className="px-16 py-5 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-xl shadow-red-200 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-4 text-lg uppercase tracking-widest">
              {loading ? (
                <span className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-white animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Processing Data...
                </span>
              ) : <>⚡ Run Metabolic Scan</>}
            </button>
          </div>
        </form>

        {prediction && !prediction.error && (
          <div className="px-8 pb-12 lg:px-12">
            <div className={`p-8 lg:p-12 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-8 border-2 transition-all ${
              prediction.value === 1 ? "bg-amber-50 border-amber-100" : "bg-emerald-50 border-emerald-100"}`}>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className={`inline-block px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                    prediction.value === 1 ? "bg-amber-200 text-amber-800" : "bg-emerald-200 text-emerald-800"}`}>
                    Diagnostic Result
                  </span>
                  <span className="text-xs font-medium text-slate-400">{patientName} · {appointmentDate}</span>
                </div>
                <h3 className={`text-5xl font-black mb-2 ${prediction.value === 1 ? "text-amber-900" : "text-emerald-900"}`}>
                  {prediction.value === 1 ? "Positive Detected" : "Negative Detected"}
                </h3>
                <p className="max-w-md font-medium text-slate-500">
                  {prediction.value === 1
                    ? "High metabolic risk detected. Further clinical examination is advised."
                    : "Low probability of diabetes based on the provided clinical parameters."}
                </p>
              </div>
              <div className="flex items-center gap-6 p-6 bg-white border shadow-sm rounded-3xl border-slate-100">
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none">Confidence</p>
                  <p className="text-xl italic font-bold text-slate-800">Index</p>
                </div>
                <div className={`text-6xl font-black ${prediction.value === 1 ? "text-amber-600" : "text-emerald-600"}`}>
                  {(prediction.probability * 100).toFixed(1)}<span className="text-2xl">%</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-6 bg-blue-50 border-2 border-blue-100 rounded-[1.5rem]">
              <label className="block mb-2 text-sm font-black tracking-widest text-blue-700 uppercase">
                📋 Doctor's Prescription <span className="font-medium tracking-normal text-blue-400 normal-case">(optional)</span>
              </label>
              <textarea
                rows={4}
                value={prescription}
                onChange={e => setPrescription(e.target.value)}
                placeholder="e.g. Metformin 500mg twice daily, HbA1c recheck in 3 months, low-carb diet..."
                className="w-full p-4 font-medium transition-all bg-white border-2 border-blue-100 outline-none resize-none text-slate-700 rounded-2xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-4">
              <button onClick={handleSave} disabled={saving || saved}
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                  saved ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-200 cursor-default"
                        : "bg-slate-900 hover:bg-red-600 text-white shadow-lg hover:-translate-y-0.5"}`}>
                {saving ? (
                  <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Saving...</>
                ) : saved ? <>✅ Saved to Records</> : <>💾 Save to Patient Records</>}
              </button>
              <button onClick={() => downloadPDF(formData, patientName, appointmentDate, prediction, prescription)}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white shadow-lg hover:-translate-y-0.5 transition-all">
                📄 Download PDF Report
              </button>
            </div>

            {saved && (
              <p className="mt-3 text-xs font-semibold text-emerald-600">
                ✓ Analysis saved under <strong>{patientName}</strong> — {appointmentDate}. View it in <strong>Medical Analyses</strong>.
              </p>
            )}
          </div>
        )}

        {prediction?.error && (
          <div className="px-8 pb-12 lg:px-12">
            <div className="flex items-center gap-4 p-6 text-red-600 border-2 border-red-100 bg-red-50 rounded-3xl">
              <span className="text-3xl">⚠️</span>
              <div className="font-bold tracking-tight uppercase">System Error: {prediction.error}</div>
            </div>
          </div>
        )}
      </div>
      <p className="text-center mt-6 text-slate-400 text-xs font-medium uppercase tracking-[0.3em]">
        Clinical Decision Support System — HeartDoc v1.0
      </p>
    </div>
  );
};

export default DiabetesForm;
