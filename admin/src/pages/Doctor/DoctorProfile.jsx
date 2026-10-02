import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const DoctorProfile = () => {

    const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext)
    const { currency, backendUrl } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)

    const updateProfile = async () => {
        try {
            const updateData = {
                address:   profileData.address,
                fees:      profileData.fees,
                about:     profileData.about,
                available: profileData.available
            }

            const { data } = await axios.post(
                backendUrl + '/api/doctor/update-profile',
                updateData,
                { headers: { Authorization: `Bearer ${dToken}` } }
            )

            if (data.success) {
                toast.success(data.message)
                setIsEdit(false)
                getProfileData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    useEffect(() => {
        if (dToken) {
            getProfileData()
        }
    }, [dToken])

    return profileData && (
        <div className='p-6 md:p-10 bg-[#FDFBFB] min-h-screen'>

            <div className='flex flex-col max-w-6xl gap-8 mx-auto lg:flex-row'>

                <div className='flex flex-col w-full gap-4 lg:w-72'>
                    <div className='relative group'>
                        <img
                            className='bg-red-600 w-full rounded-[2.5rem] shadow-xl border-4 border-white object-cover'
                            src={profileData.image}
                            alt=""
                        />
                        {!isEdit && (
                            <div className={`absolute bottom-6 right-6 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-white shadow-lg ${
                                profileData.available
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-slate-200 text-slate-500'
                            }`}>
                                {profileData.available ? '● Available' : '○ Busy'}
                            </div>
                        )}
                    </div>

                    {isEdit && (
                        <div className='bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between'>
                            <p className='text-[10px] font-black uppercase text-slate-400 tracking-widest'>Availability</p>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={profileData.available}
                                    onChange={() => setProfileData(prev => ({ ...prev, available: !prev.available }))}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer
                                    peer-checked:after:translate-x-full peer-checked:after:border-white
                                    after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                                    after:bg-white after:border-gray-300 after:border after:rounded-full
                                    after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600">
                                </div>
                            </label>
                        </div>
                    )}

                    <div className='bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-3'>
                        <div>
                            <p className='text-[10px] font-black uppercase text-slate-400 tracking-widest'>Speciality</p>
                            <p className='mt-1 font-bold text-red-600'>{profileData.speciality}</p>
                        </div>
                        <div>
                            <p className='text-[10px] font-black uppercase text-slate-400 tracking-widest'>Experience</p>
                            <p className='mt-1 font-bold text-slate-700'>{profileData.experience}</p>
                        </div>
                        <div>
                            <p className='text-[10px] font-black uppercase text-slate-400 tracking-widest'>Degree</p>
                            <p className='mt-1 font-bold text-slate-700'>{profileData.degree}</p>
                        </div>
                    </div>
                </div>

                <div className='flex-1 bg-white rounded-[3rem] border border-slate-100 p-8 md:p-12 shadow-sm'>

                    <div className='pb-8 border-b-2 border-red-50'>
                        <h1 className='text-4xl font-black tracking-tighter uppercase text-slate-800'>
                            {profileData.name}
                        </h1>
                        <div className='flex flex-wrap items-center gap-3 mt-2'>
                            <p className='text-xs font-bold tracking-widest text-red-600 uppercase'>
                                {profileData.degree} — {profileData.speciality}
                            </p>
                            <span className='px-3 py-1 bg-red-50 text-red-400 text-[10px] font-black rounded-lg uppercase border border-red-100'>
                                {profileData.experience} Experience
                            </span>
                        </div>
                    </div>

                    <div className='py-8 space-y-8'>

                        <div>
                            <p className='text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-3'>
                                Professional Summary
                            </p>
                            {isEdit ? (
                                <textarea
                                    onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))}
                                    className='w-full p-4 text-sm transition-all border outline-none bg-slate-50 border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-400 focus:border-red-400'
                                    rows={5}
                                    value={profileData.about}
                                />
                            ) : (
                                <p className='text-sm italic leading-relaxed text-slate-600'>
                                    "{profileData.about}"
                                </p>
                            )}
                        </div>

                        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>

                            <div className='bg-red-50 p-6 rounded-[2rem] border border-red-100'>
                                <p className='text-[10px] font-black uppercase text-red-400 tracking-[0.2em] mb-2'>
                                    Consultation Fee
                                </p>
                                {isEdit ? (
                                    <div className='flex items-center gap-2 px-4 py-2 bg-white border border-red-200 rounded-xl'>
                                        <span className='font-bold text-red-400'>{currency}</span>
                                        <input
                                            type='number'
                                            className='w-full font-bold outline-none text-slate-800'
                                            onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))}
                                            value={profileData.fees}
                                        />
                                    </div>
                                ) : (
                                    <p className='text-2xl font-black text-slate-800'>
                                        {currency} {profileData.fees}
                                    </p>
                                )}
                            </div>

                            <div className='bg-slate-50 p-6 rounded-[2rem] border border-slate-100'>
                                <p className='text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2'>
                                    Office Address
                                </p>
                                {isEdit ? (
                                    <div className='space-y-2'>
                                        <input
                                            type='text'
                                            className='w-full px-4 py-2 text-xs bg-white border outline-none border-slate-200 rounded-xl focus:border-red-400 focus:ring-1 focus:ring-red-200'
                                            onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                                            value={profileData.address.line1}
                                            placeholder='Address line 1'
                                        />
                                        <input
                                            type='text'
                                            className='w-full px-4 py-2 text-xs bg-white border outline-none border-slate-200 rounded-xl focus:border-red-400 focus:ring-1 focus:ring-red-200'
                                            onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                                            value={profileData.address.line2}
                                            placeholder='Address line 2'
                                        />
                                    </div>
                                ) : (
                                    <p className='text-xs font-medium leading-relaxed tracking-tight uppercase text-slate-600'>
                                        {profileData.address.line1}<br />
                                        {profileData.address.line2}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center gap-4 pt-8 border-t-2 border-red-50'>
                        {isEdit ? (
                            <>
                                <button
                                    onClick={updateProfile}
                                    className='px-10 py-4 bg-red-600 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-red-700 shadow-xl shadow-red-200 transition-all active:scale-95'
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => { setIsEdit(false); getProfileData(); }}
                                    className='px-10 py-4 bg-slate-100 text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-slate-200 transition-all active:scale-95'
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEdit(true)}
                                className='px-10 py-4 bg-slate-900 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-red-600 shadow-xl shadow-slate-200 transition-all active:scale-95'
                            >
                                Modify Profile
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default DoctorProfile
