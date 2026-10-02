import express from "express";
import { predictDisease } from "../controllers/predictionController.js";

const router = express.Router();

router.post("/predict", predictDisease);

export default router;