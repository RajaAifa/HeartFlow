import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

  const { dToken, setDToken } = useContext(DoctorContext)
  const { aToken, setAToken } = useContext(AdminContext)

  const navigate = useNavigate()

  const logout = () => {
    navigate('/')
    dToken && setDToken('')
    dToken && localStorage.removeItem('dToken')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
  }

  return (
    <nav className='sticky top-0 z-50 px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-md'>
      <div className='max-w-[1600px] mx-auto flex justify-between items-center'>
        
        
        <div className='flex items-center gap-4'>
          <div className='relative group'>
            <img 
              onClick={() => navigate('/')} 
              className='w-32 transition-opacity cursor-pointer sm:w-36 hover:opacity-80' 
              src={assets.admin_logo} 
              alt="Admin Logo" 
            />
            <div className='absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full'></div>
          </div>
          
          <div className='flex items-center'>
            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${aToken ? 'border-gray-900 bg-gray-900 text-white' : 'border-red-600 bg-red-50 text-red-600'}`}>
              {aToken ? 'Systems Admin' : 'Medical Professional'}
            </span>
          </div>
        </div>

        
        <div className='flex items-center gap-6'>
          {/* Indicateur de statut (Simulation) */}
          <div className='items-center hidden gap-2 px-3 py-1 rounded-lg md:flex bg-green-50'>
             <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></span>
             <span className='text-[10px] font-bold text-green-700 uppercase'>Server Online</span>
          </div>

          <button 
            onClick={() => logout()} 
            className='group flex items-center gap-2 bg-white border-2 border-gray-100 hover:border-red-600 px-6 py-2.5 rounded-xl transition-all active:scale-95 shadow-sm hover:shadow-red-100'
          >
            <span className='text-sm font-black tracking-tight text-gray-400 uppercase transition-colors group-hover:text-red-600'>
              Logout
            </span>
            <span className='text-gray-300 transition-colors group-hover:text-red-600'>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </span>
          </button>
        </div>

      </div>
    </nav>
  )
}

export default Navbar