import React from 'react'
import Header from '../components/Header'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'

const Home = () => {
  return (
    <div className="space-y-10">

      <div className="max-w-4xl px-6 mx-auto mt-12">
        <div className="bg-gray-900 rounded-[2rem] p-2 flex flex-col md:flex-row shadow-2xl shadow-red-100 overflow-hidden">
          
          <button
            onClick={() => window.location.href = "/login"}
            className="flex-1 group relative py-6 px-8 rounded-[1.8rem] transition-all duration-500 hover:bg-red-600 flex items-center justify-center gap-4 overflow-hidden"
          >
            <div className="relative z-10 flex items-center gap-4">
               <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 group-hover:bg-white/20">
                  <span className="text-xl">👤</span>
               </div>
               <div className="text-left">
                  <p className="text-[10px] font-black text-red-500 group-hover:text-red-200 uppercase tracking-widest leading-none mb-1">Health Access</p>
                  <p className="text-sm font-black tracking-tighter text-white uppercase">I am a Patient</p>
               </div>
            </div>
          </button>

          <div className="hidden md:block w-[1px] bg-gray-800 my-4"></div>

          <button
            onClick={() => window.location.href = import.meta.env.VITE_ADMIN_URL || "http://localhost:5174"}
            className="flex-1 group relative py-6 px-8 rounded-[1.8rem] transition-all duration-500 hover:bg-white flex items-center justify-center gap-4 overflow-hidden"
          >
            <div className="relative z-10 flex items-center gap-4">
               <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600/10 group-hover:bg-red-600">
                  <span className="text-xl group-hover:brightness-200">🩺</span>
               </div>
               <div className="text-left">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Professional Portal</p>
                  <p className="text-sm font-black tracking-tighter text-gray-400 uppercase transition-colors group-hover:text-gray-900">Doctor / Admin</p>
               </div>
            </div>
          </button>

        </div>
      </div>

      <Header />
      <TopDoctors />
      <Banner />

    </div>
  )
}

export default Home