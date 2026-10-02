import express from "express";
import upload from "../middleware/multer.js";
import {
  addMedication,
  getMedications,
  deleteMedication,
  updateMedicationStock,
  updateMedication
} from "../controllers/medication.controller.js";

const router = express.Router();

router.post("/add", upload.single("image"), addMedication);
router.get("/all", getMedications);
router.delete("/:id", deleteMedication);
router.post("/update-stock", updateMedicationStock); 
router.put("/update-medication/:id", upload.single("image"), updateMedication); 

export default router;