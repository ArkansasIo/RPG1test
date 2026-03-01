(function() {
  "use strict";

  var SPRITE_LIBRARY = {
    monsters_aberration: {
      category: 'Monsters - Aberrations',
      book: 'MM/VGM/MTF',
      items: [
        'Aboleth', 'Beholder', 'Beholder Zombie', 'Chuul', 'Cloaker', 'Death Kiss', 'Death Tyrant',
        'Flumph', 'Gazer', 'Gibbering Mouther', 'Grell', 'Illithid (Mind Flayer)', 'Intellect Devourer',
        'Nothic', 'Otyugh', 'Spectator', 'Star Spawn', 'Umber Hulk',
        'Elder Brain', 'Ulitharid', 'Neothelid', 'Mindwitness', 'Cranium Rat'
      ]
    },
    monsters_beast: {
      category: 'Monsters - Beasts',
      book: 'MM',
      items: [
        'Bat', 'Black Bear', 'Brown Bear', 'Boar', 'Cat', 'Constrictor Snake', 'Crocodile',
        'Dire Wolf', 'Eagle', 'Elk', 'Frog', 'Giant Ape', 'Giant Bat', 'Giant Boar',
        'Giant Constrictor Snake', 'Giant Crab', 'Giant Crocodile', 'Giant Eagle', 'Giant Elk',
        'Giant Frog', 'Giant Hyena', 'Giant Octopus', 'Giant Owl', 'Giant Poisonous Snake',
        'Giant Rat', 'Giant Scorpion', 'Giant Shark', 'Giant Spider', 'Giant Toad',
        'Giant Vulture', 'Giant Wasp', 'Giant Wolf Spider', 'Hawk', 'Hunter Shark',
        'Hyena', 'Lion', 'Mammoth', 'Mastiff', 'Mule', 'Octopus', 'Owl',
        'Panther', 'Phase Spider', 'Polar Bear', 'Rat', 'Raven', 'Rhinoceros',
        'Saber-Toothed Tiger', 'Scorpion', 'Spider', 'Swarm of Bats', 'Swarm of Rats',
        'Tiger', 'Vulture', 'War Horse', 'Wolf', 'Worg'
      ]
    },
    monsters_celestial: {
      category: 'Monsters - Celestials',
      book: 'MM',
      items: [
        'Couatl', 'Deva', 'Empyrean', 'Ki-rin', 'Pegasus', 'Planetar', 'Solar', 'Unicorn',
        'Hollyphant', 'Celestial Spirit'
      ]
    },
    monsters_construct: {
      category: 'Monsters - Constructs',
      book: 'MM/MTF',
      items: [
        'Animated Armor', 'Clay Golem', 'Flesh Golem', 'Flying Sword', 'Helmed Horror',
        'Homunculus', 'Iron Golem', 'Modron (Monodrone)', 'Modron (Duodrone)', 'Modron (Tridrone)',
        'Modron (Quadrone)', 'Modron (Pentadrone)', 'Rug of Smothering', 'Scarecrow',
        'Shield Guardian', 'Stone Golem', 'Retriever', 'Steel Predator', 'Clockwork Bronze Scout',
        'Clockwork Iron Cobra', 'Clockwork Stone Defender', 'Clockwork Oaken Bolter'
      ]
    },
    monsters_dragon: {
      category: 'Monsters - Dragons',
      book: 'MM/FTD',
      items: [
        'Red Dragon Wyrmling', 'Young Red Dragon', 'Adult Red Dragon', 'Ancient Red Dragon',
        'Blue Dragon Wyrmling', 'Young Blue Dragon', 'Adult Blue Dragon', 'Ancient Blue Dragon',
        'Green Dragon Wyrmling', 'Young Green Dragon', 'Adult Green Dragon', 'Ancient Green Dragon',
        'Black Dragon Wyrmling', 'Young Black Dragon', 'Adult Black Dragon', 'Ancient Black Dragon',
        'White Dragon Wyrmling', 'Young White Dragon', 'Adult White Dragon', 'Ancient White Dragon',
        'Brass Dragon Wyrmling', 'Young Brass Dragon', 'Adult Brass Dragon', 'Ancient Brass Dragon',
        'Bronze Dragon Wyrmling', 'Young Bronze Dragon', 'Adult Bronze Dragon', 'Ancient Bronze Dragon',
        'Copper Dragon Wyrmling', 'Young Copper Dragon', 'Adult Copper Dragon', 'Ancient Copper Dragon',
        'Gold Dragon Wyrmling', 'Young Gold Dragon', 'Adult Gold Dragon', 'Ancient Gold Dragon',
        'Silver Dragon Wyrmling', 'Young Silver Dragon', 'Adult Silver Dragon', 'Ancient Silver Dragon',
        'Dragon Turtle', 'Faerie Dragon', 'Pseudodragon', 'Wyvern',
        'Shadow Dragon', 'Dracolich', 'Deep Dragon', 'Moonstone Dragon', 'Sapphire Dragon'
      ]
    },
    monsters_elemental: {
      category: 'Monsters - Elementals',
      book: 'MM/MTF',
      items: [
        'Air Elemental', 'Dust Mephit', 'Earth Elemental', 'Efreeti', 'Fire Elemental',
        'Galeb Duhr', 'Gargoyle', 'Ice Mephit', 'Invisible Stalker', 'Magma Mephit',
        'Magmin', 'Mud Mephit', 'Smoke Mephit', 'Steam Mephit', 'Water Elemental',
        'Water Weird', 'Xorn', 'Dao', 'Djinni', 'Marid',
        'Phoenix', 'Elder Tempest', 'Leviathan', 'Zaratan'
      ]
    },
    monsters_fey: {
      category: 'Monsters - Fey',
      book: 'MM/VGM',
      items: [
        'Blink Dog', 'Dryad', 'Green Hag', 'Night Hag', 'Sea Hag', 'Pixie', 'Quickling',
        'Redcap', 'Satyr', 'Sprite', 'Yeth Hound', 'Hag (Annis)', 'Hag (Bheur)',
        'Eladrin (Autumn)', 'Eladrin (Spring)', 'Eladrin (Summer)', 'Eladrin (Winter)',
        'Korred', 'Meenlock', 'Darkling', 'Darkling Elder'
      ]
    },
    monsters_fiend: {
      category: 'Monsters - Fiends',
      book: 'MM/MTF',
      items: [
        'Balor', 'Barbed Devil', 'Bearded Devil', 'Bone Devil', 'Chain Devil',
        'Dretch', 'Erinyes', 'Glabrezu', 'Hezrou', 'Horned Devil', 'Ice Devil',
        'Imp', 'Lemure', 'Marilith', 'Nalfeshnee', 'Pit Fiend', 'Quasit',
        'Shadow Demon', 'Succubus/Incubus', 'Vrock', 'Arcanaloth', 'Mezzoloth',
        'Nycaloth', 'Ultroloth', 'Barlgura', 'Chasme', 'Babau',
        'Cambion', 'Hell Hound', 'Nightmare', 'Rakshasa', 'Yochlol',
        'Yeenoghu', 'Demogorgon', 'Orcus', 'Zariel', 'Tiamat'
      ]
    },
    monsters_giant: {
      category: 'Monsters - Giants',
      book: 'MM/VGM',
      items: [
        'Cloud Giant', 'Ettin', 'Fire Giant', 'Frost Giant', 'Hill Giant',
        'Stone Giant', 'Storm Giant', 'Cyclops', 'Fomorian', 'Ogre',
        'Half-Ogre', 'Troll', 'Fire Giant Dreadnought', 'Frost Giant Everlasting One',
        'Mouth of Grolantor', 'Stone Giant Dreamwalker', 'Storm Giant Quintessent',
        'Cloud Giant Smiling One'
      ]
    },
    monsters_humanoid: {
      category: 'Monsters - Humanoids',
      book: 'MM/VGM',
      items: [
        'Acolyte', 'Archmage', 'Assassin', 'Bandit', 'Bandit Captain', 'Berserker',
        'Commoner', 'Cultist', 'Cult Fanatic', 'Druid (NPC)', 'Gladiator', 'Guard',
        'Knight', 'Mage', 'Noble', 'Priest', 'Scout', 'Spy', 'Thug', 'Veteran',
        'Bugbear', 'Gnoll', 'Gnoll Pack Lord', 'Goblin', 'Goblin Boss', 'Hobgoblin',
        'Hobgoblin Captain', 'Kobold', 'Kobold Inventor', 'Kobold Scale Sorcerer',
        'Lizardfolk', 'Lizardfolk Shaman', 'Merfolk', 'Orc', 'Orc War Chief',
        'Orc Eye of Gruumsh', 'Sahuagin', 'Sahuagin Priestess', 'Duergar',
        'Githyanki Warrior', 'Githzerai Monk', 'Kenku', 'Kuo-toa',
        'Tortle', 'Yuan-ti Pureblood', 'Yuan-ti Malison', 'Yuan-ti Abomination'
      ]
    },
    monsters_monstrosity: {
      category: 'Monsters - Monstrosities',
      book: 'MM/VGM',
      items: [
        'Ankheg', 'Basilisk', 'Behir', 'Bulette', 'Carrion Crawler', 'Centaur',
        'Chimera', 'Cockatrice', 'Darkmantle', 'Death Dog', 'Displacer Beast',
        'Drider', 'Ettercap', 'Gorgon', 'Griffon', 'Harpy', 'Hippogriff',
        'Hook Horror', 'Hydra', 'Kraken', 'Lamia', 'Manticore', 'Medusa',
        'Merrow', 'Mimic', 'Minotaur', 'Owlbear', 'Peryton', 'Purple Worm',
        'Remorhaz', 'Roc', 'Rust Monster', 'Sphinx (Androsphinx)', 'Sphinx (Gynosphinx)',
        'Stirge', 'Tarrasque', 'Winter Wolf', 'Worg', 'Yuan-ti Anathema',
        'Catoblepas', 'Cave Fisher', 'Chitine', 'Froghemoth', 'Leucrotta',
        'Tlincalli', 'Vargouille', 'Banderhobb', 'Shadow Mastiff'
      ]
    },
    monsters_ooze: {
      category: 'Monsters - Oozes',
      book: 'MM/MTF',
      items: [
        'Black Pudding', 'Gelatinous Cube', 'Gray Ooze', 'Ochre Jelly',
        'Oblex Spawn', 'Adult Oblex', 'Elder Oblex', 'Slithering Tracker'
      ]
    },
    monsters_plant: {
      category: 'Monsters - Plants',
      book: 'MM/VGM',
      items: [
        'Awakened Shrub', 'Awakened Tree', 'Blights (Needle)', 'Blights (Twig)',
        'Blights (Vine)', 'Myconid Sprout', 'Myconid Adult', 'Myconid Sovereign',
        'Shambling Mound', 'Shrieker', 'Treant', 'Vegepygmy', 'Thorny',
        'Corpse Flower', 'Wood Woad'
      ]
    },
    monsters_undead: {
      category: 'Monsters - Undead',
      book: 'MM/VGM/MTF',
      items: [
        'Banshee', 'Crawling Claw', 'Death Knight', 'Demilich', 'Flameskull',
        'Ghost', 'Ghast', 'Ghoul', 'Lich', 'Mummy', 'Mummy Lord',
        'Poltergeist', 'Revenant', 'Shadow', 'Skeleton', 'Skeleton Warrior',
        'Specter', 'Vampire', 'Vampire Spawn', 'Wight', 'Will-o\'-Wisp',
        'Wraith', 'Zombie', 'Zombie Ogre', 'Allip', 'Boneclaw', 'Deathlord',
        'Skull Lord', 'Sword Wraith', 'Spawn of Kyuss', 'Bodak',
        'Nightwalker', 'Nagpa', 'Dracolich'
      ]
    },
    character_classes: {
      category: 'Character Classes',
      book: 'PHB/XGE/TCE',
      items: [
        'Barbarian', 'Barbarian (Berserker)', 'Barbarian (Totem Warrior)', 'Barbarian (Ancestral Guardian)',
        'Bard', 'Bard (College of Lore)', 'Bard (College of Valor)', 'Bard (College of Swords)',
        'Cleric', 'Cleric (Life Domain)', 'Cleric (Light Domain)', 'Cleric (War Domain)', 'Cleric (Forge Domain)',
        'Druid', 'Druid (Circle of the Land)', 'Druid (Circle of the Moon)', 'Druid (Circle of Spores)',
        'Fighter', 'Fighter (Champion)', 'Fighter (Battle Master)', 'Fighter (Eldritch Knight)', 'Fighter (Samurai)',
        'Monk', 'Monk (Open Hand)', 'Monk (Shadow)', 'Monk (Four Elements)', 'Monk (Kensei)',
        'Paladin', 'Paladin (Devotion)', 'Paladin (Ancients)', 'Paladin (Vengeance)', 'Paladin (Conquest)',
        'Ranger', 'Ranger (Hunter)', 'Ranger (Beast Master)', 'Ranger (Gloom Stalker)', 'Ranger (Horizon Walker)',
        'Rogue', 'Rogue (Thief)', 'Rogue (Assassin)', 'Rogue (Arcane Trickster)', 'Rogue (Swashbuckler)',
        'Sorcerer', 'Sorcerer (Draconic)', 'Sorcerer (Wild Magic)', 'Sorcerer (Shadow Magic)',
        'Warlock', 'Warlock (Archfey)', 'Warlock (Fiend)', 'Warlock (Great Old One)', 'Warlock (Hexblade)',
        'Wizard', 'Wizard (Abjuration)', 'Wizard (Evocation)', 'Wizard (Necromancy)', 'Wizard (Divination)',
        'Artificer', 'Artificer (Alchemist)', 'Artificer (Armorer)', 'Artificer (Artillerist)', 'Artificer (Battle Smith)'
      ]
    },
    character_races: {
      category: 'Character Races',
      book: 'PHB/VGM/MTF/EGW',
      items: [
        'Human (Male)', 'Human (Female)', 'High Elf (Male)', 'High Elf (Female)',
        'Wood Elf (Male)', 'Wood Elf (Female)', 'Dark Elf / Drow (Male)', 'Dark Elf / Drow (Female)',
        'Hill Dwarf (Male)', 'Hill Dwarf (Female)', 'Mountain Dwarf (Male)', 'Mountain Dwarf (Female)',
        'Lightfoot Halfling', 'Stout Halfling', 'Forest Gnome', 'Rock Gnome',
        'Half-Elf (Male)', 'Half-Elf (Female)', 'Half-Orc (Male)', 'Half-Orc (Female)',
        'Tiefling (Male)', 'Tiefling (Female)', 'Dragonborn (Male)', 'Dragonborn (Female)',
        'Aasimar (Protector)', 'Aasimar (Scourge)', 'Aasimar (Fallen)',
        'Goliath', 'Tabaxi', 'Kenku', 'Firbolg', 'Tortle',
        'Triton', 'Lizardfolk', 'Kobold', 'Goblin (PC)', 'Hobgoblin (PC)', 'Bugbear (PC)',
        'Orc (PC)', 'Yuan-ti Pureblood (PC)', 'Changeling', 'Kalashtar', 'Shifter', 'Warforged',
        'Genasi (Air)', 'Genasi (Earth)', 'Genasi (Fire)', 'Genasi (Water)',
        'Githyanki', 'Githzerai', 'Minotaur (PC)', 'Centaur (PC)',
        'Satyr (PC)', 'Fairy', 'Harengon', 'Owlin',
        'Aarakocra', 'Grung', 'Locathah', 'Verdan'
      ]
    },
    weapons: {
      category: 'Weapons',
      book: 'PHB/DMG',
      items: [
        'Club', 'Dagger', 'Greatclub', 'Handaxe', 'Javelin', 'Light Hammer', 'Mace',
        'Quarterstaff', 'Sickle', 'Spear', 'Crossbow (Light)', 'Dart', 'Shortbow', 'Sling',
        'Battleaxe', 'Flail', 'Glaive', 'Greataxe', 'Greatsword', 'Halberd', 'Lance',
        'Longsword', 'Maul', 'Morningstar', 'Pike', 'Rapier', 'Scimitar', 'Shortsword',
        'Trident', 'War Pick', 'Warhammer', 'Whip', 'Blowgun', 'Crossbow (Hand)',
        'Crossbow (Heavy)', 'Longbow', 'Net',
        'Vorpal Sword', 'Flame Tongue', 'Frost Brand', 'Holy Avenger', 'Sun Blade',
        'Dragon Slayer', 'Giant Slayer', 'Oathbow', 'Staff of Power', 'Staff of the Magi',
        'Dagger of Venom', 'Javelin of Lightning', 'Mace of Disruption', 'Mace of Smiting',
        'Hammer of Thunderbolts', 'Trident of Fish Command', 'Wand of Fireballs',
        'Wand of Lightning Bolts', 'Rod of Lordly Might'
      ]
    },
    armor: {
      category: 'Armor & Shields',
      book: 'PHB/DMG',
      items: [
        'Padded Armor', 'Leather Armor', 'Studded Leather', 'Hide Armor',
        'Chain Shirt', 'Scale Mail', 'Breastplate', 'Half Plate',
        'Ring Mail', 'Chain Mail', 'Splint Armor', 'Plate Armor',
        'Wooden Shield', 'Steel Shield', 'Tower Shield',
        'Adamantine Armor', 'Mithral Armor', 'Armor of Resistance',
        'Dragon Scale Mail', 'Dwarven Plate', 'Elven Chain',
        'Glamoured Studded Leather', 'Plate Armor of Etherealness',
        'Shield +1', 'Shield +2', 'Shield +3',
        'Shield of Missile Attraction', 'Spellguard Shield',
        'Animated Shield', 'Sentinel Shield', 'Arrow-Catching Shield',
        'Demon Armor', 'Armor of Invulnerability', 'Armor of Vulnerability'
      ]
    },
    items_equipment: {
      category: 'Equipment & Adventuring Gear',
      book: 'PHB',
      items: [
        'Backpack', 'Bedroll', 'Rope (50 ft)', 'Torch', 'Lantern (Hooded)', 'Lantern (Bullseye)',
        'Tinderbox', 'Waterskin', 'Rations', 'Tent', 'Grappling Hook',
        'Piton', 'Hammer', 'Crowbar', 'Chain (10 ft)', 'Caltrops', 'Ball Bearings',
        'Oil Flask', 'Acid Vial', 'Alchemist\'s Fire', 'Holy Water', 'Antitoxin',
        'Healer\'s Kit', 'Herbalism Kit', 'Thieves\' Tools', 'Forgery Kit',
        'Disguise Kit', 'Poisoner\'s Kit', 'Navigator\'s Tools', 'Cartographer\'s Tools',
        'Lute', 'Drum', 'Flute', 'Horn', 'Lyre', 'Pan Flute',
        'Component Pouch', 'Arcane Focus (Crystal)', 'Arcane Focus (Orb)', 'Arcane Focus (Rod)',
        'Arcane Focus (Staff)', 'Arcane Focus (Wand)', 'Druidic Focus (Sprig)',
        'Holy Symbol (Amulet)', 'Holy Symbol (Emblem)', 'Holy Symbol (Reliquary)',
        'Spellbook', 'Scroll Case', 'Map Case', 'Quiver',
        'Climber\'s Kit', 'Fishing Tackle', 'Hunting Trap', 'Mirror (Steel)',
        'Magnifying Glass', 'Spyglass', 'Hourglass', 'Lock', 'Manacles'
      ]
    },
    items_magic: {
      category: 'Magic Items & Wondrous Items',
      book: 'DMG',
      items: [
        'Bag of Holding', 'Boots of Elvenkind', 'Boots of Speed', 'Boots of Striding and Springing',
        'Bracers of Defense', 'Brooch of Shielding', 'Broom of Flying',
        'Cape of the Mountebank', 'Carpet of Flying', 'Circlet of Blasting',
        'Cloak of Displacement', 'Cloak of Elvenkind', 'Cloak of Protection',
        'Cloak of the Bat', 'Crystal Ball', 'Cube of Force',
        'Decanter of Endless Water', 'Deck of Many Things', 'Dust of Disappearance',
        'Eversmoking Bottle', 'Eyes of Charming', 'Eyes of the Eagle',
        'Figurine of Wondrous Power', 'Folding Boat', 'Gauntlets of Ogre Power',
        'Gem of Seeing', 'Gloves of Swimming and Climbing', 'Goggles of Night',
        'Hat of Disguise', 'Headband of Intellect', 'Helm of Brilliance',
        'Helm of Telepathy', 'Horn of Blasting', 'Immovable Rod',
        'Ioun Stone (various)', 'Iron Bands of Bilarro', 'Iron Flask',
        'Lantern of Revealing', 'Luck Blade', 'Manual of Bodily Health',
        'Medallion of Thoughts', 'Mirror of Life Trapping', 'Necklace of Fireballs',
        'Pearl of Power', 'Periapt of Health', 'Portable Hole',
        'Ring of Invisibility', 'Ring of Protection', 'Ring of Regeneration',
        'Ring of Spell Storing', 'Ring of Three Wishes', 'Robe of Eyes',
        'Robe of Stars', 'Robe of the Archmagi', 'Rod of Absorption',
        'Sphere of Annihilation', 'Stone of Good Luck', 'Tome of Clear Thought',
        'Wand of Magic Detection', 'Wand of Magic Missiles', 'Wings of Flying',
        'Amulet of Health', 'Amulet of Proof Against Detection', 'Amulet of the Planes',
        'Belt of Giant Strength', 'Candle of Invocation', 'Talisman of Pure Good'
      ]
    },
    items_potions: {
      category: 'Potions & Scrolls',
      book: 'DMG',
      items: [
        'Potion of Healing', 'Potion of Greater Healing', 'Potion of Superior Healing',
        'Potion of Supreme Healing', 'Potion of Climbing', 'Potion of Fire Breath',
        'Potion of Flying', 'Potion of Giant Strength (Hill)', 'Potion of Giant Strength (Frost)',
        'Potion of Giant Strength (Stone)', 'Potion of Giant Strength (Fire)',
        'Potion of Giant Strength (Cloud)', 'Potion of Giant Strength (Storm)',
        'Potion of Growth', 'Potion of Heroism', 'Potion of Invisibility',
        'Potion of Mind Reading', 'Potion of Poison', 'Potion of Resistance',
        'Potion of Speed', 'Potion of Water Breathing',
        'Spell Scroll (Cantrip)', 'Spell Scroll (1st)', 'Spell Scroll (2nd)',
        'Spell Scroll (3rd)', 'Spell Scroll (4th)', 'Spell Scroll (5th)',
        'Spell Scroll (6th)', 'Spell Scroll (7th)', 'Spell Scroll (8th)',
        'Spell Scroll (9th)', 'Scroll of Protection'
      ]
    },
    zones_dungeons: {
      category: 'Zones - Dungeons & Interiors',
      book: 'DMG',
      items: [
        'Dungeon Corridor', 'Dungeon Room', 'Dungeon Hall', 'Dungeon Chamber (Large)',
        'Prison Cell', 'Torture Chamber', 'Treasure Vault', 'Throne Room',
        'Library / Archive', 'Alchemist Lab', 'Summoning Circle', 'Crypt / Tomb',
        'Sarcophagus Room', 'Altar Room', 'Temple Interior', 'Mine Shaft',
        'Underground River', 'Underground Lake', 'Lava Chamber', 'Ice Cavern',
        'Spider Web Lair', 'Dragon Hoard', 'Lich Lair', 'Beholder Lair',
        'Sewer Tunnels', 'Catacomb', 'Secret Passage', 'Trapped Corridor',
        'Arena / Pit', 'Boss Chamber', 'Puzzle Room', 'Flooded Room'
      ]
    },
    zones_wilderness: {
      category: 'Zones - Wilderness & Biomes',
      book: 'DMG/PHB',
      items: [
        'Forest (Deciduous)', 'Forest (Coniferous)', 'Forest (Enchanted)', 'Forest (Dead/Corrupted)',
        'Jungle (Dense)', 'Jungle (Ruins)', 'Swamp / Marsh', 'Swamp (Haunted)',
        'Desert (Sand)', 'Desert (Rocky)', 'Desert (Oasis)', 'Tundra / Arctic',
        'Tundra (Ice Field)', 'Mountains (Snow Peak)', 'Mountains (Alpine Meadow)',
        'Mountains (Volcanic)', 'Hills (Rolling)', 'Plains / Grassland', 'Savanna',
        'Coast / Beach', 'Cliffs / Sea Cave', 'Coral Reef', 'Open Ocean',
        'Underground (Underdark)', 'Underdark (Mushroom Forest)', 'Underdark (Crystal Cave)',
        'Underdark (Drow City)', 'Underdark (Lake)', 'Feywild Glade', 'Shadowfell Wastes',
        'Elemental Plane of Fire', 'Elemental Plane of Water', 'Elemental Plane of Air',
        'Elemental Plane of Earth', 'Astral Plane', 'Ethereal Plane',
        'The Abyss', 'The Nine Hells', 'Mount Celestia', 'Mechanus', 'Limbo'
      ]
    },
    zones_settlements: {
      category: 'Zones - Settlements & Structures',
      book: 'DMG',
      items: [
        'Village (Small)', 'Town (Market)', 'City (District)', 'Castle (Exterior)',
        'Castle (Interior)', 'Keep / Fortress', 'Tower (Wizard)', 'Tower (Guard)',
        'Tavern / Inn', 'Blacksmith / Forge', 'General Store', 'Apothecary',
        'Temple / Church', 'Guild Hall', 'Barracks', 'Stable',
        'Dock / Harbor', 'Ship (Sailing)', 'Ship (Galley)', 'Ship (Airship)',
        'Graveyard / Cemetery', 'Ruins (Ancient)', 'Ruins (Recent)',
        'Farm / Homestead', 'Mill / Windmill', 'Bridge (Stone)', 'Bridge (Rope)',
        'Camp / Campfire', 'Caravan / Wagon', 'Gate / City Wall',
        'Market Square', 'Sewers (City)', 'Mansion / Noble House',
        'Wizard Academy', 'Colosseum', 'Palace'
      ]
    },
    tiles_terrain: {
      category: 'Tiles - Terrain & Map Features',
      book: 'DMG',
      items: [
        'Grass Tile', 'Dirt Tile', 'Stone Floor', 'Wood Floor', 'Sand Tile',
        'Snow Tile', 'Ice Tile', 'Lava Tile', 'Water (Shallow)', 'Water (Deep)',
        'Mud Tile', 'Cobblestone', 'Marble Floor', 'Brick Wall', 'Stone Wall',
        'Wood Wall', 'Door (Wooden)', 'Door (Iron)', 'Door (Locked)', 'Door (Secret)',
        'Stairs (Up)', 'Stairs (Down)', 'Ladder', 'Pit / Hole', 'Trap (Floor)',
        'Trap (Arrow)', 'Trap (Spike)', 'Trap (Poison Gas)', 'Chest (Closed)',
        'Chest (Open)', 'Chest (Mimic)', 'Barrel', 'Crate', 'Table', 'Chair',
        'Bed', 'Bookshelf', 'Torch (Wall)', 'Brazier', 'Fountain', 'Statue',
        'Pillar', 'Rubble', 'Bones / Skull', 'Spider Web', 'Mushroom',
        'Crystal Formation', 'Stalactite', 'Loot Pile', 'Campfire',
        'Sign Post', 'Grave / Tombstone', 'Altar', 'Throne', 'Mirror',
        'Portal / Teleporter', 'Lever / Switch', 'Pressure Plate'
      ]
    },
    npcs: {
      category: 'NPCs & Townsfolk',
      book: 'DMG/PHB',
      items: [
        'King', 'Queen', 'Prince', 'Princess', 'Noble Lord', 'Noble Lady',
        'Knight (Guard)', 'Knight (Mounted)', 'Guard (City)', 'Guard (Castle)',
        'Soldier (Infantry)', 'Soldier (Archer)', 'Captain',
        'Merchant', 'Shopkeeper', 'Innkeeper', 'Bartender', 'Barmaid',
        'Blacksmith', 'Alchemist', 'Herbalist', 'Healer', 'Sage / Scholar',
        'Wizard (NPC)', 'Witch', 'Necromancer', 'Warlock (NPC)',
        'Priest', 'Monk (NPC)', 'Acolyte', 'Pilgrim',
        'Farmer', 'Fisher', 'Miner', 'Lumberjack', 'Hunter',
        'Thief', 'Assassin', 'Spy', 'Pirate', 'Bandit',
        'Beggar', 'Street Urchin', 'Town Crier', 'Messenger',
        'Bard (NPC)', 'Entertainer', 'Dancer', 'Jester',
        'Caravan Master', 'Sailor', 'Ship Captain', 'Navigator',
        'Gladiator', 'Arena Master', 'Executioner',
        'Guild Master', 'Crime Boss', 'Bounty Hunter'
      ]
    },
    effects_ui: {
      category: 'Effects & UI Elements',
      book: 'Custom',
      items: [
        'Fire Effect', 'Ice Effect', 'Lightning Effect', 'Poison Cloud', 'Healing Aura',
        'Shield Bubble', 'Magic Circle', 'Explosion', 'Smoke', 'Sparkle',
        'Blood Splatter', 'Slash Effect', 'Arrow Trail', 'Spell Impact',
        'Level Up Effect', 'Death Effect', 'Summon Effect', 'Teleport Effect',
        'HP Bar', 'MP Bar', 'XP Bar', 'Status Icon (Poisoned)', 'Status Icon (Stunned)',
        'Status Icon (Blessed)', 'Status Icon (Cursed)', 'Damage Numbers',
        'Dialog Box', 'Menu Frame', 'Button (Normal)', 'Button (Pressed)',
        'Icon (Sword)', 'Icon (Shield)', 'Icon (Potion)', 'Icon (Scroll)',
        'Icon (Gold Coin)', 'Icon (Key)', 'Icon (Heart)', 'Icon (Star)',
        'Icon (Skull)', 'Icon (Crown)', 'Cursor (Arrow)', 'Cursor (Hand)',
        'Font (8x8 Pixel)', 'Border / Frame Tiles', 'Window Skin'
      ]
    }
  };

  var DEFAULT_PALETTES = {
    gb: { name: 'Game Boy (DMG)', colors: ['#0f380f', '#306230', '#8bac0f', '#9bbc0f'] },
    gbc_green: { name: 'GBC Green', colors: ['#002b13', '#005229', '#00a651', '#39b54a', '#8dc63f', '#d7e4bd'] },
    gbc_default: { name: 'GBC Default', colors: ['#081820', '#346856', '#88c070', '#e0f8d0'] },
    nes: { name: 'NES Palette', colors: ['#000000','#7c7c7c','#bcbcbc','#fcfcfc','#0000fc','#0078f8','#3cbcfc','#a4e4fc','#0000bc','#0058f8','#6888fc','#b8b8f8','#4428bc','#6844fc','#9878f8','#d8b8f8','#940084','#d800cc','#f878f8','#f8b8f8','#a80020','#e40058','#f85898','#f8a4c0','#a81000','#f83800','#f87858','#f0d0b0','#881400','#e45c10','#fca044','#fce0a8','#503000','#ac7c00','#f8b800','#f8d878','#007800','#00b800','#b8f818','#d8f878','#006800','#00a800','#58d854','#b8f8b8','#005800','#00a844','#58f898','#b8f8d8','#004058','#008888','#00e8d8','#00fcfc','#000000','#787878','#b8b8b8','#f8d8f8'] },
    snes: { name: 'SNES Palette', colors: ['#000000','#202020','#404040','#606060','#808080','#a0a0a0','#c0c0c0','#ffffff','#800000','#ff0000','#ff8080','#008000','#00ff00','#80ff80','#000080','#0000ff','#8080ff','#808000','#ffff00','#ffff80','#800080','#ff00ff','#ff80ff','#008080','#00ffff','#80ffff'] },
    dnd_classic: { name: 'D&D Classic', colors: ['#1a1a2e','#16213e','#0f3460','#e94560','#533483','#2b2d42','#8d99ae','#edf2f4','#d90429','#ef233c','#ffd166','#06d6a0','#118ab2','#073b4c'] },
    dnd_dungeon: { name: 'Dungeon Crawl', colors: ['#0d0d0d','#1a1a1a','#2d2d2d','#404040','#595959','#737373','#8c8c8c','#a6a6a6','#4a3728','#6b4f37','#8b6914','#a0522d','#2f4f2f','#556b2f','#8b0000','#b22222','#1a1a3e','#2e2e5e','#ffd700','#c0c0c0'] },
    dnd_nature: { name: 'Nature Realm', colors: ['#1b4332','#2d6a4f','#40916c','#52b788','#74c69d','#95d5b2','#b7e4c7','#d8f3dc','#5c4033','#795548','#a1887f','#bcaaa4','#4682b4','#87ceeb','#e0e0e0','#ffffff'] },
    dnd_fire: { name: 'Fire & Brimstone', colors: ['#0d0000','#1a0000','#330000','#4d0000','#800000','#b30000','#cc0000','#ff0000','#ff3300','#ff6600','#ff9900','#ffcc00','#ffff00','#ffff99','#ffffff','#ffd700'] },
    dnd_ice: { name: 'Frost & Ice', colors: ['#001a33','#002b4d','#003d66','#004d80','#006699','#0080b3','#0099cc','#00b3e6','#33ccff','#66d9ff','#99e6ff','#ccf2ff','#e6f9ff','#f0f8ff','#ffffff','#c0c0c0'] },
    dnd_undead: { name: 'Undead/Necro', colors: ['#0a0a0a','#1a0a1a','#2d0a2d','#3d1a3d','#4d2d4d','#663366','#804d80','#996699','#b380b3','#cc99cc','#1a3300','#336600','#669900','#88aa00','#ccffcc','#f0fff0'] },
    grayscale: { name: 'Grayscale', colors: ['#000000','#111111','#222222','#333333','#444444','#555555','#666666','#777777','#888888','#999999','#aaaaaa','#bbbbbb','#cccccc','#dddddd','#eeeeee','#ffffff'] }
  };

  var CANVAS_SIZES = {
    '8x8': { w: 8, h: 8, label: '8x8 (Tile)' },
    '8x16': { w: 8, h: 16, label: '8x16 (GB Sprite)' },
    '16x16': { w: 16, h: 16, label: '16x16 (Standard)' },
    '16x24': { w: 16, h: 24, label: '16x24 (Tall Char)' },
    '16x32': { w: 16, h: 32, label: '16x32 (Large Char)' },
    '24x24': { w: 24, h: 24, label: '24x24 (Medium)' },
    '32x32': { w: 32, h: 32, label: '32x32 (Large)' },
    '32x48': { w: 32, h: 48, label: '32x48 (Portrait)' },
    '48x48': { w: 48, h: 48, label: '48x48 (Boss)' },
    '64x64': { w: 64, h: 64, label: '64x64 (XL)' },
    '128x128': { w: 128, h: 128, label: '128x128 (Tile Sheet)' },
    '160x144': { w: 160, h: 144, label: '160x144 (GB Screen)' },
    '240x160': { w: 240, h: 160, label: '240x160 (GBA Screen)' },
    '256x192': { w: 256, h: 192, label: '256x192 (NDS Screen)' }
  };

  function buildPixelArtEditor() {
    var p = window.PlatformConfig ? window.PlatformConfig.get() : { id: 'gbc', resW: 160, resH: 144, maxColors: 32768, tileSize: 8, bpp: 2 };
    var defaultSize = (p.tileSize === 8 && p.bits <= 8) ? '16x16' : (p.bits >= 32 ? '32x32' : '16x16');
    var cats = Object.keys(SPRITE_LIBRARY);

    var html = '<div class="pixart-editor" id="pixartEditor">';

    html += '<div class="pixart-toolbar" id="pixartToolbar">';
    html += '<div class="pixart-toolbar-group">';
    html += '<button class="pixart-tool active" data-tool="pencil" title="Pencil (P)" onclick="window._pixartSetTool(\'pencil\',this)">&#9998;</button>';
    html += '<button class="pixart-tool" data-tool="eraser" title="Eraser (E)" onclick="window._pixartSetTool(\'eraser\',this)">&#9003;</button>';
    html += '<button class="pixart-tool" data-tool="fill" title="Fill Bucket (G)" onclick="window._pixartSetTool(\'fill\',this)">&#9681;</button>';
    html += '<button class="pixart-tool" data-tool="eyedropper" title="Color Picker (I)" onclick="window._pixartSetTool(\'eyedropper\',this)">&#128065;</button>';
    html += '<button class="pixart-tool" data-tool="line" title="Line (L)" onclick="window._pixartSetTool(\'line\',this)">&#9585;</button>';
    html += '<button class="pixart-tool" data-tool="rect" title="Rectangle (R)" onclick="window._pixartSetTool(\'rect\',this)">&#9634;</button>';
    html += '<button class="pixart-tool" data-tool="circle" title="Circle (C)" onclick="window._pixartSetTool(\'circle\',this)">&#9675;</button>';
    html += '<button class="pixart-tool" data-tool="select" title="Selection (S)" onclick="window._pixartSetTool(\'select\',this)">&#11036;</button>';
    html += '<button class="pixart-tool" data-tool="move" title="Move (M)" onclick="window._pixartSetTool(\'move\',this)">&#10021;</button>';
    html += '</div>';

    html += '<div class="pixart-toolbar-group">';
    html += '<button class="pixart-btn" title="Undo (Ctrl+Z)" onclick="window._pixartUndo()">&#8617;</button>';
    html += '<button class="pixart-btn" title="Redo (Ctrl+Y)" onclick="window._pixartRedo()">&#8618;</button>';
    html += '<span class="pixart-sep">|</span>';
    html += '<button class="pixart-btn" title="Clear Canvas" onclick="window._pixartClear()">&#128465;</button>';
    html += '<button class="pixart-btn" title="Flip Horizontal" onclick="window._pixartFlipH()">&#8596;</button>';
    html += '<button class="pixart-btn" title="Flip Vertical" onclick="window._pixartFlipV()">&#8597;</button>';
    html += '<button class="pixart-btn" title="Rotate 90°" onclick="window._pixartRotate()">&#8635;</button>';
    html += '<button class="pixart-btn" title="Mirror (left to right)" onclick="window._pixartMirror()">&#9783;</button>';
    html += '</div>';

    html += '<div class="pixart-toolbar-group">';
    html += '<label style="color:#aaa;font-size:11px;">Grid:</label>';
    html += '<input type="checkbox" id="pixartGrid" checked onchange="window._pixartToggleGrid(this.checked)">';
    html += '<label style="color:#aaa;font-size:11px;margin-left:8px;">Size:</label>';
    html += '<select id="pixartSizeSelect" onchange="window._pixartResize(this.value)" style="background:#1a1a2e;color:#ccc;border:1px solid #3a3a5c;font-size:11px;padding:2px;">';
    Object.keys(CANVAS_SIZES).forEach(function(k) {
      html += '<option value="' + k + '"' + (k === defaultSize ? ' selected' : '') + '>' + CANVAS_SIZES[k].label + '</option>';
    });
    html += '</select>';
    html += '<label style="color:#aaa;font-size:11px;margin-left:8px;">Zoom:</label>';
    html += '<select id="pixartZoom" onchange="window._pixartSetZoom(+this.value)" style="background:#1a1a2e;color:#ccc;border:1px solid #3a3a5c;font-size:11px;padding:2px;">';
    html += '<option value="4">4x</option><option value="8" selected>8x</option><option value="12">12x</option><option value="16">16x</option><option value="24">24x</option>';
    html += '</select>';
    html += '</div>';

    html += '<div class="pixart-toolbar-group">';
    html += '<button class="pixart-btn" title="Export PNG" onclick="window._pixartExport(\'png\')">&#128190; PNG</button>';
    html += '<button class="pixart-btn" title="Export C Array" onclick="window._pixartExport(\'c\')">&#128196; .C</button>';
    html += '<button class="pixart-btn" title="Export Binary" onclick="window._pixartExport(\'bin\')">&#128190; BIN</button>';
    html += '<button class="pixart-btn" title="Import PNG" onclick="window._pixartImport()">&#128194; Import</button>';
    html += '</div>';
    html += '</div>';

    html += '<div class="pixart-main">';

    html += '<div class="pixart-sidebar-left">';
    html += '<div class="pixart-section-title">D&D 5e Sprite Library</div>';
    html += '<input type="text" id="pixartSearch" placeholder="Search sprites..." oninput="window._pixartFilterLibrary(this.value)" style="width:100%;background:#111;color:#ccc;border:1px solid #3a3a5c;padding:4px 6px;font-size:11px;border-radius:3px;margin-bottom:4px;box-sizing:border-box;">';
    html += '<div class="pixart-library" id="pixartLibrary" style="max-height:420px;overflow-y:auto;">';
    cats.forEach(function(catKey) {
      var cat = SPRITE_LIBRARY[catKey];
      html += '<div class="pixart-lib-cat" data-cat="' + catKey + '">';
      html += '<div class="pixart-lib-cat-hdr" onclick="window._pixartToggleCat(this)">';
      html += '<span class="pixart-lib-arrow">&#9654;</span> ' + cat.category + ' <span style="color:#666;font-size:10px;">(' + cat.items.length + ')</span>';
      html += '</div>';
      html += '<div class="pixart-lib-items" style="display:none;">';
      cat.items.forEach(function(item) {
        html += '<div class="pixart-lib-item" onclick="window._pixartLoadTemplate(\'' + catKey + '\',\'' + item.replace(/'/g, "\\'") + '\')" title="' + item + ' (' + cat.book + ')">';
        html += '<canvas class="pixart-lib-thumb" width="16" height="16"></canvas>';
        html += '<span>' + item + '</span>';
        html += '</div>';
      });
      html += '</div></div>';
    });
    html += '</div>';

    html += '<div class="pixart-section-title" style="margin-top:8px;">Sprite Name</div>';
    html += '<input type="text" id="pixartSpriteName" value="Untitled" style="width:100%;background:#111;color:#ccc;border:1px solid #3a3a5c;padding:4px 6px;font-size:11px;border-radius:3px;box-sizing:border-box;">';
    html += '<div class="pixart-section-title" style="margin-top:8px;">Category</div>';
    html += '<select id="pixartSpriteCategory" style="width:100%;background:#111;color:#ccc;border:1px solid #3a3a5c;padding:4px;font-size:11px;border-radius:3px;box-sizing:border-box;">';
    cats.forEach(function(k) {
      html += '<option value="' + k + '">' + SPRITE_LIBRARY[k].category + '</option>';
    });
    html += '</select>';

    html += '<div class="pixart-section-title" style="margin-top:8px;">Preview</div>';
    html += '<div style="display:flex;gap:4px;align-items:flex-start;">';
    html += '<canvas id="pixartPreview1x" width="32" height="32" style="border:1px solid #3a3a5c;image-rendering:pixelated;width:32px;height:32px;background:#000;"></canvas>';
    html += '<canvas id="pixartPreview2x" width="32" height="32" style="border:1px solid #3a3a5c;image-rendering:pixelated;width:64px;height:64px;background:#000;"></canvas>';
    html += '</div>';

    html += '</div>';

    html += '<div class="pixart-canvas-wrap">';
    html += '<canvas id="pixartCanvas" width="128" height="128" style="border:1px solid #3a3a5c;image-rendering:pixelated;cursor:crosshair;"></canvas>';
    html += '<div id="pixartCoords" style="color:#666;font-size:10px;text-align:center;margin-top:4px;">0, 0</div>';
    html += '</div>';

    html += '<div class="pixart-sidebar-right">';
    html += '<div class="pixart-section-title">Current Color</div>';
    html += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">';
    html += '<div id="pixartCurrentColor" style="width:32px;height:32px;background:#000;border:2px solid #fff;border-radius:3px;"></div>';
    html += '<input type="color" id="pixartColorInput" value="#000000" onchange="window._pixartSetColor(this.value)" style="width:32px;height:24px;border:none;padding:0;cursor:pointer;">';
    html += '<input type="text" id="pixartHexInput" value="#000000" onchange="window._pixartSetColor(this.value)" style="width:70px;background:#111;color:#ccc;border:1px solid #3a3a5c;padding:3px;font-size:11px;font-family:monospace;border-radius:3px;">';
    html += '</div>';

    html += '<div class="pixart-section-title">Palette</div>';
    html += '<select id="pixartPaletteSelect" onchange="window._pixartLoadPalette(this.value)" style="width:100%;background:#111;color:#ccc;border:1px solid #3a3a5c;padding:3px;font-size:11px;border-radius:3px;margin-bottom:4px;box-sizing:border-box;">';
    Object.keys(DEFAULT_PALETTES).forEach(function(k) {
      var sel = (k === 'dnd_classic') ? ' selected' : '';
      html += '<option value="' + k + '"' + sel + '>' + DEFAULT_PALETTES[k].name + '</option>';
    });
    html += '</select>';
    html += '<div id="pixartPalette" class="pixart-palette"></div>';

    html += '<div class="pixart-section-title" style="margin-top:8px;">Custom Colors</div>';
    html += '<div id="pixartCustomPalette" class="pixart-palette">';
    for (var ci = 0; ci < 16; ci++) {
      html += '<div class="pixart-palette-cell" style="background:transparent;border:1px dashed #444;" onclick="window._pixartAddCustomColor(this,' + ci + ')"></div>';
    }
    html += '</div>';

    html += '<div class="pixart-section-title" style="margin-top:8px;">Brush Size</div>';
    html += '<input type="range" id="pixartBrushSize" min="1" max="8" value="1" oninput="window._pixartBrushSize=+this.value;document.getElementById(\'pixartBrushLabel\').textContent=this.value+\'px\'" style="width:100%;">';
    html += '<span id="pixartBrushLabel" style="color:#888;font-size:11px;">1px</span>';

    html += '<div class="pixart-section-title" style="margin-top:8px;">Layers</div>';
    html += '<div id="pixartLayers" style="font-size:11px;">';
    html += '<div class="pixart-layer active" onclick="window._pixartSelectLayer(0)">';
    html += '<span>&#128065;</span> Layer 1 (Main)';
    html += '</div>';
    html += '</div>';
    html += '<button class="pixart-btn" style="width:100%;margin-top:4px;font-size:10px;" onclick="window._pixartAddLayer()">+ Add Layer</button>';

    html += '<div class="pixart-section-title" style="margin-top:8px;">Animation</div>';
    html += '<div style="display:flex;gap:4px;margin-bottom:4px;">';
    html += '<button class="pixart-btn" style="font-size:10px;" onclick="window._pixartAddFrame()">+ Frame</button>';
    html += '<button class="pixart-btn" style="font-size:10px;" onclick="window._pixartPlayAnim()">&#9654; Play</button>';
    html += '<button class="pixart-btn" style="font-size:10px;" onclick="window._pixartStopAnim()">&#9632; Stop</button>';
    html += '</div>';
    html += '<div id="pixartFrames" class="pixart-frames">';
    html += '<div class="pixart-frame active" onclick="window._pixartSelectFrame(0)">';
    html += '<canvas width="16" height="16" style="image-rendering:pixelated;"></canvas>';
    html += '<span>F1</span></div>';
    html += '</div>';

    html += '</div>';

    html += '</div>';
    html += '</div>';

    return html;
  }

  function initPixelArtEditor() {
    var state = {
      tool: 'pencil',
      color: '#000000',
      brushSize: 1,
      gridOn: true,
      zoom: 8,
      spriteW: 16,
      spriteH: 16,
      layers: [null],
      currentLayer: 0,
      frames: [null],
      currentFrame: 0,
      undoStack: [],
      redoStack: [],
      isDrawing: false,
      lastX: -1,
      lastY: -1,
      startX: -1,
      startY: -1,
      selection: null,
      selData: null,
      animTimer: null,
      customPalette: new Array(16).fill(null)
    };

    window._pixartBrushSize = 1;

    var canvas = document.getElementById('pixartCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    function initLayers() {
      state.layers = [];
      var imgData = ctx.createImageData(state.spriteW, state.spriteH);
      state.layers.push(imgData);
      state.frames = [cloneImageData(imgData)];
    }

    function cloneImageData(src) {
      var dst = ctx.createImageData(src.width, src.height);
      dst.data.set(src.data);
      return dst;
    }

    function pushUndo() {
      state.undoStack.push(state.layers.map(function(l) { return cloneImageData(l); }));
      if (state.undoStack.length > 50) state.undoStack.shift();
      state.redoStack = [];
    }

    function render() {
      var w = state.spriteW;
      var h = state.spriteH;
      var z = state.zoom;
      canvas.width = w * z;
      canvas.height = h * z;
      canvas.style.width = (w * z) + 'px';
      canvas.style.height = (h * z) + 'px';

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < 2; i++) {
        ctx.fillStyle = (i === 0) ? '#1a1a2e' : '#222244';
        for (var cy = 0; cy < h; cy++) {
          for (var cx = 0; cx < w; cx++) {
            if ((cx + cy) % 2 === i) {
              ctx.fillRect(cx * z, cy * z, z, z);
            }
          }
        }
      }

      state.layers.forEach(function(layer) {
        for (var y = 0; y < h; y++) {
          for (var x = 0; x < w; x++) {
            var idx = (y * w + x) * 4;
            var a = layer.data[idx + 3];
            if (a > 0) {
              ctx.fillStyle = 'rgba(' + layer.data[idx] + ',' + layer.data[idx + 1] + ',' + layer.data[idx + 2] + ',' + (a / 255) + ')';
              ctx.fillRect(x * z, y * z, z, z);
            }
          }
        }
      });

      if (state.gridOn && z >= 4) {
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        for (var gx = 0; gx <= w; gx++) {
          ctx.beginPath();
          ctx.moveTo(gx * z + 0.5, 0);
          ctx.lineTo(gx * z + 0.5, h * z);
          ctx.stroke();
        }
        for (var gy = 0; gy <= h; gy++) {
          ctx.beginPath();
          ctx.moveTo(0, gy * z + 0.5);
          ctx.lineTo(w * z, gy * z + 0.5);
          ctx.stroke();
        }
      }

      if (state.selection) {
        ctx.strokeStyle = '#0af';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(state.selection.x * z, state.selection.y * z, state.selection.w * z, state.selection.h * z);
        ctx.setLineDash([]);
      }

      updatePreviews();
    }

    function updatePreviews() {
      var pre1 = document.getElementById('pixartPreview1x');
      var pre2 = document.getElementById('pixartPreview2x');
      if (!pre1 || !pre2) return;
      pre1.width = state.spriteW;
      pre1.height = state.spriteH;
      pre2.width = state.spriteW;
      pre2.height = state.spriteH;
      var c1 = pre1.getContext('2d');
      var c2 = pre2.getContext('2d');
      c1.clearRect(0, 0, state.spriteW, state.spriteH);
      c2.clearRect(0, 0, state.spriteW, state.spriteH);
      state.layers.forEach(function(layer) {
        c1.putImageData(layer, 0, 0);
        c2.putImageData(layer, 0, 0);
      });
    }

    function setPixel(x, y, r, g, b, a) {
      if (x < 0 || x >= state.spriteW || y < 0 || y >= state.spriteH) return;
      var layer = state.layers[state.currentLayer];
      var idx = (y * state.spriteW + x) * 4;
      layer.data[idx] = r;
      layer.data[idx + 1] = g;
      layer.data[idx + 2] = b;
      layer.data[idx + 3] = a;
    }

    function getPixel(x, y) {
      if (x < 0 || x >= state.spriteW || y < 0 || y >= state.spriteH) return [0, 0, 0, 0];
      var layer = state.layers[state.currentLayer];
      var idx = (y * state.spriteW + x) * 4;
      return [layer.data[idx], layer.data[idx + 1], layer.data[idx + 2], layer.data[idx + 3]];
    }

    function hexToRgb(hex) {
      hex = hex.replace('#', '');
      if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
      return [parseInt(hex.substr(0, 2), 16), parseInt(hex.substr(2, 2), 16), parseInt(hex.substr(4, 2), 16)];
    }

    function rgbToHex(r, g, b) {
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function drawBrush(px, py) {
      var rgb = hexToRgb(state.color);
      var bs = window._pixartBrushSize || 1;
      var half = Math.floor(bs / 2);
      for (var by = 0; by < bs; by++) {
        for (var bx = 0; bx < bs; bx++) {
          if (state.tool === 'eraser') {
            setPixel(px - half + bx, py - half + by, 0, 0, 0, 0);
          } else {
            setPixel(px - half + bx, py - half + by, rgb[0], rgb[1], rgb[2], 255);
          }
        }
      }
    }

    function floodFill(sx, sy, tr, tg, tb, ta) {
      var rgb = hexToRgb(state.color);
      if (tr === rgb[0] && tg === rgb[1] && tb === rgb[2] && ta === 255) return;
      var stack = [[sx, sy]];
      var visited = {};
      while (stack.length > 0) {
        var pt = stack.pop();
        var x = pt[0], y = pt[1];
        if (x < 0 || x >= state.spriteW || y < 0 || y >= state.spriteH) continue;
        var key = x + ',' + y;
        if (visited[key]) continue;
        visited[key] = true;
        var px = getPixel(x, y);
        if (px[0] !== tr || px[1] !== tg || px[2] !== tb || px[3] !== ta) continue;
        setPixel(x, y, rgb[0], rgb[1], rgb[2], 255);
        stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
      }
    }

    function bresenhamLine(x0, y0, x1, y1, callback) {
      var dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
      var sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
      var err = dx - dy;
      while (true) {
        callback(x0, y0);
        if (x0 === x1 && y0 === y1) break;
        var e2 = err * 2;
        if (e2 > -dy) { err -= dy; x0 += sx; }
        if (e2 < dx) { err += dx; y0 += sy; }
      }
    }

    function getCanvasPos(e) {
      var rect = canvas.getBoundingClientRect();
      var x = Math.floor((e.clientX - rect.left) / state.zoom);
      var y = Math.floor((e.clientY - rect.top) / state.zoom);
      return { x: Math.max(0, Math.min(x, state.spriteW - 1)), y: Math.max(0, Math.min(y, state.spriteH - 1)) };
    }

    canvas.addEventListener('mousedown', function(e) {
      e.preventDefault();
      var pos = getCanvasPos(e);
      state.isDrawing = true;
      state.startX = pos.x;
      state.startY = pos.y;

      if (state.tool === 'pencil' || state.tool === 'eraser') {
        pushUndo();
        drawBrush(pos.x, pos.y);
        render();
      } else if (state.tool === 'fill') {
        pushUndo();
        var tp = getPixel(pos.x, pos.y);
        floodFill(pos.x, pos.y, tp[0], tp[1], tp[2], tp[3]);
        render();
      } else if (state.tool === 'eyedropper') {
        var px = getPixel(pos.x, pos.y);
        if (px[3] > 0) {
          state.color = rgbToHex(px[0], px[1], px[2]);
          updateColorUI();
        }
      } else if (state.tool === 'line' || state.tool === 'rect' || state.tool === 'circle') {
        pushUndo();
      } else if (state.tool === 'select') {
        state.selection = { x: pos.x, y: pos.y, w: 1, h: 1 };
        render();
      } else if (state.tool === 'move') {
        pushUndo();
        if (state.selection) {
          var sel = state.selection;
          state.selData = [];
          var layer = state.layers[state.currentLayer];
          for (var sy = sel.y; sy < sel.y + sel.h; sy++) {
            for (var sx = sel.x; sx < sel.x + sel.w; sx++) {
              var idx = (sy * state.spriteW + sx) * 4;
              state.selData.push(layer.data[idx], layer.data[idx+1], layer.data[idx+2], layer.data[idx+3]);
              layer.data[idx] = 0; layer.data[idx+1] = 0; layer.data[idx+2] = 0; layer.data[idx+3] = 0;
            }
          }
        }
      }
      state.lastX = pos.x;
      state.lastY = pos.y;
    });

    canvas.addEventListener('mousemove', function(e) {
      var pos = getCanvasPos(e);
      var coordEl = document.getElementById('pixartCoords');
      if (coordEl) coordEl.textContent = pos.x + ', ' + pos.y;

      if (!state.isDrawing) return;

      if (state.tool === 'pencil' || state.tool === 'eraser') {
        bresenhamLine(state.lastX, state.lastY, pos.x, pos.y, function(lx, ly) {
          drawBrush(lx, ly);
        });
        render();
      } else if (state.tool === 'move' && state.selection && state.selData) {
        var dx = pos.x - state.startX;
        var dy = pos.y - state.startY;
        state.layers[state.currentLayer] = cloneImageData(state.undoStack[state.undoStack.length - 1][state.currentLayer]);
        var sel = state.selection;
        var layer = state.layers[state.currentLayer];
        for (var sy = sel.y; sy < sel.y + sel.h; sy++) {
          for (var sx = sel.x; sx < sel.x + sel.w; sx++) {
            var srcIdx = ((sy - sel.y) * sel.w + (sx - sel.x)) * 4;
            var nx = sx + dx, ny = sy + dy;
            if (nx >= 0 && nx < state.spriteW && ny >= 0 && ny < state.spriteH) {
              var dstIdx = (ny * state.spriteW + nx) * 4;
              layer.data[dstIdx] = state.selData[srcIdx];
              layer.data[dstIdx+1] = state.selData[srcIdx+1];
              layer.data[dstIdx+2] = state.selData[srcIdx+2];
              layer.data[dstIdx+3] = state.selData[srcIdx+3];
            }
          }
        }
        render();
      } else if (state.tool === 'select') {
        state.selection = {
          x: Math.min(state.startX, pos.x),
          y: Math.min(state.startY, pos.y),
          w: Math.abs(pos.x - state.startX) + 1,
          h: Math.abs(pos.y - state.startY) + 1
        };
        render();
      } else if (state.tool === 'line' || state.tool === 'rect' || state.tool === 'circle') {
        state.layers[state.currentLayer] = cloneImageData(state.undoStack[state.undoStack.length - 1][state.currentLayer]);
        var rgb = hexToRgb(state.color);
        if (state.tool === 'line') {
          bresenhamLine(state.startX, state.startY, pos.x, pos.y, function(lx, ly) {
            setPixel(lx, ly, rgb[0], rgb[1], rgb[2], 255);
          });
        } else if (state.tool === 'rect') {
          var rx = Math.min(state.startX, pos.x), ry = Math.min(state.startY, pos.y);
          var rw = Math.abs(pos.x - state.startX), rh = Math.abs(pos.y - state.startY);
          for (var ri = rx; ri <= rx + rw; ri++) {
            setPixel(ri, ry, rgb[0], rgb[1], rgb[2], 255);
            setPixel(ri, ry + rh, rgb[0], rgb[1], rgb[2], 255);
          }
          for (var rj = ry; rj <= ry + rh; rj++) {
            setPixel(rx, rj, rgb[0], rgb[1], rgb[2], 255);
            setPixel(rx + rw, rj, rgb[0], rgb[1], rgb[2], 255);
          }
        } else if (state.tool === 'circle') {
          var ccx = Math.round((state.startX + pos.x) / 2);
          var ccy = Math.round((state.startY + pos.y) / 2);
          var crx = Math.round(Math.abs(pos.x - state.startX) / 2);
          var cry = Math.round(Math.abs(pos.y - state.startY) / 2);
          var cr = Math.max(crx, cry);
          for (var angle = 0; angle < 360; angle += 1) {
            var cx2 = Math.round(ccx + cr * Math.cos(angle * Math.PI / 180));
            var cy2 = Math.round(ccy + cr * Math.sin(angle * Math.PI / 180));
            setPixel(cx2, cy2, rgb[0], rgb[1], rgb[2], 255);
          }
        }
        render();
      }

      state.lastX = pos.x;
      state.lastY = pos.y;
    });

    canvas.addEventListener('mouseup', function(e) {
      if (state.tool === 'move' && state.selection && state.selData && state.isDrawing) {
        var pos = getCanvasPos(e);
        var dx = pos.x - state.startX;
        var dy = pos.y - state.startY;
        state.selection = {
          x: state.selection.x + dx,
          y: state.selection.y + dy,
          w: state.selection.w,
          h: state.selection.h
        };
        state.selData = null;
        render();
      }
      state.isDrawing = false;
    });

    canvas.addEventListener('mouseleave', function() {
      state.isDrawing = false;
    });

    function updateColorUI() {
      var el = document.getElementById('pixartCurrentColor');
      var inp = document.getElementById('pixartColorInput');
      var hex = document.getElementById('pixartHexInput');
      if (el) el.style.background = state.color;
      if (inp) inp.value = state.color;
      if (hex) hex.value = state.color;
    }

    window._pixartSetTool = function(tool, btn) {
      state.tool = tool;
      var btns = document.querySelectorAll('.pixart-tool');
      btns.forEach(function(b) { b.classList.remove('active'); });
      if (btn) btn.classList.add('active');
    };

    window._pixartSetColor = function(hex) {
      if (hex && hex[0] !== '#') hex = '#' + hex;
      state.color = hex;
      updateColorUI();
    };

    window._pixartUndo = function() {
      if (state.undoStack.length === 0) return;
      state.redoStack.push(state.layers.map(function(l) { return cloneImageData(l); }));
      var prev = state.undoStack.pop();
      state.layers = prev;
      render();
    };

    window._pixartRedo = function() {
      if (state.redoStack.length === 0) return;
      state.undoStack.push(state.layers.map(function(l) { return cloneImageData(l); }));
      state.layers = state.redoStack.pop();
      render();
    };

    window._pixartClear = function() {
      pushUndo();
      state.layers.forEach(function(layer) {
        for (var i = 0; i < layer.data.length; i++) layer.data[i] = 0;
      });
      render();
    };

    window._pixartFlipH = function() {
      pushUndo();
      var layer = state.layers[state.currentLayer];
      var tmp = cloneImageData(layer);
      for (var y = 0; y < state.spriteH; y++) {
        for (var x = 0; x < state.spriteW; x++) {
          var si = (y * state.spriteW + (state.spriteW - 1 - x)) * 4;
          var di = (y * state.spriteW + x) * 4;
          layer.data[di] = tmp.data[si];
          layer.data[di + 1] = tmp.data[si + 1];
          layer.data[di + 2] = tmp.data[si + 2];
          layer.data[di + 3] = tmp.data[si + 3];
        }
      }
      render();
    };

    window._pixartFlipV = function() {
      pushUndo();
      var layer = state.layers[state.currentLayer];
      var tmp = cloneImageData(layer);
      for (var y = 0; y < state.spriteH; y++) {
        for (var x = 0; x < state.spriteW; x++) {
          var si = ((state.spriteH - 1 - y) * state.spriteW + x) * 4;
          var di = (y * state.spriteW + x) * 4;
          layer.data[di] = tmp.data[si];
          layer.data[di + 1] = tmp.data[si + 1];
          layer.data[di + 2] = tmp.data[si + 2];
          layer.data[di + 3] = tmp.data[si + 3];
        }
      }
      render();
    };

    window._pixartRotate = function() {
      pushUndo();
      var layer = state.layers[state.currentLayer];
      var tmp = cloneImageData(layer);
      var ow = state.spriteW, oh = state.spriteH;
      if (ow !== oh) return;
      for (var y = 0; y < oh; y++) {
        for (var x = 0; x < ow; x++) {
          var si = (y * ow + x) * 4;
          var nx = oh - 1 - y;
          var ny = x;
          var di = (ny * ow + nx) * 4;
          layer.data[di] = tmp.data[si];
          layer.data[di + 1] = tmp.data[si + 1];
          layer.data[di + 2] = tmp.data[si + 2];
          layer.data[di + 3] = tmp.data[si + 3];
        }
      }
      render();
    };

    window._pixartMirror = function() {
      pushUndo();
      var layer = state.layers[state.currentLayer];
      var half = Math.floor(state.spriteW / 2);
      for (var y = 0; y < state.spriteH; y++) {
        for (var x = 0; x < half; x++) {
          var si = (y * state.spriteW + x) * 4;
          var di = (y * state.spriteW + (state.spriteW - 1 - x)) * 4;
          layer.data[di] = layer.data[si];
          layer.data[di + 1] = layer.data[si + 1];
          layer.data[di + 2] = layer.data[si + 2];
          layer.data[di + 3] = layer.data[si + 3];
        }
      }
      render();
    };

    window._pixartToggleGrid = function(on) {
      state.gridOn = on;
      render();
    };

    window._pixartSetZoom = function(z) {
      state.zoom = z;
      render();
    };

    window._pixartResize = function(sizeKey) {
      var size = CANVAS_SIZES[sizeKey];
      if (!size) return;
      pushUndo();
      state.spriteW = size.w;
      state.spriteH = size.h;
      state.layers = [ctx.createImageData(size.w, size.h)];
      state.currentLayer = 0;
      state.selection = null;
      render();
    };

    window._pixartLoadPalette = function(palKey) {
      var pal = DEFAULT_PALETTES[palKey];
      if (!pal) return;
      var container = document.getElementById('pixartPalette');
      if (!container) return;
      var html = '';
      pal.colors.forEach(function(c) {
        html += '<div class="pixart-palette-cell" style="background:' + c + ';" onclick="window._pixartSetColor(\'' + c + '\')" title="' + c + '"></div>';
      });
      container.innerHTML = html;
    };

    window._pixartAddCustomColor = function(el, idx) {
      state.customPalette[idx] = state.color;
      el.style.background = state.color;
      el.style.border = '1px solid #555';
      el.setAttribute('onclick', "window._pixartSetColor('" + state.color + "')");
    };

    window._pixartToggleCat = function(headerEl) {
      var items = headerEl.nextElementSibling;
      var arrow = headerEl.querySelector('.pixart-lib-arrow');
      if (items.style.display === 'none') {
        items.style.display = 'block';
        arrow.innerHTML = '&#9660;';
      } else {
        items.style.display = 'none';
        arrow.innerHTML = '&#9654;';
      }
    };

    window._pixartFilterLibrary = function(query) {
      query = query.toLowerCase();
      var lib = document.getElementById('pixartLibrary');
      if (!lib) return;
      var cats = lib.querySelectorAll('.pixart-lib-cat');
      cats.forEach(function(cat) {
        var items = cat.querySelectorAll('.pixart-lib-item');
        var anyVisible = false;
        items.forEach(function(item) {
          var name = item.querySelector('span').textContent.toLowerCase();
          if (!query || name.indexOf(query) >= 0) {
            item.style.display = 'flex';
            anyVisible = true;
          } else {
            item.style.display = 'none';
          }
        });
        cat.style.display = anyVisible ? 'block' : 'none';
        if (query && anyVisible) {
          cat.querySelector('.pixart-lib-items').style.display = 'block';
          cat.querySelector('.pixart-lib-arrow').innerHTML = '&#9660;';
        }
      });
    };

    window._pixartLoadTemplate = function(catKey, itemName) {
      pushUndo();
      var nameEl = document.getElementById('pixartSpriteName');
      if (nameEl) nameEl.value = itemName;
      var catEl = document.getElementById('pixartSpriteCategory');
      if (catEl) catEl.value = catKey;

      var layer = state.layers[state.currentLayer];
      for (var i = 0; i < layer.data.length; i++) layer.data[i] = 0;

      var seed = 0;
      for (var si = 0; si < itemName.length; si++) seed = ((seed << 5) - seed + itemName.charCodeAt(si)) | 0;
      function rng() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }

      var palKey = 'dnd_classic';
      if (catKey.indexOf('undead') >= 0) palKey = 'dnd_undead';
      else if (catKey.indexOf('dragon') >= 0 || catKey.indexOf('fiend') >= 0) palKey = 'dnd_fire';
      else if (catKey.indexOf('fey') >= 0 || catKey.indexOf('celestial') >= 0 || catKey.indexOf('plant') >= 0) palKey = 'dnd_nature';
      else if (catKey.indexOf('elemental') >= 0 && itemName.toLowerCase().indexOf('ice') >= 0) palKey = 'dnd_ice';
      else if (catKey.indexOf('elemental') >= 0 && itemName.toLowerCase().indexOf('fire') >= 0) palKey = 'dnd_fire';
      else if (catKey === 'zones_wilderness') palKey = 'dnd_nature';
      else if (catKey === 'zones_dungeons') palKey = 'dnd_dungeon';

      var pal = DEFAULT_PALETTES[palKey].colors;
      var w = state.spriteW, h = state.spriteH;
      var isCreature = catKey.indexOf('monster') >= 0 || catKey === 'character_classes' || catKey === 'character_races' || catKey === 'npcs';
      var isItem = catKey === 'weapons' || catKey === 'armor' || catKey === 'items_equipment' || catKey === 'items_magic' || catKey === 'items_potions' || catKey === 'effects_ui';
      var isTerrain = catKey.indexOf('zones') >= 0 || catKey === 'tiles_terrain';

      if (isCreature) {
        var bodyColor = pal[Math.floor(rng() * pal.length)];
        var outlineColor = pal[Math.min(Math.floor(rng() * 3), pal.length - 1)];
        var eyeColor = '#ffffff';
        var rgb1 = hexToRgb(bodyColor);
        var rgb2 = hexToRgb(outlineColor);
        var rgb3 = hexToRgb(eyeColor);

        var cx = Math.floor(w / 2);
        var headTop = Math.floor(h * 0.15);
        var headBot = Math.floor(h * 0.35);
        var bodyBot = Math.floor(h * 0.75);
        var feetBot = Math.floor(h * 0.9);

        for (var y = headTop; y < headBot; y++) {
          var headW = Math.floor(w * 0.3 * (1 - Math.abs(y - (headTop + headBot) / 2) / ((headBot - headTop) / 2)));
          for (var x = cx - headW; x <= cx + headW; x++) {
            if (x >= 0 && x < w) {
              if (x === cx - headW || x === cx + headW || y === headTop || y === headBot - 1) {
                setPixel(x, y, rgb2[0], rgb2[1], rgb2[2], 255);
              } else {
                setPixel(x, y, rgb1[0], rgb1[1], rgb1[2], 255);
              }
            }
          }
        }

        var eyeY = Math.floor(headTop + (headBot - headTop) * 0.4);
        setPixel(cx - 2, eyeY, rgb3[0], rgb3[1], rgb3[2], 255);
        setPixel(cx + 1, eyeY, rgb3[0], rgb3[1], rgb3[2], 255);

        for (var y = headBot; y < bodyBot; y++) {
          var bw = Math.floor(w * 0.25 + w * 0.1 * Math.sin((y - headBot) / (bodyBot - headBot) * Math.PI));
          for (var x = cx - bw; x <= cx + bw; x++) {
            if (x >= 0 && x < w) {
              if (x === cx - bw || x === cx + bw || y === bodyBot - 1) {
                setPixel(x, y, rgb2[0], rgb2[1], rgb2[2], 255);
              } else {
                setPixel(x, y, rgb1[0], rgb1[1], rgb1[2], 255);
              }
            }
          }
        }

        var legW = Math.floor(w * 0.1);
        for (var y = bodyBot; y < feetBot; y++) {
          for (var lx = cx - legW * 2 - 1; lx <= cx - legW; lx++) {
            if (lx >= 0 && lx < w) setPixel(lx, y, rgb2[0], rgb2[1], rgb2[2], 255);
          }
          for (var lx = cx + legW; lx <= cx + legW * 2 + 1; lx++) {
            if (lx >= 0 && lx < w) setPixel(lx, y, rgb2[0], rgb2[1], rgb2[2], 255);
          }
        }
      } else if (isItem) {
        var itemColor = pal[Math.floor(rng() * pal.length)];
        var handleColor = pal[Math.min(Math.floor(rng() * 4) + 2, pal.length - 1)];
        var rgbi = hexToRgb(itemColor);
        var rgbh = hexToRgb(handleColor);

        if (catKey === 'weapons') {
          for (var y = 2; y < h - 2; y++) {
            var bw = (y < h / 2) ? Math.max(1, Math.floor(w * 0.08)) : Math.max(1, Math.floor(w * 0.05));
            for (var x = cx - bw; x <= cx + bw; x++) {
              if (x >= 0 && x < w) {
                var rgb = (y > h * 0.6) ? rgbh : rgbi;
                setPixel(x, y, rgb[0], rgb[1], rgb[2], 255);
              }
            }
          }
          var guardY = Math.floor(h * 0.6);
          for (var x = cx - 3; x <= cx + 3; x++) {
            if (x >= 0 && x < w) setPixel(x, guardY, rgbi[0], rgbi[1], rgbi[2], 255);
          }
        } else {
          var ir = Math.floor(Math.min(w, h) * 0.3);
          var ccy = Math.floor(h / 2);
          for (var y = ccy - ir; y <= ccy + ir; y++) {
            for (var x = cx - ir; x <= cx + ir; x++) {
              if (x >= 0 && x < w && y >= 0 && y < h) {
                var dist = Math.sqrt((x - cx) * (x - cx) + (y - ccy) * (y - ccy));
                if (dist <= ir) {
                  if (dist >= ir - 1) {
                    setPixel(x, y, rgbh[0], rgbh[1], rgbh[2], 255);
                  } else {
                    setPixel(x, y, rgbi[0], rgbi[1], rgbi[2], 255);
                  }
                }
              }
            }
          }
        }
      } else if (isTerrain) {
        for (var y = 0; y < h; y++) {
          for (var x = 0; x < w; x++) {
            var ci = Math.floor(rng() * pal.length);
            var noise = rng();
            if (noise > 0.3) {
              ci = Math.floor(pal.length * (y / h) * 0.8);
              ci = Math.min(ci, pal.length - 1);
            }
            var rgb = hexToRgb(pal[ci]);
            setPixel(x, y, rgb[0], rgb[1], rgb[2], 255);
          }
        }
      }

      render();

      var palSel = document.getElementById('pixartPaletteSelect');
      if (palSel) {
        palSel.value = palKey;
        window._pixartLoadPalette(palKey);
      }
    };

    window._pixartAddLayer = function() {
      var newLayer = ctx.createImageData(state.spriteW, state.spriteH);
      state.layers.push(newLayer);
      var layerDiv = document.getElementById('pixartLayers');
      if (layerDiv) {
        var idx = state.layers.length - 1;
        layerDiv.innerHTML += '<div class="pixart-layer" onclick="window._pixartSelectLayer(' + idx + ')"><span>&#128065;</span> Layer ' + (idx + 1) + '</div>';
      }
    };

    window._pixartSelectLayer = function(idx) {
      state.currentLayer = idx;
      var layers = document.querySelectorAll('.pixart-layer');
      layers.forEach(function(l, i) { l.classList.toggle('active', i === idx); });
    };

    window._pixartAddFrame = function() {
      state.frames.push(state.layers.map(function(l) { return cloneImageData(l); }));
      var framesDiv = document.getElementById('pixartFrames');
      if (framesDiv) {
        var idx = state.frames.length - 1;
        framesDiv.innerHTML += '<div class="pixart-frame" onclick="window._pixartSelectFrame(' + idx + ')"><canvas width="16" height="16" style="image-rendering:pixelated;"></canvas><span>F' + (idx + 1) + '</span></div>';
      }
    };

    window._pixartSelectFrame = function(idx) {
      if (idx >= state.frames.length) return;
      state.frames[state.currentFrame] = state.layers.map(function(l) { return cloneImageData(l); });
      state.currentFrame = idx;
      state.layers = state.frames[idx].map(function(l) { return cloneImageData(l); });
      var frames = document.querySelectorAll('.pixart-frame');
      frames.forEach(function(f, i) { f.classList.toggle('active', i === idx); });
      render();
    };

    window._pixartPlayAnim = function() {
      if (state.animTimer) return;
      var frameIdx = 0;
      state.animTimer = setInterval(function() {
        window._pixartSelectFrame(frameIdx);
        frameIdx = (frameIdx + 1) % state.frames.length;
      }, 200);
    };

    window._pixartStopAnim = function() {
      if (state.animTimer) { clearInterval(state.animTimer); state.animTimer = null; }
    };

    window._pixartExport = function(format) {
      var tempCanvas = document.createElement('canvas');
      tempCanvas.width = state.spriteW;
      tempCanvas.height = state.spriteH;
      var tCtx = tempCanvas.getContext('2d');
      state.layers.forEach(function(layer) { tCtx.putImageData(layer, 0, 0); });

      if (format === 'png') {
        var link = document.createElement('a');
        var name = (document.getElementById('pixartSpriteName') || {}).value || 'sprite';
        link.download = name.replace(/\s+/g, '_').toLowerCase() + '.png';
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
      } else if (format === 'c') {
        var name = ((document.getElementById('pixartSpriteName') || {}).value || 'sprite').replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
        var data = tCtx.getImageData(0, 0, state.spriteW, state.spriteH);
        var output = '/* ' + name + ' - ' + state.spriteW + 'x' + state.spriteH + ' sprite */\n';
        output += 'const unsigned char ' + name + '_data[] = {\n  ';
        var bytes = [];
        for (var ty = 0; ty < state.spriteH; ty += 8) {
          for (var tx = 0; tx < state.spriteW; tx += 8) {
            for (var row = 0; row < 8 && (ty + row) < state.spriteH; row++) {
              var lo = 0, hi = 0;
              for (var bit = 0; bit < 8 && (tx + bit) < state.spriteW; bit++) {
                var idx = ((ty + row) * state.spriteW + (tx + bit)) * 4;
                var lum = data.data[idx] * 0.299 + data.data[idx + 1] * 0.587 + data.data[idx + 2] * 0.114;
                var alpha = data.data[idx + 3];
                var val = 0;
                if (alpha > 0) {
                  if (lum < 64) val = 3;
                  else if (lum < 128) val = 2;
                  else if (lum < 192) val = 1;
                  else val = 0;
                }
                lo |= ((val & 1) << (7 - bit));
                hi |= (((val >> 1) & 1) << (7 - bit));
              }
              bytes.push('0x' + lo.toString(16).padStart(2, '0'));
              bytes.push('0x' + hi.toString(16).padStart(2, '0'));
            }
          }
        }
        for (var bi = 0; bi < bytes.length; bi++) {
          output += bytes[bi];
          if (bi < bytes.length - 1) output += ', ';
          if ((bi + 1) % 16 === 0) output += '\n  ';
        }
        output += '\n};\n';
        output += '#define ' + name.toUpperCase() + '_WIDTH ' + state.spriteW + '\n';
        output += '#define ' + name.toUpperCase() + '_HEIGHT ' + state.spriteH + '\n';

        var blob = new Blob([output], { type: 'text/plain' });
        var link = document.createElement('a');
        link.download = name + '.c';
        link.href = URL.createObjectURL(blob);
        link.click();
      } else if (format === 'bin') {
        var data = tCtx.getImageData(0, 0, state.spriteW, state.spriteH);
        var binBytes = [];
        for (var ty = 0; ty < state.spriteH; ty += 8) {
          for (var tx = 0; tx < state.spriteW; tx += 8) {
            for (var row = 0; row < 8 && (ty + row) < state.spriteH; row++) {
              var lo = 0, hi = 0;
              for (var bit = 0; bit < 8 && (tx + bit) < state.spriteW; bit++) {
                var idx = ((ty + row) * state.spriteW + (tx + bit)) * 4;
                var lum = data.data[idx] * 0.299 + data.data[idx + 1] * 0.587 + data.data[idx + 2] * 0.114;
                var alpha = data.data[idx + 3];
                var val = 0;
                if (alpha > 0) {
                  if (lum < 64) val = 3;
                  else if (lum < 128) val = 2;
                  else if (lum < 192) val = 1;
                }
                lo |= ((val & 1) << (7 - bit));
                hi |= (((val >> 1) & 1) << (7 - bit));
              }
              binBytes.push(lo);
              binBytes.push(hi);
            }
          }
        }
        var blob = new Blob([new Uint8Array(binBytes)], { type: 'application/octet-stream' });
        var link = document.createElement('a');
        var name = ((document.getElementById('pixartSpriteName') || {}).value || 'sprite').replace(/\s+/g, '_').toLowerCase();
        link.download = name + '.bin';
        link.href = URL.createObjectURL(blob);
        link.click();
      }
    };

    window._pixartImport = function() {
      var input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/png,image/gif,image/bmp';
      input.onchange = function(e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(ev) {
          var img = new Image();
          img.onload = function() {
            pushUndo();
            state.spriteW = img.width;
            state.spriteH = img.height;
            var sizeKey = img.width + 'x' + img.height;
            var sel = document.getElementById('pixartSizeSelect');
            if (sel && CANVAS_SIZES[sizeKey]) sel.value = sizeKey;

            var tempCanvas = document.createElement('canvas');
            tempCanvas.width = img.width;
            tempCanvas.height = img.height;
            var tCtx = tempCanvas.getContext('2d');
            tCtx.drawImage(img, 0, 0);
            state.layers = [tCtx.getImageData(0, 0, img.width, img.height)];
            state.currentLayer = 0;
            render();

            var nameEl = document.getElementById('pixartSpriteName');
            if (nameEl) nameEl.value = file.name.replace(/\.[^.]+$/, '');
          };
          img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      };
      input.click();
    };

    document.addEventListener('keydown', function(e) {
      var modal = document.getElementById('modalOverlay');
      if (!modal || !modal.classList.contains('active')) return;
      if (!document.getElementById('pixartCanvas')) return;

      if (e.ctrlKey && e.key === 'z') { e.preventDefault(); window._pixartUndo(); }
      else if (e.ctrlKey && e.key === 'y') { e.preventDefault(); window._pixartRedo(); }
      else if (!e.ctrlKey) {
        var target = e.target;
        if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA') return;
        switch (e.key.toLowerCase()) {
          case 'p': window._pixartSetTool('pencil', document.querySelector('[data-tool="pencil"]')); break;
          case 'e': window._pixartSetTool('eraser', document.querySelector('[data-tool="eraser"]')); break;
          case 'g': window._pixartSetTool('fill', document.querySelector('[data-tool="fill"]')); break;
          case 'i': window._pixartSetTool('eyedropper', document.querySelector('[data-tool="eyedropper"]')); break;
          case 'l': window._pixartSetTool('line', document.querySelector('[data-tool="line"]')); break;
          case 'r': window._pixartSetTool('rect', document.querySelector('[data-tool="rect"]')); break;
          case 'c': window._pixartSetTool('circle', document.querySelector('[data-tool="circle"]')); break;
          case 's': window._pixartSetTool('select', document.querySelector('[data-tool="select"]')); break;
          case 'm': window._pixartSetTool('move', document.querySelector('[data-tool="move"]')); break;
        }
      }
    });

    initLayers();
    render();
    updateColorUI();
    window._pixartLoadPalette('dnd_classic');
  }

  window.openDndPixelArt = function() {
    if (typeof window.openModal !== 'function') return;
    window.openModal('D&D 5e Pixel Art Studio', buildPixelArtEditor());
    setTimeout(initPixelArtEditor, 50);
  };

  var origOpenDndTool = window.openDndTool;
  window.openDndTool = function(action) {
    if (action === 'dnd:pixelArt') {
      window.openDndPixelArt();
      return;
    }
    if (origOpenDndTool) origOpenDndTool(action);
  };

})();
