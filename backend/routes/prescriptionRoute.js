import express from "express";
import upload from "../middleware/multer.js";
import authUser from "../middleware/authUser.js";
import authAdmin from "../middleware/authAdmin.js";
import {
  analyzePrescription,
  submitPrescription,
  userPrescriptions,
  allPrescriptions,
  reviewPrescription
} from "../controllers/prescriptionController.js";

const prescriptionRouter = express.Router();

// Patient
prescriptionRouter.post("/analyze", authUser, upload.single("prescription"), analyzePrescription);
prescriptionRouter.post("/submit", authUser, submitPrescription);
prescriptionRouter.get("/user-prescriptions", authUser, userPrescriptions);

// Admin
prescriptionRouter.get("/admin/list", authAdmin, allPrescriptions);
prescriptionRouter.post("/admin/review", authAdmin, reviewPrescription);

export default prescriptionRouter;