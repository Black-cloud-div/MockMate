# 🚀 FREE AI Setup - Perplexity Only

## Why Only Perplexity?

✅ **100% FREE** - No credit card, no billing, forever free  
✅ **Easy Setup** - Just 2 minutes  
✅ **Good Quality** - Llama 3.1 models are powerful  
✅ **No Hidden Costs** - Truly free tier  
✅ **Perfect for Students** - No payment needed  

## Quick Setup (2 Minutes)

### Step 1: Get Your FREE API Key

1. **Visit**: https://www.perplexity.ai/settings/api
2. **Sign in** or create a FREE account (no credit card!)
3. **Click** "Generate API Key"
4. **Copy** the key (starts with `pplx-`)

### Step 2: Add to .env File

Open `backend/.env` and find:
```env
PERPLEXITY_API_KEY=pplx-YOUR-KEY-HERE
```

Replace with your key:
```env
PERPLEXITY_API_KEY=pplx-abc123def456ghi789
```

### Step 3: Restart Backend

```bash
# Stop current server (Ctrl+C)
# Then restart:
cd backend
npm run dev
```

**Done! ✅ Real AI is now active - 100% FREE!**

## Check Your Setup

### Option 1: Command
```bash
cd backend
node checkAPIKey.js
```

### Option 2: Double-Click
Double-click `check-api.bat` file in project root

You should see:
```
✅ Perplexity API Key: SET
   Cost: FREE ✅
   Status: ACTIVE
```

## What You Get (FREE!)

- ✅ Real AI-generated interview questions
- ✅ Intelligent answer evaluation
- ✅ Personalized feedback
- ✅ Dynamic difficulty adjustment
- ✅ Professional interview experience
- ✅ Unlimited usage (within fair limits)

## Free Tier Details

### Limits:
- **Cost**: $0 - Completely FREE
- **Requests**: Generous free tier
- **Model**: llama-3.1-sonar-small-128k-online
- **Quality**: Very Good (comparable to paid APIs)
- **Speed**: Fast response times

### No Credit Card Required!
- ✅ Sign up with just email
- ✅ No billing information needed
- ✅ No surprise charges
- ✅ No expiration of free tier

## Example .env File

```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=development_secret_key_123
PERPLEXITY_API_KEY=pplx-your-actual-key-here
CLIENT_URL=http://localhost:5173
```

## Troubleshooting

### Error: "API key not set"
- Make sure you saved the `.env` file
- Check there are no extra spaces
- Restart the backend server
- Run `node checkAPIKey.js` to verify

### Error: "Invalid API Key"
- Check if you copied the complete key
- Make sure it starts with `pplx-`
- Try generating a new key

### Still in Simulation Mode?
- Verify the key is in `backend/.env`
- Make sure you restarted the backend
- Check for typos in the key

## Security

🔒 **Never share your API key**  
🔒 **Never commit to GitHub**  
🔒 **`.env` is already in `.gitignore`**  
🔒 **Regenerate if exposed**  

## Getting Help

### Check Status
```bash
cd backend
node checkAPIKey.js
```

### View Logs
When backend starts, you should see:
```
🤖 Using Perplexity FREE API for question generation
```

### Test Interview
1. Go to Mock Interview
2. Select role and difficulty
3. Click "Start Interview Session"
4. You'll get a unique AI-generated question!

## Links

- **Get API Key**: https://www.perplexity.ai/settings/api
- **Documentation**: https://docs.perplexity.ai/
- **Support**: Free community support

---

## 🎯 Quick Start

```bash
# 1. Get FREE key from:
https://www.perplexity.ai/settings/api

# 2. Add to backend/.env:
PERPLEXITY_API_KEY=pplx-your-key-here

# 3. Restart backend:
cd backend
npm run dev

# 4. Check status:
node checkAPIKey.js

# 5. Start using real AI - FREE! 🎉
```

---

**No paid APIs, no costs, just FREE AI! Perfect for students and developers! 🚀**
