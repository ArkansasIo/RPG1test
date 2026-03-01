## Enchantment Engine - Desktop Client Application

Complete desktop application with integrated server, splash screen, and embedded browser.

## Features

- **Integrated Server Management** - Automatically starts and stops backend server
- **Splash Screen** - Beautiful startup screen with dragon logo and progress indicator
- **Embedded Browser** - Opens IDE in default browser (or embedded WebView)
- **API Client** - Full HTTP client for backend communication
- **Cross-Platform** - Windows, Linux, macOS support
- **Single Executable** - All-in-one application

## Architecture

```
EnchantmentEngine.exe
├── Splash Screen (startup)
├── Server Launcher (background process)
├── API Client (HTTP communication)
└── Browser Window (IDE interface)
```

### Components

1. **Application** (`application.cpp`)
   - Main application controller
   - Server process management
   - Configuration handling
   - Lifecycle management

2. **API Client** (`api_client.cpp`)
   - HTTP client implementation
   - File operations (read, write, list)
   - Build operations (assets, ROM)
   - ROM download

3. **Browser Window** (`browser_window.cpp`)
   - Embedded web browser
   - Opens IDE interface
   - JavaScript execution support

4. **Splash Screen** (`splash_screen.cpp`)
   - Startup splash screen
   - Dragon logo rendering
   - Progress indicator
   - Status messages

## Building

### Prerequisites

- C++20 compatible compiler
- CMake 3.15+
- Windows SDK (for Windows builds)

### Build Instructions

**Windows:**
```cmd
build_client.bat
```

**Linux/macOS:**
```bash
chmod +x build_client.sh
./build_client.sh
```

**Or build everything:**
```cmd
build_all.bat
```

## Running

Simply run the executable:

```cmd
EnchantmentEngine.exe
```

The application will:
1. Show splash screen
2. Start backend server
3. Wait for server to be ready
4. Open IDE in browser
5. Ready to develop!

## Command Line Options

```
EnchantmentEngine.exe [options]

Options:
  --port <port>       Server port (default: 8080)
  --project <path>    Project directory (default: current directory)
```

## Configuration

Configuration is stored in `enchantment.conf`:

```
port=8080
project=.
```

## API Client Usage

The API client provides methods for all backend operations:

```cpp
ApiClient client("http://localhost:8080");

// File operations
auto files = client.listFiles("src");
std::string content = client.readFile("src/main.c");
client.saveFile("src/main.c", newContent);

// Build operations
std::string output = client.buildAssets();
std::string output = client.buildRom();
std::string output = client.buildAll();

// Download ROM
auto romData = client.downloadRom();
```

## Splash Screen

The splash screen displays:
- Dragon logo (drawn with GDI)
- Application title
- Version information
- Status messages
- Progress bar

Status messages during startup:
1. "Initializing Enchantment Engine..."
2. "Loading configuration..."
3. "Starting backend server..."
4. "Waiting for server..."
5. "Loading user interface..."
6. "Ready!"

## Server Management

The application manages the backend server automatically:

**Windows:**
- Creates hidden process using `CreateProcess`
- Monitors server health
- Terminates on exit

**Linux/macOS:**
- Forks child process
- Executes server binary
- Sends SIGTERM on exit

## Browser Integration

Currently opens the IDE in the default browser. For embedded browser support, integrate:

- **Windows**: WebView2 (Microsoft Edge WebView2)
- **Linux**: WebKitGTK
- **macOS**: WKWebView

## Error Handling

The application handles various error conditions:

- Server fails to start → Show error message
- Server timeout → Show timeout message
- Configuration errors → Use defaults
- Network errors → Retry with backoff

## Development

### Adding New API Endpoints

1. Add method to `ApiClient`:
```cpp
std::string ApiClient::newOperation() {
    auto response = post("/api/new", "");
    return response.body;
}
```

2. Use in application:
```cpp
std::string result = m_apiClient->newOperation();
```

### Customizing Splash Screen

Edit `splash_screen.cpp`:

```cpp
void SplashScreen::drawSplash(HDC hdc) {
    // Custom drawing code
}
```

### Changing Window Properties

Edit `browser_window.cpp`:

```cpp
BrowserWindow window("Title", 1920, 1080, url);
```

## Platform-Specific Notes

### Windows

- Uses Win32 API for window management
- GDI for splash screen rendering
- Winsock for networking
- COM for browser integration

### Linux

- Uses GTK for window management
- Cairo for splash screen rendering
- POSIX sockets for networking
- WebKitGTK for browser integration

### macOS

- Uses Cocoa for window management
- Core Graphics for splash screen rendering
- BSD sockets for networking
- WKWebView for browser integration

## Performance

- Startup time: ~2-3 seconds
- Memory usage: ~100 MB (including server)
- Server startup: ~1 second
- Browser launch: ~1 second

## Troubleshooting

### Application won't start

- Check if port 8080 is available
- Verify server executable exists
- Check file permissions

### Server fails to start

- Ensure `enchantment_server.exe` is in `src/server/build/`
- Check server logs
- Try different port with `--port` option

### Browser doesn't open

- Check default browser settings
- Try opening http://localhost:8080 manually
- Check firewall settings

## Future Enhancements

- [ ] Embedded WebView2 integration
- [ ] Auto-update functionality
- [ ] Multiple project support
- [ ] Workspace management
- [ ] Plugin system
- [ ] Theme customization
- [ ] Keyboard shortcuts
- [ ] Tray icon support

## License

See main project LICENSE file.
