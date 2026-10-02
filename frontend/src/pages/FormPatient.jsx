import { useState } from "react";
import axios from "axios";

const FormPatient = () => {
  const [form, setForm] = useState({
    height: "", weight: "", HighBP: 0, HighChol: 0, Smoker: 0,
    PhysActivity: 0, Fruits: 0, Veggies: 0, HvyAlcoholConsump: 0,
    Stroke: 0, HeartDiseaseorAttack: 0, DiffWalk: 0,
    GenHlth: 3, MentHlth: 0, PhysHlth: 0, Sex: 0, Age: 7
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const setValue = (key, value) => setForm({ ...form, [key]: value });

  const calculateBMI = () => {
    if (!form.height || !form.weight) return 0;
    const h = form.height / 100;
    return (form.weight / (h * h)).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`${import.meta.env.VITE_ML_URL || "http://localhost:5001"}/predict-patient-diabetes`, {
        ...form,
        BMI: parseFloat(calculateBMI()),
        CholCheck: 1, AnyHealthcare: 1, NoDocbcCost: 0, Education: 4, Income: 5,
        MentHlth: Number(form.MentHlth), PhysHlth: Number(form.PhysHlth)
      });
      setResult(res.data);
    } catch (err) {
      setResult({ error: "Prediction failed. Is the server running?" });
    }
    setLoading(false);
  };

  return (
    <div className="px-4 mx-auto mt-8 max-w-7xl">
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-red-100/50 border border-red-50 overflow-hidden">
        
        <div className="flex flex-col items-center justify-between p-8 text-white bg-gradient-to-r from-red-600 to-rose-700 md:flex-row">
          <div className="mb-4 text-center md:text-left md:mb-0">
            <h2 className="text-3xl font-extrabold tracking-tight">Patient Lifestyle Screening</h2>
            <p className="text-red-100 opacity-80">Full-Spectrum Diabetes Risk Assessment</p>
          </div>
          <div className="px-6 py-3 border bg-white/10 backdrop-blur-md rounded-2xl border-white/20">
            <span className="block text-xs font-bold tracking-widest uppercase opacity-70">Metric Engine</span>
            <span className="flex items-center gap-2 font-mono">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span> Diagnostic Ready
            </span>
          </div>
        </div>

        <div className="p-8 lg:p-12">
          <form onSubmit={handleSubmit} className="space-y-12">
            
            <div>
              <h3 className="mb-6 text-xs font-black tracking-[0.2em] text-red-600 uppercase border-b border-red-50 pb-2">Physical Biometrics</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <InputGroup label="Height" unit="cm" placeholder="175" onChange={(val) => setValue("height", val)} />
                <InputGroup label="Weight" unit="kg" placeholder="70" onChange={(val) => setValue("weight", val)} />
                <SelectGroup label="Gender" options={[{l: "Female", v:0}, {l:"Male", v:1}]} onChange={(val) => setValue("Sex", val)} />
                <SelectGroup label="Age Group" onChange={(val) => setValue("Age", val)} options={[
                  {l:"50–54", v:7}, {l:"55–59", v:8}, {l:"60–64", v:9}, {l:"65–69", v:10}, {l:"70–74", v:11}, {l:"75–79", v:12}, {l:"80+", v:13}
                ]} />
              </div>
            </div>

            <div>
              <h3 className="mb-6 text-xs font-black tracking-[0.2em] text-red-600 uppercase border-b border-red-50 pb-2">Medical History & Indicators</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <ToggleGroup label="High Blood Pressure" value={form.HighBP} onChange={(v) => setValue("HighBP", v)} />
                <ToggleGroup label="High Cholesterol" value={form.HighChol} onChange={(v) => setValue("HighChol", v)} />
                <ToggleGroup label="History of Stroke" value={form.Stroke} onChange={(v) => setValue("Stroke", v)} />
                <ToggleGroup label="Heart Disease" value={form.HeartDiseaseorAttack} onChange={(v) => setValue("HeartDiseaseorAttack", v)} />
              </div>
            </div>

            <div>
              <h3 className="mb-6 text-xs font-black tracking-[0.2em] text-red-600 uppercase border-b border-red-50 pb-2">Lifestyle & Habits</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <ToggleGroup label="Current Smoker" value={form.Smoker} onChange={(v) => setValue("Smoker", v)} />
                <ToggleGroup label="Regular Exercise" value={form.PhysActivity} onChange={(v) => setValue("PhysActivity", v)} />
                <ToggleGroup label="Daily Fruit Intake" value={form.Fruits} onChange={(v) => setValue("Fruits", v)} />
                <ToggleGroup label="Daily Veggie Intake" value={form.Veggies} onChange={(v) => setValue("Veggies", v)} />
                <ToggleGroup label="Heavy Alcohol" value={form.HvyAlcoholConsump} onChange={(v) => setValue("HvyAlcoholConsump", v)} />
                <ToggleGroup label="Walking Difficulty" value={form.DiffWalk} onChange={(v) => setValue("DiffWalk", v)} />
                <InputGroup label="Poor Mental Days" unit="/mo" placeholder="0" onChange={(val) => setValue("MentHlth", val)} />
                <InputGroup label="Poor Physical Days" unit="/mo" placeholder="0" onChange={(val) => setValue("PhysHlth", val)} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full gap-4 py-6 text-lg font-black tracking-widest text-white uppercase transition-all bg-red-600 shadow-xl hover:bg-red-700 rounded-2xl shadow-red-100"
            >
              {loading ? "Processing Clinical Data..." : "Generate Risk Assessment Report"}
            </button>
          </form>

          {result && (
            <div className="pt-10 mt-12 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-8">
              {result.error ? (
                <div className="p-6 font-bold text-center text-red-600 uppercase border-2 border-red-200 bg-red-50 rounded-3xl">
                  Error: {result.error}
                </div>
              ) : (
                <div className={`p-8 lg:p-12 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-8 ${
                  result.prediction > 60 ? "bg-red-50 border-2 border-red-100" : "bg-emerald-50 border-2 border-emerald-100"
                }`}>
                  <div className="flex-1 text-center md:text-left">
                    <span className="inline-block px-4 py-1 mb-3 text-xs font-black tracking-widest uppercase rounded-full bg-white/50 text-slate-800">
                      Analysis Verdict
                    </span>
                    <h3 className={`text-5xl font-black mb-2 ${result.prediction > 60 ? "text-red-900" : "text-emerald-900"}`}>
                      {result.prediction > 60 ? "Elevated Risk" : result.prediction > 30 ? "Moderate Risk" : "Low Risk Factors"}
                    </h3>
                    <p className="max-w-md font-medium text-slate-500">
                      Based on the provided lifestyle parameters and medical history, the system has calculated a {result.prediction}% probability index.
                    </p>
                  </div>

                  <div className="flex items-center gap-6 p-6 bg-white border shadow-sm rounded-3xl border-slate-100">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none">Probability</p>
                      <p className="text-xl italic font-bold text-slate-800">Index</p>
                    </div>
                    <div className={`text-6xl font-black ${result.prediction > 60 ? "text-red-600" : "text-emerald-600"}`}>
                      {result.prediction}<span className="text-2xl">%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, unit, placeholder, onChange }) => (
  <div className="flex flex-col">
    <label className="mb-2 ml-1 text-xs font-bold uppercase text-slate-500">{label}</label>
    <div className="relative">
      <input 
        type="number" 
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 font-semibold transition-all border-2 outline-none bg-slate-50 border-slate-100 rounded-2xl text-slate-700 focus:bg-white focus:border-red-400" 
      />
      <span className="absolute right-4 top-4 text-[10px] font-bold text-slate-300 uppercase">{unit}</span>
    </div>
  </div>
);

const SelectGroup = ({ label, options, onChange }) => (
  <div className="flex flex-col">
    <label className="mb-2 ml-1 text-xs font-bold uppercase text-slate-500">{label}</label>
    <select 
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-4 font-semibold transition-all border-2 outline-none appearance-none bg-slate-50 border-slate-100 rounded-2xl text-slate-700 focus:bg-white focus:border-red-400"
    >
      {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  </div>
);

const ToggleGroup = ({ label, value, onChange }) => (
  <div className="flex flex-col">
    <label className="mb-2 ml-1 text-xs font-bold uppercase text-slate-500">{label}</label>
    <div className="flex gap-2">
      {[ {l: "Yes", v: 1}, {l: "No", v: 0} ].map(opt => (
        <button
          key={opt.l}
          type="button"
          onClick={() => onChange(opt.v)}
          className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase transition-all ${
            value === opt.v 
            ? "bg-red-600 text-white shadow-md shadow-red-100" 
            : "bg-slate-50 text-slate-400 hover:bg-slate-100"
          }`}
        >
          {opt.l}
        </button>
      ))}
    </div>
  </div>
);

export default FormPatient;