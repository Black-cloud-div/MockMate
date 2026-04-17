const { VoiceLog } = require("../models");
const OpenAI = require("openai");

// Initialize OpenAI
// NOTE to USER: You must put 'OPENAI_API_KEY=your-key' in your backend/.env file for this to work.
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "sk-placeholder-key-replace-me"
});

const startSession = async (req, res) => {
    res.json({ sessionId: Date.now(), message: "Session started" });
};

const processAudio = async (req, res) => {
    try {
        const { role, question, answerText } = req.body;
        // NOTE: In a full production app, you would upload a blob and use openai.audio.transcriptions.create
        // Here, we assume the frontend sent the `transcript` (answerText) via the Web Speech API for speed/cost.

        if (!process.env.OPENAI_API_KEY) {
            // Mock AI Analysis (Demo Mode)
            const mockFeedback = [
                "Great articulation! You covered the key points clearly. Try to provide more specific examples next time to boost your confidence score.",
                "Your answer was structured well. You showed good technical understanding, but could improve on pacing.",
                "Excellent response. You handled the technical depth perfectly. Maintain this level of clarity."
            ];
            const randomFeedback = mockFeedback[Math.floor(Math.random() * mockFeedback.length)];

            return res.json({
                success: true,
                transcript: answerText || "Simulated audio transcript...",
                feedback: randomFeedback,
                scores: {
                    clarity: Math.floor(Math.random() * (9 - 7) + 7),
                    confidence: Math.floor(Math.random() * (9 - 6) + 6),
                    overall: Math.floor(Math.random() * (9 - 7) + 7)
                }
            });
        }

        const prompt = `
        Role: ${role} Interviewer.
        Question asked: "${question}"
        Candidate Answer: "${answerText}"
        
        Evaluate the answer. Provide:
        1. A feedback paragraph (max 3 sentences).
        2. Scores (0-10) for clarity, confidence, and overall.
        
        Return JSON format: { "feedback": "string", "scores": { "clarity": number, "confidence": number, "overall": number } }
        `;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are an expert technical interviewer." }, { role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
            response_format: { type: "json_object" }
        });

        const aiResponse = JSON.parse(completion.choices[0].message.content);

        // Save to DB
        await VoiceLog.create({
            userId: req.user.id,
            role: role,
            question: question,
            audioUrl: "simulated_upload", // we didn't upload file to S3
            transcript: answerText,
            aiFeedback: aiResponse.feedback,
            clarityScore: aiResponse.scores.clarity,
            confidenceScore: aiResponse.scores.confidence,
            overallScore: aiResponse.scores.overall
        });

        res.json({
            success: true,
            transcript: answerText,
            feedback: aiResponse.feedback,
            scores: aiResponse.scores
        });

    } catch (error) {
        console.error("Voice process error:", error);
        res.status(500).json({ message: "Error processing voice with AI" });
    }
};

const getHistory = async (req, res) => {
    try {
        const history = await VoiceLog.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: "Error fetching history" });
    }
};

module.exports = { startSession, processAudio, getHistory };
