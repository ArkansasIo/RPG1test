# Enchantment Engine - Quick Reference Guide

## Project Manager Options

### 📁 Open Existing Project
**What:** Opens a complete project with structure
**When:** Working on an existing game project
**Result:** Full project loaded with all files

### ✨ Create New Project
**What:** Creates new project with folder structure
**When:** Starting a new game from scratch
**Result:** New project with src/, assets/, Makefile

### 📂 Open Folder
**What:** Opens any folder as workspace
**When:** Quick browsing or no project structure
**Result:** Folder contents accessible

### 📄 Open File(s)
**What:** Opens specific files directly
**When:** Editing specific files only
**Result:** Selected files open in tabs
**Tip:** Hold Ctrl to select multiple files

### 📂 Recent Projects
**What:** Quick access to last 5 projects
**When:** Returning to recent work
**Result:** Instant project loading

### ⚙️ Settings
**What:** View configuration and options
**When:** Checking settings or getting help
**Result:** Information dialog

## Quick Start

### New Game
```
1. Run bin/EnchantmentEngine.exe
2. Click "✨ Create New Project"
3. Choose location and name
4. Start coding!
```

### Existing Game
```
1. Run bin/EnchantmentEngine.exe
2. Click "📁 Open Existing Project"
3. Select project folder
4. Continue development
```

### Quick Edit
```
1. Run bin/EnchantmentEngine.exe
2. Click "📄 Open File(s)"
3. Select file(s) with Ctrl+Click
4. Edit and save
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Enter | Confirm selection |
| Escape | Cancel |
| Tab | Navigate buttons |
| Space | Activate button |
| Ctrl+Click | Select multiple files |

## File Types Supported

- ✅ C Files (*.c)
- ✅ Header Files (*.h)
- ✅ C++ Files (*.cpp)
- ✅ JavaScript Files (*.js)
- ✅ All Files (*.*)

## Command Line

```bash
# Default
EnchantmentEngine.exe

# Custom port
EnchantmentEngine.exe --port 9000

# Specific project
EnchantmentEngine.exe --project "C:\MyGame"

# Both
EnchantmentEngine.exe --port 9000 --project "C:\MyGame"
```

## Configuration File

Create `enchantment.conf`:
```ini
port=8080
project=.
```

## Recent Projects

Stored in `enchantment_recent.txt`:
```
C:\GameDev\Project1
C:\GameDev\Project2
C:\GameDev\Project3
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't find project | Check Recent Projects list |
| Files won't open | Check file permissions |
| Port in use | Use --port option |
| Settings not saving | Edit enchantment.conf |

## Tips

💡 **Tip 1:** Use Recent Projects for quick access
💡 **Tip 2:** Hold Ctrl to select multiple files
💡 **Tip 3:** Use Open Folder for quick browsing
💡 **Tip 4:** Command line skips Project Manager
💡 **Tip 5:** Check Settings for configuration info

## Documentation

- 📖 [README.md](README.md) - Main docs
- 📖 [QUICKSTART.md](QUICKSTART.md) - Getting started
- 📖 [PROJECT_MANAGER_FEATURES.md](PROJECT_MANAGER_FEATURES.md) - Complete guide
- 📖 [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Structure guide

## Version

**Current:** 3.0.1
**Executable:** bin/EnchantmentEngine.exe
**Size:** 450.5 KB

---

**Need help?** Read the full documentation or check Settings dialog!
