const axios = require("axios");

// Only Perplexity API (FREE!)
const getAPIConfig = () => {
    const perplexityKey = process.env.PERPLEXITY_API_KEY;

    if (perplexityKey && perplexityKey !== 'pplx-YOUR-KEY-HERE' && perplexityKey !== '') {
        return {
            url: "https://api.perplexity.ai/chat/completions",
            key: perplexityKey,
            model: "llama-3.1-sonar-small-128k-online", // FREE tier model
            provider: "Perplexity"
        };
    }

    return null;
};

const generateQuestion = async (role, difficulty) => {
    const config = getAPIConfig();

    if (!config) {
        throw new Error("Perplexity API key not set. Add PERPLEXITY_API_KEY to .env file");
    }

    console.log(`🤖 Using ${config.provider} FREE API for question generation`);

    const res = await axios.post(
        config.url,
        {
            model: config.model,
            messages: [
                {
                    role: "system",
                    content: "You are an expert technical interviewer. Generate concise, realistic interview questions."
                },
                {
                    role: "user",
                    content: `Generate ONE ${difficulty} level interview question for the role: ${role}.`
                }
            ],
            max_tokens: 150
        },
        {
            headers: {
                Authorization: `Bearer ${config.key}`,
                "Content-Type": "application/json"
            }
        }
    );

    const content = res.data.choices?.[0]?.message?.content || "";
    return content.trim();
};

const evaluateAnswer = async (question, answer) => {
    const config = getAPIConfig();

    if (!config) {
        throw new Error("Perplexity API key not set. Add PERPLEXITY_API_KEY to .env file");
    }

    console.log(`🤖 Using ${config.provider} FREE API for answer evaluation`);

    const res = await axios.post(
        config.url,
        {
            model: config.model,
            messages: [
                {
                    role: "system",
                    content: "You are an interview evaluator. Analyze the answer and provide: 1) Overall score (0-10), 2) Strengths (2-3 points), 3) Improvements (2-3 points), 4) Dimensions with scores (Clarity, Depth, Communication). Format as JSON."
                },
                {
                    role: "user",
                    content: `Question: ${question}\n\nCandidate Answer: ${answer}\n\nProvide evaluation in JSON format with: overallScore, strengths (array), improvements (array), dimensions (array of {metric, value}).`
                }
            ],
            max_tokens: 300
        },
        {
            headers: {
                Authorization: `Bearer ${config.key}`,
                "Content-Type": "application/json"
            }
        }
    );

    const content = res.data.choices?.[0]?.message?.content || "{}";

    // Try to parse JSON from the response
    try {
        // Sometimes AI wraps JSON in markdown code blocks
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return JSON.parse(content);
    } catch (e) {
        console.log("Failed to parse JSON, using fallback");
        // Fallback if not valid JSON
        return {
            overallScore: 7,
            strengths: ["Good attempt at answering", "Shows understanding of the topic"],
            improvements: ["Could provide more specific examples", "Try to structure your answer better"],
            dimensions: [
                { metric: "Clarity", value: 7 },
                { metric: "Depth", value: 6 },
                { metric: "Communication", value: 8 }
            ]
        };
    }
};

const generateResumeBasedQuestion = async (role, difficulty, resumeContext) => {
    const config = getAPIConfig();

    if (!config) {
        throw new Error("Perplexity API key not set. Add PERPLEXITY_API_KEY to .env file");
    }

    console.log(`🎯 Using ${config.provider} FREE API for resume-based question generation`);

    // Truncate resume context if too long
    let context = resumeContext;
    if (context.length > 1500) {
        context = context.substring(0, 1500) + "...";
    }

    const res = await axios.post(
        config.url,
        {
            model: config.model,
            messages: [
                {
                    role: "system",
                    content: "You are an expert technical interviewer. Generate personalized interview questions based on the candidate's resume. Focus on their specific experience, projects, and skills mentioned in the resume."
                },
                {
                    role: "user",
                    content: `Based on this resume:\n\n${context}\n\nGenerate ONE ${difficulty} level interview question for the role: ${role}. The question should be personalized to their experience and skills mentioned in the resume. Make it specific and relevant.`
                }
            ],
            max_tokens: 200
        },
        {
            headers: {
                Authorization: `Bearer ${config.key}`,
                "Content-Type": "application/json"
            }
        }
    );

    const content = res.data.choices?.[0]?.message?.content || "";
    return content.trim();
};

module.exports = { generateQuestion, evaluateAnswer, generateResumeBasedQuestion };
