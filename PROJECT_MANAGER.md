# Project Manager

## Overview

The Enchantment Engine now includes a built-in Project Manager that appears after the splash screen and before the editor opens. This allows you to easily manage multiple Game Boy Color projects.

## Features

### 1. Open Existing Project
- Browse and select an existing project folder
- Automatically loads all project files
- Validates project structure

### 2. Create New Project
- Browse and select a folder for your new project
- Automatically creates project structure:
  - `src/` - Source code files
  - `assets/` - Graphics, sounds, and data
  - `build/` - Compiled output
  - `Makefile` - Build configuration

### 3. Recent Projects
- Shows up to 5 most recently opened projects
- Quick access with one click
- Automatically removes projects that no longer exist
- Persisted between sessions

### 4. Project Validation
- Checks if selected folders exist
- Warns if recent projects are missing
- Ensures proper project structure

## User Interface

```
┌─────────────────────────────────────────────┐
│   Enchantment Engine - Project Manager     │
├─────────────────────────────────────────────┤
│                                             │
│        Select or Create a Project          │
│                                             │
│   Choose an existing project folder or     │
│   create a new one to get started.         │
│                                             │
│   ┌───────────────────────────────────┐   │
│   │  📁 Open Existing Project         │   │
│   └───────────────────────────────────┘   │
│                                             │
│   ┌───────────────────────────────────┐   │
│   │  ✨ Create New Project            │   │
│   └───────────────────────────────────┘   │
│                                             │
│   Recent Projects:                         │
│   ┌───────────────────────────────────┐   │
│   │  📂 My Game Project               │   │
│   └───────────────────────────────────┘   │
│   ┌───────────────────────────────────┐   │
│   │  📂 RPG Adventure                 │   │
│   └───────────────────────────────────┘   │
│                                             │
│                          [Cancel]          │
└─────────────────────────────────────────────┘
```

## Workflow

### First Launch
1. Application shows splash screen
2. Project Manager appears
3. User selects "Create New Project"
4. Browses to desired location
5. Project structure is created
6. Editor opens with new project

### Subsequent Launches
1. Application shows splash screen
2. Project Manager appears with recent projects
3. User clicks on recent project
4. Editor opens immediately

### Opening Different Project
1. Close current editor
2. Restart application
3. Select different project from recent list
4. Or browse for another project

## Recent Projects Storage

Recent projects are stored in `enchantment_recent.txt` in the application directory:

```
C:\Users\YourName\Projects\MyGame
C:\Users\YourName\Projects\RPGAdventure
D:\GameDev\PlatformerGame
```

Format: One project path per line, most recent first.

## Project Structure

When creating a new project, the following structure is generated:

```
MyGameProject/
├── src/                    # C source files
│   ├── main.c
│   └── ...
├── assets/                 # Game assets
│   ├── tiles/             # Graphics
│   ├── maps/              # Level data
│   └── strings.js         # Text data
├── build/                  # Compiled output
│   └── *.o               # Object files
├── Makefile               # Build configuration
└── MyGameProject.gbc      # Final ROM (after build)
```

## Command Line Override

You can bypass the Project Manager by specifying a project path on the command line:

```bash
EnchantmentEngine.exe --project "C:\MyGame"
```

This will:
- Skip the Project Manager dialog
- Load the specified project directly
- Still show the splash screen

## Keyboard Shortcuts

- `Enter` - Confirm selection (when project is selected)
- `Escape` - Cancel and exit application
- `Tab` - Navigate between buttons
- `Space` - Activate focused button

## Technical Details

### Windows Implementation
- Native Win32 dialog
- Uses `SHBrowseForFolder` for folder selection
- Gradient background with GDI
- Segoe UI font for modern appearance
- Modal dialog (blocks until selection made)

### Linux/macOS Implementation
- Falls back to current directory
- Can be extended with GTK or Qt dialogs
- Command line arguments recommended

### File Operations
- Uses C++17 filesystem library
- Cross-platform path handling
- Automatic directory creation
- Safe file I/O with error handling

## Error Handling

### Project Not Found
If a recent project no longer exists:
- Warning dialog appears
- Project is not opened
- User can select another project
- Missing project remains in recent list (for reference)

### Invalid Project Path
If selected path is invalid:
- Error dialog appears
- User returns to Project Manager
- Can try again or cancel

### Creation Failure
If new project creation fails:
- Error dialog with details
- User returns to Project Manager
- Can try different location

## Future Enhancements

Planned features for future versions:

1. **Project Templates**
   - RPG template
   - Platformer template
   - Puzzle game template
   - Blank template

2. **Project Properties**
   - Edit project name
   - Set project description
   - Configure build settings
   - Manage dependencies

3. **Project Import**
   - Import from ZIP
   - Import from Git repository
   - Import from other engines

4. **Project Export**
   - Export to ZIP
   - Export to GitHub
   - Share project settings

5. **Project Search**
   - Search recent projects
   - Filter by name
   - Sort by date/name

## Tips

1. **Organize Your Projects**: Keep all Game Boy projects in one parent folder for easy access
2. **Use Descriptive Names**: Name projects clearly (e.g., "PlatformerGame" not "Game1")
3. **Backup Regularly**: Recent projects list doesn't replace proper backups
4. **Clean Up**: Remove old projects from recent list by deleting them from `enchantment_recent.txt`
5. **Version Control**: Use Git for your projects - the Project Manager works great with Git repos

## Troubleshooting

### Project Manager Doesn't Appear
- Check if `--project` argument was passed
- Verify application has UI permissions
- Try running as administrator (Windows)

### Recent Projects Not Saving
- Check write permissions in application directory
- Verify `enchantment_recent.txt` is not read-only
- Check disk space

### Can't Browse for Folders
- Verify shell32.dll is available (Windows)
- Check file system permissions
- Try running with elevated privileges

### Project Structure Not Created
- Check write permissions in target directory
- Verify disk space available
- Check for path length limits (Windows: 260 chars)

## See Also

- [README.md](README.md) - Main documentation
- [UNIFIED_BUILD.md](UNIFIED_BUILD.md) - Build system details
- [GAME_ENGINE_DESIGN.md](GAME_ENGINE_DESIGN.md) - Engine architecture
