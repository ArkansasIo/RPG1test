# Enchantment Engine - Unified Build

## Overview

The Enchantment Engine is now built as a **single unified executable** that combines both the backend server and desktop client into one seamless application.

## What Changed

### Before (Separate Executables)
- `enchantment_server.exe` (366 KB) - Backend HTTP server
- `enchantment_client.exe` (171 KB) - Desktop client launcher
- Client would spawn server as separate process
- Two executables to manage

### After (Unified Executable)
- `EnchantmentEngine.exe` (409 KB) - Complete application
- Server runs in background thread within same process
- Single executable to distribute and run
- Simpler architecture and deployment

## Architecture

```
EnchantmentEngine.exe
├── Main Thread
│   ├── Splash Screen (startup animation)
│   ├── Browser Window (UI management)
│   └── API Client (internal communication)
└── Server Thread
    ├── HTTP Server (port 8080)
    ├── File Manager
    ├── Build System
    └── Asset Processor
```

## Features

### Integrated Server
- Runs in background thread (no separate process)
- Automatic startup and shutdown
- Health monitoring
- Graceful cleanup on exit

### Desktop Client
- Beautiful splash screen with dragon logo
- Progress indicators during startup
- Opens IDE in default browser
- Manages server lifecycle

### Development Tools
- Code editor for C source files
- Tile editor for graphics
- Map editor for game levels
- String and table editors
- Integrated build system
- Game Boy emulator

## Building from Source

### Prerequisites
- CMake 3.15 or higher
- Clang/LLVM MinGW (or compatible C++20 compiler)
- Windows SDK (for Windows builds)

### Build Steps

#### Windows
```batch
cd "Enchantment Engine"
build_unified.bat
```

#### Linux/macOS
```bash
cd "Enchantment Engine"
chmod +x build_unified.sh
./build_unified.sh
```

### Manual Build
```bash
cd "Enchantment Engine/src/unified"
mkdir build
cd build
cmake -G "MinGW Makefiles" -DCMAKE_BUILD_TYPE=Release ..
cmake --build . --config Release
```

## Running the Application

Simply double-click `EnchantmentEngine.exe` or run from command line:

```bash
./EnchantmentEngine.exe
```

### Command Line Options
```
--port <port>       Server port (default: 8080)
--project <path>    Project directory (default: .)
--help              Show help message
```

### Example
```bash
./EnchantmentEngine.exe --port 9000 --project "C:/MyGame"
```

## Configuration

Create `enchantment.conf` in the same directory as the executable:

```ini
port=8080
project=.
```

## Technical Details

### File Size Comparison
- Server only: 366 KB
- Client only: 171 KB
- Combined (unified): 409 KB
- **Savings**: 128 KB (24% smaller than separate executables)

### Memory Usage
- Single process instead of two
- Shared memory for common components
- More efficient resource management

### Startup Time
- Faster startup (no process spawning overhead)
- Integrated health checking
- Typical startup: 2-3 seconds

### Dependencies
- Windows: ws2_32, gdi32, user32, shell32, msimg32
- Linux: pthread
- No external DLLs required (static linking)

## Source Code Structure

```
src/unified/
├── main.cpp                    # Entry point
├── unified_application.hpp     # Application header
├── unified_application.cpp     # Application implementation
├── splash_screen.hpp           # Splash screen header
├── splash_screen.cpp           # Splash screen implementation
├── CMakeLists.txt             # Build configuration
└── build/                     # Build output
    └── enchantment_engine.exe

src/server/                    # Server components (linked in)
├── server.hpp/cpp
├── file_manager.hpp/cpp
├── build_system.hpp/cpp
└── asset_processor.hpp/cpp

src/client-app/               # Client components (linked in)
├── api_client.hpp/cpp
└── browser_window.hpp/cpp
```

## Advantages of Unified Build

1. **Simpler Distribution**: One file to distribute
2. **Easier Installation**: No need to manage multiple executables
3. **Better Integration**: Direct communication between components
4. **Smaller Size**: Shared code reduces total size
5. **Faster Startup**: No process spawning overhead
6. **Easier Debugging**: Single process to debug
7. **Cleaner Architecture**: Unified lifecycle management

## Troubleshooting

### Server Won't Start
- Check if port 8080 is already in use
- Try a different port with `--port` option
- Check firewall settings

### Browser Won't Open
- Ensure default browser is set
- Try manually navigating to http://localhost:8080
- Check if server started successfully (look for console messages)

### Build Errors
- Ensure CMake 3.15+ is installed
- Verify C++20 compiler support
- Check that all dependencies are available
- Clean build directory and try again

## Development

### Adding Features
1. Modify source files in `src/unified/`, `src/server/`, or `src/client-app/`
2. Rebuild using build scripts
3. Test the unified executable

### Debugging
- Build with Debug configuration: `-DCMAKE_BUILD_TYPE=Debug`
- Use your favorite debugger (GDB, LLDB, Visual Studio)
- Server logs appear in console output

## License

See LICENSE file for details.

## Credits

Enchantment Engine - Game Boy Color RPG Development Suite
Includes "Labyrinth of the Dragon" example game
