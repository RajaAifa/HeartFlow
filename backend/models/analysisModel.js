import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    docId:           { type: String, required: true },
    patientName:     { type: String, required: true },
    appointmentDate: { type: String },
    clinicalData:    { type: Object },
    prediction:      { type: String },
    probability:     { type: Number },
    prescription: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Analysis", analysisSchema);