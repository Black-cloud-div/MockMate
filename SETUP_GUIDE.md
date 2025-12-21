# 🎯 STEP-BY-STEP: Perplexity API Setup (Screenshots Guide)

## Total Time: 2 Minutes ⏱️

---

## Step 1: Open Perplexity Website

**Link**: https://www.perplexity.ai/settings/api

**What to do:**
1. Click the link above (opens in browser)
2. You'll see Perplexity homepage

---

## Step 2: Sign In / Sign Up

### If you have account:
- Click "Sign In"
- Enter email and password
- Click "Continue"

### If you DON'T have account (NEW USER):
- Click "Sign Up" or "Get Started"
- Enter your email
- Create a password
- Click "Create Account"
- ✅ **No credit card needed!**
- ✅ **Completely FREE!**

---

## Step 3: Go to API Settings

After login:
1. Click on your profile (top right)
2. Click "Settings"
3. Click "API" tab (left sidebar)

**OR** 

Directly visit: https://www.perplexity.ai/settings/api

---

## Step 4: Generate API Key

You'll see a page with:
- "API Keys" heading
- "Generate API Key" button

**What to do:**
1. Click "Generate API Key" button
2. Give it a name (e.g., "MockMATE")
3. Click "Create"

---

## Step 5: Copy Your API Key

**IMPORTANT:**
- You'll see your API key (starts with `pplx-`)
- **Copy it immediately!**
- You won't see it again!

Example: `pplx-abc123def456ghi789jkl012mno345pqr678`

**Click "Copy" button** or select and copy manually

---

## Step 6: Add to Your Project

### Option A: Manual (Easy)

1. Open your project folder
2. Go to `backend` folder
3. Open `.env` file (in Notepad or VS Code)
4. Find this line:
   ```
   PERPLEXITY_API_KEY=pplx-YOUR-KEY-HERE
   ```
5. Replace with your key:
   ```
   PERPLEXITY_API_KEY=pplx-abc123def456ghi789jkl012mno345pqr678
   ```
6. Save the file (Ctrl+S)

### Option B: VS Code (If you have it open)

1. In VS Code, open `backend/.env`
2. Find `PERPLEXITY_API_KEY=pplx-YOUR-KEY-HERE`
3. Replace `pplx-YOUR-KEY-HERE` with your actual key
4. Save (Ctrl+S)

---

## Step 7: Restart Backend

### In Terminal/PowerShell:

1. Go to backend terminal
2. Press `Ctrl+C` to stop
3. Type: `npm run dev`
4. Press Enter

**You should see:**
```
Server running on port 5000
SQLite Database connected & synced
```

---

## Step 8: Verify Setup

### Option 1: Run Check Script

```bash
cd backend
node checkAPIKey.js
```

**You should see:**
```
✅ Perplexity API Key: SET
   Cost: FREE ✅
   Status: ACTIVE

🎉 REAL AI MODE ENABLED!
```

### Option 2: Double-Click

Double-click `check-api.bat` in project root folder

---

## Step 9: Test It!

1. Open browser: http://localhost:5173
2. Login with test account:
   - Email: test@example.com
   - Password: password123
3. Go to "Mock Interview"
4. Select any role
5. Click "Start Interview Session"
6. **You'll get a REAL AI-generated question!** 🎉

---

## ✅ Success Checklist

- [ ] Created Perplexity account (FREE)
- [ ] Generated API key
- [ ] Copied the key
- [ ] Added to `backend/.env`
- [ ] Saved the file
- [ ] Restarted backend
- [ ] Ran `node checkAPIKey.js`
- [ ] Saw "ACTIVE" status
- [ ] Tested mock interview

---

## 🆘 Troubleshooting

### "API key not set" error
- Check if you saved `.env` file
- Make sure no extra spaces
- Restart backend again

### "Invalid API key" error
- Check if you copied complete key
- Should start with `pplx-`
- Try generating new key

### Still in simulation mode
- Verify key is in `backend/.env`
- Check for typos
- Restart backend server

---

## 📸 Visual Guide

### What Perplexity API page looks like:

```
┌─────────────────────────────────────┐
│  Perplexity AI - API Settings       │
├─────────────────────────────────────┤
│                                     │
│  API Keys                           │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Generate API Key            │   │
│  └─────────────────────────────┘   │
│                                     │
│  Your API Keys:                     │
│  ┌─────────────────────────────┐   │
│  │ pplx-abc123...  [Copy]      │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### What .env file should look like:

```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=development_secret_key_123
PERPLEXITY_API_KEY=pplx-abc123def456ghi789jkl012mno345pqr678
CLIENT_URL=http://localhost:5173
```

---

## 🎉 That's It!

**Total time:** 2 minutes  
**Cost:** $0 (FREE forever)  
**Difficulty:** Very Easy  

**Now enjoy REAL AI interviews! 🚀**

---

## Need Help?

If stuck at any step:
1. Check `FREE_AI_SETUP.md` for detailed guide
2. Run `node checkAPIKey.js` to see status
3. Make sure backend is running
4. Try generating a new API key

**You got this! 💪**
