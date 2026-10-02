import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {

  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const { token, setToken, userData } = useContext(AppContext)

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    navigate('/login')
  }

  return (
    <div className='sticky top-0 z-50 flex items-center justify-between px-4 py-3 mb-4 text-xs bg-white border-b border-gray-100 lg:text-sm md:px-10'>
      
      <img 
        onClick={() => {navigate('/'); window.scrollTo(0,0)}} 
        className='w-40 transition-all cursor-pointer lg:w-48 hover:opacity-80' 
        src={assets.logo} 
        alt="HeartFlow Logo" 
      />
      
      <ul className='items-center hidden gap-4 font-bold tracking-tight text-gray-600 md:flex lg:gap-8'>
        <NavLink to='/' className='relative group'>
          <li className='py-1 uppercase transition-colors group-hover:text-red-600'>Home</li>
          <hr className='border-none h-[2px] bg-red-600 w-0 group-hover:w-full transition-all duration-300 absolute bottom-0' />
        </NavLink>
        
        <NavLink to='/doctors' className='relative group'>
          <li className='py-1 uppercase transition-colors group-hover:text-red-600'>Specialists</li>
          <hr className='border-none h-[2px] bg-red-600 w-0 group-hover:w-full transition-all duration-300 absolute bottom-0' />
        </NavLink>

        <NavLink to='/predictor' className='relative group'>
          <li className='py-1 uppercase transition-colors group-hover:text-red-600'>AI Predictors</li>
          <hr className='border-none h-[2px] bg-red-600 w-0 group-hover:w-full transition-all duration-300 absolute bottom-0' />
        </NavLink>

        <NavLink to='/Services' className='relative group'>
          <li className='py-1 uppercase transition-colors group-hover:text-red-600'>Services</li>
          <hr className='border-none h-[2px] bg-red-600 w-0 group-hover:w-full transition-all duration-300 absolute bottom-0' />
        </NavLink>

        <NavLink to='/contact' className='relative group'>
          <li className='py-1 uppercase transition-colors group-hover:text-red-600'>Contact</li>
          <hr className='border-none h-[2px] bg-red-600 w-0 group-hover:w-full transition-all duration-300 absolute bottom-0' />
        </NavLink>
        
        <NavLink to='/about' className='relative group'>
          <li className='py-1 uppercase transition-colors group-hover:text-red-600'>About</li>
          <hr className='border-none h-[2px] bg-red-600 w-0 group-hover:w-full transition-all duration-300 absolute bottom-0' />
        </NavLink>
      </ul>

      <div className='flex items-center gap-4'>
        {
          token && userData
            ? <div className='relative flex items-center gap-3 cursor-pointer group bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 hover:border-red-100 transition-all'>
              <img className='object-cover w-8 h-8 border-2 border-red-500 rounded-full' src={userData.image} alt="Profile" />
              <img className='w-2.5 opacity-40' src={assets.dropdown_icon} alt="" />
              
              <div className='absolute right-0 z-20 hidden pt-4 top-full group-hover:block'>
                <div className='flex flex-col gap-2 p-5 bg-white border shadow-2xl rounded-2xl min-w-56 border-gray-50'>
                  <p onClick={() => navigate('/my-profile')} className='px-3 py-2 font-medium transition-all rounded-xl hover:bg-red-50 hover:text-red-600'>My Profile</p>
                  <p onClick={() => navigate('/my-appointments')} className='px-3 py-2 font-medium transition-all rounded-xl hover:bg-red-50 hover:text-red-600'>My Appointments</p>
                  <hr className='my-2 border-gray-50' />
                  <p onClick={logout} className='px-3 py-2 font-bold text-center text-white transition-all bg-gray-900 rounded-xl hover:bg-red-600'>Logout</p>
                </div>
              </div>
            </div>
            : <button 
                onClick={() => navigate('/login')} 
                className='hidden md:block bg-red-600 text-white px-6 lg:px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] shadow-lg shadow-red-100 hover:bg-gray-900 transition-all active:scale-95'
              >
                Access Portal
              </button>
        }
        
        <img onClick={() => setShowMenu(true)} className='w-6 cursor-pointer md:hidden' src={assets.menu_icon} alt="Menu" />

        <div className={`fixed inset-0 z-50 bg-white transition-all duration-500 ${showMenu ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className='flex items-center justify-between px-6 py-5 border-b border-gray-100'>
            <img src={assets.logo} className='w-40' alt="HeartFlow Logo" />
            <div onClick={() => setShowMenu(false)} className='p-2 rounded-full cursor-pointer bg-red-50'>
               <img src={assets.cross_icon} className='w-5' alt="Close" />
            </div>
          </div>
          <ul className='flex flex-col items-center gap-6 px-6 mt-12 text-xl font-black tracking-tighter text-gray-800 uppercase'>
            <NavLink onClick={() => setShowMenu(false)} to='/' className='hover:text-red-600'>Home</NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/doctors' className='hover:text-red-600'>Specialists</NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/Predictor' className='hover:text-red-600'>AI Predictors</NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/Services' className='hover:text-red-600'>Services</NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/contact' className='hover:text-red-600'>Contact</NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/about' className='hover:text-red-600'>About</NavLink>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar