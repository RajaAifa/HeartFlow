import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    speciality: "",
    degree: "",
    experience: "",
    about: "",
    fees: "",
    available: true,
  });

  const fetchDoctor = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/admin/doctor/${id}`,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );

      if (data.success) {
        const d = data.doctor;
        setFormData({
          name: d.name || "",
          email: d.email || "",
          speciality: d.speciality || "",
          degree: d.degree || "",
          experience: d.experience || "",
          about: d.about || "",
          fees: d.fees || "",
          available: d.available ?? true,
        });
      }
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/admin/update-doctor/${id}`,
        formData,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );

      if (data.success) {
        alert("Doctor updated successfully");
        navigate(`/admin/doctor/${id}`);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
   
    <div className="w-full min-h-screen bg-[#FDFBFB] p-6 lg:p-12 flex justify-center items-start">
      
      
      <div className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl border-t-8 border-red-600 overflow-hidden mx-auto">
        
        <div className="p-12">
          <div className="flex items-center gap-6 mb-10">
            <div className="w-3 h-12 bg-red-600 rounded-full"></div>
            <h2 className="text-5xl font-black tracking-tight text-gray-800">Edit Doctor Profile</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                <input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="w-full p-5 text-xl font-medium transition-all border-2 shadow-sm outline-none border-red-50 rounded-2xl focus:border-red-600" 
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                <input 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className="w-full p-5 text-xl font-medium transition-all border-2 shadow-sm outline-none border-red-50 rounded-2xl focus:border-red-600" 
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Speciality</label>
                <input 
                  name="speciality" 
                  value={formData.speciality} 
                  onChange={handleChange} 
                  className="w-full p-5 text-xl font-medium transition-all border-2 shadow-sm outline-none border-red-50 rounded-2xl focus:border-red-600" 
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Medical Degree</label>
                <input 
                  name="degree" 
                  value={formData.degree} 
                  onChange={handleChange} 
                  className="w-full p-5 text-xl font-medium transition-all border-2 shadow-sm outline-none border-red-50 rounded-2xl focus:border-red-600" 
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Experience</label>
                <input 
                  name="experience" 
                  value={formData.experience} 
                  onChange={handleChange} 
                  className="w-full p-5 text-xl font-medium transition-all border-2 shadow-sm outline-none border-red-50 rounded-2xl focus:border-red-600" 
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Consultation Fees (DT)</label>
                <input 
                  name="fees" 
                  type="number" 
                  value={formData.fees} 
                  onChange={handleChange} 
                  className="w-full p-5 text-xl font-bold text-red-600 transition-all border-2 shadow-sm outline-none border-red-50 rounded-2xl focus:border-red-600" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Professional Biography</label>
              <textarea 
                name="about" 
                rows="5"
                value={formData.about} 
                onChange={handleChange} 
                className="w-full p-6 text-xl italic font-medium transition-all border-2 shadow-sm outline-none border-red-50 rounded-2xl focus:border-red-600" 
              />
            </div>

            <div className="flex items-center justify-between p-8 bg-red-50 rounded-[2rem] border-2 border-red-100">
              <label className="flex items-center gap-6 cursor-pointer group">
                <input 
                  type="checkbox" 
                  name="available" 
                  checked={formData.available} 
                  onChange={handleChange}
                  className="w-8 h-8 cursor-pointer accent-red-600"
                />
                <span className="text-2xl font-bold text-gray-700 transition-colors group-hover:text-red-600">
                  Available for Appointments
                </span>
              </label>
              
              <div className={`px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest ${formData.available ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                {formData.available ? "System Active" : "System Hidden"}
              </div>
            </div>

            <div className="flex gap-6 pt-6">
              <button 
                type="submit" 
                className="flex-[2] py-6 text-3xl font-black text-white bg-red-600 rounded-3xl shadow-2xl hover:bg-red-700 transition-all transform hover:-translate-y-1 active:scale-95"
              >
                UPDATE DOCTOR
              </button>
              
              <button 
                type="button"
                onClick={() => navigate(`/admin/doctor/${id}`)}
                className="flex-1 py-6 text-2xl font-bold text-gray-400 transition-all bg-gray-100 rounded-3xl hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDoctor;