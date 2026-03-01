#!/bin/bash

echo "============================================"
echo "  Enchantment Engine - Unified Build"
echo "  Building single executable with integrated server"
echo "============================================"
echo ""

cd LabyrinthOfTheDragon/src/unified

# Clean previous build
if [ -d "build" ]; then
    echo "Cleaning previous build..."
    rm -rf build
fi

# Create build directory
mkdir build
cd build

echo ""
echo "Configuring CMake..."
cmake -DCMAKE_BUILD_TYPE=Release ..

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: CMake configuration failed!"
    exit 1
fi

echo ""
echo "Building..."
cmake --build . --config Release

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Build failed!"
    exit 1
fi

echo ""
echo "============================================"
echo "  Build Successful!"
echo "============================================"
echo ""
echo "Executable: src/unified/build/enchantment_engine"
echo ""

# Copy to bin directory
echo "Copying to bin directory..."
mkdir -p bin
cp enchantment_engine ../../../bin/EnchantmentEngine

echo ""
echo "Done! Run bin/EnchantmentEngine to start the application."
echo ""
