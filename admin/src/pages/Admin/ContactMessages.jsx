import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { assets } from '../../assets/assets';

const ContactMessages = () => {
    const { aToken, messages, getContactMessages, deleteContactMessage } = useContext(AdminContext);

    useEffect(() => {
        if (aToken) {
            getContactMessages();
        }
    }, [aToken]);

    return (
        <div className='flex flex-col items-center w-full min-h-screen p-8 bg-gradient-to-br from-slate-50 to-indigo-50/50'>
            
            <div className='w-full max-w-6xl'>
                
                <div className="mb-10 text-center lg:text-left">
                    <h1 className='text-4xl font-extrabold tracking-tight text-slate-800'>
                        Message <span className='text-red-600'>Center</span>
                    </h1>
                    <p className='mt-2 text-sm font-medium text-slate-500'>
                        Manage and respond to user inquiries from the global gateway.
                    </p>
                </div>
                
                <div className='bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden'>
                    
                    {/* TABLE HEADER: Subtle Slate */}
                    <div className='hidden lg:grid grid-cols-[0.5fr_2fr_2fr_4fr_1.2fr_0.8fr] py-5 px-8 bg-slate-800/5 border-b border-slate-100 text-[12px] font-bold uppercase tracking-wider text-slate-600'>
                        <p>ID</p>
                        <p>Sender</p>
                        <p>Email Address</p>
                        <p>Message</p>
                        <p>Received</p>
                        <p className='text-right'>Manage</p>
                    </div>

                    <div className='max-h-[60vh] overflow-y-auto divide-y divide-slate-100'>
                        {messages.length > 0 ? (
                            messages.map((item, index) => (
                                <div key={index} className='grid grid-cols-1 lg:grid-cols-[0.5fr_2fr_2fr_4fr_1.2fr_0.8fr] items-center py-6 px-8 hover:bg-indigo-50/40 transition-colors group'>
                                    
                                    {/* ID */}
                                    <p className='hidden text-sm font-medium text-slate-400 lg:block'>
                                        #{index + 1}
                                    </p>
                                    
                                    <div className='flex items-center gap-4'>
                                        <div className='flex items-center justify-center w-10 h-10 font-bold text-indigo-700 bg-indigo-100 rounded-full'>
                                            {item.name.charAt(0).toUpperCase()}
                                        </div>
                                        <p className='font-bold text-slate-800'>{item.name}</p>
                                    </div>

                                    {/* EMAIL */}
                                    <p className='py-2 text-sm font-medium text-red-500 truncate lg:py-0'>
                                        {item.email}
                                    </p>
                                    
                                    <div className='lg:pr-10'>
                                        <p className='p-3 text-sm italic leading-relaxed border rounded-lg text-slate-600 line-clamp-2 bg-white/50 border-slate-50'>
                                            {item.message}
                                        </p>
                                    </div>
                                    
                                    {/* DATE */}
                                    <p className='text-xs font-semibold text-slate-400'>
                                        {new Date(item.date).toLocaleDateString()}
                                    </p>
                                    
                                    <div className='flex justify-end pt-4 lg:pt-0'>
                                        <button 
                                            onClick={() => deleteContactMessage(item._id)}
                                            className='p-3 transition-all rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 active:scale-90'
                                            title="Remove Message"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='flex flex-col items-center justify-center py-24 text-slate-300'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p className='text-sm font-bold tracking-widest uppercase'>No messages found</p>
                            </div>
                        )}
                    </div>

                    {/* FOOTER BAR */}
                    <div className='flex items-center justify-between px-8 py-5 border-t bg-slate-50/80 border-slate-100'>
                        <div className='flex items-center gap-2'>
                            <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></span>
                            <p className='text-[11px] font-bold text-slate-500 uppercase tracking-wider'>
                                Database Sync Active
                            </p>
                        </div>
                        <div className='px-4 py-1 bg-white border rounded-full shadow-sm border-slate-200'>
                            <p className='text-[11px] font-bold text-red-600 uppercase'>
                                Total: {messages.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactMessages;