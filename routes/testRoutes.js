const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getTest, submitTest } = require("../controllers/testController");

router.get("/:role", protect, getTest);
router.post("/submit", protect, submitTest);

module.exports = router;
