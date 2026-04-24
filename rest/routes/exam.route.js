import express from "express";
import { getExamByTitle, createExam } from "../controller/examController.js";

const router = express.Router();

// GET /api/exams/philippine-history
router.get("/philippine-history", getExamByTitle);

// POST /api/exams
router.post("/", createExam);

export default router;
