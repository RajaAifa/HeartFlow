import axios from "axios";
import prescriptionModel from "../models/prescriptionModel.js";

const FLASK_AI_URL = process.env.FLASK_AI_URL || "http://127.0.0.1:5001";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

// Étape 1 : upload + envoi à l'IA pour extraction
const analyzePrescription = async (req, res) => {
  try {
    const { userId } = req.body;
    const file = req.file;

    if (!file) {
      return res.json({ success: false, message: "Aucun fichier reçu" });
    }

    const originalFileUrl = `/uploads/prescriptions/${file.filename}`;
    const fileType = file.mimetype.includes("pdf") ? "pdf" : "image";

    let extractedMeds = [];
    try {
      const aiRes = await axios.post(`${FLASK_AI_URL}/extract-prescription`, {
        fileUrl: `${BACKEND_URL}${originalFileUrl}`
      });
      extractedMeds = aiRes.data.extractedMeds || [];
    } catch (aiError) {
      console.log("AI EXTRACTION ERROR:", aiError.message);
    }

    const prescription = await prescriptionModel.create({
      userId,
      originalFileUrl,
      fileType,
      extractedMeds,
      status: "draft"
    });

    res.json({
      success: true,
      prescriptionId: prescription._id,
      extractedMeds
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Étape 2 : le patient confirme la liste corrigée -> envoi à l'admin
const submitPrescription = async (req, res) => {
  try {
    const { prescriptionId, extractedMeds } = req.body;

    const prescription = await prescriptionModel.findById(prescriptionId);
    if (!prescription) {
      return res.json({ success: false, message: "Ordonnance introuvable" });
    }

    prescription.extractedMeds = extractedMeds;
    prescription.status = "pending";
    await prescription.save();

    res.json({ success: true, message: "Ordonnance envoyée à l'admin" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Le patient récupère l'historique de ses ordonnances
const userPrescriptions = async (req, res) => {
  try {
    const { userId } = req.body;
    const prescriptions = await prescriptionModel.find({ userId }).sort({ date: -1 });
    res.json({ success: true, prescriptions });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Admin : liste des ordonnances en attente
const allPrescriptions = async (req, res) => {
  try {
    const prescriptions = await prescriptionModel.find({}).sort({ date: -1 });
    res.json({ success: true, prescriptions });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Admin : approuver / rejeter une ordonnance
const reviewPrescription = async (req, res) => {
  try {
    const { prescriptionId, status, adminNote } = req.body; // status: "approved" | "rejected"

    await prescriptionModel.findByIdAndUpdate(prescriptionId, { status, adminNote });

    res.json({ success: true, message: `Ordonnance ${status === "approved" ? "approuvée" : "rejetée"}` });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  analyzePrescription,
  submitPrescription,
  userPrescriptions,
  allPrescriptions,
  reviewPrescription
};