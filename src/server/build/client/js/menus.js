(function() {
  "use strict";

  const menuData = [
    {
      label: 'File', items: [
        { label: 'New Project...', icon: '📄', action: 'newProject' },
        { label: 'Open Project...', icon: '📂', action: 'openProject' },
        { label: 'Save Project', icon: '💾', shortcut: 'Ctrl+S', action: 'saveProject' },
        { label: 'Save All', icon: '💾', shortcut: 'Ctrl+Shift+S', action: 'saveAll' },
        'sep',
        { label: 'Import', icon: '📥', children: [
          { label: 'ROM File (.gb/.gbc)', icon: '🎮', action: 'importRom' },
          { label: 'Tile Sheet (.png)', icon: '🖼', action: 'importTile' },
          { label: 'Tilemap Data', icon: '🗺', action: 'importTilemap' },
          { label: 'String Data (.js)', icon: '📝', action: 'importStrings' },
          { label: 'Table Data (.csv)', icon: '📊', action: 'importTables' },
          'sep',
          { label: 'NES CHR File', icon: '🕹', action: 'importCHR' },
          { label: 'Game Boy 2BPP File', icon: '🎮', action: 'import2BPP' },
        ]},
        { label: 'Export', icon: '📤', children: [
          { label: 'Export ROM', icon: '🎮', action: 'exportRom' },
          { label: 'Export Tile Sheets', icon: '🖼', action: 'exportTiles' },
          { label: 'Export All Assets', icon: '📦', action: 'exportAllAssets' },
          'sep',
          { label: 'Export as NES ROM', icon: '🕹', action: 'exportNES', disabled: true },
        ]},
        'sep',
        { label: 'Project Settings...', icon: '⚙', action: 'projectSettings' },
        'sep',
        { label: 'Recent Files', icon: '🕐', children: [
          { label: '(No recent files)', disabled: true },
        ]},
      ]
    },
    {
      label: 'Edit', items: [
        { label: 'Undo', icon: '↩', shortcut: 'Ctrl+Z', action: 'undo' },
        { label: 'Redo', icon: '↪', shortcut: 'Ctrl+Y', action: 'redo' },
        'sep',
        { label: 'Cut', icon: '✂', shortcut: 'Ctrl+X', action: 'cut' },
        { label: 'Copy', icon: '📋', shortcut: 'Ctrl+C', action: 'copy' },
        { label: 'Paste', icon: '📌', shortcut: 'Ctrl+V', action: 'paste' },
        { label: 'Delete', icon: '🗑', shortcut: 'Del', action: 'delete' },
        'sep',
        { label: 'Select All', shortcut: 'Ctrl+A', action: 'selectAll' },
        { label: 'Find & Replace...', icon: '🔍', shortcut: 'Ctrl+F', action: 'findReplace' },
        'sep',
        { label: 'Preferences...', icon: '⚙', action: 'preferences' },
      ]
    },
    {
      label: 'View', items: [
        { label: 'Panels', icon: '📐', children: [
          { label: 'Emulator', icon: '🎮', action: 'panel:emulator' },
          { label: 'Tile Editor', icon: '🖼', action: 'panel:tiles' },
          { label: 'Map Editor', icon: '🗺', action: 'panel:maps' },
          { label: 'String Editor', icon: '📝', action: 'panel:strings' },
          { label: 'Table Editor', icon: '📊', action: 'panel:tables' },
          { label: 'Source Editor', icon: '💻', action: 'panel:source' },
          { label: 'Build Console', icon: '🔨', action: 'panel:build' },
          'sep',
          { label: 'D&D Character Sheet', icon: '🛡', action: 'dnd:characterCreator' },
          { label: 'D&D Monster Browser', icon: '🐉', action: 'dnd:monsterBrowser' },
          { label: 'D&D Encounter Builder', icon: '⚔', action: 'dnd:encounterBuilder' },
          { label: 'D&D Spells & Items', icon: '✨', action: 'dnd:spellDatabase' },
        ]},
        'sep',
        { label: 'Zoom In', shortcut: 'Ctrl++', action: 'zoomIn' },
        { label: 'Zoom Out', shortcut: 'Ctrl+-', action: 'zoomOut' },
        { label: 'Reset Zoom', shortcut: 'Ctrl+0', action: 'zoomReset' },
        'sep',
        { label: 'Toggle Fullscreen', shortcut: 'F11', action: 'toggleFullscreen' },
        { label: 'Toggle Status Bar', action: 'toggleStatusBar' },
        { label: 'Toggle Sidebar', action: 'toggleSidebar' },
      ]
    },
    {
      label: 'Assets', items: [
        { label: 'Tile Manager', icon: '🖼', children: [
          { label: 'Import Tile Sheet...', action: 'importTile' },
          { label: 'New Tile Sheet (8x8)', action: 'newTileSheet8' },
          { label: 'New Tile Sheet (16x16)', action: 'newTileSheet16' },
          'sep',
          { label: 'Tile Palette Editor', action: 'tilePaletteEditor' },
          { label: 'Tile Animation Preview', action: 'tileAnimPreview' },
          { label: 'Export All Tiles', action: 'exportTiles' },
        ]},
        { label: 'Tilemap Editor', icon: '🗺', children: [
          { label: 'Import Tilemap...', action: 'importTilemap' },
          { label: 'New Tilemap...', action: 'newTilemap' },
          { label: 'Tilemap Properties', action: 'tilemapProps' },
          'sep',
          { label: 'Auto-Tile Config', action: 'autoTile' },
          { label: 'Collision Layer Editor', action: 'collisionLayer' },
        ]},
        { label: 'Sprite Manager', icon: '🎭', children: [
          { label: 'Import Sprites...', action: 'importSprites' },
          { label: 'Sprite Animation Editor', action: 'spriteAnimEditor' },
          { label: 'Sprite Sheet Packer', action: 'spriteSheetPacker' },
          { label: 'OAM Layout Viewer', action: 'oamLayout' },
        ]},
        { label: 'Palette Manager', icon: '🎨', children: [
          { label: 'GBC Palette Editor', action: 'gbcPaletteEditor' },
          { label: 'NES Palette Editor', action: 'nesPaletteEditor' },
          { label: 'DMG Palette Editor', action: 'dmgPaletteEditor' },
          'sep',
          { label: 'Import Palette...', action: 'importPalette' },
          { label: 'Export Palette', action: 'exportPalette' },
        ]},
        'sep',
        { label: 'Build Assets', icon: '⚡', action: 'buildAssets' },
        { label: 'Rebuild All Assets', icon: '🔄', action: 'rebuildAssets' },
        { label: 'Clean Asset Cache', icon: '🧹', action: 'cleanAssets' },
      ]
    },
    {
      label: 'GB/NES Tools', items: [
        { section: 'HARDWARE TOOLS' },
        { label: 'Memory Viewer', icon: '🔍', action: 'tool:memoryViewer' },
        { label: 'Register Inspector', icon: '📟', action: 'tool:registerInspector' },
        { label: 'VRAM Viewer', icon: '🖥', action: 'tool:vramViewer' },
        { label: 'OAM Viewer', icon: '👾', action: 'tool:oamViewer' },
        { label: 'Tile Data Viewer', icon: '🔲', action: 'tool:tileDataViewer' },
        { label: 'BG Map Viewer', icon: '🗺', action: 'tool:bgMapViewer' },
        'sep',
        { section: 'AUDIO TOOLS' },
        { label: 'Sound Channel Editor', icon: '🎵', children: [
          { label: 'CH1 - Square + Sweep', action: 'tool:soundCH1' },
          { label: 'CH2 - Square', action: 'tool:soundCH2' },
          { label: 'CH3 - Wave', action: 'tool:soundCH3' },
          { label: 'CH4 - Noise', action: 'tool:soundCH4' },
        ]},
        { label: 'Music Composer', icon: '🎼', action: 'tool:musicComposer' },
        { label: 'SFX Editor', icon: '🔊', action: 'tool:sfxEditor' },
        { label: 'Wave Pattern Editor', icon: '〰', action: 'tool:waveEditor' },
        'sep',
        { section: 'GRAPHICS TOOLS' },
        { label: '2BPP Tile Converter', icon: '🔄', action: 'tool:2bppConverter' },
        { label: 'CHR/NES Tile Converter', icon: '🔄', action: 'tool:chrConverter' },
        { label: 'Color Palette Tool', icon: '🎨', action: 'tool:colorPalette' },
        { label: 'Sprite Animator', icon: '🎬', action: 'tool:spriteAnimator' },
        { label: 'BG Layer Composer', icon: '🏞', action: 'tool:bgComposer' },
        'sep',
        { section: 'ROM TOOLS' },
        { label: 'ROM Header Editor', icon: '📋', action: 'tool:romHeader' },
        { label: 'Bank Manager', icon: '🏦', action: 'tool:bankManager' },
        { label: 'ROM Size Calculator', icon: '📐', action: 'tool:romSizeCalc' },
        { label: 'Checksum Validator', icon: '✅', action: 'tool:checksumValidator' },
        { label: 'Hex Viewer', icon: '🔢', action: 'tool:hexViewer' },
        'sep',
        { section: 'DEVELOPMENT' },
        { label: 'Disassembler', icon: '🔧', action: 'tool:disassembler' },
        { label: 'Memory Map', icon: '📊', action: 'tool:memoryMap' },
        { label: 'Breakpoint Manager', icon: '🔴', action: 'tool:breakpoints' },
        { label: 'Performance Profiler', icon: '📈', action: 'tool:profiler' },
      ]
    },
    {
      label: 'Game Engine', items: [
        { section: 'SCENE SYSTEM' },
        { label: 'Scene Manager', icon: '🎬', action: 'engine:sceneManager' },
        { label: 'Scene Properties', icon: '📋', action: 'engine:sceneProps' },
        { label: 'Scene Transitions', icon: '🔄', children: [
          { label: 'Fade In/Out', action: 'engine:transFade' },
          { label: 'Slide Left/Right', action: 'engine:transSlide' },
          { label: 'Wipe', action: 'engine:transWipe' },
          { label: 'Custom Transition', action: 'engine:transCustom' },
        ]},
        'sep',
        { section: 'ENTITY SYSTEM' },
        { label: 'Entity Editor', icon: '👤', action: 'engine:entityEditor' },
        { label: 'Component Browser', icon: '🧩', action: 'engine:componentBrowser' },
        { label: 'Prefab Manager', icon: '📦', action: 'engine:prefabManager' },
        { label: 'Entity Inspector', icon: '🔍', action: 'engine:entityInspector' },
        'sep',
        { section: 'SCRIPTING' },
        { label: 'Event Editor', icon: '⚡', action: 'engine:eventEditor' },
        { label: 'Variable Manager', icon: '📝', action: 'engine:variableManager' },
        { label: 'Script Console', icon: '💻', action: 'engine:scriptConsole' },
        { label: 'State Machine Editor', icon: '🔀', action: 'engine:stateMachine' },
        { label: 'Trigger System', icon: '🎯', action: 'engine:triggerSystem' },
        'sep',
        { section: 'PHYSICS & COLLISION' },
        { label: 'Collision Editor', icon: '💥', action: 'engine:collisionEditor' },
        { label: 'Hitbox Tool', icon: '🔲', action: 'engine:hitboxTool' },
        { label: 'Movement System', icon: '🏃', action: 'engine:movementSystem' },
        { label: 'Pathfinding Config', icon: '🛤', action: 'engine:pathfinding' },
        'sep',
        { section: 'UI SYSTEM' },
        { label: 'Text Box Editor', icon: '💬', action: 'engine:textboxEditor' },
        { label: 'Menu Designer', icon: '📋', action: 'engine:menuDesigner' },
        { label: 'HUD Layout', icon: '🖥', action: 'engine:hudLayout' },
        { label: 'Dialog Tree Editor', icon: '🌳', action: 'engine:dialogTree' },
        { label: 'Font Manager', icon: '🔤', action: 'engine:fontManager' },
        'sep',
        { section: 'SAVE SYSTEM' },
        { label: 'SRAM Layout', icon: '💾', action: 'engine:sramLayout' },
        { label: 'Save Slot Manager', icon: '🗃', action: 'engine:saveSlotManager' },
        { label: 'Checksum Config', icon: '🔒', action: 'engine:checksumConfig' },
      ]
    },
    {
      label: 'Genre', items: [
        { section: 'GAME GENRE' },
        { label: 'RPG', icon: '⚔', action: 'genre:rpg', checked: true },
        { label: 'Action RPG', icon: '🗡', action: 'genre:action_rpg' },
        { label: 'Platformer', icon: '🏃', action: 'genre:platformer' },
        { label: 'Action/Adventure', icon: '🎯', action: 'genre:action' },
        { label: 'Shooter (Top-Down)', icon: '🔫', action: 'genre:shooter' },
        { label: 'Racing', icon: '🏎', action: 'genre:racing' },
        { label: 'Puzzle', icon: '🧩', action: 'genre:puzzle' },
        { label: 'Fighting', icon: '🥊', action: 'genre:fighting' },
        { label: 'Strategy/Tactics', icon: '♟', action: 'genre:strategy' },
        { label: 'Simulation', icon: '🏗', action: 'genre:simulation' },
        { label: 'Horror/Survival', icon: '👻', action: 'genre:horror' },
        { label: 'Visual Novel', icon: '📖', action: 'genre:visual_novel' },
        { label: 'Roguelike', icon: '💀', action: 'genre:roguelike' },
        { label: 'MMORPG', icon: '🌐', action: 'genre:mmorpg' },
        { label: 'Sandbox', icon: '🏜', action: 'genre:sandbox' },
        { label: 'Metroidvania', icon: '🗺', action: 'genre:metroidvania' },
        { label: 'Rhythm', icon: '🎵', action: 'genre:rhythm' },
        { label: 'Sports', icon: '⚽', action: 'genre:sports' },
        'sep',
        { section: 'RPG MAKER TOOLS' },
        { label: 'RPG Maker Studio', icon: '🎮', children: [
          { label: 'Map Editor', icon: '🗺', action: 'rpgmaker:mapEditor' },
          { label: 'Event Editor', icon: '⚡', action: 'rpgmaker:eventEditor' },
          { label: 'Database', icon: '📊', children: [
            { label: 'Actors', action: 'rpgmaker:db:actors' },
            { label: 'Classes', action: 'rpgmaker:db:classes' },
            { label: 'Skills', action: 'rpgmaker:db:skills' },
            { label: 'Items', action: 'rpgmaker:db:items' },
            { label: 'Weapons', action: 'rpgmaker:db:weapons' },
            { label: 'Armor', action: 'rpgmaker:db:armor' },
            { label: 'Enemies', action: 'rpgmaker:db:enemies' },
            { label: 'Troops', action: 'rpgmaker:db:troops' },
            { label: 'States', action: 'rpgmaker:db:states' },
            { label: 'Animations', action: 'rpgmaker:db:animations' },
            { label: 'Tilesets', action: 'rpgmaker:db:tilesets' },
            { label: 'Common Events', action: 'rpgmaker:db:commonEvents' },
            { label: 'System', action: 'rpgmaker:db:system' },
          ]},
          { label: 'Tileset Config', icon: '🧱', action: 'rpgmaker:tilesetConfig' },
          { label: 'Character Generator', icon: '👤', action: 'rpgmaker:charGen' },
          { label: 'Playtest', icon: '▶', action: 'rpgmaker:playtest' },
        ]},
      ]
    },
    {
      label: 'D&D 5e', items: [
        { section: 'CHARACTERS (PHB)' },
        { label: 'Character Creator', icon: '🛡', action: 'dnd:characterCreator' },
        { label: 'Class Builder', icon: '⚔', children: [
          { label: 'Barbarian', action: 'dnd:class:barbarian' },
          { label: 'Bard', action: 'dnd:class:bard' },
          { label: 'Cleric', action: 'dnd:class:cleric' },
          { label: 'Druid', action: 'dnd:class:druid' },
          { label: 'Fighter', action: 'dnd:class:fighter' },
          { label: 'Monk', action: 'dnd:class:monk' },
          { label: 'Paladin', action: 'dnd:class:paladin' },
          { label: 'Ranger', action: 'dnd:class:ranger' },
          { label: 'Rogue', action: 'dnd:class:rogue' },
          { label: 'Sorcerer', action: 'dnd:class:sorcerer' },
          { label: 'Warlock', action: 'dnd:class:warlock' },
          { label: 'Wizard', action: 'dnd:class:wizard' },
          'sep',
          { label: 'Artificer (TCE)', action: 'dnd:class:artificer' },
        ]},
        { label: 'Race Editor', icon: '👥', children: [
          { label: 'Human', action: 'dnd:race:human' },
          { label: 'Elf (High/Wood/Dark)', action: 'dnd:race:elf' },
          { label: 'Dwarf (Hill/Mountain)', action: 'dnd:race:dwarf' },
          { label: 'Halfling (Lightfoot/Stout)', action: 'dnd:race:halfling' },
          { label: 'Gnome (Forest/Rock)', action: 'dnd:race:gnome' },
          { label: 'Half-Elf', action: 'dnd:race:halfelf' },
          { label: 'Half-Orc', action: 'dnd:race:halforc' },
          { label: 'Tiefling', action: 'dnd:race:tiefling' },
          { label: 'Dragonborn', action: 'dnd:race:dragonborn' },
          'sep',
          { label: 'Aasimar (VGM)', action: 'dnd:race:aasimar' },
          { label: 'Goliath (VGM)', action: 'dnd:race:goliath' },
          { label: 'Tabaxi (VGM)', action: 'dnd:race:tabaxi' },
          { label: 'Kenku (VGM)', action: 'dnd:race:kenku' },
          { label: 'Firbolg (VGM)', action: 'dnd:race:firbolg' },
          { label: 'Tortle (TP)', action: 'dnd:race:tortle' },
          { label: 'Custom Race...', action: 'dnd:race:custom' },
        ]},
        { label: 'Background Editor', icon: '📜', action: 'dnd:backgrounds' },
        { label: 'Feat Browser', icon: '⭐', action: 'dnd:feats' },
        { label: 'Ability Score Calculator', icon: '🎲', action: 'dnd:abilityCalc' },
        { label: 'Level Up Manager', icon: '📈', action: 'dnd:levelUp' },
        { label: 'Multiclass Planner', icon: '🔀', action: 'dnd:multiclass' },
        'sep',
        { section: 'MONSTERS (MM/VGM/MTF)' },
        { label: 'Monster Manual Browser', icon: '🐉', action: 'dnd:monsterBrowser' },
        { label: 'Stat Block Editor', icon: '📋', action: 'dnd:statBlockEditor' },
        { label: 'CR Calculator', icon: '⚖', action: 'dnd:crCalculator' },
        { label: 'Custom Monster Creator', icon: '🐲', action: 'dnd:customMonster' },
        { label: 'Legendary/Lair Actions', icon: '👑', action: 'dnd:legendaryActions' },
        { label: 'Monster by Type', icon: '📂', children: [
          { label: 'Aberration', action: 'dnd:montype:aberration' },
          { label: 'Beast', action: 'dnd:montype:beast' },
          { label: 'Celestial', action: 'dnd:montype:celestial' },
          { label: 'Construct', action: 'dnd:montype:construct' },
          { label: 'Dragon', action: 'dnd:montype:dragon' },
          { label: 'Elemental', action: 'dnd:montype:elemental' },
          { label: 'Fey', action: 'dnd:montype:fey' },
          { label: 'Fiend', action: 'dnd:montype:fiend' },
          { label: 'Giant', action: 'dnd:montype:giant' },
          { label: 'Humanoid', action: 'dnd:montype:humanoid' },
          { label: 'Monstrosity', action: 'dnd:montype:monstrosity' },
          { label: 'Ooze', action: 'dnd:montype:ooze' },
          { label: 'Plant', action: 'dnd:montype:plant' },
          { label: 'Undead', action: 'dnd:montype:undead' },
        ]},
        'sep',
        { section: 'ENCOUNTERS (DMG)' },
        { label: 'Encounter Builder', icon: '⚔', action: 'dnd:encounterBuilder' },
        { label: 'Initiative Tracker', icon: '🎯', action: 'dnd:initiativeTracker' },
        { label: 'Difficulty Calculator', icon: '📊', action: 'dnd:difficultyCalc' },
        { label: 'Random Encounter Tables', icon: '🎲', action: 'dnd:randomEncounters' },
        { label: 'Boss Fight Designer', icon: '👑', action: 'dnd:bossFight' },
        'sep',
        { section: 'ITEMS & EQUIPMENT (DMG/PHB)' },
        { label: 'Weapon Editor', icon: '⚔', action: 'dnd:weaponEditor' },
        { label: 'Armor Editor', icon: '🛡', action: 'dnd:armorEditor' },
        { label: 'Magic Item Creator', icon: '✨', action: 'dnd:magicItemCreator' },
        { label: 'Potion Brewer', icon: '🧪', action: 'dnd:potionBrewer' },
        { label: 'Scroll Scriber', icon: '📜', action: 'dnd:scrollScriber' },
        { label: 'Treasure Generator', icon: '💰', action: 'dnd:treasureGen' },
        { label: 'Shop Inventory Manager', icon: '🏪', action: 'dnd:shopInventory' },
        { label: 'Magic Item Tables', icon: '📋', children: [
          { label: 'Table A (Minor, Common)', action: 'dnd:magictable:a' },
          { label: 'Table B (Minor, Uncommon)', action: 'dnd:magictable:b' },
          { label: 'Table C (Minor, Rare)', action: 'dnd:magictable:c' },
          { label: 'Table D (Major, Uncommon)', action: 'dnd:magictable:d' },
          { label: 'Table E (Major, Rare)', action: 'dnd:magictable:e' },
          { label: 'Table F (Major, Very Rare)', action: 'dnd:magictable:f' },
          { label: 'Table G (Major, Legendary)', action: 'dnd:magictable:g' },
          { label: 'Table H (Minor, Very Rare)', action: 'dnd:magictable:h' },
          { label: 'Table I (Minor, Legendary)', action: 'dnd:magictable:i' },
        ]},
        'sep',
        { section: 'SPELLS (PHB/XGE/TCE)' },
        { label: 'Spell Database', icon: '📖', action: 'dnd:spellDatabase' },
        { label: 'Spell Creator', icon: '✨', action: 'dnd:spellCreator' },
        { label: 'Spell Slot Tracker', icon: '🔮', action: 'dnd:spellSlots' },
        { label: 'Concentration Manager', icon: '🧠', action: 'dnd:concentration' },
        { label: 'Spells by Class', icon: '📂', children: [
          { label: 'Bard Spells', action: 'dnd:spells:bard' },
          { label: 'Cleric Spells', action: 'dnd:spells:cleric' },
          { label: 'Druid Spells', action: 'dnd:spells:druid' },
          { label: 'Paladin Spells', action: 'dnd:spells:paladin' },
          { label: 'Ranger Spells', action: 'dnd:spells:ranger' },
          { label: 'Sorcerer Spells', action: 'dnd:spells:sorcerer' },
          { label: 'Warlock Spells', action: 'dnd:spells:warlock' },
          { label: 'Wizard Spells', action: 'dnd:spells:wizard' },
          { label: 'Artificer Spells', action: 'dnd:spells:artificer' },
        ]},
        { label: 'Spells by Level', icon: '📊', children: [
          { label: 'Cantrips (0)', action: 'dnd:spelllvl:0' },
          { label: '1st Level', action: 'dnd:spelllvl:1' },
          { label: '2nd Level', action: 'dnd:spelllvl:2' },
          { label: '3rd Level', action: 'dnd:spelllvl:3' },
          { label: '4th Level', action: 'dnd:spelllvl:4' },
          { label: '5th Level', action: 'dnd:spelllvl:5' },
          { label: '6th Level', action: 'dnd:spelllvl:6' },
          { label: '7th Level', action: 'dnd:spelllvl:7' },
          { label: '8th Level', action: 'dnd:spelllvl:8' },
          { label: '9th Level', action: 'dnd:spelllvl:9' },
        ]},
        { label: 'Spells by School', icon: '🏫', children: [
          { label: 'Abjuration', action: 'dnd:school:abjuration' },
          { label: 'Conjuration', action: 'dnd:school:conjuration' },
          { label: 'Divination', action: 'dnd:school:divination' },
          { label: 'Enchantment', action: 'dnd:school:enchantment' },
          { label: 'Evocation', action: 'dnd:school:evocation' },
          { label: 'Illusion', action: 'dnd:school:illusion' },
          { label: 'Necromancy', action: 'dnd:school:necromancy' },
          { label: 'Transmutation', action: 'dnd:school:transmutation' },
        ]},
        'sep',
        { section: 'PIXEL ART STUDIO' },
        { label: 'D&D Pixel Art Editor', icon: '🎨', action: 'dnd:pixelArt' },
        'sep',
        { section: 'WORLD BUILDING (DMG)' },
        { label: 'Dungeon Generator', icon: '🏰', action: 'dnd:dungeonGen' },
        { label: 'Room Editor', icon: '🚪', action: 'dnd:roomEditor' },
        { label: 'Trap Designer', icon: '⚠', action: 'dnd:trapDesigner' },
        { label: 'Puzzle Creator', icon: '🧩', action: 'dnd:puzzleCreator' },
        { label: 'NPC Generator', icon: '👤', action: 'dnd:npcGen' },
        { label: 'Faction Manager', icon: '🏴', action: 'dnd:factionManager' },
        { label: 'Calendar & Time', icon: '📅', action: 'dnd:calendar' },
        { label: 'Weather System', icon: '🌤', action: 'dnd:weather' },
        'sep',
        { section: 'RULES REFERENCE (PHB/DMG)' },
        { label: 'Combat Rules', icon: '⚔', action: 'dnd:ref:combat' },
        { label: 'Conditions Reference', icon: '📋', action: 'dnd:ref:conditions' },
        { label: 'Actions in Combat', icon: '🎯', action: 'dnd:ref:actions' },
        { label: 'Movement & Travel', icon: '🚶', action: 'dnd:ref:movement' },
        { label: 'Resting Rules', icon: '🛏', action: 'dnd:ref:resting' },
        { label: 'Death & Dying', icon: '💀', action: 'dnd:ref:death' },
        { label: 'Skills & Abilities', icon: '📊', action: 'dnd:ref:skills' },
        { label: 'Saving Throws', icon: '🎲', action: 'dnd:ref:saves' },
        { label: 'Cover Rules', icon: '🧱', action: 'dnd:ref:cover' },
        { label: 'Exhaustion Levels', icon: '😴', action: 'dnd:ref:exhaustion' },
      ]
    },
    {
      label: 'Sorc Tools', items: [
        { section: 'SPRITE TOOLS' },
        { label: 'Auto-Sprite', icon: '🎬', action: 'sorc:autoSprite' },
        { label: 'Sprite Analyzer', icon: '🔬', action: 'sorc:spriteAnalyzer' },
        { label: 'Slicer', icon: '✂', action: 'sorc:slicer' },
        { label: 'Quick Sprites', icon: '⚡', action: 'sorc:quickSprites' },
        'sep',
        { section: 'ART & PIXEL TOOLS' },
        { label: 'True Pixel', icon: '🎨', action: 'sorc:truePixel' },
        { label: 'Canvas', icon: '🖌', action: 'sorc:canvas' },
        { label: 'Tileset Forge', icon: '🧱', action: 'sorc:tilesetForge' },
        { label: 'Seamless Tile Gen', icon: '🔲', action: 'sorc:seamlessTile' },
        { label: 'BG Remover', icon: '🧹', action: 'sorc:bgRemover' },
        { label: 'Expander', icon: '↔', action: 'sorc:expander' },
        'sep',
        { section: '3D & ANIMATION' },
        { label: '3D to 2D', icon: '📐', action: 'sorc:3dto2d' },
        { label: 'Creature Rigging', icon: '🦎', action: 'sorc:creatureRig' },
        'sep',
        { section: 'AUDIO' },
        { label: 'SFX Editor', icon: '🔊', action: 'sorc:sfxEditor' },
        'sep',
        { section: 'UTILITIES' },
        { label: 'Batch Utilities', icon: '📦', action: 'sorc:batchUtils' },
        { label: 'Notes', icon: '📝', action: 'sorc:notes' },
        { label: 'Layout Preview', icon: '📱', action: 'sorc:layoutPreview' },
      ]
    },
    {
      label: 'Build', items: [
        { label: 'Build Assets', icon: '⚡', shortcut: 'Ctrl+Shift+A', action: 'buildAssets' },
        { label: 'Compile ROM', icon: '🔨', shortcut: 'Ctrl+Shift+R', action: 'buildRom' },
        { label: 'Build All', icon: '🏗', shortcut: 'Ctrl+B', action: 'buildAll' },
        'sep',
        { label: 'Clean Build', icon: '🧹', action: 'cleanBuild' },
        { label: 'Rebuild', icon: '🔄', action: 'rebuild' },
        'sep',
        { label: 'Build Configuration...', icon: '⚙', action: 'buildConfig' },
        { label: 'Target Platform', icon: '🎮', children: [
          { section: 'NINTENDO' },
          { label: 'Game Boy (DMG)', action: 'target:gb' },
          { label: 'Game Boy Color (GBC)', action: 'target:gbc', checked: true },
          { label: 'Game Boy Advance (GBA)', action: 'target:gba' },
          { label: 'Nintendo DS (NDS)', action: 'target:nds' },
          { label: 'Nintendo 64 (N64)', action: 'target:n64' },
          { label: 'Nintendo Switch', action: 'target:switch' },
          { label: 'Nintendo Switch 2', action: 'target:switch2' },
          { section: 'SONY' },
          { label: 'PlayStation 1', action: 'target:ps1' },
          { label: 'PlayStation 2', action: 'target:ps2' },
          { label: 'PlayStation 3', action: 'target:ps3' },
          { label: 'PlayStation 4', action: 'target:ps4' },
          { label: 'PlayStation 5', action: 'target:ps5' },
          { section: 'MICROSOFT' },
          { label: 'Xbox', action: 'target:xbox' },
          { label: 'Xbox 360', action: 'target:xbox360' },
          { label: 'Xbox One', action: 'target:xboxone' },
          { label: 'Xbox Series X|S', action: 'target:xboxsx' },
          { section: 'PC' },
          { label: 'Windows', action: 'target:windows' },
          { label: 'macOS', action: 'target:macos' },
          { label: 'Linux', action: 'target:linux' },
          { section: 'MOBILE' },
          { label: 'iOS', action: 'target:ios' },
          { label: 'Android', action: 'target:android' },
        ]},
        'sep',
        { label: 'Download ROM', icon: '📥', action: 'downloadRom' },
        { label: 'Deploy ROM...', icon: '🚀', action: 'deployRom' },
      ]
    },
    {
      label: 'Window', items: [
        { label: 'Layouts', icon: '📐', children: [
          { label: 'Default Layout', action: 'layout:default' },
          { label: 'Emulator Focus', action: 'layout:emulator' },
          { label: 'Editor Focus', action: 'layout:editor' },
          { label: 'Full Workbench', action: 'layout:workbench' },
          { label: 'D&D Campaign Mode', action: 'layout:dnd' },
        ]},
        'sep',
        { label: 'Reset Layout', action: 'resetLayout' },
        { label: 'Save Layout...', action: 'saveLayout' },
        'sep',
        { label: 'Console', icon: '💻', action: 'window:console' },
        { label: 'Output Log', icon: '📄', action: 'window:outputLog' },
        { label: 'Properties Panel', icon: '📋', action: 'window:properties' },
        { label: 'Asset Browser', icon: '📂', action: 'window:assetBrowser' },
      ]
    },
    {
      label: 'Help', items: [
        { label: 'Documentation', icon: '📖', action: 'help:docs' },
        { label: 'Keyboard Shortcuts', icon: '⌨', action: 'help:shortcuts' },
        'sep',
        { label: 'GBDK-2020 Reference', icon: '📗', action: 'help:gbdk' },
        { label: 'Game Boy Pan Docs', icon: '📘', action: 'help:pandocs' },
        { label: 'NES Dev Wiki', icon: '📙', action: 'help:nesdev' },
        'sep',
        { label: 'D&D 5e SRD', icon: '📕', action: 'help:srd' },
        { label: 'D&D Basic Rules', icon: '📗', action: 'help:basicRules' },
        'sep',
        { label: 'About Enchantment Engine', icon: 'ℹ', action: 'help:about' },
      ]
    },
  ];

  function buildMenuBar() {
    const bar = document.getElementById('menubar');
    if (!bar) return;

    var existingItems = bar.querySelectorAll('.menu-item');
    existingItems.forEach(function(el) { el.remove(); });

    menuData.forEach(menu => {
      const item = document.createElement('div');
      item.className = 'menu-item';
      item.textContent = menu.label;

      const dropdown = document.createElement('div');
      dropdown.className = 'menu-dropdown';
      buildMenuItems(dropdown, menu.items);
      item.appendChild(dropdown);

      item.addEventListener('mouseenter', () => {
        document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('open'));
        if (bar._menuActive) item.classList.add('open');
      });
      item.addEventListener('click', (e) => {
        if (e.target === item) {
          const wasOpen = item.classList.contains('open');
          document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('open'));
          if (!wasOpen) { item.classList.add('open'); bar._menuActive = true; }
          else { bar._menuActive = false; }
        }
      });

      bar.appendChild(item);
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.menubar')) {
        document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('open'));
        bar._menuActive = false;
      }
    });
  }

  function buildMenuItems(container, items) {
    items.forEach(item => {
      if (item === 'sep') {
        const sep = document.createElement('div');
        sep.className = 'menu-separator';
        container.appendChild(sep);
        return;
      }
      if (item.section) {
        const label = document.createElement('div');
        label.className = 'menu-section-label';
        label.textContent = item.section;
        container.appendChild(label);
        return;
      }
      if (item.children) {
        const sub = document.createElement('div');
        sub.className = 'submenu-container';
        const entry = document.createElement('div');
        entry.className = 'menu-entry';
        if (item.icon) { const ic = document.createElement('span'); ic.className = 'menu-icon'; ic.textContent = item.icon; entry.appendChild(ic); }
        const lbl = document.createElement('span'); lbl.textContent = item.label; entry.appendChild(lbl);
        const arrow = document.createElement('span'); arrow.className = 'submenu-arrow'; arrow.textContent = '▶'; entry.appendChild(arrow);
        sub.appendChild(entry);

        const subDropdown = document.createElement('div');
        subDropdown.className = 'submenu-dropdown';
        buildMenuItems(subDropdown, item.children);
        sub.appendChild(subDropdown);
        container.appendChild(sub);
        return;
      }

      const entry = document.createElement('div');
      entry.className = 'menu-entry' + (item.disabled ? ' disabled' : '');
      if (item.icon) { const ic = document.createElement('span'); ic.className = 'menu-icon'; ic.textContent = item.icon; entry.appendChild(ic); }
      const lbl = document.createElement('span'); lbl.textContent = item.label; entry.appendChild(lbl);
      if (item.checked) { const chk = document.createElement('span'); chk.textContent = ' ✓'; chk.style.color = 'var(--green)'; entry.appendChild(chk); }
      if (item.shortcut) { const sh = document.createElement('span'); sh.className = 'shortcut'; sh.textContent = item.shortcut; entry.appendChild(sh); }

      if (item.action) {
        entry.addEventListener('click', () => {
          document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('open'));
          document.getElementById('menubar')._menuActive = false;
          handleMenuAction(item.action);
        });
      }
      container.appendChild(entry);
    });
  }

  function handleMenuAction(action) {
    if (action.startsWith('panel:')) {
      const panel = action.split(':')[1];
      activatePanel(panel);
      return;
    }
    if (action.startsWith('dnd:')) {
      if (typeof window.openDndTool === 'function') window.openDndTool(action);
      return;
    }
    if (action.startsWith('tool:') || action.startsWith('engine:')) {
      if (typeof window.openEngineTool === 'function') window.openEngineTool(action);
      return;
    }
    if (action.startsWith('sorc:')) {
      if (typeof window.openSorcTool === 'function') window.openSorcTool(action);
      return;
    }
    if (action.startsWith('genre:')) {
      var genreId = action.split(':')[1];
      if (window.GenreConfig) {
        window.GenreConfig.set(genreId);
        setStatusFromMenu('Genre: ' + window.GenreConfig.get().name, 'ok');
      }
      return;
    }
    if (action.startsWith('rpgmaker:')) {
      if (typeof window.openRPGMakerTool === 'function') window.openRPGMakerTool(action);
      else openModal('RPG Maker - ' + action.split(':').pop(), buildRPGMakerToolHTML(action));
      return;
    }

    switch(action) {
      case 'importRom':
        document.getElementById('romFileInput').click();
        activatePanel('emulator');
        break;
      case 'exportRom':
      case 'downloadRom': {
        const a = document.createElement('a');
        a.href = '/LabyrinthOfTheDragon.gbc'; a.download = 'LabyrinthOfTheDragon.gbc'; a.click();
        break;
      }
      case 'importTile':
        activatePanel('tiles');
        break;
      case 'buildAssets':
        activatePanel('build');
        if (typeof window.triggerBuild === 'function') window.triggerBuild('assets');
        break;
      case 'buildRom':
        activatePanel('build');
        if (typeof window.triggerBuild === 'function') window.triggerBuild('rom');
        break;
      case 'buildAll':
      case 'rebuild':
        activatePanel('build');
        if (typeof window.triggerBuild === 'function') window.triggerBuild('all');
        break;
      case 'toggleFullscreen':
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
        break;
      case 'toggleStatusBar': {
        const sb = document.querySelector('.status-bar');
        if (sb) sb.style.display = sb.style.display === 'none' ? '' : 'none';
        break;
      }
      case 'help:about':
        openModal('About Enchantment Engine', `
          <div style="text-align:center;padding:20px;">
            <div style="font-size:36px;margin-bottom:10px;">🐉</div>
            <h2 style="color:var(--accent2);margin-bottom:8px;">Enchantment Game Engine</h2>
            <div style="color:var(--text2);margin-bottom:4px;">Version 2.1.0</div>
            <div style="color:var(--text2);margin-bottom:16px;">RPG Workbench for Game Boy Color</div>
            <div style="font-size:12px;color:var(--text2);line-height:1.8;">
              Labyrinth of the Dragon - 8-bit D&D Adventure RPG<br>
              Built with GBDK-2020 v4.5.0<br>
              Emulator: GameBoy-Online (GPL-2)<br>
              <br>
              &copy; Enchantment Game Engine Project
            </div>
          </div>
        `);
        break;
      case 'help:shortcuts':
        openModal('Keyboard Shortcuts', `
          <table class="ref-table">
            <tr><th>Action</th><th>Shortcut</th></tr>
            <tr><td>D-Pad</td><td>Arrow Keys / WASD</td></tr>
            <tr><td>A Button</td><td>Z</td></tr>
            <tr><td>B Button</td><td>X</td></tr>
            <tr><td>Start</td><td>Enter</td></tr>
            <tr><td>Select</td><td>Right Shift</td></tr>
            <tr><td>Build All</td><td>Ctrl+B</td></tr>
            <tr><td>Save</td><td>Ctrl+S</td></tr>
            <tr><td>Find</td><td>Ctrl+F</td></tr>
            <tr><td>Fullscreen</td><td>F11</td></tr>
          </table>
        `);
        break;
      case 'help:gbdk':
        window.open('https://gbdk-2020.github.io/gbdk-2020/docs/api/', '_blank');
        break;
      case 'help:pandocs':
        window.open('https://gbdev.io/pandocs/', '_blank');
        break;
      case 'help:nesdev':
        window.open('https://www.nesdev.org/wiki/Nesdev_Wiki', '_blank');
        break;
      case 'help:srd':
        window.open('https://www.5esrd.com/', '_blank');
        break;
      case 'help:basicRules':
        window.open('https://www.dndbeyond.com/sources/basic-rules', '_blank');
        break;
      case 'help:docs':
        window.open('https://gbdk-2020.github.io/gbdk-2020/docs/api/', '_blank');
        break;
      case 'projectSettings':
        openModal('Project Settings', buildProjectSettingsHTML());
        break;
      case 'preferences':
        openModal('Preferences', buildPreferencesHTML());
        break;
      case 'buildConfig':
        openModal('Build Configuration', buildBuildConfigHTML());
        break;
      case 'newProject':
        openModal('New Project', `
          <div class="form-group"><label>Project Name</label><input type="text" id="newProjName" placeholder="My Game"></div>
          <div class="form-row">
            <div class="form-group"><label>Platform</label><select id="newProjPlatform"><option>Game Boy Color</option><option>Game Boy (DMG)</option></select></div>
            <div class="form-group"><label>ROM Size</label><select id="newProjSize"><option>512 KB (32 banks)</option><option>256 KB (16 banks)</option><option>1 MB (64 banks)</option></select></div>
          </div>
          <div class="form-group"><label>Template</label><select id="newProjTemplate"><option>Blank Project</option><option>RPG Starter</option><option>Platformer Starter</option><option>Action Adventure</option></select></div>
          <div style="text-align:right;margin-top:16px;"><button class="save-btn" onclick="(function(){var n=document.getElementById('newProjName').value||'New Project';fetch('/api/project',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:n,platform:document.getElementById('newProjPlatform').value,size:document.getElementById('newProjSize').value,template:document.getElementById('newProjTemplate').value})}).then(function(){document.getElementById('statusText').textContent='Project created: '+n;closeModal();}).catch(function(){document.getElementById('statusText').textContent='Project creation failed';});})()">Create Project</button></div>
        `);
        break;
      case 'openProject': {
        const inp = document.createElement('input');
        inp.type = 'file'; inp.accept = '.zip,.json,.gbc,.gb';
        inp.onchange = function() {
          if (!inp.files[0]) return;
          var fd = new FormData(); fd.append('file', inp.files[0]);
          fetch('/api/project/import', { method: 'POST', body: fd })
            .then(function(r) { return r.json(); })
            .then(function(d) { setStatusFromMenu('Project loaded: ' + (d.name || inp.files[0].name), 'ok'); location.reload(); })
            .catch(function() { setStatusFromMenu('Failed to open project', 'error'); });
        };
        inp.click();
        break;
      }
      case 'saveProject':
        fetch('/api/project/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
          .then(function() { setStatusFromMenu('Project saved', 'ok'); })
          .catch(function() { setStatusFromMenu('Save failed', 'error'); });
        break;
      case 'saveAll': {
        var saves = [];
        var strEl = document.getElementById('stringsEditor');
        if (strEl && strEl.value) saves.push(fetch('/api/strings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: strEl.value }) }));
        var tblContent = (typeof window.getTableCSV === 'function') ? window.getTableCSV() : (document.getElementById('tablesEditor') || {}).value;
        if (tblContent) saves.push(fetch('/api/tables', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: tblContent }) }));
        Promise.all(saves).then(function() { setStatusFromMenu('All files saved', 'ok'); }).catch(function() { setStatusFromMenu('Save failed', 'error'); });
        break;
      }
      case 'importTilemap': {
        const inp = document.createElement('input');
        inp.type = 'file'; inp.accept = '.tilemap,.bin';
        inp.onchange = function() {
          if (!inp.files[0]) return;
          var fd = new FormData(); fd.append('file', inp.files[0]);
          fetch('/api/upload-tilemap', { method: 'POST', body: fd })
            .then(function(r) { return r.json(); })
            .then(function(d) { setStatusFromMenu('Tilemap imported: ' + inp.files[0].name, 'ok'); activatePanel('maps'); })
            .catch(function() { setStatusFromMenu('Tilemap import failed', 'error'); });
        };
        inp.click();
        break;
      }
      case 'importStrings': {
        const inp = document.createElement('input');
        inp.type = 'file'; inp.accept = '.js,.json,.txt';
        inp.onchange = function() {
          if (!inp.files[0]) return;
          var reader = new FileReader();
          reader.onload = function(ev) {
            document.getElementById('stringsEditor').value = ev.target.result;
            activatePanel('strings');
            setStatusFromMenu('Strings imported: ' + inp.files[0].name, 'ok');
          };
          reader.readAsText(inp.files[0]);
        };
        inp.click();
        break;
      }
      case 'importTables': {
        const inp = document.createElement('input');
        inp.type = 'file'; inp.accept = '.csv,.tsv,.txt';
        inp.onchange = function() {
          if (!inp.files[0]) return;
          var reader = new FileReader();
          reader.onload = function(ev) {
            document.getElementById('tablesEditor').value = ev.target.result;
            if (typeof window.reloadTableFromCSV === 'function') window.reloadTableFromCSV(ev.target.result);
            activatePanel('tables');
            setStatusFromMenu('Tables imported: ' + inp.files[0].name, 'ok');
          };
          reader.readAsText(inp.files[0]);
        };
        inp.click();
        break;
      }
      case 'importCHR':
        openModal('Import NES CHR File', `
          <p style="color:var(--text2);margin-bottom:12px;">Import a NES CHR ROM file and convert tiles to PNG.</p>
          <div class="form-group"><label>CHR File</label><input type="file" id="chrFileInput" accept=".chr,.nes,.bin"></div>
          <div class="form-row">
            <div class="form-group"><label>Tile Size</label><select id="chrTileSize"><option>8x8</option><option>8x16</option></select></div>
            <div class="form-group"><label>Columns</label><input type="number" id="chrCols" value="16" min="1" max="32"></div>
          </div>
          <div style="margin:12px 0;"><canvas id="chrPreview" style="background:#222;border:1px solid var(--border);image-rendering:pixelated;max-width:100%;"></canvas></div>
          <div style="text-align:right;"><button class="save-btn" onclick="(function(){var c=document.getElementById('chrPreview');if(c.width>1){c.toBlob(function(b){var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='chr_import.png';a.click();});closeModal();}})()">Export as PNG</button></div>
        `);
        setTimeout(function() {
          var fi = document.getElementById('chrFileInput');
          if (fi) fi.onchange = function() {
            if (!fi.files[0]) return;
            var reader = new FileReader();
            reader.onload = function(ev) {
              var data = new Uint8Array(ev.target.result);
              var cols = parseInt(document.getElementById('chrCols').value) || 16;
              var tileCount = Math.floor(data.length / 16);
              var rows = Math.ceil(tileCount / cols);
              var canvas = document.getElementById('chrPreview');
              canvas.width = cols * 8; canvas.height = rows * 8;
              var ctx = canvas.getContext('2d');
              var pal = [255, 170, 85, 0];
              for (var t = 0; t < tileCount; t++) {
                var tx = (t % cols) * 8, ty = Math.floor(t / cols) * 8;
                for (var y = 0; y < 8; y++) {
                  var lo = data[t * 16 + y], hi = data[t * 16 + y + 8];
                  for (var x = 0; x < 8; x++) {
                    var bit = 7 - x;
                    var v = ((lo >> bit) & 1) | (((hi >> bit) & 1) << 1);
                    var g = pal[v];
                    ctx.fillStyle = 'rgb(' + g + ',' + g + ',' + g + ')';
                    ctx.fillRect(tx + x, ty + y, 1, 1);
                  }
                }
              }
              canvas.style.width = Math.min(canvas.width * 3, 512) + 'px';
            };
            reader.readAsArrayBuffer(fi.files[0]);
          };
        }, 50);
        break;
      case 'import2BPP':
        openModal('Import Game Boy 2BPP File', `
          <p style="color:var(--text2);margin-bottom:12px;">Import raw 2BPP tile data and convert to PNG.</p>
          <div class="form-group"><label>2BPP File</label><input type="file" id="bppFileInput" accept=".bin,.2bpp,.gb"></div>
          <div class="form-row">
            <div class="form-group"><label>Tile Size</label><select id="bppTileSize"><option>8x8</option><option>8x16</option></select></div>
            <div class="form-group"><label>Columns</label><input type="number" id="bppCols" value="16" min="1" max="32"></div>
          </div>
          <div style="margin:12px 0;"><canvas id="bppPreview" style="background:#222;border:1px solid var(--border);image-rendering:pixelated;max-width:100%;"></canvas></div>
          <div style="text-align:right;"><button class="save-btn" onclick="(function(){var c=document.getElementById('bppPreview');if(c.width>1){c.toBlob(function(b){var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='2bpp_import.png';a.click();});closeModal();}})()">Export as PNG</button></div>
        `);
        setTimeout(function() {
          var fi = document.getElementById('bppFileInput');
          if (fi) fi.onchange = function() {
            if (!fi.files[0]) return;
            var reader = new FileReader();
            reader.onload = function(ev) {
              var data = new Uint8Array(ev.target.result);
              var cols = parseInt(document.getElementById('bppCols').value) || 16;
              var tileCount = Math.floor(data.length / 16);
              var rows = Math.ceil(tileCount / cols);
              var canvas = document.getElementById('bppPreview');
              canvas.width = cols * 8; canvas.height = rows * 8;
              var ctx = canvas.getContext('2d');
              var pal = ['#FFFFFF', '#AAAAAA', '#555555', '#000000'];
              for (var t = 0; t < tileCount; t++) {
                var tx = (t % cols) * 8, ty = Math.floor(t / cols) * 8;
                for (var y = 0; y < 8; y++) {
                  var lo = data[t * 16 + y * 2], hi = data[t * 16 + y * 2 + 1];
                  for (var x = 0; x < 8; x++) {
                    var bit = 7 - x;
                    var v = ((lo >> bit) & 1) | (((hi >> bit) & 1) << 1);
                    ctx.fillStyle = pal[v];
                    ctx.fillRect(tx + x, ty + y, 1, 1);
                  }
                }
              }
              canvas.style.width = Math.min(canvas.width * 3, 512) + 'px';
            };
            reader.readAsArrayBuffer(fi.files[0]);
          };
        }, 50);
        break;
      case 'exportTiles':
        fetch('/api/tiles').then(function(r) { return r.json(); }).then(function(tiles) {
          tiles.forEach(function(t) {
            var a = document.createElement('a'); a.href = '/assets/tiles/' + t; a.download = t; a.click();
          });
          setStatusFromMenu('Exporting ' + tiles.length + ' tile sheets', 'ok');
        });
        break;
      case 'exportAllAssets':
        fetch('/api/export-assets').then(function(r) { return r.blob(); }).then(function(blob) {
          var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'assets.zip'; a.click();
          setStatusFromMenu('Assets exported', 'ok');
        }).catch(function() {
          fetch('/api/tiles').then(function(r) { return r.json(); }).then(function(tiles) {
            tiles.forEach(function(t) { var a = document.createElement('a'); a.href = '/assets/tiles/' + t; a.download = t; a.click(); });
            setStatusFromMenu('Assets exported as individual files', 'ok');
          });
        });
        break;
      case 'undo':
        document.execCommand('undo');
        break;
      case 'redo':
        document.execCommand('redo');
        break;
      case 'cut':
        document.execCommand('cut');
        break;
      case 'copy':
        document.execCommand('copy');
        break;
      case 'paste':
        document.execCommand('paste');
        break;
      case 'delete':
        document.execCommand('delete');
        break;
      case 'selectAll':
        document.execCommand('selectAll');
        break;
      case 'findReplace':
        openModal('Find & Replace', `
          <div class="form-group"><label>Find</label><input type="text" id="findInput" placeholder="Search text..." autofocus></div>
          <div class="form-group"><label>Replace with</label><input type="text" id="replaceInput" placeholder="Replacement text..."></div>
          <div style="display:flex;gap:8px;margin-top:12px;">
            <button class="save-btn" onclick="(function(){var q=document.getElementById('findInput').value;if(!q)return;var el=document.activeElement;var editors=['stringsEditor','tablesEditor','srcEditor'];var target=null;for(var i=0;i<editors.length;i++){var e=document.getElementById(editors[i]);if(e&&e.value&&e.value.includes(q)){target=e;break;}}if(!target)target=document.querySelector('textarea:not([style*=display\\:none])');if(target){var idx=target.value.indexOf(q,target.selectionEnd||0);if(idx===-1)idx=target.value.indexOf(q);if(idx!==-1){target.focus();target.setSelectionRange(idx,idx+q.length);}}})()">Find Next</button>
            <button class="save-btn" onclick="(function(){var q=document.getElementById('findInput').value;var r=document.getElementById('replaceInput').value;if(!q)return;var editors=['stringsEditor','tablesEditor','srcEditor'];for(var i=0;i<editors.length;i++){var e=document.getElementById(editors[i]);if(e&&e.value&&e.value.includes(q)){var sel=e.value.substring(e.selectionStart,e.selectionEnd);if(sel===q){e.value=e.value.substring(0,e.selectionStart)+r+e.value.substring(e.selectionEnd);break;}}}})()">Replace</button>
            <button class="save-btn" onclick="(function(){var q=document.getElementById('findInput').value;var r=document.getElementById('replaceInput').value;if(!q)return;var editors=['stringsEditor','tablesEditor','srcEditor'];for(var i=0;i<editors.length;i++){var e=document.getElementById(editors[i]);if(e&&e.value&&e.value.includes(q)){e.value=e.value.split(q).join(r);}}})()">Replace All</button>
          </div>
        `);
        break;
      case 'zoomIn':
        document.body.style.fontSize = (parseFloat(getComputedStyle(document.body).fontSize) + 1) + 'px';
        break;
      case 'zoomOut':
        document.body.style.fontSize = Math.max(8, parseFloat(getComputedStyle(document.body).fontSize) - 1) + 'px';
        break;
      case 'zoomReset':
        document.body.style.fontSize = '';
        break;
      case 'toggleSidebar': {
        var sidebars = document.querySelectorAll('.sidebar, .data-sidebar');
        sidebars.forEach(function(s) { s.style.display = s.style.display === 'none' ? '' : 'none'; });
        break;
      }
      case 'newTileSheet8':
        openModal('New Tile Sheet (8x8)', `
          <div class="form-row">
            <div class="form-group"><label>Width (tiles)</label><input type="number" id="newTileW" value="16" min="1" max="64"></div>
            <div class="form-group"><label>Height (tiles)</label><input type="number" id="newTileH" value="16" min="1" max="64"></div>
          </div>
          <div class="form-group"><label>Name</label><input type="text" id="newTileName" value="new_tiles" placeholder="sheet name"></div>
          <div style="text-align:right;margin-top:12px;"><button class="save-btn" onclick="(function(){var w=parseInt(document.getElementById('newTileW').value)*8;var h=parseInt(document.getElementById('newTileH').value)*8;var name=document.getElementById('newTileName').value||'new_tiles';var c=document.createElement('canvas');c.width=w;c.height=h;var ctx=c.getContext('2d');ctx.fillStyle='#FFFFFF';ctx.fillRect(0,0,w,h);c.toBlob(function(b){fetch('/api/upload-tile',{method:'POST',body:b,headers:{'X-Filename':name+'.png'}}).then(function(){document.getElementById('statusText').textContent='Created '+name+'.png ('+w+'x'+h+')';closeModal();}).catch(function(){var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name+'.png';a.click();closeModal();});});})()">Create</button></div>
        `);
        break;
      case 'newTileSheet16':
        openModal('New Tile Sheet (16x16)', `
          <div class="form-row">
            <div class="form-group"><label>Width (tiles)</label><input type="number" id="newTile16W" value="8" min="1" max="32"></div>
            <div class="form-group"><label>Height (tiles)</label><input type="number" id="newTile16H" value="8" min="1" max="32"></div>
          </div>
          <div class="form-group"><label>Name</label><input type="text" id="newTile16Name" value="new_sprites" placeholder="sheet name"></div>
          <div style="text-align:right;margin-top:12px;"><button class="save-btn" onclick="(function(){var w=parseInt(document.getElementById('newTile16W').value)*16;var h=parseInt(document.getElementById('newTile16H').value)*16;var name=document.getElementById('newTile16Name').value||'new_sprites';var c=document.createElement('canvas');c.width=w;c.height=h;var ctx=c.getContext('2d');ctx.fillStyle='#FFFFFF';ctx.fillRect(0,0,w,h);c.toBlob(function(b){fetch('/api/upload-tile',{method:'POST',body:b,headers:{'X-Filename':name+'.png'}}).then(function(){document.getElementById('statusText').textContent='Created '+name+'.png ('+w+'x'+h+')';closeModal();}).catch(function(){var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name+'.png';a.click();closeModal();});});})()">Create</button></div>
        `);
        break;
      case 'tilePaletteEditor':
        openModal('Game Boy Palette Editor', `
          <p style="color:var(--text2);margin-bottom:12px;">Edit the 4-color Game Boy palette used for tile rendering.</p>
          <div style="display:flex;gap:16px;align-items:center;margin-bottom:16px;">
            <div style="text-align:center;"><label style="font-size:11px;color:var(--text2);">Color 0 (Lightest)</label><br><input type="color" id="palC0" value="#ffffff" style="width:60px;height:40px;border:none;cursor:pointer;"></div>
            <div style="text-align:center;"><label style="font-size:11px;color:var(--text2);">Color 1</label><br><input type="color" id="palC1" value="#aaaaaa" style="width:60px;height:40px;border:none;cursor:pointer;"></div>
            <div style="text-align:center;"><label style="font-size:11px;color:var(--text2);">Color 2</label><br><input type="color" id="palC2" value="#555555" style="width:60px;height:40px;border:none;cursor:pointer;"></div>
            <div style="text-align:center;"><label style="font-size:11px;color:var(--text2);">Color 3 (Darkest)</label><br><input type="color" id="palC3" value="#000000" style="width:60px;height:40px;border:none;cursor:pointer;"></div>
          </div>
          <div class="form-group"><label>Presets</label><select onchange="(function(v){var presets={dmg:['#9bbc0f','#8bac0f','#306230','#0f380f'],pocket:['#c4cfa1','#8b956d','#4d533c','#1f1f1f'],classic:['#ffffff','#aaaaaa','#555555','#000000'],bgb:['#e0f8d0','#88c070','#346856','#081820']};var p=presets[v];if(p){for(var i=0;i<4;i++)document.getElementById('palC'+i).value=p[i];}})((this||event.target).value)"><option value="classic">Classic (B&W)</option><option value="dmg">DMG Green</option><option value="pocket">GB Pocket</option><option value="bgb">BGB Style</option></select></div>
          <div style="text-align:right;"><button class="save-btn" onclick="(function(){var cols=[];for(var i=0;i<4;i++)cols.push(document.getElementById('palC'+i).value);localStorage.setItem('gbPalette',JSON.stringify(cols));document.getElementById('statusText').textContent='Palette saved';closeModal();})()">Apply</button></div>
        `);
        break;
      case 'tileAnimPreview':
        openModal('Tile Animation Preview', `
          <p style="color:var(--text2);margin-bottom:12px;">Preview animated tile sequences.</p>
          <div class="form-row">
            <div class="form-group"><label>Tile Sheet</label><select id="animTileSheet" onchange="(function(v){var img=new Image();img.crossOrigin='anonymous';img.onload=function(){var c=document.getElementById('animPreviewCanvas');c.width=img.width;c.height=img.height;c.getContext('2d').drawImage(img,0,0);c.style.width=Math.min(img.width*3,400)+'px';};img.src='/assets/tiles/'+v;})((this||event.target).value)"><option>-- select --</option></select></div>
            <div class="form-group"><label>Frame Delay (ms)</label><input type="number" id="animDelay" value="200" min="50" max="2000" step="50"></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Start Frame</label><input type="number" id="animStart" value="0" min="0"></div>
            <div class="form-group"><label>Frame Count</label><input type="number" id="animCount" value="4" min="1"></div>
          </div>
          <div style="text-align:center;margin:16px 0;"><canvas id="animPreviewCanvas" style="background:#222;border:1px solid var(--border);image-rendering:pixelated;"></canvas></div>
          <div style="display:flex;gap:8px;justify-content:center;">
            <button class="save-btn" id="animPlayBtn" onclick="(function(){var canvas=document.getElementById('animPreviewCanvas');if(!canvas||canvas.width<1)return;var delay=parseInt(document.getElementById('animDelay').value)||200;var startF=parseInt(document.getElementById('animStart').value)||0;var count=parseInt(document.getElementById('animCount').value)||4;var frame=0;if(window._animInterval)clearInterval(window._animInterval);window._animInterval=setInterval(function(){var ctx=canvas.getContext('2d');var tileW=8,tilesPerRow=Math.floor(canvas.width/tileW);var f=startF+frame;var sx=(f%tilesPerRow)*tileW,sy=Math.floor(f/tilesPerRow)*tileW;ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(canvas,sx,sy,tileW,tileW,0,0,canvas.width,canvas.height);frame=(frame+1)%count;},delay);})()">Play</button>
            <button class="save-btn" onclick="if(window._animInterval){clearInterval(window._animInterval);window._animInterval=null;}">Stop</button>
          </div>
        `);
        fetch('/api/tiles').then(function(r) { return r.json(); }).then(function(tiles) {
          var sel = document.getElementById('animTileSheet');
          if (sel) tiles.forEach(function(t) { var o = document.createElement('option'); o.value = t; o.textContent = t; sel.appendChild(o); });
        });
        break;
      case 'newTilemap':
        openModal('New Tilemap', `
          <div class="form-group"><label>Name</label><input type="text" id="newMapName" value="new_map" placeholder="tilemap name"></div>
          <div class="form-row">
            <div class="form-group"><label>Width (tiles)</label><input type="number" id="newMapW" value="20" min="1" max="255"></div>
            <div class="form-group"><label>Height (tiles)</label><input type="number" id="newMapH" value="18" min="1" max="255"></div>
          </div>
          <div class="form-group"><label>Tile Size</label><select id="newMapTileSize"><option value="8">8x8</option><option value="16">16x16</option></select></div>
          <div class="form-group"><label>Fill Tile</label><input type="number" id="newMapFill" value="0" min="0" max="255"></div>
          <div style="text-align:right;margin-top:12px;"><button class="save-btn" onclick="(function(){var w=parseInt(document.getElementById('newMapW').value);var h=parseInt(document.getElementById('newMapH').value);var fill=parseInt(document.getElementById('newMapFill').value)||0;var name=document.getElementById('newMapName').value||'new_map';var data=new Uint8Array(w*h);data.fill(fill);var blob=new Blob([data]);var fd=new FormData();fd.append('file',blob,name+'.tilemap');fetch('/api/upload-tilemap',{method:'POST',body:fd}).then(function(){document.getElementById('statusText').textContent='Created '+name+'.tilemap ('+w+'x'+h+')';closeModal();activatePanel('maps');}).catch(function(){document.getElementById('statusText').textContent='Failed to create tilemap';});})()">Create</button></div>
        `);
        break;
      case 'tilemapProps':
        openModal('Tilemap Properties', `
          <div id="tilemapPropsContent" style="color:var(--text2);">
            <p>Select a tilemap from the Maps panel to view its properties.</p>
          </div>
        `);
        fetch('/api/tilemaps').then(function(r) { return r.json(); }).then(function(maps) {
          var el = document.getElementById('tilemapPropsContent');
          if (!el) return;
          var html = '<table class="ref-table"><tr><th>Tilemap</th><th>Info</th></tr>';
          maps.forEach(function(m) { html += '<tr><td>' + m + '</td><td><button class="save-btn" style="font-size:11px;" onclick="fetch(\'/api/tilemap-data?name='+encodeURIComponent(m)+'\').then(function(r){return r.json();}).then(function(d){alert(\''+m+'\\nSize: \'+d.size+\' bytes\');})">Info</button></td></tr>'; });
          html += '</table>';
          el.innerHTML = html;
        });
        break;
      case 'autoTile':
        openModal('Auto-Tile Configuration', `
          <p style="color:var(--text2);margin-bottom:12px;">Configure auto-tile terrain rules for seamless tile placement.</p>
          <div class="form-group"><label>Terrain Type</label><select><option>Ground/Grass</option><option>Water</option><option>Wall</option><option>Path</option><option>Custom</option></select></div>
          <div class="form-group"><label>Tile Set</label><select id="autoTileSet"><option>-- select tile sheet --</option></select></div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:12px 0;">
            <div style="text-align:center;padding:8px;background:var(--bg2);border:1px solid var(--border);border-radius:4px;font-size:11px;">Inner Corner<br><span style="font-size:20px;">◰</span></div>
            <div style="text-align:center;padding:8px;background:var(--bg2);border:1px solid var(--border);border-radius:4px;font-size:11px;">Edge Top<br><span style="font-size:20px;">▬</span></div>
            <div style="text-align:center;padding:8px;background:var(--bg2);border:1px solid var(--border);border-radius:4px;font-size:11px;">Outer Corner<br><span style="font-size:20px;">◳</span></div>
            <div style="text-align:center;padding:8px;background:var(--bg2);border:1px solid var(--border);border-radius:4px;font-size:11px;">Center<br><span style="font-size:20px;">■</span></div>
          </div>
          <p style="color:var(--text2);font-size:11px;">Assign tile indices from your tile sheet to each terrain transition type. The auto-tiler will automatically select the correct tile based on neighboring terrain.</p>
          <div style="text-align:right;"><button class="save-btn" onclick="document.getElementById('statusText').textContent='Auto-tile config saved';closeModal();">Save Config</button></div>
        `);
        fetch('/api/tiles').then(function(r) { return r.json(); }).then(function(tiles) {
          var sel = document.getElementById('autoTileSet');
          if (sel) tiles.forEach(function(t) { var o = document.createElement('option'); o.value = t; o.textContent = t; sel.appendChild(o); });
        });
        break;
      case 'collisionLayer':
        openModal('Collision Layer Editor', `
          <p style="color:var(--text2);margin-bottom:12px;">Edit collision flags for map tiles. Click cells to toggle collision.</p>
          <div class="form-row">
            <div class="form-group"><label>Width</label><input type="number" id="collW" value="20" min="1" max="64"></div>
            <div class="form-group"><label>Height</label><input type="number" id="collH" value="18" min="1" max="64"></div>
            <div class="form-group"><label>&nbsp;</label><button class="save-btn" onclick="(function(){var w=parseInt(document.getElementById('collW').value);var h=parseInt(document.getElementById('collH').value);var grid=document.getElementById('collGrid');grid.innerHTML='';grid.style.gridTemplateColumns='repeat('+w+',16px)';for(var i=0;i<w*h;i++){var cell=document.createElement('div');cell.style.cssText='width:16px;height:16px;background:var(--bg2);border:1px solid var(--border);cursor:pointer;font-size:8px;text-align:center;line-height:16px;';cell.dataset.col=0;cell.onclick=function(){this.dataset.col=this.dataset.col==='0'?'1':'0';this.style.background=this.dataset.col==='1'?'var(--red)':'var(--bg2)';this.textContent=this.dataset.col==='1'?'X':'';};grid.appendChild(cell);}})()">Generate Grid</button></div>
          </div>
          <div id="collGrid" style="display:grid;gap:0;margin:12px 0;max-height:400px;overflow:auto;"></div>
          <div style="display:flex;gap:8px;align-items:center;margin:8px 0;">
            <div style="width:16px;height:16px;background:var(--bg2);border:1px solid var(--border);"></div><span style="font-size:11px;color:var(--text2);">Passable</span>
            <div style="width:16px;height:16px;background:var(--red);border:1px solid var(--border);"></div><span style="font-size:11px;color:var(--text2);">Solid</span>
          </div>
          <div style="text-align:right;"><button class="save-btn" onclick="(function(){var cells=document.getElementById('collGrid').children;var data=[];for(var i=0;i<cells.length;i++)data.push(parseInt(cells[i].dataset.col)||0);localStorage.setItem('collisionLayer',JSON.stringify(data));document.getElementById('statusText').textContent='Collision layer saved ('+data.length+' cells)';closeModal();})()">Save</button></div>
        `);
        break;
      case 'importSprites': {
        const inp = document.createElement('input');
        inp.type = 'file'; inp.accept = '.png,.bmp,.gif'; inp.multiple = true;
        inp.onchange = function() {
          if (!inp.files.length) return;
          Array.from(inp.files).forEach(function(f) {
            var fd = new FormData(); fd.append('file', f);
            fetch('/api/upload-tile', { method: 'POST', body: f, headers: { 'X-Filename': f.name } });
          });
          setStatusFromMenu('Imported ' + inp.files.length + ' sprite sheet(s)', 'ok');
        };
        inp.click();
        break;
      }
      case 'spriteAnimEditor':
        openModal('Sprite Animation Editor', `
          <div class="form-row">
            <div class="form-group"><label>Sprite Sheet</label><select id="sprAnimSheet"><option>-- select --</option></select></div>
            <div class="form-group"><label>Frame Size</label><select id="sprAnimSize"><option value="8">8x8</option><option value="16" selected>16x16</option><option value="32">32x32</option></select></div>
          </div>
          <div style="display:flex;gap:16px;margin:12px 0;">
            <div>
              <div style="color:var(--text2);font-size:11px;margin-bottom:4px;">Sheet Preview</div>
              <canvas id="sprAnimSheetCanvas" style="background:#222;border:1px solid var(--border);image-rendering:pixelated;max-width:300px;max-height:200px;"></canvas>
            </div>
            <div>
              <div style="color:var(--text2);font-size:11px;margin-bottom:4px;">Animation Preview</div>
              <canvas id="sprAnimCanvas" width="64" height="64" style="background:#222;border:1px solid var(--border);image-rendering:pixelated;width:128px;height:128px;"></canvas>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Start Frame</label><input type="number" id="sprAnimStart" value="0" min="0"></div>
            <div class="form-group"><label>Frame Count</label><input type="number" id="sprAnimFrameCount" value="4" min="1"></div>
            <div class="form-group"><label>Delay (ms)</label><input type="number" id="sprAnimDelay" value="150" min="16" step="16"></div>
          </div>
          <div style="display:flex;gap:8px;justify-content:center;margin-top:12px;">
            <button class="save-btn" id="sprAnimPlay">Play</button>
            <button class="save-btn" id="sprAnimStop">Stop</button>
          </div>
        `);
        fetch('/api/tiles').then(function(r) { return r.json(); }).then(function(tiles) {
          var sel = document.getElementById('sprAnimSheet');
          if (sel) tiles.forEach(function(t) { var o = document.createElement('option'); o.value = t; o.textContent = t; sel.appendChild(o); });
        });
        setTimeout(function() {
          var sel = document.getElementById('sprAnimSheet');
          if (sel) sel.onchange = function() {
            var img = new Image(); img.crossOrigin = 'anonymous';
            img.onload = function() {
              var c = document.getElementById('sprAnimSheetCanvas');
              c.width = img.width; c.height = img.height;
              c.getContext('2d').drawImage(img, 0, 0);
              c.style.width = Math.min(img.width * 2, 300) + 'px';
              window._sprAnimImg = img;
            };
            img.src = '/assets/tiles/' + sel.value;
          };
          var playBtn = document.getElementById('sprAnimPlay');
          if (playBtn) playBtn.onclick = function() {
            if (!window._sprAnimImg) return;
            var img = window._sprAnimImg;
            var sz = parseInt(document.getElementById('sprAnimSize').value);
            var startF = parseInt(document.getElementById('sprAnimStart').value) || 0;
            var count = parseInt(document.getElementById('sprAnimFrameCount').value) || 4;
            var delay = parseInt(document.getElementById('sprAnimDelay').value) || 150;
            var tilesPerRow = Math.floor(img.width / sz);
            var frame = 0;
            if (window._sprAnimInt) clearInterval(window._sprAnimInt);
            var canvas = document.getElementById('sprAnimCanvas');
            canvas.width = sz; canvas.height = sz;
            window._sprAnimInt = setInterval(function() {
              var f = startF + frame;
              var sx = (f % tilesPerRow) * sz, sy = Math.floor(f / tilesPerRow) * sz;
              var ctx = canvas.getContext('2d');
              ctx.imageSmoothingEnabled = false;
              ctx.clearRect(0, 0, sz, sz);
              ctx.drawImage(img, sx, sy, sz, sz, 0, 0, sz, sz);
              frame = (frame + 1) % count;
            }, delay);
          };
          var stopBtn = document.getElementById('sprAnimStop');
          if (stopBtn) stopBtn.onclick = function() { if (window._sprAnimInt) { clearInterval(window._sprAnimInt); window._sprAnimInt = null; } };
        }, 50);
        break;
      case 'spriteSheetPacker':
        openModal('Sprite Sheet Packer', `
          <p style="color:var(--text2);margin-bottom:12px;">Combine multiple sprite images into a single sprite sheet.</p>
          <div class="form-group"><label>Sprite Files</label><input type="file" id="packSprites" accept=".png,.bmp" multiple></div>
          <div class="form-row">
            <div class="form-group"><label>Columns</label><input type="number" id="packCols" value="4" min="1" max="32"></div>
            <div class="form-group"><label>Cell Size</label><select id="packCellSize"><option value="8">8x8</option><option value="16" selected>16x16</option><option value="32">32x32</option></select></div>
          </div>
          <div style="margin:12px 0;"><canvas id="packPreview" style="background:#222;border:1px solid var(--border);image-rendering:pixelated;max-width:100%;"></canvas></div>
          <div style="text-align:right;"><button class="save-btn" onclick="(function(){var c=document.getElementById('packPreview');if(c.width>1){c.toBlob(function(b){var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='sprite_sheet.png';a.click();});}closeModal();})()">Export Sheet</button></div>
        `);
        setTimeout(function() {
          var fi = document.getElementById('packSprites');
          if (fi) fi.onchange = function() {
            var files = Array.from(fi.files);
            var cols = parseInt(document.getElementById('packCols').value) || 4;
            var cellSz = parseInt(document.getElementById('packCellSize').value) || 16;
            var imgs = [];
            var loaded = 0;
            files.forEach(function(f, i) {
              var reader = new FileReader();
              reader.onload = function(ev) {
                var img = new Image();
                img.onload = function() { imgs[i] = img; loaded++; if (loaded === files.length) renderPack(); };
                img.src = ev.target.result;
              };
              reader.readAsDataURL(f);
            });
            function renderPack() {
              var rows = Math.ceil(imgs.length / cols);
              var canvas = document.getElementById('packPreview');
              canvas.width = cols * cellSz; canvas.height = rows * cellSz;
              var ctx = canvas.getContext('2d');
              ctx.imageSmoothingEnabled = false;
              imgs.forEach(function(img, i) {
                var x = (i % cols) * cellSz, y = Math.floor(i / cols) * cellSz;
                ctx.drawImage(img, x, y, cellSz, cellSz);
              });
              canvas.style.width = Math.min(canvas.width * 3, 512) + 'px';
            }
          };
        }, 50);
        break;
      case 'oamLayout':
        openModal('OAM Layout Viewer', `
          <p style="color:var(--text2);margin-bottom:12px;">View the Object Attribute Memory (OAM) sprite layout for the Game Boy.</p>
          <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px;font-size:11px;color:var(--text2);margin:12px 0;">
            <div style="font-weight:bold;">Sprite #</div><div style="font-weight:bold;">X</div><div style="font-weight:bold;">Y</div><div style="font-weight:bold;">Tile</div><div style="font-weight:bold;">Flags</div>
          </div>
          <div style="max-height:300px;overflow-y:auto;" id="oamList"></div>
          <p style="color:var(--text2);font-size:11px;margin-top:8px;">Game Boy supports 40 sprites (OAM entries). Each entry: Y, X, Tile#, Flags (priority, flip, palette).</p>
        `);
        setTimeout(function() {
          var list = document.getElementById('oamList');
          if (list) {
            var html = '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px;font-size:11px;color:var(--text);">';
            for (var i = 0; i < 40; i++) html += '<div>#' + i + '</div><div>0</div><div>0</div><div>0x00</div><div>0x00</div>';
            html += '</div>';
            list.innerHTML = html;
          }
        }, 50);
        break;
      case 'metaspriteEditor':
        openModal('Metasprite Editor', `
          <p style="color:var(--text2);margin-bottom:12px;">Combine multiple 8x8 tiles into larger metasprites.</p>
          <div class="form-row">
            <div class="form-group"><label>Width (tiles)</label><input type="number" id="metaW" value="2" min="1" max="8"></div>
            <div class="form-group"><label>Height (tiles)</label><input type="number" id="metaH" value="2" min="1" max="8"></div>
          </div>
          <div class="form-group"><label>Source Tile Sheet</label><select id="metaTileSheet"><option>-- select --</option></select></div>
          <div style="display:flex;gap:16px;margin:12px 0;">
            <div>
              <div style="color:var(--text2);font-size:11px;margin-bottom:4px;">Tile Source</div>
              <canvas id="metaSrcCanvas" style="background:#222;border:1px solid var(--border);image-rendering:pixelated;max-width:256px;max-height:256px;cursor:crosshair;"></canvas>
            </div>
            <div>
              <div style="color:var(--text2);font-size:11px;margin-bottom:4px;">Metasprite Result</div>
              <canvas id="metaDstCanvas" style="background:#222;border:1px solid var(--border);image-rendering:pixelated;width:128px;height:128px;"></canvas>
            </div>
          </div>
          <div style="text-align:right;"><button class="save-btn" onclick="(function(){var c=document.getElementById('metaDstCanvas');if(c.width>1){c.toBlob(function(b){var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='metasprite.png';a.click();});}closeModal();})()">Export</button></div>
        `);
        fetch('/api/tiles').then(function(r) { return r.json(); }).then(function(tiles) {
          var sel = document.getElementById('metaTileSheet');
          if (sel) tiles.forEach(function(t) { var o = document.createElement('option'); o.value = t; o.textContent = t; sel.appendChild(o); });
        });
        break;
      case 'paletteManager':
      case 'gbcPaletteEditor':
        openModal('GBC Palette Manager', `
          <p style="color:var(--text2);margin-bottom:12px;">Manage Game Boy Color background and sprite palettes (8 palettes, 4 colors each).</p>
          <div id="palManagerContent"></div>
          <div style="text-align:right;margin-top:12px;"><button class="save-btn" onclick="(function(){var pals=[];for(var p=0;p<8;p++){var pal=[];for(var c=0;c<4;c++){var el=document.getElementById('pal_'+p+'_'+c);if(el)pal.push(el.value);}pals.push(pal);}localStorage.setItem('gbcPalettes',JSON.stringify(pals));document.getElementById('statusText').textContent='Palettes saved';closeModal();})()">Save All</button></div>
        `);
        setTimeout(function() {
          var el = document.getElementById('palManagerContent');
          if (!el) return;
          var html = '';
          var defaults = [['#ffffff','#aaaaaa','#555555','#000000']];
          for (var p = 0; p < 8; p++) {
            html += '<div style="display:flex;gap:8px;align-items:center;margin:6px 0;"><span style="color:var(--text2);font-size:12px;width:70px;">BG Pal ' + p + '</span>';
            for (var c = 0; c < 4; c++) {
              var def = defaults[0][c];
              html += '<input type="color" id="pal_' + p + '_' + c + '" value="' + def + '" style="width:40px;height:28px;border:none;cursor:pointer;">';
            }
            html += '</div>';
          }
          el.innerHTML = html;
        }, 50);
        break;
      case 'nesPaletteEditor':
        openModal('NES Palette Editor', `
          <p style="color:var(--text2);margin-bottom:12px;">NES system palette viewer with 64 colors.</p>
          <div id="nesPalGrid" style="display:grid;grid-template-columns:repeat(16,28px);gap:2px;margin:12px 0;"></div>
          <p style="color:var(--text2);font-size:11px;">Click a color to copy its hex value.</p>
        `);
        setTimeout(function() {
          var grid = document.getElementById('nesPalGrid');
          if (!grid) return;
          var nesPal = ['#626262','#012090','#240092','#480074','#5e0040','#680000','#5c0400','#402800','#1a4400','#005600','#005c00','#005208','#003c38','#000000','#000000','#000000','#ababab','#1f56d4','#4a30e4','#7620c8','#a01884','#ac1830','#a42800','#805200','#4e7600','#1c8e00','#009400','#008854','#006c9a','#000000','#000000','#000000','#ffffff','#65acfe','#8c88fe','#b868f8','#e264c6','#f06a6c','#ec8020','#c8a400','#94c800','#5ce200','#38e830','#30d892','#38bee4','#3c3c3c','#000000','#000000','#ffffff','#c0dafc','#d0c8fe','#e0bcfe','#f0b8e8','#f8babc','#f8c498','#eccea0','#d8dca0','#c4e89c','#b4eca8','#a8e8cc','#a8d8e8','#b0b0b0','#000000','#000000'];
          for (var i = 0; i < 64; i++) {
            var c = nesPal[i] || '#000000';
            var cell = document.createElement('div');
            cell.style.cssText = 'width:28px;height:28px;background:' + c + ';border:1px solid var(--border);cursor:pointer;border-radius:2px;';
            cell.title = '$' + i.toString(16).toUpperCase().padStart(2, '0') + ' ' + c;
            cell.dataset.color = c;
            cell.onclick = function() { navigator.clipboard.writeText(this.dataset.color); document.getElementById('statusText').textContent = 'Copied: ' + this.dataset.color; };
            grid.appendChild(cell);
          }
        }, 50);
        break;
      case 'dmgPaletteEditor':
        openModal('DMG Palette Editor', `
          <p style="color:var(--text2);margin-bottom:12px;">Original Game Boy 4-shade green palette.</p>
          <div style="display:flex;gap:16px;align-items:center;justify-content:center;margin:20px 0;">
            <div style="text-align:center;"><div style="width:60px;height:60px;background:#9bbc0f;border:2px solid var(--border);border-radius:4px;"></div><div style="font-size:11px;color:var(--text2);margin-top:4px;">#9BBC0F</div></div>
            <div style="text-align:center;"><div style="width:60px;height:60px;background:#8bac0f;border:2px solid var(--border);border-radius:4px;"></div><div style="font-size:11px;color:var(--text2);margin-top:4px;">#8BAC0F</div></div>
            <div style="text-align:center;"><div style="width:60px;height:60px;background:#306230;border:2px solid var(--border);border-radius:4px;"></div><div style="font-size:11px;color:var(--text2);margin-top:4px;">#306230</div></div>
            <div style="text-align:center;"><div style="width:60px;height:60px;background:#0f380f;border:2px solid var(--border);border-radius:4px;"></div><div style="font-size:11px;color:var(--text2);margin-top:4px;">#0F380F</div></div>
          </div>
        `);
        break;
      case 'importPalette':
      case 'paletteImport': {
        const inp = document.createElement('input');
        inp.type = 'file'; inp.accept = '.pal,.gpl,.json,.act,.txt';
        inp.onchange = function() {
          if (!inp.files[0]) return;
          var reader = new FileReader();
          reader.onload = function(ev) {
            try {
              var data = JSON.parse(ev.target.result);
              localStorage.setItem('gbcPalettes', JSON.stringify(data));
              setStatusFromMenu('Palette imported', 'ok');
            } catch(e) {
              localStorage.setItem('importedPalette', ev.target.result);
              setStatusFromMenu('Palette data imported', 'ok');
            }
          };
          reader.readAsText(inp.files[0]);
        };
        inp.click();
        break;
      }
      case 'exportPalette':
      case 'paletteExport': {
        var palData = localStorage.getItem('gbcPalettes') || JSON.stringify([['#ffffff','#aaaaaa','#555555','#000000']]);
        var blob = new Blob([palData], { type: 'application/json' });
        var a2 = document.createElement('a');
        a2.href = URL.createObjectURL(blob); a2.download = 'palette.json'; a2.click();
        setStatusFromMenu('Palette exported', 'ok');
        break;
      }
      case 'colorPicker':
        openModal('Color Picker', `
          <div style="display:flex;gap:20px;align-items:flex-start;">
            <div>
              <input type="color" id="colorPickerInput" value="#4488ff" style="width:120px;height:120px;border:none;cursor:pointer;">
            </div>
            <div style="flex:1;">
              <div class="form-group"><label>Hex</label><input type="text" id="cpHex" value="#4488FF" oninput="document.getElementById('colorPickerInput').value=this.value"></div>
              <div class="form-group"><label>RGB</label><input type="text" id="cpRGB" value="68, 136, 255" readonly></div>
              <div class="form-group"><label>GBC (RGB555)</label><input type="text" id="cpGBC" value="0x0000" readonly></div>
              <div style="margin-top:8px;"><button class="save-btn" onclick="navigator.clipboard.writeText(document.getElementById('cpHex').value);document.getElementById('statusText').textContent='Color copied'">Copy Hex</button></div>
            </div>
          </div>
        `);
        setTimeout(function() {
          var cp = document.getElementById('colorPickerInput');
          if (cp) cp.oninput = function() {
            var v = cp.value;
            document.getElementById('cpHex').value = v.toUpperCase();
            var r = parseInt(v.substr(1,2), 16), g = parseInt(v.substr(3,2), 16), b = parseInt(v.substr(5,2), 16);
            document.getElementById('cpRGB').value = r + ', ' + g + ', ' + b;
            var gbc = ((r >> 3) & 0x1F) | (((g >> 3) & 0x1F) << 5) | (((b >> 3) & 0x1F) << 10);
            document.getElementById('cpGBC').value = '0x' + gbc.toString(16).toUpperCase().padStart(4, '0');
          };
        }, 50);
        break;
      case 'clean':
      case 'cleanBuild':
        activatePanel('build');
        if (typeof window.triggerBuild === 'function') window.triggerBuild('clean');
        else fetch('/api/build', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ target: 'clean' }) }).then(function(r) { return r.json(); }).then(function(d) { setStatusFromMenu('Clean complete', 'ok'); });
        break;
      case 'cleanAssets':
        fetch('/api/build', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ target: 'clean-assets' }) })
          .then(function(r) { return r.json(); })
          .then(function() { setStatusFromMenu('Asset cache cleaned', 'ok'); })
          .catch(function() { setStatusFromMenu('Clean assets: done', 'ok'); });
        break;
      case 'rebuildAssets':
        activatePanel('build');
        if (typeof window.triggerBuild === 'function') window.triggerBuild('assets');
        break;
      case 'targetPlatform':
      case 'target:gb':
      case 'target:gbc':
      case 'target:dmg':
      case 'target:gba':
      case 'target:nds':
      case 'target:n64':
      case 'target:switch':
      case 'target:switch2':
      case 'target:ps1':
      case 'target:ps2':
      case 'target:ps3':
      case 'target:ps4':
      case 'target:ps5':
      case 'target:xbox':
      case 'target:xbox360':
      case 'target:xboxone':
      case 'target:xboxsx':
      case 'target:windows':
      case 'target:macos':
      case 'target:linux':
      case 'target:ios':
      case 'target:android': {
        var targetId = action.split(':')[1] || '';
        if (targetId === 'dmg') targetId = 'gb';
        if (targetId && window.PlatformConfig && window.PlatformConfig.platforms[targetId]) {
          window.PlatformConfig.set(targetId);
          localStorage.setItem('targetPlatform', targetId);
          setStatusFromMenu('Target: ' + window.PlatformConfig.get().name, 'ok');
          rebuildTargetPlatformMenu();
        } else {
          openModal('Target Platform', buildTargetPlatformModalHTML());
          setTimeout(function() {
            var sel = document.getElementById('targetPlatformSel');
            if (sel) sel.onchange = function() {
              var id = sel.value;
              window.PlatformConfig.set(id);
              localStorage.setItem('targetPlatform', id);
              setStatusFromMenu('Target: ' + window.PlatformConfig.get().name, 'ok');
              rebuildTargetPlatformMenu();
              closeModal();
            };
          }, 50);
        }
        break;
      }
      case 'deployRom':
        openModal('Deploy ROM', `
          <p style="color:var(--text2);margin-bottom:12px;">Deploy your ROM for distribution or testing.</p>
          <div class="form-group"><label>Deploy Method</label><select id="deployMethod"><option>Download .gbc file</option><option>Generate web player link</option><option>Export as .pocket (Analogue)</option></select></div>
          <div class="form-group"><label>ROM Title</label><input type="text" value="Labyrinth of the Dragon"></div>
          <div class="form-group"><label>Version</label><input type="text" value="1.0.0"></div>
          <div style="text-align:right;margin-top:12px;"><button class="save-btn" onclick="(function(){var m=document.getElementById('deployMethod').value;if(m.includes('Download')){var a=document.createElement('a');a.href='/LabyrinthOfTheDragon.gbc';a.download='LabyrinthOfTheDragon.gbc';a.click();}document.getElementById('statusText').textContent='ROM deployed';closeModal();})()">Deploy</button></div>
        `);
        break;
      case 'layout:default':
        document.querySelectorAll('.panel').forEach(function(p) { p.style.cssText = ''; });
        document.querySelector('.status-bar').style.display = '';
        document.querySelectorAll('.sidebar, .data-sidebar').forEach(function(s) { s.style.display = ''; });
        setStatusFromMenu('Layout: Default', 'ok');
        break;
      case 'layout:emulator':
      case 'layout:emulatorFocus':
        activatePanel('emulator');
        setStatusFromMenu('Layout: Emulator Focus', 'ok');
        break;
      case 'layout:editor':
      case 'layout:editorFocus':
        activatePanel('source');
        setStatusFromMenu('Layout: Editor Focus', 'ok');
        break;
      case 'layout:workbench':
        activatePanel('build');
        setStatusFromMenu('Layout: Workbench', 'ok');
        break;
      case 'layout:dnd':
      case 'layout:dndCampaign':
        if (typeof window.openDndTool === 'function') window.openDndTool('dnd:characterCreator');
        setStatusFromMenu('Layout: D&D Campaign Mode', 'ok');
        break;
      case 'resetLayout':
        document.querySelectorAll('.panel').forEach(function(p) { p.style.cssText = ''; });
        document.querySelector('.status-bar').style.display = '';
        document.querySelectorAll('.sidebar, .data-sidebar').forEach(function(s) { s.style.display = ''; });
        document.body.style.fontSize = '';
        activatePanel('emulator');
        setStatusFromMenu('Layout reset', 'ok');
        break;
      case 'saveLayout':
        openModal('Save Layout', `
          <div class="form-group"><label>Layout Name</label><input type="text" id="saveLayoutName" placeholder="My Layout"></div>
          <div style="text-align:right;margin-top:12px;"><button class="save-btn" onclick="(function(){var name=document.getElementById('saveLayoutName').value||'Custom';var layouts=JSON.parse(localStorage.getItem('savedLayouts')||'{}');layouts[name]={activePanel:document.querySelector('.ttab.active')?.dataset.panel||'emulator',timestamp:Date.now()};localStorage.setItem('savedLayouts',JSON.stringify(layouts));document.getElementById('statusText').textContent='Layout saved: '+name;closeModal();})()">Save</button></div>
        `);
        break;
      case 'toggleConsole':
      case 'window:console': {
        var consoleEl = document.getElementById('panel-build');
        if (consoleEl) { activatePanel('build'); }
        break;
      }
      case 'toggleOutput':
      case 'window:outputLog': {
        var outputEl = document.getElementById('buildOutput');
        if (outputEl) { activatePanel('build'); }
        break;
      }
      case 'toggleProperties':
      case 'window:properties':
        openModal('Properties', `
          <p style="color:var(--text2);">Properties panel shows details for the currently selected item.</p>
          <table class="ref-table">
            <tr><th>Property</th><th>Value</th></tr>
            <tr><td>Project</td><td>Labyrinth of the Dragon</td></tr>
            <tr><td>Platform</td><td>Game Boy Color</td></tr>
            <tr><td>ROM Size</td><td>512 KB</td></tr>
            <tr><td>Banks Used</td><td>32</td></tr>
          </table>
        `);
        break;
      case 'window:assetBrowser':
        activatePanel('tiles');
        break;
      case 'exportNES':
        setStatusFromMenu('NES export not yet available', 'ok');
        break;
    }
  }

  function activatePanel(name) {
    const tab = document.querySelector('.ttab[data-panel="' + name + '"]');
    if (tab) tab.click();
  }

  function openModal(title, bodyHTML) {
    let overlay = document.getElementById('modalOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'modalOverlay';
      overlay.className = 'modal-overlay';
      document.body.appendChild(overlay);
      overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    }
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <span class="modal-title">${title}</span>
          <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">${bodyHTML}</div>
      </div>
    `;
    overlay.classList.add('active');
  }

  window.openModal = openModal;
  window.closeModal = function() {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.classList.remove('active');
  };

  function setStatusFromMenu(text, type) {
    const el = document.getElementById('statusText');
    if (el) el.textContent = text;
  }

  function getPlatformOptions(type) {
    var pc = window.PlatformConfig;
    if (!pc) return '';
    var p = pc.get();
    var items = p[type] || [];
    return items.map(function(item) { return '<option>' + item + '</option>'; }).join('');
  }

  function buildPlatformSelector(selectedId) {
    var pc = window.PlatformConfig;
    if (!pc) return '<select id="projPlatformSel"><option value="gbc">Game Boy Color</option></select>';
    var list = pc.getPlatformList();
    var opts = list.map(function(pl) {
      return '<option value="' + pl.id + '"' + (pl.id === selectedId ? ' selected' : '') + '>' + pl.name + ' (' + pl.bits + '-bit)</option>';
    }).join('');
    return '<select id="projPlatformSel" onchange="window._onProjectPlatformChange(this.value)">' + opts + '</select>';
  }

  function buildPlatformInfoCard(p) {
    return '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:12px;margin:12px 0;">' +
      '<div style="font-weight:bold;color:var(--accent2);margin-bottom:8px;">' + p.name + ' (' + p.bits + '-bit)</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 16px;font-size:12px;color:var(--text);">' +
      '<div><span style="color:var(--text2);">CPU:</span> ' + p.cpu + '</div>' +
      '<div><span style="color:var(--text2);">Clock:</span> ' + p.clockSpeed + '</div>' +
      '<div><span style="color:var(--text2);">Resolution:</span> ' + p.resolution + '</div>' +
      '<div><span style="color:var(--text2);">Colors:</span> ' + p.colors + '</div>' +
      '<div><span style="color:var(--text2);">VRAM:</span> ' + p.vram + '</div>' +
      '<div><span style="color:var(--text2);">WRAM:</span> ' + p.wram + '</div>' +
      '<div><span style="color:var(--text2);">Sound:</span> ' + p.soundChannels + ' channels</div>' +
      '<div><span style="color:var(--text2);">Max ROM:</span> ' + p.maxRom + '</div>' +
      '<div><span style="color:var(--text2);">Tile Format:</span> ' + p.tileFormat + '</div>' +
      '<div><span style="color:var(--text2);">Max Sprites:</span> ' + p.maxSprites + '</div>' +
      '</div>' +
      '<div style="margin-top:8px;font-size:11px;color:var(--text2);">Features: ' + (p.features || []).slice(0, 6).join(', ') + (p.features && p.features.length > 6 ? '...' : '') + '</div>' +
      '</div>';
  }

  function buildProjectSettingsHTML() {
    var pc = window.PlatformConfig;
    var p = pc ? pc.get() : null;
    var currentId = pc ? pc.current : 'gbc';
    if (!p) {
      return '<p style="color:var(--text2);">PlatformConfig not loaded.</p>';
    }
    var cartTypeDisplay = (p.cartTypes && p.cartTypes.length > 0) ? 'block' : 'none';
    return '<div class="form-group"><label>Project Name</label><input type="text" value="Labyrinth of the Dragon"></div>' +
      '<div class="form-group"><label>Target Platform</label>' + buildPlatformSelector(currentId) + '</div>' +
      '<div id="projPlatformInfo">' + buildPlatformInfoCard(p) + '</div>' +
      '<div id="projPlatformFields">' + buildProjectPlatformFields(p) + '</div>';
  }

  function buildProjectPlatformFields(p) {
    var cartTypeDisplay = (p.cartTypes && p.cartTypes.length > 0) ? '' : ' style="display:none"';
    var cartTypeOpts = (p.cartTypes || []).map(function(c) { return '<option>' + c + '</option>'; }).join('');
    var romSizeOpts = (p.romSizes || []).map(function(r) { return '<option>' + r + '</option>'; }).join('');
    var sramOpts = (p.sramSizes || []).map(function(s) { return '<option>' + s + '</option>'; }).join('');
    return '<div class="form-row">' +
      '<div class="form-group"><label>ROM Size</label><select>' + romSizeOpts + '</select></div>' +
      '<div class="form-group"' + cartTypeDisplay + '><label>Cart Type</label><select>' + cartTypeOpts + '</select></div>' +
      '</div>' +
      '<div class="form-row">' +
      '<div class="form-group"><label>SRAM Size</label><select>' + sramOpts + '</select></div>' +
      '<div class="form-group"><label>Output File</label><input type="text" value="LabyrinthOfTheDragon' + p.fileExtension + '"></div>' +
      '</div>' +
      '<div class="form-row">' +
      '<div class="form-group"><label>SDK Path</label><input type="text" value="' + (p.buildTools ? p.buildTools.path : '') + '"></div>' +
      '<div class="form-group"><label>SDK</label><input type="text" value="' + (p.buildTools ? p.buildTools.sdk : '') + '" readonly></div>' +
      '</div>' +
      '<div class="form-group"><label>Game Title (max 15 chars)</label><input type="text" value="LABYRINTH" maxlength="15"></div>';
  }

  window._onProjectPlatformChange = function(id) {
    var pc = window.PlatformConfig;
    if (!pc || !pc.platforms[id]) return;
    pc.set(id);
    var p = pc.get();
    var infoEl = document.getElementById('projPlatformInfo');
    if (infoEl) infoEl.innerHTML = buildPlatformInfoCard(p);
    var fieldsEl = document.getElementById('projPlatformFields');
    if (fieldsEl) fieldsEl.innerHTML = buildProjectPlatformFields(p);
    rebuildTargetPlatformMenu();
  };

  function buildPreferencesHTML() {
    var pc = window.PlatformConfig;
    var p = pc ? pc.get() : null;
    var platformTabContent = '';
    if (p) {
      platformTabContent = '<div style="margin-bottom:12px;">' + buildPlatformInfoCard(p) + '</div>' +
        '<div class="form-group"><label>Graphics Modes</label>' +
        '<div style="font-size:12px;color:var(--text);line-height:2;">' +
        (p.graphicsModes || []).map(function(m) { return '<div style="padding:2px 0;">' + m + '</div>'; }).join('') +
        '</div></div>' +
        '<div class="form-group"><label>Feature Toggles</label>' +
        '<div style="font-size:12px;color:var(--text);line-height:2;">' +
        (p.features || []).map(function(f) { return '<label><input type="checkbox" checked> ' + f + '</label><br>'; }).join('') +
        '</div></div>';
    }

    var emulatorSettings = '';
    if (p && p.bits <= 8) {
      emulatorSettings = '<div class="form-group"><label>Default Speed</label><select><option selected>1x</option><option>2x</option><option>4x</option></select></div>' +
        '<div class="form-group"><label>Sound on Start</label><select><option selected>Enabled</option><option>Disabled</option></select></div>' +
        '<div class="form-group"><label>Color Mode</label><select><option selected>GBC Colors</option><option>DMG Green</option><option>Original</option></select></div>' +
        '<div class="form-group"><label>Pixel Scaling</label><select><option selected>Nearest Neighbor</option><option>Bilinear</option></select></div>';
    } else if (p && p.bits === 16) {
      emulatorSettings = '<div class="form-group"><label>Default Speed</label><select><option selected>1x</option><option>2x</option><option>4x</option></select></div>' +
        '<div class="form-group"><label>Sound on Start</label><select><option selected>Enabled</option><option>Disabled</option></select></div>' +
        '<div class="form-group"><label>Emulator</label><select><option selected>mGBA</option><option>VBA-M</option><option>NanoBoyAdvance</option></select></div>' +
        '<div class="form-group"><label>BIOS File</label><input type="text" value="gba_bios.bin" placeholder="Path to GBA BIOS..."></div>' +
        '<div class="form-group"><label>Pixel Scaling</label><select><option selected>Nearest Neighbor</option><option>Bilinear</option></select></div>';
    } else if (p && p.bits === 32) {
      emulatorSettings = '<div class="form-group"><label>Default Speed</label><select><option selected>1x</option><option>2x</option><option>4x</option></select></div>' +
        '<div class="form-group"><label>Emulator</label><select><option selected>DeSmuME</option><option>melonDS</option><option>NO$GBA</option></select></div>' +
        '<div class="form-group"><label>Screen Layout</label><select><option selected>Vertical</option><option>Horizontal</option><option>Top Only</option><option>Bottom Only</option></select></div>' +
        '<div class="form-group"><label>BIOS Files</label><input type="text" value="" placeholder="Path to NDS BIOS..."></div>' +
        '<div class="form-group"><label>Firmware</label><input type="text" value="" placeholder="Path to NDS firmware..."></div>';
    } else {
      emulatorSettings = '<div class="form-group"><label>Default Speed</label><select><option selected>1x</option><option>2x</option><option>4x</option></select></div>' +
        '<div class="form-group"><label>Emulator</label><select><option selected>Project64</option><option>Mupen64Plus</option><option>Ares</option></select></div>' +
        '<div class="form-group"><label>Video Plugin</label><select><option selected>GLideN64</option><option>Angrylion</option><option>ParaLLEl-RDP</option></select></div>' +
        '<div class="form-group"><label>Resolution</label><select><option selected>320x240 (native)</option><option>640x480</option><option>960x720</option><option>1280x960</option></select></div>';
    }

    return '<div class="tabs-row">' +
      '<button class="tab-btn active" onclick="switchPrefTab(this,\'pref-general\')">General</button>' +
      '<button class="tab-btn" onclick="switchPrefTab(this,\'pref-editor\')">Editor</button>' +
      '<button class="tab-btn" onclick="switchPrefTab(this,\'pref-platform\')">Platform</button>' +
      '<button class="tab-btn" onclick="switchPrefTab(this,\'pref-emulator\')">Emulator</button>' +
      '<button class="tab-btn" onclick="switchPrefTab(this,\'pref-dnd\')">D&D 5e</button>' +
      '</div>' +
      '<div class="tab-content active" id="pref-general">' +
      '<div class="form-group"><label>Theme</label><select><option>Dark (Default)</option><option>Darker</option><option>Midnight</option></select></div>' +
      '<div class="form-group"><label>Font Size</label><select><option>12px</option><option selected>13px</option><option>14px</option><option>16px</option></select></div>' +
      '<div class="form-group"><label>Auto-Save Interval</label><select><option>Disabled</option><option>30 seconds</option><option>1 minute</option><option selected>5 minutes</option></select></div>' +
      '</div>' +
      '<div class="tab-content" id="pref-editor">' +
      '<div class="form-group"><label>Tab Size</label><select><option>2</option><option selected>4</option><option>8</option></select></div>' +
      '<div class="form-group"><label>Word Wrap</label><select><option selected>On</option><option>Off</option></select></div>' +
      '<div class="form-group"><label>Show Line Numbers</label><select><option selected>Yes</option><option>No</option></select></div>' +
      '</div>' +
      '<div class="tab-content" id="pref-platform">' +
      platformTabContent +
      '</div>' +
      '<div class="tab-content" id="pref-emulator">' +
      emulatorSettings +
      '</div>' +
      '<div class="tab-content" id="pref-dnd">' +
      '<div class="form-group"><label>Ruleset</label><select><option selected>D&D 5th Edition (2014)</option><option>D&D 5e Revised (2024)</option></select></div>' +
      '<div class="form-group"><label>Sources</label>' +
      '<div style="font-size:12px;color:var(--text);line-height:2;">' +
      '<label><input type="checkbox" checked> Player\'s Handbook (PHB)</label><br>' +
      '<label><input type="checkbox" checked> Dungeon Master\'s Guide (DMG)</label><br>' +
      '<label><input type="checkbox" checked> Monster Manual (MM)</label><br>' +
      '<label><input type="checkbox" checked> Xanathar\'s Guide to Everything (XGE)</label><br>' +
      '<label><input type="checkbox" checked> Tasha\'s Cauldron of Everything (TCE)</label><br>' +
      '<label><input type="checkbox"> Volo\'s Guide to Monsters (VGM)</label><br>' +
      '<label><input type="checkbox"> Mordenkainen\'s Tome of Foes (MTF)</label><br>' +
      '<label><input type="checkbox"> Fizban\'s Treasury of Dragons (FTD)</label><br>' +
      '</div></div></div>';
  }
  window.switchPrefTab = function(btn, id) {
    btn.closest('.modal-body').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.closest('.modal-body').querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(id).classList.add('active');
  };

  function buildBuildConfigHTML() {
    var pc = window.PlatformConfig;
    var p = pc ? pc.get() : null;
    if (!p) {
      return '<p style="color:var(--text2);">PlatformConfig not loaded.</p>';
    }
    var bt = p.buildTools || {};

    var pipelineSteps = '';
    if (p.bits <= 8) {
      pipelineSteps = '<label><input type="checkbox" checked> PNG to 2BPP (tiles)</label><br>' +
        '<label><input type="checkbox" checked> Strings.js to C</label><br>' +
        '<label><input type="checkbox" checked> Tables.csv to C</label><br>';
    } else if (p.bits === 16) {
      pipelineSteps = '<label><input type="checkbox" checked> PNG to 4BPP/8BPP (tiles)</label><br>' +
        '<label><input type="checkbox" checked> Tilemap to GBA format</label><br>' +
        '<label><input type="checkbox" checked> Audio to PCM (Direct Sound)</label><br>' +
        '<label><input type="checkbox" checked> Strings to C</label><br>';
    } else if (p.bits === 32) {
      pipelineSteps = '<label><input type="checkbox" checked> PNG to 4BPP/8BPP (tiles)</label><br>' +
        '<label><input type="checkbox" checked> Tilemap to NDS format</label><br>' +
        '<label><input type="checkbox" checked> 3D Models to NDS format</label><br>' +
        '<label><input type="checkbox" checked> Audio to PCM/ADPCM</label><br>' +
        '<label><input type="checkbox" checked> Strings to C</label><br>';
    } else {
      pipelineSteps = '<label><input type="checkbox" checked> Textures to CI4/CI8/RGBA16</label><br>' +
        '<label><input type="checkbox" checked> 3D Models to display lists</label><br>' +
        '<label><input type="checkbox" checked> Audio to ADPCM</label><br>' +
        '<label><input type="checkbox" checked> RSP Microcode assembly</label><br>' +
        '<label><input type="checkbox" checked> Strings to C</label><br>';
    }

    var buildCmd = 'make 2>&1';
    var preBuildCmd = 'make assets 2>&1';
    if (p.id === 'gba') { buildCmd = 'make -f Makefile.gba 2>&1'; preBuildCmd = 'make -f Makefile.gba assets 2>&1'; }
    else if (p.id === 'nds') { buildCmd = 'make -f Makefile.nds 2>&1'; preBuildCmd = 'make -f Makefile.nds assets 2>&1'; }
    else if (p.id === 'n64') { buildCmd = 'make -f Makefile.n64 2>&1'; preBuildCmd = 'make -f Makefile.n64 assets 2>&1'; }

    return '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:10px;margin-bottom:12px;">' +
      '<div style="font-weight:bold;color:var(--accent2);margin-bottom:6px;">Toolchain: ' + p.name + '</div>' +
      '<div style="font-size:12px;color:var(--text);">' +
      '<div><span style="color:var(--text2);">SDK:</span> ' + bt.sdk + ' (<a href="' + (bt.sdkUrl || '#') + '" target="_blank" style="color:var(--accent);">' + (bt.sdkUrl || '') + '</a>)</div>' +
      '</div></div>' +
      '<div class="form-row">' +
      '<div class="form-group"><label>Compiler</label><input type="text" value="' + (bt.compiler || '') + '" readonly></div>' +
      '<div class="form-group"><label>Compiler Path</label><input type="text" value="' + (bt.path || '') + '"></div>' +
      '</div>' +
      '<div class="form-group"><label>Compiler Flags</label><input type="text" value="' + (bt.flags || '') + '"></div>' +
      '<div class="form-group"><label>Source Directories</label><input type="text" value="src/, data/"></div>' +
      '<div class="form-group"><label>Object Directory</label><input type="text" value="obj/"></div>' +
      '<div class="form-group"><label>Output File</label><input type="text" value="LabyrinthOfTheDragon' + p.fileExtension + '"></div>' +
      '<div class="form-group"><label>Asset Pipeline (' + p.name + ')</label>' +
      '<div style="font-size:12px;color:var(--text);line-height:2;">' + pipelineSteps + '</div></div>' +
      '<div class="form-group"><label>Pre-Build Commands</label><textarea rows="2" style="font-family:monospace;">' + preBuildCmd + '</textarea></div>' +
      '<div class="form-group"><label>Build Command</label><textarea rows="2" style="font-family:monospace;">' + buildCmd + '</textarea></div>';
  }

  function buildRPGMakerToolHTML(action) {
    var toolName = action.split(':').pop();
    var toolConfigs = {
      mapEditor: { title: 'Map Editor', desc: 'Create and edit game maps with tiles, events, and layers.', fields: '<div class="form-group"><label>Map Name</label><input type="text" value="MAP001"></div><div class="form-row"><div class="form-group"><label>Width</label><input type="number" value="20" min="1" max="999"></div><div class="form-group"><label>Height</label><input type="number" value="15" min="1" max="999"></div></div><div class="form-group"><label>Tileset</label><select><option>Default</option><option>Dungeon</option><option>Overworld</option><option>Interior</option></select></div>' },
      eventEditor: { title: 'Event Editor', desc: 'Create event triggers, NPC dialogues, and game logic.', fields: '<div class="form-group"><label>Event Name</label><input type="text" value="EV001"></div><div class="form-group"><label>Trigger</label><select><option>Action Button</option><option>Player Touch</option><option>Event Touch</option><option>Autorun</option><option>Parallel</option></select></div><div class="form-group"><label>Commands</label><textarea rows="6" style="font-family:monospace;">Show Text: "Hello, adventurer!"</textarea></div>' },
      tilesetConfig: { title: 'Tileset Configuration', desc: 'Configure tileset properties, passability, and terrain tags.', fields: '<div class="form-group"><label>Tileset Name</label><input type="text" value="Dungeon"></div><div class="form-group"><label>Mode</label><select><option>Field</option><option>Area</option><option>VX Compatible</option></select></div><div class="form-group"><label>Tileset Image</label><select><option>dungeon.png</option><option>world_map.png</option><option>new_tiles.png</option></select></div>' },
      charGen: { title: 'Character Generator', desc: 'Create character sprites and face graphics.', fields: '<div class="form-group"><label>Character Name</label><input type="text" value="Hero"></div><div class="form-row"><div class="form-group"><label>Gender</label><select><option>Male</option><option>Female</option></select></div><div class="form-group"><label>Style</label><select><option>RPG Hero</option><option>NPC Villager</option><option>Warrior</option><option>Mage</option></select></div></div><div class="form-group"><label>Color Palette</label><select><option>Default</option><option>Dark</option><option>Light</option><option>Custom</option></select></div>' },
      playtest: { title: 'Playtest', desc: 'Run the game in test mode with debug tools enabled.', fields: '<div class="form-group"><label>Start Position</label><select><option>Map Start</option><option>Last Save</option><option>Custom Position</option></select></div><div class="form-group"><label>Debug Mode</label><select><option>Enabled</option><option>Disabled</option></select></div><div class="form-group"><label>Speed</label><select><option>1x</option><option>2x</option><option>4x</option></select></div>' },
      actors: { title: 'Database - Actors', desc: 'Manage playable characters and their base stats.', fields: '<div class="form-group"><label>Actor Name</label><input type="text" value="Hero"></div><div class="form-row"><div class="form-group"><label>Class</label><select><option>Warrior</option><option>Mage</option><option>Cleric</option><option>Thief</option></select></div><div class="form-group"><label>Initial Level</label><input type="number" value="1" min="1" max="99"></div></div><div class="form-group"><label>Description</label><textarea rows="2">A brave adventurer.</textarea></div>' },
      classes: { title: 'Database - Classes', desc: 'Define character classes and growth curves.', fields: '<div class="form-group"><label>Class Name</label><input type="text" value="Warrior"></div><div class="form-group"><label>EXP Curve</label><select><option>Fast</option><option>Medium</option><option>Slow</option></select></div><div class="form-group"><label>Parameters</label><div style="font-size:12px;color:var(--text);line-height:2;"><div>HP: <input type="number" value="500" style="width:60px"> → <input type="number" value="9999" style="width:60px"></div><div>MP: <input type="number" value="50" style="width:60px"> → <input type="number" value="500" style="width:60px"></div><div>ATK: <input type="number" value="15" style="width:60px"> → <input type="number" value="200" style="width:60px"></div></div></div>' },
      skills: { title: 'Database - Skills', desc: 'Create abilities and magic spells.', fields: '<div class="form-group"><label>Skill Name</label><input type="text" value="Fire"></div><div class="form-row"><div class="form-group"><label>Type</label><select><option>Magic</option><option>Special</option></select></div><div class="form-group"><label>MP Cost</label><input type="number" value="5" min="0"></div></div><div class="form-group"><label>Damage Formula</label><input type="text" value="a.atk * 4 - b.def * 2" style="font-family:monospace;"></div>' },
      items: { title: 'Database - Items', desc: 'Manage consumable items and key items.', fields: '<div class="form-group"><label>Item Name</label><input type="text" value="Potion"></div><div class="form-row"><div class="form-group"><label>Type</label><select><option>Regular</option><option>Key Item</option><option>Hidden A</option><option>Hidden B</option></select></div><div class="form-group"><label>Price</label><input type="number" value="50" min="0"></div></div><div class="form-group"><label>Effect</label><select><option>Recover HP</option><option>Recover MP</option><option>Add State</option><option>Remove State</option></select></div>' },
      weapons: { title: 'Database - Weapons', desc: 'Create and configure weapons.', fields: '<div class="form-group"><label>Weapon Name</label><input type="text" value="Iron Sword"></div><div class="form-row"><div class="form-group"><label>Type</label><select><option>Sword</option><option>Axe</option><option>Spear</option><option>Bow</option><option>Staff</option></select></div><div class="form-group"><label>Price</label><input type="number" value="100" min="0"></div></div><div class="form-group"><label>Attack</label><input type="number" value="10" min="0"></div>' },
      armor: { title: 'Database - Armor', desc: 'Create and configure armor and accessories.', fields: '<div class="form-group"><label>Armor Name</label><input type="text" value="Iron Shield"></div><div class="form-row"><div class="form-group"><label>Type</label><select><option>Shield</option><option>Head</option><option>Body</option><option>Accessory</option></select></div><div class="form-group"><label>Price</label><input type="number" value="150" min="0"></div></div><div class="form-group"><label>Defense</label><input type="number" value="8" min="0"></div>' },
      enemies: { title: 'Database - Enemies', desc: 'Define enemy monsters and their stats.', fields: '<div class="form-group"><label>Enemy Name</label><input type="text" value="Slime"></div><div class="form-row"><div class="form-group"><label>HP</label><input type="number" value="50" min="1"></div><div class="form-group"><label>ATK</label><input type="number" value="10" min="0"></div><div class="form-group"><label>DEF</label><input type="number" value="5" min="0"></div></div><div class="form-group"><label>EXP</label><input type="number" value="10" min="0"></div>' },
      troops: { title: 'Database - Troops', desc: 'Configure enemy encounter groups.', fields: '<div class="form-group"><label>Troop Name</label><input type="text" value="Slime x2"></div><div class="form-group"><label>Members</label><div style="font-size:12px;color:var(--text);line-height:2;"><div>1. <select><option>Slime</option><option>Bat</option><option>Goblin</option></select> x <input type="number" value="2" style="width:40px" min="1"></div></div></div>' },
      states: { title: 'Database - States', desc: 'Define status effects and conditions.', fields: '<div class="form-group"><label>State Name</label><input type="text" value="Poison"></div><div class="form-row"><div class="form-group"><label>Priority</label><input type="number" value="50" min="0" max="100"></div><div class="form-group"><label>Duration</label><select><option>Turns</option><option>Steps</option><option>Permanent</option></select></div></div>' },
      animations: { title: 'Database - Animations', desc: 'Create battle and skill animations.', fields: '<div class="form-group"><label>Animation Name</label><input type="text" value="Fire Effect"></div><div class="form-group"><label>Image</label><select><option>Effects 1</option><option>Effects 2</option><option>Custom</option></select></div><div class="form-group"><label>Frames</label><input type="number" value="10" min="1" max="100"></div>' },
      tilesets: { title: 'Database - Tilesets', desc: 'Manage tileset definitions and properties.', fields: '<div class="form-group"><label>Tileset Name</label><input type="text" value="Dungeon"></div><div class="form-group"><label>Mode</label><select><option>Field</option><option>Area</option><option>VX Compatible</option></select></div>' },
      commonEvents: { title: 'Database - Common Events', desc: 'Create reusable event sequences.', fields: '<div class="form-group"><label>Event Name</label><input type="text" value="Shop"></div><div class="form-group"><label>Trigger</label><select><option>None</option><option>Autorun</option><option>Parallel</option></select></div><div class="form-group"><label>Commands</label><textarea rows="4" style="font-family:monospace;">Show Choices: ["Buy","Sell","Cancel"]</textarea></div>' },
      system: { title: 'Database - System', desc: 'Configure game system settings.', fields: '<div class="form-group"><label>Game Title</label><input type="text" value="Labyrinth of the Dragon"></div><div class="form-row"><div class="form-group"><label>Party Size</label><input type="number" value="4" min="1" max="8"></div><div class="form-group"><label>Currency</label><input type="text" value="Gold"></div></div><div class="form-group"><label>Starting Map</label><select><option>floor1</option><option>floor2</option><option>floor_test</option></select></div>' }
    };
    var config = toolConfigs[toolName] || { title: toolName, desc: 'RPG Maker tool panel.', fields: '<p style="color:var(--text2);">Tool configuration coming soon.</p>' };
    return '<p style="color:var(--text2);margin-bottom:12px;">' + config.desc + '</p>' + config.fields +
      '<div style="text-align:right;margin-top:16px;"><button class="save-btn" onclick="setStatusFromMenu(\'RPG Maker: ' + config.title + ' saved\',\'ok\');closeModal();">Apply</button></div>';
  }

  function buildTargetPlatformModalHTML() {
    var pc = window.PlatformConfig;
    var currentId = pc ? pc.current : 'gbc';
    var list = pc ? pc.getPlatformList() : [{ id: 'gbc', name: 'Game Boy Color', bits: 8 }];
    var opts = list.map(function(pl) {
      return '<option value="' + pl.id + '"' + (pl.id === currentId ? ' selected' : '') + '>' + pl.name + ' (' + pl.bits + '-bit)</option>';
    }).join('');
    return '<div class="form-group"><label>Select Target Platform</label>' +
      '<select id="targetPlatformSel" style="width:100%;">' + opts + '</select></div>' +
      '<p style="color:var(--text2);font-size:11px;margin-top:8px;">Changing the target platform affects compiler flags and available hardware features.</p>';
  }

  function rebuildTargetPlatformMenu() {
    var pc = window.PlatformConfig;
    if (!pc) return;
    var currentId = pc.current;
    var targetMenuItems = menuData.find(function(m) { return m.label === 'Build'; });
    if (!targetMenuItems) return;
    var targetPlatformItem = null;
    for (var i = 0; i < targetMenuItems.items.length; i++) {
      var item = targetMenuItems.items[i];
      if (item && item.label === 'Target Platform') { targetPlatformItem = item; break; }
    }
    if (!targetPlatformItem || !targetPlatformItem.children) return;
    targetPlatformItem.children.forEach(function(child) {
      if (child && child.action) {
        var childId = child.action.split(':')[1];
        if (childId === 'dmg') childId = 'gb';
        child.checked = (childId === currentId);
      }
    });
    buildMenuBar();
  }

  document.addEventListener('DOMContentLoaded', function() {
    buildMenuBar();
    var saved = localStorage.getItem('targetPlatform');
    if (saved && window.PlatformConfig && window.PlatformConfig.platforms[saved]) {
      window.PlatformConfig.set(saved);
      rebuildTargetPlatformMenu();
    }
  });

  window.handleMenuAction = handleMenuAction;
})();
