import React from "react";
import { useNavigate } from "react-router-dom";

const DoctorPredictor = () => {
  const navigate = useNavigate();

  const tools = [
    {
      route:       "/doctor-heart-disease",
      badge:       "AI Analysis",
      badgeColor:  "bg-red-50 text-red-600 border border-red-100",
      title:       "Heart Disease Predictor",
      description: "Evaluate patient cardiovascular risk using our XGBoost clinical model.",
      iconBg:      "bg-red-600 shadow-red-200",
      stat:        "AUC 0.896",
      statColor:   "text-red-600 bg-red-50 border-red-100",
      border:      "hover:border-red-200 hover:shadow-red-100/60",
      icon: (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ),
    },
    {
      route:       "/doctor-diabetes",
      badge:       "Lab Analysis",
      badgeColor:  "bg-rose-50 text-rose-600 border border-rose-100",
      title:       "Diabetes Predictor",
      description: "Screen for diabetes markers and metabolic risk indicators.",
      iconBg:      "bg-rose-700 shadow-rose-200",
      stat:        "8 Biomarkers",
      statColor:   "text-rose-600 bg-rose-50 border-rose-100",
      border:      "hover:border-rose-200 hover:shadow-rose-100/60",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="p-8 lg:p-12 bg-[#FDFBFB] min-h-screen">

      {/* ── Header ── */}
      <div className="flex items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800">Diagnostic Tools</h1>
          <p className="mt-1 text-sm font-medium text-slate-400">AI-powered clinical prediction modules</p>
        </div>
        <div className="flex-1 h-px ml-4 bg-gradient-to-r from-red-100 to-transparent"></div>
        <span className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-50 border border-red-100 px-3 py-1.5 rounded-full">
          HeartFlow AI
        </span>
      </div>

      <div className="grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
        {tools.map((tool) => (
          <div
            key={tool.route}
            onClick={() => navigate(tool.route)}
            className={`group relative bg-white border-2 border-slate-100 rounded-[2rem] p-8 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-xl ${tool.border} hover:-translate-y-1`}
          >
            <div className="flex items-start justify-between mb-6">
              <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ${tool.badgeColor}`}>
                {tool.badge}
              </span>
              <div className={`p-4 text-white rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${tool.iconBg}`}>
                {tool.icon}
              </div>
            </div>

            <h3 className="mb-2 text-2xl font-black tracking-tight text-slate-800">
              {tool.title}
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-slate-500">
              {tool.description}
            </p>

            <div className="flex items-center justify-between pt-5 border-t border-slate-100">
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${tool.statColor}`}>
                {tool.stat}
              </span>
              <div className="flex items-center gap-2 transition-colors text-slate-400 group-hover:text-slate-700">
                <span className="text-xs font-bold tracking-widest uppercase">Open</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </div>

            <div className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ring-2 ring-red-200"></div>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
        Clinical Decision Support System — HeartFlow AI Engine
      </p>
    </div>
  );
};

export default DoctorPredictor;
