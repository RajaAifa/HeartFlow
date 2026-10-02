import React from "react";

const HeartCare = () => {
  return (
    <div className="min-h-screen px-6 py-20 bg-slate-50 md:px-12 lg:px-24">
      
      <div className="bg-white rounded-[3rem] p-10 md:p-20 shadow-xl shadow-slate-200/50 mb-20 relative overflow-hidden border border-slate-100">
        <div className="absolute top-0 right-0 w-1/2 h-full translate-x-20 -skew-x-12 bg-red-50/50"></div>
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[0.9] tracking-tighter mb-8 uppercase">
            Fuel Your <br /> <span className="text-red-600">Cardiac</span> Engine
          </h1>
          <p className="text-lg font-medium leading-relaxed text-gray-500">
            Discover the synergy between movement and longevity. Our evidence-based 
            protocols transform physical activity into a powerful cardiovascular shield.
          </p>
        </div>
      </div>

      <div className="space-y-12">
        
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 bg-gray-900 rounded-[2.5rem] p-10 text-white flex flex-col justify-between hover:bg-red-600 transition-all duration-700">
             <span className="text-xs font-black uppercase tracking-[0.4em] opacity-50 mb-10">Analysis // 01</span>
             <div>
                <h3 className="mb-4 text-3xl font-black uppercase">Efficient Pumping</h3>
                <p className="leading-relaxed text-gray-400 group-hover:text-white">
                   Exercise trains the heart to eject more blood with every single beat, 
                   lowering your resting heart rate and increasing overall endurance.
                </p>
             </div>
          </div>
          <div className="flex-1 bg-white rounded-[2.5rem] p-10 border border-slate-200">
             <div className="flex items-center gap-4 mb-10">
                <div className="flex items-center justify-center w-12 h-12 font-bold text-red-600 bg-red-100 rounded-2xl">90%</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vascular Elasticity</p>
             </div>
             <h3 className="mb-4 text-3xl font-black tracking-tighter text-gray-900 uppercase">Arterial Health</h3>
             <p className="font-medium text-gray-500">
                Physical activity stimulates the production of nitric oxide, keeping your 
                vessels flexible and reducing the risk of hypertension.
             </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
                { title: "Aerobic", icon: "🏃", color: "bg-white", text: "150 min of moderate cardio per week." },
                { title: "Strength", icon: "💪", color: "bg-white", text: "2 sessions of full-body resistance training." },
                { title: "Flexibility", icon: "🧘", color: "bg-white", text: "Daily stretching or yoga for stress control." }
            ].map((item, i) => (
                <div key={i} className={`${item.color} p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:border-red-600 transition-all group`}>
                    <div className="mb-6 text-4xl">{item.icon}</div>
                    <h4 className="mb-3 text-xl font-black tracking-tight uppercase group-hover:text-red-600">{item.title}</h4>
                    <p className="text-sm font-medium text-gray-500">{item.text}</p>
                </div>
            ))}
        </div>
      </div>

      <div className="grid items-center grid-cols-1 gap-20 mt-24 lg:grid-cols-2">
        <div>
            <h2 className="mb-8 text-4xl font-black tracking-tighter text-gray-900 uppercase">
                Getting <span className="font-serif italic text-red-600">Started</span>
            </h2>
            <div className="space-y-4">
                {[
                    "Begin with low-impact 10-minute sessions.",
                    "Monitor heart rate via wearable tech.",
                    "Maintain hydration and nutrient intake.",
                    "Always cool down for 5 minutes post-workout."
                ].map((step, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-white border rounded-2xl border-slate-100">
                        <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-[10px] text-white font-bold">{i+1}</div>
                        <p className="text-sm font-bold tracking-tight text-gray-700 uppercase">{step}</p>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-gradient-to-br from-red-600 to-rose-700 rounded-[3rem] p-12 text-white shadow-2xl shadow-red-200">
            <h3 className="mb-6 text-3xl font-black leading-none uppercase">Ready for a checkup?</h3>
            <p className="mb-10 font-medium text-red-100">
                Our specialists can help you design a personalized training program based on your 
                current cardiovascular profile.
            </p>
            <button className="bg-white text-red-600 px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-gray-900 hover:text-white transition-all active:scale-95">
                Consult a Doctor
            </button>
        </div>
      </div>
    </div>
  );
};

export default HeartCare;