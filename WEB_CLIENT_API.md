# 🌐 Enchantment Engine - Web Client API Documentation

Complete guide for using the Enchantment Engine API from web browsers (JavaScript).

**Version:** 3.0.0  
**Last Updated:** March 1, 2026

---

## 📦 Files Created

### JavaScript Files

1. **api-client.js** - Core API client class
   - `EnchantmentAPI` class with 30+ methods
   - Handles all HTTP requests to backend
   - Error handling and response parsing
   - Global `api` instance

2. **api-menus.js** - Menu system integration
   - `EnchantmentMenus` class with menu handlers
   - File operations (New, Open, Save, Delete, Rename)
   - Project management
   - Build operations
   - Asset management
   - ROM operations
   - Debug tools
   - System information

3. **api-demo.html** - Complete demo application
   - Full IDE interface
   - Menu bar with dropdowns
   - File browser sidebar
   - Code editor
   - Build output panel
   - Status bar
   - Keyboard shortcuts

---

## 🚀 Quick Start

### 1. Include Scripts

```html
<script src="js/api-client.js"></script>
<script src="js/api-menus.js"></script>
```

### 2. Use Global API Instance

```javascript
// API client is automatically available as 'api'
const files = await api.listFiles('src');
console.log('Files:', files);

// Menu system is available as 'menus'
await menus.handleFileOpen();
```

### 3. Or Create Custom Instance

```javascript
const myApi = new EnchantmentAPI('http://localhost:8080');
const files = await myApi.listFiles('src');
```

---

## 📚 API Client Reference

### EnchantmentAPI Class

#### Constructor

```javascript
const api = new EnchantmentAPI(baseUrl = 'http://localhost:8080');
```

#### Configuration Methods

```javascript
api.setBaseUrl('http://localhost:8080');
api.setTimeout(30000); // 30 seconds
```

#### Connection Test

```javascript
const isConnected = await api.ping();
if (isConnected) {
    console.log('Server is running');
}
```

---

## 📁 File Operations

### List Files

```javascript
const files = await api.listFiles('src');
// Returns: ['main.c', 'game.c', 'utils.h']
```

### Read File

```javascript
const content = await api.readFile('src/main.c');
console.log(content);
```

### Save File

```javascript
const success = await api.saveFile('src/main.c', '// new content');
if (success) {
    console.log('File saved!');
}
```

### Create New File

```javascript
const success = await api.newFile('src/newfile.c');
```

### Rename File

```javascript
const success = await api.renameFile('src/old.c', 'src/new.c');
```

### Delete File

```javascript
const success = await api.deleteFile('src/temp.c');
```

---

## 📦 Project Operations

### Get Project Info

```javascript
const info = await api.getProjectInfo();
console.log('Project:', info.name);
console.log('Path:', info.path);
console.log('Type:', info.type);
```

### Save Project Settings

```javascript
const settings = {
    compiler: 'GBDK-2020',
    target: 'GameBoyColor',
    optimization: 'speed'
};
const success = await api.saveProjectSettings(settings);
```

---

## 🔨 Build Operations

### Build Assets

```javascript
const result = await api.buildAssets();
if (result && result.success) {
    console.log('Assets built:', result.output);
}
```

### Build ROM

```javascript
const result = await api.buildRom();
if (result && result.success) {
    console.log('ROM built:', result.output);
}
```

### Build All

```javascript
const result = await api.buildAll();
if (result && result.success) {
    console.log('Assets:', result.assetsOutput);
    console.log('ROM:', result.romOutput);
}
```

### Clean Build

```javascript
const result = await api.cleanBuild();
```

### Get Build Status

```javascript
const status = await api.getBuildStatus();
console.log('Building:', status.building);
console.log('Last build:', status.lastBuild);
console.log('Status:', status.status);
```

---

## 🎨 Asset Operations

### List All Assets

```javascript
const assets = await api.listAssets();
console.log('Tiles:', assets.tiles);
console.log('Maps:', assets.maps);
console.log('Sprites:', assets.sprites);
```

### Get Tiles

```javascript
const tiles = await api.getTiles();
// Returns: ['tile1.png', 'tile2.png']
```

### Get Maps

```javascript
const maps = await api.getMaps();
// Returns: ['map1.json', 'map2.json']
```

### Get Sprites

```javascript
const sprites = await api.getSprites();
// Returns: ['sprite1.png', 'sprite2.png']
```

---

## 🎮 ROM Operations

### Download ROM

```javascript
const success = await api.downloadRom();
// Automatically triggers browser download
```

### Get ROM Info

```javascript
const info = await api.getRomInfo();
console.log('Size:', info.size);
console.log('Name:', info.name);
```

---

## 🐛 Debug Operations

### Get Debug Symbols

```javascript
const symbols = await api.getDebugSymbols();
console.log('Symbols:', symbols);
```

### Set Breakpoint

```javascript
const success = await api.setBreakpoint('0x1234');
```

---

## 🛠️ Tools Operations

### Tile Editor

```javascript
const result = await api.tileEditorAction('load', 'tile1.png');
```

### Map Editor

```javascript
const result = await api.mapEditorAction('save', 'map1.json');
```

### Sprite Editor

```javascript
const result = await api.spriteEditorAction('edit', 'sprite1.png');
```

---

## ⚙️ System Operations

### Get System Status

```javascript
const status = await api.getSystemStatus();
console.log('Status:', status.status);
console.log('Version:', status.version);
console.log('Port:', status.port);
```

### Get Version Info

```javascript
const version = await api.getSystemVersion();
console.log('Name:', version.name);
console.log('Version:', version.version);
console.log('Build:', version.build);
```

---

## 🎯 Menu System Reference

### EnchantmentMenus Class

#### Constructor

```javascript
const menus = new EnchantmentMenus(api);
```

#### File Menu Handlers

```javascript
await menus.handleFileNew();      // Create new file
await menus.handleFileOpen();     // Open file dialog
await menus.handleFileSave();     // Save current file
await menus.handleFileSaveAs();   // Save as dialog
await menus.handleFileDelete();   // Delete current file
await menus.handleFileRename();   // Rename current file
```

#### Project Menu Handlers

```javascript
await menus.handleProjectInfo();      // Show project info
await menus.handleProjectSettings();  // Edit settings
```

#### Build Menu Handlers

```javascript
await menus.handleBuildAssets();  // Build assets
await menus.handleBuildRom();     // Build ROM
await menus.handleBuildAll();     // Build everything
await menus.handleBuildClean();   // Clean build
await menus.handleBuildStatus();  // Show build status
```

#### Asset Menu Handlers

```javascript
await menus.handleAssetsView();   // View all assets
await menus.handleTilesView();    // View tiles
await menus.handleMapsView();     // View maps
await menus.handleSpritesView();  // View sprites
```

#### ROM Menu Handlers

```javascript
await menus.handleRomDownload();  // Download ROM
await menus.handleRomInfo();      // Show ROM info
```

#### Debug Menu Handlers

```javascript
await menus.handleDebugSymbols();     // View symbols
await menus.handleDebugBreakpoint();  // Set breakpoint
```

#### Tools Menu Handlers

```javascript
await menus.handleTileEditor();    // Open tile editor
await menus.handleMapEditor();     // Open map editor
await menus.handleSpriteEditor();  // Open sprite editor
```

#### System Menu Handlers

```javascript
await menus.handleSystemStatus();   // Show system status
await menus.handleSystemVersion();  // Show version info
```

---

## 🎨 UI Integration

### Notifications

```javascript
menus.showNotification('File saved!', 'success');
menus.showNotification('Build failed', 'error');
menus.showNotification('Please wait...', 'info');
menus.showNotification('File not found', 'warning');
```

### Build Output

```javascript
menus.showBuildOutput('Compiling main.c...\n');
menus.showBuildOutput('Build complete!\n');
```

### Editor Integration

```javascript
// Get editor content
const content = menus.getEditorContent();

// Set editor content
menus.setEditorContent('// new content');

// Clear editor
menus.clearEditor();

// Load file into editor
await menus.loadFile('src/main.c');
```

---

## 🔄 Complete Workflow Examples

### Example 1: Edit and Build

```javascript
// Load file
await menus.loadFile('src/main.c');

// Edit content
const content = menus.getEditorContent();
const newContent = content + '\n// Added comment\n';
menus.setEditorContent(newContent);

// Save file
await menus.handleFileSave();

// Build ROM
await menus.handleBuildRom();

// Download ROM
await menus.handleRomDownload();
```

### Example 2: Asset Management

```javascript
// List all assets
const assets = await api.listAssets();
console.log('Assets:', assets);

// View tiles
const tiles = await api.getTiles();
console.log('Tiles:', tiles);

// Build assets
const result = await api.buildAssets();
console.log('Build output:', result.output);
```

### Example 3: Project Setup

```javascript
// Get project info
const info = await api.getProjectInfo();
console.log('Project:', info.name);

// Update settings
const settings = {
    compiler: 'GBDK-2020',
    optimization: 'speed'
};
await api.saveProjectSettings(settings);

// Clean and rebuild
await api.cleanBuild();
await api.buildAll();
```

---

## ⌨️ Keyboard Shortcuts

The demo page includes these shortcuts:

- **Ctrl+N** - New File
- **Ctrl+O** - Open File
- **Ctrl+S** - Save File
- **F7** - Build All

### Adding Custom Shortcuts

```javascript
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        menus.handleBuildRom();
    }
});
```

---

## 🎨 Styling

### Notification Styles

```css
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    z-index: 10000;
}

.notification-success { background: #4CAF50; }
.notification-error { background: #f44336; }
.notification-warning { background: #ff9800; }
.notification-info { background: #2196F3; }
```

---

## 🔒 Error Handling

### API Errors

```javascript
try {
    const content = await api.readFile('nonexistent.c');
} catch (error) {
    console.error('Error:', error);
    menus.showNotification('File not found', 'error');
}
```

### Response Checking

```javascript
const result = await api.buildRom();
if (result && result.success) {
    console.log('Success:', result.output);
} else {
    console.error('Build failed');
}
```

---

## 📊 Response Formats

### Success Response

```javascript
{
    success: true,
    status: 200,
    data: { /* response data */ }
}
```

### Error Response

```javascript
{
    success: false,
    status: 404,
    error: "File not found"
}
```

---

## 🚀 Performance Tips

1. **Cache file lists** - Don't reload on every operation
2. **Debounce auto-save** - Wait for user to stop typing
3. **Use async/await** - Don't block UI
4. **Show loading indicators** - Provide feedback
5. **Handle errors gracefully** - Always check responses

```javascript
// Debounced auto-save
let saveTimeout;
document.getElementById('code-editor').addEventListener('input', () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
        await menus.handleFileSave();
    }, 2000); // Save 2 seconds after last edit
});
```

---

## 📝 Best Practices

1. **Always check server connection** before operations
2. **Provide user feedback** with notifications
3. **Handle errors gracefully** with try/catch
4. **Show loading states** for long operations
5. **Validate input** before sending to API
6. **Use keyboard shortcuts** for common actions
7. **Cache data** when appropriate
8. **Update UI** after operations

---

## 🔗 Related Documentation

- [API_ENDPOINTS.md](API_ENDPOINTS.md) - Complete endpoint reference
- [API_USAGE_GUIDE.md](API_USAGE_GUIDE.md) - C++ client guide
- [README.md](README.md) - Main documentation

---

## 🎉 Demo Application

The `api-demo.html` file provides a complete working example with:

- ✅ Full menu system
- ✅ File browser
- ✅ Code editor
- ✅ Build output panel
- ✅ Status bar
- ✅ Keyboard shortcuts
- ✅ Notifications
- ✅ All API operations

**To run:**
1. Start EnchantmentEngine.exe
2. Open http://localhost:8080/api-demo.html
3. Start coding!

---

**Version:** 3.0.0  
**Platform:** Web Browsers (Chrome, Firefox, Edge, Safari)  
**Requirements:** Modern browser with ES6+ support
