import React, { useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {

  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  if (!dashData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className='w-12 h-12 border-4 border-red-600 rounded-full border-t-transparent animate-spin'></div>
      </div>
    )
  }

  return (
    <div className='w-full min-h-screen bg-[#F8F9FA] p-12 flex flex-col items-center'>
      
      <div className='w-full max-w-6xl'>
        
        <div className='flex items-center justify-start gap-4 mb-14'>
          <span className='text-3xl'>📊</span>
          <p className='text-sm font-black text-gray-500 uppercase tracking-[0.5em]'>HeartFlow / Central Intelligence</p>
        </div>

        <div className='flex flex-wrap justify-start gap-8 mb-14'>
          
          <div className='bg-white p-8 pr-16 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6 hover:shadow-lg transition-all'>
            <span className='text-5xl'>👨‍⚕️</span>
            <div className='flex flex-col items-center'>
              <p className='text-4xl font-black leading-none text-gray-900'>{dashData.doctors}</p>
              <p className='text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-2'>Staff</p>
            </div>
          </div>

          <div className='bg-white p-8 pr-16 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6 hover:shadow-lg transition-all'>
            <span className='text-5xl'>📅</span>
            <div className='flex flex-col items-center'>
              <p className='text-4xl font-black leading-none text-gray-900'>{dashData.appointments}</p>
              <p className='text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-2'>Sessions</p>
            </div>
          </div>

          <div className='bg-white p-8 pr-16 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6 hover:shadow-lg transition-all'>
            <span className='text-5xl'>👥</span>
            <div className='flex flex-col items-center'>
              <p className='text-4xl font-black leading-none text-gray-900'>{dashData.patients}</p>
              <p className='text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-2'>Patients</p>
            </div>
          </div>

        </div>

        <div className='w-full bg-white rounded-[3rem] border border-gray-100 shadow-md overflow-hidden'>
          
          <div className='flex items-center justify-between px-12 py-8 bg-white border-b border-gray-50'>
            <div className='flex items-center gap-4'>
              <span className='text-xl'>⚡</span>
              <h2 className='text-base font-black tracking-widest text-gray-900 uppercase'>Latest Activity Stream</h2>
            </div>
            <span className='text-[10px] font-black text-red-600 bg-red-50 px-4 py-1.5 rounded-full animate-pulse'>LIVE_MONITOR</span>
          </div>

          <div className='divide-y-2 divide-gray-50'>
            {dashData.latestAppointments?.length > 0 ? (
              dashData.latestAppointments.slice(0, 6).map((item, index) => (
                <div key={index} className='grid items-center grid-cols-1 px-12 transition-colors md:grid-cols-3 py-7 hover:bg-gray-50/50'>
                  
                  <div className='flex items-center gap-6'>
                    <div className='relative'>
                      <img 
                        className='object-cover w-16 h-16 border-2 border-white shadow-sm rounded-2xl' 
                        src={item?.docData?.image} 
                        alt="" 
                      />
                      <div className='absolute p-1 text-base bg-white rounded-full shadow-sm -bottom-1 -right-1'>🩺</div>
                    </div>
                    <div>
                      <p className='text-base font-black text-gray-900'>{item?.docData?.name}</p>
                      <p className='mt-1 text-xs font-bold text-gray-400'>{slotDateFormat(item.slotDate)}</p>
                    </div>
                  </div>

                  <div className='flex justify-center my-4 md:my-0'>
                    {item.cancelled ? (
                      <span className='text-[11px] font-black text-red-500 uppercase px-5 py-2 bg-red-50 rounded-xl'>❌ Terminated</span>
                    ) : item.isCompleted ? (
                      <span className='text-[11px] font-black text-green-600 uppercase px-5 py-2 bg-green-50 rounded-xl'>✅ Verified</span>
                    ) : (
                      <span className='text-[11px] font-black text-blue-500 uppercase px-5 py-2 bg-blue-50 rounded-xl'>🕒 Scheduled</span>
                    )}
                  </div>

                  <div className='flex justify-end'>
                    {!item.cancelled && !item.isCompleted && (
                      <button 
                        onClick={() => cancelAppointment(item._id)}
                        className='px-8 py-3 bg-gray-900 hover:bg-red-600 text-white text-[11px] font-black uppercase rounded-xl transition-all shadow-md active:scale-95'
                      >
                        Abort Session
                      </button>
                    )}
                  </div>

                </div>
              ))
            ) : (
              <div className='py-20 text-center'>
                <p className='text-sm font-bold text-gray-300 uppercase tracking-[0.4em]'>No recent operational logs found</p>
              </div>
            )}
          </div>

          <div className='flex items-center justify-between px-12 py-6 border-t border-gray-100 bg-gray-50/50'>
              <p className='text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]'>HeartFlow Core Analytics // Build 2.4.0</p>
              <div className='flex items-center gap-2'>
                <span className='text-xs font-bold text-gray-400 uppercase'>Secure Connection</span>
                <span className='text-xl grayscale opacity-40'>🛡️</span>
              </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Dashboard