import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import dietRouter from "./routes/Dietrouter.js";

import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";
import chatRouter from "./routes/chatRoute.js";
import emergencyRoutes from "./routes/emergencyRoutes.js";
import contactRoute from "./routes/contactRoute.js";
import orderRouter from "./routes/orderRoute.js";
import medicationRoutes from "./routes/medicationRoutes.js";
import groqRouter from "./routes/groqRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(",").map((u) => u.trim().replace(/\/+$/, ""))
  : ["http://localhost:5173", "http://localhost:5174"];

connectDB();
connectCloudinary();

app.use("/uploads", express.static("uploads"));
app.use(
  cors({
    origin: (origin, callback) => {
      // allow tools without an Origin header (curl, Postman) and listed frontends
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      console.log("CORS blocked origin:", origin, "| allowed:", allowedOrigins); return callback(null, false);
    },
  })
);
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", dietRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/chat", chatRouter);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/contact", contactRoute);
app.use("/api/order", orderRouter);
app.use("/api/medication", medicationRoutes);
app.use("/api/groq", groqRouter);

app.get("/", (req, res) => {
  res.send("API HeartFlow Working 🚀");
});

app.listen(port, () => {
  console.log("-----------------------------------------");
  console.log(`✅ Server started on PORT: ${port}`);
  console.log("✅ Doctor Panel routes: /api/doctor");
  console.log("✅ ML Prediction route: /api/doctor/predict");
  console.log("-----------------------------------------");
});