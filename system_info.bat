@echo off
echo ========================================
echo Enchantment Engine - System Information
echo ========================================
echo.
echo Collecting system information...
echo.

echo === Windows Version ===
ver
echo.

echo === System Architecture ===
echo %PROCESSOR_ARCHITECTURE%
echo.

echo === Display Information ===
wmic path Win32_VideoController get Name,CurrentHorizontalResolution,CurrentVerticalResolution
echo.

echo === Available Memory ===
wmic OS get FreePhysicalMemory,TotalVisibleMemorySize /format:list
echo.

echo === Executable Information ===
echo.
if exist "bin\test_window.exe" (
    echo test_window.exe: EXISTS
    dir "bin\test_window.exe" | find "test_window.exe"
) else (
    echo test_window.exe: NOT FOUND
)
echo.

if exist "bin\EnchantmentEngine.exe" (
    echo EnchantmentEngine.exe: EXISTS
    dir "bin\EnchantmentEngine.exe" | find "EnchantmentEngine.exe"
) else (
    echo EnchantmentEngine.exe: NOT FOUND
)
echo.

if exist "bin\enchantment_editor.exe" (
    echo enchantment_editor.exe: EXISTS
    dir "bin\enchantment_editor.exe" | find "enchantment_editor.exe"
) else (
    echo enchantment_editor.exe: NOT FOUND
)
echo.

echo === Compiler Information ===
where clang 2>nul
if %errorlevel% equ 0 (
    clang --version | find "clang"
) else (
    echo Clang not found in PATH
)
echo.

where g++ 2>nul
if %errorlevel% equ 0 (
    g++ --version | find "g++"
) else (
    echo G++ not found in PATH
)
echo.

echo === CMake Information ===
where cmake 2>nul
if %errorlevel% equ 0 (
    cmake --version | find "cmake"
) else (
    echo CMake not found in PATH
)
echo.

echo ========================================
echo System information collected!
echo ========================================
echo.
echo This information is useful for troubleshooting.
echo.
echo Press any key to exit...
pause > nul
