import axios from 'axios'
import React, { useContext, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, ShieldCheck, Stethoscope, ArrowRight, Loader2, MoveLeft } from 'lucide-react'


const Login = () => {
  const navigate = useNavigate()

  const [role, setRole] = useState('Admin') 
  const [mode, setMode] = useState('Login') 
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const { setDToken } = useContext(DoctorContext)
  const { setAToken } = useContext(AdminContext)

  const handleLogin = async () => {
    setLoading(true)
    try {
      const url = role === 'Admin' ? '/api/admin/login' : '/api/doctor/login'
      const { data } = await axios.post(backendUrl + url, { email, password })

      if (data.success) {
        if (role === 'Admin') {
          setAToken(data.token)
          localStorage.setItem('aToken', data.token)
        } else {
          setDToken(data.token)
          localStorage.setItem('dToken', data.token)
        }
        toast.success(`${role} verified. Welcome back.`)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  const handleForgot = async () => {
    setLoading(true)
    try {
      const url = role === 'Admin' ? '/api/admin/forgot-password' : '/api/doctor/forgot-password'
      const { data } = await axios.post(backendUrl + url, { email })
      if (data.success) {
        toast.success("Recovery link dispatched to email")
        if (data.token) navigate(`/reset-password/${data.token}`)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Recovery error")
    } finally {
      setLoading(false)
    }
  }

  const onSubmitHandler = (e) => {
    e.preventDefault()
    mode === 'Login' ? handleLogin() : handleForgot()
  }

  const isAdmin = role === 'Admin';
  const themeColor = isAdmin ? '#1e293b' : '#dc2626'; 
  const accentLight = isAdmin ? 'bg-slate-50' : 'bg-red-50';

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-500 ${isAdmin ? 'bg-slate-100' : 'bg-red-50'}`}>
      
      <form onSubmit={onSubmitHandler} className="w-full max-w-[420px] animate-in fade-in zoom-in duration-500 relative">
        
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-8 sm:p-12 relative overflow-hidden">
          
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation(); 
              window.location.href = import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173";
            }}
            className="absolute z-50 p-2 transition-all rounded-full cursor-pointer top-8 left-8 hover:bg-gray-100 group"
            aria-label="Back to Home"
          >
            <MoveLeft 
              size={26} 
              style={{ color: themeColor }} 
              className="transition-transform group-hover:-translate-x-1"
            />
          </button>

          <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10 ${isAdmin ? 'bg-gray-600' : 'bg-red-600'}`}></div>

          <div className="flex flex-col items-center mt-6 mb-8 text-center">
            <div className={`p-5 rounded-2xl mb-4 ${accentLight} transition-all duration-500 shadow-sm`}>
              {isAdmin ? (
                <ShieldCheck size={36} className="text-red-600" />
              ) : (
                <Stethoscope size={36} className="text-red-600" />
              )}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-red-800">
              {role} <span className={isAdmin ? 'text-red-800' : 'text-red-800'}>Portal</span>
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              {mode === 'Login' ? 'Please identify to access your dashboard' : 'System recovery request'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute text-gray-300 text-red-600 transition-colors left-4 top-4" size={18} />
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-opacity-10 outline-none transition-all"
                style={{ '--tw-ring-color': themeColor }}
                type="email"
                placeholder="Email"
                required
              />
            </div>

            {mode === 'Login' && (
              <div className="relative group">
                <Lock className="absolute text-gray-300 text-red-600 transition-colors left-4 top-4" size={18} />
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-opacity-10 outline-none transition-all"
                  style={{ '--tw-ring-color': themeColor }}
                  type="password"
                  placeholder="Password"
                  required
                />
              </div>
            )}
          </div>

          <button 
            disabled={loading}
            className="w-full py-4 mt-8 text-white font-bold rounded-2xl shadow-xl transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
            style={{ backgroundColor: themeColor }}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={22} />
            ) : (
              <>
                {mode === 'Login' ? 'Login' : 'Send Recovery Link'}
                <ArrowRight size={20} />
              </>
            )}
          </button>

          <div className="flex flex-col items-center mt-10 space-y-4">
            <button 
              type="button"
              onClick={() => setMode(mode === 'Login' ? 'Forgot' : 'Login')} 
              className="text-xs font-medium text-gray-400 underline transition-colors hover:text-gray-600 underline-offset-4 decoration-gray-200"
            >
              {mode === 'Login' ? 'forgot password ?' : 'Return to secure authorization'}
            </button>

            <div className="w-full h-px my-2 bg-gray-100"></div>

            <div 
              onClick={() => {
                setRole(isAdmin ? 'Doctor' : 'Admin');
                setMode('Login');
              }}
              className={`px-6 py-2.5 rounded-full text-xs font-bold cursor-pointer transition-all border shadow-sm ${
                isAdmin 
                ? 'border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200' 
                : 'border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200'
              }`}
            >
              Access as {isAdmin ? 'Doctor' : 'Admin'} Instead
            </div>
          </div>

        </div>
      </form>
    </div>
  )
}

export default Login