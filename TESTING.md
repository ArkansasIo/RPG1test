# 🧪 Enchantment Engine - Testing Guide

## Quick Test (Recommended)

Run this first to test all executables interactively:
```bash
.\test_ui.bat
```

This script will:
1. Test test_window.exe (minimal UI test)
2. Test EnchantmentEngine.exe (project manager)
3. Test enchantment_editor.exe (full IDE)
4. Collect your feedback on each
5. Provide troubleshooting suggestions

---

## Automated Testing

Capture debug output from all executables:
```bash
.\capture_debug.bat
```

This will:
1. Run each executable
2. Save console output to text files
3. Display the output for review

Output files created in `bin/`:
- `test_window_output.txt`
- `enchantment_engine_output.txt`
- `enchantment_editor_output.txt`

---

## System Information

Check your system configuration:
```bash
.\system_info.bat
```

This shows:
- Windows version
- System architecture
- Display resolution
- Available memory
- Executable file sizes
- Compiler versions
- CMake version

---

## Manual Testing

### Test 1: Minimal Window Test

```bash
cd bin
.\test_window.exe
```

**Expected Result:**
- Console window appears with debug messages
- GUI window appears (600x400 pixels)
- Window contains:
  - Button labeled "Click Me!"
  - Label with "Hello from Enchantment Engine!"
  - Text drawn on background
  - Light gray background color

**Console Should Show:**
```
=== Enchantment Engine - Window Test ===
Starting window creation...
Window class registered
Window created successfully
Window handle: [non-zero number]
WM_CREATE received
Button created successfully
Label created successfully
Window shown and updated
Entering message loop...
```

**Interactive Test:**
- Click the "Click Me!" button
- Should show message box: "Button clicked!"

**Pass Criteria:**
- ✅ Console appears
- ✅ Window appears
- ✅ Button is visible
- ✅ Label is visible
- ✅ Button responds to clicks

---

### Test 2: Project Manager

```bash
cd bin
.\EnchantmentEngine.exe
```

**Expected Result:**
- Console window with detailed debug output
- GUI window appears (900x600 pixels)
- Window contains:
  - Menu bar with 5 menus
  - Title "Enchantment Engine"
  - Subtitle text
  - Four action buttons
  - Recent projects listbox
  - Preview panel
  - Status bar

**Console Should Show:**
```
ProjectManager::onCreate() called
Window handle: [non-zero number]
Window size: [width]x[height]
Menu bar created
Creating controls in area: [width]x[height]
Title label created: [non-zero handle]
Subtitle label created: [non-zero handle]
Creating buttons with width: [number]
Open button created: [non-zero handle]
New button created: [non-zero handle]
Folder button created: [non-zero handle]
Files button created: [non-zero handle]
Projects label created: [non-zero handle]
Project listbox created: [non-zero handle]
Preview panel created: [non-zero handle]
All controls created successfully
Status bar created
Project list refreshed
Window fully initialized and updated
```

**Interactive Tests:**
1. Click "Open Project" button → Should show folder browser
2. Click "New Project" button → Should show folder browser
3. Click "Open Folder" button → Should show folder browser
4. Click "Open Files" button → Should show file browser
5. Click File menu → Should show menu items
6. Click Help → About → Should show about dialog

**Pass Criteria:**
- ✅ Console appears with all success messages
- ✅ Window appears
- ✅ Menu bar is visible
- ✅ All four buttons are visible with proper labels
- ✅ Listbox is visible
- ✅ Preview panel is visible
- ✅ Status bar is visible
- ✅ Buttons respond to clicks
- ✅ Menus work

---

### Test 3: IDE Editor

```bash
cd bin
.\enchantment_editor.exe
```

**Expected Result:**
- Console window with detailed debug output
- GUI window appears (1280x800 pixels)
- Window contains:
  - Menu bar with 9 menus
  - Toolbar with buttons
  - Large label "Enchantment Engine Editor - Ready"
  - Test button "Click Me - Test Button"
  - Status bar with 4 sections

**Console Should Show:**
```
EditorWindow::onCreate() called
Window handle: [non-zero number]
Window size: [width]x[height]
Menu bar created
Toolbar created
Status bar created
Label created: [non-zero handle]
Test button created: [non-zero handle]
Window fully initialized and updated
```

**Interactive Tests:**
1. Click test button → Should show "Test button clicked! UI is working!"
2. Click File menu → Should show menu items
3. Click Edit menu → Should show menu items
4. Click Build menu → Should show menu items
5. Click Help → About → Should show about dialog
6. Try File → Open → Should show file browser

**Pass Criteria:**
- ✅ Console appears with all success messages
- ✅ Window appears
- ✅ Menu bar with 9 menus is visible
- ✅ Toolbar is visible
- ✅ Label is visible
- ✅ Test button is visible
- ✅ Status bar is visible
- ✅ Test button responds with message
- ✅ All menus work

---

## Interpreting Results

### All Tests Pass ✅
**Status:** Everything is working correctly!
**Next Steps:**
- Start using the IDE
- Create or open a project
- Begin development

### Test 1 Passes, Others Fail ❌
**Status:** Windows API works, but main apps have issues
**Diagnosis:** Problem in application code
**Action:**
1. Check console output for specific failures
2. Note which controls failed to create
3. Report error codes shown

### Test 1 Fails ❌
**Status:** System-level issue
**Diagnosis:** Windows API or system problem
**Action:**
1. Check Windows version (must be Windows 7+)
2. Update graphics drivers
3. Check display settings
4. Try running as Administrator
5. Check antivirus isn't blocking

### Window Appears But Blank ⚠️
**Status:** Rendering issue
**Diagnosis:** Controls created but not visible
**Action:**
1. Check console for all "created: [handle]" messages
2. Verify all handles are non-zero
3. Check display scaling (set to 100%)
4. Try different monitor if available
5. Update graphics drivers

---

## Debug Output Analysis

### Good Console Output Example:
```
Window handle: 0x00120ABC
Window size: 900x600
Title label created: 0x00130DEF
Open button created: 0x00140GHI
```
All handles are non-zero = Success ✅

### Bad Console Output Example:
```
Window handle: 0x00120ABC
Window size: 900x600
Title label created: 0x00000000
Title label FAILED: 1400
```
Zero handle + error code = Failure ❌

### What to Look For:
- ✅ All "created: " messages show non-zero handles
- ✅ "Window fully initialized and updated" appears
- ✅ No "FAILED: " messages
- ❌ Any zero (0x00000000) handles
- ❌ Any "FAILED: " messages with error codes
- ❌ Missing expected messages

---

## Common Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 0 | Success | No action needed |
| 6 | Invalid handle | Check window creation |
| 87 | Invalid parameter | Check function parameters |
| 1400 | Invalid window handle | Window not created properly |
| 1407 | Cannot find window class | Class not registered |
| 1413 | Invalid index | Check array bounds |

---

## Performance Testing

### Startup Time
- test_window.exe: < 1 second
- EnchantmentEngine.exe: < 2 seconds
- enchantment_editor.exe: < 3 seconds

If startup takes longer, check:
- Antivirus scanning
- Disk performance
- Available memory

### Memory Usage
- test_window.exe: ~5 MB
- EnchantmentEngine.exe: ~20 MB
- enchantment_editor.exe: ~30 MB

Check Task Manager if memory usage is significantly higher.

---

## Regression Testing

After making code changes, run full test suite:

```bash
# 1. Rebuild all
.\build_all.bat

# 2. Run tests
.\test_ui.bat

# 3. Capture output
.\capture_debug.bat

# 4. Compare with previous output
```

---

## Continuous Integration

For automated testing:

```bash
# Build
cmake --build . --config Release

# Test (non-interactive)
test_window.exe > test_output.txt 2>&1

# Check exit code
if %errorlevel% neq 0 (
    echo Test failed
    exit /b 1
)
```

---

## Test Coverage

### Current Coverage:
- ✅ Window creation
- ✅ Control creation (buttons, labels, listboxes)
- ✅ Menu bar creation
- ✅ Event handling (button clicks)
- ✅ Dialog boxes
- ✅ Status bar
- ✅ Toolbar
- ✅ Font rendering

### Not Yet Tested:
- ⏳ Code editor functionality
- ⏳ Asset processing
- ⏳ Build system integration
- ⏳ Emulator integration
- ⏳ File operations
- ⏳ Project management

---

## Reporting Test Results

When reporting issues, include:

1. **Test Results:**
   - Which tests passed/failed
   - Specific symptoms observed

2. **Console Output:**
   - Complete output from capture_debug.bat
   - Or screenshots of console

3. **System Info:**
   - Output from system_info.bat
   - Windows version
   - Display settings

4. **Screenshots:**
   - What you see (or don't see)
   - Any error dialogs

5. **Steps to Reproduce:**
   - Exact commands run
   - Order of operations
   - Any specific conditions

---

## Next Steps After Testing

### If All Tests Pass:
1. Read the main README.md
2. Check out EDITOR_FEATURES.md
3. Review API_REFERENCE.md
4. Start creating your game!

### If Tests Fail:
1. Review TROUBLESHOOTING.md
2. Check console output carefully
3. Try suggested solutions
4. Report issue with diagnostic info

---

**Happy Testing!** 🎮

For more help, see:
- TROUBLESHOOTING.md - Detailed troubleshooting guide
- BUILD_STATUS.md - Build information and status
- README.md - Main documentation
