import express from "express";
import authDoctor from "../middleware/authDoctor.js";
import {
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  doctorList,
  changeAvailablity,
  appointmentComplete,
  doctorDashboard,
  resetPasswordDoctor,
  doctorProfile,
  forgotPasswordDoctor,
  updateDoctorProfile,
  getDoctorSchedule,
  toggleSlot,
  getAnalyses,
  saveAnalysis,
  deleteAnalysis,
  predictDisease,
} from "../controllers/doctorController.js";

const doctorRouter = express.Router();

doctorRouter.post("/login", loginDoctor);
doctorRouter.post("/forgot-password", forgotPasswordDoctor);
doctorRouter.post("/reset-password", resetPasswordDoctor);

doctorRouter.get("/appointments", authDoctor, appointmentsDoctor);
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel);
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete);

doctorRouter.get("/profile", authDoctor, doctorProfile);
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile);

doctorRouter.get("/dashboard", authDoctor, doctorDashboard);

doctorRouter.get("/list", doctorList);
doctorRouter.post("/change-availability", authDoctor, changeAvailablity);

doctorRouter.post("/predict", authDoctor, predictDisease);

doctorRouter.get("/schedule", authDoctor, getDoctorSchedule);
doctorRouter.post("/slot/toggle", authDoctor, toggleSlot);

doctorRouter.post("/save-analysis", authDoctor, saveAnalysis);
doctorRouter.get("/analyses", authDoctor, getAnalyses);
doctorRouter.delete("/analysis/:id", authDoctor, deleteAnalysis);

export default doctorRouter;