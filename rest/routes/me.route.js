import express from "express";
import { meData } from "../controller/meController.js";
const router = express.Router();

// Routes
router.get("/", meData);

export default router;
