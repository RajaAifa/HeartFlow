import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const DoctorDashboard = () => {

  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, currency } = useContext(AppContext)

  useEffect(() => {
    if (dToken) {
      getDashData()
    }
  }, [dToken])

  return dashData && (
    <div className='p-6 md:p-10 bg-[#F8FAFC] min-h-screen'>

      <div className='flex flex-wrap gap-6'>
        
        {/* Earnings Card */}
        <div className='flex items-center gap-5 bg-white p-6 min-w-[280px] flex-1 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group'>
          <img className='w-16 transition-transform group-hover:scale-110' src={assets.earning_icon} alt="" />
          <div>
            <p className='text-2xl font-black tracking-tighter text-slate-800'>{currency} {dashData.earnings}</p>
            <p className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-400'>Earnings</p>
          </div>
        </div>

        <div className='flex items-center gap-5 bg-white p-6 min-w-[280px] flex-1 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group'>
          <img className='w-16 transition-transform group-hover:scale-110' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-2xl font-black tracking-tighter text-slate-800'>{dashData.appointments}</p>
            <p className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-400'>Appointments</p>
          </div>
        </div>

        <div className='flex items-center gap-5 bg-white p-6 min-w-[280px] flex-1 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group'>
          <img className='w-16 transition-transform group-hover:scale-110' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-2xl font-black tracking-tighter text-slate-800'>{dashData.patients}</p>
            <p className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-400'>Patients</p>
          </div>
        </div>
      </div>

      <div className='mt-12 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden'>
        
        <div className='flex items-center gap-3 px-8 py-6 border-b bg-slate-50/50 border-slate-100'>
          <img className='w-5' src={assets.list_icon} alt="" />
          <h2 className='text-sm font-black tracking-widest uppercase text-slate-800'>Latest Bookings</h2>
        </div>

        <div className='divide-y divide-slate-50'>
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div className='flex items-center gap-6 px-8 py-5 transition-all hover:bg-slate-50 group' key={index}>
              
              <img className='object-cover border-2 shadow-sm rounded-2xl w-14 h-14 border-slate-100' src={item.userData.image} alt="" />
              
              <div className='flex-1'>
                <p className='text-sm font-black tracking-tight uppercase text-slate-800'>{item.userData.name}</p>
                <p className='text-[11px] font-bold text-slate-400'>Booking on <span className='text-blue-600'>{slotDateFormat(item.slotDate)}</span></p>
              </div>

              {/* Status & Actions */}
              <div className='flex items-center gap-3'>
                {item.cancelled ? (
                  <p className='px-4 py-2 bg-rose-50 text-rose-500 text-[10px] font-black uppercase rounded-xl border border-rose-100'>Cancelled</p>
                ) : item.isCompleted ? (
                  <p className='px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-xl border border-emerald-100'>Completed</p>
                ) : (
                  <div className='flex items-center gap-1'>
                    <img 
                      onClick={() => cancelAppointment(item._id)} 
                      className='w-10 transition-transform cursor-pointer hover:scale-110 active:scale-90' 
                      src={assets.cancel_icon} 
                      alt="Cancel" 
                    />
                    <img 
                      onClick={() => completeAppointment(item._id)} 
                      className='w-10 transition-transform cursor-pointer hover:scale-110 active:scale-90' 
                      src={assets.tick_icon} 
                      alt="Complete" 
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default DoctorDashboard