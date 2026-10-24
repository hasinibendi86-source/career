@echo off
TITLE CareerAI - Full-Stack Launcher
echo ==============================================================
echo           CareerAI - Smart Placement & Resume Analyzer
echo ==============================================================
echo.
echo Starting Flask Backend API on http://127.0.0.1:5000 ...
start "CareerAI Backend" cmd /k "cd /d %~dp0\backend && python app.py"

timeout /t 2 /nobreak >nul

echo Starting Vite React Frontend on http://localhost:5173 ...
start "CareerAI Frontend" cmd /k "cd /d %~dp0\frontend && npm run dev"

echo.
echo ==============================================================
echo  CareerAI is launching!
echo  Backend:  http://127.0.0.1:5000
echo  Frontend: http://localhost:5173
echo ==============================================================
echo.
pause
