# 🎯 Enchantment Engine - Quick Reference

## Testing (Start Here!)

```bash
# Interactive test - RECOMMENDED
.\test_ui.bat

# Capture debug output
.\capture_debug.bat

# System information
.\system_info.bat
```

## Running Applications

```bash
cd bin

# Project Manager
.\EnchantmentEngine.exe

# IDE Editor
.\enchantment_editor.exe

# Minimal Test
.\test_window.exe
```

## Expected Behavior

### test_window.exe ✅
- Console with debug messages
- Window with button and label
- Button responds to clicks

### EnchantmentEngine.exe ✅
- Console with detailed output
- Window with menu bar
- Four buttons (Open Project, New Project, Open Folder, Open Files)
- Recent projects list
- Preview panel
- Status bar

### enchantment_editor.exe ✅
- Console with detailed output
- Window with 9 menus
- Toolbar
- Test button
- Status bar

## Troubleshooting Quick Guide

### White/Blank Screen?

1. **Run test_window.exe first**
   - Works? → Application issue
   - Fails? → System issue

2. **Check console output**
   - Look for "FAILED: [error]"
   - Look for zero (0x00000000) handles
   - All handles should be non-zero

3. **Common fixes:**
   - Set display scaling to 100%
   - Update graphics drivers
   - Run as Administrator
   - Check antivirus

### No Console?

- Antivirus blocking
- SmartScreen blocking
- Run as Administrator
- Check executable exists

### Console But No Window?

- Check for "CreateWindow failed: [error]"
- Note the error code
- See TROUBLESHOOTING.md

## Error Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 6 | Invalid handle |
| 1400 | Invalid window handle |
| 1407 | Window class not found |

## Documentation

- **TESTING.md** - Complete testing guide
- **TROUBLESHOOTING.md** - Detailed solutions
- **BUILD_STATUS.md** - Build information
- **README.md** - Main documentation
- **UI_FIX_SUMMARY.md** - Recent changes

## Command Line Options

```bash
# EnchantmentEngine.exe
.\EnchantmentEngine.exe --port 8080 --project "../examples/LabyrinthOfTheDragon"

# enchantment_editor.exe
.\enchantment_editor.exe --project "../examples/LabyrinthOfTheDragon" --server "http://localhost:8080"
```

## Build Commands

```bash
# Unified Application
cd "src/unified/build"
cmake --build . --config Release
copy enchantment_engine.exe ../../../bin/EnchantmentEngine.exe

# Editor
cd "src/editor/build"
cmake --build . --config Release

# Test Window
clang++ -o bin/test_window.exe test_window.cpp -lgdi32 -luser32 -lkernel32 -mwindows
```

## File Locations

```
Enchantment Engine/
├── bin/                          # Executables
│   ├── EnchantmentEngine.exe     # Project Manager (464 KB)
│   ├── enchantment_editor.exe    # IDE Editor (230.5 KB)
│   └── test_window.exe           # Test App (88 KB)
├── src/                          # Source code
│   ├── unified/                  # Project Manager source
│   ├── editor/                   # Editor source
│   └── server/                   # Server source
├── examples/                     # Example projects
│   └── LabyrinthOfTheDragon/     # Example game
├── test_ui.bat                   # Interactive test
├── capture_debug.bat             # Debug capture
├── system_info.bat               # System info
├── TESTING.md                    # Testing guide
├── TROUBLESHOOTING.md            # Troubleshooting
└── README.md                     # Main docs
```

## Keyboard Shortcuts (Editor)

### File
- Ctrl+N - New File
- Ctrl+O - Open File
- Ctrl+S - Save File
- Ctrl+W - Close File

### Edit
- Ctrl+Z - Undo
- Ctrl+Y - Redo
- Ctrl+X - Cut
- Ctrl+C - Copy
- Ctrl+V - Paste
- Ctrl+F - Find
- Ctrl+H - Replace
- Ctrl+G - Go to Line

### Build
- F7 - Build Project
- Ctrl+B - Build ROM

### Debug
- F5 - Start Debugging
- F9 - Toggle Breakpoint
- F10 - Step Over
- F11 - Step Into

## Getting Help

1. Check TESTING.md
2. Check TROUBLESHOOTING.md
3. Run test_ui.bat
4. Run capture_debug.bat
5. Report issue with output files

## Quick Diagnostics

```bash
# Check if executables exist
dir bin\*.exe

# Check Windows version
winver

# Check system info
systeminfo | findstr /C:"OS Name" /C:"OS Version"

# Check display resolution
wmic path Win32_VideoController get CurrentHorizontalResolution,CurrentVerticalResolution
```

## Success Checklist

- [ ] test_window.exe shows button
- [ ] Button responds to clicks
- [ ] EnchantmentEngine.exe shows menu bar
- [ ] All four buttons visible
- [ ] Buttons respond to clicks
- [ ] enchantment_editor.exe shows menus
- [ ] Test button works
- [ ] Console shows all controls created

## Support

**GitHub:** https://github.com/ArkansasIo/RPG1test
**Issues:** Report with console output and screenshots
**Version:** 3.0.0 (March 1, 2026)

---

**TIP:** Always run test_ui.bat first to identify issues quickly!
