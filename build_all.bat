@echo off
REM Build script for complete Enchantment Engine (Server + Client)

echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║         ENCHANTMENT ENGINE - COMPLETE BUILD SCRIPT           ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

REM Build server
echo [1/2] Building Backend Server...
echo ═══════════════════════════════════════════════════════════════
call build_server.bat
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Server build failed!
    exit /b 1
)

echo.
echo.

REM Build client
echo [2/2] Building Client Application...
echo ═══════════════════════════════════════════════════════════════
call build_client.bat
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Client build failed!
    exit /b 1
)

echo.
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║                  ✅ BUILD COMPLETE! ✅                        ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo Built Components:
echo   ✓ Backend Server:      src\server\build\enchantment_server.exe
echo   ✓ Client Application:  EnchantmentEngine.exe
echo.
echo To run the complete application:
echo   EnchantmentEngine.exe
echo.
echo The client will automatically start the server and open the IDE.
echo.
pause
