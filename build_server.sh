#!/bin/bash
# Build script for Enchantment Engine C++ Server

set -e

echo "=========================================="
echo "  Enchantment Engine Server Build Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check for CMake
if ! command -v cmake &> /dev/null; then
    echo -e "${RED}ERROR: CMake not found${NC}"
    echo "Please install CMake 3.15 or higher"
    exit 1
fi

# Check for C++ compiler
if ! command -v g++ &> /dev/null && ! command -v clang++ &> /dev/null; then
    echo -e "${RED}ERROR: No C++ compiler found${NC}"
    echo "Please install GCC or Clang"
    exit 1
fi

# Create build directory
BUILD_DIR="src/server/build"
echo -e "${YELLOW}Creating build directory...${NC}"
mkdir -p "$BUILD_DIR"

# Configure
echo -e "${YELLOW}Configuring with CMake...${NC}"
cd "$BUILD_DIR"
cmake .. -DCMAKE_BUILD_TYPE=Release

# Build
echo -e "${YELLOW}Building server...${NC}"
cmake --build . --config Release -j$(nproc 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || echo 4)

# Check if build succeeded
if [ -f "enchantment_server" ] || [ -f "enchantment_server.exe" ]; then
    echo ""
    echo -e "${GREEN}=========================================="
    echo "  Build Successful!"
    echo "==========================================${NC}"
    echo ""
    echo "To run the server:"
    echo "  cd $(pwd)"
    echo "  ./enchantment_server --port 8080"
    echo ""
    echo "Or from project root:"
    echo "  ./src/server/build/enchantment_server"
    echo ""
else
    echo -e "${RED}Build failed!${NC}"
    exit 1
fi
