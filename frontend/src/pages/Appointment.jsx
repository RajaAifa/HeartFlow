import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'

const Appointment = () => {
    const { docId } = useParams()
    const { doctors, currencySymbol, backendUrl, token, getDoctosData } = useContext(AppContext)
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const navigate = useNavigate()

    const [docInfo, setDocInfo] = useState(false)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')
    const [schedule, setSchedule] = useState({});
    const [comments, setComments] = useState([])
    const [rating, setRating] = useState(0)
    const [text, setText] = useState('')

    const fetchDocInfo = async () => {
        const doc = doctors.find((d) => d._id === docId)
        setDocInfo(doc)
    }
     /////////////////////////
     const fetchSchedule = async () => {
  try {
    const { data } = await axios.get(
      backendUrl + `/api/doctor/schedule`,
      {
        headers: { token }
      }
    );

    if (data.success) {
      setSchedule(data.schedule);
    }
  } catch (error) {
    console.log(error);
  }
};
useEffect(() => {
  if (docId) fetchSchedule();
}, [docId]);

    const fetchComments = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + `/api/user/doctor/comments/${docId}`
            )

            if (data.success) {
                setComments(data.comments)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (docId) fetchComments()
    }, [docId])

    const submitComment = async () => {
        if (!token) {
            toast.warning("Please login to comment")
            return navigate('/login')
        }

        if (!rating || !text) {
            return toast.error("Please add rating and comment")
        }

        try {
            const { data } = await axios.post(
                backendUrl + "/api/user/doctor/comment",
                {
                    doctorId: docId,
                    rating,
                    comment: text
                },
                { headers: { token } }
            )

            if (data.success) {
                toast.success("Review added")
                setText('')
                setRating(0)
                fetchComments()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const deleteComment = async (commentId) => {
        if (!token) {
            toast.warning("Login required")
            return
        }

        try {
            const { data } = await axios.delete(
                backendUrl + "/api/user/doctor/comment",
                {
                    headers: { token },
                    data: { commentId }
                }
            )

            if (data.success) {
                toast.success("Comment deleted")
                fetchComments()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

const getAvailableSolts = async () => {
  setDocSlots([]);

  let today = new Date();

  for (let i = 0; i < 7; i++) {
    let currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);

    let endTime = new Date(currentDate);
    endTime.setHours(21, 0, 0, 0);

    if (i === 0) {
      currentDate.setHours(
        currentDate.getHours() > 10
          ? currentDate.getHours() + 1
          : 10
      );
      currentDate.setMinutes(
        currentDate.getMinutes() > 30 ? 30 : 0
      );
    } else {
      currentDate.setHours(10);
      currentDate.setMinutes(0);
    }

    let timeSlots = [];

    while (currentDate < endTime) {
      let formattedTime = currentDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      let day = currentDate.getDate();
      let month = currentDate.getMonth() + 1;
      let year = currentDate.getFullYear();

      const slotDate = `${day}_${month}_${year}`;

      const dayData = schedule[slotDate] || [];

      const isBlocked = dayData.some(
        (s) =>
          s.time === formattedTime &&
          s.type === "blocked"
      );

      const isBooked = dayData.some(
        (s) =>
          s.time === formattedTime &&
          s.type === "appointment" &&
          !s.cancelled
      );

      const isAvailable = !isBlocked && !isBooked;

      if (isAvailable) {
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });
      }

      currentDate.setMinutes(currentDate.getMinutes() + 30);
    }

    setDocSlots((prev) => [...prev, timeSlots]);
  }
};
useEffect(() => {
  if (docInfo && Object.keys(schedule).length > 0) {
    getAvailableSolts();
  }
}, [docInfo, schedule]);

///////////////////////////////////////////

    const bookAppointment = async () => {
        if (!token) {
            toast.warning('Please login to book an appointment')
            return navigate('/login')
        }

        if (!slotTime) {
            return toast.error('Please select a time slot')
        }

        const date = docSlots[slotIndex][0].datetime
        let slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`

        try {
            const { data } = await axios.post(
                backendUrl + '/api/user/book-appointment',
                { docId, slotDate, slotTime },
                { headers: { token } }
            )

            if (data.success) {
                toast.success(data.message)
                getDoctosData()
                navigate('/my-appointments')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (doctors.length > 0) fetchDocInfo()
    }, [doctors, docId])

    useEffect(() => {
        if (docInfo) getAvailableSolts()
    }, [docInfo])


   return docInfo ? (
    <div className="p-4 mx-auto max-w-7xl sm:p-6 lg:p-12 animate-fade-in">

        <div className='flex flex-col md:flex-row gap-12 bg-white p-8 md:p-14 rounded-[3.5rem] border-2 border-slate-50 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden'>
            
            <div className="absolute top-0 right-0 w-40 h-40 bg-red-50 rounded-bl-[100%] -mr-16 -mt-16 opacity-40"></div>

            <div className="relative group shrink-0">
                <img 
                    className='w-full md:w-80 lg:w-96 rounded-[2.5rem] object-cover border-[6px] border-white shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]' 
                    src={docInfo.image} 
                    alt={docInfo.name} 
                />
                
            </div>

            <div className='flex flex-col justify-center flex-1 py-2'>
                <div className="flex items-center gap-2 mb-4">
                    <span className="bg-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase shadow-md shadow-red-200">
                        {docInfo.speciality}
                    </span>
                    <span className="h-[2px] w-12 bg-slate-100"></span>
                </div>

                <h1 className='mb-3 text-4xl font-black leading-none tracking-tighter md:text-6xl text-slate-800'>
                    {docInfo.name}
                </h1>
                
                <p className='flex items-center gap-2 mb-8 text-xl font-bold text-slate-400'>
                    {docInfo.degree} <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> Tunisia Cardiology Board
                </p>

                <div className="relative p-7 bg-rose-50/50 rounded-[2rem] border border-rose-100/50 mb-8">
                    <p className='relative z-10 text-lg italic leading-relaxed text-slate-600'>
                        {docInfo.about}
                    </p>
                    <span className="absolute font-serif text-6xl leading-none select-none top-4 right-6 text-rose-200/50">”</span>
                </div>

                <div className='flex items-end justify-between mt-auto'>
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Consultation Fee</p>
                        <p className='text-4xl font-black text-slate-900'>
                            {currencySymbol}{docInfo.fees}
                        </p>
                    </div>
                    
                    <div className="items-center hidden gap-4 lg:flex text-slate-300">
                        <div className="text-right">
                         
                          
                        </div>
                        <div className="flex items-center justify-center w-12 h-12 border-2 rounded-full border-slate-100">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            <div className='mt-12 bg-white p-8 rounded-[2.5rem]'>

                <h2 className='mb-4 text-xl font-black'>Select Schedule</h2>

                <div className='flex gap-3 overflow-x-auto'>
                    {docSlots.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => setSlotIndex(index)}
                            className={`px-4 py-2 rounded-xl ${slotIndex === index ? 'bg-red-600 text-white' : 'bg-gray-100'}`}
                        >
                            {item[0] && daysOfWeek[item[0].datetime.getDay()]}
                        </button>
                    ))}
                </div>

                <div className='flex gap-3 mt-4 overflow-x-auto'>
                    {docSlots[slotIndex]?.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => setSlotTime(item.time)}
                            className={`px-4 py-2 rounded-xl ${slotTime === item.time ? 'bg-black text-white' : 'bg-gray-100'}`}
                        >
                            {item.time}
                        </button>
                    ))}
                </div>

                <button
                    onClick={bookAppointment}
                    className='px-6 py-3 mt-6 text-white bg-red-600 rounded-xl'
                >
                    Book Appointment
                </button>
            </div>

            <div className='p-8 mt-12 bg-white rounded-3xl'>

                <h2 className='mb-4 text-2xl font-black'>Patient Reviews</h2>

                <div className='flex gap-2 mb-4'>
                    {[1, 2, 3, 4, 5].map((s) => (
                        <button
                            key={s}
                            onClick={() => setRating(s)}
                            className={`text-2xl ${rating >= s ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                            ★
                        </button>
                    ))}
                </div>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className='w-full p-3 border rounded-xl'
                    placeholder='Write review...'
                />

                <button
                    onClick={submitComment}
                    className='px-5 py-2 mt-3 text-white bg-red-600 rounded-xl'
                >
                    Submit
                </button>

                <div className='mt-6 space-y-4'>
                    {comments.map((c) => (
                        <div key={c._id} className='p-4 border rounded-xl'>

                            <div className='flex justify-between'>
                                <p className='font-bold'>{c.userName}</p>

                                <div className='flex items-center gap-3'>
                                    <span className='text-yellow-500'>
                                        {"★".repeat(Number(c.rating))}
                                    </span>

                                    <button
                                        onClick={() => deleteComment(c._id)}
                                        className='text-xs font-bold text-red-600'
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <p className='text-gray-600'>{c.comment}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className='mt-20'>
                <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
            </div>

        </div>
    ) : null
}

export default Appointment