# Enchantment Engine - Project Structure

## Overview

The Enchantment Engine is organized into clear, logical directories for easy navigation and development.

## Directory Structure

```
Enchantment Engine/
│
├── bin/                           ← EXECUTABLES
│   ├── EnchantmentEngine.exe     ← Main application (444 KB)
│   └── README.md                 ← Executable documentation
│
├── src/                           ← ENGINE SOURCE CODE
│   ├── unified/                  ← Unified application
│   │   ├── main.cpp              ← Entry point
│   │   ├── unified_application.cpp/hpp
│   │   ├── splash_screen.cpp/hpp
│   │   ├── project_manager.cpp/hpp
│   │   ├── CMakeLists.txt
│   │   └── build/
│   │       └── enchantment_engine.exe
│   │
│   ├── server/                   ← Backend server
│   │   ├── server.cpp/hpp
│   │   ├── file_manager.cpp/hpp
│   │   ├── build_system.cpp/hpp
│   │   ├── asset_processor.cpp/hpp
│   │   ├── json_utils.hpp
│   │   └── CMakeLists.txt
│   │
│   ├── client-app/               ← Desktop client components
│   │   ├── api_client.cpp/hpp
│   │   ├── browser_window.cpp/hpp
│   │   └── CMakeLists.txt
│   │
│   └── client/                   ← Web IDE (HTML/CSS/JS)
│       ├── index.html
│       ├── editor.js
│       ├── styles.css
│       └── ...
│
├── examples/                      ← EXAMPLE GAMES
│   ├── README.md                 ← Examples documentation
│   └── LabyrinthOfTheDragon/     ← Complete RPG example
│       ├── src/                  ← Game source code
│       │   ├── main.c
│       │   ├── battle.c
│       │   ├── core.c
│       │   └── ...
│       ├── assets/               ← Game assets
│       │   ├── tiles/            ← Graphics
│       │   ├── art/              ← Source artwork
│       │   └── strings.js        ← Game text
│       ├── data/                 ← Generated data
│       ├── res/                  ← Resources
│       ├── build/                ← Build output
│       ├── obj/                  ← Object files
│       ├── tools/                ← Build tools
│       ├── Makefile              ← Build configuration
│       └── LabyrinthOfTheDragon.gbc  ← Compiled ROM
│
├── docs/                          ← DOCUMENTATION
│   ├── README.md                 ← Main documentation
│   ├── QUICKSTART.md             ← Quick start guide
│   ├── PROJECT_MANAGER.md        ← Project manager guide
│   ├── UNIFIED_BUILD.md          ← Build architecture
│   ├── CHANGELOG.md              ← Version history
│   ├── BUILD_COMPLETE.md         ← Build summary
│   ├── GAME_ENGINE_DESIGN.md     ← Engine architecture
│   ├── UML_DIAGRAMS.md           ← System diagrams
│   ├── API_REFERENCE.md          ← API documentation
│   └── PROJECT_STRUCTURE.md      ← This file
│
├── build_unified.bat              ← Windows build script
├── build_unified.sh               ← Linux/macOS build script
├── enchantment.conf               ← Configuration (optional)
├── enchantment_recent.txt         ← Recent projects (auto-created)
└── LICENSE                        ← License file
```

## Directory Purposes

### `/bin` - Executables
Contains the main application executable and related binaries.

**Key Files:**
- `EnchantmentEngine.exe` - Main application (run this!)
- `README.md` - Executable documentation

**Purpose:**
- Clean separation of executables from source
- Easy distribution (just copy bin folder)
- Clear entry point for users

### `/src` - Engine Source Code
Contains all C++ source code for the engine itself.

#### `/src/unified` - Unified Application
The main application that combines client and server.

**Key Files:**
- `main.cpp` - Entry point
- `unified_application.cpp/hpp` - Application logic
- `splash_screen.cpp/hpp` - Startup animation
- `project_manager.cpp/hpp` - Project selection
- `CMakeLists.txt` - Build configuration

**Purpose:**
- Single executable architecture
- Integrated server and client
- Project management
- Splash screen

#### `/src/server` - Backend Server
HTTP server and backend services.

**Key Files:**
- `server.cpp/hpp` - HTTP server
- `file_manager.cpp/hpp` - File operations
- `build_system.cpp/hpp` - GBDK integration
- `asset_processor.cpp/hpp` - Asset conversion
- `json_utils.hpp` - JSON parsing

**Purpose:**
- REST API for IDE
- File management
- Build system integration
- Asset processing

#### `/src/client-app` - Desktop Client
Desktop application components.

**Key Files:**
- `api_client.cpp/hpp` - HTTP client
- `browser_window.cpp/hpp` - Browser integration

**Purpose:**
- API communication
- Browser window management
- Desktop integration

#### `/src/client` - Web IDE
Web-based IDE interface.

**Key Files:**
- `index.html` - Main page
- `editor.js` - Code editor
- `styles.css` - Styling

**Purpose:**
- Code editor
- Tile editor
- Map editor
- Build interface
- Emulator

### `/examples` - Example Games
Complete example games demonstrating engine capabilities.

#### `/examples/LabyrinthOfTheDragon`
A complete RPG game with full source code.

**Structure:**
- `src/` - Game source code (C)
- `assets/` - Graphics and data
- `data/` - Generated data files
- `res/` - Resource files
- `build/` - Build output
- `obj/` - Object files
- `tools/` - Build tools
- `Makefile` - Build configuration
- `*.gbc` - Compiled ROM

**Purpose:**
- Learning resource
- Template for new games
- Testing the engine
- Demonstrating features

### `/docs` - Documentation
All documentation files (moved from root for organization).

**Key Files:**
- `README.md` - Main documentation
- `QUICKSTART.md` - Getting started
- `PROJECT_MANAGER.md` - Project management
- `UNIFIED_BUILD.md` - Build system
- `CHANGELOG.md` - Version history
- `API_REFERENCE.md` - API docs

**Purpose:**
- User guides
- Technical documentation
- API reference
- Tutorials

## File Types

### Source Files
- `.cpp` - C++ implementation
- `.hpp` - C++ headers
- `.c` - C implementation (game code)
- `.h` - C headers (game code)

### Build Files
- `CMakeLists.txt` - CMake configuration
- `Makefile` - Make configuration
- `.bat` - Windows batch scripts
- `.sh` - Unix shell scripts

### Documentation
- `.md` - Markdown documentation
- `.txt` - Plain text files

### Assets
- `.png` - Graphics
- `.js` - JavaScript data
- `.csv` - Table data
- `.gbc` - Game Boy Color ROM

### Configuration
- `.conf` - Configuration files
- `.json` - JSON data
- `.gitignore` - Git ignore rules

## Build Output

### Development Build
```
src/unified/build/
├── CMakeCache.txt
├── CMakeFiles/
├── Makefile
└── enchantment_engine.exe  ← Development executable
```

### Release Build
```
bin/
└── EnchantmentEngine.exe   ← Production executable
```

### Game Build
```
examples/LabyrinthOfTheDragon/
├── build/                  ← Intermediate files
├── obj/                    ← Object files
└── LabyrinthOfTheDragon.gbc  ← Final ROM
```

## Configuration Files

### `enchantment.conf`
Application configuration (optional).

```ini
port=8080
project=.
```

### `enchantment_recent.txt`
Recent projects list (auto-created).

```
C:\Users\YourName\Projects\MyGame
C:\Users\YourName\Projects\RPGAdventure
```

### `.gitignore`
Git ignore rules for version control.

## Working with the Structure

### Building the Engine
```bash
# From root directory
build_unified.bat          # Windows
./build_unified.sh         # Linux/macOS

# Output: bin/EnchantmentEngine.exe
```

### Running the Application
```bash
# From root directory
cd bin
./EnchantmentEngine.exe

# Or double-click bin/EnchantmentEngine.exe
```

### Building Example Game
```bash
# From root directory
cd examples/LabyrinthOfTheDragon
make clean
make assets
make

# Output: LabyrinthOfTheDragon.gbc
```

### Creating New Project
```bash
# Run application
cd bin
./EnchantmentEngine.exe

# In Project Manager:
# 1. Click "Create New Project"
# 2. Browse to desired location
# 3. Create folder for project
# 4. Select folder
```

## Best Practices

### For Users
1. **Run from bin/** - Always run `bin/EnchantmentEngine.exe`
2. **Keep examples/** - Don't modify example games directly
3. **Create projects elsewhere** - Use Project Manager to create projects outside engine folder
4. **Backup projects** - Use version control for your games

### For Developers
1. **Modify src/** - Engine source code only
2. **Test with examples/** - Use example games for testing
3. **Update docs/** - Keep documentation current
4. **Build to bin/** - Always output to bin folder

### For Contributors
1. **Follow structure** - Maintain directory organization
2. **Document changes** - Update relevant docs
3. **Test thoroughly** - Test with example games
4. **Clean commits** - Don't commit build artifacts

## Migration from Old Structure

### Old Structure
```
Enchantment Engine/
├── EnchantmentEngine.exe  ← Root
├── src/
│   ├── *.c                ← Game code mixed with engine
│   ├── server/
│   └── client/
├── assets/                ← Game assets in root
└── Makefile               ← Game build in root
```

### New Structure
```
Enchantment Engine/
├── bin/
│   └── EnchantmentEngine.exe  ← Executables
├── src/
│   ├── unified/           ← Engine only
│   ├── server/
│   └── client/
└── examples/
    └── LabyrinthOfTheDragon/
        ├── src/           ← Game code
        ├── assets/        ← Game assets
        └── Makefile       ← Game build
```

### Benefits
- **Cleaner root** - Less clutter
- **Clear separation** - Engine vs. game code
- **Better organization** - Logical grouping
- **Easier distribution** - Just copy bin/
- **Multiple examples** - Room for more games

## See Also

- [README.md](README.md) - Main documentation
- [QUICKSTART.md](QUICKSTART.md) - Getting started
- [UNIFIED_BUILD.md](UNIFIED_BUILD.md) - Build system
- [PROJECT_MANAGER.md](PROJECT_MANAGER.md) - Project management
