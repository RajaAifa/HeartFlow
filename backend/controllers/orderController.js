import axios from "axios";
import OrderModel from "../models/OrderModel.js";
import Medication from "../models/Medication.js";

const FLASK_AI_URL = process.env.FLASK_AI_URL || "http://127.0.0.1:5001";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

const placeOrderCash = async (req, res) => {
  try {
    // items/address arrivent en string JSON car la requête est multipart/form-data (à cause du fichier)
    const items = typeof req.body.items === "string" ? JSON.parse(req.body.items) : req.body.items;
    const address = typeof req.body.address === "string" ? JSON.parse(req.body.address) : req.body.address;
    const { amount, userId } = req.body;

    for (let item of items) {
      const med = await Medication.findById(item._id);

      if (!med) {
        return res.json({
          success: false,
          message: `Medication not found: ${item.name}`,
        });
      }

      if (med.stock < item.quantity) {
        return res.json({
          success: false,
          message: `Not enough stock for ${item.name}`,
        });
      }

      med.stock -= item.quantity;
      med.isAvailable = med.stock > 0;

      await med.save();
    }

    // --- Gestion de l'ordonnance (optionnelle) ---
    let prescriptionData = { hasPrescription: false };

    if (req.file) {
      const originalFileUrl = `/uploads/prescriptions/${req.file.filename}`;
      const fileType = req.file.mimetype.includes("pdf") ? "pdf" : "image";

      // Le client (Groq, côté navigateur) a déjà tenté une extraction pour les images.
      // On la récupère en priorité, l'utilisateur ayant pu la corriger manuellement.
      let clientExtractedMeds = [];
      if (req.body.extractedMeds) {
        try {
          clientExtractedMeds = JSON.parse(req.body.extractedMeds);
          if (!Array.isArray(clientExtractedMeds)) clientExtractedMeds = [];
        } catch (parseErr) {
          console.log("EXTRACTED MEDS PARSE ERROR:", parseErr.message);
        }
      }

      let extractedMeds = clientExtractedMeds;

      // Fallback : si le client n'a rien fourni (ex: PDF, échec Groq côté client),
      // on tente l'extraction serveur via Flask.
      if (extractedMeds.length === 0) {
        try {
          const aiRes = await axios.post(`${FLASK_AI_URL}/extract-prescription`, {
            fileUrl: `${BACKEND_URL}${originalFileUrl}`
          });
          extractedMeds = aiRes.data.extractedMeds || [];
        } catch (aiError) {
          console.log("AI EXTRACTION ERROR:", aiError.message);
        }
      }

      prescriptionData = {
        hasPrescription: true,
        originalFileUrl,
        fileType,
        extractedMeds
      };
    }

    const order = new OrderModel({
      userId,
      items,
      amount,
      address,
      status: "Pending",
      paymentMethod: "Cash",
      prescription: prescriptionData,
      date: Date.now(),
    });

    await order.save();

    res.json({
      success: true,
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    console.log("ORDER ERROR:", error);
    res.json({ success: false, message: error.message });
  }
};


const allOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find({})
            .populate('userId', 'name image phone')
            .sort({ date: -1 });

        res.json({ success: true, orders });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;

        const orders = await OrderModel.find({ userId }).sort({ date: -1 });

        res.json({ success: true, orders });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const { orderId, userId } = req.body;

        const order = await OrderModel.findById(orderId);

        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        if (order.userId.toString() !== userId) {
            return res.json({ success: false, message: "Unauthorized action" });
        }

        if (order.status !== 'Pending') {
            return res.json({ success: false, message: "Cannot cancel order" });
        }

        await OrderModel.findByIdAndDelete(orderId);

        res.json({ success: true, message: "Order cancelled successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { placeOrderCash, allOrders, userOrders, cancelOrder };