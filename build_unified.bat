@echo off
echo ============================================
echo   Enchantment Engine - Unified Build
echo   Building single executable with integrated server
echo ============================================
echo.

cd LabyrinthOfTheDragon\src\unified

REM Clean previous build
if exist build (
    echo Cleaning previous build...
    rmdir /s /q build
)

REM Create build directory
mkdir build
cd build

echo.
echo Configuring CMake...
cmake -G "MinGW Makefiles" -DCMAKE_BUILD_TYPE=Release ..

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: CMake configuration failed!
    pause
    exit /b 1
)

echo.
echo Building...
cmake --build . --config Release

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo ============================================
echo   Build Successful!
echo ============================================
echo.
echo Executable: src\unified\build\enchantment_engine.exe
echo.

REM Copy to bin directory
echo Copying to bin directory...
if not exist bin mkdir bin
copy enchantment_engine.exe ..\..\..\bin\EnchantmentEngine.exe

echo.
echo Done! Run bin\EnchantmentEngine.exe to start the application.
echo.
pause
