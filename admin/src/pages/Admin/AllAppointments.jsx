import React, { useEffect, useState, useContext } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AllAppointments = () => {

  const { aToken, appointments, cancelAppointment, getAllAppointments } = useContext(AdminContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  return (
    <div className='w-full min-h-screen bg-[#F8F9FA] p-12 flex flex-col items-center'>
      
      {/* CONTENT CONTAINER: Matched to Dashboard width */}
      <div className='w-full max-w-6xl'>

        {/* HEADER: High-contrast black/gray theme */}
        <div className='flex flex-col gap-2 mb-10'>
          <h1 className='text-4xl font-black tracking-tighter text-gray-900 uppercase'>
            Appointment <span className='italic text-gray-400'>Registry</span>
          </h1>
          <p className='text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]'>
            Live monitoring of clinical bookings and patient flow.
          </p>
        </div>


        <div className='mb-10'>
          <div className='relative group'>
            <input
              type='text'
              placeholder='Search by patient name...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full px-8 py-5 text-xs font-bold transition-all bg-white border border-gray-100 shadow-sm rounded-3xl focus:outline-none focus:ring-2 focus:ring-gray-900'
            />
            <span className='absolute transition-opacity -translate-y-1/2 right-8 top-1/2 opacity-30 group-focus-within:opacity-100'>🔍</span>
          </div>
        </div>

        <div className='hidden lg:grid grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1.5fr] items-center px-12 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]'>
          <p>#</p>
          <p>Patient Details</p>
          <p className='text-center'>Age</p>
          <p>Schedule</p>
          <p>Medical Officer</p>
          <p>Fee</p>
          <p className='text-right'>Control</p>
        </div>

        <div className='space-y-4'>
          {appointments
            ?.filter((item) =>
              item?.userData?.name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
            )
            .map((item, index) => (
              <div
                key={item?._id || index}
                className='bg-white rounded-[2.5rem] border border-gray-50 p-6 lg:px-12 lg:py-8 flex flex-col lg:grid lg:grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1.5fr] items-center hover:shadow-xl hover:scale-[1.01] transition-all duration-300 shadow-sm'
              >

                <p className='hidden text-xs font-black text-gray-200 lg:block'>
                  {String(index + 1).padStart(2, '0')}
                </p>

                <div className='flex items-center w-full gap-5'>
                  <img
                    src={item?.userData?.image || assets.default_user}
                    className='object-cover w-16 h-16 border-2 shadow-sm border-gray-50 rounded-2xl'
                    alt=""
                  />
                  <div>
                    <p className='text-sm font-black text-gray-900'>
                      {item?.userData?.name || "Unknown Patient"}
                    </p>
                    <p className='text-[10px] text-gray-400 font-bold lg:hidden'>
                      Age: {calculateAge(item?.userData?.dob) || "--"}Y
                    </p>
                  </div>
                </div>

                <p className='hidden text-sm font-black text-center text-gray-400 lg:block'>
                  {calculateAge(item?.userData?.dob) || "--"}
                  <span className='text-[9px] ml-1 uppercase'>yrs</span>
                </p>

                <div className='my-6 lg:my-0'>
                  <p className='text-xs font-black text-gray-900'>
                    {slotDateFormat(item?.slotDate)}
                  </p>
                  <span className='text-[10px] font-black text-blue-500 uppercase tracking-tighter'>
                    {item?.slotTime || "--"}
                  </span>
                </div>

                <div className='flex items-center gap-3 px-5 py-2.5 border border-gray-100 rounded-2xl bg-gray-50/50 w-fit'>
                  <img
                    src={item?.docData?.image || assets.default_doc}
                    className='object-cover w-8 h-8 border border-white rounded-xl grayscale'
                    alt=""
                  />
                  <p className='text-[10px] font-black text-gray-700 uppercase'>
                    Dr. {item?.docData?.name || "Unknown"}
                  </p>
                </div>

                {/* AMOUNT */}
                <p className='my-4 text-sm font-black text-gray-900 lg:my-0'>
                  {currency} {item?.amount || 0}
                </p>

                <div className='flex justify-end w-full'>
                  {item?.cancelled ? (
                    <span className='text-red-500 text-[10px] font-black uppercase bg-red-50 px-4 py-2 rounded-xl'>
                      ❌ Terminated
                    </span>
                  ) : item?.isCompleted ? (
                    <span className='text-green-600 text-[10px] font-black uppercase bg-green-50 px-4 py-2 rounded-xl'>
                      ✅ Verified
                    </span>
                  ) : (
                    <button
                      onClick={() => cancelAppointment(item?._id)}
                      className='px-10 py-3 text-white bg-gray-900 font-black text-[10px] uppercase rounded-xl hover:bg-red-600 shadow-md active:scale-95 transition-all'
                    >
                      Abort
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>

        <div className='flex justify-between mt-12 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]'>
          <p>HeartFlow OS // Registry</p>
          <p className='px-4 py-1 bg-white border rounded-full border-gray-50'>Total: {appointments?.length || 0}</p>
        </div>

      </div>
    </div>
  )
}

export default AllAppointments