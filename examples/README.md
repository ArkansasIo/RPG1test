# Enchantment Engine - Example Games

This folder contains complete example games that demonstrate the capabilities of the Enchantment Engine.

## Labyrinth of the Dragon

A complete Game Boy Color RPG featuring:

- **Turn-Based Combat System** - Strategic battles with initiative rolls
- **4 Character Classes** - Druid, Fighter, Monk, Sorcerer
- **12 Monster Types** - From Kobolds to Dragons
- **8 Dungeon Floors** - Interconnected levels with puzzles
- **Status Effects** - 16 different buffs and debuffs
- **Elemental Damage** - 8 damage aspects
- **Item System** - Potions, ethers, remedies
- **Resource Management** - Torches and magic keys

### Project Structure

```
LabyrinthOfTheDragon/
├── src/                        # C source files
│   ├── main.c                 # Entry point
│   ├── battle.c               # Combat system
│   ├── core.c                 # Core engine
│   ├── floor*.c               # Dungeon floors
│   ├── monster.*.c            # Monster AI and data
│   ├── player.c               # Player management
│   └── ...
├── assets/                     # Game assets
│   ├── tiles/                 # Graphics
│   ├── art/                   # Source artwork
│   └── strings.js             # Game text
├── data/                       # Generated data
├── res/                        # Resources
├── build/                      # Build output
├── obj/                        # Object files
├── tools/                      # Build tools
├── Makefile                    # Build configuration
└── LabyrinthOfTheDragon.gbc   # Compiled ROM
```

### Building the Game

#### Using the IDE
1. Launch `bin/EnchantmentEngine.exe`
2. Open the `examples/LabyrinthOfTheDragon` folder
3. Click "Build ROM" in the IDE
4. Test in the built-in emulator

#### Using Command Line
```bash
cd examples/LabyrinthOfTheDragon
make clean
make assets
make
```

### Playing the Game

#### In the IDE
1. Build the ROM
2. Click "Emulator" tab
3. Game loads automatically

#### On Real Hardware
1. Copy `LabyrinthOfTheDragon.gbc` to flash cart
2. Play on Game Boy Color or Game Boy Advance

#### In External Emulator
- **BGB** (Windows) - Best accuracy
- **SameBoy** (Cross-platform) - Great debugger
- **mGBA** (Cross-platform) - Fast and accurate

### Learning from the Code

This example demonstrates:

1. **Game Architecture**
   - State management
   - Scene transitions
   - Memory banking
   - Data organization

2. **Combat System**
   - Turn-based mechanics
   - Initiative system
   - Damage calculation
   - Status effects
   - AI behavior

3. **World System**
   - Dungeon generation
   - Map navigation
   - Collision detection
   - Tile-based rendering

4. **UI System**
   - Text rendering
   - Menu system
   - Dialog boxes
   - HUD elements

5. **Asset Pipeline**
   - Tile conversion
   - Map generation
   - String management
   - Data tables

### Key Files to Study

#### Core Systems
- `src/core.c` - Main game loop and state management
- `src/main.c` - Entry point and initialization

#### Combat
- `src/battle.c` - Combat system implementation
- `src/monster.core.c` - Monster AI and behavior
- `src/player.c` - Player stats and actions

#### World
- `src/floor*.c` - Individual dungeon floors
- `src/map.c` - Map rendering and navigation
- `src/encounter.c` - Random encounters

#### UI
- `src/textbox.c` - Dialog system
- `src/text_writer.c` - Text rendering
- `src/main_menu.c` - Menu system

### Modifying the Game

#### Change Character Stats
Edit `src/player.data.c`:
```c
const PlayerClass player_classes[] = {
    {CLASS_FIGHTER, 100, 50, 10, 15, 8},  // HP, MP, ATK, DEF, SPD
    // ...
};
```

#### Add New Monsters
Edit `src/monster.data.c`:
```c
const Monster monsters[] = {
    {MONSTER_GOBLIN, 30, 0, 8, 5, 6, AI_AGGRESSIVE},
    // ...
};
```

#### Modify Dungeon Layouts
Edit `src/floor*.c` files to change level designs

#### Change Game Text
Edit `assets/strings.js` and rebuild

### Technical Details

#### Memory Banks
- Bank 0: Core engine
- Bank 1: Title screen
- Bank 2-5: Dungeon floors
- Bank 6-7: Monster data

#### ROM Size
- Approximately 256 KB
- Uses MBC5 mapper
- Supports Game Boy Color only

#### Build Time
- Clean build: ~30 seconds
- Incremental: ~5 seconds

### Credits

**Original Game Design**
- Game mechanics and balance
- Dungeon layouts
- Monster AI

**Art and Graphics**
- Character sprites
- Tile sets
- UI elements

**Programming**
- C implementation
- GBDK integration
- Build system

### License

See main LICENSE file for details.

## Creating Your Own Example

Want to add your own example game?

1. Create a new folder in `examples/`
2. Set up the project structure
3. Add a README.md
4. Include source code and assets
5. Test with the Enchantment Engine
6. Submit a pull request!

### Example Template

```
examples/
└── YourGame/
    ├── README.md              # Game description
    ├── src/                   # Source code
    ├── assets/                # Graphics and data
    ├── Makefile               # Build config
    └── YourGame.gbc          # Compiled ROM
```

## More Examples Coming Soon!

We're working on additional examples:
- **Platformer** - Side-scrolling action
- **Puzzle Game** - Match-3 mechanics
- **Shooter** - Top-down space shooter
- **Adventure** - Zelda-style exploration

Stay tuned!
