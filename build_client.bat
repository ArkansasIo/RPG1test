@echo off
REM Build script for Enchantment Engine Client Application (Windows)

echo ==========================================
echo   Enchantment Engine Client Build Script
echo ==========================================
echo.

REM Check for CMake
where cmake >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: CMake not found
    echo Please install CMake 3.15 or higher
    exit /b 1
)

REM Check for Visual Studio or MinGW
where cl >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    set GENERATOR="Visual Studio 16 2019"
    set COMPILER=MSVC
) else (
    where g++ >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        set GENERATOR="MinGW Makefiles"
        set COMPILER=MinGW
    ) else (
        echo ERROR: No C++ compiler found
        echo Please install Visual Studio or MinGW
        exit /b 1
    )
)

echo Using compiler: %COMPILER%
echo.

REM Create build directory
set BUILD_DIR=src\client-app\build
echo Creating build directory...
if not exist "%BUILD_DIR%" mkdir "%BUILD_DIR%"

REM Configure
echo Configuring with CMake...
cd "%BUILD_DIR%"
cmake .. -G %GENERATOR% -DCMAKE_BUILD_TYPE=Release
if %ERRORLEVEL% NEQ 0 (
    echo Configuration failed!
    exit /b 1
)

REM Build
echo Building client application...
cmake --build . --config Release
if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    exit /b 1
)

REM Check if build succeeded
if exist "Release\enchantment_client.exe" (
    echo.
    echo ==========================================
    echo   Build Successful!
    echo ==========================================
    echo.
    echo Executable: %CD%\Release\enchantment_client.exe
    echo Also copied to: EnchantmentEngine.exe
    echo.
    echo To run the application:
    echo   EnchantmentEngine.exe
    echo.
) else if exist "enchantment_client.exe" (
    echo.
    echo ==========================================
    echo   Build Successful!
    echo ==========================================
    echo.
    echo Executable: %CD%\enchantment_client.exe
    echo Also copied to: EnchantmentEngine.exe
    echo.
    echo To run the application:
    echo   EnchantmentEngine.exe
    echo.
) else (
    echo Build failed!
    exit /b 1
)
