import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  
  userId: { type: String, required: true },
  docId: { type: String, required: true },

  slotDate: { type: String, required: true },
  slotTime: { type: String, required: true },

  userData: { type: Object, default: {} },
  docData: { type: Object, default: {} },

  amount: { type: Number, required: true },
  date: { type: Number, required: true },

  cancelled: { type: Boolean, default: false },
  payment: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },

  type: {
    type: String,
    enum: ["appointment", "blocked"],
    default: "appointment",
  },
});

appointmentSchema.index({ docId: 1, slotDate: 1 });

const appointmentModel =
  mongoose.models.appointment ||
  mongoose.model("appointment", appointmentSchema);

export default appointmentModel;