const express = require("express");
const { register, login, googleAuth, getProfile, updateProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);

// Profile Management
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;
