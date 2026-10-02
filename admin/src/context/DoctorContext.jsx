import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") || ""
  );

  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);

  const api = axios.create({
    baseURL: backendUrl,
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("dToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const getDoctorSchedule = async () => {
    if (!profileData?._id) {
      toast.error("Profile not loaded yet");
      return {};
    }

    try {
      const { data } = await api.get(`/api/doctor/schedule`, {
        params: { docId: profileData._id },
      });

      if (data.success) {
        return data.schedule;
      }

      toast.error(data.message);
      return {};
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      return {};
    }
  };


 const getHeartPrediction = async (formData) => {
    try {
      const { data } = await api.post("/api/doctor/predict", {
        type: "heart",
        data: formData,
      });

      if (!data.success) return null;

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  
  const getDiabetesPrediction = async (formData) => {
    try {
      const { data } = await api.post("/api/doctor/predict", {
        type: "diabetes",
        data: formData,
      });

      if (!data.success) return null;

      return data.probability;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const getAppointments = async () => {
    try {
      const { data } = await api.get("/api/doctor/appointments");

      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getProfileData = async () => {
    try {
      // FIX 4: Added success check like other functions
      const { data } = await api.get("/api/doctor/profile");

      if (data.success) {
        setProfileData(data.profileData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await api.post("/api/doctor/cancel-appointment", {
        appointmentId,
      });

      if (data.success) {
        toast.success(data.message);
        getAppointments();
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await api.post("/api/doctor/complete-appointment", {
        appointmentId,
      });

      if (data.success) {
        toast.success(data.message);
        getAppointments();
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await api.get("/api/doctor/dashboard");

      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const toggleSlot = async (slotDate, slotTime) => {
    try {
      const { data } = await api.post("/api/doctor/slot/toggle", {
        slotDate,
        slotTime,
      });

      if (!data.success) {
        toast.error(data.message);
      }

      return data;
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      return null;
    }
  };

  const value = {
    dToken,
    setDToken,
    backendUrl,

    appointments,
    getAppointments,
    getDiabetesPrediction,
    cancelAppointment,
    completeAppointment,

    dashData,
    getDashData,

    profileData,
    setProfileData,
    getProfileData,

    getHeartPrediction,
    getDoctorSchedule,
    toggleSlot,
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;