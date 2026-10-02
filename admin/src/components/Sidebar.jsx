import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'

const Sidebar = () => {

  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)

  
  const linkStyle = ({ isActive }) => `
    flex items-center gap-4 py-4 px-6 mb-2 mx-4 rounded-2xl transition-all duration-300 group
    ${isActive 
      ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 translate-x-2' 
      : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}
  `

  return (
    <aside className='min-h-screen w-20 md:w-72 bg-white border-r border-slate-100 py-8 flex flex-col sticky top-[73px]'>
      
      

      
      {aToken && <nav className='flex-1'>
        <ul className='list-none'>
          
          <NavLink to={'/admin-dashboard'} className={linkStyle}>
            <span className="text-lg">📊</span>
            <p className='hidden text-[11px] font-black tracking-widest uppercase md:block'>Dashboard</p>
          </NavLink>

          <NavLink to={'/emergency-alerts'} className={({ isActive }) => `
            flex items-center gap-4 py-4 px-6 mb-2 mx-4 rounded-2xl transition-all duration-300 group
            ${isActive 
              ? 'bg-red-600 text-white shadow-xl shadow-red-100 translate-x-2' 
              : 'text-red-600 bg-red-50/50 hover:bg-red-50'}
          `}>
            <span className="text-lg animate-pulse">🚨</span>
            <p className='hidden text-[11px] font-black tracking-widest uppercase md:block'>Emergencies</p>
          </NavLink>

          <NavLink to={'/contact-messages'} className={linkStyle}>
            <span className="text-lg">📩</span>
            <p className='hidden text-[11px] font-black tracking-widest uppercase md:block'>Messages</p>
          </NavLink>

          

          <NavLink to={'/all-appointments'} className={linkStyle}>
            <span className="text-lg">📅</span>
            <p className='hidden text-[11px] font-black tracking-widest uppercase md:block'>Appointments</p>
          </NavLink>

          <NavLink to={'/admin/comments'} className={linkStyle}>
            <span className="text-lg">💬</span>
            <p className='hidden text-[11px] font-black tracking-widest uppercase md:block'>Comments</p>
          </NavLink>

           <NavLink to={'/admin/users'} className={linkStyle}>
            <span className="text-lg">👥</span>
            <p className='hidden text-[11px] font-black tracking-widest uppercase md:block'>Users</p>
          </NavLink> 

          
          <NavLink to={'/medication-orders'} className={linkStyle}>
            <span className="text-lg">💊</span>
            <p className='hidden text-[11px] font-black tracking-widest uppercase md:block'>Medication Orders</p>
          </NavLink>
           <NavLink to={'/admin/medication'} className={linkStyle}>
            <span className="text-lg">➕</span>
            <p className='hidden text-[11px] font-black tracking-widest uppercase md:block'> Add Medication</p>
          </NavLink>

          <NavLink to={'/add-doctor'} className={linkStyle}>
            <span className="text-lg">👨‍⚕️</span>
            <p className='hidden text-[11px] font-black tracking-widest uppercase md:block'>Add Provider</p>
          </NavLink>

          <NavLink to={'/doctor-list'} className={linkStyle}>
            <span className="text-lg">📋</span>
            <p className='hidden text-[11px] font-black tracking-widest uppercase md:block'>Staff Directory</p>
          </NavLink>
        </ul>
      </nav>}

      
      {dToken && <nav className='flex-1'>
        <ul className='list-none'>
          <NavLink to={'/doctor-dashboard'} className={linkStyle}>
            <span className="text-lg">🏥</span>
            <p className='hidden text-[11px] font-black tracking-widest uppercase md:block'>Overview</p>
          </NavLink>

          <NavLink to={'/doctor-appointments'} className={linkStyle}>
            <span className="text-lg">🩺</span>
            <p className='hidden text-[11px] font-black tracking-widest uppercase md:block'>My Appointments </p>
          </NavLink>

        <NavLink to={'/doctor/schedule'} className={linkStyle}>
            <span className="text-lg">🕒</span>
            <p className='hidden text-[11px] font-black tracking-widest uppercase md:block'>My Schedule</p>
          </NavLink>

          <NavLink to={'/doctor-profile'} className={linkStyle}>
            <span className="text-lg">👤</span>
            <p className='hidden text-[11px] font-black tracking-widest uppercase md:block'>My Profile</p>
          </NavLink>
          <NavLink to={'/patient-dossier'} className={linkStyle}>
            <span className="text-lg">📋</span>
            <p className='hidden text-[11px] font-black tracking-widest uppercase md:block'>Medical records</p>
          </NavLink>
       <NavLink 
  to={'/doctor-predictor'} 
  className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}
>
  
  <span className="text-lg">📈</span>
  
  <p className='hidden text-[11px] font-black tracking-widest uppercase md:block'>Predictors</p>
</NavLink>
        </ul>
      </nav>}

      
      <div className='hidden px-10 pt-6 mt-auto border-t md:block border-slate-100'>
          <p className='text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]'>HeartFlow System v2.0</p>
      </div>

    </aside>
  )
}

export default Sidebar