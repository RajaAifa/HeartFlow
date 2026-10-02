import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import axios from "axios";
import sendEmail from "../sendEmail.js";
import analysisModel from "../models/analysisModel.js";


const toggleSlot = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;

    const existingBlock = await appointmentModel.findOne({
      docId,
      slotDate,
      slotTime,
      type: "blocked",
    });

    if (existingBlock) {
      await appointmentModel.deleteOne({ _id: existingBlock._id });
      return res.json({ success: true, message: "Slot unblocked" });
    }

    const booked = await appointmentModel.findOne({
      docId,
      slotDate,
      slotTime,
      type: "appointment",
      cancelled: false,
    });

    if (booked) {
      return res.json({ success: false, message: "Slot already booked" });
    }

    const doctor = await doctorModel.findById(docId).select("-password");
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    await appointmentModel.create({
      docId,
      slotDate,
      slotTime,
      type: "blocked",
      cancelled: false,
      isCompleted: false,
      amount: 0,
      date: Date.now(),
      userId: docId,
      userData: { name: "blocked" },
      docData: { name: doctor.name },
    });

    return res.json({ success: true, message: "Slot blocked" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


const getDoctorSchedule = async (req, res) => {
  try {
    const docId = req.body.docId || req.query.docId;

    const data = await appointmentModel.find({
      docId,
      type: { $in: ["appointment", "blocked"] },
    });

    const grouped = {};

    data.forEach((item) => {
      const key = item.slotDate;
      if (!grouped[key]) grouped[key] = [];

      grouped[key].push({
        time: item.slotTime,
        type: item.type || "appointment",
        cancelled: item.cancelled || false,
        isCompleted: item.isCompleted || false,
      });
    });

    return res.json({ success: true, schedule: grouped });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


const forgotPasswordDoctor = async (req, res) => {
  try {
    const { email } = req.body;

    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    const resetToken = jwt.sign(
      { id: doctor._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const link = `${process.env.FRONTEND_URL}/reset-password/doctor/${resetToken}`;

    await sendEmail(email, "Doctor Reset", `Click: ${link}`);

    res.json({ success: true, message: "Email sent" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};


const resetPasswordDoctor = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.json({ success: false, message: "Missing data" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const doctor = await doctorModel.findById(decoded.id);
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    doctor.password = hashedPassword;
    await doctor.save();

    res.json({ success: true, message: "Doctor password updated successfully" });
  } catch (error) {
    res.json({ success: false, message: "Invalid or expired token" });
  }
};

const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await doctorModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body;

    const appointments = await appointmentModel.find({
      docId,
      type: { $ne: "blocked" },
    });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId.toString() === docId.toString()) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });

      return res.json({ success: true, message: "Appointment Cancelled" });
    }

    res.json({ success: false, message: "Invalid request" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId.toString() === docId.toString()) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });

      return res.json({ success: true, message: "Appointment Completed" });
    }

    res.json({ success: false, message: "Invalid request" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const changeAvailablity = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);

    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });

    res.json({ success: true, message: "Availability Changed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;

    const profileData = await doctorModel.findById(docId).select("-password");

    res.json({ success: true, profileData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateDoctorProfile = async (req, res) => {
  try {
    const { docId, fees, address, available } = req.body;

    await doctorModel.findByIdAndUpdate(docId, { fees, address, available });

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;

    const appointments = await appointmentModel.find({
      docId,
      type: { $ne: "blocked" },
    });

    let earnings = 0;
    let patients = [];

    appointments.forEach((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }

      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse(),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const predictDisease = async (req, res) => {
  try {
    const { type, data } = req.body;

    let targetUrl = "";
    let payload = {};

    if (type === "heart") {
      targetUrl = `${process.env.FLASK_AI_URL || "http://127.0.0.1:5001"}/predict-doctor-heart`;

      const optional = (key) => {
        const val = data[key];
        if (val === undefined || val === null || val === "" || val === "null") return null;
        return Number(val);
      };

      const poids  = Number(data.poids);
      const taille = Number(data.taille);
      const bmi    = data.BMI ? Number(data.BMI) : parseFloat((poids / (taille * taille)).toFixed(2));

      payload = {
        data: {
          age:                        Number(data.age),
          sexe:                       Number(data.sexe),           // 1=Male, 0=Female
          tabac:                      Number(data.tabac),          // 1=Yes, 0=No
          ethylisme:                  Number(data.ethylisme),      // 1=Yes, 0=No
          ATCD_perso:                 Number(data.ATCD_perso),     // 1=Yes, 0=No
          ATCD_fam_Db:                Number(data.ATCD_fam_Db),    // 1=Yes, 0=No
          ATCD_fam_HTA:               Number(data.ATCD_fam_HTA),   // 1=Yes, 0=No
          ATCD_fam_IR:                Number(data.ATCD_fam_IR),    // 1=Yes, 0=No
          ATCD_fam_Cardio:            Number(data.ATCD_fam_Cardio),// 1=Yes, 0=No
          poids:                      poids,                       // kg
          taille:                     taille,                      // meters
          BMI:                        bmi,                         // auto-calculated
          TA:                         Number(data.TA),
          glycemie_jeun:              Number(data.glycemie_jeun),
          HbA1c:                      Number(data.HbA1c),
          creatinine:                 optional("creatinine"),
          uree:                       optional("uree"),
          chol_total:                 optional("chol_total"),
          HDL_chol:                   optional("HDL_chol"),
          triglycerides:              optional("triglycerides"),
          albuminurie:                optional("albuminurie"),
          ECG:                        Number(data.ECG),
        },
      };

    } else if (type === "diabetes") {
      targetUrl = `${process.env.FLASK_AI_URL || "http://127.0.0.1:5001"}/predict-diabetes`;
      payload = { data };

    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid prediction type",
      });
    }

    const response = await axios.post(targetUrl, payload);

    const finalScore = response.data.prediction ?? 0;
    const predictionLabel = finalScore > 50 ? "High Risk" : "Low Risk";

    res.json({
      success: true,
      prediction: predictionLabel,
      probability: finalScore,
      message: "Prediction successful",
    });

  } catch (error) {
    console.log("ML ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "AI Engine connection failed",
      error: error.message,
    });
  }
};

const saveAnalysis = async (req, res) => {
  try {
    const { docId } = req.body;
    const analysis = await analysisModel.create({ docId, ...req.body });
    res.json({ success: true, analysis });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getAnalyses = async (req, res) => {
  try {
    const { docId } = req.body;
    const analyses = await analysisModel.find({ docId }).sort({ createdAt: -1 });
    res.json({ success: true, analyses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
// Delete one analysis
const deleteAnalysis = async (req, res) => {
  try {
    await analysisModel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export {
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  doctorList,
  forgotPasswordDoctor,
  resetPasswordDoctor,
  changeAvailablity,
  appointmentComplete,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
  predictDisease,
  getDoctorSchedule,
  toggleSlot,
  saveAnalysis,
  getAnalyses,
  deleteAnalysis,
};