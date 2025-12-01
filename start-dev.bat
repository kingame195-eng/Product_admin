@echo off
REM Script để khởi động cả backend và frontend cùng lúc trên Windows
REM Usage: double-click file này hoặc chạy: start-dev.bat

echo.
echo ===================================
echo Starting Product Admin System Dev
echo ===================================
echo.

REM Kiểm tra node có cài không
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js not installed!
    exit /b 1
)

echo Starting backend and frontend...
echo.

REM Chạy câu lệnh npm start:all
npm run start:all

pause
