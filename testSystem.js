require("dotenv").config();
const { sequelize, User, Interview, Question, VoiceLog, MockTestResult } = require("./models");
const bcrypt = require("bcryptjs");

async function comprehensiveTest() {
    try {
        console.log("🚀 Starting Comprehensive System Test\n");

        // 1. Database Connection
        console.log("1️⃣  Testing Database Connection...");
        await sequelize.authenticate();
        console.log("   ✅ Database connected\n");

        // 2. Sync Models
        console.log("2️⃣  Syncing All Models...");
        await sequelize.sync({ force: true }); // Fresh start
        console.log("   ✅ All models synced\n");

        // 3. Create Test User
        console.log("3️⃣  Creating Test User...");
        const hashedPassword = await bcrypt.hash("password123", 10);
        const testUser = await User.create({
            name: "Test User",
            email: "test@example.com",
            password: hashedPassword,
            provider: "local",
            role: "admin",
            careerGoal: "Senior Software Engineer",
            experienceLevel: "3-5 Years (Mid-Level)",
            emailNotifs: true,
            publicProfile: false
        });
        console.log(`   ✅ User created: ${testUser.name} (ID: ${testUser.id})\n`);

        // 4. Create Test Question
        console.log("4️⃣  Creating Test Question...");
        const testQuestion = await Question.create({
            role: "Frontend Developer",
            difficulty: "medium",
            text: "Explain the concept of React Hooks and their benefits.",
            tags: ["React", "JavaScript", "Frontend"]
        });
        console.log(`   ✅ Question created (ID: ${testQuestion.id})\n`);

        // 5. Create Test Interview
        console.log("5️⃣  Creating Test Interview...");
        const testInterview = await Interview.create({
            userId: testUser.id,
            role: "Frontend Developer",
            difficulty: "medium",
            question: "What is the Virtual DOM?",
            answerText: "The Virtual DOM is a lightweight copy of the actual DOM...",
            overallScore: 8,
            strengths: ["Clear explanation", "Good examples"],
            improvements: ["Could add more technical depth"],
            dimensions: [
                { metric: "Clarity", value: 8 },
                { metric: "Depth", value: 7 },
                { metric: "Communication", value: 9 }
            ]
        });
        console.log(`   ✅ Interview created (ID: ${testInterview.id})\n`);

        // 6. Create Test Voice Log
        console.log("6️⃣  Creating Test Voice Log...");
        const testVoiceLog = await VoiceLog.create({
            userId: testUser.id,
            role: "Backend Developer",
            question: "Explain RESTful API design principles",
            transcript: "RESTful APIs follow a set of architectural constraints...",
            aiFeedback: "Good explanation with clear structure",
            clarityScore: 8,
            confidenceScore: 7,
            overallScore: 8
        });
        console.log(`   ✅ Voice Log created (ID: ${testVoiceLog.id})\n`);

        // 7. Create Test MCQ Result
        console.log("7️⃣  Creating Test MCQ Result...");
        const testMCQ = await MockTestResult.create({
            userId: testUser.id,
            role: "Full-Stack Developer",
            score: 8,
            details: {
                totalQuestions: 10,
                correct: 8,
                answers: { 1: 0, 2: 1, 3: 2 }
            }
        });
        console.log(`   ✅ MCQ Result created (ID: ${testMCQ.id})\n`);

        // 8. Test Relationships
        console.log("8️⃣  Testing Relationships...");
        const userWithInterviews = await User.findByPk(testUser.id, {
            include: [Interview, VoiceLog, MockTestResult]
        });
        console.log(`   ✅ User has ${userWithInterviews.Interviews.length} interviews`);
        console.log(`   ✅ User has ${userWithInterviews.VoiceLogs.length} voice logs`);
        console.log(`   ✅ User has ${userWithInterviews.MockTestResults.length} test results\n`);

        // 9. Final Statistics
        console.log("📊 Final Database Statistics:");
        console.log(`   Users: ${await User.count()}`);
        console.log(`   Questions: ${await Question.count()}`);
        console.log(`   Interviews: ${await Interview.count()}`);
        console.log(`   Voice Logs: ${await VoiceLog.count()}`);
        console.log(`   MCQ Results: ${await MockTestResult.count()}`);

        console.log("\n✅ ALL TESTS PASSED! System is fully operational! 🎉\n");

        console.log("📝 Test User Credentials:");
        console.log("   Email: test@example.com");
        console.log("   Password: password123");
        console.log("   Role: admin\n");

        process.exit(0);

    } catch (error) {
        console.error("\n❌ TEST FAILED:", error);
        console.error(error.stack);
        process.exit(1);
    }
}

comprehensiveTest();
