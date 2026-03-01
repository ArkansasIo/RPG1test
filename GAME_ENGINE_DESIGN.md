# Game Engine Design Document
## Labyrinth of the Dragon - Technical Architecture

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Core Systems](#core-systems)
4. [Memory Management](#memory-management)
5. [Rendering Pipeline](#rendering-pipeline)
6. [Game Loop](#game-loop)
7. [State Management](#state-management)
8. [Combat System](#combat-system)
9. [World System](#world-system)
10. [Data Structures](#data-structures)
11. [Asset Pipeline](#asset-pipeline)
12. [Performance Optimization](#performance-optimization)

---

## Executive Summary

Labyrinth of the Dragon is a turn-based RPG built for the Game Boy Color using GBDK-2020. The engine employs a modular architecture with distinct subsystems for rendering, combat, world exploration, and player progression. The design prioritizes memory efficiency, deterministic behavior, and maintainability within the constraints of 8-bit hardware.

### Key Technical Specifications

- **Platform**: Game Boy Color (backward compatible with DMG)
- **Language**: C (GBDK-2020 dialect)
- **ROM Size**: 512KB (32 banks × 16KB)
- **RAM Size**: 32KB (4 banks × 8KB)
- **Cartridge**: MBC5 with battery-backed SRAM
- **Frame Rate**: 60 FPS (16.67ms per frame)
- **Resolution**: 160×144 pixels (20×18 tiles)

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Main Game Loop                       │
│                      (main.c)                            │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │   State Machine         │
        │   (GameState enum)      │
        └────────────┬────────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
┌───▼────┐    ┌─────▼─────┐    ┌────▼─────┐
│ Title  │    │ Hero      │    │ World    │
│ Screen │    │ Select    │    │ Map      │
└────────┘    └───────────┘    └────┬─────┘
                                     │
                              ┌──────▼──────┐
                              │   Battle    │
                              │   System    │
                              └─────────────┘
```

### Module Dependencies

```
core.h (Foundation)
  ├── data.h (Binary Assets)
  ├── palette.h (Color Management)
  └── tables.h (Lookup Tables)
      │
      ├── stats.h (Combat Formulas)
      │   ├── player.h (Character System)
      │   ├── monster.h (Enemy System)
      │   └── item.h (Inventory System)
      │
      ├── encounter.h (Battle Logic)
      │   └── battle.h (Battle UI)
      │
      └── map.h (World System)
          ├── textbox.h (Dialog System)
          └── floor*.c (Level Data)
```

---

## Core Systems

### 1. Rendering Engine (core.c/h)

The rendering engine manages VRAM, tilesets, palettes, and sprites.

#### VRAM Layout

```
VRAM Bank 0 (Tiles):
  0x8000-0x87FF: Sprite tiles (0x00-0x7F)
  0x8800-0x8FFF: Shared tiles (0x80-0xFF) - Font
  0x9000-0x97FF: BG tiles (0x00-0x7F)

VRAM Bank 1 (Attributes):
  0x9800-0x9BFF: Background tilemap (32×32)
  0x9C00-0x9FFF: Window tilemap (32×32)
```

#### Tileset Management

```c
typedef enum TilesetType {
  TILESET_FONT,           // UI font and icons
  TILESET_BATTLE,         // Battle backgrounds
  TILESET_DUNGEON_PAGE_1, // Dungeon tiles (walls, floors)
  TILESET_DUNGEON_PAGE_2, // Dungeon objects (doors, chests)
  TILESET_DUNGEON_PAGE_3, // Dungeon decorations
  TILESET_HERO,           // Player sprites (4 directions)
  TILESET_MONSTER,        // Monster sprites
} TilesetType;
```

**Key Functions:**
- `load_tileset(type, bank)` - Loads tileset from ROM bank to VRAM
- `load_palette(palette, index)` - Loads 4-color palette to CGB hardware
- `fade_in()/fade_out()` - Smooth palette transitions
- `clear_screen(tile, attr)` - Fills screen with tile and attribute

#### Sprite System

- **40 hardware sprites** (8×8 or 8×16 pixels)
- **OAM (Object Attribute Memory)** - 160 bytes (4 bytes per sprite)
- **Sprite Priority** - Lower Y coordinate renders first
- **Palette Assignment** - 8 sprite palettes (OBP0-OBP7)

### 2. Input System (main.c)

```c
uint8_t joypad_down;     // Currently held buttons
uint8_t joypad_pressed;  // Newly pressed this frame
uint8_t joypad_released; // Released this frame

void update_joypad() {
  uint8_t current = joypad();
  joypad_pressed = current & ~joypad_down;
  joypad_released = joypad_down & ~current;
  joypad_down = current;
}
```

**Button Mapping:**
- `J_UP`, `J_DOWN`, `J_LEFT`, `J_RIGHT` - D-Pad
- `J_A` - Confirm / Attack
- `J_B` - Cancel / Back
- `J_START` - Pause
- `J_SELECT` - Menu

### 3. Sound System (sound.c/h)

Game Boy Color has 4 audio channels:
- **Channel 1**: Square wave with sweep
- **Channel 2**: Square wave
- **Channel 3**: Wavetable
- **Channel 4**: Noise

```c
void play_sfx(SoundEffect sfx);
void play_music(MusicTrack track);
void stop_music();
```

---

## Memory Management

### ROM Banking (MBC5)

```
Bank 0 (Fixed):
  - Core engine code
  - Main game loop
  - Interrupt handlers

Bank 1:
  - Title screen
  - Hero selection
  - Credits

Bank 2:
  - Map system
  - Floor common code

Bank 3:
  - Battle system
  - Encounter logic

Banks 4-31:
  - Floor data (maps, objects, scripts)
  - Monster tilesets
  - String data
  - Lookup tables
```

**Bank Switching:**
```c
SWITCH_ROM_BANK(bank_number);
// Access banked data
SWITCH_ROM_BANK(previous_bank);
```

### RAM Banking

```
Bank 0 (Fixed):
  - Global variables
  - Player data
  - Current map state

Banks 1-3 (Switchable):
  - Temporary buffers
  - Decompression workspace
  - Save game data
```

### Save System

Battery-backed SRAM stores:
- Player stats and inventory
- Floor progression
- Global flags (chests opened, levers pulled)
- Magic key count
- Torch gauge

```c
void save_game();
void load_game();
bool has_save_data();
```

---

## Rendering Pipeline

### Frame Timing

```
Frame (16.67ms)
  ├── VBlank Interrupt (1.1ms)
  │   ├── Update OAM (sprites)
  │   ├── Update palettes
  │   └── Swap buffers
  │
  └── Game Logic (15.57ms)
      ├── Input processing
      ├── State updates
      ├── Collision detection
      └── Prepare next frame
```

### Tile Rendering

```c
// Background tile update
set_bkg_tiles(x, y, width, height, tiles);
set_bkg_tile_xy(x, y, tile);

// Attribute update (CGB only)
VBK_REG = 1; // Switch to attribute bank
set_bkg_tiles(x, y, width, height, attrs);
VBK_REG = 0; // Switch back to tile bank
```

### Scrolling System

```c
typedef struct Camera {
  uint16_t x;  // World X position (pixels)
  uint16_t y;  // World Y position (pixels)
  uint8_t scx; // Hardware scroll X
  uint8_t scy; // Hardware scroll Y
} Camera;

void update_camera(Camera *cam, uint16_t target_x, uint16_t target_y);
```

---

## Game Loop

### Main Loop Structure

```c
void main() {
  init_engine();
  
  while (1) {
    update_joypad();
    
    switch (game_state) {
      case GAME_STATE_TITLE:
        update_title_screen();
        break;
      case GAME_STATE_HERO_SELECT:
        update_hero_select();
        break;
      case GAME_STATE_WORLD_MAP:
        update_world_map();
        break;
      case GAME_STATE_BATTLE:
        update_battle();
        break;
      case GAME_STATE_DEATH:
        update_death_screen();
        break;
      case GAME_STATE_CREDITS:
        update_credits();
        break;
    }
    
    wait_vbl_done();
  }
}
```

### State Transitions

```
TITLE → HERO_SELECT → WORLD_MAP ⇄ BATTLE
                           ↓
                        DEATH → TITLE
                           ↓
                        CREDITS → TITLE
```

---

## State Management

### Global State

```c
typedef enum GameState {
  GAME_STATE_TITLE,
  GAME_STATE_HERO_SELECT,
  GAME_STATE_WORLD_MAP,
  GAME_STATE_BATTLE,
  GAME_STATE_DEATH,
  GAME_STATE_CREDITS,
} GameState;

extern GameState game_state;
```

### Persistent Flags

```c
#define MAX_FLAGS 256
uint8_t global_flags[MAX_FLAGS / 8]; // Bit array

void set_flag(uint8_t flag_id);
void clear_flag(uint8_t flag_id);
bool check_flag(uint8_t flag_id);
```

**Flag Categories:**
- 0-63: Chests opened
- 64-95: Levers pulled
- 96-127: Doors unlocked
- 128-159: NPCs talked to
- 160-191: Quests completed
- 192-255: Misc events

---

## Combat System

### Battle Flow

```
1. Encounter Triggered
   ↓
2. Generate Monsters (layout, types, levels)
   ↓
3. Roll Initiative (player vs monsters)
   ↓
4. Turn Loop:
   ├── Player Turn
   │   ├── Display menu (Fight/Ability/Item/Flee)
   │   ├── Select action and target
   │   ├── Execute action
   │   └── Apply effects
   │
   ├── Monster 1 Turn
   │   ├── AI decision
   │   ├── Execute attack/ability
   │   └── Apply effects
   │
   ├── Monster 2 Turn (if active)
   └── Monster 3 Turn (if active)
   ↓
5. Check Victory/Defeat
   ↓
6. Award Experience/Items
   ↓
7. Return to World Map
```

### Initiative System

```c
typedef enum Turn {
  TURN_END,
  TURN_PLAYER,
  TURN_MONSTER1,
  TURN_MONSTER2,
  TURN_MONSTER3,
} Turn;

Turn roll_initiative(Player *player, Monster monsters[3]) {
  uint8_t player_init = player->agl + rand() % 20;
  uint8_t monster_init = monsters[0].agl + rand() % 20;
  
  return (player_init >= monster_init) ? TURN_PLAYER : TURN_MONSTER1;
}
```

### Damage Calculation

```c
uint16_t calculate_damage(
  uint16_t attacker_atk,
  uint16_t defender_def,
  PowerTier tier,
  DamageAspect aspect
) {
  // Base damage
  int16_t base = attacker_atk - defender_def;
  if (base < 1) base = 1;
  
  // Tier multiplier
  float multiplier = tier_multipliers[tier]; // 0.5, 1.0, 1.5, 2.0
  
  // Random variance (±10%)
  int16_t variance = (rand() % 20) - 10;
  
  // Apply aspect modifiers (immunity/resistance/vulnerability)
  base = apply_aspect_modifier(base, aspect, defender);
  
  return (uint16_t)(base * multiplier + variance);
}
```

### Status Effects

```c
typedef struct StatusEffectInstance {
  StatusEffect effect;  // Effect type
  uint8_t duration;     // Turns remaining (0xFF = perpetual)
  uint8_t power;        // Effect strength
} StatusEffectInstance;

#define MAX_ACTIVE_EFFECTS 4

typedef struct StatusEffects {
  StatusEffectInstance effects[MAX_ACTIVE_EFFECTS];
  uint8_t buff_flags;   // Bitmask of active buffs
  uint8_t debuff_flags; // Bitmask of active debuffs
} StatusEffects;
```

**Effect Application:**
```c
void apply_status_effect(
  StatusEffects *target,
  StatusEffect effect,
  uint8_t duration,
  uint8_t power
) {
  // Find empty slot
  for (int i = 0; i < MAX_ACTIVE_EFFECTS; i++) {
    if (target->effects[i].effect == NO_STATUS_EFFECT) {
      target->effects[i].effect = effect;
      target->effects[i].duration = duration;
      target->effects[i].power = power;
      
      // Update flag bitmask
      if (effect < 8) {
        target->debuff_flags |= FLAG(effect);
      } else {
        target->buff_flags |= FLAG(effect - 8);
      }
      break;
    }
  }
}
```

### Monster AI

```c
typedef struct Monster {
  MonsterType type;
  void (*take_turn)(Monster *self, Player *player, Monster others[3]);
  // ... other fields
} Monster;

// Example AI callback
void kobold_ai(Monster *self, Player *player, Monster others[3]) {
  // Simple: always attack player
  attack_target(self, player);
}

void mindflayer_ai(Monster *self, Player *player, Monster others[3]) {
  // Complex: use psychic blast if player HP > 50%, else basic attack
  if (player->hp > player->max_hp / 2) {
    use_ability(self, ABILITY_PSYCHIC_BLAST, player);
  } else {
    attack_target(self, player);
  }
}
```

---

## World System

### Map Structure

```c
typedef struct Map {
  uint8_t width;        // Map width in tiles
  uint8_t height;       // Map height in tiles
  uint8_t *tile_data;   // Tile IDs (width × height)
  uint8_t *attr_data;   // Attributes (width × height)
  uint8_t bank;         // ROM bank containing data
} Map;

typedef struct Floor {
  uint8_t id;
  Map *maps;            // Array of map pages
  uint8_t map_count;
  MapObject *objects;   // Interactive objects
  uint16_t object_count;
  void (*on_init)();    // Called when floor loads
  void (*on_special)(); // Called for special events
  void (*on_move)();    // Called after player moves
  void (*on_action)();  // Called when player presses A
} Floor;
```

### Map Objects

```c
typedef enum ObjectType {
  OBJ_CHEST,
  OBJ_DOOR,
  OBJ_LEVER,
  OBJ_SIGN,
  OBJ_SCONCE,
  OBJ_NPC,
  OBJ_EXIT,
} ObjectType;

typedef struct MapObject {
  uint16_t id;          // Unique object ID
  ObjectType type;
  uint8_t x, y;         // Tile position
  uint8_t flag_id;      // Global flag for state
  void (*on_interact)(); // Callback when activated
  const char *text;     // Dialog or description
} MapObject;
```

### Hash Table Lookup

```c
#define HASH_TABLE_SIZE 64

typedef struct HashEntry {
  uint16_t key;         // Object ID
  MapObject *object;    // Pointer to object
  struct HashEntry *next; // Collision chain
} HashEntry;

HashEntry *hash_table[HASH_TABLE_SIZE];

MapObject* find_object(uint16_t id) {
  uint8_t hash = id % HASH_TABLE_SIZE;
  HashEntry *entry = hash_table[hash];
  
  while (entry) {
    if (entry->key == id) return entry->object;
    entry = entry->next;
  }
  
  return NULL;
}
```

### Collision Detection

```c
bool is_tile_walkable(uint8_t tile_id) {
  // Lookup in collision table
  return collision_table[tile_id];
}

bool can_move_to(uint8_t x, uint8_t y) {
  uint8_t tile = get_tile_at(x, y);
  
  if (!is_tile_walkable(tile)) return false;
  
  // Check for objects blocking path
  MapObject *obj = find_object_at(x, y);
  if (obj && obj->type == OBJ_DOOR && !check_flag(obj->flag_id)) {
    return false; // Locked door
  }
  
  return true;
}
```

### Encounter System

```c
typedef struct EncounterTable {
  Odds odds;            // Probability (0-255)
  MonsterLayout layout; // 1, 2, 3S, or 1M+2S
  MonsterType monster1;
  uint8_t monster1_level;
  PowerTier monster1_tier;
  // ... monster2, monster3
} EncounterTable;

bool check_random_encounter() {
  uint8_t roll = rand() % 256;
  
  // Base encounter rate (configurable per floor)
  if (roll > encounter_rate) return false;
  
  // Select encounter from table
  EncounterTable *table = current_floor->encounters;
  uint16_t cumulative = 0;
  
  for (int i = 0; i < encounter_count; i++) {
    cumulative += table[i].odds;
    if (roll < cumulative) {
      start_battle(&table[i]);
      return true;
    }
  }
  
  return false;
}
```

---

## Data Structures

### Player

```c
typedef struct Player {
  PlayerClass class;
  uint8_t level;
  uint32_t exp;
  
  // Stats
  uint16_t max_hp;
  uint16_t hp;
  uint16_t max_sp;
  uint16_t sp;
  uint16_t atk;
  uint16_t def;
  uint16_t matk;
  uint16_t mdef;
  uint16_t agl;
  
  // Abilities
  uint8_t ability_flags;
  Ability abilities[MAX_ABILITIES];
  
  // Inventory
  Item inventory[8];
  uint8_t item_counts[8];
  
  // Resources
  uint8_t torch_gauge;
  uint8_t magic_keys;
  
  // Status
  StatusEffects status;
  uint8_t special_flags;
  
  // Position
  uint8_t floor_id;
  uint8_t map_id;
  uint8_t x, y;
  uint8_t direction;
} Player;
```

### Monster

```c
typedef struct Monster {
  MonsterType type;
  const Tileset *tileset;
  const char *name;
  bool active;
  const palette_color_t *palette;
  char id; // 'A', 'B', 'C' for multiple instances
  
  uint8_t level;
  uint8_t exp_level;
  PowerTier exp_tier;
  
  uint16_t max_hp;
  uint16_t hp;
  uint16_t target_hp; // For damage animation
  uint16_t atk;
  uint16_t def;
  uint16_t matk;
  uint16_t mdef;
  uint16_t agl;
  
  DamageAspect immunities;
  DamageAspect resistances;
  DamageAspect vulnerabilities;
  
  StatusEffects status;
  uint8_t special_flags;
  
  void (*take_turn)(Monster *self, Player *player, Monster others[3]);
} Monster;
```

---

## Asset Pipeline

### Build Process

```
1. Source Assets (assets/)
   ├── tiles/*.png
   ├── strings.js
   └── tables.csv

2. Asset Processing (tools/)
   ├── png2bin → res/tiles/*.bin
   ├── strings2c → data/strings.c
   └── tables2c → data/tables.c

3. Compilation (GBDK)
   ├── src/*.c → obj/*.o
   └── data/*.c → obj/*.o

4. Linking (lcc)
   └── obj/*.o → LabyrinthOfTheDragon.gbc
```

### String System

```javascript
// assets/strings.js
addNamespace('battle', 3, {
  'attack': 'Attack!',
  'critical': 'Critical Hit!',
  'miss': 'Miss!',
  'flee_success': 'Fled successfully!',
  'flee_fail': 'Could not escape!',
});
```

Generates:
```c
// data/strings_battle.c
#pragma bank 3

const char STR_BATTLE_ATTACK[] = "Attack!";
const char STR_BATTLE_CRITICAL[] = "Critical Hit!";
const char STR_BATTLE_MISS[] = "Miss!";
// ...
```

### Lookup Tables

```csv
# assets/tables.csv
level,c_tier_hp,b_tier_hp,a_tier_hp,s_tier_hp
1,10,15,20,25
2,12,18,24,30
3,14,21,28,35
...
```

Generates:
```c
// data/tables.c
const uint16_t HP_TABLE[4][99] = {
  {10, 12, 14, ...}, // C tier
  {15, 18, 21, ...}, // B tier
  {20, 24, 28, ...}, // A tier
  {25, 30, 35, ...}, // S tier
};
```

---

## Performance Optimization

### CPU Budget

- **Target**: 60 FPS (16.67ms per frame)
- **VBlank**: 1.1ms (unavoidable)
- **Game Logic**: 15.57ms available

### Optimization Techniques

1. **Lookup Tables** - Pre-calculate expensive operations
   ```c
   // Instead of: damage = (atk - def) * tier_mult
   // Use: damage = damage_table[tier][atk][def]
   ```

2. **Bank Switching** - Keep hot code in Bank 0
   ```c
   // Frequently called functions stay in fixed bank
   // Rarely used code moves to switchable banks
   ```

3. **Sprite Pooling** - Reuse sprite slots
   ```c
   #define MAX_SPRITES 40
   uint8_t sprite_pool[MAX_SPRITES];
   uint8_t next_sprite = 0;
   ```

4. **Dirty Flags** - Only redraw changed tiles
   ```c
   if (hp_changed) {
     update_hp_display();
     hp_changed = false;
   }
   ```

5. **Fixed-Point Math** - Avoid floating point
   ```c
   // Use: int16_t value = (a * b) >> 8; // 8.8 fixed point
   // Not: float value = a * b;
   ```

### Memory Optimization

1. **Const Data** - Store in ROM, not RAM
   ```c
   const uint8_t lookup_table[] = {...}; // ROM
   uint8_t buffer[256]; // RAM
   ```

2. **Bit Packing** - Use flags for booleans
   ```c
   uint8_t flags; // 8 booleans in 1 byte
   #define FLAG_ACTIVE FLAG(0)
   #define FLAG_VISIBLE FLAG(1)
   ```

3. **Shared Buffers** - Reuse temporary memory
   ```c
   uint8_t temp_buffer[256]; // Shared across systems
   ```

---

## Conclusion

The Labyrinth of the Dragon engine demonstrates efficient use of Game Boy Color hardware through modular design, careful memory management, and performance-conscious implementation. The architecture supports extensibility while maintaining the constraints of 8-bit development.

### Future Enhancements

- **Save Slots** - Multiple save files
- **New Game+** - Carry over stats to new playthrough
- **Bestiary** - Monster encyclopedia
- **Achievement System** - Track player accomplishments
- **Multiplayer** - Link cable battles
- **Randomizer Mode** - Procedural dungeon generation

---

**Document Version**: 1.0  
**Last Updated**: 2026-03-01  
**Author**: Game Engine Team
