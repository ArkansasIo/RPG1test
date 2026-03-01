# Project Manager - Complete Feature Guide

## Overview

The Enchantment Engine Project Manager now includes comprehensive options for opening projects, folders, and individual files.

## Features

### 1. 📁 Open Existing Project
Opens a complete project folder with all its files and structure.

**Use Case:**
- Opening a previously created Game Boy Color project
- Loading a project with Makefile and build configuration
- Working with a complete game project

**How it Works:**
1. Click "📁 Open Existing Project"
2. Browse to your project folder
3. Select the folder
4. Project loads with all files accessible

### 2. ✨ Create New Project
Creates a new project with automatic folder structure.

**Use Case:**
- Starting a new Game Boy Color game
- Creating a fresh project from scratch
- Setting up a new development workspace

**How it Works:**
1. Click "✨ Create New Project"
2. Browse to where you want to create the project
3. Create a new folder (or select existing empty folder)
4. Project structure is automatically created:
   ```
   YourProject/
   ├── src/          # Source code
   ├── assets/       # Graphics and data
   ├── build/        # Build output
   └── Makefile      # Build configuration
   ```

### 3. 📂 Open Folder
Opens any folder as a workspace without project structure requirements.

**Use Case:**
- Opening a folder with source files
- Working with files without a formal project structure
- Quick access to any directory

**How it Works:**
1. Click "📂 Open Folder"
2. Browse to any folder
3. Select the folder
4. All files in the folder become accessible

**Difference from "Open Existing Project":**
- No project structure required
- No Makefile needed
- Just opens the folder as-is
- Great for quick edits or exploring code

### 4. 📄 Open File(s)
Opens specific files directly in the editor.

**Use Case:**
- Editing a single C file
- Opening multiple related files
- Quick file access without loading entire project

**How it Works:**
1. Click "📄 Open File(s)"
2. Browse to file location
3. Select one or multiple files (Ctrl+Click for multiple)
4. Files open in editor
5. Parent folder becomes the workspace

**Supported File Types:**
- C Files (*.c)
- Header Files (*.h)
- C++ Files (*.cpp)
- JavaScript Files (*.js)
- All Files (*.*)

**Multi-Select:**
- Hold Ctrl and click to select multiple files
- All selected files open in separate tabs
- Parent directory becomes the project path

### 5. 📂 Recent Projects
Quick access to your 5 most recently opened projects.

**Features:**
- Automatically tracks opened projects
- Persists between sessions
- Shows project names
- One-click access
- Validates project still exists

**Storage:**
- Saved in `enchantment_recent.txt`
- One project path per line
- Most recent first
- Automatically updated

### 6. ⚙️ Settings
View and configure application settings.

**Current Settings Display:**
- Recent projects file location
- Configuration file location
- Default port (8080)
- Default project path
- Command line options

**Configuration Options:**
```ini
# enchantment.conf
port=8080
project=.
```

**Command Line Options:**
```bash
EnchantmentEngine.exe --port 9000 --project "C:\MyGame"
```

## User Interface

```
┌─────────────────────────────────────────────────────┐
│        Enchantment Engine - Project Manager        │
├─────────────────────────────────────────────────────┤
│                                                     │
│          Select or Create a Project                │
│                                                     │
│   Choose an existing project folder or create      │
│   a new one to get started.                        │
│                                                     │
│   ┌──────────────────┐  ┌──────────────────┐     │
│   │ 📁 Open Existing │  │ ✨ Create New    │     │
│   │    Project       │  │    Project       │     │
│   └──────────────────┘  └──────────────────┘     │
│                                                     │
│   ┌──────────────────┐  ┌──────────────────┐     │
│   │ 📂 Open Folder   │  │ 📄 Open File(s)  │     │
│   └──────────────────┘  └──────────────────┘     │
│                                                     │
│   Recent Projects:                                 │
│   ┌───────────────────────────────────────────┐  │
│   │  📂 My Game Project                       │  │
│   └───────────────────────────────────────────┘  │
│   ┌───────────────────────────────────────────┐  │
│   │  📂 RPG Adventure                         │  │
│   └───────────────────────────────────────────┘  │
│                                                     │
│   [⚙️ Settings]                      [Cancel]     │
└─────────────────────────────────────────────────────┘
```

## Workflows

### Workflow 1: Starting a New Game
1. Launch `bin/EnchantmentEngine.exe`
2. Click "✨ Create New Project"
3. Browse to `C:\GameDev\`
4. Create folder "MyNewGame"
5. Select folder
6. Project structure created automatically
7. IDE opens with empty project
8. Start coding!

### Workflow 2: Opening Existing Game
1. Launch `bin/EnchantmentEngine.exe`
2. Click "📁 Open Existing Project"
3. Browse to `C:\GameDev\MyGame`
4. Select folder
5. IDE opens with all project files
6. Continue development

### Workflow 3: Quick File Edit
1. Launch `bin/EnchantmentEngine.exe`
2. Click "📄 Open File(s)"
3. Browse to `C:\GameDev\MyGame\src\`
4. Select `main.c` (or multiple files with Ctrl)
5. Files open in editor
6. Make changes and save
7. Close when done

### Workflow 4: Exploring Code
1. Launch `bin/EnchantmentEngine.exe`
2. Click "📂 Open Folder"
3. Browse to any folder with code
4. Select folder
5. Browse files in IDE
6. No project structure needed

### Workflow 5: Recent Project
1. Launch `bin/EnchantmentEngine.exe`
2. Click on recent project from list
3. IDE opens immediately
4. Continue where you left off

## Technical Details

### Project Structure Detection
When opening a folder, the engine checks for:
- `Makefile` - Build configuration
- `src/` directory - Source code
- `assets/` directory - Game assets
- `.gbc` files - Compiled ROMs

If found, treats as full project. Otherwise, treats as simple folder.

### File Selection
- Uses Windows `OPENFILENAME` dialog
- Supports multi-select with `OFN_ALLOWMULTISELECT`
- Filters by file type
- Returns array of selected files

### Recent Projects
- Stored in `enchantment_recent.txt`
- Format: One path per line
- Maximum 5 entries
- Validates existence before display
- Automatically removes missing projects

### Project Info Structure
```cpp
struct ProjectInfo {
    std::string path;              // Project directory
    std::string name;              // Project name
    bool isNew;                    // Created or existing
    std::vector<std::string> selectedFiles;  // Files to open
};
```

## Keyboard Shortcuts

- `Enter` - Confirm selection
- `Escape` - Cancel and exit
- `Tab` - Navigate between buttons
- `Space` - Activate focused button
- `Alt+O` - Open Existing Project
- `Alt+N` - Create New Project
- `Alt+F` - Open Folder
- `Alt+I` - Open File(s)
- `Alt+S` - Settings

## Tips and Tricks

### Tip 1: Quick Access
Add frequently used projects to Windows Quick Access for faster browsing.

### Tip 2: Multiple Files
When opening files, select all related files at once (Ctrl+Click) to open them all in tabs.

### Tip 3: Folder vs Project
- Use "Open Folder" for quick exploration
- Use "Open Existing Project" for full development

### Tip 4: Recent Projects
Recent projects list is your friend - use it to quickly switch between active projects.

### Tip 5: Command Line
For automation, use command line to skip Project Manager:
```bash
EnchantmentEngine.exe --project "C:\MyGame"
```

## Troubleshooting

### Issue: Can't See My Project
**Solution:** Make sure you're browsing to the correct directory. Check Recent Projects list.

### Issue: Files Won't Open
**Solution:** Ensure files aren't locked by another program. Check file permissions.

### Issue: Recent Projects Empty
**Solution:** `enchantment_recent.txt` may be missing. It will be created automatically when you open a project.

### Issue: Settings Button Does Nothing
**Solution:** Settings button shows information dialog. To change settings, edit `enchantment.conf` or use command line.

### Issue: Multiple Files Not Opening
**Solution:** Make sure to hold Ctrl while clicking files in the file dialog.

## Advanced Usage

### Custom Project Templates
Create template folders with pre-configured structure:
```
Templates/
├── RPG_Template/
│   ├── src/
│   ├── assets/
│   └── Makefile
└── Platformer_Template/
    ├── src/
    ├── assets/
    └── Makefile
```

Then use "Open Existing Project" to load templates.

### Batch File Opening
Create a batch file to open specific files:
```batch
@echo off
EnchantmentEngine.exe --project "C:\MyGame"
```

### Project Organization
Organize projects by type:
```
C:\GameDev\
├── RPGs/
│   ├── Project1/
│   └── Project2/
├── Platformers/
│   ├── Project3/
│   └── Project4/
└── Puzzles/
    └── Project5/
```

## Future Enhancements

Planned features for future versions:

1. **Project Templates**
   - Built-in templates for different game types
   - Custom template creation
   - Template marketplace

2. **Workspace Management**
   - Multiple projects in one workspace
   - Project groups
   - Workspace switching

3. **File Filters**
   - Filter files by type
   - Search within project
   - Quick file navigation

4. **Project Properties**
   - Edit project metadata
   - Configure build settings
   - Manage dependencies

5. **Git Integration**
   - Clone from repository
   - Show Git status
   - Commit from IDE

## See Also

- [PROJECT_MANAGER.md](PROJECT_MANAGER.md) - Basic project manager guide
- [QUICKSTART.md](QUICKSTART.md) - Getting started guide
- [README.md](README.md) - Main documentation
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Project structure guide

---

**Version:** 3.0.1
**Last Updated:** March 1, 2026
**Status:** Complete ✅
