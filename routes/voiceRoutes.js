const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { startSession, processAudio, getHistory } = require("../controllers/voiceController");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/start", protect, startSession);
router.post("/process", protect, upload.single("audio"), processAudio);
router.get("/history", protect, getHistory);

module.exports = router;
