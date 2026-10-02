import { useNavigate } from "react-router-dom";

const modules = [
  {
    title:    "Heart Risk Assessment",
    subtitle: "Personal Health Analysis",
    desc:     "Evaluate cardiovascular risk based on biometrics, lifestyle, and clinical pressure readings.",
    path:     "/predictor/patient",
    badge:    "AI Analysis",
    stat:     "XGBoost · AUC 0.896",
    iconBg:   "bg-red-600 shadow-red-200",
    ring:     "hover:border-red-200 hover:shadow-red-100/60",
    textAccent: "text-red-600",
    badgeColor: "bg-red-50 text-red-600 border-red-100",
    statColor:  "bg-red-50 text-red-500 border-red-100",
    icon: (
      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
  },
  {
    title:    "Diabetes Screening",
    subtitle: "Metabolic Medical Analysis",
    desc:     "Advanced prediction model based on glucose levels, insulin, and genetic indicators.",
    path:     "/predictor/diabetes",
    badge:    "Lab Analysis",
    stat:     "8 Biomarkers",
    iconBg:   "bg-rose-700 shadow-rose-200",
    ring:     "hover:border-rose-200 hover:shadow-rose-100/60",
    textAccent: "text-rose-700",
    badgeColor: "bg-rose-50 text-rose-600 border-rose-100",
    statColor:  "bg-rose-50 text-rose-500 border-rose-100",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
  },
];

const Predictor = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] p-6 bg-[#FDFBFB]">

      <div className="text-center mb-14">
        <span className="px-4 py-1.5 mb-4 inline-block text-[10px] font-black tracking-widest text-red-600 uppercase bg-red-50 border border-red-100 rounded-full">
          AI Diagnostic Suite
        </span>
        <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
          HeartFlow{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500">
            Intelligence
          </span>
        </h2>
        <p className="max-w-md mx-auto mt-4 text-base leading-relaxed text-slate-500">
          Select a specialized diagnostic module to begin your health analysis.
        </p>
      </div>

      <div className="grid w-full max-w-5xl gap-8 md:grid-cols-2">
        {modules.map((m, idx) => (
          <div
            key={idx}
            onClick={() => navigate(m.path)}
            className={`group relative overflow-hidden bg-white p-8 cursor-pointer rounded-[2rem] border-2 border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${m.ring}`}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.025] transition-opacity bg-red-600 rounded-[2rem]" />

            <div className="relative z-10">

              <div className="flex items-start justify-between mb-6">
                <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border ${m.badgeColor}`}>
                  {m.badge}
                </span>
                <div className={`p-4 text-white rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${m.iconBg}`}>
                  {m.icon}
                </div>
              </div>

              <p className={`text-[10px] font-black tracking-widest uppercase mb-1 ${m.textAccent}`}>
                {m.subtitle}
              </p>

              <h3 className="mb-3 text-2xl font-black tracking-tight text-slate-800">
                {m.title}
              </h3>

              <p className="mb-8 text-sm leading-relaxed text-slate-500">
                {m.desc}
              </p>

              <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${m.statColor}`}>
                  {m.stat}
                </span>
                <div className={`flex items-center gap-2 font-bold text-sm text-slate-400 transition-colors group-hover:${m.textAccent}`}>
                  Launch Module
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ring-2 ring-red-200" />
          </div>
        ))}
      </div>

      <p className="mt-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
        Clinical Decision Support System — HeartFlow AI Engine
      </p>
    </div>
  );
};

export default Predictor;
