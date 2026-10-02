import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {

    const navigate = useNavigate()
    const { doctors } = useContext(AppContext)

    return (
        <div className='flex flex-col items-center gap-6 my-24 text-[#262626] md:mx-10'>
            
            <div className='space-y-2 text-center'>
                <h1 className='text-3xl font-black tracking-tighter text-gray-900 uppercase md:text-4xl'>
                    Elite <span className='text-red-600'>Cardiology</span> Specialists
                </h1>
                <p className='text-sm font-medium text-gray-500 sm:w-full'>
                    Direct access to top-tier experts powered by HeartFlow diagnostics.
                </p>
                <div className='w-16 h-1 mx-auto mt-4 bg-red-600 rounded-full'></div>
            </div>

            <div className='grid w-full gap-8 px-3 pt-10 grid-cols-auto gap-y-10 sm:px-0'>
                {doctors.slice(0, 10).map((item, index) => (
                    <div 
                        key={index}
                        onClick={() => { navigate(`/appointment/${item._id}`); window.scrollTo(0, 0) }} 
                        className='group border border-gray-100 rounded-[2rem] overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-red-100 hover:translate-y-[-12px] transition-all duration-500 bg-white'
                    >
                        <div className='relative overflow-hidden bg-gradient-to-b from-red-50 to-white'>
                            <img 
                                className='object-cover object-top w-full h-64 transition-transform duration-700 group-hover:scale-110' 
                                src={item.image} 
                                alt={item.name} 
                            />
                            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full backdrop-blur-md border ${item.available ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-gray-500/10 border-gray-500/20 text-gray-500'} flex items-center gap-1.5 shadow-sm`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${item.available ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}`}></span>
                                <p className='text-[10px] font-black uppercase tracking-widest'>{item.available ? 'Available' : 'Busy'}</p>
                            </div>
                        </div>

                        <div className='p-6 text-center'>
                            <p className='text-xs font-black text-red-600 uppercase tracking-[0.2em] mb-1'>{item.speciality}</p>
                            <p className='text-xl font-black tracking-tight text-gray-900 transition-colors group-hover:text-red-600'>{item.name}</p>
                            
                            <div className='flex justify-center pt-4 mt-4 border-t border-gray-50'>
                                <span className='text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-gray-600 transition-colors'>
                                    View Digital Profile →
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button 
                onClick={() => { navigate('/doctors'); window.scrollTo(0, 0) }} 
                className='mt-12 group relative px-12 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] overflow-hidden hover:bg-red-600 transition-all duration-500 shadow-xl shadow-gray-200 active:scale-95'
            >
                <span className='relative z-10'>Explore All Specialists</span>
                <div className='absolute inset-0 bg-red-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500'></div>
            </button>
        </div>
    )
}

export default TopDoctors