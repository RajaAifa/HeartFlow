import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'

const Doctors = () => {

  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext)

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  return (
    <div className="py-12 bg-[#F8F9FB] min-h-screen px-4">
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Medical <span className="text-red-500">Directory</span>
        </h1>
        <div className="w-20 h-1 mt-2 bg-red-500 rounded-full"></div>
      </div>

      <div className='flex flex-col max-w-6xl gap-10 mx-auto lg:flex-row'>
        
        <aside className="w-full lg:w-72">
          <div className="sticky p-6 border border-white shadow-sm bg-white/70 backdrop-blur-md rounded-3xl top-10">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Filter by Category</h2>
            
            <div className="space-y-3">
              {[
                { name: 'Cardiologist', path: '/doctors/Cardiologist' },
                { name: 'Diabetologist', path: '/doctors/Diabetologist' }
              ].map((item) => (
                <div 
                  key={item.name}
                  onClick={() => speciality === item.name ? navigate('/doctors') : navigate(item.path)}
                  className={`group cursor-pointer p-4 rounded-2xl transition-all duration-300 flex items-center justify-between ${speciality === item.name ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-gray-50 text-slate-600 hover:bg-white hover:shadow-md'}`}
                >
                  <span className="text-xs font-bold tracking-wider uppercase">{item.name}</span>
                  <span className={`text-lg ${speciality === item.name ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>→</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className='grid flex-1 grid-cols-1 gap-8 md:grid-cols-2'>
          {filterDoc.map((item, index) => (
            <div 
              key={index}
              onClick={() => { navigate(`/appointment/${item._id}`); window.scrollTo(0, 0) }} 
              className='group relative bg-white border border-slate-100 rounded-[2.5rem] p-4 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2'
            >
              <div className="flex flex-col items-center gap-6 md:flex-row">
                
                <div className="relative shrink-0">
                  <div className="absolute inset-0 border-2 border-dashed border-red-200 rounded-full animate-[spin_10s_linear_infinite] group-hover:border-red-500"></div>
                  <img 
                    className='object-cover w-32 h-32 p-2 rounded-full' 
                    src={item.image} 
                    alt={item.name} 
                  />
                  <div className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-4 border-white ${item.available ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                </div>

                <div className="text-center md:text-left">
                  <span className="text-[10px] font-black uppercase text-red-500 tracking-widest bg-red-50 px-3 py-1 rounded-full">
                    {item.speciality}
                  </span>
                  <h3 className="mt-2 mb-1 text-xl font-bold transition-colors text-slate-900 group-hover:text-red-500">
                    {item.name}
                  </h3>
                  <p className="text-xs font-medium tracking-tight uppercase text-slate-400">Available for consultation</p>
                  
                  <div className="flex items-center justify-center gap-2 mt-4 md:justify-start">
                     <div className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl group-hover:bg-red-500 transition-colors">
                        View Profile
                     </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  )
}

export default Doctors