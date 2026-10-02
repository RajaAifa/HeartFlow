import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "Not Selected",
    dob: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/admin/create-user`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data.success) {
        alert("User created successfully");
        navigate("/admin/users");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
   
    <div className="w-full min-h-screen bg-[#FDFBFB] p-6 lg:p-12 flex justify-center items-start">
      
      
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl border-t-8 border-red-600 overflow-hidden mx-auto">
        
        <div className="p-10 lg:p-16">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-3 bg-red-600 rounded-full h-14"></div>
            <div>
              <h2 className="text-5xl font-black tracking-tight text-gray-800">Register User</h2>
              <p className="mt-1 text-sm font-bold tracking-widest text-gray-400 uppercase">
                Add a new account to the system
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                <input
                  name="name"
                  placeholder="John Doe"
                  onChange={handleChange}
                  required
                  className="w-full p-5 text-xl font-medium transition-all border-2 shadow-sm outline-none border-red-50 rounded-2xl focus:border-red-600 focus:bg-white bg-gray-50"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                <input
                  name="email"
                  type="email"
                  placeholder="example@mail.com"
                  onChange={handleChange}
                  required
                  className="w-full p-5 text-xl font-medium transition-all border-2 shadow-sm outline-none border-red-50 rounded-2xl focus:border-red-600 focus:bg-white bg-gray-50"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">System Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  required
                  className="w-full p-5 text-xl font-medium transition-all border-2 shadow-sm outline-none border-red-50 rounded-2xl focus:border-red-600 focus:bg-white bg-gray-50"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                <input
                  name="phone"
                  placeholder="+216 -- --- ---"
                  onChange={handleChange}
                  className="w-full p-5 text-xl font-medium transition-all border-2 shadow-sm outline-none border-red-50 rounded-2xl focus:border-red-600 focus:bg-white bg-gray-50"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Gender</label>
                <select
                  name="gender"
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
                  onChange={handleChange}
                  className="w-full p-5 text-xl font-medium transition-all border-2 shadow-sm outline-none border-red-50 rounded-2xl focus:border-red-600 focus:bg-white bg-gray-50"
                />
              </div>

            </div>

            <div className="flex flex-col gap-6 pt-10 md:flex-row">
              <button 
                type="submit"
                className="flex-[2] py-6 text-3xl font-black text-white bg-gray-900 rounded-3xl shadow-2xl hover:bg-red-600 transition-all transform hover:-translate-y-1 active:scale-95"
              >
                CREATE USER
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

export default CreateUser;