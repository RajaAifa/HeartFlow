import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },

  originalFileUrl: { type: String, required: true }, // ex: /uploads/prescriptions/xxx.jpg
  fileType: { type: String, required: true }, // "image" | "pdf"

  extractedMeds: [
    {
      name: String,
      dosage: String,
      quantity: Number
    }
  ],

  status: { type: String, default: "draft" }, // draft -> pending -> approved -> rejected
  adminNote: { type: String, default: "" },

  date: { type: Date, default: Date.now }

});

export default mongoose.model("PrescriptionModel", prescriptionSchema);