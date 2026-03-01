# 🚀 Web Client Quick Start Guide

## Step 1: Start the Server

Open a terminal and run:

```bash
cd "Enchantment Engine/bin"
.\EnchantmentEngine.exe
```

You should see:
```
Server listening on port 8080
ProjectManager::onCreate() called
Window handle: [number]
...
```

## Step 2: Open Your Browser

Open one of these URLs:

### Option 1: API Test Page (Recommended First)
```
http://localhost:8080/test-api.html
```

This page will:
- ✅ Test server connection
- ✅ Show all available API endpoints
- ✅ Let you test each feature with buttons
- ✅ Display results in real-time

### Option 2: Full IDE Demo
```
http://localhost:8080/api-demo.html
```

This page provides:
- ✅ Complete IDE interface
- ✅ File browser and editor
- ✅ Menu system with all operations
- ✅ Build output panel
- ✅ Keyboard shortcuts

### Option 3: Original IDE
```
http://localhost:8080/
```

The original web IDE interface.

## Step 3: Test the API

### Using the Test Page:

1. **Check Connection Status**
   - Should show "✓ Connected to server"
   - If not, make sure EnchantmentEngine.exe is running

2. **Test System Information**
   - Click "Get System Status"
   - Click "Get Version Info"
   - Should see JSON responses

3. **Test File Operations**
   - Click "List Files" to see project files
   - Click "Read File" to read a file
   - Click "Project Info" to see project details

4. **Test Build Operations**
   - Click "Build Status" to see build state
   - Click "Build Assets" to process assets
   - Click "Build ROM" to compile the game

5. **Test Asset Operations**
   - Click "List All Assets" to see all assets
   - Click "Get Tiles" to see tile files
   - Click "Get Maps" to see map files
   - Click "Get Sprites" to see sprite files

6. **Test ROM Operations**
   - Click "ROM Info" to see ROM details
   - Click "Download ROM" to download game.gbc

### Using the Full IDE Demo:

1. **Browse Files**
   - Files appear in the left sidebar
   - Click any file to open it

2. **Edit Code**
   - Type in the code editor
   - Use Ctrl+S to save

3. **Use Menus**
   - File menu: New, Open, Save, Delete, Rename
   - Project menu: Info, Settings
   - Build menu: Build Assets, Build ROM, Build All
   - Assets menu: View Tiles, Maps, Sprites
   - ROM menu: Download ROM, ROM Info
   - Debug menu: Symbols, Breakpoints
   - Tools menu: Tile/Map/Sprite Editors
   - System menu: Status, Version

4. **Keyboard Shortcuts**
   - Ctrl+N: New File
   - Ctrl+O: Open File
   - Ctrl+S: Save File
   - F7: Build All

## Troubleshooting

### "Server not responding"

**Problem:** Can't connect to http://localhost:8080

**Solutions:**
1. Make sure EnchantmentEngine.exe is running
2. Check console output for "Server listening on port 8080"
3. Try closing and restarting EnchantmentEngine.exe
4. Check if another program is using port 8080

### "Failed to list files"

**Problem:** API calls return errors

**Solutions:**
1. Check that you're in the correct project directory
2. Make sure the project has a `src/` folder
3. Check console output for error messages

### "Build failed"

**Problem:** Build operations don't work

**Solutions:**
1. Make sure GBDK-2020 is installed
2. Check that Makefile exists in project
3. Look at build output for specific errors

### "ROM download failed"

**Problem:** Can't download ROM file

**Solutions:**
1. Build the ROM first (Build menu → Build ROM)
2. Check that .gbc file exists in project folder
3. Check browser's download settings

## API Endpoints Reference

All endpoints are available at `http://localhost:8080/api/`

### File Operations
- `GET /api/files?dir=src` - List files
- `GET /api/file?path=src/main.c` - Read file
- `POST /api/file` - Save file
- `DELETE /api/file?path=src/temp.c` - Delete file
- `POST /api/file/new` - Create new file
- `POST /api/file/rename` - Rename file

### Project Operations
- `GET /api/project/info` - Get project info
- `POST /api/project/settings` - Save settings

### Build Operations
- `POST /api/build/assets` - Build assets
- `POST /api/build/rom` - Build ROM
- `POST /api/build/all` - Build everything
- `POST /api/build/clean` - Clean build
- `GET /api/build/status` - Get build status

### Asset Operations
- `GET /api/assets/list` - List all assets
- `GET /api/assets/tiles` - Get tiles
- `GET /api/assets/maps` - Get maps
- `GET /api/assets/sprites` - Get sprites

### ROM Operations
- `GET /api/rom` - Download ROM
- `GET /api/rom/info` - Get ROM info

### Debug Operations
- `GET /api/debug/symbols` - Get debug symbols
- `POST /api/debug/breakpoint` - Set breakpoint

### Tools Operations
- `POST /api/tools/tile-editor` - Tile editor action
- `POST /api/tools/map-editor` - Map editor action
- `POST /api/tools/sprite-editor` - Sprite editor action

### System Operations
- `GET /api/system/status` - Get system status
- `GET /api/system/version` - Get version info

## JavaScript Usage

```javascript
// API client is automatically loaded as 'api'

// List files
const files = await api.listFiles('src');
console.log('Files:', files);

// Read file
const content = await api.readFile('src/main.c');
console.log('Content:', content);

// Save file
await api.saveFile('src/main.c', '// new content');

// Build ROM
const result = await api.buildRom();
console.log('Build output:', result.output);

// Download ROM
await api.downloadRom();

// Get system status
const status = await api.getSystemStatus();
console.log('Status:', status);
```

## Next Steps

1. **Read the Documentation**
   - [WEB_CLIENT_API.md](WEB_CLIENT_API.md) - Complete API reference
   - [API_ENDPOINTS.md](API_ENDPOINTS.md) - Endpoint details
   - [API_USAGE_GUIDE.md](API_USAGE_GUIDE.md) - Usage examples

2. **Explore the Demo**
   - Try all menu options
   - Test keyboard shortcuts
   - Build and download a ROM

3. **Build Your Own**
   - Use api-client.js in your own pages
   - Create custom UI
   - Integrate with your workflow

## Support

**Issues?**
- Check console output (F12 in browser)
- Check server console output
- Review error messages
- See TROUBLESHOOTING.md

**Documentation:**
- WEB_CLIENT_API.md - Web client guide
- API_ENDPOINTS.md - Endpoint reference
- BUILD_STATUS.md - Build information

**GitHub:** https://github.com/ArkansasIo/RPG1test

---

**Happy Coding!** 🎮
