import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { DoctorContext } from "../../context/DoctorContext";

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

const CARDIO_SELECT_FIELDS = [
  { label: "Blood Pressure (TA)", name: "TA"            },
  { label: "Fasting Glycemia",    name: "glycemie_jeun" },
  { label: "HbA1c",               name: "HbA1c"         },
  { label: "Creatinine",          name: "creatinine"    },
  { label: "Urea",                name: "uree"          },
  { label: "Total Cholesterol",   name: "chol_total"    },
  { label: "HDL Cholesterol",     name: "HDL_chol"      },
  { label: "Triglycerides",       name: "triglycerides" },
  { label: "Albuminuria",         name: "albuminurie"   },
  { label: "ECG",                 name: "ECG"           },
];

const DIABETES_FIELDS = [
  { label: "Pregnancies",       name: "Pregnancies",              unit: ""        },
  { label: "Glucose Level",     name: "Glucose",                  unit: "mg/dL"   },
  { label: "Blood Pressure",    name: "BloodPressure",            unit: "mm Hg"   },
  { label: "Skin Thickness",    name: "SkinThickness",            unit: "mm"      },
  { label: "Insulin Level",     name: "Insulin",                  unit: "mu U/ml" },
  { label: "BMI Index",         name: "BMI",                      unit: "kg/m²"   },
  { label: "Pedigree Function", name: "DiabetesPedigreeFunction", unit: ""        },
  { label: "Patient Age",       name: "Age",                      unit: "years"   },
];

const clinicalLabel = (val) => {
  if (val === "" || val === null || val === undefined) return "Unknown";
  if (Number(val) === 0) return "Normal";
  if (Number(val) === 1) return "High";
  if (Number(val) === 2) return "Low";
  return val;
};

const toggleLabel = (name, val) =>
  TOGGLE_FIELDS.find(f => f.name === name)?.options.find(o => o.value === Number(val))?.label ?? val;

const CardioExpanded = ({ cd }) => (
  <div className="grid grid-cols-1 gap-6 px-6 pt-6 pb-4 border-t border-slate-100 md:grid-cols-3">
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Patient Info</p>
      <table className="w-full text-sm">
        <tbody>
          {[
            ["Age",    cd.age ? `${cd.age} years` : "—"],
            ["Gender", toggleLabel("sexe", cd.sexe)],
            ["Weight", cd.poids ? `${cd.poids} kg` : "—"],
            ["Height", cd.taille ? `${cd.taille} m` : "—"],
            ["BMI",    cd.BMI || "—"],
          ].map(([k, v]) => (
            <tr key={k} className="border-b border-slate-100 last:border-0">
              <td className="py-2 pr-4 font-bold text-slate-500">{k}</td>
              <td className="py-2 font-semibold text-slate-800">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Risk Factors</p>
      <table className="w-full text-sm">
        <tbody>
          {TOGGLE_FIELDS.filter(f => f.name !== "sexe").map(f => (
            <tr key={f.name} className="border-b border-slate-100 last:border-0">
              <td className="py-2 pr-4 font-bold text-slate-500">{f.label}</td>
              <td className={`py-2 font-semibold ${toggleLabel(f.name, cd[f.name]) === "Yes" ? "text-amber-700" : "text-slate-800"}`}>
                {toggleLabel(f.name, cd[f.name])}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Clinical Results</p>
      <table className="w-full text-sm">
        <tbody>
          {CARDIO_SELECT_FIELDS.map(f => {
            const label = clinicalLabel(cd[f.name]);
            return (
              <tr key={f.name} className="border-b border-slate-100 last:border-0">
                <td className="py-2 pr-4 font-bold text-slate-500">{f.label}</td>
                <td className={`py-2 font-semibold ${
                  label === "High"    ? "text-red-600" :
                  label === "Low"     ? "text-amber-600" :
                  label === "Unknown" ? "text-slate-400 italic" :
                  "text-emerald-700"
                }`}>{label}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

const DiabetesExpanded = ({ cd }) => (
  <div className="px-6 pt-6 pb-4 border-t border-slate-100">
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Clinical Parameters</p>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {DIABETES_FIELDS.map(f => {
        const val = cd[f.name];
        const display = (val !== "" && val !== null && val !== undefined)
          ? `${val}${f.unit ? " " + f.unit : ""}` : "—";
        return (
          <div key={f.name} className="p-4 border bg-slate-50 rounded-2xl border-slate-100">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">{f.label}</p>
            <p className="text-lg font-black text-slate-800">{display}</p>
          </div>
        );
      })}
    </div>
  </div>
);

const AnalysisCard = ({ analysis, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const riskHigh = analysis.probability > 50;
  const cd = analysis.clinicalData || {};
  const isDiabetes = cd.Glucose !== undefined || cd.Insulin !== undefined;

  const handleDelete = async () => {
    if (!window.confirm(`Delete analysis for ${analysis.patientName}?`)) return;
    setDeleting(true);
    await onDelete(analysis._id);
    setDeleting(false);
  };

  return (
    <div className={`rounded-[1.5rem] border-2 overflow-hidden transition-all duration-300 ${
      riskHigh ? "border-amber-100 bg-amber-50/40" : "border-emerald-100 bg-emerald-50/40"
    }`}>
      {/* Card header */}
      <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black ${
            riskHigh ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
          }`}>
            {analysis.patientName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-base font-black text-slate-800">{analysis.patientName}</p>
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                isDiabetes ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600"
              }`}>
                {isDiabetes ? "🩸 Diabetes" : "❤️ Cardiac"}
              </span>
            </div>
            <p className="text-xs font-medium text-slate-400">{analysis.appointmentDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
            riskHigh ? "bg-amber-200 text-amber-800" : "bg-emerald-200 text-emerald-800"
          }`}>
            {analysis.prediction}
          </span>
          <div className={`text-3xl font-black ${riskHigh ? "text-amber-600" : "text-emerald-600"}`}>
            {Math.round(analysis.probability)}<span className="text-base">%</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-white border-2 border-slate-100 text-slate-600 hover:border-red-200 hover:text-red-600 transition-all">
            {expanded ? "▲ Collapse" : "▼ Full Data"}
          </button>
          <button onClick={handleDelete} disabled={deleting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-white border-2 border-red-100 text-red-500 hover:bg-red-600 hover:text-white transition-all disabled:opacity-50">
            {deleting ? "..." : "🗑 Delete"}
          </button>
        </div>
      </div>

      {expanded && (
        <>
          {isDiabetes ? <DiabetesExpanded cd={cd} /> : <CardioExpanded cd={cd} />}

          {analysis.prescription && (
            <div className="p-5 mx-6 mt-2 mb-4 border-2 border-blue-100 bg-blue-50 rounded-2xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">📋 Doctor's Prescription</p>
              <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap text-slate-700">{analysis.prescription}</p>
            </div>
          )}

          <div className="px-6 pb-4">
            <p className="text-[10px] text-slate-400 font-medium">
              Saved on {new Date(analysis.createdAt).toLocaleString()}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

const PatientDossier = () => {
  const { dToken, backendUrl } = useContext(DoctorContext);
  const [analyses, setAnalyses] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("all");

  const fetchAnalyses = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/analyses`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      if (data.success) setAnalyses(data.analyses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnalyses(); }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/doctor/analysis/${id}`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      setAnalyses(prev => prev.filter(a => a._id !== id));
    } catch {
      alert("Failed to delete. Please try again.");
    }
  };

  const filtered = analyses.filter(a => {
    const cd = a.clinicalData || {};
    const isDiabetes = cd.Glucose !== undefined || cd.Insulin !== undefined;
    const matchName = a.patientName?.toLowerCase().includes(search.toLowerCase());
    const matchType =
      filter === "all"      ? true :
      filter === "diabetes" ? isDiabetes :
      !isDiabetes;
    return matchName && matchType;
  });

  const cardiacCount  = analyses.filter(a => { const cd = a.clinicalData||{}; return !(cd.Glucose!==undefined||cd.Insulin!==undefined); }).length;
  const diabetesCount = analyses.filter(a => { const cd = a.clinicalData||{}; return cd.Glucose!==undefined||cd.Insulin!==undefined; }).length;

  return (
    <div className="px-4 pb-12 mx-auto mt-8 max-w-7xl">
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-red-100/50 border border-red-50 overflow-hidden">

        {/* Header */}
        <div className="flex flex-col items-center justify-between p-8 text-white bg-gradient-to-r from-red-600 to-red-700 md:flex-row">
          <div className="mb-4 text-center md:text-left md:mb-0">
            <h2 className="text-3xl font-extrabold tracking-tight">Medical Dossier</h2>
            <p className="text-red-100 opacity-80">All saved analyses — cardiac & metabolic</p>
          </div>
          <div className="flex gap-4">
            <div className="px-5 py-3 text-center border bg-white/10 backdrop-blur-md rounded-2xl border-white/20">
              <span className="block text-[10px] font-bold tracking-widest uppercase opacity-70">❤️ Cardiac</span>
              <span className="text-2xl font-black">{cardiacCount}</span>
            </div>
            <div className="px-5 py-3 text-center border bg-white/10 backdrop-blur-md rounded-2xl border-white/20">
              <span className="block text-[10px] font-bold tracking-widest uppercase opacity-70">🩸 Diabetes</span>
              <span className="text-2xl font-black">{diabetesCount}</span>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6 lg:p-12">
          {/* Search + Filter */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <span className="absolute text-lg -translate-y-1/2 left-4 top-1/2 text-slate-400">🔍</span>
              <input type="text" placeholder="Search by patient name..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full py-4 pl-12 pr-4 font-semibold transition-all border-2 outline-none border-slate-100 rounded-2xl bg-slate-50 text-slate-700 focus:bg-white focus:border-red-400 focus:ring-4 focus:ring-red-100" />
            </div>
            <div className="flex overflow-hidden border-2 rounded-2xl border-slate-100">
              {[
                { key: "all",      label: "All"        },
                { key: "cardiac",  label: "❤️ Cardiac" },
                { key: "diabetes", label: "🩸 Diabetes" },
              ].map(opt => (
                <button key={opt.key} onClick={() => setFilter(opt.key)}
                  className={`px-5 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                    filter === opt.key ? "bg-red-600 text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24 text-slate-400">
              <svg className="w-8 h-8 mr-3 text-red-400 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Loading records...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="mb-4 text-5xl">🗂️</span>
              <p className="text-lg font-black text-slate-400">
                {search ? "No analyses match that name." : "No analyses saved yet."}
              </p>
              <p className="mt-1 text-sm text-slate-300">Run a scan and save the result to see it here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(a => (
                <AnalysisCard key={a._id} analysis={a} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
      <p className="text-center mt-6 text-slate-400 text-xs font-medium uppercase tracking-[0.3em]">
        Clinical Decision Support System — HeartDoc v1.0 · XGBoost + SMOTE
      </p>
    </div>
  );
};

export default PatientDossier;