const { Interview, Question } = require("../models");
const { generateQuestion, evaluateAnswer, generateResumeBasedQuestion } = require("../utils/ai");
const pdf = require('pdf-parse');
const multer = require('multer');

// Configure multer for file upload
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const generateInterviewQuestion = async (req, res) => {
    try {
        const { role, difficulty, resumeContext } = req.body;
        const userId = req.user.id;

        let text;

        // If resume context is provided, generate personalized question
        if (resumeContext && resumeContext.length > 50) {
            console.log("🎯 Generating resume-based question for:", role);
            try {
                text = await generateResumeBasedQuestion(role, difficulty || "medium", resumeContext);
            } catch (error) {
                console.error("Resume-based generation failed, falling back:", error.message);
                // Fall back to regular question generation
                text = await generateQuestion(role, difficulty || "medium");
            }
        } else {
            // Regular question generation
            const saved = await Question.findOne({ where: { role, difficulty } });
            if (saved) {
                text = saved.text;
            } else {
                // Check if Perplexity API key exists
                if (!process.env.PERPLEXITY_API_KEY || process.env.PERPLEXITY_API_KEY === 'pplx-YOUR-KEY-HERE') {
                    const mockQuestions = {
                        "Frontend Developer": "Explain the concept of React Hooks and their benefits.",
                        "Backend Developer": "How would you design a scalable REST API?",
                        "Data Scientist": "What is the difference between supervised and unsupervised learning?",
                        "DevOps Engineer": "Explain the CI/CD pipeline and its importance."
                    };
                    text = mockQuestions[role] || "Tell me about your experience in " + role + ".";
                } else {
                    text = await generateQuestion(role, difficulty || "medium");
                }
            }
        }

        // Create interview record
        const interview = await Interview.create({
            userId: userId,
            role,
            difficulty,
            question: text
        });

        res.status(201).json({ interviewId: interview.id, question: text });
    } catch (err) {
        console.error("Generate question error:", err.message);
        res.status(200).json({ interviewId: Date.now(), question: "Tell me about yourself. (Fallback Mode)" });
    }
};

// Extract text from uploaded resume PDF
const extractResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const dataBuffer = req.file.buffer;
        const data = await pdf(dataBuffer);

        // Extract and clean text
        let text = data.text;
        text = text.replace(/\s+/g, ' ').trim();

        // Limit to first 2000 characters to avoid token limits
        if (text.length > 2000) {
            text = text.substring(0, 2000) + "...";
        }

        console.log("📄 Resume extracted, length:", text.length);
        res.json({ text, pages: data.numpages });
    } catch (error) {
        console.error("Resume extraction error:", error);
        res.status(500).json({ message: "Failed to extract resume text", error: error.message });
    }
};

const submitInterview = async (req, res) => {
    try {
        const { interviewId, answerText } = req.body;
        const userId = req.user.id;

        // Sequelize: findOne with where
        const interview = await Interview.findOne({
            where: { id: interviewId, userId }
        });

        if (!interview) {
            return res.status(404).json({ message: "Interview not found" });
        }

        let evalResult;

        // Check if OpenAI Key exists for real evaluation
        if (process.env.OPENAI_API_KEY) {
            evalResult = await evaluateAnswer(interview.question, answerText);
        } else {
            // Mock Evaluation Fallback
            evalResult = {
                overallScore: Math.floor(Math.random() * (9 - 6) + 6), // 6 to 9
                strengths: ["Clear structure", "Addressed the core concept", "Good use of terminology"],
                improvements: ["Could be more concise", "Provide more concrete examples"],
                dimensions: [
                    { metric: "Clarity", value: 8 },
                    { metric: "Depth", value: 7 },
                    { metric: "Communication", value: 8 },
                    { metric: "Technical Accuracy", value: 7 }
                ]
            };
        }

        // Update fields (Sequelize allows direct assignment + save)
        interview.answerText = answerText;
        interview.overallScore = evalResult.overallScore;
        interview.strengths = evalResult.strengths;
        interview.improvements = evalResult.improvements;
        interview.dimensions = evalResult.dimensions;
        await interview.save();

        res.status(201).json({ resultId: interview.id });
    } catch (err) {
        console.error("Submit interview error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

const getHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        // Sequelize: findAll({ where: ..., order: ... })
        const history = await Interview.findAll({
            where: { userId },
            attributes: ["role", "difficulty", "overallScore", "createdAt"],
            order: [["createdAt", "DESC"]]
        });

        res.json(history);
    } catch (err) {
        console.error("Get history error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

const getResult = async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;

        const interview = await Interview.findOne({ where: { id, userId } });
        if (!interview) {
            return res.status(404).json({ message: "Result not found" });
        }

        res.json({
            overallScore: interview.overallScore,
            strengths: interview.strengths,
            improvements: interview.improvements,
            dimensions: interview.dimensions
        });
    } catch (err) {
        console.error("Get result error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = {
    generateInterviewQuestion,
    submitInterview,
    getHistory,
    getResult,
    extractResume,
    upload
};
