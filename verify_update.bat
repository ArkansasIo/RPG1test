@echo off
echo ========================================
echo Enchantment Engine - Update Verification
echo ========================================
echo.
echo Verifying all files and executables...
echo.

echo === EXECUTABLES ===
echo.
if exist "bin\EnchantmentEngine.exe" (
    echo [OK] EnchantmentEngine.exe
    dir "bin\EnchantmentEngine.exe" | find "EnchantmentEngine.exe"
) else (
    echo [MISSING] EnchantmentEngine.exe
)
echo.

if exist "bin\enchantment_editor.exe" (
    echo [OK] enchantment_editor.exe
    dir "bin\enchantment_editor.exe" | find "enchantment_editor.exe"
) else (
    echo [MISSING] enchantment_editor.exe
)
echo.

if exist "bin\test_window.exe" (
    echo [OK] test_window.exe
    dir "bin\test_window.exe" | find "test_window.exe"
) else (
    echo [MISSING] test_window.exe
)
echo.

echo === WEB CLIENT FILES ===
echo.
if exist "src\client\js\api-client.js" (
    echo [OK] api-client.js
) else (
    echo [MISSING] api-client.js
)

if exist "src\client\js\api-menus.js" (
    echo [OK] api-menus.js
) else (
    echo [MISSING] api-menus.js
)

if exist "src\client\api-demo.html" (
    echo [OK] api-demo.html
) else (
    echo [MISSING] api-demo.html
)

if exist "src\client\test-api.html" (
    echo [OK] test-api.html
) else (
    echo [MISSING] test-api.html
)
echo.

echo === DOCUMENTATION FILES ===
echo.
if exist "API_ENDPOINTS.md" (
    echo [OK] API_ENDPOINTS.md
) else (
    echo [MISSING] API_ENDPOINTS.md
)

if exist "API_USAGE_GUIDE.md" (
    echo [OK] API_USAGE_GUIDE.md
) else (
    echo [MISSING] API_USAGE_GUIDE.md
)

if exist "WEB_CLIENT_API.md" (
    echo [OK] WEB_CLIENT_API.md
) else (
    echo [MISSING] WEB_CLIENT_API.md
)

if exist "WEB_CLIENT_QUICKSTART.md" (
    echo [OK] WEB_CLIENT_QUICKSTART.md
) else (
    echo [MISSING] WEB_CLIENT_QUICKSTART.md
)

if exist "BUILD_COMPLETE_API.md" (
    echo [OK] BUILD_COMPLETE_API.md
) else (
    echo [MISSING] BUILD_COMPLETE_API.md
)

if exist "UPDATE_SUMMARY.md" (
    echo [OK] UPDATE_SUMMARY.md
) else (
    echo [MISSING] UPDATE_SUMMARY.md
)
echo.

echo === TESTING SCRIPTS ===
echo.
if exist "test_ui.bat" (
    echo [OK] test_ui.bat
) else (
    echo [MISSING] test_ui.bat
)

if exist "capture_debug.bat" (
    echo [OK] capture_debug.bat
) else (
    echo [MISSING] capture_debug.bat
)

if exist "system_info.bat" (
    echo [OK] system_info.bat
) else (
    echo [MISSING] system_info.bat
)
echo.

echo ========================================
echo VERIFICATION COMPLETE
echo ========================================
echo.
echo Next steps:
echo 1. Run test_ui.bat to test executables
echo 2. Start EnchantmentEngine.exe
echo 3. Open http://localhost:8080/test-api.html
echo 4. Read UPDATE_SUMMARY.md for details
echo.
echo Press any key to exit...
pause > nul
