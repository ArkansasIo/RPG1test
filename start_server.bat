@echo off
REM Quick start script for Enchantment Engine Server

echo ==========================================
echo   Enchantment Game Engine Server
echo ==========================================
echo.

REM Check if executable exists
if not exist "src\server\build\enchantment_server.exe" (
    echo ERROR: Server executable not found!
    echo Please run build_server.bat first to compile the server.
    echo.
    pause
    exit /b 1
)

REM Start server
echo Starting server on port 8080...
echo Web interface: http://localhost:8080
echo.
echo Press Ctrl+C to stop the server.
echo.

src\server\build\enchantment_server.exe --port 8080 --project .

pause
