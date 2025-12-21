@echo off
echo ===================================================
echo     HARD RESETTING MOCKMATE (Unified Server)
echo ===================================================

echo [1/4] Killing stuck processes...
taskkill /F /IM python.exe /T 2>nul
taskkill /F /IM node.exe /T 2>nul

echo [2/4] Cleaning old build files...
if exist "frontend\dist" rmdir /s /q "frontend\dist"

echo [3/4] Building Fresh Frontend (Please wait)...
cd frontend
call npm run build
cd ..

echo [4/4] Launching Server on Port 5005 (Safe Port)...
echo.
echo Open your browser to: http://localhost:5005
echo.
python -m uvicorn python_backend.main:app --port 5005 --host 0.0.0.0
pause
