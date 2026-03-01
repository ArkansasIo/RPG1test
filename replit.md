# Labyrinth of the Dragon - Enchantment Game Engine

A web-based RPG Workbench and Game Boy Color emulator/editor for Labyrinth of the Dragon.

## Project Overview

This project combines a Game Boy Color homebrew ROM (Labyrinth of the Dragon) with a web-based development toolkit featuring a UE5-style menu system. It includes a GBC emulator, tile editor, enhanced map viewer (grid/hex/visual modes), Excel-style spreadsheet table editor with SQL filtering, string/table editors, source code editor, build system, GB/NES hardware tools, game engine logic systems, comprehensive D&D 5e tools, sorcgcs.com sprite/art/audio tools, UE5-style dockable widget panels, full text editor IDE, RPG Maker tools, and multi-platform/multi-genre support.

## Architecture

- **Language**: C (game ROM via GBDK-2020), JavaScript/Node.js (web tooling)
- **Build System**: GNU Make (ROM), Node.js tools (asset pipeline)
- **Web Server**: Node.js HTTP server (`server.js`) on port 5000
- **Emulator**: GameBoy-Online (taisel/GameBoy-Online, GPL-2 licensed)
- **GBDK-2020**: v4.5.0, auto-downloaded to `~/gbdk/`
- **Version**: v3.0.0

## Directory Structure

```
server.js              - Main web server (port 5000) with API endpoints
src/
  client/              - Web UI (HTML/CSS/JS)
    index.html         - Main application page with UE5-style menu bar
    css/
      main.css         - Core application styles
      menus.css        - Menu system, modals, tool cards, forms, stat blocks
      widgets.css      - UE5-style dockable widget panel styles
    js/
      app.js           - Main application logic (tabs, emulator, editors, build)
      menus.js         - UE5-style cascading menu bar system (11 top-level menus)
      tools.js         - GB/NES hardware tools and Game Engine systems (modals)
      sorctools.js     - sorcgcs.com tools (Auto-Sprite, Canvas, SFX Editor, etc.)
      dnd5e.js         - D&D 5e tools, data, rules reference (modals)
      dnd5e-pixelart.js - D&D 5e Pixel Art Studio (canvas editor + sprite library)
      platformconfig.js - Platform profiles (21 platforms) + GenreConfig (19 genres)
      widgets.js       - UE5-style dockable panels (Outliner, Modes, World, Details, Properties, Palette, Content Browser, Output Log, Console, Animation Timeline, Event Graph)
      editor-ide.js    - Full text editor IDE (line numbers, syntax highlighting, minimap, toolbar, status bar)
    emulator/          - GameBoy-Online emulator files
      GameBoyCore.js   - Core emulator engine
      GameBoyIO.js     - I/O and save state management
      glue.js          - Audio context pre-warming, browser storage
      XAudioServer.js  - Audio output (reuses pre-warmed context)
      base64.js, resampler.js, resize.js
  *.c, *.h             - Game Boy C source files
data/                  - ROM bank data files
assets/
  tiles/               - PNG sprite/tile sheets (editable via web UI)
  strings.js           - Game strings (editable via web UI)
  tables.csv           - Game data tables (editable via web UI)
res/
  tiles/               - Binary tile data (generated)
  tilemaps/            - Tilemap files
  maps/                - Map data files
tools/                 - Node.js build tools (png2bin, strings2c, tables2c)
obj/                   - Compiled object files (generated)
```

## UI Structure

### Menu Bar (UE5-style, `menus.js`)
- **File** - New/Open/Save project, Import/Export ROM/tiles/data, Project Settings
- **Edit** - Undo/Redo, Cut/Copy/Paste, Find & Replace, Preferences
- **View** - Panel switching, Zoom, Fullscreen, Toggle Status Bar/Sidebar
- **Assets** - Tile Manager, Tilemap Editor, Sprite Manager, Palette Manager, Build Assets
- **GB/NES Tools** - Hardware (Memory/Register/VRAM/OAM viewers), Audio (Sound channels, Music Composer, SFX/Wave editors), Graphics (2BPP/CHR converters, Sprite Animator), ROM (Header Editor, Bank Manager, Hex Viewer), Development (Disassembler, Memory Map, Breakpoints, Profiler)
- **Game Engine** - Scene (Manager, Properties, Transitions), Entity (Editor, Components, Prefabs), Scripting (Events, Variables, State Machine, Triggers), Physics (Collision, Hitbox, Movement, Pathfinding), UI (Textbox, Menu Designer, HUD, Dialog Tree, Fonts), Save System (SRAM Layout, Save Slots, Checksum)
- **Genre** - All 18 game genres (RPG, Action RPG, Platformer, Shooter, Racing, Puzzle, Fighting, Strategy, Simulation, Horror, Visual Novel, Roguelike, MMORPG, Sandbox, Metroidvania, Rhythm, Sports) + RPG Maker Studio submenu (Map Editor, Event Editor, Database with 13 entries, Tileset Config, Character Generator, Playtest)
- **D&D 5e** - Characters, Monsters, Encounters, Items, Spells, World Building, Rules Reference
- **Sorc Tools** - Sprite Tools, Art & Pixel Tools, 3D & Animation, Audio, Utilities
- **Build** - Build Assets/ROM/All, Clean/Rebuild, Build Config, Target Platform (21 platforms by category), Download/Deploy
- **Window** - Layouts, Widget Panels (Left/Right/Bottom toggle), Console, Output Log, Properties
- **Help** - Documentation, Shortcuts, GBDK Reference, Pan Docs, NES Dev Wiki, D&D 5e SRD, About

### Tab Toolbar
Emulator, Tiles, Maps, Strings, Tables, Source, Build tabs + Build ROM button

### Widget Panels (UE5-style, `widgets.js`)
- **Left Panel** (`#widgetLeft`): Outliner (scene tree), Modes (editing modes), World (world settings)
- **Right Panel** (`#widgetRight`): Details (entity properties), Properties (component props), Palette (color palettes)
- **Bottom Panel** (`#widgetBottom`): Content Browser (asset grid), Output Log, Console, Animation Timeline, Event Graph
- Toggle: `window._widgetToggle(pos)`, Tab switch: `window._widgetSwitchTab(pos, tabId)`

### Modal System
- `window.openModal(title, html)` / `window.closeModal()` defined in menus.js
- Used by all GB/NES tools, Game Engine tools, D&D 5e tools, RPG Maker tools
- Features: stat blocks, form editors, reference tables, tool grids, searchable lists

### Tool Integration
- `window.openEngineTool(action)` in tools.js - handles `tool:*` and `engine:*` actions
- `window.openDndTool(action)` in dnd5e.js - handles `dnd:*` actions
- `window.openSorcTool(action)` in sorctools.js - handles `sorc:*` actions
- `window.openDndPixelArt()` in dnd5e-pixelart.js - D&D 5e Pixel Art Studio
- `window.openRPGMakerTool(action)` - handles `rpgmaker:*` actions
- `window.triggerBuild(target)` in app.js - triggers build from menus
- Tab switching: `.ttab[data-panel=X]` elements, `activatePanel()` in menus.js

### IDE Editor (`editor-ide.js`)
- Auto-wraps `textarea.code-editor` elements with IDE features
- Line numbers gutter with current line highlight and fold indicators
- Syntax highlighting overlay (keywords, strings, comments, numbers, functions)
- Minimap (60px canvas with viewport indicator)
- Toolbar: Save, Undo, Redo, Format, Word Wrap, Font Size, Go to Line, cursor position
- Status bar: Ln/Col, line count, word count, char count, tab size, encoding
- Tab key inserts spaces, auto-indent on Enter, bracket matching
- API: `window.IDEEditor.wrapEditor(textarea)` / `.unwrapEditor(textarea)`

## Platform Configuration System

`platformconfig.js` provides `window.PlatformConfig` — a global platform registry supporting 21 targets:

| Category | Platforms |
|----------|-----------|
| Nintendo | GB (DMG), GBC, GBA, NDS, N64, Switch, Switch 2 |
| Sony | PS1, PS2, PS3, PS4, PS5 |
| Microsoft | Xbox, Xbox 360, Xbox One, Xbox Series X\|S |
| PC | Windows, macOS, Linux |
| Mobile | iOS, Android |

API: `PlatformConfig.get()` / `.set(id)` / `.getAll()` / `.getEngineFeatures(id)` / `.getPlatformList()`
Events: `platformChanged` CustomEvent fires on `window` when platform switches.

## Genre Configuration System

`platformconfig.js` also provides `window.GenreConfig` — a global genre registry with 19 genres:

RPG, Platformer, Action, Adventure, Shooter, Racing, Puzzle, Fighting, Strategy, Simulation, Horror, Sports, Rhythm, Visual Novel, Roguelike, MMORPG, Sandbox, Metroidvania, RPG Maker

Each genre has: id, name, description, defaultFeatures[], requiredSystems[], defaultUI{}, templateEntities[]

API: `GenreConfig.get()` / `.set(id)` / `.getAll()`
Events: `genreChanged` CustomEvent fires on `window` when genre switches.

## Script Load Order

1. `glue.js` - Audio context pre-warming
2. Emulator files (base64, resampler, XAudioServer, resize, GameBoyCore, GameBoyIO)
3. `platformconfig.js` - Platform profiles, genre profiles, and state
4. `menus.js` - Menu bar construction and action routing
5. `tools.js` - GB/NES and Game Engine tool modal builders
6. `dnd5e.js` - D&D 5e data, tools, and rules reference builders
7. `dnd5e-pixelart.js` - D&D 5e Pixel Art Studio
8. `sorctools.js` - sorcgcs.com tool modal builders
9. `editor-ide.js` - Text editor IDE enhancements
10. `widgets.js` - UE5-style dockable widget panels
11. `app.js` - Tab switching, emulator controls, editors, build system

## API Endpoints

- `GET /api/tiles` - List tile PNG files
- `GET /api/tilemaps` - List tilemap files
- `GET /api/maps` - List map files
- `GET /api/strings` / `POST /api/strings` - Get/save strings.js
- `GET /api/tables` / `POST /api/tables` - Get/save tables.csv
- `GET /api/src-files` - List source files
- `GET /api/src-file?name=X` / `POST /api/src-file` - Get/save source file
- `GET /api/rom-info` - Get ROM build status
- `POST /api/build` - Trigger build (assets/rom/all)
- `GET /api/tilemap-data?name=X` - Get tilemap binary data
- `POST /api/upload-tile` - Upload modified tile PNG
- `POST /api/upload-rom` - Upload external ROM for emulation

## Keyboard Controls (Emulator)

- Arrow keys or WASD: D-pad
- Z: A button, X: B button
- Enter: Start, Right Shift: Select

## Build System

The workflow auto-downloads GBDK-2020 if needed, then:
1. `npm install` - Install pngjs dependency
2. `make assets` - Convert PNGs to binary, generate string/table C files
3. `make` - Compile ROM with GBDK-2020
4. `node server.js` - Start web server

Output: `LabyrinthOfTheDragon.gbc` (512 KB)

## ROM Specs

- ROM Banks: 32, RAM Banks: 4
- Cart Type: 0x1B (MBC5+RAM+BATTERY)

## Dependencies

- `pngjs` (npm) - PNG processing for asset pipeline
- GBDK-2020 v4.5.0 - Game Boy development kit
- GameBoy-Online - Browser-based GB/GBC emulator

## GitHub

- Remote: https://github.com/ArkansasIo/RPG1test
- Push manually with `git push`
