import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AddDoctor = () => {

    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('Cardiologist') 
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')

    const { backendUrl } = useContext(AppContext)
    const { aToken } = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        try {
            if (!docImg) {
                return toast.error('Image Not Selected')
            }

            const formData = new FormData();
            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', experience)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

            const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { aToken } })
            
            if (data.success) {
                toast.success(data.message)
                setDocImg(false); setName(''); setPassword(''); setEmail(''); setAddress1(''); setAddress2(''); setDegree(''); setAbout(''); setFees('')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='w-full min-h-screen bg-[#FDFBFB] p-6 lg:p-12 flex flex-col items-center'>

            
            <div className='w-full max-w-5xl mb-10 text-left'>
                <h1 className='text-5xl font-black tracking-tight text-gray-900'>
                    Register New <span className='text-red-600'>Specialist</span>
                </h1>
                <p className='mt-2 text-lg font-bold tracking-widest text-gray-400 uppercase'>
                    Deploy a new medical profile to the clinical network
                </p>
            </div>

            <div className='w-full max-w-5xl bg-white p-10 lg:p-16 border-t-8 border-red-600 rounded-[2.5rem] shadow-2xl overflow-hidden mb-20'>
                
                <div className='flex items-center gap-8 p-8 mb-12 border-4 border-gray-100 border-dashed bg-gray-50/50 rounded-[2rem]'>
                    <label htmlFor="doc-img" className='relative cursor-pointer group'>
                        <img 
                            className='object-cover w-32 h-32 transition-all bg-white shadow-xl rounded-3xl group-hover:brightness-75' 
                            src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} 
                            alt="Doctor Portrait" 
                        />
                        <div className='absolute inset-0 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100'>
                             <span className='px-3 py-1 text-xs font-black text-white uppercase bg-red-600 rounded-full'>Edit</span>
                        </div>
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
                    <div>
                        <p className='text-xl font-black tracking-tight text-gray-800 uppercase'>Doctor's Portrait</p>
                        <p className='mt-1 text-sm font-medium text-gray-400'>Upload a professional headshot. Recommended: 500x500px.</p>
                    </div>
                </div>

                <div className='flex flex-col items-start gap-12 text-gray-600 lg:flex-row'>

                    <div className='flex flex-col w-full gap-8 lg:flex-1'>

                        <div className='flex flex-col gap-3'>
                            <p className='ml-1 text-xs font-black tracking-widest text-gray-400 uppercase'>Full Name</p>
                            <input onChange={e => setName(e.target.value)} value={name} className='w-full p-5 text-xl font-bold text-gray-900 transition-all border-2 border-transparent shadow-sm outline-none bg-gray-50 rounded-2xl focus:border-red-600 focus:bg-white' type="text" placeholder='e.g. Dr. Aymen Mohsni' required />
                        </div>

                        <div className='flex flex-col gap-3'>
                            <p className='ml-1 text-xs font-black tracking-widest text-gray-400 uppercase'>Professional Email</p>
                            <input onChange={e => setEmail(e.target.value)} value={email} className='w-full p-5 text-xl font-bold text-gray-900 transition-all border-2 border-transparent shadow-sm outline-none bg-gray-50 rounded-2xl focus:border-red-600 focus:bg-white' type="email" placeholder='medical.staff@wellnessway.com' required />
                        </div>

                        <div className='flex flex-col gap-3'>
                            <p className='ml-1 text-xs font-black tracking-widest text-gray-400 uppercase'>Access Password</p>
                            <input onChange={e => setPassword(e.target.value)} value={password} className='w-full p-5 text-xl font-bold text-gray-900 transition-all border-2 border-transparent shadow-sm outline-none bg-gray-50 rounded-2xl focus:border-red-600 focus:bg-white' type="password" placeholder='••••••••' required />
                        </div>

                        <div className='flex flex-col gap-3'>
                            <p className='ml-1 text-xs font-black tracking-widest text-gray-400 uppercase'>Years of Experience</p>
                            <select onChange={e => setExperience(e.target.value)} value={experience} className='w-full p-5 text-xl font-bold text-gray-900 transition-all border-2 border-transparent shadow-sm outline-none appearance-none cursor-pointer bg-gray-50 rounded-2xl focus:border-red-600 focus:bg-white'>
                                {[...Array(10)].map((_, i) => (
                                    <option key={i} value={`${i + 1} Year`}>{i + 1} Year{i > 0 ? 's' : ''}</option>
                                ))}
                            </select>
                        </div>

                    </div>

                    <div className='flex flex-col w-full gap-8 lg:flex-1'>

                        <div className='flex flex-col gap-3'>
                            <p className='ml-1 text-xs font-black tracking-widest text-gray-400 uppercase'>Primary Speciality</p>
                            <select onChange={e => setSpeciality(e.target.value)} value={speciality} className='w-full p-5 text-xl font-black text-white transition-colors bg-gray-900 border-none shadow-lg cursor-pointer rounded-2xl hover:bg-red-600'>
                                <option value="Cardiologist">Cardiologist</option>
                                <option value="Diabetologist">Diabetologist</option>
                            </select>
                        </div>

                        <div className='flex flex-col gap-3'>
                            <p className='ml-1 text-xs font-black tracking-widest text-gray-400 uppercase'>Academic Degree</p>
                            <input onChange={e => setDegree(e.target.value)} value={degree} className='w-full p-5 text-xl font-bold text-gray-900 transition-all border-2 border-transparent shadow-sm outline-none bg-gray-50 rounded-2xl focus:border-red-600 focus:bg-white' type="text" placeholder='MBBS, MD' required />
                        </div>

                        <div className='flex flex-col gap-3'>
                            <p className='ml-1 text-xs font-black tracking-widest text-gray-400 uppercase'>Consultation Fees (DT)</p>
                            <input onChange={e => setFees(e.target.value)} value={fees} className='w-full p-5 text-xl font-bold text-gray-900 transition-all border-2 border-transparent shadow-sm outline-none bg-gray-50 rounded-2xl focus:border-red-600 focus:bg-white' type="number" placeholder='50' required />
                        </div>

                        <div className='flex flex-col gap-3'>
                            <p className='ml-1 text-xs font-black tracking-widest text-gray-400 uppercase'>Office Address</p>
                            <input onChange={e => setAddress1(e.target.value)} value={address1} className='w-full p-4 mb-2 font-bold text-gray-900 border-none text-md bg-gray-50 rounded-xl' type="text" placeholder='Building / Suite' required />
                            <input onChange={e => setAddress2(e.target.value)} value={address2} className='w-full p-4 font-bold text-gray-900 border-none text-md bg-gray-50 rounded-xl' type="text" placeholder='Street / City' required />
                        </div>

                    </div>
                </div>

                <div className='mt-12'>
                    <p className='mb-3 ml-1 text-xs font-black tracking-widest text-gray-400 uppercase'>Professional Biography</p>
                    <textarea onChange={e => setAbout(e.target.value)} value={about} className='w-full bg-gray-50 border-2 border-transparent rounded-[2rem] px-8 py-6 text-gray-800 font-medium focus:border-red-600 focus:bg-white transition-all outline-none shadow-sm' rows={5} placeholder='Detailed summary of the medical specialist’s background and clinical achievements...'></textarea>
                </div>

                <div className='flex flex-col items-center gap-6 mt-16 md:flex-row'>
                    <button type='submit' className='w-full px-16 py-6 text-2xl font-black text-white transition-all transform bg-red-600 shadow-2xl md:w-auto rounded-3xl hover:bg-gray-900 hover:-translate-y-1 active:scale-95'>
                        DEPLOY SPECIALIST PROFILE
                    </button>
                    <p className='text-xs font-bold tracking-widest text-gray-300 uppercase'>Review all data before deployment</p>
                </div>

            </div>
        </form>
    )
}

export default AddDoctor;