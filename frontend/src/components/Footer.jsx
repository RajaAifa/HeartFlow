import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className='mt-32 border-t border-gray-100 bg-[#fcfcfc]'>
      <div className='px-6 py-16 mx-auto max-w-7xl'>
        
        <div className='grid grid-cols-1 gap-12 mb-16 lg:grid-cols-4'>
          
          <div className='col-span-1 space-y-6 lg:col-span-2'>
            <img 
              onClick={() => {navigate('/'); window.scrollTo(0,0)}} 
              className='w-48 transition-transform duration-300 cursor-pointer hover:scale-105' 
              src={assets.logo} 
              alt="HeartFlow Logo" 
            />
            <p className='max-w-sm text-sm leading-relaxed text-gray-500'>
              <span className='font-bold text-red-600'>HeartFlow AI</span> is a pioneering digital health infrastructure specializing in real-time cardiovascular predictive analysis. We merge artificial intelligence with clinical expertise to save lives.
            </p>
            <div className='inline-flex items-center gap-3 px-4 py-2 bg-white border border-gray-100 shadow-sm rounded-2xl'>
              <span className='relative flex w-2 h-2'>
                <span className='absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-emerald-400'></span>
                <span className='relative inline-flex w-2 h-2 rounded-full bg-emerald-500'></span>
              </span>
              <span className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Engine Status: Optimal</span>
            </div>
          </div>

          <div className='space-y-6'>
            <h4 className='text-xs font-black text-gray-900 uppercase tracking-[0.2em] border-l-2 border-red-600 pl-3'>
              Platform
            </h4>
            <ul className='space-y-3 text-sm font-medium text-gray-500'>
              <li onClick={() => navigate('/Predictor')} className='flex items-center gap-2 transition-all cursor-pointer hover:text-red-600'>
                <span>AI Predictors</span>
              </li>
              <li onClick={() => navigate('/doctors')} className='transition-all cursor-pointer hover:text-red-600'>Specialists</li>
              <li onClick={() => navigate('/services')} className='transition-all cursor-pointer hover:text-red-600'>Medical Services</li>
              <li onClick={() => navigate('/about')} className='transition-all cursor-pointer hover:text-red-600'>About Us</li>
            </ul>
          </div>

          <div className='space-y-6'>
            <h4 className='text-xs font-black text-gray-900 uppercase tracking-[0.2em] border-l-2 border-red-600 pl-3'>
              Assistance
            </h4>
            <div className='space-y-4'>
              <div className='p-4 transition-all bg-white border border-gray-100 rounded-2xl group hover:border-red-100'>
                <p className='text-[10px] font-bold text-gray-400 uppercase mb-1'>24/7 Emergency</p>
                <p className='font-black tracking-tight text-gray-800'>+216 71 000 000</p>
              </div>
              <div className='p-4 transition-all bg-white border border-gray-100 rounded-2xl group hover:border-red-100'>
                <p className='text-[10px] font-bold text-gray-400 uppercase mb-1'>Email Support</p>
                <p className='font-black tracking-tight text-gray-800 break-all'>contact@heartflow.ai</p>
              </div>
            </div>
          </div>

        </div>

        <div className='flex flex-col items-center justify-between gap-6 pt-8 border-t border-gray-100 md:flex-row'>
          <div className='text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center md:text-left'>
            © 2026 HeartFlow AI System. Engineered for Medical Excellence.
          </div>
          
          <div className='flex items-center gap-6 transition-all duration-500 opacity-30 grayscale hover:opacity-100 hover:grayscale-0'>
            <div className='flex items-center gap-1 pr-6 border-r border-gray-300'>
               <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1 14.5l-3.5-3.5 1.41-1.41L11 13.67l4.59-4.59L17 10.5 11 16.5z"/></svg>
               <span className='text-[9px] font-black uppercase'>SSL Secure</span>
            </div>
            <div className='flex items-center gap-1'>
               <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 12h-2v2h2v-2zm0-8h-2v6h2V7z"/></svg>
               <span className='text-[9px] font-black uppercase'>HIPAA Compliant</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer