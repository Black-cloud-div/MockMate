const express = require("express");
const {
    generateInterviewQuestion,
    submitInterview,
    getHistory,
    getResult,
    extractResume,
    upload
} = require("../controllers/interviewController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/generate-question", protect, generateInterviewQuestion);
router.post("/submit", protect, submitInterview);
router.get("/history", protect, getHistory);
router.get("/result/:id", protect, getResult);
router.post("/extract-resume", protect, upload.single('resume'), extractResume);

module.exports = router;
