@echo off
echo ========================================
echo Enchantment Engine - Editor Build Script
echo ========================================
echo.

cd "src\editor"

if not exist "build" mkdir build
cd build

echo Configuring CMake...
cmake -G "MinGW Makefiles" -DCMAKE_BUILD_TYPE=Release ..

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: CMake configuration failed
    pause
    exit /b 1
)

echo.
echo Building Editor...
cmake --build . --config Release

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo Editor Build Complete!
echo ========================================
echo.
echo Output: bin\enchantment_editor.exe
echo.

cd ..\..\..
pause
