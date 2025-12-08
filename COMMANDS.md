# 🚀 Quick Commands Reference

## Common Commands

### Check API Key Status
```bash
# PowerShell/CMD
cd backend
node checkAPIKey.js

# OR double-click this file:
check-api.bat
```

### Start Backend
```bash
cd backend
npm run dev
```

### Start Frontend
```bash
cd frontend
npm run dev
```

### Test Database
```bash
cd backend
node testDatabase.js
```

### Test Entire System
```bash
cd backend
node testSystem.js
```

### Test API Endpoints
```bash
cd backend
node testAPI.js
```

### Make User Admin
```bash
cd backend
node makeAdmin.js
```

## Setup Commands

### Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Build Frontend for Production
```bash
cd frontend
npm run build
```

### Fresh Database
```bash
cd backend
# Delete old database
Remove-Item database.sqlite -Force
# Create new one
node testSystem.js
```

## Quick Fixes

### Backend Not Starting
```bash
cd backend
# Check if port is in use
netstat -ano | findstr :5000
# Kill process if needed
taskkill /PID <process_id> /F
# Restart
npm run dev
```

### Frontend Not Loading
```bash
cd frontend
# Clear cache and rebuild
Remove-Item -Recurse -Force node_modules
npm install
npm run dev
```

### Database Issues
```bash
cd backend
# Backup current database
Copy-Item database.sqlite database.backup.sqlite
# Delete and recreate
Remove-Item database.sqlite
node testSystem.js
```

## File Locations

### Configuration
- Backend config: `backend/.env`
- Frontend config: `frontend/vite.config.js`

### Database
- SQLite file: `backend/database.sqlite`

### Logs
- Backend: Terminal where `npm run dev` is running
- Frontend: Browser console (F12)

## API Key Setup

### Perplexity (FREE)
1. Get key: https://www.perplexity.ai/settings/api
2. Edit: `backend/.env`
3. Add: `PERPLEXITY_API_KEY=pplx-your-key`
4. Restart backend

### OpenAI (Paid)
1. Get key: https://platform.openai.com/api-keys
2. Edit: `backend/.env`
3. Add: `OPENAI_API_KEY=sk-your-key`
4. Restart backend

## URLs

### Development
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Health: http://localhost:5000/health

### Production (Single Server)
- Everything: http://localhost:5000

## Test Account

After running `testSystem.js`:
```
Email: test@example.com
Password: password123
Role: admin
```

## Troubleshooting

### "Command not found"
Always use `node` before `.js` files:
```bash
# ❌ Wrong
checkAPIKey.js

# ✅ Correct
node checkAPIKey.js
```

### "Port already in use"
```bash
# Find process
netstat -ano | findstr :5000
# Kill it
taskkill /PID <number> /F
```

### "Module not found"
```bash
npm install
```

### "Database locked"
```bash
# Close all connections and restart
```

## Quick Start (New Setup)

```bash
# 1. Install
cd backend && npm install
cd ../frontend && npm install

# 2. Setup database
cd ../backend
node testSystem.js

# 3. Check API (optional)
node checkAPIKey.js

# 4. Start backend (Terminal 1)
npm run dev

# 5. Start frontend (Terminal 2)
cd ../frontend
npm run dev

# 6. Open browser
# http://localhost:5173
```

## Production Build

```bash
# 1. Build frontend
cd frontend
npm run build

# 2. Start backend (serves frontend)
cd ../backend
npm run dev

# 3. Access at http://localhost:5000
```

## Helper Scripts

- `check-api.bat` - Check API key status (double-click)
- `testDatabase.js` - Test database connection
- `testSystem.js` - Full system test
- `testAPI.js` - Test API endpoints
- `checkAPIKey.js` - Check API keys
- `makeAdmin.js` - Make user admin

---

**Save this file for quick reference!** 📌
