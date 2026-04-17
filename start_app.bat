@echo off
echo Starting MockMate Backend...
start "MockMate Backend" cmd /k "python -m uvicorn python_backend.main:app --reload --port 5000"

echo Starting MockMate Frontend...
cd frontend
start "MockMate Frontend" cmd /k "npm run dev"

echo Waiting for services to start...
timeout /t 5 >nul
start http://localhost:5173
exit
