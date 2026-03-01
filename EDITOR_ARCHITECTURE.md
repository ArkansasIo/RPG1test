# Enchantment Game Engine - Editor Architecture

Complete technical documentation for the web-based IDE and C++ backend server.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Frontend (Web IDE)](#frontend-web-ide)
4. [Backend (C++ Server)](#backend-c-server)
5. [Communication Protocol](#communication-protocol)
6. [Build Pipeline](#build-pipeline)
7. [Asset Processing](#asset-processing)
8. [File Management](#file-management)
9. [Emulator Integration](#emulator-integration)
10. [Development Workflow](#development-workflow)

---

## Overview

The Enchantment Game Engine is a complete development environment for creating Game Boy Color games. It consists of:

- **Web-based IDE** - Modern code editor with syntax highlighting, file management, and visual tools
- **C++ Backend Server** - HTTP server handling file I/O, builds, and asset processing
- **Game Boy Emulator** - JavaScript-based emulator for testing games in the browser
- **Build System** - Integration with GBDK-2020 for compiling C code to Game Boy ROMs
- **Asset Pipeline** - Tools for converting PNG tiles, strings, and data tables

### Technology Stack

**Frontend:**
- HTML5, CSS3, JavaScript (ES6+)
- Custom code editor with syntax highlighting
- Canvas API for tile/map editing
- GameBoy-Online emulator (modified)

**Backend:**
- C++20
- Standard library (filesystem, networking)
- CMake build system
- Cross-platform (Windows, Linux, macOS)

**Build Tools:**
- GBDK-2020 (Game Boy Development Kit)
- GNU Make
- Node.js (for asset processing tools)

---

## Architecture

### System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Web Browser                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    Web IDE (Frontend)                   │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │ │
│  │  │  Editor  │  │   Tile   │  │   Map    │  │  Build │ │ │
│  │  │  Panel   │  │  Viewer  │  │  Editor  │  │  Panel │ │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │           Game Boy Emulator (Canvas)             │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
│                            │ HTTP/REST API                   │
│                            ▼                                 │
└─────────────────────────────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────┐
│                  C++ Backend Server                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     HTTP     │  │     File     │  │    Build     │      │
│  │    Server    │  │   Manager    │  │    System    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────────────────────────────────────────┐      │
│  │            Asset Processor                        │      │
│  │  PNG→Binary  │  Strings→C  │  Tables→C           │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    Project Files                             │
│  src/  assets/  data/  res/  obj/  *.gbc                    │
└─────────────────────────────────────────────────────────────┘
```

### Component Interaction

1. **User edits code** → Frontend editor
2. **User clicks "Build"** → Frontend sends POST to `/api/build/rom`
3. **Server receives request** → Invokes BuildSystem
4. **BuildSystem runs make** → Compiles C code with GBDK
5. **Build completes** → Server returns output
6. **Frontend displays output** → User sees build log
7. **User loads ROM** → Frontend requests `/api/rom`
8. **Server sends ROM binary** → Frontend loads into emulator
9. **Emulator runs game** → User tests gameplay

---

## Frontend (Web IDE)

### File Structure

```
src/client/
├── index.html              # Main HTML structure
├── css/
│   ├── main.css           # Core styles
│   ├── menus.css          # Menu bar and dropdowns
│   └── widgets.css        # UI components
├── js/
│   ├── app.js             # Main application logic
│   ├── editor-ide.js      # Code editor enhancements
│   ├── menus.js           # Menu system
│   ├── tools.js           # Tile/map tools
│   ├── widgets.js         # UI widgets
│   ├── dnd5e.js           # D&D data (monster stats)
│   ├── dnd5e-pixelart.js  # Pixel art library
│   ├── sorctools.js       # Sorcerer tools
│   └── platformconfig.js  # Platform detection
└── emulator/
    ├── GameBoyCore.js     # Emulator core
    ├── GameBoyIO.js       # I/O handling
    ├── glue.js            # Emulator glue code
    ├── resampler.js       # Audio resampling
    ├── XAudioServer.js    # Audio output
    ├── resize.js          # Canvas scaling
    └── base64.js          # Base64 utilities
```

### UI Layout

The IDE uses a tabbed interface with these panels:

1. **Emulator** - Game Boy emulator with controls
2. **Tiles** - PNG tile viewer and editor
3. **Maps** - Tilemap editor with grid/hex views
4. **Strings** - String data editor (strings.js)
5. **Tables** - CSV table editor with spreadsheet view
6. **Source** - Code editor for C/H files
7. **Build** - Build output and controls

### Code Editor Features

The custom code editor (`editor-ide.js`) provides:

- **Syntax Highlighting** - JavaScript/C syntax coloring
- **Line Numbers** - Gutter with current line indicator
- **Auto-Indentation** - Smart indentation on Enter
- **Tab Support** - Tab key inserts spaces
- **Undo/Redo** - Full undo stack
- **Go to Line** - Ctrl+G to jump to line
- **Minimap** - Code overview on right side
- **Bracket Matching** - Highlights matching brackets
- **Word Wrap** - Toggle word wrapping
- **Font Sizing** - Increase/decrease font size
- **Status Bar** - Line/col, word count, file info

### Tile Editor

Features:
- Load PNG tile sheets from `assets/tiles/`
- Visual tile grid display
- 4-color palette selector
- Pixel-level editing
- Export to binary format

### Map Editor

Features:
- Load tilemap data from `res/tilemaps/`
- Three view modes: Visual, Grid, Hex Dump
- Adjustable map dimensions
- Grid overlay toggle
- Hover info showing tile IDs
- Export to binary format

### Table Editor

Features:
- Load CSV from `assets/tables.csv`
- Spreadsheet-style editing
- Add/delete rows and columns
- Column sorting (click header)
- Filter by column value or SQL WHERE clause
- Toggle between spreadsheet and raw CSV view
- Cell type detection (number, string, hex)

---

## Backend (C++ Server)

### Class Hierarchy

```
EnchantmentServer
├── FileManager
├── BuildSystem
└── AssetProcessor
```

### EnchantmentServer

**Responsibilities:**
- HTTP server socket management
- Request routing
- Response generation
- Static file serving
- CORS headers

**Key Methods:**
```cpp
void start();                    // Start server loop
void stop();                     // Stop server
void handleRequest(int socket);  // Process client request
HttpRequest parseRequest(...);   // Parse HTTP request
std::string buildResponse(...);  // Build HTTP response
```

**Routes:**
- `GET /` → Serve index.html
- `GET /api/files` → List project files
- `GET /api/file?path=...` → Read file content
- `POST /api/file` → Save file
- `POST /api/build/assets` → Process assets
- `POST /api/build/rom` → Compile ROM
- `GET /api/rom` → Download ROM binary
- `GET /css/*`, `/js/*`, `/emulator/*` → Static files

### FileManager

**Responsibilities:**
- Safe file I/O operations
- Path validation and sanitization
- Directory traversal prevention
- Binary and text file support

**Key Methods:**
```cpp
std::string readFile(path);              // Read text file
std::vector<uint8_t> readBinaryFile(...);// Read binary file
void writeFile(path, content);           // Write text file
void writeBinaryFile(path, data);        // Write binary file
std::vector<std::string> listFiles(...); // List directory
bool fileExists(path);                   // Check file exists
```

**Security:**
- All paths are relative to project root
- `..` in paths is rejected
- Absolute paths are converted to relative
- No shell commands executed with user input

### BuildSystem

**Responsibilities:**
- GBDK-2020 integration
- Makefile execution
- Build output parsing
- Error/warning detection

**Key Methods:**
```cpp
std::string buildRom();      // Compile ROM
std::string buildAssets();   // Process assets
std::string buildAll();      // Build everything
std::string clean();         // Clean build artifacts
bool runMake(target, output);// Execute make command
```

**Build Process:**
1. Check GBDK installation
2. Set GBDK_HOME environment variable
3. Execute `make` command
4. Capture stdout/stderr
5. Parse for errors and warnings
6. Return build output

### AssetProcessor

**Responsibilities:**
- PNG to Game Boy tile conversion
- String data generation from JS
- CSV table processing
- C code generation

**Key Methods:**
```cpp
std::string processAssets();     // Process all assets
std::string processTiles();      // Convert PNG tiles
std::string processStrings();    // Generate strings.c
std::string processTables();     // Generate tables.c
TileData loadPNG(path);          // Load PNG file
std::vector<uint8_t> convertToGameBoyTiles(...); // Convert format
```

**Asset Pipeline:**

1. **PNG Tiles:**
   - Read PNG from `assets/tiles/*.png`
   - Convert to 2bpp Game Boy format
   - Write binary to `res/tiles/*.bin`

2. **Strings:**
   - Parse `assets/strings.js`
   - Extract key-value pairs
   - Generate `data/strings.c` with const char arrays

3. **Tables:**
   - Parse `assets/tables.csv`
   - Infer column types
   - Generate `data/tables.c` with typed arrays

---

## Communication Protocol

### HTTP API

All API endpoints use JSON for request/response bodies.

#### List Files

```
GET /api/files?dir=src

Response:
{
  "files": [
    "src/main.c",
    "src/battle.c",
    "src/player.c"
  ]
}
```

#### Read File

```
GET /api/file?path=src/main.c

Response: (plain text)
#include <gb/gb.h>
...
```

#### Save File

```
POST /api/file
Content-Type: application/json

{
  "path": "src/main.c",
  "content": "#include <gb/gb.h>\n..."
}

Response:
{
  "success": true
}
```

#### Build ROM

```
POST /api/build/rom

Response:
{
  "success": true,
  "output": "=== Building ROM ===\n..."
}
```

#### Download ROM

```
GET /api/rom

Response: (binary data)
Content-Type: application/octet-stream
Content-Length: 524288

<ROM binary data>
```

### Error Handling

Errors return appropriate HTTP status codes:

- `400 Bad Request` - Invalid parameters
- `404 Not Found` - File not found
- `500 Internal Server Error` - Server error

Error response format:
```json
{
  "error": "Error message here"
}
```

---

## Build Pipeline

### Build Flow

```
1. User clicks "Build ROM"
   ↓
2. Frontend: POST /api/build/rom
   ↓
3. Server: BuildSystem::buildRom()
   ↓
4. Check GBDK installation
   ↓
5. Execute: make
   ↓
6. GBDK compiles C files
   ├── src/*.c → obj/*.o
   └── data/*.c → obj/*.o
   ↓
7. GBDK links objects
   └── obj/*.o → LabyrinthOfTheDragon.gbc
   ↓
8. Return build output
   ↓
9. Frontend displays output
   ↓
10. User clicks "Load Built ROM"
    ↓
11. Frontend: GET /api/rom
    ↓
12. Server: Read ROM binary
    ↓
13. Frontend: Load into emulator
    ↓
14. User plays game!
```

### Makefile Integration

The server executes the existing Makefile:

```makefile
# Makefile targets used by server
make assets    # Process PNG, strings, tables
make           # Compile and link ROM
make clean     # Remove build artifacts
```

Environment variables set by server:
- `GBDK_HOME` - Path to GBDK installation

---

## Asset Processing

### PNG to Game Boy Tiles

**Input:** PNG file (any size, 4 colors max)

**Process:**
1. Load PNG image
2. Divide into 8×8 pixel tiles
3. Convert each tile to 2bpp format:
   - Each pixel = 2 bits (4 colors)
   - Each row = 2 bytes (bit planes)
   - Each tile = 16 bytes

**Output:** Binary file with tile data

**Game Boy Tile Format:**
```
Tile (8×8 pixels, 16 bytes):
  Row 0: [byte0] [byte1]  (bit plane 0, bit plane 1)
  Row 1: [byte2] [byte3]
  ...
  Row 7: [byte14] [byte15]

Pixel color = (bit from byte1 << 1) | (bit from byte0)
  00 = Color 0 (white)
  01 = Color 1 (light gray)
  10 = Color 2 (dark gray)
  11 = Color 3 (black)
```

### String Data Generation

**Input:** `assets/strings.js`

```javascript
addNamespace('battle', 3, {
  'attack': 'Attack!',
  'critical': 'Critical Hit!',
  'miss': 'Miss!'
});
```

**Output:** `data/strings.c`

```c
#pragma bank 3

const char STR_BATTLE_ATTACK[] = "Attack!";
const char STR_BATTLE_CRITICAL[] = "Critical Hit!";
const char STR_BATTLE_MISS[] = "Miss!";
```

### Table Data Generation

**Input:** `assets/tables.csv`

```csv
level,hp_c,hp_b,hp_a,hp_s
1,10,15,20,25
2,12,18,24,30
3,14,21,28,35
```

**Output:** `data/tables.c`

```c
const uint8_t LEVEL[3] = {1, 2, 3};
const uint8_t HP_C[3] = {10, 12, 14};
const uint8_t HP_B[3] = {15, 18, 21};
const uint8_t HP_A[3] = {20, 24, 28};
const uint8_t HP_S[3] = {25, 30, 35};
```

---

## File Management

### Project Structure

```
LabyrinthOfTheDragon/
├── src/                    # C source files
│   ├── main.c
│   ├── battle.c
│   ├── player.c
│   └── ...
├── assets/                 # Source assets
│   ├── tiles/             # PNG tile sheets
│   ├── strings.js         # String definitions
│   └── tables.csv         # Data tables
├── data/                   # Generated C files
│   ├── strings.c
│   └── tables.c
├── res/                    # Binary assets
│   ├── tiles/             # Binary tile data
│   └── tilemaps/          # Tilemap data
├── obj/                    # Compiled objects
│   └── *.o
├── Makefile               # Build configuration
└── LabyrinthOfTheDragon.gbc  # Compiled ROM
```

### File Operations

**Read File:**
- Validate path (no `..`)
- Resolve to absolute path
- Check file exists
- Read content
- Return as string or binary

**Write File:**
- Validate path
- Create parent directories if needed
- Write content
- Sync to disk

**List Files:**
- Validate directory path
- Iterate directory entries
- Filter by file type
- Sort alphabetically
- Return relative paths

---

## Emulator Integration

### GameBoy-Online Emulator

The IDE uses a modified version of GameBoy-Online, a JavaScript Game Boy Color emulator.

**Features:**
- Full Game Boy Color support
- Save state support
- Speed control (1x, 2x, 4x)
- Audio output
- Keyboard and touch controls

**Controls:**
- D-Pad: Arrow keys or on-screen buttons
- A Button: Z key or on-screen button
- B Button: X key or on-screen button
- Start: Enter key or on-screen button
- Select: Shift key or on-screen button

**Loading ROM:**
```javascript
// Load ROM from server
fetch('/api/rom')
  .then(res => res.arrayBuffer())
  .then(data => {
    // Convert to base64
    const base64 = arrayBufferToBase64(data);
    // Load into emulator
    gameboy.loadROM(base64);
    gameboy.run();
  });
```

---

## Development Workflow

### Typical Development Session

1. **Start Server**
   ```bash
   ./src/server/build/enchantment_server --port 8080
   ```

2. **Open IDE**
   - Navigate to http://localhost:8080
   - IDE loads with project files

3. **Edit Code**
   - Click "Source" tab
   - Select file from sidebar
   - Edit in code editor
   - Click "Save"

4. **Edit Assets**
   - Click "Tiles" tab to edit tile graphics
   - Click "Strings" tab to edit text
   - Click "Tables" tab to edit data

5. **Build ROM**
   - Click "Build" tab
   - Click "Build All" button
   - Wait for build to complete
   - Check output for errors

6. **Test Game**
   - Click "Emulator" tab
   - Click "Load Built ROM"
   - Game loads in emulator
   - Play and test

7. **Iterate**
   - Fix bugs
   - Add features
   - Rebuild
   - Test again

### Best Practices

**Code Organization:**
- Keep functions small and focused
- Use meaningful variable names
- Comment complex logic
- Follow existing code style

**Asset Management:**
- Use consistent naming conventions
- Organize tiles by category
- Document string keys
- Keep tables normalized

**Build Process:**
- Build assets before ROM
- Check for warnings
- Test on real hardware when possible
- Use version control (git)

**Testing:**
- Test each feature thoroughly
- Check edge cases
- Verify on different emulators
- Test save/load functionality

---

## Conclusion

The Enchantment Game Engine provides a complete, modern development environment for Game Boy Color games. The combination of a web-based IDE and C++ backend server offers the best of both worlds: a user-friendly interface with powerful native performance.

The architecture is designed to be:
- **Modular** - Components are independent and reusable
- **Extensible** - Easy to add new features
- **Cross-platform** - Works on Windows, Linux, macOS
- **Secure** - Input validation and path sanitization
- **Performant** - Native C++ for heavy operations

Whether you're a beginner learning game development or an experienced developer creating a commercial game, the Enchantment Engine has the tools you need.

---

**Document Version:** 1.0  
**Last Updated:** 2026-03-01  
**Author:** Enchantment Engine Team
