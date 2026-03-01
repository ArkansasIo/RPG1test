# Enchantment Engine - Quick Start Guide

Get started with Game Boy Color development in under 5 minutes!

## Step 1: Launch the Application

Double-click `EnchantmentEngine.exe`

You'll see:
1. **Splash screen** with animated dragon logo
2. **Project Manager** dialog

## Step 2: Create Your First Project

In the Project Manager:

1. Click **"✨ Create New Project"**
2. Browse to where you want to create your project
3. Create a new folder (e.g., "MyFirstGame")
4. Select the folder
5. Click OK

The engine will automatically create:
```
MyFirstGame/
├── src/          # Your C code goes here
├── assets/       # Graphics and data
├── build/        # Compiled files
└── Makefile      # Build configuration
```

## Step 3: Wait for Editor to Load

The splash screen reappears briefly while:
- Server starts (1 second)
- Editor loads (1 second)

Then your browser opens with the IDE!

## Step 4: Write Your First Code

In the IDE:

1. Click **"Code Editor"** tab
2. Create a new file: `src/main.c`
3. Paste this code:

```c
#include <gb/gb.h>
#include <stdio.h>

void main() {
    printf("Hello Game Boy!");
    
    while(1) {
        wait_vbl_done();
    }
}
```

4. Click **"Save"** (or Ctrl+S)

## Step 5: Build Your Game

1. Click **"Build"** tab
2. Click **"Build ROM"**
3. Wait for compilation (5-10 seconds)
4. You'll see build output

## Step 6: Test Your Game

1. Click **"Emulator"** tab
2. Your game loads automatically!
3. See "Hello Game Boy!" on screen

## Step 7: Make Changes

1. Go back to **"Code Editor"**
2. Change the message:
   ```c
   printf("My First Game!");
   ```
3. Save the file
4. Click **"Build ROM"** again
5. Emulator reloads automatically

## Next Steps

### Learn the Tools

#### Code Editor
- Syntax highlighting for C
- Line numbers and minimap
- Auto-indentation
- Undo/redo (Ctrl+Z / Ctrl+Y)
- Go to line (Ctrl+G)
- Find (Ctrl+F)

#### Tile Editor
- Import PNG graphics
- View tiles in grid
- Export to C arrays
- Palette management

#### Map Editor
- Create game levels
- Place tiles visually
- Export to C data
- Multiple layers

#### String Editor
- Manage game text
- Dialog system
- Localization support
- Export to C strings

#### Table Editor
- Game data in CSV
- Stats and properties
- Export to C arrays
- Easy editing

### Explore the Example Game

The engine includes "Labyrinth of the Dragon" - a complete RPG:

1. Close current project
2. Restart `EnchantmentEngine.exe`
3. In Project Manager, click **"Open Existing Project"**
4. Browse to the engine folder
5. Select the root folder
6. Explore the code!

Features to study:
- Turn-based combat system
- Character classes
- Monster AI
- Dungeon generation
- Item system
- Status effects

### Read the Documentation

- **README.md** - Complete feature overview
- **GAME_ENGINE_DESIGN.md** - Technical architecture
- **API_REFERENCE.md** - API documentation
- **PROJECT_MANAGER.md** - Project management guide
- **UNIFIED_BUILD.md** - Build system details

### Join the Community

- Share your games
- Get help with problems
- Contribute improvements
- Request features

## Common Tasks

### Add Graphics

1. Create PNG file (8x8 or 16x16 pixels)
2. Save to `assets/tiles/`
3. Open **Tile Editor**
4. Click **"Import PNG"**
5. Select your file
6. Click **"Export to C"**
7. Include in your code:
   ```c
   #include "tiles.h"
   set_bkg_data(0, tile_count, tiles);
   ```

### Create a Map

1. Open **Map Editor**
2. Click **"New Map"**
3. Set size (20x18 for full screen)
4. Click tiles to place them
5. Click **"Export"**
6. Include in your code:
   ```c
   #include "map.h"
   set_bkg_tiles(0, 0, 20, 18, map);
   ```

### Add Game Text

1. Open **String Editor**
2. Click **"Add String"**
3. Enter ID: `GREETING`
4. Enter text: `Welcome, hero!`
5. Click **"Export"**
6. Include in your code:
   ```c
   #include "strings.h"
   printf(STR_GREETING);
   ```

### Build for Real Hardware

1. Build your ROM in the IDE
2. Find `YourGame.gbc` in project folder
3. Copy to flash cart
4. Play on real Game Boy Color!

Or use emulators:
- **BGB** (Windows) - Best accuracy
- **SameBoy** (Cross-platform) - Great debugger
- **mGBA** (Cross-platform) - Fast and accurate

## Keyboard Shortcuts

### Code Editor
- `Ctrl+S` - Save file
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo
- `Ctrl+F` - Find
- `Ctrl+G` - Go to line
- `Ctrl+/` - Toggle comment
- `Tab` - Indent
- `Shift+Tab` - Unindent

### Emulator
- `Arrow Keys` - D-pad
- `Z` - A button
- `X` - B button
- `Enter` - Start
- `Shift` - Select
- `Space` - Fast forward

### Application
- `F5` - Rebuild ROM
- `F6` - Run in emulator
- `Ctrl+Q` - Quit application

## Troubleshooting

### Project Manager doesn't appear
- Check if `--project` was passed on command line
- Try running as administrator

### Build fails
- Check GBDK is installed
- Verify `GBDK_HOME` environment variable
- Check Makefile syntax
- Look at build output for errors

### Emulator won't load ROM
- Ensure ROM was built successfully
- Check file exists in project folder
- Try rebuilding

### Editor won't open
- Check if port 8080 is available
- Try different port: `--port 9000`
- Check firewall settings

### Can't save files
- Check folder permissions
- Ensure disk space available
- Try running as administrator

## Tips for Success

1. **Start Small** - Make simple games first
2. **Study Examples** - Learn from included game
3. **Test Often** - Build and test frequently
4. **Use Version Control** - Git is your friend
5. **Read Documentation** - GBDK docs are essential
6. **Join Community** - Ask questions, share progress
7. **Have Fun** - Game development should be enjoyable!

## Resources

### GBDK Documentation
- [GBDK-2020 GitHub](https://github.com/gbdk-2020/gbdk-2020)
- [GBDK API Reference](http://gbdk-2020.github.io/gbdk-2020/)
- [Pandocs](https://gbdev.io/pandocs/) - Game Boy hardware specs

### Tutorials
- [GB ASM Tutorial](https://eldred.fr/gb-asm-tutorial/)
- [Game Boy Development Wiki](https://gbdev.gg8.se/wiki/)
- [Awesome Game Boy Development](https://github.com/gbdev/awesome-gbdev)

### Tools
- [GBTD/GBMB](http://www.devrs.com/gb/hmgd/gbtd.html) - Tile/Map editors
- [BGB](https://bgb.bircd.org/) - Emulator/debugger
- [Hardware.inc](https://github.com/gbdk-2020/gbdk-2020/blob/develop/gbdk-lib/include/gb/hardware.h) - Register definitions

### Community
- [GBDev Discord](https://discord.gg/gpBxq85)
- [/r/Gameboy](https://reddit.com/r/Gameboy)
- [GBDev Forums](https://gbdev.gg8.se/forums/)

## What's Next?

Now that you've created your first Game Boy Color game, you can:

1. **Add More Features** - Sprites, sound, input handling
2. **Create Graphics** - Design tiles and sprites
3. **Build Levels** - Use the map editor
4. **Add Polish** - Menus, transitions, effects
5. **Share Your Game** - Release your ROM!

Happy developing! 🎮✨
