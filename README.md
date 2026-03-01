# 🐉 Enchantment Engine

**Complete Game Boy Color Development Suite**

A professional, all-in-one development environment for creating Game Boy Color games with an integrated IDE, build system, asset tools, and emulator.

---

## 🎯 Overview

Enchantment Engine is a modern development suite that brings Game Boy Color game development into the 21st century. It combines a powerful C++ backend with a beautiful web-based IDE, providing everything you need to create retro games with modern tools.

### What Makes It Special?

- **🖥️ Desktop Application** - Single executable with splash screen and auto-server
- **🌐 Web-Based IDE** - Modern code editor with syntax highlighting and tools
- **🎮 Built-in Emulator** - Test your games instantly without leaving the IDE
- **🔨 Complete Toolchain** - Asset processing, building, and debugging
- **📦 All-in-One** - No complex setup, just run and develop!

---

## ✨ Features

### Desktop Application
- **Beautiful Splash Screen** - Animated dragon logo with progress indicator
- **Project Manager** - Select or create projects before opening editor
  - 📁 Open Existing Project - Load complete projects
  - ✨ Create New Project - Auto-generate project structure
  - 📂 Open Folder - Browse any folder as workspace
  - 📄 Open File(s) - Open specific files with multi-select
  - ⚙️ Settings - View configuration and options
- **Recent Projects** - Quick access to your last 5 projects
- **Automatic Server Management** - Backend starts and stops automatically
- **Browser Integration** - Opens IDE in your default browser
- **Process Monitoring** - Health checks and graceful shutdown
- **Single Executable** - No installation required

### Web-Based IDE
- **Code Editor**
  - Syntax highlighting for C/JavaScript
  - Line numbers and minimap
  - Auto-indentation and bracket matching
  - Undo/redo with full history
  - Go to line (Ctrl+G)
  - Word wrap toggle
  - Font size adjustment

- **Asset Tools**
  - **Tile Editor** - PNG viewer and pixel-level editor
  - **Map Editor** - Grid, hex, and visual tilemap editing
  - **String Editor** - Manage game text and dialog
  - **Table Editor** - CSV spreadsheet for game data

- **Build System**
  - One-click asset processing
  - One-click ROM compilation
  - Real-time build output
  - Error and warning detection
  - GBDK-2020 integration

- **Game Boy Emulator**
  - Full Game Boy Color support
  - Save state functionality
  - Speed control (1x, 2x, 4x)
  - On-screen controls
  - Keyboard support

### Backend Server
- **HTTP REST API** - File operations and build commands
- **File Management** - Safe read/write with security
- **Build System** - GBDK-2020 integration
- **Asset Processor** - PNG to binary, string generation, table compilation
- **Cross-Platform** - Windows, Linux, macOS

---

## 🚀 Quick Start

### Running the Unified Application

Navigate to the bin folder and run:
```bash
cd bin
./EnchantmentEngine.exe
```

Or double-click `bin/EnchantmentEngine.exe` from File Explorer.

The unified application will:
1. Show splash screen with dragon logo and progress
2. Display Project Manager to select or create a project
3. Start integrated backend server in background thread
4. Wait for server to be ready
5. Open IDE in your default browser with selected project
6. You're ready to develop!

**Command Line Options:**
```bash
cd bin
./EnchantmentEngine.exe --port 8080 --project "../examples/LabyrinthOfTheDragon"
```

Options:
- `--port <port>` - Server port (default: 8080)
- `--project <path>` - Project directory (default: .)
- `--help` - Show help message

### Alternative: Separate Server (Legacy)

```bash
# Windows
src\server\build\enchantment_server.exe --port 8080

# Linux/macOS
./src/server/build/enchantment_server --port 8080
```

Then open: http://localhost:8080

---

## 🎮 Example Game: Labyrinth of the Dragon

The engine includes a complete RPG game as an example:

- **Turn-Based Combat** - Strategic battles with initiative rolls
- **4 Character Classes** - Druid, Fighter, Monk, Sorcerer
- **12 Monster Types** - Kobolds to Dragons with unique AI
- **8 Dungeon Floors** - Interconnected levels with puzzles
- **Status Effects** - 16 buffs and debuffs
- **Elemental Damage** - 8 damage aspects
- **Item System** - Potions, ethers, remedies
- **Resource Management** - Torches and magic keys

---

## 📦 Building from Source

### Prerequisites

1. **C++20 Compiler** - Clang, GCC, or MSVC
2. **CMake 3.15+** - Build system
3. **GBDK-2020** - Game Boy Development Kit (for game compilation)
4. **GNU Make** - Build automation (for game compilation)

### Build Unified Application

**Windows:**
```cmd
build_unified.bat
```

**Linux/macOS:**
```bash
chmod +x build_unified.sh
./build_unified.sh
```

This creates a single `EnchantmentEngine.exe` (409 KB) that includes:
- Desktop client with splash screen
- Integrated backend server
- All development tools

### Build Individual Components (Legacy)

**Client Application:**
```cmd
build_client.bat
```

**Backend Server:**
```cmd
build_server.bat
```

**Game ROM:**
```cmd
make assets
make
```

### Manual Build

```bash
cd "Enchantment Engine/src/unified"
mkdir build && cd build
cmake -G "MinGW Makefiles" -DCMAKE_BUILD_TYPE=Release ..
cmake --build . --config Release
```

---

## 📁 Project Structure

```
EnchantmentEngine/
├── EnchantmentEngine.exe          ← Main application (RUN THIS!)
├── LabyrinthOfTheDragon.gbc       ← Example game ROM
│
├── src/
│   ├── client-app/                ← Desktop client (C++)
│   │   ├── main.cpp
│   │   ├── application.cpp
│   │   ├── api_client.cpp
│   │   ├── browser_window.cpp
│   │   ├── splash_screen.cpp
│   │   └── build/
│   │       └── enchantment_client.exe
│   │
│   ├── server/                    ← Backend server (C++)
│   │   ├── main.cpp
│   │   ├── server.cpp
│   │   ├── file_manager.cpp
│   │   ├── build_system.cpp
│   │   ├── asset_processor.cpp
│   │   └── build/
│   │       └── enchantment_server.exe
│   │
│   ├── client/                    ← Web IDE (HTML/CSS/JS)
│   │   ├── index.html
│   │   ├── css/
│   │   ├── js/
│   │   └── emulator/
│   │
│   └── *.c, *.h                   ← Example game source
│
├── assets/                        ← Source assets
│   ├── tiles/                     ← PNG tile sheets
│   ├── strings.js                 ← String definitions
│   └── tables.csv                 ← Data tables
│
├── data/                          ← Generated C files
├── res/                           ← Binary assets
├── obj/                           ← Compiled objects
│
└── Documentation/
    ├── README.md                  ← This file
    ├── GAME_ENGINE_DESIGN.md
    ├── UML_DIAGRAMS.md
    ├── EDITOR_ARCHITECTURE.md
    └── COMPLETE_BUILD_SUMMARY.md
```

---

## 🛠️ Development Workflow

### 1. Start the Engine
```
EnchantmentEngine.exe
```

### 2. Edit Your Game
- **Code:** Click "Source" tab → Select file → Edit → Save
- **Tiles:** Click "Tiles" tab → Select PNG → Edit pixels
- **Maps:** Click "Maps" tab → Edit tilemap → Save
- **Strings:** Click "Strings" tab → Edit text → Save
- **Tables:** Click "Tables" tab → Edit data → Save

### 3. Build ROM
- Click "Build" tab
- Click "Build All" button
- Wait for compilation
- Check output for errors

### 4. Test Game
- Click "Emulator" tab
- Click "Load Built ROM"
- Game loads automatically
- Play and test!

### 5. Iterate
- Make changes
- Rebuild
- Test again
- Repeat until perfect!

---

## 🎨 Creating Your Own Game

### Starting a New Project

1. **Plan Your Game**
   - Genre (RPG, platformer, puzzle, etc.)
   - Core mechanics
   - Art style
   - Story/theme

2. **Set Up Structure**
   - Create source files in `src/`
   - Add tile graphics to `assets/tiles/`
   - Define strings in `assets/strings.js`
   - Create data tables in `assets/tables.csv`

3. **Implement Core Systems**
   - Game loop in `main.c`
   - State management
   - Input handling
   - Rendering

4. **Add Content**
   - Levels/maps
   - Characters/enemies
   - Items/powerups
   - Sound effects

5. **Test and Polish**
   - Build frequently
   - Test on emulator
   - Fix bugs
   - Optimize performance

### Example: Simple Platformer

```c
// main.c
#include <gb/gb.h>

void main() {
    // Initialize
    DISPLAY_ON;
    
    // Game loop
    while(1) {
        // Update
        // Render
        wait_vbl_done();
    }
}
```

---

## 🎮 Controls

### IDE
- **Mouse** - Navigate and click
- **Keyboard** - Type and shortcuts
- **Ctrl+S** - Save file
- **Ctrl+G** - Go to line

### Emulator
- **Arrow Keys** - D-Pad
- **Z** - A Button
- **X** - B Button
- **Enter** - Start
- **Shift** - Select

---

## 📚 Documentation

### Main Documentation
- **README.md** - This file (getting started)
- **GAME_ENGINE_DESIGN.md** - Engine architecture
- **UML_DIAGRAMS.md** - System diagrams
- **EDITOR_ARCHITECTURE.md** - IDE technical details
- **COMPLETE_BUILD_SUMMARY.md** - Build overview

### Component Documentation
- **src/server/README.md** - Backend server
- **src/client-app/README.md** - Desktop client
- **SERVER_QUICKSTART.md** - Server quick start

### Build Documentation
- **BUILD_SUCCESS.txt** - Server build summary
- **CLIENT_BUILD_SUCCESS.txt** - Client build summary

---

## 🔧 Configuration

### Application Settings

Edit `enchantment.conf`:
```
port=8080
project=.
```

### Command Line Options

```
EnchantmentEngine.exe [options]

Options:
  --port <port>       Server port (default: 8080)
  --project <path>    Project directory (default: current)
```

---

## 🐛 Troubleshooting

### Application Won't Start
**Problem:** Port already in use  
**Solution:** `EnchantmentEngine.exe --port 8081`

### Server Fails
**Problem:** Server executable not found  
**Solution:** Verify `src/server/build/enchantment_server.exe` exists

### Build Fails
**Problem:** GBDK not found  
**Solution:** Install GBDK-2020, set `GBDK_HOME` environment variable

### ROM Won't Load
**Problem:** ROM not found  
**Solution:** Build ROM first using "Build All"

---

## 💻 System Requirements

### Running the Engine
- **OS:** Windows 7+ (Windows 10/11 recommended)
- **RAM:** 256 MB minimum, 512 MB recommended
- **Disk:** 50 MB free space
- **Display:** 1024×768 or higher
- **Browser:** Chrome, Firefox, or Edge

### Building ROMs
- **GBDK-2020** - Game Boy Development Kit
- **GNU Make** - Build automation
- **Node.js** - Asset processing (optional)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Follow existing code style
2. Comment your code
3. Test thoroughly
4. Update documentation
5. Submit pull requests

---

## 📄 License

See [LICENSE](LICENSE) file for details.

---

## 🙏 Credits

### Enchantment Engine
- **Development** - Enchantment Engine Team
- **Architecture** - Modern C++20 with web technologies
- **Design** - Professional IDE with retro aesthetics

### Technologies Used
- **GBDK-2020** - Game Boy Development Kit
- **CMake** - Build system
- **Clang/GCC** - C++ compilers
- **GameBoy-Online** - Emulator (modified)

### Inspiration
- Classic Game Boy Color games
- Modern IDE design
- Retro game development community

---

## 🌟 Features Roadmap

### Planned Features
- [ ] Embedded WebView2 (no external browser)
- [ ] Auto-update functionality
- [ ] Multiple project support
- [ ] Workspace management
- [ ] Plugin system
- [ ] Theme customization
- [ ] Debugger integration
- [ ] Profiler tools
- [ ] Asset library
- [ ] Template projects

---

## 📞 Support

### Getting Help
- Read the documentation
- Check troubleshooting section
- Review example game code
- Explore GBDK-2020 docs

### Resources
- [GBDK-2020 Documentation](https://gbdk-2020.github.io/gbdk-2020/)
- [Pan Docs](https://gbdev.io/pandocs/) - Game Boy technical reference
- [Game Boy Dev Community](https://gbdev.io/)
- [Awesome Game Boy Development](https://github.com/gbdev/awesome-gbdev)

---

## 🎉 Start Creating!

You now have everything you need to create amazing Game Boy Color games!

**Run the engine, explore the IDE, and start developing your retro masterpiece today!**

```
EnchantmentEngine.exe
```

**Happy Game Development! 🎮✨**

---

**Version:** 3.0.0  
**Release Date:** March 1, 2026  
**Platform:** Windows, Linux, macOS  
**Status:** ✅ Production Ready
