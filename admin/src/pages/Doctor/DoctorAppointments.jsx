import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorAppointments = () => {

  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, currency } = useContext(AppContext)

  const [search, setSearch] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [showArchived, setShowArchived] = useState(false)
  const [archivedIds, setArchivedIds] = useState([])

  const archiveStorageKey = `archivedAppointments_${dToken}`

  useEffect(() => {
    if (dToken) {
      getAppointments()
      // charge les archives sauvegardées pour ce médecin
      const saved = localStorage.getItem(archiveStorageKey)
      setArchivedIds(saved ? JSON.parse(saved) : [])
    }
  }, [dToken])

  const persistArchivedIds = (ids) => {
    setArchivedIds(ids)
    localStorage.setItem(archiveStorageKey, JSON.stringify(ids))
  }

  const archiveAppointment = (id) => {
    if (!archivedIds.includes(id)) {
      persistArchivedIds([...archivedIds, id])
    }
  }

  const unarchiveAppointment = (id) => {
    persistArchivedIds(archivedIds.filter((archivedId) => archivedId !== id))
  }

  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.slotDate} ${a.slotTime}`);
    const dateB = new Date(`${b.slotDate} ${b.slotTime}`);
    return dateB - dateA;
  });

  // slotDate est stocké au format "DD_MM_YYYY" -> on le convertit en "YYYY-MM-DD" pour comparer avec l'input date
  const normalizeSlotDate = (slotDate) => {
    if (!slotDate) return ""
    const [day, month, year] = slotDate.split('_')
    return `${year}-${month?.padStart(2, '0')}-${day?.padStart(2, '0')}`
  }

  const filteredAppointments = sortedAppointments.filter((item) => {
    const matchesSearch =
      item?.userData?.name?.toLowerCase().includes(search.toLowerCase()) ||
      item?.userData?.phone?.toLowerCase().includes(search.toLowerCase())

    const matchesDate = dateFilter
      ? normalizeSlotDate(item.slotDate) === dateFilter
      : true

    const isArchived = archivedIds.includes(item._id)
    const matchesArchiveView = showArchived ? isArchived : !isArchived

    return matchesSearch && matchesDate && matchesArchiveView
  })

  const clearFilters = () => {
    setSearch("")
    setDateFilter("")
  }

  return (
    <div className='p-6 md:p-10 bg-[#F8FAFC] min-h-screen'>

      <div className='flex flex-col justify-between gap-4 mb-8 md:flex-row md:items-center'>
        <div>
          <h1 className='text-3xl font-black tracking-tight uppercase text-slate-800'>
            Appointment <span className='italic text-red-600'>Ledger</span>
          </h1>
          <p className='text-sm font-medium text-slate-500'>
            {showArchived
              ? 'Archived consultations.'
              : 'Chronological feed of your medical consultations.'}
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm transition-colors ${
              showArchived
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {showArchived ? '← Back to Active' : `🗄 View Archive (${archivedIds.length})`}
          </button>

          <div className='px-6 py-2 bg-white border shadow-sm rounded-2xl border-slate-200'>
            <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>
              Sort: Newest First
            </p>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-3 mb-6 md:flex-row'>
        <input
          type="text"
          placeholder="🔍 Search by patient name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='flex-1 px-5 py-4 text-sm bg-white border-2 shadow-sm border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300'
        />

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className='px-5 py-4 text-sm font-bold bg-white border-2 shadow-sm border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700'
        />

        {(search || dateFilter) && (
          <button
            onClick={clearFilters}
            className='px-5 py-4 text-xs font-black uppercase transition-colors bg-white border-2 shadow-sm border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-50 whitespace-nowrap'
          >
            Clear ✕
          </button>
        )}
      </div>

      <div className='bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden'>

        {/* Table Header */}
        <div className='hidden lg:grid grid-cols-[0.5fr_2.5fr_1.2fr_1.5fr_2.5fr_1fr_1.8fr] items-center px-8 py-5 bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest'>
          <p>#</p>
          <p>Patient Info</p>
          <p>Payment</p>
          <p>Phone Number</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p className='text-center'>Actions</p>
        </div>

        <div className='max-h-[70vh] overflow-y-auto divide-y divide-slate-50'>
          {filteredAppointments.length === 0 ? (
            <div className='py-16 text-center'>
              <p className='text-sm font-bold text-slate-400'>
                {showArchived ? 'No archived appointments.' : 'No appointments match your filters.'}
              </p>
            </div>
          ) : (
            filteredAppointments.map((item, index) => (
              <div
                key={index}
                className='flex flex-col lg:grid lg:grid-cols-[0.5fr_2.5fr_1.2fr_1.5fr_2.5fr_1fr_1.8fr] items-center px-8 py-5 gap-4 hover:bg-slate-50 transition-all group'
              >
                <p className='hidden text-xs font-bold lg:block text-slate-300'>
                  {String(index + 1).padStart(2, '0')}
                </p>

                <div className='flex items-center w-full gap-4 lg:w-auto'>
                  <img src={item.userData.image} className='object-cover border-2 shadow-sm w-11 h-11 rounded-xl border-slate-100' alt="" />
                  <p className='text-sm font-black tracking-tight uppercase text-slate-800'>
                    {item.userData.name}
                  </p>
                </div>

                <div className='w-full lg:w-auto'>
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${item.payment ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                    {item.payment ? 'Online' : 'Cash'}
                  </span>
                </div>

                <div className='w-full lg:w-auto'>
                  <p className='text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl w-fit'>
                    {item.userData.phone}
                  </p>
                </div>

                <div className='flex flex-col w-full lg:w-auto'>
                  <p className='text-xs font-black uppercase text-slate-700'>
                    {slotDateFormat(item.slotDate)}
                  </p>
                  <p className='text-[11px] font-bold text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded-lg w-fit mt-1'>
                    {item.slotTime}
                  </p>
                </div>

                <p className='w-full text-sm font-black text-slate-800 lg:w-auto'>
                  {currency}{item.amount}
                </p>

                <div className='flex justify-center w-full gap-2 lg:w-auto'>
                  {showArchived ? (
                    <button
                      onClick={() => unarchiveAppointment(item._id)}
                      className='px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors'
                    >
                      ↩ Unarchive
                    </button>
                  ) : (
                    <>
                      {item.cancelled ? (
                        <span className='px-4 py-1.5 bg-rose-50 text-rose-500 text-[10px] font-black uppercase rounded-xl border border-rose-100'>
                          Cancelled
                        </span>
                      ) : item.isCompleted ? (
                        <span className='px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-xl border border-emerald-100'>
                          Completed
                        </span>
                      ) : (
                        <div className='flex items-center gap-2'>
                          <img
                            onClick={() => cancelAppointment(item._id)}
                            className='transition-transform cursor-pointer w-9 hover:scale-110 active:scale-90'
                            src={assets.cancel_icon}
                            alt="Cancel"
                          />
                          <img
                            onClick={() => completeAppointment(item._id)}
                            className='transition-transform cursor-pointer w-9 hover:scale-110 active:scale-90'
                            src={assets.tick_icon}
                            alt="Complete"
                          />
                        </div>
                      )}
                     <button
                        onClick={() => archiveAppointment(item._id)}
                        title="Archive this appointment"
                        className='px-4 py-2.5 bg-slate-100 text-slate-500 text-sm font-black uppercase rounded-xl border border-slate-200 hover:bg-slate-200 transition-colors hover:scale-105 active:scale-95'
                      >
                        📥
                      </button>
                    </>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      <div className='mt-8 text-center'>
        <p className='text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]'>
          Clinical Session Manager // v2.0
        </p>
      </div>

    </div>
  )
}

export default DoctorAppointments