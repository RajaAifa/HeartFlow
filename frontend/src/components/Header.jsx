import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className="flex flex-col md:flex-row flex-wrap bg-gradient-to-br from-red-600 via-red-500 to-rose-700 rounded-[2.5rem] px-8 md:px-12 lg:px-24 relative overflow-hidden shadow-2xl">
      
      <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="md:w-1/2 flex flex-col items-start justify-center gap-6 py-12 md:py-[10vw] z-10">
        
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30 mb-2">
           <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
           <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Live Heart Monitoring</p>
        </div>

        <h1 className="text-4xl font-black leading-tight tracking-tighter text-white uppercase md:text-5xl lg:text-6xl">
          Precision Heart <br /> <span className="text-red-100">Management</span>
        </h1>

        <div className="flex flex-col items-start gap-4 text-sm font-medium text-red-50 md:flex-row md:items-center">
          <img className="w-24 p-1 border-2 rounded-full border-white/20" src={assets.group_profiles} alt="Specialists" />
          <p className="max-w-sm leading-relaxed">
            Experience our <span className="font-bold text-white">Active AI Analysis</span>. Connect with 
            top cardiologists and monitor your health in real-time.
          </p>
        </div>

        <div className="flex flex-col w-full gap-4 mt-4 sm:flex-row md:w-auto">
            <a href="doctors" className="flex items-center justify-center gap-3 px-10 py-4 text-xs font-black tracking-widest text-red-600 uppercase transition-all duration-500 bg-white shadow-xl rounded-2xl hover:bg-gray-900 hover:text-white active:scale-95">
              Book Specialist
              <img className="w-3 invert" src={assets.arrow_icon} alt="" />
            </a>
            <a href="/Predictor" className="flex items-center justify-center gap-3 px-10 py-4 text-xs font-black tracking-widest text-white uppercase transition-all duration-300 bg-transparent border-2 border-white/40 rounded-2xl hover:bg-white/10">
              Run AI Predictor
            </a>
        </div>
      </div>

      <div className="relative flex justify-center items-center md:w-1/2 min-h-[400px] md:min-h-0">
        
        <div className="absolute rounded-full w-72 h-72 bg-red-400/30 blur-3xl animate-pulse"></div>
        
        <img
          className="z-10 w-full h-auto max-w-md transition-transform duration-700 md:absolute md:bottom-16 md:right-0 mix-blend-multiply hover:scale-105"
          src={assets.heartRealistic}
          alt="Live Heart Animation"
          style={{ 
            mixBlendMode: 'multiply', 
            filter: "contrast(1.3) brightness(1.1) saturate(1.2)"
          }}
        />
      </div>

    </div>
  )
}

export default Header