import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyProfile = () => {

    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(false)

    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)

    const updateUserProfileData = async () => {
        try {
            const formData = new FormData();
            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('address', JSON.stringify(userData.address))
            formData.append('gender', userData.gender)
            formData.append('dob', userData.dob)

            image && formData.append('image', image)

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                await loadUserProfileData()
                setIsEdit(false)
                setImage(false)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    return userData ? (
        <div className='p-4 md:p-8 bg-[#FFFBFB] min-h-screen'>
            <div className='max-w-3xl mx-auto bg-white rounded-[2.5rem] shadow-[0_10px_40px_rgba(220,38,38,0.05)] border border-red-50 overflow-hidden'>
                
                <div className='h-32 bg-gradient-to-r from-red-600 to-red-500'></div>

                <div className='px-8 pb-12 -mt-16'>
                    <div className='relative inline-block group'>
                        {isEdit ? (
                            <label htmlFor='image' className='cursor-pointer'>
                                <div className='relative'>
                                    <img 
                                        className='w-36 h-36 rounded-[2.5rem] object-cover border-4 border-white shadow-xl opacity-80 group-hover:opacity-60 transition-all' 
                                        src={image ? URL.createObjectURL(image) : userData.image} 
                                        alt="" 
                                    />
                                    <div className='absolute inset-0 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100'>
                                        <img className='w-10 invert' src={assets.upload_icon} alt="" />
                                    </div>
                                </div>
                                <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                            </label>
                        ) : (
                            <img className='w-36 h-36 rounded-[2.5rem] object-cover border-4 border-white shadow-xl' src={userData.image} alt="" />
                        )}
                    </div>

                    <div className='mt-6'>
                        {isEdit ? (
                            <input 
                                className='px-4 py-2 text-3xl font-black tracking-tighter uppercase border-b-2 border-red-600 outline-none text-slate-800 bg-red-50 rounded-t-xl' 
                                type="text" 
                                onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} 
                                value={userData.name} 
                            />
                        ) : (
                            <h1 className='text-3xl font-black tracking-tighter uppercase text-slate-900'>{userData.name}</h1>
                        )}
                        <p className='text-red-600 font-bold text-[10px] uppercase tracking-[0.2em] mt-1 flex items-center gap-2'>
                            <span className='w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse'></span>
                            Verified Patient Profile
                        </p>
                    </div>

                    <div className='grid grid-cols-1 gap-10 mt-12 md:grid-cols-2'>
                        
                        <div className='space-y-6'>
                            <div className='flex items-center gap-2 mb-4'>
                                <div className='w-1 h-4 bg-red-600 rounded-full'></div>
                                <h2 className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-400'>Contact Network</h2>
                            </div>
                            
                            <div className='space-y-4'>
                                <div className='p-4 transition-colors border border-gray-50 bg-gray-50/50 rounded-2xl hover:bg-white hover:border-red-100'>
                                    <p className='text-[9px] font-bold text-gray-400 uppercase mb-1'>Primary Email</p>
                                    <p className='text-sm font-black text-slate-700'>{userData.email}</p>
                                </div>

                                <div className='p-4 transition-colors border border-gray-50 bg-gray-50/50 rounded-2xl hover:bg-white hover:border-red-100'>
                                    <p className='text-[9px] font-bold text-gray-400 uppercase mb-1'>Phone Connection</p>
                                    {isEdit ? (
                                        <input className='w-full px-2 py-1 text-sm font-bold bg-transparent border-b border-red-200 outline-none focus:border-red-600' type="text" onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} value={userData.phone} />
                                    ) : (
                                        <p className='text-sm font-black text-slate-700'>{userData.phone}</p>
                                    )}
                                </div>

                                <div className='p-4 transition-colors border border-gray-50 bg-gray-50/50 rounded-2xl hover:bg-white hover:border-red-100'>
                                    <p className='text-[9px] font-bold text-gray-400 uppercase mb-1'>Residential Address</p>
                                    {isEdit ? (
                                        <div className='mt-2 space-y-2'>
                                            <input className='w-full px-3 py-2 text-xs bg-white border border-red-100 rounded-lg outline-none focus:border-red-600' type="text" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={userData.address.line1} />
                                            <input className='w-full px-3 py-2 text-xs bg-white border border-red-100 rounded-lg outline-none focus:border-red-600' type="text" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={userData.address.line2} />
                                        </div>
                                    ) : (
                                        <p className='text-sm italic font-bold leading-relaxed text-gray-500'>
                                            {userData.address.line1}<br />{userData.address.line2}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className='space-y-6'>
                            <div className='flex items-center gap-2 mb-4'>
                                <div className='w-1 h-4 bg-gray-900 rounded-full'></div>
                                <h2 className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-400'>Medical ID Card</h2>
                            </div>

                            <div className='grid grid-cols-1 gap-6 bg-red-50/50 p-6 rounded-[2.5rem] border border-red-100 shadow-inner'>
                                <div className='group'>
                                    <p className='text-[9px] font-bold text-red-400 uppercase mb-1'>Biological Gender</p>
                                    {isEdit ? (
                                        <select className='w-full px-4 py-2 text-sm bg-white border border-red-100 outline-none rounded-xl focus:border-red-600' onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender} >
                                            <option value="Not Selected">Not Selected</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    ) : (
                                        <p className='text-sm font-black text-gray-800'>{userData.gender}</p>
                                    )}
                                </div>

                                <div className='group'>
                                    <p className='text-[9px] font-bold text-red-400 uppercase mb-1'>Birth Registry</p>
                                    {isEdit ? (
                                        <input className='w-full px-4 py-2 text-sm bg-white border border-red-100 outline-none rounded-xl focus:border-red-600' type='date' onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} value={userData.dob} />
                                    ) : (
                                        <p className='text-sm font-black text-gray-800'>{userData.dob}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-end pt-8 mt-12 border-t border-gray-100'>
                        {isEdit ? (
                            <button onClick={updateUserProfileData} className='bg-red-600 text-white font-black uppercase text-[11px] tracking-[0.2em] px-12 py-4 rounded-2xl shadow-xl shadow-red-100 hover:bg-red-700 transition-all active:scale-95'>
                                Save Medical Identity
                            </button>
                        ) : (
                            <button onClick={() => setIsEdit(true)} className='bg-gray-900 text-white font-black uppercase text-[11px] tracking-[0.2em] px-12 py-4 rounded-2xl shadow-xl shadow-gray-100 hover:bg-red-600 transition-all active:scale-95'>
                                Modify Record
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    ) : null
}

export default MyProfile