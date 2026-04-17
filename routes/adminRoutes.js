const express = require("express");
const {
    listUsers,
    addQuestion,
    deleteQuestion,
    listQuestions
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/users", protect, adminOnly, listUsers);
router.post("/add-question", protect, addQuestion);
router.delete("/question/:id", protect, adminOnly, deleteQuestion);
router.get("/questions", protect, adminOnly, listQuestions);

module.exports = router;
