# Enchantment Game Engine - C++ Server

Backend server for the Enchantment Game Engine web-based IDE.

## Features

- HTTP server for serving the web interface
- File management API for reading/writing project files
- Build system integration with GBDK-2020
- Asset processing (PNG to binary, strings, tables)
- Real-time build output streaming
- Cross-platform support (Windows, Linux, macOS)

## Building

### Prerequisites

- C++20 compatible compiler (GCC 10+, Clang 12+, MSVC 2019+)
- CMake 3.15 or higher
- GBDK-2020 (for ROM compilation)

### Build Instructions

#### Linux/macOS

```bash
cd src/server
mkdir build
cd build
cmake ..
make
```

#### Windows (Visual Studio)

```bash
cd src/server
mkdir build
cd build
cmake .. -G "Visual Studio 16 2019"
cmake --build . --config Release
```

#### Windows (MinGW)

```bash
cd src/server
mkdir build
cd build
cmake .. -G "MinGW Makefiles"
mingw32-make
```

## Running

```bash
# From the build directory
./enchantment_server --port 8080 --project ../../

# Or from the project root
./src/server/build/enchantment_server
```

### Command Line Options

- `--port <port>` - Server port (default: 8080)
- `--project <path>` - Project directory (default: current directory)
- `--help` - Show help message

## API Endpoints

### File Operations

- `GET /api/files?dir=<directory>` - List files in directory
- `GET /api/file?path=<path>` - Read file content
- `POST /api/file` - Save file (JSON body: `{path, content}`)

### Build Operations

- `POST /api/build/assets` - Process assets (PNG, strings, tables)
- `POST /api/build/rom` - Compile ROM
- `POST /api/build/all` - Build assets and ROM
- `GET /api/rom` - Download compiled ROM

### Static Files

- `GET /` - Serve index.html
- `GET /css/*` - Serve CSS files
- `GET /js/*` - Serve JavaScript files
- `GET /emulator/*` - Serve emulator files

## Architecture

### Core Components

1. **HTTP Server** (`server.cpp`)
   - Socket-based HTTP server
   - Request routing and handling
   - Static file serving
   - CORS support

2. **File Manager** (`file_manager.cpp`)
   - Safe file I/O operations
   - Path validation and sanitization
   - Directory traversal prevention
   - Binary and text file support

3. **Build System** (`build_system.cpp`)
   - GBDK-2020 integration
   - Makefile execution
   - Build output parsing
   - Error and warning detection

4. **Asset Processor** (`asset_processor.cpp`)
   - PNG to Game Boy tile conversion
   - String data generation
   - CSV table processing
   - C code generation

### Threading Model

- Main thread handles server socket and accepts connections
- Each client connection spawns a new thread
- Build operations run synchronously in the request thread
- No shared state between threads (thread-safe by design)

### Security

- Path traversal prevention (no `..` in paths)
- All file operations are relative to project root
- Input validation on all API endpoints
- No shell injection vulnerabilities

## Development

### Adding New API Endpoints

1. Add route handler in `server.hpp`:
```cpp
void handleNewEndpoint(const HttpRequest& req, HttpResponse& res);
```

2. Implement handler in `server.cpp`:
```cpp
void EnchantmentServer::handleNewEndpoint(const HttpRequest& req, HttpResponse& res) {
    // Implementation
}
```

3. Register route in `setupRoutes()`:
```cpp
m_routes["GET /api/new"] = [this](const HttpRequest& req, HttpResponse& res) {
    handleNewEndpoint(req, res);
};
```

### Adding New Build Features

Extend `BuildSystem` class:

```cpp
// In build_system.hpp
std::string buildCustomTarget();

// In build_system.cpp
std::string BuildSystem::buildCustomTarget() {
    std::string output;
    runMake("custom_target", output);
    return output;
}
```

### Adding New Asset Processors

Extend `AssetProcessor` class:

```cpp
// In asset_processor.hpp
std::string processNewAssetType();

// In asset_processor.cpp
std::string AssetProcessor::processNewAssetType() {
    // Implementation
}
```

## Testing

### Manual Testing

```bash
# Start server
./enchantment_server --port 8080

# Test file listing
curl http://localhost:8080/api/files?dir=src

# Test file reading
curl http://localhost:8080/api/file?path=src/main.c

# Test build
curl -X POST http://localhost:8080/api/build/rom
```

### Integration Testing

The server integrates with the web frontend. Test by:

1. Start the server
2. Open http://localhost:8080 in a browser
3. Test all IDE features (file editing, building, emulator)

## Performance

- Typical request latency: < 10ms
- Build time: 5-30 seconds (depends on project size)
- Memory usage: ~50MB base + build overhead
- Concurrent connections: Limited by OS (typically 1000+)

## Troubleshooting

### Server won't start

- Check if port is already in use: `netstat -an | grep 8080`
- Try a different port: `--port 8081`
- Check firewall settings

### Build fails

- Verify GBDK_HOME environment variable is set
- Check GBDK installation: `ls $GBDK_HOME/bin/lcc`
- Review build output for specific errors

### File operations fail

- Check file permissions
- Verify project path is correct
- Ensure files exist and are readable

## License

See main project LICENSE file.

## Contributing

1. Follow C++ Core Guidelines
2. Use consistent formatting (clang-format)
3. Add comments for complex logic
4. Test on multiple platforms
5. Update documentation

## Future Enhancements

- WebSocket support for real-time updates
- Build caching for faster incremental builds
- Multi-project support
- User authentication
- Cloud storage integration
- Collaborative editing
