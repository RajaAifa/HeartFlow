import Medication from "../models/Medication.js";
import { cloudinary } from "../config/cloudinary.js";

export const addMedication = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    if (!name || !price) {
      return res.json({ success: false, message: "Name and price are required" });
    }

    let imageUrl = "";
    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "medications",
      });
      imageUrl = uploaded.secure_url;
    }

    const med = await Medication.create({
      name,
      description,
      price,
      stock: stock || 0,
      image: imageUrl,
      isAvailable: Number(stock) > 0,
    });

    res.json({ success: true, med });
  } catch (err) {
    console.log("ADD MED ERROR:", err);
    res.json({ success: false, message: err.message });
  }
};

export const getMedications = async (req, res) => {
  try {
    const meds = await Medication.find().sort({ createdAt: -1 });
    res.json({ success: true, meds });
  } catch (err) {
    console.log("GET MED ERROR:", err);
    res.json({ success: false, message: err.message });
  }
};

export const deleteMedication = async (req, res) => {
  try {
    const { id } = req.params;

    const med = await Medication.findByIdAndDelete(id);
    if (!med) {
      return res.json({ success: false, message: "Medication not found" });
    }

    res.json({ success: true, message: "Medication deleted" });
  } catch (err) {
    console.log("DELETE MED ERROR:", err);
    res.json({ success: false, message: err.message });
  }
};

export const updateMedicationStock = async (req, res) => {
  try {
    const { id, stock } = req.body;

    const med = await Medication.findByIdAndUpdate(
      id,
      { stock, isAvailable: Number(stock) > 0 },
      { new: true }
    );

    if (!med) {
      return res.json({ success: false, message: "Medication not found" });
    }

    res.json({ success: true, med });
  } catch (err) {
    console.log("STOCK UPDATE ERROR:", err);
    res.json({ success: false, message: err.message });
  }
};

export const updateMedication = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;

    const updatedData = {
      name,
      description,
      price,
      stock,
      isAvailable: Number(stock) > 0,
    };

    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "medications",
      });
      updatedData.image = uploaded.secure_url;
    }

    const med = await Medication.findByIdAndUpdate(id, updatedData, { new: true });
    if (!med) {
      return res.json({ success: false, message: "Medication not found" });
    }

    res.json({ success: true, med });
  } catch (err) {
    console.log("UPDATE MED ERROR:", err);
    res.json({ success: false, message: err.message });
  }
};