import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

router.post("/send", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.json({ success: false, message: "Veuillez remplir tous les champs." });
        }

        const newContact = new Contact({ name, email, message });
        await newContact.save();
        res.status(200).json({ success: true, message: "Message envoyé avec succès" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get("/all", async (req, res) => {
    try {
        const messages = await Contact.find().sort({ date: -1 });
        res.status(200).json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Contact.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Message deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


export default router;