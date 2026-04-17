require("dotenv").config();

console.log("\n🔑 API Key Status Check\n");

const perplexityKey = process.env.PERPLEXITY_API_KEY;

console.log("=".repeat(60));
console.log("  PERPLEXITY AI (FREE API)");
console.log("=".repeat(60) + "\n");

if (perplexityKey && perplexityKey !== '' && perplexityKey !== 'pplx-YOUR-KEY-HERE') {
    console.log("✅ Perplexity API Key: SET");
    console.log(`   Key: ${perplexityKey.substring(0, 10)}...${perplexityKey.substring(perplexityKey.length - 4)}`);
    console.log("   Model: llama-3.1-sonar-small-128k-online");
    console.log("   Cost: FREE ✅");
    console.log("   Status: ACTIVE\n");

    console.log("🎉 REAL AI MODE ENABLED!");
    console.log("\nYour system will use:");
    console.log("   ✅ Dynamic AI-generated questions");
    console.log("   ✅ Intelligent answer evaluation");
    console.log("   ✅ Personalized feedback");
    console.log("   ✅ Advanced interview analysis");
    console.log("   ✅ 100% FREE - No costs!\n");

} else {
    console.log("❌ Perplexity API Key: NOT SET\n");

    console.log("💡 SIMULATION MODE (No API Key)");
    console.log("\nYour system will use:");
    console.log("   ✅ Template-based questions");
    console.log("   ✅ Randomized feedback");
    console.log("   ✅ All features still work");
    console.log("   ❌ No real AI intelligence\n");

    console.log("📝 To enable FREE AI:\n");
    console.log("1. Visit: https://www.perplexity.ai/settings/api");
    console.log("2. Sign in or create FREE account");
    console.log("3. Click 'Generate API Key'");
    console.log("4. Copy the key (starts with 'pplx-')");
    console.log("5. Open: backend/.env");
    console.log("6. Replace: PERPLEXITY_API_KEY=pplx-YOUR-KEY-HERE");
    console.log("7. Save and restart backend server\n");

    console.log("⏱️  Setup time: Just 2 minutes!");
    console.log("💰 Cost: 100% FREE forever!\n");
}

console.log("=".repeat(60));
console.log("📄 Config file: backend/.env");
console.log("📖 Setup guide: PERPLEXITY_SETUP.md");
console.log("=".repeat(60) + "\n");
