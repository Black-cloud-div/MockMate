require("dotenv").config();
const { sequelize, User, Interview, Question, VoiceLog, MockTestResult } = require("./models");

async function testDatabase() {
    try {
        console.log("🔄 Testing database connection...");

        // Test connection
        await sequelize.authenticate();
        console.log("✅ Database connection successful!");

        // Sync all models
        console.log("\n🔄 Syncing models...");
        await sequelize.sync({ alter: true });
        console.log("✅ All models synced successfully!");

        // Test creating a user
        console.log("\n🔄 Testing User model...");
        const testUser = await User.findOne({ where: { email: "test@example.com" } });
        if (!testUser) {
            await User.create({
                name: "Test User",
                email: "test@example.com",
                password: "hashedpassword",
                provider: "local"
            });
            console.log("✅ Test user created!");
        } else {
            console.log("✅ Test user already exists!");
        }

        // Count records
        console.log("\n📊 Database Statistics:");
        const userCount = await User.count();
        const interviewCount = await Interview.count();
        const questionCount = await Question.count();
        const voiceLogCount = await VoiceLog.count();
        const mockTestCount = await MockTestResult.count();

        console.log(`   Users: ${userCount}`);
        console.log(`   Interviews: ${interviewCount}`);
        console.log(`   Questions: ${questionCount}`);
        console.log(`   Voice Logs: ${voiceLogCount}`);
        console.log(`   Mock Tests: ${mockTestCount}`);

        console.log("\n✅ All database tests passed!");
        process.exit(0);

    } catch (error) {
        console.error("❌ Database test failed:", error);
        process.exit(1);
    }
}

testDatabase();
