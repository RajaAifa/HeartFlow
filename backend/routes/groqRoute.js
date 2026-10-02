import express from "express";
import authUser from "../middleware/authUser.js";
import { groqProxy } from "../controllers/groqController.js";

const groqRouter = express.Router();
groqRouter.post("/chat", authUser, groqProxy);

export default groqRouter;