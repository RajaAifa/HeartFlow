import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Activity, ShieldAlert, HeartPulse, Pill, Scale } from "lucide-react";

const Services = () => {
  const navigate = useNavigate();

  const serviceList = [
    {
      title: "Specialist Matching",
      desc: "Connect with elite cardiologists and book your HeartFlow consultation instantly.",
      path: "/doctors",
      btnText: "Find Specialist",
      icon: <Activity size={28} />,
    },
    {
      title: "24/7 Pharmacy",
      desc: "Emergency cardiac medication delivery with secure local tracking.",
      path: "/medication",
      btnText: "Order Now",
      icon: <Pill size={28} />,
    },
    {
      title: "Emergency Protocol",
      desc: "Instant 24/7 priority channel for critical cardiovascular events.",
      path: "/emergency",
      btnText: "Launch Protocol",
      icon: <ShieldAlert size={28} />,
    },
    {
      title: "AI Heart Care",
      desc: "Advanced risk assessment using HeartFlow's proprietary monitoring AI.",
      path: "/heart-care",
      btnText: "Start Analysis",
      icon: <HeartPulse size={28} />,
    },
    {
      title: "Cardio-Nutrition",
      desc: "Precision diet plans engineered for arterial recovery and health.",
      path: "/nutrition",
      btnText: "View Plans",
      icon: <Scale size={28} />,
    }
  ];

  return (
    <section className="px-8 py-24 bg-white">
      <div className="mb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-red-50 border border-red-100 rounded-full">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full bg-red-400 rounded-full opacity-75 animate-ping"></span>
            <span className="relative inline-flex w-2 h-2 bg-red-600 rounded-full"></span>
          </span>
          <p className="text-[10px] font-black tracking-[0.3em] text-red-600 uppercase">
            HeartFlow Ecosystem
          </p>
        </div>
        
        <h2 className="text-4xl font-black tracking-tighter uppercase text-slate-900 md:text-6xl">
          Life-Saving <span className="italic text-red-600">Services</span>
        </h2>
        
        <p className="max-w-2xl mx-auto mt-6 text-sm font-bold leading-relaxed tracking-wide uppercase text-slate-400">
          Precision medical modules designed to monitor, protect, and optimize your cardiovascular vitality.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 mx-auto max-w-7xl">
        {serviceList.map((service, index) => (
          <div 
            key={index} 
            className="group relative p-10 bg-[#FDFDFD] rounded-[2.5rem] border border-slate-100 hover:border-red-200 hover:shadow-[0_30px_60px_-20px_rgba(220,38,38,0.1)] transition-all duration-500 flex flex-col items-start w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]"
          >
            <div className="absolute top-0 w-0 h-1 transition-all duration-500 -translate-x-1/2 bg-red-600 rounded-b-full left-1/2 group-hover:w-1/3"></div>

            <div className="p-5 mb-8 text-red-600 transition-all duration-500 bg-white border shadow-sm border-slate-100 rounded-3xl group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 group-hover:-translate-y-2">
              {service.icon}
            </div>

            <h3 className="mb-4 text-xl font-black tracking-tight uppercase text-slate-900">
              {service.title}
            </h3>
            
            <p className="mb-10 text-sm font-medium leading-relaxed text-slate-500">
              {service.desc}
            </p>

            <button 
              onClick={() => navigate(service.path)} 
              className="flex items-center gap-3 mt-auto text-[11px] font-black tracking-[0.2em] text-red-600 uppercase transition-all group-hover:gap-5"
            >
              {service.btnText}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-8 mt-24">
        {["Direct Specialist Access", "Encrypted Health Data", "Emergency Ready"].map((text, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-2 border border-red-50/50 rounded-xl bg-red-50/20">
            <HeartPulse size={14} className="text-red-600 opacity-50" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-700/60">{text}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;