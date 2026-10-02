import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";

const DoctorPro = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const {
    doctors,
    appointments,
    getAllDoctors,
    getAllAppointments,
  } = useContext(AdminContext);

  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    if (doctors.length === 0) getAllDoctors();
    if (appointments.length === 0) getAllAppointments();
  }, [doctors, appointments]);

  useEffect(() => {
    const foundDoctor = doctors.find((d) => d._id === doctorId);
    setDoctor(foundDoctor);
  }, [doctors, doctorId]);

  if (!doctor) {
    return (
      <div className="flex items-center justify-center min-h-screen text-2xl font-bold text-red-600">
        Loading profile...
      </div>
    );
  }

  const doctorAppointments = appointments.filter((a) => a.docId === doctorId);
  const totalAppointments = doctorAppointments.length;
  const totalEarnings = doctorAppointments
    .filter((a) => !a.cancelled)
    .reduce((sum, a) => sum + (a.amount || 0), 0);

  return (
  
    <div className="min-h-screen bg-[#FDFBFB] p-8 lg:p-14 flex justify-center items-start w-full">
      
     
      <div className="w-full mx-auto max-w-7xl">
        
        <div className="flex flex-col items-center justify-between p-10 mb-10 bg-white border-t-8 border-red-600 shadow-xl lg:flex-row rounded-3xl">
          <div className="flex flex-col items-center gap-10 lg:flex-row">
            <img
              src={doctor.image}
              className="object-cover border-4 shadow-md border-red-50 rounded-3xl w-44 h-44 lg:w-52 lg:h-52"
              alt="doctor"
            />
            <div className="text-center lg:text-left">
              <h1 className="mb-2 text-4xl font-black text-gray-900 lg:text-5xl">{doctor.name}</h1>
              <p className="text-2xl font-bold tracking-tight text-red-600">{doctor.speciality}</p>
              <p className="mt-1 text-lg text-gray-500">{doctor.email}</p>
              <div className="mt-5">
                <span className={`px-6 py-2 text-sm font-black rounded-full border-2 ${doctor.available ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                  {doctor.available ? "● SYSTEM ACTIVE" : "○ OFFLINE"}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(`/admin/doctor/edit/${doctor._id}`)}
            className="px-12 py-4 mt-8 text-xl font-bold text-white transition-all transform bg-red-600 shadow-lg lg:mt-0 rounded-2xl hover:bg-red-700 hover:-translate-y-1"
          >
            Modify Doctor
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-10 md:grid-cols-3">
          <div className="p-10 text-center bg-white rounded-[2rem] shadow-md border-b-8 border-red-500">
            <p className="mb-2 text-6xl font-black text-red-600">{totalAppointments}</p>
            <p className="text-lg font-bold tracking-widest text-gray-400 uppercase">Total Appointments</p>
          </div>

          <div className="p-10 text-center bg-white rounded-[2rem] shadow-md border-b-8 border-red-500">
            <p className="mb-2 text-6xl font-black text-red-600">{totalEarnings} <span className="text-2xl">DT</span></p>
            <p className="text-lg font-bold tracking-widest text-gray-400 uppercase">Revenue Generated</p>
          </div>

          <div className="p-10 text-center bg-white rounded-[2rem] shadow-md border-b-8 border-gray-200">
            <p className={`text-6xl font-black mb-2 ${doctor.available ? 'text-green-500' : 'text-gray-300'}`}>
              {doctor.available ? "LIVE" : "OFF"}
            </p>
            <p className="text-lg font-bold tracking-widest text-gray-400 uppercase">Current Status</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          
          {/* ABOUT - Span 4/12 */}
          <div className="lg:col-span-4 p-10 bg-white rounded-[2rem] shadow-lg border border-red-50">
            <h3 className="flex items-center mb-6 text-2xl font-black text-gray-800">
              <span className="w-2 h-8 mr-4 bg-red-600 rounded-full"></span>
              Doctor Bio
            </h3>
            <p className="text-xl italic font-medium leading-relaxed text-gray-600">
              "{doctor.about}"
            </p>
          </div>

          <div className="lg:col-span-8 p-10 bg-white rounded-[2rem] shadow-lg">
            <h3 className="flex items-center mb-8 text-2xl font-black text-gray-800">
              <span className="w-2 h-8 mr-4 bg-red-600 rounded-full"></span>
              Appointment Schedule
            </h3>

            {doctorAppointments.length === 0 ? (
              <div className="p-20 text-2xl font-bold text-center text-gray-300 border-4 border-gray-100 border-dashed rounded-3xl">
                No history found.
              </div>
            ) : (
              <div className="space-y-6">
                {doctorAppointments.map((a) => (
                  <div 
                    key={a._id} 
                    className="flex flex-wrap items-center justify-between p-8 transition-all border border-transparent shadow-sm bg-gray-50 rounded-2xl hover:border-red-200 hover:bg-red-50"
                  >
                    <div className="flex items-center gap-8">
                       <div className="p-4 bg-white rounded-xl text-red-600 font-black text-center min-w-[100px] shadow-sm">
                          <p className="text-sm text-gray-400 uppercase">{new Date(a.date).toLocaleDateString('en-US', { month: 'short' })}</p>
                          <p className="text-2xl">{new Date(a.date).getDate()}</p>
                       </div>
                       <div>
                          <p className="text-2xl font-black text-gray-800">{a.slotTime}</p>
                          <p className="text-lg font-medium text-gray-500">{a.slotDate}</p>
                       </div>
                    </div>

                    <div className="text-right">
                      <span className={`px-5 py-1 rounded-full text-xs font-black uppercase ${a.cancelled ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {a.cancelled ? "Cancelled" : "Confirmed"}
                      </span>
                      <p className="mt-2 text-3xl font-black text-gray-900">{a.amount} DT</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorPro;