# 🌐 Enchantment Engine - API Endpoints

Complete REST API documentation for the Enchantment Engine backend server.

**Base URL:** `http://localhost:8080`  
**Version:** 3.0.0  
**Protocol:** HTTP/1.1  
**Format:** JSON

---

## 📁 File Operations

### List Files
```
GET /api/files?dir={directory}
```
**Description:** List all files in a directory  
**Parameters:**
- `dir` (optional): Directory path (default: "src")

**Response:**
```json
{
  "files": ["file1.c", "file2.h", "file3.c"]
}
```

---

### Get File
```
GET /api/file?path={filepath}
```
**Description:** Read file contents  
**Parameters:**
- `path` (required): File path relative to project root

**Response:** File content as plain text

---

### Save File
```
POST /api/file
Content-Type: application/json

{
  "path": "src/main.c",
  "content": "// file content here"
}
```
**Description:** Save or update a file  
**Response:**
```json
{
  "success": true
}
```

---

### Delete File
```
DELETE /api/file?path={filepath}
```
**Description:** Delete a file  
**Parameters:**
- `path` (required): File path to delete

**Response:**
```json
{
  "success": true
}
```

---

### New File
```
POST /api/file/new
Content-Type: application/json

{
  "path": "src/newfile.c"
}
```
**Description:** Create a new empty file  
**Response:**
```json
{
  "success": true
}
```

---

### Rename File
```
POST /api/file/rename
Content-Type: application/json

{
  "oldPath": "src/old.c",
  "newPath": "src/new.c"
}
```
**Description:** Rename or move a file  
**Response:**
```json
{
  "success": true
}
```

---

## 📦 Project Operations

### Get Project Info
```
GET /api/project/info
```
**Description:** Get project information  
**Response:**
```json
{
  "name": "Labyrinth of the Dragon",
  "path": "/path/to/project",
  "type": "Game Boy Color",
  "buildSystem": "GBDK-2020"
}
```

---

### Save Project Settings
```
POST /api/project/settings
Content-Type: application/json

{
  "setting1": "value1",
  "setting2": "value2"
}
```
**Description:** Save project configuration  
**Response:**
```json
{
  "success": true
}
```

---

## 🔨 Build Operations

### Build Assets
```
POST /api/build/assets
```
**Description:** Process and build all assets (tiles, maps, sprites)  
**Response:**
```json
{
  "success": "true",
  "output": "Build output here..."
}
```

---

### Build ROM
```
POST /api/build/rom
```
**Description:** Compile source code and build ROM file  
**Response:**
```json
{
  "success": "true",
  "output": "Build output here..."
}
```

---

### Build All
```
POST /api/build/all
```
**Description:** Build assets and ROM in one operation  
**Response:**
```json
{
  "success": "true",
  "assetsOutput": "Assets build output...",
  "romOutput": "ROM build output..."
}
```

---

### Clean Build
```
POST /api/build/clean
```
**Description:** Clean build artifacts  
**Response:**
```json
{
  "success": "true",
  "message": "Build cleaned successfully"
}
```

---

### Get Build Status
```
GET /api/build/status
```
**Description:** Get current build status  
**Response:**
```json
{
  "building": "false",
  "lastBuild": "2026-03-01 05:30:00",
  "status": "success"
}
```

---

## 🎨 Asset Operations

### List All Assets
```
GET /api/assets/list
```
**Description:** List all assets by category  
**Response:**
```json
{
  "tiles": ["tile1.png", "tile2.png"],
  "maps": ["map1.json", "map2.json"],
  "sprites": ["sprite1.png", "sprite2.png"]
}
```

---

### Get Tiles
```
GET /api/assets/tiles
```
**Description:** List all tile assets  
**Response:**
```json
["tile1.png", "tile2.png", "tile3.png"]
```

---

### Get Maps
```
GET /api/assets/maps
```
**Description:** List all map assets  
**Response:**
```json
["map1.json", "map2.json", "map3.json"]
```

---

### Get Sprites
```
GET /api/assets/sprites
```
**Description:** List all sprite assets  
**Response:**
```json
["sprite1.png", "sprite2.png", "sprite3.png"]
```

---

## 🎮 ROM Operations

### Download ROM
```
GET /api/rom
```
**Description:** Download the compiled ROM file  
**Response:** Binary ROM data (application/octet-stream)

---

### Get ROM Info
```
GET /api/rom/info
```
**Description:** Get ROM file information  
**Response:**
```json
{
  "size": "262144",
  "name": "LabyrinthOfTheDragon.gbc",
  "type": "Game Boy Color ROM"
}
```

---

## 🐛 Debug Operations

### Get Debug Symbols
```
GET /api/debug/symbols
```
**Description:** Get debug symbol map  
**Response:** Symbol map content (text or JSON)

---

### Set Breakpoint
```
POST /api/debug/breakpoint
Content-Type: application/json

{
  "address": "0x1234"
}
```
**Description:** Set a debug breakpoint  
**Response:**
```json
{
  "success": "true",
  "address": "0x1234"
}
```

---

## 🛠️ Tools Operations

### Tile Editor Action
```
POST /api/tools/tile-editor
Content-Type: application/json

{
  "action": "load",
  "data": "tile1.png"
}
```
**Description:** Perform tile editor operation  
**Response:**
```json
{
  "success": "true",
  "action": "load"
}
```

---

### Map Editor Action
```
POST /api/tools/map-editor
Content-Type: application/json

{
  "action": "save",
  "data": "map1.json"
}
```
**Description:** Perform map editor operation  
**Response:**
```json
{
  "success": "true",
  "action": "save"
}
```

---

### Sprite Editor Action
```
POST /api/tools/sprite-editor
Content-Type: application/json

{
  "action": "edit",
  "data": "sprite1.png"
}
```
**Description:** Perform sprite editor operation  
**Response:**
```json
{
  "success": "true",
  "action": "edit"
}
```

---

## ⚙️ System Operations

### Get System Status
```
GET /api/system/status
```
**Description:** Get server system status  
**Response:**
```json
{
  "status": "running",
  "version": "3.0.0",
  "uptime": "running",
  "projectPath": "/path/to/project",
  "port": "8080"
}
```

---

### Get System Version
```
GET /api/system/version
```
**Description:** Get server version information  
**Response:**
```json
{
  "name": "Enchantment Engine",
  "version": "3.0.0",
  "build": "2026-03-01",
  "compiler": "Clang 22.1.0",
  "platform": "Windows"
}
```

---

## 📄 Static File Serving

### Get Static File
```
GET /{filepath}
```
**Description:** Serve static files (HTML, CSS, JS, images)  
**Examples:**
- `GET /` → serves `src/client/index.html`
- `GET /style.css` → serves `src/client/style.css`
- `GET /app.js` → serves `src/client/app.js`

**Content Types:**
- `.html` → `text/html`
- `.css` → `text/css`
- `.js` → `application/javascript`
- `.json` → `application/json`
- `.png` → `image/png`
- `.jpg`, `.jpeg` → `image/jpeg`

---

## 🔒 Error Responses

All endpoints may return error responses:

### 400 Bad Request
```json
{
  "error": "Missing required parameter"
}
```

### 404 Not Found
```json
{
  "error": "File not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Operation failed: detailed error message"
}
```

---

## 📊 Response Headers

All responses include:
```
Content-Type: application/json (or appropriate type)
Content-Length: {size}
Access-Control-Allow-Origin: *
```

---

## 🔄 Request Examples

### Using curl:

```bash
# List files
curl http://localhost:8080/api/files?dir=src

# Get file
curl http://localhost:8080/api/file?path=src/main.c

# Save file
curl -X POST http://localhost:8080/api/file \
  -H "Content-Type: application/json" \
  -d '{"path":"src/main.c","content":"// new content"}'

# Build ROM
curl -X POST http://localhost:8080/api/build/rom

# Get system status
curl http://localhost:8080/api/system/status
```

### Using JavaScript (fetch):

```javascript
// List files
const files = await fetch('http://localhost:8080/api/files?dir=src')
  .then(r => r.json());

// Save file
await fetch('http://localhost:8080/api/file', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    path: 'src/main.c',
    content: '// new content'
  })
});

// Build ROM
const result = await fetch('http://localhost:8080/api/build/rom', {
  method: 'POST'
}).then(r => r.json());
```

### Using C++ ApiClient:

```cpp
ApiClient client("http://localhost:8080");

// List files
auto files = client.listFiles("src");

// Save file
client.saveFile("src/main.c", "// new content");

// Build ROM
std::string output = client.buildRom();

// Get system status
std::string status = client.getSystemStatus();
```

---

## 🚀 Quick Reference

| Category | Endpoints | Methods |
|----------|-----------|---------|
| Files | `/api/files`, `/api/file`, `/api/file/new`, `/api/file/rename` | GET, POST, DELETE |
| Project | `/api/project/info`, `/api/project/settings` | GET, POST |
| Build | `/api/build/assets`, `/api/build/rom`, `/api/build/all`, `/api/build/clean`, `/api/build/status` | POST, GET |
| Assets | `/api/assets/list`, `/api/assets/tiles`, `/api/assets/maps`, `/api/assets/sprites` | GET |
| ROM | `/api/rom`, `/api/rom/info` | GET |
| Debug | `/api/debug/symbols`, `/api/debug/breakpoint` | GET, POST |
| Tools | `/api/tools/tile-editor`, `/api/tools/map-editor`, `/api/tools/sprite-editor` | POST |
| System | `/api/system/status`, `/api/system/version` | GET |

---

## 📝 Notes

- All POST requests should use `Content-Type: application/json`
- Binary responses (ROM download) use `application/octet-stream`
- CORS is enabled with `Access-Control-Allow-Origin: *`
- Default port is 8080 (configurable)
- All paths are relative to project root
- File operations are sandboxed to project directory

---

**Version:** 3.0.0  
**Last Updated:** March 1, 2026  
**Server:** Enchantment Engine Backend
