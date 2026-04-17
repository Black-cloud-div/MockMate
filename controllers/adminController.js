const { User, Question } = require("../models");

const listUsers = async (_req, res) => {
    try {
        // Sequelize: findAll with attributes exclude
        const users = await User.findAll({
            attributes: { exclude: ["password"] }
        });
        res.json(users);
    } catch (err) {
        console.error("List users error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

const addQuestion = async (req, res) => {
    try {
        const { role, difficulty, text, tags } = req.body;
        const question = await Question.create({
            role,
            difficulty,
            text,
            tags: tags || []
        });
        res.status(201).json(question);
    } catch (err) {
        console.error("Add question error:", err.message);
        res.status(500).json({ message: err.message });
    }
};

const deleteQuestion = async (req, res) => {
    try {
        const id = req.params.id;
        // Sequelize: destroy({ where: { id } })
        await Question.destroy({ where: { id } });
        res.status(204).send();
    } catch (err) {
        console.error("Delete question error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

const listQuestions = async (_req, res) => {
    try {
        const questions = await Question.findAll({
            order: [["createdAt", "DESC"]]
        });
        res.json(questions);
    } catch (err) {
        console.error("List questions error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { listUsers, addQuestion, deleteQuestion, listQuestions };
