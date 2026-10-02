import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "Not Selected",
    dob: "",
    isBlocked: false,
  });

  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/admin/user/${id}`,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );

      if (data.success) {
        const user = data.user;
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          gender: user.gender || "Not Selected",
          dob: user.dob ? user.dob.slice(0, 10) : "",
          isBlocked: user.isBlocked || false,
        });
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
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
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/admin/update-user/${id}`,
        formData,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );

      if (data.success) {
        alert("User updated successfully");
        navigate("/admin/users");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FDFBFB]">
        <div className="text-2xl font-black tracking-tighter text-red-600 animate-pulse">
          RETRIEVING USER DATA...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FDFBFB] p-6 lg:p-12 flex justify-center items-start">
      
     
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl border-t-8 border-red-600 overflow-hidden mx-auto">
        
        <div className="p-10 lg:p-16">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-3 bg-red-600 rounded-full h-14"></div>
            <div>
              <h2 className="text-5xl font-black tracking-tight text-gray-800">Edit User Profile</h2>
              <p className="mt-1 text-sm font-bold tracking-widest text-gray-400 uppercase">
                Security ID: <span className="text-red-600">#{id.slice(-6)}</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-5 text-xl font-medium transition-all border-2 shadow-sm outline-none border-red-50 rounded-2xl focus:border-red-600 focus:bg-white bg-gray-50"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-5 text-xl font-medium transition-all border-2 shadow-sm outline-none border-red-50 rounded-2xl focus:border-red-600 focus:bg-white bg-gray-50"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-5 text-xl font-medium transition-all border-2 shadow-sm outline-none border-red-50 rounded-2xl focus:border-red-600 focus:bg-white bg-gray-50"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-5 text-xl font-medium transition-all border-2 shadow-sm outline-none appearance-none border-red-50 rounded-2xl focus:border-red-600 focus:bg-white bg-gray-50"
                >
                  <option>Not Selected</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Date of Birth</label>
                <input
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full p-5 text-xl font-medium transition-all border-2 shadow-sm outline-none border-red-50 rounded-2xl focus:border-red-600 focus:bg-white bg-gray-50"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Account Restriction</label>
                <div className={`p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${formData.isBlocked ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                  <label className="flex items-center gap-4 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isBlocked"
                      checked={formData.isBlocked}
                      onChange={handleChange}
                      className="w-6 h-6 accent-red-600"
                    />
                    <span className={`text-lg font-black uppercase ${formData.isBlocked ? 'text-red-700' : 'text-green-700'}`}>
                      {formData.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </label>
                </div>
              </div>

            </div>

            <div className="flex flex-col gap-6 pt-10 md:flex-row">
              <button 
                type="submit"
                className="flex-[2] py-6 text-3xl font-black text-white bg-red-600 rounded-3xl shadow-2xl hover:bg-red-700 transition-all transform hover:-translate-y-1 active:scale-95"
              >
                SAVE CHANGES
              </button>
              
              <button 
                type="button"
                onClick={() => navigate("/admin/users")}
                className="flex-1 py-6 text-xl font-bold text-gray-400 transition-all bg-gray-100 rounded-3xl hover:bg-gray-200"
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

export default EditUser;