import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Calendar, MapPin, Clock, XCircle, CheckCircle, User } from 'lucide-react'

const MyAppointments = () => {

    const { backendUrl, token } = useContext(AppContext)
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([])

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1] - 1)] + " " + dateArray[2]
    }

    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            setAppointments(data.appointments.reverse())
        } catch (error) {
            console.log(error)
            toast.error("Failed to load HeartFlow appointments")
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
            if (data.success) {
                toast.success(data.message)
                getUserAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error("Error cancelling protocol")
        }
    }

    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    return (
        <div className='p-6 md:p-12 bg-[#FDFDFD] min-h-screen'>
            {/* --- Header --- */}
            <div className='mb-12'>
                <h1 className='text-3xl font-black tracking-tighter uppercase text-slate-900'>
                    My <span className='italic text-red-600'>Appointments</span>
                </h1>
                <div className='w-12 h-1 mt-2 bg-red-600 rounded-full'></div>
            </div>

            <div className='max-w-5xl space-y-6'>
                {appointments.length === 0 ? (
                    <div className='text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200'>
                        <p className='font-bold tracking-widest uppercase text-slate-400'>No scheduled consultations</p>
                    </div>
                ) : (
                    appointments.map((item, index) => (
                        <div key={index} className='group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-8 items-center'>
                            
                            <div className='relative'>
                                <img className='object-cover w-32 h-32 border rounded-3xl bg-slate-50 border-slate-100' src={item.docData.image} alt="" />
                                {item.isCompleted && (
                                    <div className='absolute -top-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-white'>
                                        <CheckCircle size={16} />
                                    </div>
                                )}
                            </div>

                            <div className='flex-1 space-y-3 text-center md:text-left'>
                                <div>
                                    <p className='text-xl font-black tracking-tight uppercase text-slate-900'>{item.docData.name}</p>
                                    <p className='text-red-600 font-bold text-xs uppercase tracking-[0.2em] mt-1'>{item.docData.speciality}</p>
                                </div>
                                
                                <div className='flex flex-wrap justify-center md:justify-start gap-4 text-[13px] text-slate-500 font-medium'>
                                    <div className='flex items-center gap-1.5'>
                                        <MapPin size={14} className='text-slate-300' />
                                        <span>{item.docData.address.line1}</span>
                                    </div>
                                    <div className='flex items-center gap-1.5'>
                                        <Calendar size={14} className='text-slate-300' />
                                        <span className='font-bold text-slate-700'>{slotDateFormat(item.slotDate)}</span>
                                    </div>
                                    <div className='flex items-center gap-1.5'>
                                        <Clock size={14} className='text-slate-300' />
                                        <span className='font-bold text-slate-700'>{item.slotTime}</span>
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col gap-3 min-w-[200px]'>
                                {item.isCompleted ? (
                                    <button className='w-full py-3 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-default'>
                                        Consultation Finished
                                    </button>
                                ) : item.cancelled ? (
                                    <button className='w-full py-3 bg-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-default'>
                                        Protocol Cancelled
                                    </button>
                                ) : (
                                    <>
                                        <button 
                                            onClick={() => navigate(`/doctors/${item.docData._id}`)}
                                            className='w-full py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-100'
                                        >
                                            View Specialist
                                        </button>
                                        <button 
                                            onClick={() => cancelAppointment(item._id)} 
                                            className='w-full py-3 border border-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 transition-all flex items-center justify-center gap-2'
                                        >
                                            <XCircle size={14} /> Cancel Visit
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default MyAppointments