@echo off
setlocal
echo ===================================================
echo    MOCKMATE PRO - HARD SYSTEM REFRESH
echo ===================================================

echo [1/4] Force-killing any stuck local servers...
taskkill /F /IM python.exe /T >nul 2>&1
taskkill /F /IM node.exe /T >nul 2>&1

echo [2/4] Deleting old build and cache...
if exist "frontend\dist" rmdir /s /q "frontend\dist"
if exist "frontend\node_modules\.vite" rmdir /s /q "frontend\node_modules\.vite"

echo [3/4] Building Fresh Frontend...
cd frontend
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo FRONTEND BUILD FAILED! Check for syntax errors.
    pause
    exit /b %ERRORLEVEL%
)
cd ..

echo [4/4] Starting Server on Port 5000...
echo.
echo ===================================================
echo  IMPORTANT: Open http://localhost:5000 in browser
echo  THEN PRESS CTRL + F5 TO CLEAR CACHE!
echo ===================================================
echo.
python -m uvicorn python_backend.main:app --port 5000 --host 0.0.0.0 --reload
pause
