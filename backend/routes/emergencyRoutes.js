import express from "express";
import Emergency from "../models/Emergency.js";

const router = express.Router();


router.get("/all", async (req, res) => {
    try {
        const emergencies = await Emergency.find().sort({ createdAt: -1 });
        res.status(200).json(emergencies);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


router.post("/send-alert", async (req, res) => {
    const { patientName, phone, email, address, gender, dob, message } = req.body;
    try {
        const newAlert = new Emergency({
            patientName, phone, email, address, gender, dob, message
        });
        await newAlert.save();
        res.status(200).json({ success: true, message: "Emergency logged" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post("/resolve", async (req, res) => {
    try {
        const { id } = req.body;
        await Emergency.findByIdAndDelete(id);
        res.json({ success: true, message: "Alert resolved" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;