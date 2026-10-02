import React, { useState, useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import axios from "axios";

const TOGGLE_FIELDS = [
  { label: "Gender",            name: "sexe",            options: [{ label: "Female", value: 0 }, { label: "Male",  value: 1 }] },
  { label: "Smoking",           name: "tabac",           options: [{ label: "No",     value: 0 }, { label: "Yes",   value: 1 }] },
  { label: "Alcohol",           name: "ethylisme",       options: [{ label: "No",     value: 0 }, { label: "Yes",   value: 1 }] },
  { label: "Personal History",  name: "ATCD_perso",      options: [{ label: "None",   value: 0 }, { label: "Yes",   value: 1 }] },
  { label: "Family — Diabetes", name: "ATCD_fam_Db",     options: [{ label: "No",     value: 0 }, { label: "Yes",   value: 1 }] },
  { label: "Family — HTA",      name: "ATCD_fam_HTA",    options: [{ label: "No",     value: 0 }, { label: "Yes",   value: 1 }] },
  { label: "Family — Renal",    name: "ATCD_fam_IR",     options: [{ label: "No",     value: 0 }, { label: "Yes",   value: 1 }] },
  { label: "Family — Cardiac",  name: "ATCD_fam_Cardio", options: [{ label: "No",     value: 0 }, { label: "Yes",   value: 1 }] },
];

const SELECT_FIELDS = [
  { label: "Blood Pressure (TA)", name: "TA",            required: true,  options: [{ label: "Normal (N)", value: 0 }, { label: "High (H)", value: 1 }] },
  { label: "Fasting Glycemia",    name: "glycemie_jeun", required: true,  options: [{ label: "Normal (N)", value: 0 }, { label: "High (H)", value: 1 }] },
  { label: "HbA1c",               name: "HbA1c",         required: true,  options: [{ label: "Normal (N)", value: 0 }, { label: "High (H)", value: 1 }] },
  { label: "Creatinine",          name: "creatinine",    required: false, options: [{ label: "Unknown / Missing", value: "" }, { label: "Normal (N)", value: 0 }, { label: "High (H)", value: 1 }] },
  { label: "Urea",                name: "uree",          required: false, options: [{ label: "Unknown / Missing", value: "" }, { label: "Normal (N)", value: 0 }, { label: "High (H)", value: 1 }] },
  { label: "Total Cholesterol",   name: "chol_total",    required: false, options: [{ label: "Unknown / Missing", value: "" }, { label: "Normal (N)", value: 0 }, { label: "High (H)", value: 1 }] },
  { label: "HDL Cholesterol",     name: "HDL_chol",      required: false, options: [{ label: "Unknown / Missing", value: "" }, { label: "Normal (N)", value: 0 }, { label: "High (H)", value: 1 }, { label: "Low (L)", value: 2 }] },
  { label: "Triglycerides",       name: "triglycerides", required: false, options: [{ label: "Unknown / Missing", value: "" }, { label: "Normal (N)", value: 0 }, { label: "High (H)", value: 1 }] },
  { label: "Albuminuria",         name: "albuminurie",   required: false, options: [{ label: "Unknown / Missing", value: "" }, { label: "Normal (N)", value: 0 }, { label: "High (H)", value: 1 }] },
  { label: "ECG",                 name: "ECG",           required: true,  options: [{ label: "Normal (N)", value: 0 }, { label: "Abnormal (H)", value: 1 }] },
];

const INITIAL = {
  patientName: "", appointmentDate: new Date().toISOString().split("T")[0],
  age: "", poids: "", taille: "", BMI: "",
  sexe: 0, tabac: 0, ethylisme: 0,
  ATCD_perso: 0, ATCD_fam_Db: 0, ATCD_fam_HTA: 0, ATCD_fam_IR: 0, ATCD_fam_Cardio: 0,
  TA: 0, glycemie_jeun: 0, HbA1c: 0, ECG: 0,
  creatinine: "", uree: "", chol_total: "", HDL_chol: "", triglycerides: "", albuminurie: "",
};

const toggleLabel = (name, val) =>
  TOGGLE_FIELDS.find(f => f.name === name)?.options.find(o => o.value === val)?.label ?? val;
const selectLabel = (name, val) =>
  SELECT_FIELDS.find(f => f.name === name)?.options.find(o => String(o.value) === String(val))?.label ?? (val === "" ? "Unknown" : val);

const downloadPDF = (features, result, prescription) => {
  const riskHigh = result.probability > 50;
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
               background:${riskHigh?"#FFF7ED":"#F0FDF4"};
               border:2px solid ${riskHigh?"#FED7AA":"#BBF7D0"};}
      .verdict h3{margin:0 0 6px;color:${riskHigh?"#92400E":"#166534"};font-size:18px;}
      .score{font-size:42px;font-weight:900;color:${riskHigh?"#D97706":"#16A34A"};}
      .prescription{margin-top:24px;padding:16px 20px;border-radius:10px;background:#F8FAFF;border:2px solid #DBEAFE;}
      .prescription h2{color:#1E40AF;border-color:#BFDBFE;}
      .prescription p{white-space:pre-wrap;color:#1e293b;line-height:1.6;}
      .disclaimer{margin-top:32px;font-size:11px;color:#999;border-top:1px solid #eee;padding-top:12px;}
    </style></head><body>
    <h1>❤️ HeartFlow — Cardiac Risk Report</h1>
    <div class="meta">
      <span><strong>Patient:</strong> ${features.patientName}</span>
      <span><strong>Date:</strong> ${features.appointmentDate}</span>
      <span><strong>Generated:</strong> ${new Date().toLocaleString()}</span>
    </div>
    <h2>Patient Information</h2>
    <table>
      <tr><th>Age</th><td>${features.age} years</td></tr>
      <tr><th>Gender</th><td>${toggleLabel("sexe",features.sexe)}</td></tr>
      <tr><th>Weight</th><td>${features.poids} kg</td></tr>
      <tr><th>Height</th><td>${features.taille} m</td></tr>
      <tr><th>BMI</th><td>${features.BMI}</td></tr>
    </table>
    <h2>Personal & Family Risk Factors</h2>
    <table>${TOGGLE_FIELDS.filter(f=>f.name!=="sexe").map(f=>`<tr><th>${f.label}</th><td>${toggleLabel(f.name,features[f.name])}</td></tr>`).join("")}</table>
    <h2>Clinical & Biological Results</h2>
    <table>${SELECT_FIELDS.map(f=>`<tr><th>${f.label}</th><td>${selectLabel(f.name,features[f.name])}</td></tr>`).join("")}</table>
    <div class="verdict">
      <h3>${result.prediction}</h3>
      <div class="score">${Math.round(result.probability)}<span style="font-size:20px">%</span></div>
      <p style="margin:8px 0 0;color:#555;">${riskHigh?"Notable cardiac risk detected. Further clinical examination is advised.":"Favorable cardiovascular profile based on the provided clinical data."}</p>
    </div>
    ${prescription ? `<div class="prescription"><h2>📋 Doctor's Prescription</h2><p>${prescription}</p></div>` : ""}
    <div class="disclaimer">⚕️ This report is a clinical decision-support tool only and does not replace a formal medical diagnosis. Model: XGBoost + SMOTE · AUC-ROC 0.896 · HeartDoc v1.0</div>
    </body></html>`;
  const win = window.open("","_blank");
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(()=>{win.print();win.close();},500);
};

const MLPrediction = () => {
  const { getHeartPrediction, dToken, backendUrl } = useContext(DoctorContext);
  const [features,     setFeatures]     = useState(INITIAL);
  const [result,       setResult]       = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [saved,        setSaved]        = useState(false);
  const [prescription, setPrescription] = useState("");

  const calcBMI = (poids, taille) => {
    const p = parseFloat(poids), t = parseFloat(taille);
    return p > 0 && t > 0 ? (p/(t*t)).toFixed(1) : "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeatures((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "poids" || name === "taille")
        updated.BMI = calcBMI(name==="poids"?value:prev.poids, name==="taille"?value:prev.taille);
      return updated;
    });
  };

  const handleToggle = (name, value) =>
    setFeatures((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!features.patientName.trim()) return alert("Please enter the patient name.");
    setLoading(true);
    setSaved(false);
    setPrescription("");
    const response = await getHeartPrediction(features);
    if (response) setResult(response);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!result) return;
    setSaving(true);
    try {
      await axios.post(
        `${backendUrl}/api/doctor/save-analysis`,
        {
          patientName:     features.patientName,
          appointmentDate: features.appointmentDate,
          clinicalData:    features,
          prediction:      result.prediction,
          probability:     result.probability,
          prescription:    prescription.trim(),
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

  const riskHigh = result?.probability > 50;

  return (
    <div className="px-4 pb-12 mx-auto mt-8 max-w-7xl">
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-red-100/50 border border-red-50 overflow-hidden">

        <div className="flex flex-col items-center justify-between p-8 text-white bg-gradient-to-r from-red-600 to-red-700 md:flex-row">
          <div className="mb-4 text-center md:text-left md:mb-0">
            <h2 className="text-3xl font-extrabold tracking-tight">Cardiovascular Analysis</h2>
            <p className="text-red-100 opacity-80">AI-Powered Heart Disease Predictive Screening</p>
          </div>
          <div className="px-6 py-3 border bg-white/10 backdrop-blur-md rounded-2xl border-white/20">
            <span className="block text-xs font-bold tracking-widest uppercase opacity-70">Model</span>
            <span className="flex items-center gap-2 font-mono text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
              XGBoost · AUC 0.896
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10 lg:p-12">
          <Section icon="📋" title="Patient Identity">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="relative group">
                <label className="block mb-2 ml-1 text-sm font-bold transition-colors text-slate-500 group-focus-within:text-red-600">Full Name <span className="text-red-500">*</span></label>
                <input type="text" name="patientName" value={features.patientName} onChange={handleChange} placeholder="e.g. Mohamed Ben Ali" required
                  className="w-full p-4 font-semibold transition-all border-2 outline-none bg-slate-50 border-slate-100 rounded-2xl text-slate-700 focus:bg-white focus:border-red-400 focus:ring-4 focus:ring-red-100" />
              </div>
              <div className="relative group">
                <label className="block mb-2 ml-1 text-sm font-bold transition-colors text-slate-500 group-focus-within:text-red-600">Appointment Date <span className="text-red-500">*</span></label>
                <input type="date" name="appointmentDate" value={features.appointmentDate} onChange={handleChange} required
                  className="w-full p-4 font-semibold transition-all border-2 outline-none bg-slate-50 border-slate-100 rounded-2xl text-slate-700 focus:bg-white focus:border-red-400 focus:ring-4 focus:ring-red-100" />
              </div>
            </div>
          </Section>

          <Section icon="👤" title="Patient Information">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <NumberField label="Age (years)" name="age"    placeholder="e.g. 55"   value={features.age}    onChange={handleChange} required />
              <NumberField label="Weight (kg)" name="poids"  placeholder="e.g. 80"   value={features.poids}  onChange={handleChange} required />
              <NumberField label="Height (m)"  name="taille" placeholder="e.g. 1.72" value={features.taille} onChange={handleChange} step="0.01" required />
              <div className="relative">
                <label className="block mb-2 ml-1 text-sm font-bold text-slate-500">BMI (auto)</label>
                <input type="text" readOnly value={features.BMI || "—"}
                  className="w-full p-4 text-lg font-bold text-center text-red-700 border-2 border-red-100 cursor-default rounded-2xl bg-red-50" />
              </div>
            </div>
          </Section>

          <Section icon="⚠️" title="Personal &amp; Family Risk Factors">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {TOGGLE_FIELDS.map((f) => (
                <ToggleField key={f.name} label={f.label} options={f.options}
                  value={features[f.name]} onChange={(val) => handleToggle(f.name, val)} />
              ))}
            </div>
          </Section>

          <Section icon="🩺" title="Clinical &amp; Biological Results">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {SELECT_FIELDS.map((f) => (
                <SelectField key={f.name} label={f.label} name={f.name}
                  value={features[f.name]} options={f.options} onChange={handleChange} />
              ))}
            </div>
          </Section>

          <div className="flex justify-center pt-2">
            <button type="submit" disabled={loading}
              className="px-16 py-5 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-xl shadow-red-200 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-4 text-lg uppercase tracking-widest">
              {loading ? (
                <span className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-white animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Analyzing...
                </span>
              ) : <>⚡ Run Heart Scan</>}
            </button>
          </div>
        </form>

        {result && (
          <div className="px-8 pb-12 lg:px-12">
            <div className={`p-8 lg:p-12 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-8 border-2 transition-all ${
              riskHigh ? "bg-amber-50 border-amber-100" : "bg-emerald-50 border-emerald-100"}`}>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className={`inline-block px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                    riskHigh ? "bg-amber-200 text-amber-800" : "bg-emerald-200 text-emerald-800"}`}>
                    Diagnostic Verdict
                  </span>
                  <span className="text-xs font-medium text-slate-400">{features.patientName} · {features.appointmentDate}</span>
                </div>
                <h3 className={`text-5xl font-black mb-2 ${riskHigh?"text-amber-900":"text-emerald-900"}`}>{result.prediction}</h3>
                <p className="max-w-md font-medium text-slate-500">
                  {riskHigh ? "Notable cardiac risk detected. Further clinical examination is advised."
                            : "Favorable cardiovascular profile based on the provided clinical data."}
                </p>
              </div>
              <div className="flex items-center gap-6 p-6 bg-white border shadow-sm rounded-3xl border-slate-100">
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none">Risk</p>
                  <p className="text-xl italic font-bold text-slate-800">Score</p>
                </div>
                <div className={`text-6xl font-black ${riskHigh?"text-amber-600":"text-emerald-600"}`}>
                  {Math.round(result.probability)}<span className="text-2xl">%</span>
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
                placeholder="e.g. Aspirin 100mg daily, follow-up echocardiography in 3 months, low-sodium diet..."
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
              <button onClick={() => downloadPDF(features, result, prescription)}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white shadow-lg hover:-translate-y-0.5 transition-all">
                📄 Download PDF Report
              </button>
            </div>

            {saved && (
              <p className="mt-3 text-xs font-semibold text-emerald-600">
                ✓ Analysis saved under <strong>{features.patientName}</strong> — {features.appointmentDate}. View it in <strong>Medical Analyses</strong>.
              </p>
            )}
          </div>
        )}
      </div>
      <p className="text-center mt-6 text-slate-400 text-xs font-medium uppercase tracking-[0.3em]">
        Clinical Decision Support System — HeartDoc v1.0 · XGBoost + SMOTE
      </p>
    </div>
  );
};

const Section = ({ icon, title, children }) => (
  <div>
    <div className="flex items-center gap-3 pb-3 mb-5 border-b border-slate-100">
      <span className="text-xl">{icon}</span>
      <h3 className="text-lg font-extrabold tracking-tight text-slate-700" dangerouslySetInnerHTML={{ __html: title }} />
    </div>
    {children}
  </div>
);

const NumberField = ({ label, name, placeholder, value, onChange, step = "1", required = false }) => (
  <div className="relative group">
    <label className="block mb-2 ml-1 text-sm font-bold transition-colors text-slate-500 group-focus-within:text-red-600">{label}</label>
    <input type="number" name={name} step={step} value={value} onChange={onChange} placeholder={placeholder} required={required}
      className="w-full p-4 font-semibold transition-all border-2 outline-none bg-slate-50 border-slate-100 rounded-2xl text-slate-700 focus:bg-white focus:border-red-400 focus:ring-4 focus:ring-red-100" />
  </div>
);

const ToggleField = ({ label, options, value, onChange }) => (
  <div>
    <label className="block mb-2 ml-1 text-sm font-bold text-slate-500">{label}</label>
    <div className="flex overflow-hidden border-2 rounded-xl border-slate-100">
      {options.map((opt) => (
        <button key={opt.value} type="button" onClick={() => onChange(opt.value)}
          className={`flex-1 py-3 text-sm font-bold transition-all ${
            value === opt.value ? "bg-red-600 text-white shadow-inner" : "bg-slate-50 text-slate-500 hover:bg-slate-100"}`}>
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

const SelectField = ({ label, name, value, options, onChange }) => (
  <div className="relative group">
    <label className="block mb-2 ml-1 text-sm font-bold transition-colors text-slate-500 group-focus-within:text-red-600">{label}</label>
    <select name={name} value={value} onChange={onChange}
      className="w-full p-4 font-semibold transition-all border-2 outline-none appearance-none cursor-pointer bg-slate-50 border-slate-100 rounded-2xl text-slate-700 focus:bg-white focus:border-red-400 focus:ring-4 focus:ring-red-100">
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

export default MLPrediction;