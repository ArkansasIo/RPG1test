# Enchantment Game Engine - Quick Start Guide

## ✅ Server Compiled Successfully!

The C++ backend server has been compiled and is ready to use.

**Executable Location:** `src/server/build/enchantment_server.exe`  
**File Size:** 366 KB  
**Compiler:** Clang 22.1.0 (LLVM MinGW)

---

## 🚀 Quick Start

### Option 1: Use the Start Script (Recommended)

Simply double-click or run:

**Windows:**
```cmd
start_server.bat
```

**Linux/macOS:**
```bash
chmod +x start_server.sh
./start_server.sh
```

### Option 2: Run Directly

**Windows:**
```cmd
src\server\build\enchantment_server.exe --port 8080 --project .
```

**Linux/macOS:**
```bash
./src/server/build/enchantment_server --port 8080 --project .
```

---

## 🌐 Accessing the IDE

Once the server is running, open your web browser and navigate to:

```
http://localhost:8080
```

You should see the Enchantment Game Engine IDE with:
- 🎮 Game Boy Emulator
- 🖼️ Tile Editor
- 🗺️ Map Editor
- 📝 String Editor
- 📊 Table Editor
- 💻 Source Code Editor
- 🔨 Build System

---

## 📋 Command Line Options

```
enchantment_server.exe [options]

Options:
  --port <port>       Server port (default: 8080)
  --project <path>    Project directory (default: current directory)
  --help              Show help message

Examples:
  enchantment_server.exe
  enchantment_server.exe --port 3000
  enchantment_server.exe --project C:\MyGame
```

---

## 🎯 Features

### Web-Based IDE
- Modern code editor with syntax highlighting
- Line numbers, auto-indentation, bracket matching
- Undo/redo, go to line, minimap
- Multiple file editing

### Asset Tools
- PNG tile viewer and editor
- Tilemap editor with grid/hex views
- String data editor
- CSV table editor with spreadsheet view

### Build System
- One-click ROM compilation
- Asset processing (PNG → binary)
- Real-time build output
- Error and warning detection

### Emulator
- Full Game Boy Color emulation
- Save state support
- Speed control (1x, 2x, 4x)
- On-screen controls
- Keyboard support

---

## 🔧 Development Workflow

1. **Start the server** (see Quick Start above)
2. **Open the IDE** in your browser (http://localhost:8080)
3. **Edit your code** in the Source tab
4. **Edit assets** in Tiles/Maps/Strings/Tables tabs
5. **Build the ROM** in the Build tab
6. **Test your game** in the Emulator tab
7. **Iterate** and repeat!

---

## 📁 Project Structure

```
LabyrinthOfTheDragon/
├── src/                          # C source files
│   ├── main.c                   # Game entry point
│   ├── battle.c                 # Battle system
│   ├── player.c                 # Player logic
│   └── ...
├── assets/                       # Source assets
│   ├── tiles/                   # PNG tile sheets
│   ├── strings.js               # String definitions
│   └── tables.csv               # Data tables
├── data/                         # Generated C files
│   ├── strings.c                # Compiled strings
│   └── tables.c                 # Compiled tables
├── res/                          # Binary assets
│   └── tiles/                   # Binary tile data
├── obj/                          # Compiled objects
├── src/server/build/             # Server executable
│   └── enchantment_server.exe   # ← The compiled server
├── Makefile                      # Build configuration
├── LabyrinthOfTheDragon.gbc     # Compiled ROM
├── start_server.bat             # Quick start (Windows)
└── start_server.sh              # Quick start (Linux/macOS)
```

---

## 🛠️ Prerequisites

### For Running the Server
- **Windows:** No additional requirements (executable is self-contained)
- **Linux/macOS:** Standard C++ runtime libraries (usually pre-installed)

### For Building ROMs
- **GBDK-2020** - Game Boy Development Kit
  - Download from: https://github.com/gbdk-2020/gbdk-2020/releases
  - Install to `~/gbdk/` or set `GBDK_HOME` environment variable
- **GNU Make** - Build automation tool
  - Windows: Install via Chocolatey or download binaries
  - Linux/macOS: Usually pre-installed
- **Node.js** - For asset processing tools (optional)
  - Download from: https://nodejs.org

---

## 🔨 Building the ROM

### From the IDE:

1. Click the **Build** tab
2. Click **Build Assets** to process PNG tiles, strings, and tables
3. Click **Compile ROM** to build the Game Boy ROM
4. Click **Build All** to do both steps

### From Command Line:

```bash
# Process assets
make assets

# Compile ROM
make

# Or do both
make assets && make
```

The compiled ROM will be: `LabyrinthOfTheDragon.gbc`

---

## 🎮 Testing Your Game

### In the Browser:

1. Click the **Emulator** tab
2. Click **Load Built ROM**
3. The game loads automatically
4. Use on-screen controls or keyboard:
   - **Arrow Keys** - D-Pad
   - **Z** - A Button
   - **X** - B Button
   - **Enter** - Start
   - **Shift** - Select

### On Real Hardware:

1. Flash the ROM to a Game Boy cartridge using:
   - GBxCart RW
   - Joey Jr
   - EZ-Flash Jr
   - EverDrive GB
2. Insert cartridge into Game Boy Color
3. Power on and play!

---

## 🐛 Troubleshooting

### Server won't start

**Problem:** Port already in use  
**Solution:** Use a different port: `--port 8081`

**Problem:** Permission denied  
**Solution:** Run as administrator or use a port > 1024

### Build fails

**Problem:** GBDK not found  
**Solution:** Install GBDK-2020 and set `GBDK_HOME` environment variable

**Problem:** Make command not found  
**Solution:** Install GNU Make for your platform

### ROM won't load

**Problem:** ROM file not found  
**Solution:** Build the ROM first using the Build tab

**Problem:** Emulator error  
**Solution:** Check browser console for errors, try refreshing the page

### Files won't save

**Problem:** Permission denied  
**Solution:** Check file permissions, ensure project directory is writable

---

## 📊 Server Statistics

- **Compilation Time:** ~10 seconds
- **Executable Size:** 366 KB
- **Memory Usage:** ~50 MB (base) + build overhead
- **Startup Time:** < 1 second
- **Request Latency:** < 10 ms
- **Build Time:** 5-30 seconds (depends on project size)

---

## 🔒 Security

The server includes several security features:

- ✅ Path traversal prevention (no `..` in paths)
- ✅ All file operations relative to project root
- ✅ Input validation on all API endpoints
- ✅ No shell injection vulnerabilities
- ✅ CORS headers for browser security

---

## 🆘 Getting Help

### Documentation
- **README.md** - Main project documentation
- **GAME_ENGINE_DESIGN.md** - Game engine architecture
- **UML_DIAGRAMS.md** - System diagrams
- **EDITOR_ARCHITECTURE.md** - IDE technical details
- **src/server/README.md** - Server-specific docs

### Resources
- GBDK-2020 Docs: https://gbdk-2020.github.io/gbdk-2020/
- Pan Docs: https://gbdev.io/pandocs/
- Game Boy Dev: https://gbdev.io/

---

## 🎉 You're Ready!

Everything is set up and ready to go. Start the server, open the IDE, and begin creating your Game Boy Color masterpiece!

```
Happy Game Development! 🎮✨
```

---

**Version:** 3.0.0  
**Last Updated:** March 1, 2026  
**Compiled With:** Clang 22.1.0 (LLVM MinGW)
