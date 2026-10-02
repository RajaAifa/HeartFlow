import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/contact/send`, formData);
      
      if (data.success) {
        toast.success("Signal transmitted to HeartFlow Center");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Transmission error:", error);
      toast.error("Failed to connect to HeartFlow servers");
    }
  };

  return (
    <div className="px-6 my-10 font-sans">
      <div className="pt-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
           <svg className="w-8 h-8 text-red-600 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <p className="text-3xl font-black tracking-tighter text-gray-800 uppercase">
            Contact <span className="text-red-600">HeartFlow</span> Center
          </p>
        </div>
        <div className="w-24 h-1 mx-auto bg-red-600 rounded-full"></div>
        <p className="mt-4 text-sm italic text-gray-500">"Because every heartbeat matters"</p>
      </div>

      <div className="flex flex-col items-stretch justify-center max-w-6xl gap-12 mx-auto my-16 text-sm md:flex-row mb-28">
        
        <div className="flex flex-col gap-8 text-gray-600 w-full md:max-w-[320px] p-8 bg-white border-l-8 border-red-600 shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-xl">
          <section>
            <p className="mb-2 text-xs font-bold tracking-widest text-red-600 uppercase">Status: Active</p>
            <p className="text-xl font-bold leading-tight text-gray-800 uppercase">Emergency Support</p>
            <p className="mt-2 text-gray-500">Our predictive systems and specialists are available 24/7 for critical cardiac inquiries.</p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <p className="mb-2 text-xs font-bold text-gray-800 uppercase">Location Center</p>
            <p className="text-gray-500">Technopark El Ghazala, RI 2088<br/>Ariana, Tunisia</p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <p className="mb-2 text-xs font-bold text-gray-800 uppercase">Direct Channels</p>
            <p className="font-medium text-gray-500">Tel: +216 71 000 000</p>
            <p className="font-medium text-gray-500">Email: support@heartflow.ai</p>
          </section>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full md:max-w-[600px] bg-white p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-50 relative overflow-hidden">
          {/* Décoration subtile en arrière-plan */}
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <svg className="w-24 h-24 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-red-600 ml-1 uppercase tracking-tighter">Full Identity</label>
            <input 
              className="w-full px-5 py-4 text-gray-700 transition-all border-2 outline-none rounded-2xl border-gray-50 focus:border-red-500 focus:bg-white placeholder:text-gray-300 bg-gray-50" 
              type="text" name="name" placeholder="John Doe" 
              onChange={handleChange} value={formData.name} required 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-red-600 ml-1 uppercase tracking-tighter">Communication Node (Email)</label>
            <input 
              className="w-full px-5 py-4 text-gray-700 transition-all border-2 outline-none rounded-2xl border-gray-50 focus:border-red-500 focus:bg-white placeholder:text-gray-300 bg-gray-50" 
              type="email" name="email" placeholder="contact@patient.com" 
              onChange={handleChange} value={formData.email} required 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-red-600 ml-1 uppercase tracking-tighter">Clinical Notes / Message</label>
            <textarea 
              className="w-full px-5 py-5 text-gray-700 transition-all border-2 outline-none resize-none rounded-2xl border-gray-50 focus:border-red-500 focus:bg-white placeholder:text-gray-300 bg-gray-50" 
              name="message" placeholder="Describe your inquiry..." rows="4"
              onChange={handleChange} value={formData.message} required 
            ></textarea>
          </div>

          <button className="group mt-4 px-10 py-5 text-white font-bold rounded-2xl bg-red-600 hover:bg-red-700 shadow-[0_10px_20px_rgba(220,38,38,0.3)] transition-all active:scale-95 flex items-center justify-center gap-3">
            <span className="relative flex w-3 h-3">
              <span className="absolute inline-flex w-full h-full bg-red-100 rounded-full opacity-75 animate-ping"></span>
              <span className="relative inline-flex w-3 h-3 bg-white border border-red-600 rounded-full"></span>
            </span>
            <span className="text-xs tracking-widest uppercase">Transmit to HeartFlow Center</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;