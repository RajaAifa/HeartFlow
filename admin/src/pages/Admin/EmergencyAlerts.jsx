import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';

const EmergencyAlerts = () => {
    const { aToken, emergencies, getAllEmergencies, resolveEmergency } = useContext(AdminContext);

    useEffect(() => {
        if (aToken) {
            getAllEmergencies();
        }
    }, [aToken]);

    return (
        <div className='p-6 md:p-10 bg-[#FBFCFD] min-h-screen'>
            
            <div className='flex items-center justify-between mb-10'>
                <div>
                    <h1 className='text-3xl font-black tracking-tighter text-gray-900 uppercase'>
                        Emergency <span className='text-red-600'>Center</span>
                    </h1>
                    <p className='text-sm font-medium text-gray-400'>Real-time critical patient alerts requiring immediate action.</p>
                </div>
                <div className='flex items-center gap-3 px-6 py-2 bg-red-600 shadow-lg rounded-2xl shadow-red-200'>
                    <span className='w-2 h-2 bg-white rounded-full animate-ping'></span>
                    <span className='text-white text-[10px] font-black uppercase tracking-[0.2em]'>Live Feed</span>
                </div>
            </div>

            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
                {emergencies.length > 0 ? (
                    emergencies.map((item, index) => (
                        <div key={index} className='relative group bg-white border-2 border-red-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-red-100 transition-all duration-500'>
                            
                            <div className='w-full h-2 bg-red-600'></div>

                            <div className='p-8'>
                                <div className='flex items-start justify-between mb-6'>
                                    <div>
                                        <p className='text-[10px] font-black text-red-500 uppercase tracking-widest mb-1'>Critical Priority</p>
                                        <h2 className='text-xl font-black tracking-tight text-gray-900 uppercase'>{item.patientName}</h2>
                                    </div>
                                    <div className='p-3 bg-red-50 rounded-2xl'>
                                        <p className='text-[10px] font-black text-red-600'>
                                            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>

                                <div className='grid grid-cols-2 gap-4 mb-6'>
                                    <div className='p-3 border border-gray-100 bg-gray-50 rounded-xl'>
                                        <p className='text-[8px] font-black text-gray-400 uppercase mb-1'>Phone</p>
                                        <p className='text-[11px] font-bold text-gray-900'>{item.phone}</p>
                                    </div>
                                    <div className='p-3 border border-gray-100 bg-gray-50 rounded-xl'>
                                        <p className='text-[8px] font-black text-gray-400 uppercase mb-1'>Bio-Data</p>
                                        <p className='text-[11px] font-bold text-gray-900'>{item.gender} | {item.dob}</p>
                                    </div>
                                </div>

                                <div className='p-4 mb-6 border border-gray-100 bg-gray-50 rounded-xl'>
                                    <p className='text-[8px] font-black text-gray-400 uppercase mb-1'>Location / Address</p>
                                    <p className='text-[11px] font-bold text-gray-900 leading-tight'>{item.address}</p>
                                </div>

                                <div className='flex items-center justify-between pt-4 border-t border-gray-50'>
                                    <p className='text-[9px] font-bold text-gray-300 uppercase'>Ref ID: {item._id.slice(-6).toUpperCase()}</p>
                                    <p className='text-[9px] font-medium text-gray-400 italic'>Received: {new Date(item.createdAt).toLocaleDateString()}</p>
                                </div>

                                <button 
                                    onClick={() => resolveEmergency(item._id)}
                                    className='mt-8 w-full bg-gray-900 hover:bg-red-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg hover:shadow-red-200'
                                >
                                    Mark as Resolved
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='col-span-full flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-100'>
                        <div className='flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-green-50'>
                            <span className='text-3xl animate-bounce'>✅</span>
                        </div>
                        <h3 className='text-lg font-black tracking-tighter text-gray-900 uppercase'>System Secure</h3>
                        <p className='text-sm font-medium text-gray-400'>No active emergency alerts at this moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};


export default EmergencyAlerts;