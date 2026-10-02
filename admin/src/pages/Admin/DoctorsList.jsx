import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const DoctorsList = () => {

    const { doctors, changeAvailability, aToken, getAllDoctors } = useContext(AdminContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (aToken) {
            getAllDoctors()
        }
    }, [aToken])

    return (
        <div className='p-6 lg:p-12 bg-[#FDFBFB] min-h-screen'>
            
            <div className='mx-auto mb-16 max-w-7xl'>
                <h1 className='text-5xl font-black tracking-tight text-gray-900'>
                    Medical <span className='text-red-600 uppercase'>Staff</span>
                </h1>
                <p className='mt-2 text-lg font-bold tracking-widest text-gray-400 uppercase'>
                    Real-time network monitoring and availability control
                </p>
                <div className='w-20 h-2 mt-6 bg-red-600'></div>
            </div>

            <div className='grid grid-cols-1 gap-10 mx-auto max-w-7xl sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {doctors.map((item, index) => (
                    <div 
                        key={index} 
                        className='bg-white rounded-[2rem] border-2 border-gray-100 overflow-hidden hover:border-red-600 transition-all duration-500 group flex flex-col shadow-sm hover:shadow-2xl'
                    >

                        <div
                            className='relative overflow-hidden cursor-pointer h-72 bg-gray-50'
                            onClick={() => navigate(`/admin/doctor/${item._id}`)}
                        >
                            <img 
                                className='object-cover w-full h-full transition-all duration-700 group-hover:scale-110' 
                                src={item.image} 
                                alt={item.name} 
                            />
                            <div className='absolute top-4 left-4'>
                                <span className='px-3 py-1 text-[10px] font-black text-white bg-gray-900/80 backdrop-blur-md rounded-full uppercase tracking-tighter'>
                                    ID: {item._id.slice(-5)}
                                </span>
                            </div>
                        </div>

                        <div className='flex flex-col flex-grow p-8'>
                            
                            <h2 className='text-2xl font-black leading-tight tracking-tight text-gray-900 transition-colors group-hover:text-red-600'>
                                {item.name}
                            </h2>
                            
                            <p className='inline-block w-fit px-3 py-1 mt-3 text-[11px] font-black text-white bg-red-600 uppercase tracking-widest rounded-md'>
                                {item.speciality}
                            </p>

                            <div className='flex items-center justify-between pt-6 mt-8 border-t-2 border-gray-50'>
                                
                                <div className='flex flex-col'>
                                    <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1'>
                                        System Status
                                    </p>

                                    <div className='flex items-center gap-2'>
                                        <div className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                                        <p className={`text-xs font-black uppercase tracking-widest ${item.available ? 'text-green-600' : 'text-gray-400'}`}>
                                            {item.available ? 'Active' : 'Standby'}
                                        </p>
                                    </div>
                                </div>

                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={item.available}
                                        onChange={() => changeAvailability(item._id)}
                                    />
                                    <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                                </label>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

            <div className='flex items-center justify-between pb-10 mx-auto mt-20 max-w-7xl'>
                <div className='flex flex-col'>
                    <p className='text-xs font-black text-gray-900 uppercase tracking-[0.4em]'>
                        WellnessWay Management
                    </p>
                    <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>
                        Cloud Protocol v2.4.0
                    </p>
                </div>

                <div className='flex items-baseline gap-2 px-6 py-3 text-white bg-gray-900 rounded-2xl'>
                    <span className='text-xs font-bold tracking-widest text-gray-400 uppercase'>Total Registry:</span>
                    <span className='text-2xl font-black text-red-500'>{doctors.length}</span>
                </div>
            </div>

        </div>
    )
}

export default DoctorsList;