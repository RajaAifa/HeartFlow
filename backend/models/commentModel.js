import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  doctorId: { type: String, required: true },
  userId: { type: String, required: true },

  userName: String,
  rating: { type: Number, min: 1, max: 5 },
  comment: String,

  isDeleted: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
});

const commentModel = mongoose.model("comment", commentSchema);

export default commentModel;