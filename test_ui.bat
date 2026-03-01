@echo off
echo ========================================
echo Enchantment Engine - UI Test Suite
echo ========================================
echo.
echo This will test all three executables.
echo Watch for console output and UI windows.
echo.
echo Press any key to start testing...
pause > nul

echo.
echo ========================================
echo TEST 1: test_window.exe (Minimal Test)
echo ========================================
echo.
echo This should show:
echo - Console with debug messages
echo - Window with button and label
echo - Text drawn directly on window
echo.
echo Press any key to run test_window.exe...
pause > nul

cd bin
start test_window.exe
timeout /t 3 > nul

echo.
echo Did you see a window with a button? (Y/N)
set /p test1=
echo.

echo ========================================
echo TEST 2: EnchantmentEngine.exe (Project Manager)
echo ========================================
echo.
echo This should show:
echo - Console with detailed debug output
echo - Project Manager window
echo - Menu bar (File, Edit, View, Tools, Help)
echo - Four buttons (Open Project, New Project, Open Folder, Open Files)
echo - Recent projects list
echo - Preview panel
echo - Status bar
echo.
echo Press any key to run EnchantmentEngine.exe...
pause > nul

start EnchantmentEngine.exe
timeout /t 3 > nul

echo.
echo Did you see the Project Manager window with buttons? (Y/N)
set /p test2=
echo.

echo ========================================
echo TEST 3: enchantment_editor.exe (IDE)
echo ========================================
echo.
echo This should show:
echo - Console with detailed debug output
echo - Editor window
echo - Menu bar with 9 menus
echo - Toolbar with icons
echo - Test button and label
echo - Status bar
echo.
echo Press any key to run enchantment_editor.exe...
pause > nul

start enchantment_editor.exe
timeout /t 3 > nul

echo.
echo Did you see the Editor window with menus and controls? (Y/N)
set /p test3=
echo.

cd ..

echo ========================================
echo TEST RESULTS SUMMARY
echo ========================================
echo.
echo Test 1 (test_window.exe):     %test1%
echo Test 2 (EnchantmentEngine.exe): %test2%
echo Test 3 (enchantment_editor.exe): %test3%
echo.
echo ========================================
echo TROUBLESHOOTING
echo ========================================
echo.
echo If all tests show "N":
echo - Check if Windows is blocking the executables
echo - Try running as Administrator
echo - Check display scaling settings
echo - Verify graphics drivers are up to date
echo.
echo If test_window.exe works but others don't:
echo - The Windows API is working
echo - Issue is in the main applications
echo - Check console output for errors
echo.
echo If you see console but no windows:
echo - Window creation is failing
echo - Check console for error codes
echo - Try running in compatibility mode
echo.
echo If you see windows but no controls:
echo - Controls are not being created
echo - Check console for "FAILED" messages
echo - Report the error codes shown
echo.
echo ========================================
echo.
echo Press any key to exit...
pause > nul
