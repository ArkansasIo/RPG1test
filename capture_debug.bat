@echo off
echo ========================================
echo Enchantment Engine - Debug Capture
echo ========================================
echo.
echo This will run each executable and capture
echo their console output to text files.
echo.
echo Output files will be created in the bin folder:
echo - test_window_output.txt
echo - enchantment_engine_output.txt
echo - enchantment_editor_output.txt
echo.
echo Press any key to start...
pause > nul

cd bin

echo.
echo Running test_window.exe...
test_window.exe > test_window_output.txt 2>&1
echo Output saved to test_window_output.txt

echo.
echo Running EnchantmentEngine.exe for 5 seconds...
timeout /t 1 > nul
start /B EnchantmentEngine.exe > enchantment_engine_output.txt 2>&1
timeout /t 5 > nul
taskkill /F /IM EnchantmentEngine.exe > nul 2>&1
echo Output saved to enchantment_engine_output.txt

echo.
echo Running enchantment_editor.exe for 5 seconds...
timeout /t 1 > nul
start /B enchantment_editor.exe > enchantment_editor_output.txt 2>&1
timeout /t 5 > nul
taskkill /F /IM enchantment_editor.exe > nul 2>&1
echo Output saved to enchantment_editor_output.txt

cd ..

echo.
echo ========================================
echo Debug output captured!
echo ========================================
echo.
echo Please check the following files in the bin folder:
echo - test_window_output.txt
echo - enchantment_engine_output.txt
echo - enchantment_editor_output.txt
echo.
echo Look for:
echo - "Window created successfully" messages
echo - "Control created" messages with handles
echo - "FAILED" messages with error codes
echo - Window size information
echo.
echo Press any key to view the outputs...
pause > nul

echo.
echo === test_window.exe output ===
type bin\test_window_output.txt
echo.
echo.
echo === EnchantmentEngine.exe output ===
type bin\enchantment_engine_output.txt
echo.
echo.
echo === enchantment_editor.exe output ===
type bin\enchantment_editor_output.txt
echo.
echo.
echo Press any key to exit...
pause > nul
