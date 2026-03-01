# 🔧 Enchantment Engine - Troubleshooting Guide

## Quick Start Testing

### Step 1: Run the Test Suite
```bash
.\test_ui.bat
```
This interactive script will guide you through testing all three executables.

### Step 2: Capture Debug Output
```bash
.\capture_debug.bat
```
This will save console output to files for detailed analysis.

---

## Understanding the Test Applications

### test_window.exe (88 KB)
**Purpose:** Minimal Windows API test
**What it should show:**
- Console window with debug messages
- GUI window (600x400) with:
  - "Click Me!" button
  - "Hello from Enchantment Engine!" label
  - Text drawn directly on window background
  - Light gray background

**Console Output Should Include:**
```
=== Enchantment Engine - Window Test ===
Starting window creation...
Window class registered
Window created successfully
Window handle: [valid handle]
WM_CREATE received
Button created successfully
Label created successfully
Window shown and updated
Entering message loop...
```

**If this works:** Windows API is functioning correctly
**If this fails:** System-level issue (see System Issues section)

---

### EnchantmentEngine.exe (464 KB)
**Purpose:** Project Manager with integrated server
**What it should show:**
- Console window with detailed debug output
- GUI window (900x600) with:
  - Menu bar (File, Edit, View, Tools, Help)
  - Title: "Enchantment Engine"
  - Subtitle: "Select a project to open or create a new one"
  - Four buttons: "Open Project", "New Project", "Open Folder", "Open Files"
  - Recent projects listbox
  - Preview panel
  - Status bar at bottom

**Console Output Should Include:**
```
ProjectManager::onCreate() called
Window handle: [valid handle]
Window size: [width]x[height]
Menu bar created
Creating controls in area: [width]x[height]
Title label created: [handle]
Subtitle label created: [handle]
Creating buttons with width: [width]
Open button created: [handle]
New button created: [handle]
Folder button created: [handle]
Files button created: [handle]
Projects label created: [handle]
Project listbox created: [handle]
Preview panel created: [handle]
All controls created successfully
Status bar created
Project list refreshed
Window fully initialized and updated
```

**All handles should be non-zero values**

---

### enchantment_editor.exe (230.5 KB)
**Purpose:** Full IDE with code editor
**What it should show:**
- Console window with detailed debug output
- GUI window (1280x800) with:
  - Menu bar (File, Edit, View, Project, Build, Debug, Tools, Window, Help)
  - Toolbar with quick action buttons
  - Large label: "Enchantment Engine Editor - Ready"
  - Test button: "Click Me - Test Button"
  - Status bar with multiple sections

**Console Output Should Include:**
```
EditorWindow::onCreate() called
Window handle: [valid handle]
Window size: [width]x[height]
Menu bar created
Toolbar created
Status bar created
Label created: [handle]
Test button created: [handle]
Window fully initialized and updated
```

**Clicking the test button should show:** "Test button clicked! UI is working!"

---

## Diagnostic Checklist

### ✅ Success Indicators

**test_window.exe:**
- [ ] Console appears with messages
- [ ] GUI window appears
- [ ] Button is visible and clickable
- [ ] Label text is visible
- [ ] Background is light gray
- [ ] Clicking button shows message box

**EnchantmentEngine.exe:**
- [ ] Console appears with messages
- [ ] GUI window appears
- [ ] Menu bar is visible
- [ ] All four buttons are visible
- [ ] Buttons have proper labels
- [ ] Listbox is visible
- [ ] Preview panel is visible
- [ ] Status bar is visible
- [ ] Clicking buttons works

**enchantment_editor.exe:**
- [ ] Console appears with messages
- [ ] GUI window appears
- [ ] Menu bar with 9 menus is visible
- [ ] Toolbar is visible
- [ ] Label is visible
- [ ] Test button is visible
- [ ] Status bar is visible
- [ ] Clicking test button shows message

---

## Common Issues and Solutions

### Issue 1: No Console Window Appears

**Symptoms:**
- Double-clicking executable does nothing
- No window appears at all
- No error messages

**Possible Causes:**
1. Antivirus blocking execution
2. Windows SmartScreen blocking
3. Executable corrupted
4. Missing dependencies

**Solutions:**
1. Check Windows Defender/Antivirus logs
2. Right-click executable → Properties → Unblock
3. Run as Administrator
4. Rebuild from source
5. Check for missing DLL files

---

### Issue 2: Console Appears But No GUI Window

**Symptoms:**
- Console window shows up
- Debug messages appear
- No GUI window appears
- Console may show error codes

**Check Console For:**
- "CreateWindow failed: [error code]"
- "RegisterClass failed: [error code]"
- Window handle showing as 0 or NULL

**Common Error Codes:**
- 1407: Invalid window class
- 1400: Invalid window handle
- 6: Invalid handle

**Solutions:**
1. Check if window class registration succeeded
2. Verify window creation parameters
3. Check for conflicting window classes
4. Try running in Windows 7 compatibility mode

---

### Issue 3: Window Appears But Is Completely White/Blank

**Symptoms:**
- GUI window appears
- Window is completely white
- No controls visible
- Console shows successful creation

**Check Console For:**
- All "created: [handle]" messages should show valid handles
- Look for any "FAILED: [error]" messages
- Verify "Window fully initialized and updated" appears

**If All Handles Are Valid:**
This indicates controls were created but aren't rendering.

**Possible Causes:**
1. Z-order issue (controls behind window)
2. Painting not occurring
3. Controls positioned outside visible area
4. Display scaling issues

**Solutions:**
1. Check display scaling (should be 100%)
2. Try different screen resolution
3. Update graphics drivers
4. Check for Windows updates
5. Try on different monitor if available

**If Some Handles Are 0 or Show FAILED:**
Specific controls failed to create.

**Solutions:**
1. Note which control failed
2. Check the error code shown
3. Report the specific control and error code

---

### Issue 4: Window Appears But Some Controls Missing

**Symptoms:**
- Window appears
- Some controls visible
- Other controls missing
- Console shows mixed success/failure

**Action:**
1. Check console output
2. Identify which controls failed (error code shown)
3. Common issues:
   - Font creation failure
   - Control class not registered
   - Invalid parent window
   - Insufficient resources

---

### Issue 5: Controls Visible But Not Responding

**Symptoms:**
- Window and controls appear
- Clicking does nothing
- No response to interaction

**Check:**
1. Are controls enabled? (should not be grayed out)
2. Does console show click events?
3. Is window focused?

**Solutions:**
1. Click on window to ensure focus
2. Check if WM_COMMAND messages are being received
3. Verify button IDs are correct

---

## Error Code Reference

### Common Windows Error Codes

**0 (ERROR_SUCCESS):** Operation successful
**6 (ERROR_INVALID_HANDLE):** Invalid handle
**87 (ERROR_INVALID_PARAMETER):** Invalid parameter
**1400 (ERROR_INVALID_WINDOW_HANDLE):** Invalid window handle
**1407 (ERROR_CANNOT_FIND_WND_CLASS):** Cannot find window class
**1413 (ERROR_INVALID_INDEX):** Invalid index

### How to Look Up Error Codes

1. Note the error code from console
2. Search for "Windows error code [number]"
3. Or use: `net helpmsg [error_code]` in command prompt

---

## System Requirements Check

### Minimum Requirements:
- Windows 7 or later
- 2 GB RAM
- 100 MB disk space
- DirectX 9 compatible graphics

### Verify Your System:
```bash
# Check Windows version
winver

# Check system info
systeminfo

# Check graphics driver
dxdiag
```

---

## Advanced Debugging

### Enable Verbose Logging

All executables now have console output enabled by default.

### Check Event Viewer

1. Open Event Viewer (eventvwr.msc)
2. Navigate to Windows Logs → Application
3. Look for errors related to the executables
4. Note any crash dumps or error codes

### Dependency Walker

1. Download Dependency Walker (depends.exe)
2. Open the executable in Dependency Walker
3. Check for missing DLLs
4. Verify all dependencies are present

### Process Monitor

1. Download Process Monitor (procmon.exe)
2. Run Process Monitor
3. Start the executable
4. Filter by process name
5. Look for access denied or file not found errors

---

## Reporting Issues

When reporting issues, please include:

1. **Which executable** has the problem
2. **Complete console output** (use capture_debug.bat)
3. **What you see** (or don't see)
4. **Windows version** (run `winver`)
5. **Display settings** (resolution, scaling)
6. **Any error codes** from console
7. **Screenshots** if possible

### Console Output Files

After running `capture_debug.bat`, attach these files:
- `bin/test_window_output.txt`
- `bin/enchantment_engine_output.txt`
- `bin/enchantment_editor_output.txt`

---

## Known Issues

### Issue: Emoji Characters Not Rendering
**Status:** Fixed
**Solution:** Removed emoji characters from UI text

### Issue: White Screen on Launch
**Status:** Under investigation
**Workaround:** Enhanced debug output added to identify cause

---

## Getting Help

1. **Check this guide first**
2. **Run test_ui.bat** to identify which component fails
3. **Run capture_debug.bat** to collect diagnostic info
4. **Check GitHub Issues** for similar problems
5. **Create new issue** with diagnostic info

---

## Success Criteria

You'll know everything is working when:

1. **test_window.exe:**
   - Shows console with success messages
   - Shows window with visible button
   - Button responds to clicks with message box

2. **EnchantmentEngine.exe:**
   - Shows console with all controls created
   - Shows window with menu bar
   - Shows four buttons with proper labels
   - Buttons respond to clicks

3. **enchantment_editor.exe:**
   - Shows console with all controls created
   - Shows window with 9-menu bar
   - Shows toolbar and status bar
   - Test button responds with message box

---

**Last Updated:** March 1, 2026  
**Version:** 3.0.0  
**Build:** Enhanced Debug Build
