import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  
  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "user", 
  required: true
},

  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],

  amount: { type: Number, required: true },

  address: {
    line1: String,
    line2: String,
    city: String,
    phone: String
  },

  paymentMethod: { type: String, default: "Cash" },

  status: { type: String, default: "Pending" },

  prescription: {
    hasPrescription: { type: Boolean, default: false },
    originalFileUrl: { type: String, default: "" },
    fileType: { type: String, default: "" }, // "image" | "pdf"
    extractedMeds: [
      {
        name: String,
        dosage: String,
        quantity: Number
      }
    ]
  },

  date: { type: Date, default: Date.now }

});

export default mongoose.model("OrderModel", orderSchema);