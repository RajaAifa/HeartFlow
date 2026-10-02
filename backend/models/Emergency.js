import mongoose from "mongoose";

const emergencySchema = new mongoose.Schema({
    patientName: String,
    phone: String,
    email: String,
    address: String,
    gender: String,
    dob: String,
    message: String,
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Emergency", emergencySchema);