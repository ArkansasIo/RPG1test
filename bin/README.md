# Enchantment Engine - Executable

## Main Application

**EnchantmentEngine.exe** - The complete Game Boy Color development suite

### Quick Start

Double-click `EnchantmentEngine.exe` to launch the application.

### What It Does

1. Shows splash screen with dragon logo
2. Displays project manager to select/create projects
3. Starts integrated backend server
4. Opens web-based IDE in your browser
5. Provides complete development environment

### File Information

- **Name**: EnchantmentEngine.exe
- **Size**: ~444 KB
- **Type**: Windows PE32 executable
- **Architecture**: i686 (32-bit)
- **Compiler**: Clang 22.1.0 (LLVM MinGW)
- **Build**: Release (optimized)

### System Requirements

#### Minimum
- Windows 7 or later
- 512 MB RAM
- 50 MB disk space
- Web browser (Chrome, Firefox, Edge)

#### Recommended
- Windows 10 or later
- 2 GB RAM
- 500 MB disk space (for projects)
- Modern web browser

### Command Line Options

```bash
EnchantmentEngine.exe [options]

Options:
  --port <port>       Server port (default: 8080)
  --project <path>    Project directory (default: shows project manager)
  --help              Show help message
```

### Examples

#### Default Launch
```bash
EnchantmentEngine.exe
```
Shows project manager, then opens IDE.

#### Specify Port
```bash
EnchantmentEngine.exe --port 9000
```
Runs server on port 9000 instead of 8080.

#### Open Specific Project
```bash
EnchantmentEngine.exe --project "C:\MyGames\RPG"
```
Skips project manager, opens specified project directly.

#### Combined Options
```bash
EnchantmentEngine.exe --port 9000 --project "D:\GameDev\Platformer"
```

### Configuration File

Create `enchantment.conf` in the same directory:

```ini
port=8080
project=.
```

This sets default values for port and project path.

### Recent Projects

Recent projects are stored in `enchantment_recent.txt`:

```
C:\Users\YourName\Projects\MyGame
C:\Users\YourName\Projects\RPGAdventure
D:\GameDev\PlatformerGame
```

Format: One project path per line, most recent first.

### Troubleshooting

#### Application Won't Start
- Check if port 8080 is available
- Try different port: `--port 9000`
- Run as administrator
- Check antivirus settings

#### Project Manager Doesn't Appear
- Check if `--project` was specified
- Verify UI permissions
- Check for error messages in console

#### Browser Won't Open
- Ensure default browser is set
- Manually navigate to http://localhost:8080
- Check firewall settings

#### Server Fails to Start
- Port already in use (try different port)
- Insufficient permissions (run as admin)
- Antivirus blocking (add exception)

### Logs and Debugging

#### Console Output
Run from command line to see detailed logs:
```bash
cd bin
EnchantmentEngine.exe
```

#### Common Messages
- "Starting integrated server..." - Server initializing
- "Server listening on port 8080" - Server ready
- "Server is ready!" - Health check passed
- "Running application..." - IDE opening

### Updating

To update to a new version:

1. Close the application
2. Replace `EnchantmentEngine.exe` with new version
3. Keep `enchantment_recent.txt` (preserves recent projects)
4. Keep `enchantment.conf` (preserves settings)
5. Restart application

### Uninstalling

To remove the application:

1. Close the application
2. Delete `EnchantmentEngine.exe`
3. Optionally delete:
   - `enchantment_recent.txt` (recent projects)
   - `enchantment.conf` (configuration)
4. Remove project folders if desired

### Technical Details

#### Components
- **Splash Screen** - Startup animation
- **Project Manager** - Project selection dialog
- **HTTP Server** - Backend API (port 8080)
- **File Manager** - Project file operations
- **Build System** - GBDK integration
- **Asset Processor** - Graphics and data conversion
- **API Client** - Internal communication
- **Browser Window** - Opens IDE in browser

#### Architecture
```
EnchantmentEngine.exe
├── Main Thread
│   ├── Splash Screen
│   ├── Project Manager
│   ├── API Client
│   └── Browser Window
└── Server Thread
    ├── HTTP Server
    ├── File Manager
    ├── Build System
    └── Asset Processor
```

#### Dependencies
All dependencies are statically linked:
- ws2_32 (Winsock)
- gdi32 (Graphics)
- user32 (Windows)
- shell32 (Shell)
- msimg32 (Imaging)
- ole32 (OLE)
- comdlg32 (Common Dialogs)

No external DLLs required!

### Performance

- **Startup Time**: 2-3 seconds
- **Memory Usage**: ~50 MB
- **CPU Usage**: <1% idle, 5-10% during builds
- **Disk I/O**: Minimal (file operations only)

### Security

- **File Access**: Limited to project directory
- **Network**: Localhost only (127.0.0.1)
- **Permissions**: Standard user (no admin required)
- **Data**: No telemetry or external connections

### Support

For help and support:
- Read documentation in parent folder
- Check QUICKSTART.md for tutorials
- See PROJECT_MANAGER.md for project management
- Review TROUBLESHOOTING.md for common issues

### Version Information

Check version with:
```bash
EnchantmentEngine.exe --version
```

Current version: 3.0.0 (Unified Build)

### License

See LICENSE file in parent directory for details.

---

**Ready to create Game Boy Color games!** 🎮✨
