@echo off
python -m uvicorn python_backend.main:app --reload --port 5000
pause
