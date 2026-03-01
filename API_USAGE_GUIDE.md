# 📚 Enchantment Engine - API Usage Guide

Complete guide for using the Enchantment Engine API from both client and server perspectives.

---

## 🎯 Overview

The Enchantment Engine provides a comprehensive REST API for:
- File management
- Project configuration
- Build operations
- Asset processing
- ROM operations
- Debugging tools
- System information

**Architecture:**
```
Client Application (C++)
    ↓
ApiClient Class
    ↓
HTTP Requests
    ↓
EnchantmentServer (C++)
    ↓
Route Handlers
    ↓
FileManager / BuildSystem / AssetProcessor
```

---

## 🔧 Client-Side Usage (C++)

### Setup

```cpp
#include "api_client.hpp"

// Create API client
ApiClient client("http://localhost:8080");

// Optional: Set timeout
client.setTimeout(30000); // 30 seconds
```

### File Operations

```cpp
// List files in directory
auto files = client.listFiles("src");
for (const auto& file : files) {
    std::cout << file << std::endl;
}

// Read file
std::string content = client.readFile("src/main.c");
std::cout << "File content: " << content << std::endl;

// Save file
bool success = client.saveFile("src/main.c", "// new content");
if (success) {
    std::cout << "File saved!" << std::endl;
}

// Create new file
bool created = client.newFile("src/newfile.c");

// Rename file
bool renamed = client.renameFile("src/old.c", "src/new.c");

// Delete file
bool deleted = client.deleteFile("src/temp.c");
```

### Project Operations

```cpp
// Get project information
std::string info = client.getProjectInfo();
std::cout << "Project info: " << info << std::endl;

// Save project settings
std::map<std::string, std::string> settings;
settings["compiler"] = "GBDK-2020";
settings["target"] = "GameBoyColor";
bool saved = client.saveProjectSettings(settings);
```

### Build Operations

```cpp
// Build assets only
std::string assetsOutput = client.buildAssets();
std::cout << "Assets build: " << assetsOutput << std::endl;

// Build ROM only
std::string romOutput = client.buildRom();
std::cout << "ROM build: " << romOutput << std::endl;

// Build everything
std::string allOutput = client.buildAll();
std::cout << "Full build: " << allOutput << std::endl;

// Clean build
std::string cleanOutput = client.cleanBuild();
std::cout << "Clean: " << cleanOutput << std::endl;

// Get build status
std::string status = client.getBuildStatus();
std::cout << "Build status: " << status << std::endl;
```

### Asset Operations

```cpp
// List all assets
std::string assets = client.listAssets();
std::cout << "Assets: " << assets << std::endl;

// Get tiles
auto tiles = client.getTiles();
for (const auto& tile : tiles) {
    std::cout << "Tile: " << tile << std::endl;
}

// Get maps
auto maps = client.getMaps();
for (const auto& map : maps) {
    std::cout << "Map: " << map << std::endl;
}

// Get sprites
auto sprites = client.getSprites();
for (const auto& sprite : sprites) {
    std::cout << "Sprite: " << sprite << std::endl;
}
```

### ROM Operations

```cpp
// Download ROM
auto romData = client.downloadRom();
std::cout << "ROM size: " << romData.size() << " bytes" << std::endl;

// Save ROM to file
std::ofstream romFile("game.gbc", std::ios::binary);
romFile.write((char*)romData.data(), romData.size());
romFile.close();

// Get ROM info
std::string romInfo = client.getRomInfo();
std::cout << "ROM info: " << romInfo << std::endl;
```

### Debug Operations

```cpp
// Get debug symbols
std::string symbols = client.getDebugSymbols();
std::cout << "Symbols: " << symbols << std::endl;

// Set breakpoint
bool bpSet = client.setBreakpoint("0x1234");
if (bpSet) {
    std::cout << "Breakpoint set!" << std::endl;
}
```

### Tools Operations

```cpp
// Tile editor action
std::string tileResult = client.tileEditorAction("load", "tile1.png");
std::cout << "Tile editor: " << tileResult << std::endl;

// Map editor action
std::string mapResult = client.mapEditorAction("save", "map1.json");
std::cout << "Map editor: " << mapResult << std::endl;

// Sprite editor action
std::string spriteResult = client.spriteEditorAction("edit", "sprite1.png");
std::cout << "Sprite editor: " << spriteResult << std::endl;
```

### System Operations

```cpp
// Get system status
std::string status = client.getSystemStatus();
std::cout << "System status: " << status << std::endl;

// Get version
std::string version = client.getSystemVersion();
std::cout << "Version: " << version << std::endl;
```

---

## 🖥️ Server-Side Implementation (C++)

### Adding New Routes

```cpp
// In server.cpp setupRoutes()
m_routes["GET /api/custom/endpoint"] = [this](const HttpRequest& req, HttpResponse& res) {
    handleCustomEndpoint(req, res);
};
```

### Creating Route Handlers

```cpp
void EnchantmentServer::handleCustomEndpoint(const HttpRequest& req, HttpResponse& res) {
    try {
        // Get query parameters
        auto it = req.params.find("param1");
        if (it == req.params.end()) {
            res.setError(400, "Missing param1");
            return;
        }
        
        // Process request
        std::string result = processData(it->second);
        
        // Send JSON response
        std::map<std::string, std::string> response;
        response["success"] = "true";
        response["result"] = result;
        res.setJson(JsonUtils::createJson(response));
        
    } catch (const std::exception& e) {
        res.setError(500, std::string("Operation failed: ") + e.what());
    }
}
```

### Handling POST Data

```cpp
void EnchantmentServer::handlePostEndpoint(const HttpRequest& req, HttpResponse& res) {
    try {
        // Parse JSON body
        auto data = JsonUtils::parseSimpleJson(req.body);
        
        // Get fields
        auto field1 = data.find("field1");
        auto field2 = data.find("field2");
        
        if (field1 == data.end() || field2 == data.end()) {
            res.setError(400, "Missing required fields");
            return;
        }
        
        // Process data
        processData(field1->second, field2->second);
        
        // Send response
        res.setJson("{\"success\":true}");
        
    } catch (const std::exception& e) {
        res.setError(500, e.what());
    }
}
```

### Returning Binary Data

```cpp
void EnchantmentServer::handleBinaryEndpoint(const HttpRequest& req, HttpResponse& res) {
    try {
        // Read binary file
        auto data = m_fileManager->readBinaryFile("file.bin");
        
        // Send binary response
        res.setBinary(data, "application/octet-stream");
        
    } catch (const std::exception& e) {
        res.setError(404, "File not found");
    }
}
```

---

## 🌐 Web Client Usage (JavaScript)

### Fetch API Examples

```javascript
// List files
async function listFiles(directory) {
    const response = await fetch(`http://localhost:8080/api/files?dir=${directory}`);
    const data = await response.json();
    return data.files;
}

// Read file
async function readFile(path) {
    const response = await fetch(`http://localhost:8080/api/file?path=${encodeURIComponent(path)}`);
    return await response.text();
}

// Save file
async function saveFile(path, content) {
    const response = await fetch('http://localhost:8080/api/file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, content })
    });
    return await response.json();
}

// Build ROM
async function buildRom() {
    const response = await fetch('http://localhost:8080/api/build/rom', {
        method: 'POST'
    });
    return await response.json();
}

// Download ROM
async function downloadRom() {
    const response = await fetch('http://localhost:8080/api/rom');
    const blob = await response.blob();
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game.gbc';
    a.click();
}
```

### Axios Examples

```javascript
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 30000
});

// List files
const files = await api.get('/api/files', { params: { dir: 'src' } });
console.log(files.data.files);

// Save file
await api.post('/api/file', {
    path: 'src/main.c',
    content: '// new content'
});

// Build ROM
const result = await api.post('/api/build/rom');
console.log(result.data.output);

// Download ROM
const rom = await api.get('/api/rom', { responseType: 'blob' });
const url = URL.createObjectURL(rom.data);
```

---

## 🔄 Complete Workflow Examples

### Example 1: Edit and Build

```cpp
ApiClient client("http://localhost:8080");

// 1. List source files
auto files = client.listFiles("src");
std::cout << "Found " << files.size() << " files" << std::endl;

// 2. Read a file
std::string content = client.readFile("src/main.c");
std::cout << "Original content length: " << content.length() << std::endl;

// 3. Modify content
content += "\n// Added comment\n";

// 4. Save file
if (client.saveFile("src/main.c", content)) {
    std::cout << "File saved successfully" << std::endl;
}

// 5. Build ROM
std::string buildOutput = client.buildRom();
std::cout << "Build output:\n" << buildOutput << std::endl;

// 6. Download ROM
auto romData = client.downloadRom();
std::cout << "ROM size: " << romData.size() << " bytes" << std::endl;
```

### Example 2: Asset Pipeline

```cpp
ApiClient client("http://localhost:8080");

// 1. List assets
std::string assets = client.listAssets();
std::cout << "Assets: " << assets << std::endl;

// 2. Get tiles
auto tiles = client.getTiles();
std::cout << "Found " << tiles.size() << " tiles" << std::endl;

// 3. Process assets
std::string assetsOutput = client.buildAssets();
std::cout << "Assets processed:\n" << assetsOutput << std::endl;

// 4. Build ROM with processed assets
std::string romOutput = client.buildRom();
std::cout << "ROM built:\n" << romOutput << std::endl;
```

### Example 3: Project Management

```cpp
ApiClient client("http://localhost:8080");

// 1. Get project info
std::string info = client.getProjectInfo();
std::cout << "Project: " << info << std::endl;

// 2. Update settings
std::map<std::string, std::string> settings;
settings["optimization"] = "speed";
settings["debug"] = "true";
client.saveProjectSettings(settings);

// 3. Clean build
std::string cleanOutput = client.cleanBuild();
std::cout << "Cleaned: " << cleanOutput << std::endl;

// 4. Full rebuild
std::string buildOutput = client.buildAll();
std::cout << "Built: " << buildOutput << std::endl;

// 5. Check status
std::string status = client.getBuildStatus();
std::cout << "Status: " << status << std::endl;
```

---

## 🛡️ Error Handling

### Client-Side

```cpp
ApiClient client("http://localhost:8080");

try {
    std::string content = client.readFile("nonexistent.c");
} catch (const std::exception& e) {
    std::cerr << "Error: " << e.what() << std::endl;
}

// Check response status
auto response = client.get("/api/file?path=test.c");
if (response.statusCode == 200) {
    std::cout << "Success: " << response.body << std::endl;
} else if (response.statusCode == 404) {
    std::cerr << "File not found" << std::endl;
} else {
    std::cerr << "Error " << response.statusCode << std::endl;
}
```

### Server-Side

```cpp
void EnchantmentServer::handleEndpoint(const HttpRequest& req, HttpResponse& res) {
    try {
        // Validate parameters
        auto it = req.params.find("required_param");
        if (it == req.params.end()) {
            res.setError(400, "Missing required parameter");
            return;
        }
        
        // Process request
        std::string result = processData(it->second);
        
        // Check result
        if (result.empty()) {
            res.setError(404, "Resource not found");
            return;
        }
        
        // Success
        res.setJson("{\"success\":true,\"result\":\"" + result + "\"}");
        
    } catch (const std::invalid_argument& e) {
        res.setError(400, std::string("Invalid argument: ") + e.what());
    } catch (const std::runtime_error& e) {
        res.setError(500, std::string("Runtime error: ") + e.what());
    } catch (const std::exception& e) {
        res.setError(500, std::string("Unexpected error: ") + e.what());
    }
}
```

---

## 📊 Response Parsing

### JSON Parsing (Simple)

```cpp
// Parse simple JSON response
auto response = client.get("/api/project/info");
if (response.statusCode == 200) {
    std::string json = response.body;
    
    // Find values (simple string search)
    size_t namePos = json.find("\"name\":\"");
    if (namePos != std::string::npos) {
        size_t start = namePos + 8;
        size_t end = json.find("\"", start);
        std::string name = json.substr(start, end - start);
        std::cout << "Project name: " << name << std::endl;
    }
}
```

### Array Parsing

```cpp
// Parse JSON array
auto files = client.listFiles("src");
for (const auto& file : files) {
    std::cout << "File: " << file << std::endl;
}
```

---

## 🚀 Performance Tips

1. **Reuse ApiClient instance** - Don't create new client for each request
2. **Set appropriate timeout** - Adjust based on operation (build vs file read)
3. **Batch operations** - Use buildAll() instead of separate calls
4. **Cache responses** - Store frequently accessed data
5. **Async operations** - Use threads for long-running operations

```cpp
// Good: Reuse client
ApiClient client("http://localhost:8080");
for (int i = 0; i < 100; i++) {
    client.readFile("file" + std::to_string(i) + ".c");
}

// Bad: Create new client each time
for (int i = 0; i < 100; i++) {
    ApiClient client("http://localhost:8080");
    client.readFile("file" + std::to_string(i) + ".c");
}
```

---

## 📝 Best Practices

1. **Always check response status codes**
2. **Handle errors gracefully**
3. **Validate input before sending**
4. **Use appropriate HTTP methods** (GET for read, POST for write)
5. **URL-encode parameters**
6. **Set timeouts for long operations**
7. **Log API calls for debugging**
8. **Use HTTPS in production** (not implemented yet)

---

## 🔗 Related Documentation

- [API_ENDPOINTS.md](API_ENDPOINTS.md) - Complete endpoint reference
- [API_REFERENCE.md](API_REFERENCE.md) - Detailed API documentation
- [BUILD_STATUS.md](BUILD_STATUS.md) - Build information
- [README.md](README.md) - Main documentation

---

**Version:** 3.0.0  
**Last Updated:** March 1, 2026  
**Platform:** Windows, Linux, macOS
