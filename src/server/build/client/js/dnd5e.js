(function() {
  "use strict";

  const DND_CLASSES = {
    barbarian: { name: 'Barbarian', hd: 'd12', primary: 'STR', saves: ['STR','CON'], skills: ['Animal Handling','Athletics','Intimidation','Nature','Perception','Survival'], features: [{lvl:1,name:'Rage',desc:'Bonus damage, resistance to B/P/S'},{lvl:1,name:'Unarmored Defense',desc:'AC = 10 + DEX + CON'},{lvl:2,name:'Reckless Attack',desc:'Advantage on STR attacks, attacks against you have advantage'},{lvl:2,name:'Danger Sense',desc:'Advantage on DEX saves you can see'},{lvl:3,name:'Primal Path',desc:'Path of the Berserker, Totem Warrior, etc.'},{lvl:5,name:'Extra Attack',desc:'Attack twice per Attack action'},{lvl:5,name:'Fast Movement',desc:'+10 ft speed when not in heavy armor'}] },
    bard: { name: 'Bard', hd: 'd8', primary: 'CHA', saves: ['DEX','CHA'], skills: ['Any 3'], features: [{lvl:1,name:'Bardic Inspiration',desc:'d6 bonus die (CHA mod uses)'},{lvl:1,name:'Spellcasting',desc:'CHA-based, ritual casting'},{lvl:2,name:'Jack of All Trades',desc:'Half proficiency to non-proficient checks'},{lvl:2,name:'Song of Rest',desc:'Extra d6 healing during short rest'},{lvl:3,name:'Bard College',desc:'College of Lore, Valor, etc.'},{lvl:5,name:'Bardic Inspiration d8',desc:'Inspiration die increases'},{lvl:5,name:'Font of Inspiration',desc:'Regain uses on short rest'}] },
    cleric: { name: 'Cleric', hd: 'd8', primary: 'WIS', saves: ['WIS','CHA'], skills: ['History','Insight','Medicine','Persuasion','Religion'], features: [{lvl:1,name:'Spellcasting',desc:'WIS-based, ritual casting'},{lvl:1,name:'Divine Domain',desc:'Life, Light, War, Knowledge, etc.'},{lvl:2,name:'Channel Divinity',desc:'Turn Undead + domain feature'},{lvl:5,name:'Destroy Undead',desc:'CR 1/2 or lower undead destroyed'}] },
    druid: { name: 'Druid', hd: 'd8', primary: 'WIS', saves: ['INT','WIS'], skills: ['Arcana','Animal Handling','Insight','Medicine','Nature','Perception','Religion','Survival'], features: [{lvl:1,name:'Druidic',desc:'Secret druid language'},{lvl:1,name:'Spellcasting',desc:'WIS-based, ritual casting'},{lvl:2,name:'Wild Shape',desc:'Transform into beasts'},{lvl:2,name:'Druid Circle',desc:'Circle of the Land, Moon, etc.'}] },
    fighter: { name: 'Fighter', hd: 'd10', primary: 'STR/DEX', saves: ['STR','CON'], skills: ['Acrobatics','Animal Handling','Athletics','History','Insight','Intimidation','Perception','Survival'], features: [{lvl:1,name:'Fighting Style',desc:'Defense, Dueling, Great Weapon, etc.'},{lvl:1,name:'Second Wind',desc:'Heal 1d10+level as bonus action'},{lvl:2,name:'Action Surge',desc:'Extra action on your turn'},{lvl:3,name:'Martial Archetype',desc:'Champion, Battle Master, Eldritch Knight'},{lvl:5,name:'Extra Attack',desc:'Attack twice per Attack action'}] },
    monk: { name: 'Monk', hd: 'd8', primary: 'DEX/WIS', saves: ['STR','DEX'], skills: ['Acrobatics','Athletics','History','Insight','Religion','Stealth'], features: [{lvl:1,name:'Unarmored Defense',desc:'AC = 10 + DEX + WIS'},{lvl:1,name:'Martial Arts',desc:'Unarmed d4, DEX for monk weapons, bonus unarmed'},{lvl:2,name:'Ki',desc:'Ki points = monk level'},{lvl:2,name:'Unarmored Movement',desc:'+10 ft speed'},{lvl:3,name:'Monastic Tradition',desc:'Way of the Open Hand, Shadow, etc.'},{lvl:5,name:'Extra Attack',desc:'Attack twice'},{lvl:5,name:'Stunning Strike',desc:'Spend ki to stun on hit'}] },
    paladin: { name: 'Paladin', hd: 'd10', primary: 'STR/CHA', saves: ['WIS','CHA'], skills: ['Athletics','Insight','Intimidation','Medicine','Persuasion','Religion'], features: [{lvl:1,name:'Divine Sense',desc:'Detect celestial/fiend/undead'},{lvl:1,name:'Lay on Hands',desc:'Heal pool = 5 x paladin level'},{lvl:2,name:'Fighting Style',desc:'Defense, Dueling, Great Weapon, Protection'},{lvl:2,name:'Spellcasting',desc:'CHA-based'},{lvl:2,name:'Divine Smite',desc:'2d8 radiant on hit (spend spell slot)'},{lvl:3,name:'Sacred Oath',desc:'Oath of Devotion, Ancients, Vengeance'},{lvl:5,name:'Extra Attack',desc:'Attack twice'}] },
    ranger: { name: 'Ranger', hd: 'd10', primary: 'DEX/WIS', saves: ['STR','DEX'], skills: ['Animal Handling','Athletics','Insight','Investigation','Nature','Perception','Stealth','Survival'], features: [{lvl:1,name:'Favored Enemy',desc:'Advantage on tracking, knowledge checks'},{lvl:1,name:'Natural Explorer',desc:'Favored terrain benefits'},{lvl:2,name:'Fighting Style',desc:'Archery, Defense, Dueling, TWF'},{lvl:2,name:'Spellcasting',desc:'WIS-based'},{lvl:3,name:'Ranger Archetype',desc:'Hunter, Beast Master, Gloom Stalker'},{lvl:5,name:'Extra Attack',desc:'Attack twice'}] },
    rogue: { name: 'Rogue', hd: 'd8', primary: 'DEX', saves: ['DEX','INT'], skills: ['Acrobatics','Athletics','Deception','Insight','Intimidation','Investigation','Perception','Performance','Persuasion','Sleight of Hand','Stealth'], features: [{lvl:1,name:'Expertise',desc:'Double proficiency on 2 skills'},{lvl:1,name:'Sneak Attack',desc:'1d6 extra damage (scales)'},{lvl:1,name:'Thieves\' Cant',desc:'Secret rogue language'},{lvl:2,name:'Cunning Action',desc:'Bonus action Dash/Disengage/Hide'},{lvl:3,name:'Roguish Archetype',desc:'Thief, Assassin, Arcane Trickster'},{lvl:5,name:'Uncanny Dodge',desc:'Halve attack damage as reaction'}] },
    sorcerer: { name: 'Sorcerer', hd: 'd6', primary: 'CHA', saves: ['CON','CHA'], skills: ['Arcana','Deception','Insight','Intimidation','Persuasion','Religion'], features: [{lvl:1,name:'Spellcasting',desc:'CHA-based, no ritual casting'},{lvl:1,name:'Sorcerous Origin',desc:'Draconic, Wild Magic, etc.'},{lvl:2,name:'Font of Magic',desc:'Sorcery points = sorcerer level'},{lvl:3,name:'Metamagic',desc:'Twinned, Quickened, Subtle, etc.'}] },
    warlock: { name: 'Warlock', hd: 'd8', primary: 'CHA', saves: ['WIS','CHA'], skills: ['Arcana','Deception','History','Intimidation','Investigation','Nature','Religion'], features: [{lvl:1,name:'Otherworldly Patron',desc:'Archfey, Fiend, Great Old One, etc.'},{lvl:1,name:'Pact Magic',desc:'CHA-based, slots recharge on short rest'},{lvl:2,name:'Eldritch Invocations',desc:'Customizable warlock features'},{lvl:3,name:'Pact Boon',desc:'Pact of Chain, Blade, Tome'}] },
    wizard: { name: 'Wizard', hd: 'd6', primary: 'INT', saves: ['INT','WIS'], skills: ['Arcana','History','Insight','Investigation','Medicine','Religion'], features: [{lvl:1,name:'Spellcasting',desc:'INT-based, ritual casting, spellbook'},{lvl:1,name:'Arcane Recovery',desc:'Recover spell slots on short rest'},{lvl:2,name:'Arcane Tradition',desc:'Abjuration, Evocation, Necromancy, etc.'}] },
    artificer: { name: 'Artificer', hd: 'd8', primary: 'INT', saves: ['CON','INT'], skills: ['Arcana','History','Investigation','Medicine','Nature','Perception','Sleight of Hand'], features: [{lvl:1,name:'Magical Tinkering',desc:'Imbue tiny objects with magic'},{lvl:1,name:'Spellcasting',desc:'INT-based, ritual casting'},{lvl:2,name:'Infuse Item',desc:'Create magic items'},{lvl:3,name:'Artificer Specialist',desc:'Alchemist, Armorer, Artillerist, Battle Smith'}] },
  };

  const DND_RACES = {
    human: { name: 'Human', speed: 30, size: 'Medium', asi: '+1 to all ability scores', traits: ['Extra language'], languages: ['Common', 'One extra'] },
    elf: { name: 'Elf', speed: 30, size: 'Medium', asi: '+2 DEX', traits: ['Darkvision 60ft', 'Keen Senses (Perception prof)', 'Fey Ancestry', 'Trance (4hr long rest)'], languages: ['Common', 'Elvish'], subraces: ['High Elf (+1 INT, cantrip)', 'Wood Elf (+1 WIS, 35ft speed, Mask of the Wild)', 'Dark Elf/Drow (+1 CHA, Superior Darkvision 120ft, Sunlight Sensitivity)'] },
    dwarf: { name: 'Dwarf', speed: 25, size: 'Medium', asi: '+2 CON', traits: ['Darkvision 60ft', 'Dwarven Resilience (poison resistance)', 'Stonecunning', 'Tool proficiency'], languages: ['Common', 'Dwarvish'], subraces: ['Hill Dwarf (+1 WIS, +1 HP/level)', 'Mountain Dwarf (+2 STR, medium armor prof)'] },
    halfling: { name: 'Halfling', speed: 25, size: 'Small', asi: '+2 DEX', traits: ['Lucky (reroll 1s)', 'Brave (advantage vs frightened)', 'Halfling Nimbleness'], languages: ['Common', 'Halfling'], subraces: ['Lightfoot (+1 CHA, Naturally Stealthy)', 'Stout (+1 CON, poison resistance)'] },
    gnome: { name: 'Gnome', speed: 25, size: 'Small', asi: '+2 INT', traits: ['Darkvision 60ft', 'Gnome Cunning (advantage on INT/WIS/CHA saves vs magic)'], languages: ['Common', 'Gnomish'], subraces: ['Forest Gnome (+1 DEX, Minor Illusion)', 'Rock Gnome (+1 CON, Tinker)'] },
    halfelf: { name: 'Half-Elf', speed: 30, size: 'Medium', asi: '+2 CHA, +1 to two others', traits: ['Darkvision 60ft', 'Fey Ancestry', 'Skill Versatility (2 skill profs)'], languages: ['Common', 'Elvish', 'One extra'] },
    halforc: { name: 'Half-Orc', speed: 30, size: 'Medium', asi: '+2 STR, +1 CON', traits: ['Darkvision 60ft', 'Menacing (Intimidation prof)', 'Relentless Endurance (drop to 1 HP once)', 'Savage Attacks (extra crit die)'], languages: ['Common', 'Orc'] },
    tiefling: { name: 'Tiefling', speed: 30, size: 'Medium', asi: '+2 CHA, +1 INT', traits: ['Darkvision 60ft', 'Hellish Resistance (fire)', 'Infernal Legacy (Thaumaturgy, Hellish Rebuke, Darkness)'], languages: ['Common', 'Infernal'] },
    dragonborn: { name: 'Dragonborn', speed: 30, size: 'Medium', asi: '+2 STR, +1 CHA', traits: ['Breath Weapon (2d6, scales)', 'Damage Resistance (chosen type)'], languages: ['Common', 'Draconic'] },
  };

  const CONDITIONS = [
    { name: 'Blinded', effects: ['Auto-fail sight-based checks', 'Attack rolls have disadvantage', 'Attacks against have advantage'] },
    { name: 'Charmed', effects: ['Can\'t attack charmer', 'Charmer has advantage on social checks'] },
    { name: 'Deafened', effects: ['Auto-fail hearing-based checks'] },
    { name: 'Frightened', effects: ['Disadvantage on checks/attacks while source is visible', 'Can\'t willingly move closer to source'] },
    { name: 'Grappled', effects: ['Speed becomes 0', 'Ends if grappler is incapacitated or forced apart'] },
    { name: 'Incapacitated', effects: ['Can\'t take actions or reactions'] },
    { name: 'Invisible', effects: ['Impossible to see without magic/special sense', 'Attacks have advantage, attacks against have disadvantage'] },
    { name: 'Paralyzed', effects: ['Incapacitated, can\'t move or speak', 'Auto-fail STR/DEX saves', 'Attacks have advantage, melee hits are crits'] },
    { name: 'Petrified', effects: ['Transformed to stone', 'Weight x10', 'Incapacitated, can\'t move/speak', 'Resistance to all damage', 'Immune to poison/disease'] },
    { name: 'Poisoned', effects: ['Disadvantage on attack rolls and ability checks'] },
    { name: 'Prone', effects: ['Disadvantage on attacks', 'Melee attacks have advantage, ranged have disadvantage', 'Must spend half movement to stand'] },
    { name: 'Restrained', effects: ['Speed 0', 'Attacks have disadvantage', 'Attacks against have advantage', 'Disadvantage on DEX saves'] },
    { name: 'Stunned', effects: ['Incapacitated, can\'t move, can speak only falteringly', 'Auto-fail STR/DEX saves', 'Attacks against have advantage'] },
    { name: 'Unconscious', effects: ['Incapacitated, can\'t move or speak, unaware', 'Drop what holding, fall prone', 'Auto-fail STR/DEX saves', 'Attacks have advantage, melee hits are crits'] },
    { name: 'Exhaustion', effects: ['Level 1: Disadvantage on ability checks', 'Level 2: Speed halved', 'Level 3: Disadvantage on attacks/saves', 'Level 4: HP max halved', 'Level 5: Speed 0', 'Level 6: Death'] },
  ];

  const SAMPLE_MONSTERS = [
    { name: 'Goblin', type: 'Small humanoid', cr: '1/4', ac: 15, hp: 7, speed: '30 ft', str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8, actions: ['Scimitar: +4, 1d6+2 slashing', 'Shortbow: +4, 1d6+2 piercing'] },
    { name: 'Skeleton', type: 'Medium undead', cr: '1/4', ac: 13, hp: 13, speed: '30 ft', str: 10, dex: 14, con: 15, int: 6, wis: 8, cha: 5, actions: ['Shortsword: +4, 1d6+2 piercing', 'Shortbow: +4, 1d6+2 piercing'] },
    { name: 'Zombie', type: 'Medium undead', cr: '1/4', ac: 8, hp: 22, speed: '20 ft', str: 13, dex: 6, con: 16, int: 3, wis: 6, cha: 5, actions: ['Slam: +3, 1d6+1 bludgeoning'] },
    { name: 'Orc', type: 'Medium humanoid', cr: '1/2', ac: 13, hp: 15, speed: '30 ft', str: 16, dex: 12, con: 16, int: 7, wis: 11, cha: 10, actions: ['Greataxe: +5, 1d12+3 slashing', 'Javelin: +5, 1d6+3 piercing'] },
    { name: 'Ogre', type: 'Large giant', cr: '2', ac: 11, hp: 59, speed: '40 ft', str: 19, dex: 8, con: 16, int: 5, wis: 7, cha: 7, actions: ['Greatclub: +6, 2d8+4 bludgeoning', 'Javelin: +6, 2d6+4 piercing'] },
    { name: 'Owlbear', type: 'Large monstrosity', cr: '3', ac: 13, hp: 59, speed: '40 ft', str: 20, dex: 12, con: 17, int: 3, wis: 12, cha: 7, actions: ['Multiattack: beak + claws', 'Beak: +7, 1d10+5 piercing', 'Claws: +7, 2d8+5 slashing'] },
    { name: 'Young Red Dragon', type: 'Large dragon', cr: '10', ac: 18, hp: 178, speed: '40 ft, fly 80 ft', str: 23, dex: 10, con: 21, int: 14, wis: 11, cha: 19, actions: ['Multiattack: bite + 2 claws', 'Bite: +10, 2d10+6 piercing + 1d6 fire', 'Fire Breath (Recharge 5-6): 56 (16d6) fire, DC 17 DEX'] },
    { name: 'Lich', type: 'Medium undead', cr: '21', ac: 17, hp: 135, speed: '30 ft', str: 11, dex: 16, con: 16, int: 20, wis: 14, cha: 16, actions: ['Paralyzing Touch: +12, 3d6 cold + DC 18 CON or paralyzed', '18th-level spellcaster (INT)'] },
    { name: 'Ancient Red Dragon', type: 'Gargantuan dragon', cr: '24', ac: 22, hp: 546, speed: '40 ft, fly 80 ft', str: 30, dex: 10, con: 29, int: 18, wis: 15, cha: 23, actions: ['Multiattack: Frightful Presence + bite + 2 claws', 'Bite: +17, 2d10+10 piercing + 4d6 fire', 'Fire Breath (Recharge 5-6): 91 (26d6) fire, DC 24 DEX'] },
  ];

  const SPELLS_SAMPLE = [
    { name: 'Fire Bolt', level: 0, school: 'Evocation', time: '1 action', range: '120 ft', comp: 'V, S', dur: 'Instantaneous', classes: ['Sorcerer','Wizard','Artificer'], desc: 'Ranged spell attack, 1d10 fire damage. Scales at 5th (2d10), 11th (3d10), 17th (4d10).' },
    { name: 'Eldritch Blast', level: 0, school: 'Evocation', time: '1 action', range: '120 ft', comp: 'V, S', dur: 'Instantaneous', classes: ['Warlock'], desc: '1d10 force damage. Additional beams at 5th, 11th, 17th level.' },
    { name: 'Healing Word', level: 1, school: 'Evocation', time: '1 bonus action', range: '60 ft', comp: 'V', dur: 'Instantaneous', classes: ['Bard','Cleric','Druid'], desc: 'Heal 1d4 + spellcasting modifier. Upcast: +1d4 per slot level.' },
    { name: 'Magic Missile', level: 1, school: 'Evocation', time: '1 action', range: '120 ft', comp: 'V, S', dur: 'Instantaneous', classes: ['Sorcerer','Wizard'], desc: 'Three darts, 1d4+1 force each. Auto-hit. Upcast: +1 dart per slot level.' },
    { name: 'Shield', level: 1, school: 'Abjuration', time: '1 reaction', range: 'Self', comp: 'V, S', dur: '1 round', classes: ['Sorcerer','Wizard'], desc: '+5 AC until start of next turn, including against triggering attack. Immune to Magic Missile.' },
    { name: 'Cure Wounds', level: 1, school: 'Evocation', time: '1 action', range: 'Touch', comp: 'V, S', dur: 'Instantaneous', classes: ['Bard','Cleric','Druid','Paladin','Ranger','Artificer'], desc: 'Heal 1d8 + spellcasting modifier. Upcast: +1d8 per slot level.' },
    { name: 'Fireball', level: 3, school: 'Evocation', time: '1 action', range: '150 ft', comp: 'V, S, M', dur: 'Instantaneous', classes: ['Sorcerer','Wizard'], desc: '8d6 fire damage in 20-ft radius, DEX save for half. Upcast: +1d6 per slot level.' },
    { name: 'Counterspell', level: 3, school: 'Abjuration', time: '1 reaction', range: '60 ft', comp: 'S', dur: 'Instantaneous', classes: ['Sorcerer','Warlock','Wizard'], desc: 'Counter spell of 3rd level or lower. Higher: ability check DC 10 + spell level.' },
    { name: 'Revivify', level: 3, school: 'Necromancy', time: '1 action', range: 'Touch', comp: 'V, S, M (300gp diamonds)', dur: 'Instantaneous', classes: ['Cleric','Paladin','Artificer'], desc: 'Return creature dead ≤1 minute to life with 1 HP. Can\'t restore missing parts.' },
  ];

  const WEAPONS = [
    { name: 'Club', type: 'Simple Melee', damage: '1d4 bludgeoning', weight: '2 lb', props: 'Light', cost: '1 sp' },
    { name: 'Dagger', type: 'Simple Melee', damage: '1d4 piercing', weight: '1 lb', props: 'Finesse, light, thrown (20/60)', cost: '2 gp' },
    { name: 'Handaxe', type: 'Simple Melee', damage: '1d6 slashing', weight: '2 lb', props: 'Light, thrown (20/60)', cost: '5 gp' },
    { name: 'Mace', type: 'Simple Melee', damage: '1d6 bludgeoning', weight: '4 lb', props: '-', cost: '5 gp' },
    { name: 'Quarterstaff', type: 'Simple Melee', damage: '1d6 bludgeoning', weight: '4 lb', props: 'Versatile (1d8)', cost: '2 sp' },
    { name: 'Shortsword', type: 'Martial Melee', damage: '1d6 piercing', weight: '2 lb', props: 'Finesse, light', cost: '10 gp' },
    { name: 'Longsword', type: 'Martial Melee', damage: '1d8 slashing', weight: '3 lb', props: 'Versatile (1d10)', cost: '15 gp' },
    { name: 'Greatsword', type: 'Martial Melee', damage: '2d6 slashing', weight: '6 lb', props: 'Heavy, two-handed', cost: '50 gp' },
    { name: 'Battleaxe', type: 'Martial Melee', damage: '1d8 slashing', weight: '4 lb', props: 'Versatile (1d10)', cost: '10 gp' },
    { name: 'Rapier', type: 'Martial Melee', damage: '1d8 piercing', weight: '2 lb', props: 'Finesse', cost: '25 gp' },
    { name: 'Shortbow', type: 'Simple Ranged', damage: '1d6 piercing', weight: '2 lb', props: 'Ammunition (80/320), two-handed', cost: '25 gp' },
    { name: 'Longbow', type: 'Martial Ranged', damage: '1d8 piercing', weight: '2 lb', props: 'Ammunition (150/600), heavy, two-handed', cost: '50 gp' },
    { name: 'Light Crossbow', type: 'Simple Ranged', damage: '1d8 piercing', weight: '5 lb', props: 'Ammunition (80/320), loading, two-handed', cost: '25 gp' },
  ];

  const ARMOR = [
    { name: 'Padded', type: 'Light', ac: '11 + DEX', str: '-', stealth: 'Disadvantage', weight: '8 lb', cost: '5 gp' },
    { name: 'Leather', type: 'Light', ac: '11 + DEX', str: '-', stealth: '-', weight: '10 lb', cost: '10 gp' },
    { name: 'Studded Leather', type: 'Light', ac: '12 + DEX', str: '-', stealth: '-', weight: '13 lb', cost: '45 gp' },
    { name: 'Hide', type: 'Medium', ac: '12 + DEX (max 2)', str: '-', stealth: '-', weight: '12 lb', cost: '10 gp' },
    { name: 'Chain Shirt', type: 'Medium', ac: '13 + DEX (max 2)', str: '-', stealth: '-', weight: '20 lb', cost: '50 gp' },
    { name: 'Scale Mail', type: 'Medium', ac: '14 + DEX (max 2)', str: '-', stealth: 'Disadvantage', weight: '45 lb', cost: '50 gp' },
    { name: 'Breastplate', type: 'Medium', ac: '14 + DEX (max 2)', str: '-', stealth: '-', weight: '20 lb', cost: '400 gp' },
    { name: 'Half Plate', type: 'Medium', ac: '15 + DEX (max 2)', str: '-', stealth: 'Disadvantage', weight: '40 lb', cost: '750 gp' },
    { name: 'Chain Mail', type: 'Heavy', ac: '16', str: 'STR 13', stealth: 'Disadvantage', weight: '55 lb', cost: '75 gp' },
    { name: 'Splint', type: 'Heavy', ac: '17', str: 'STR 15', stealth: 'Disadvantage', weight: '60 lb', cost: '200 gp' },
    { name: 'Plate', type: 'Heavy', ac: '18', str: 'STR 15', stealth: 'Disadvantage', weight: '65 lb', cost: '1,500 gp' },
    { name: 'Shield', type: 'Shield', ac: '+2', str: '-', stealth: '-', weight: '6 lb', cost: '10 gp' },
  ];

  function abilityMod(score) {
    return Math.floor((score - 10) / 2);
  }
  function modStr(score) {
    const m = abilityMod(score);
    return (m >= 0 ? '+' : '') + m;
  }

  window.openDndTool = function(action) {
    const tools = {
      'dnd:characterCreator': { title: 'D&D 5e Character Creator', build: buildCharacterCreator },
      'dnd:abilityCalc': { title: 'Ability Score Calculator', build: buildAbilityCalc },
      'dnd:levelUp': { title: 'Level Up Manager', build: buildLevelUp },
      'dnd:multiclass': { title: 'Multiclass Planner', build: buildMulticlass },
      'dnd:backgrounds': { title: 'Background Editor', build: buildBackgrounds },
      'dnd:feats': { title: 'Feat Browser', build: buildFeats },
      'dnd:monsterBrowser': { title: 'Monster Manual Browser', build: buildMonsterBrowser },
      'dnd:statBlockEditor': { title: 'Stat Block Editor', build: buildStatBlockEditor },
      'dnd:crCalculator': { title: 'CR Calculator', build: buildCRCalculator },
      'dnd:customMonster': { title: 'Custom Monster Creator', build: buildCustomMonster },
      'dnd:legendaryActions': { title: 'Legendary/Lair Actions Editor', build: buildLegendaryActions },
      'dnd:encounterBuilder': { title: 'Encounter Builder', build: buildEncounterBuilder },
      'dnd:initiativeTracker': { title: 'Initiative Tracker', build: buildInitiativeTracker },
      'dnd:difficultyCalc': { title: 'Encounter Difficulty Calculator', build: buildDifficultyCalc },
      'dnd:randomEncounters': { title: 'Random Encounter Tables', build: buildRandomEncounters },
      'dnd:bossFight': { title: 'Boss Fight Designer', build: buildBossFight },
      'dnd:weaponEditor': { title: 'Weapon Editor', build: buildWeaponEditor },
      'dnd:armorEditor': { title: 'Armor Editor', build: buildArmorEditor },
      'dnd:magicItemCreator': { title: 'Magic Item Creator', build: buildMagicItemCreator },
      'dnd:potionBrewer': { title: 'Potion Brewer', build: buildPotionBrewer },
      'dnd:scrollScriber': { title: 'Scroll Scriber', build: buildScrollScriber },
      'dnd:treasureGen': { title: 'Treasure Generator (DMG)', build: buildTreasureGen },
      'dnd:shopInventory': { title: 'Shop Inventory Manager', build: buildShopInventory },
      'dnd:spellDatabase': { title: 'Spell Database', build: buildSpellDatabase },
      'dnd:spellCreator': { title: 'Spell Creator', build: buildSpellCreator },
      'dnd:spellSlots': { title: 'Spell Slot Tracker', build: buildSpellSlots },
      'dnd:concentration': { title: 'Concentration Manager', build: buildConcentration },
      'dnd:dungeonGen': { title: 'Dungeon Generator', build: buildDungeonGen },
      'dnd:roomEditor': { title: 'Room Editor', build: buildRoomEditor },
      'dnd:trapDesigner': { title: 'Trap Designer', build: buildTrapDesigner },
      'dnd:puzzleCreator': { title: 'Puzzle Creator', build: buildPuzzleCreator },
      'dnd:npcGen': { title: 'NPC Generator', build: buildNPCGen },
      'dnd:factionManager': { title: 'Faction Manager', build: buildFactionManager },
      'dnd:calendar': { title: 'Calendar & Time System', build: buildCalendar },
      'dnd:weather': { title: 'Weather System', build: buildWeather },
      'dnd:ref:combat': { title: 'Combat Rules Reference', build: buildCombatRef },
      'dnd:ref:conditions': { title: 'Conditions Reference', build: buildConditionsRef },
      'dnd:ref:actions': { title: 'Actions in Combat', build: buildActionsRef },
      'dnd:ref:movement': { title: 'Movement & Travel', build: buildMovementRef },
      'dnd:ref:resting': { title: 'Resting Rules', build: buildRestingRef },
      'dnd:ref:death': { title: 'Death & Dying', build: buildDeathRef },
      'dnd:ref:skills': { title: 'Skills & Abilities', build: buildSkillsRef },
      'dnd:ref:saves': { title: 'Saving Throws', build: buildSavesRef },
      'dnd:ref:cover': { title: 'Cover Rules', build: buildCoverRef },
      'dnd:ref:exhaustion': { title: 'Exhaustion Levels', build: buildExhaustionRef },
    };

    if (action.startsWith('dnd:class:')) {
      const cls = action.split(':')[2];
      if (DND_CLASSES[cls]) {
        window.openModal(DND_CLASSES[cls].name + ' Class Builder', buildClassDetail(cls));
        return;
      }
    }
    if (action.startsWith('dnd:race:')) {
      const race = action.split(':')[2];
      if (DND_RACES[race]) {
        window.openModal(DND_RACES[race].name + ' Race Details', buildRaceDetail(race));
        return;
      }
      window.openModal('Custom Race Editor', buildCustomRace());
      return;
    }
    if (action.startsWith('dnd:montype:')) {
      const type = action.split(':')[2];
      window.openModal('Monsters: ' + type.charAt(0).toUpperCase() + type.slice(1), buildMonstersByType(type));
      return;
    }
    if (action.startsWith('dnd:spells:') || action.startsWith('dnd:spelllvl:') || action.startsWith('dnd:school:') || action.startsWith('dnd:magictable:')) {
      window.openModal('Spell/Item Reference', buildSpellDatabase());
      return;
    }

    const tool = tools[action];
    if (tool) {
      window.openModal(tool.title, tool.build());
    }
  };

  function buildClassDetail(cls) {
    const c = DND_CLASSES[cls];
    let html = `<div class="stat-block">
      <div class="stat-name">${c.name}</div>
      <div class="stat-type">Player Class</div>
      <div class="stat-divider"></div>
      <div class="stat-row"><span class="stat-label">Hit Die:</span> ${c.hd}</div>
      <div class="stat-row"><span class="stat-label">Primary Ability:</span> ${c.primary}</div>
      <div class="stat-row"><span class="stat-label">Saving Throws:</span> ${c.saves.join(', ')}</div>
      <div class="stat-row"><span class="stat-label">Skills (choose 2):</span> ${c.skills.join(', ')}</div>
      <div class="stat-divider"></div>
      <div style="font-weight:700;color:var(--accent);margin-bottom:6px;">Class Features</div>`;
    c.features.forEach(f => {
      html += `<div style="margin-bottom:4px;"><span style="font-weight:700;color:var(--text);">Level ${f.lvl}: ${f.name}</span> - <span style="color:var(--text2);">${f.desc}</span></div>`;
    });
    html += '</div>';
    html += `<div style="margin-top:12px;"><button class="btn btn-primary" onclick="if(typeof window.openDndTool==='function')window.openDndTool('dnd:characterCreator')">Use in Character Creator</button></div>`;
    return html;
  }

  function buildRaceDetail(race) {
    const r = DND_RACES[race];
    let html = `<div class="stat-block">
      <div class="stat-name">${r.name}</div>
      <div class="stat-type">Player Race</div>
      <div class="stat-divider"></div>
      <div class="stat-row"><span class="stat-label">Speed:</span> ${r.speed} ft</div>
      <div class="stat-row"><span class="stat-label">Size:</span> ${r.size}</div>
      <div class="stat-row"><span class="stat-label">Ability Score Increase:</span> ${r.asi}</div>
      <div class="stat-row"><span class="stat-label">Languages:</span> ${r.languages.join(', ')}</div>
      <div class="stat-divider"></div>
      <div style="font-weight:700;color:var(--accent);margin-bottom:6px;">Racial Traits</div>`;
    r.traits.forEach(t => { html += `<div style="margin-bottom:2px;color:var(--text);">• ${t}</div>`; });
    if (r.subraces) {
      html += `<div class="stat-divider"></div><div style="font-weight:700;color:var(--accent);margin-bottom:6px;">Subraces</div>`;
      r.subraces.forEach(s => { html += `<div style="margin-bottom:2px;color:var(--text);">• ${s}</div>`; });
    }
    html += '</div>';
    return html;
  }

  function buildCustomRace() {
    return `
      <div class="form-group"><label>Race Name</label><input type="text" placeholder="Custom Race"></div>
      <div class="form-row">
        <div class="form-group"><label>Speed</label><input type="number" value="30"></div>
        <div class="form-group"><label>Size</label><select><option>Small</option><option selected>Medium</option><option>Large</option></select></div>
      </div>
      <div class="form-group"><label>Ability Score Increases</label><input type="text" placeholder="+2 STR, +1 CON"></div>
      <div class="form-group"><label>Racial Traits (one per line)</label><textarea rows="4" placeholder="Darkvision 60ft\nPoison Resistance\n..."></textarea></div>
      <div class="form-group"><label>Languages</label><input type="text" placeholder="Common, Dwarvish"></div>
    `;
  }

  function buildCharacterCreator() {
    let classOpts = Object.keys(DND_CLASSES).map(k => `<option value="${k}">${DND_CLASSES[k].name}</option>`).join('');
    let raceOpts = Object.keys(DND_RACES).map(k => `<option value="${k}">${DND_RACES[k].name}</option>`).join('');
    return `
      <div class="form-row">
        <div class="form-group"><label>Character Name</label><input type="text" placeholder="Enter name..."></div>
        <div class="form-group"><label>Player Name</label><input type="text" placeholder="Player"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Race</label><select>${raceOpts}</select></div>
        <div class="form-group"><label>Class</label><select>${classOpts}</select></div>
        <div class="form-group"><label>Level</label><input type="number" value="1" min="1" max="20"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Background</label>
          <select><option>Acolyte</option><option>Criminal</option><option>Folk Hero</option><option>Noble</option><option>Sage</option><option>Soldier</option><option>Hermit</option><option>Outlander</option><option>Entertainer</option><option>Guild Artisan</option><option>Sailor</option><option>Urchin</option><option>Charlatan</option><option>Far Traveler</option></select>
        </div>
        <div class="form-group"><label>Alignment</label>
          <select><option>Lawful Good</option><option>Neutral Good</option><option>Chaotic Good</option><option>Lawful Neutral</option><option>True Neutral</option><option>Chaotic Neutral</option><option>Lawful Evil</option><option>Neutral Evil</option><option>Chaotic Evil</option></select>
        </div>
      </div>
      <div style="font-size:11px;color:var(--accent);font-weight:600;margin:12px 0 8px;">ABILITY SCORES</div>
      <div class="ability-scores">
        ${['STR','DEX','CON','INT','WIS','CHA'].map(a =>
          `<div class="ability-score"><div class="score-label">${a}</div><input type="number" value="10" min="1" max="30" style="width:50px;text-align:center;font-size:18px;font-weight:700;background:#12122a;border:1px solid #3a3a5c;color:var(--text);border-radius:4px;padding:4px;"><div class="score-mod">${modStr(10)}</div></div>`
        ).join('')}
      </div>
      <div class="form-row">
        <div class="form-group"><label>Hit Points</label><input type="number" value="10"></div>
        <div class="form-group"><label>Armor Class</label><input type="number" value="10"></div>
        <div class="form-group"><label>Initiative</label><input type="number" value="0"></div>
        <div class="form-group"><label>Speed</label><input type="number" value="30"></div>
      </div>
      <div class="form-group"><label>Proficiencies & Languages</label><textarea rows="2" placeholder="List proficiencies..."></textarea></div>
      <div class="form-group"><label>Equipment</label><textarea rows="2" placeholder="Starting equipment..."></textarea></div>
      <div class="form-group"><label>Features & Traits</label><textarea rows="2" placeholder="Class and racial features..."></textarea></div>
      <div style="display:flex;gap:8px;margin-top:12px;">
        <button class="btn btn-primary">Save Character</button>
        <button class="btn">Export to Game Data</button>
        <button class="btn">Print Character Sheet</button>
      </div>
    `;
  }

  function buildAbilityCalc() {
    return `
      <div class="tabs-row">
        <button class="tab-btn active" onclick="switchPrefTab(this,'calc-standard')">Standard Array</button>
        <button class="tab-btn" onclick="switchPrefTab(this,'calc-pointbuy')">Point Buy</button>
        <button class="tab-btn" onclick="switchPrefTab(this,'calc-roll')">Roll 4d6</button>
      </div>
      <div class="tab-content active" id="calc-standard">
        <div style="font-size:12px;color:var(--text2);margin-bottom:12px;">Standard Array: 15, 14, 13, 12, 10, 8 - Assign to abilities</div>
        <div class="ability-scores">
          ${['STR','DEX','CON','INT','WIS','CHA'].map(a =>
            `<div class="ability-score"><div class="score-label">${a}</div><select style="width:50px;text-align:center;font-size:16px;background:#12122a;border:1px solid #3a3a5c;color:var(--text);border-radius:4px;padding:4px;">
              <option>15</option><option>14</option><option>13</option><option>12</option><option>10</option><option>8</option>
            </select></div>`
          ).join('')}
        </div>
      </div>
      <div class="tab-content" id="calc-pointbuy">
        <div style="font-size:12px;color:var(--text2);margin-bottom:12px;">Point Buy: 27 points, scores start at 8, max 15. Cost: 8-13 = 1pt each, 14 = 2pts, 15 = 2pts</div>
        <div style="text-align:center;font-size:18px;font-weight:700;color:var(--accent);margin-bottom:12px;">Points Remaining: <span id="pointsLeft">27</span> / 27</div>
        <div class="ability-scores">
          ${['STR','DEX','CON','INT','WIS','CHA'].map(a =>
            `<div class="ability-score"><div class="score-label">${a}</div><input type="number" value="8" min="8" max="15" style="width:50px;text-align:center;font-size:18px;font-weight:700;background:#12122a;border:1px solid #3a3a5c;color:var(--text);border-radius:4px;padding:4px;"><div class="score-mod">${modStr(8)}</div></div>`
          ).join('')}
        </div>
      </div>
      <div class="tab-content" id="calc-roll">
        <div style="font-size:12px;color:var(--text2);margin-bottom:12px;">Roll 4d6, drop lowest die. Click "Roll All" to generate a set of ability scores.</div>
        <div style="text-align:center;margin-bottom:12px;"><button class="btn btn-primary" onclick="">Roll All Scores</button></div>
        <div class="ability-scores">
          ${['STR','DEX','CON','INT','WIS','CHA'].map(a =>
            `<div class="ability-score"><div class="score-label">${a}</div><div class="score-value">?</div><div class="score-mod">-</div></div>`
          ).join('')}
        </div>
      </div>
    `;
  }

  function buildLevelUp() {
    const xpTable = [0,300,900,2700,6500,14000,23000,34000,48000,64000,85000,100000,120000,140000,165000,195000,225000,265000,305000,355000];
    let html = '<table class="ref-table"><tr><th>Level</th><th>XP Required</th><th>Prof Bonus</th><th>Features</th></tr>';
    for (let i = 0; i < 20; i++) {
      const pb = Math.ceil((i + 1) / 4) + 1;
      html += `<tr><td style="font-weight:700;">${i+1}</td><td>${xpTable[i].toLocaleString()}</td><td>+${pb}</td><td style="font-size:11px;color:var(--text2);">ASI at 4, 8, 12, 16, 19</td></tr>`;
    }
    html += '</table>';
    return html;
  }

  function buildMulticlass() {
    return `
      <div style="font-size:12px;color:var(--text2);margin-bottom:12px;">
        Prerequisites: Must have 13+ in the primary ability of both your current and new class.
      </div>
      <table class="ref-table">
        <tr><th>Class</th><th>Prerequisite</th><th>Proficiencies Gained</th></tr>
        <tr><td>Barbarian</td><td>STR 13</td><td>Shields, simple weapons, martial weapons</td></tr>
        <tr><td>Bard</td><td>CHA 13</td><td>Light armor, one skill, one instrument</td></tr>
        <tr><td>Cleric</td><td>WIS 13</td><td>Light armor, medium armor, shields</td></tr>
        <tr><td>Druid</td><td>WIS 13</td><td>Light armor, medium armor, shields</td></tr>
        <tr><td>Fighter</td><td>STR 13 or DEX 13</td><td>Light armor, medium armor, shields, simple/martial weapons</td></tr>
        <tr><td>Monk</td><td>DEX 13 and WIS 13</td><td>Simple weapons, shortswords</td></tr>
        <tr><td>Paladin</td><td>STR 13 and CHA 13</td><td>Light armor, medium armor, shields, simple/martial weapons</td></tr>
        <tr><td>Ranger</td><td>DEX 13 and WIS 13</td><td>Light armor, medium armor, shields, simple/martial weapons, one skill</td></tr>
        <tr><td>Rogue</td><td>DEX 13</td><td>Light armor, one skill, thieves' tools</td></tr>
        <tr><td>Sorcerer</td><td>CHA 13</td><td>-</td></tr>
        <tr><td>Warlock</td><td>CHA 13</td><td>Light armor, simple weapons</td></tr>
        <tr><td>Wizard</td><td>INT 13</td><td>-</td></tr>
      </table>
    `;
  }

  function buildBackgrounds() {
    const bgs = [
      { name: 'Acolyte', skills: 'Insight, Religion', tools: '-', langs: '2 of choice', equip: 'Holy symbol, prayer book, vestments, 15 gp', feature: 'Shelter of the Faithful' },
      { name: 'Criminal', skills: 'Deception, Stealth', tools: 'Gaming set, thieves\' tools', langs: '-', equip: 'Crowbar, dark clothes, 15 gp', feature: 'Criminal Contact' },
      { name: 'Folk Hero', skills: 'Animal Handling, Survival', tools: 'Artisan tools, vehicles (land)', langs: '-', equip: 'Artisan tools, shovel, 10 gp', feature: 'Rustic Hospitality' },
      { name: 'Noble', skills: 'History, Persuasion', tools: 'Gaming set', langs: '1 of choice', equip: 'Fine clothes, signet ring, 25 gp', feature: 'Position of Privilege' },
      { name: 'Sage', skills: 'Arcana, History', tools: '-', langs: '2 of choice', equip: 'Ink, quill, small knife, letter, 10 gp', feature: 'Researcher' },
      { name: 'Soldier', skills: 'Athletics, Intimidation', tools: 'Gaming set, vehicles (land)', langs: '-', equip: 'Insignia, trophy, dice, 10 gp', feature: 'Military Rank' },
      { name: 'Hermit', skills: 'Medicine, Religion', tools: 'Herbalism kit', langs: '1 of choice', equip: 'Scroll case, winter blanket, herbalism kit, 5 gp', feature: 'Discovery' },
      { name: 'Outlander', skills: 'Athletics, Survival', tools: 'Musical instrument', langs: '1 of choice', equip: 'Staff, hunting trap, animal trophy, 10 gp', feature: 'Wanderer' },
    ];
    let html = '<table class="ref-table"><tr><th>Background</th><th>Skills</th><th>Tools</th><th>Languages</th><th>Feature</th></tr>';
    bgs.forEach(b => { html += `<tr><td style="font-weight:700;">${b.name}</td><td>${b.skills}</td><td>${b.tools}</td><td>${b.langs}</td><td style="color:var(--accent);">${b.feature}</td></tr>`; });
    html += '</table>';
    return html;
  }

  function buildFeats() {
    const feats = [
      { name: 'Alert', prereq: '-', desc: '+5 initiative, can\'t be surprised, no advantage from hidden attackers' },
      { name: 'Great Weapon Master', prereq: '-', desc: 'Bonus attack on crit/kill, -5 to hit for +10 damage' },
      { name: 'Sharpshooter', prereq: '-', desc: 'No disadvantage at long range, ignore cover, -5/+10' },
      { name: 'Sentinel', prereq: '-', desc: 'Opportunity attack stops movement, react to attacks on allies' },
      { name: 'Lucky', prereq: '-', desc: '3 luck points, reroll d20s' },
      { name: 'War Caster', prereq: 'Spellcasting', desc: 'Advantage on concentration, somatic w/ hands full, spell as opportunity attack' },
      { name: 'Resilient', prereq: '-', desc: '+1 to chosen ability, gain proficiency in that save' },
      { name: 'Tough', prereq: '-', desc: '+2 HP per level' },
      { name: 'Mobile', prereq: '-', desc: '+10 speed, no opportunity attack after melee, ignore difficult terrain on Dash' },
      { name: 'Polearm Master', prereq: '-', desc: 'Bonus d4 attack, opportunity attack on enter reach' },
      { name: 'Crossbow Expert', prereq: '-', desc: 'Ignore loading, no disadvantage in melee, bonus hand crossbow attack' },
      { name: 'Shield Master', prereq: '-', desc: 'Bonus action shove, add shield AC to DEX saves, Evasion-like on success' },
    ];
    let html = '<input class="search-input" placeholder="Search feats...">';
    html += '<table class="ref-table"><tr><th>Feat</th><th>Prerequisite</th><th>Description</th></tr>';
    feats.forEach(f => { html += `<tr><td style="font-weight:700;white-space:nowrap;">${f.name}</td><td>${f.prereq}</td><td style="font-size:11px;">${f.desc}</td></tr>`; });
    html += '</table>';
    return html;
  }

  function buildMonsterBrowser() {
    let html = '<input class="search-input" placeholder="Search monsters by name...">';
    html += '<div class="form-row" style="margin-bottom:12px;">';
    html += '<div class="form-group"><label>CR Range</label><select><option>All</option><option>0-1/4</option><option>1/2-1</option><option>2-4</option><option>5-10</option><option>11-16</option><option>17+</option></select></div>';
    html += '<div class="form-group"><label>Type</label><select><option>All</option><option>Aberration</option><option>Beast</option><option>Celestial</option><option>Construct</option><option>Dragon</option><option>Elemental</option><option>Fey</option><option>Fiend</option><option>Giant</option><option>Humanoid</option><option>Monstrosity</option><option>Ooze</option><option>Plant</option><option>Undead</option></select></div>';
    html += '</div>';
    SAMPLE_MONSTERS.forEach(m => {
      html += `<div class="stat-block" style="margin-bottom:12px;">
        <div class="stat-name">${m.name}</div>
        <div class="stat-type">${m.type}, CR ${m.cr}</div>
        <div class="stat-divider"></div>
        <div class="stat-row"><span class="stat-label">AC</span> ${m.ac} | <span class="stat-label">HP</span> ${m.hp} | <span class="stat-label">Speed</span> ${m.speed}</div>
        <div class="ability-scores" style="margin:6px 0;">
          ${[['STR',m.str],['DEX',m.dex],['CON',m.con],['INT',m.int],['WIS',m.wis],['CHA',m.cha]].map(([a,v]) =>
            `<div class="ability-score"><div class="score-label">${a}</div><div class="score-value" style="font-size:14px;">${v}</div><div class="score-mod">${modStr(v)}</div></div>`
          ).join('')}
        </div>
        <div class="stat-divider"></div>
        <div style="font-weight:700;color:var(--red);margin-bottom:4px;">Actions</div>
        ${m.actions.map(a => `<div style="font-size:12px;margin-bottom:2px;">• ${a}</div>`).join('')}
      </div>`;
    });
    return html;
  }

  function buildMonstersByType(type) {
    const filtered = SAMPLE_MONSTERS.filter(m => m.type.toLowerCase().includes(type));
    if (filtered.length === 0) return `<div style="color:var(--text2);text-align:center;padding:40px;">No sample monsters of type "${type}" in database. Use Custom Monster Creator to add them.</div>`;
    let html = '';
    filtered.forEach(m => {
      html += `<div class="stat-block" style="margin-bottom:12px;"><div class="stat-name">${m.name}</div><div class="stat-type">${m.type}, CR ${m.cr}</div>
        <div class="stat-divider"></div><div class="stat-row"><span class="stat-label">AC</span> ${m.ac} | <span class="stat-label">HP</span> ${m.hp}</div></div>`;
    });
    return html;
  }

  function buildStatBlockEditor() { return buildCustomMonster(); }

  function buildCRCalculator() {
    return `
      <div style="font-size:12px;color:var(--text2);margin-bottom:12px;">Calculate CR based on DMG guidelines: offensive CR (damage/attack bonus) averaged with defensive CR (HP/AC).</div>
      <div class="form-row">
        <div class="form-group"><label>Expected HP</label><input type="number" value="45" id="crHP"></div>
        <div class="form-group"><label>Armor Class</label><input type="number" value="13" id="crAC"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Damage/Round</label><input type="number" value="14" id="crDPR"></div>
        <div class="form-group"><label>Attack Bonus / Save DC</label><input type="number" value="4" id="crATK"></div>
      </div>
      <div style="background:#0a0a1a;padding:16px;border-radius:4px;margin:16px 0;text-align:center;">
        <div style="font-size:12px;color:var(--text2);margin-bottom:8px;">ESTIMATED CHALLENGE RATING</div>
        <div style="font-size:48px;font-weight:700;color:var(--accent);">CR 1</div>
        <div style="font-size:12px;color:var(--text2);margin-top:8px;">XP: 200 | Proficiency Bonus: +2</div>
      </div>
      <table class="ref-table">
        <tr><th>CR</th><th>Prof</th><th>AC</th><th>HP</th><th>Attack</th><th>Damage/Rd</th><th>Save DC</th><th>XP</th></tr>
        <tr><td>0</td><td>+2</td><td>≤13</td><td>1-6</td><td>≤3</td><td>0-1</td><td>≤13</td><td>10</td></tr>
        <tr><td>1/4</td><td>+2</td><td>13</td><td>36-49</td><td>3</td><td>2-3</td><td>13</td><td>50</td></tr>
        <tr><td>1/2</td><td>+2</td><td>13</td><td>50-70</td><td>3</td><td>4-5</td><td>13</td><td>100</td></tr>
        <tr><td>1</td><td>+2</td><td>13</td><td>71-85</td><td>3</td><td>6-8</td><td>13</td><td>200</td></tr>
        <tr><td>2</td><td>+2</td><td>13</td><td>86-100</td><td>3</td><td>9-14</td><td>13</td><td>450</td></tr>
        <tr><td>5</td><td>+3</td><td>15</td><td>131-145</td><td>6</td><td>27-32</td><td>15</td><td>1,800</td></tr>
        <tr><td>10</td><td>+4</td><td>17</td><td>206-220</td><td>7</td><td>63-68</td><td>16</td><td>5,900</td></tr>
        <tr><td>20</td><td>+6</td><td>19</td><td>401-445</td><td>10</td><td>132-140</td><td>19</td><td>25,000</td></tr>
      </table>
    `;
  }

  function buildCustomMonster() {
    return `
      <div class="form-row">
        <div class="form-group"><label>Name</label><input type="text" placeholder="Monster Name"></div>
        <div class="form-group"><label>Size</label><select><option>Tiny</option><option>Small</option><option selected>Medium</option><option>Large</option><option>Huge</option><option>Gargantuan</option></select></div>
        <div class="form-group"><label>Type</label><select><option>Aberration</option><option>Beast</option><option>Celestial</option><option>Construct</option><option>Dragon</option><option>Elemental</option><option>Fey</option><option>Fiend</option><option>Giant</option><option selected>Humanoid</option><option>Monstrosity</option><option>Ooze</option><option>Plant</option><option>Undead</option></select></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Alignment</label><select><option>Lawful Good</option><option>Neutral Good</option><option>Chaotic Good</option><option>Lawful Neutral</option><option selected>True Neutral</option><option>Chaotic Neutral</option><option>Lawful Evil</option><option>Neutral Evil</option><option>Chaotic Evil</option><option>Unaligned</option></select></div>
        <div class="form-group"><label>Challenge Rating</label><select><option>0</option><option>1/8</option><option>1/4</option><option>1/2</option><option selected>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option></select></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>AC</label><input type="number" value="13"></div>
        <div class="form-group"><label>HP</label><input type="number" value="22"></div>
        <div class="form-group"><label>Hit Dice</label><input type="text" value="3d8+6"></div>
        <div class="form-group"><label>Speed</label><input type="text" value="30 ft"></div>
      </div>
      <div style="font-size:11px;color:var(--accent);font-weight:600;margin:12px 0 8px;">ABILITY SCORES</div>
      <div class="ability-scores">
        ${['STR','DEX','CON','INT','WIS','CHA'].map(a =>
          `<div class="ability-score"><div class="score-label">${a}</div><input type="number" value="10" min="1" max="30" style="width:50px;text-align:center;font-size:16px;font-weight:700;background:#12122a;border:1px solid #3a3a5c;color:var(--text);border-radius:4px;padding:4px;"></div>`
        ).join('')}
      </div>
      <div class="form-group"><label>Actions (one per line)</label><textarea rows="3" placeholder="Longsword: +5 to hit, 1d8+3 slashing"></textarea></div>
      <div class="form-group"><label>Special Abilities</label><textarea rows="2" placeholder="Pack Tactics, Keen Senses, etc."></textarea></div>
      <div style="display:flex;gap:8px;margin-top:12px;">
        <button class="btn btn-primary">Save Monster</button>
        <button class="btn">Export to Game Data</button>
        <button class="btn">Preview Stat Block</button>
      </div>
    `;
  }

  function buildLegendaryActions() {
    return `
      <div class="form-group"><label>Monster Name</label><input type="text" placeholder="Ancient Red Dragon"></div>
      <div style="font-size:11px;color:var(--accent);font-weight:600;margin:12px 0 8px;">LEGENDARY ACTIONS (3/round)</div>
      <div class="form-group"><label>Description</label><textarea rows="2">The creature can take 3 legendary actions, choosing from the options below. Only one option can be used at a time and only at the end of another creature's turn. Spent legendary actions are regained at the start of each turn.</textarea></div>
      <table class="ref-table">
        <tr><th>Action</th><th>Cost</th><th>Description</th></tr>
        <tr><td><input type="text" value="Detect" style="background:#12122a;border:1px solid #3a3a5c;color:var(--text);padding:2px 6px;"></td><td>1</td><td><input type="text" value="Make a Wisdom (Perception) check" style="width:100%;background:#12122a;border:1px solid #3a3a5c;color:var(--text);padding:2px 6px;"></td></tr>
        <tr><td><input type="text" value="Tail Attack" style="background:#12122a;border:1px solid #3a3a5c;color:var(--text);padding:2px 6px;"></td><td>1</td><td><input type="text" value="Make a tail attack" style="width:100%;background:#12122a;border:1px solid #3a3a5c;color:var(--text);padding:2px 6px;"></td></tr>
        <tr><td><input type="text" value="Wing Attack" style="background:#12122a;border:1px solid #3a3a5c;color:var(--text);padding:2px 6px;"></td><td>2</td><td><input type="text" value="2d6+10 bludgeoning, DC 25 DEX or prone, dragon flies half speed" style="width:100%;background:#12122a;border:1px solid #3a3a5c;color:var(--text);padding:2px 6px;"></td></tr>
      </table>
      <div style="margin-top:12px;"><button class="btn">Add Legendary Action</button></div>
      <div style="font-size:11px;color:var(--accent);font-weight:600;margin:16px 0 8px;">LAIR ACTIONS (Initiative 20)</div>
      <div class="form-group"><label>Lair Actions (one per line)</label><textarea rows="3" placeholder="Magma erupts from a point on the ground, DC 15 DEX save or 21 (6d6) fire damage..."></textarea></div>
    `;
  }

  function buildEncounterBuilder() {
    return `
      <div class="form-row">
        <div class="form-group"><label>Party Size</label><input type="number" value="4" min="1" max="8"></div>
        <div class="form-group"><label>Party Level</label><input type="number" value="3" min="1" max="20"></div>
        <div class="form-group"><label>Difficulty</label><select><option>Easy</option><option selected>Medium</option><option>Hard</option><option>Deadly</option></select></div>
      </div>
      <div style="font-size:11px;color:var(--accent);font-weight:600;margin:12px 0 8px;">ENCOUNTER MONSTERS</div>
      <table class="ref-table">
        <tr><th>Monster</th><th>CR</th><th>XP</th><th>Count</th><th>Actions</th></tr>
        <tr><td>Goblin</td><td>1/4</td><td>50</td><td><input type="number" value="4" min="1" max="20" style="width:50px;background:#12122a;border:1px solid #3a3a5c;color:var(--text);padding:2px 4px;"></td><td><button class="btn btn-sm btn-danger">Remove</button></td></tr>
        <tr><td>Goblin Boss</td><td>1</td><td>200</td><td><input type="number" value="1" min="1" max="20" style="width:50px;background:#12122a;border:1px solid #3a3a5c;color:var(--text);padding:2px 4px;"></td><td><button class="btn btn-sm btn-danger">Remove</button></td></tr>
      </table>
      <div style="display:flex;gap:8px;margin:12px 0;"><button class="btn">Add Monster</button></div>
      <div style="background:#0a0a1a;padding:16px;border-radius:4px;">
        <div class="form-row">
          <div><span style="font-size:11px;color:var(--text2);">Total XP:</span> <span style="font-weight:700;color:var(--accent);">400</span></div>
          <div><span style="font-size:11px;color:var(--text2);">Adjusted XP (x2 multiplier):</span> <span style="font-weight:700;color:var(--yellow);">800</span></div>
          <div><span style="font-size:11px;color:var(--text2);">Difficulty:</span> <span style="font-weight:700;color:var(--yellow);">Hard</span></div>
        </div>
        <div style="margin-top:8px;font-size:11px;color:var(--text2);">
          Party thresholds: Easy 300 | Medium 600 | Hard 900 | Deadly 1,600
        </div>
      </div>
    `;
  }

  function buildInitiativeTracker() {
    return `
      <div style="display:flex;gap:8px;margin-bottom:12px;">
        <button class="btn btn-primary">Roll Initiative</button>
        <button class="btn">Next Turn</button>
        <button class="btn">Reset</button>
      </div>
      <table class="ref-table">
        <tr><th>Init</th><th>Name</th><th>AC</th><th>HP</th><th>Conditions</th><th>Notes</th></tr>
        <tr style="background:rgba(88,166,255,0.1);"><td style="font-weight:700;font-size:16px;">18</td><td style="font-weight:700;color:var(--green);">Player - Aldric</td><td>16</td><td>28/28</td><td>-</td><td>Warrior, Shield</td></tr>
        <tr><td style="font-weight:700;font-size:16px;">15</td><td style="color:var(--red);">Goblin 1</td><td>15</td><td>7/7</td><td>-</td><td>Scimitar</td></tr>
        <tr><td style="font-weight:700;font-size:16px;">14</td><td style="color:var(--red);">Goblin 2</td><td>15</td><td>7/7</td><td>-</td><td>Shortbow</td></tr>
        <tr><td style="font-weight:700;font-size:16px;">12</td><td style="color:var(--green);">Player - Elara</td><td>12</td><td>18/18</td><td>-</td><td>Mage</td></tr>
        <tr><td style="font-weight:700;font-size:16px;">8</td><td style="color:var(--red);">Goblin Boss</td><td>17</td><td>21/21</td><td>-</td><td>Multiattack</td></tr>
      </table>
      <div style="margin-top:12px;"><button class="btn">Add Combatant</button></div>
    `;
  }

  function buildDifficultyCalc() { return buildEncounterBuilder(); }
  function buildRandomEncounters() {
    return `
      <div class="form-row" style="margin-bottom:12px;">
        <div class="form-group"><label>Environment</label><select><option>Dungeon</option><option>Forest</option><option>Mountain</option><option>Swamp</option><option>Desert</option><option>Arctic</option><option>Coastal</option><option>Urban</option><option>Underdark</option></select></div>
        <div class="form-group"><label>Party Level</label><input type="number" value="3" min="1" max="20"></div>
        <div class="form-group" style="padding-top:18px;"><button class="btn btn-primary">Roll Encounter</button></div>
      </div>
      <div style="font-size:11px;color:var(--accent);font-weight:600;margin:12px 0 8px;">DUNGEON ENCOUNTER TABLE (Level 1-4)</div>
      <table class="ref-table">
        <tr><th>d20</th><th>Encounter</th><th>CR</th><th>Difficulty</th></tr>
        <tr><td>1-3</td><td>1d4 Rats</td><td>0</td><td style="color:var(--green);">Easy</td></tr>
        <tr><td>4-6</td><td>1d6 Goblins</td><td>1/4 each</td><td style="color:var(--green);">Easy-Medium</td></tr>
        <tr><td>7-9</td><td>2d4 Skeletons</td><td>1/4 each</td><td style="color:var(--yellow);">Medium</td></tr>
        <tr><td>10-12</td><td>1d4 Zombies + 1 Skeleton</td><td>1/4 each</td><td style="color:var(--yellow);">Medium</td></tr>
        <tr><td>13-15</td><td>1 Ogre</td><td>2</td><td style="color:var(--yellow);">Hard</td></tr>
        <tr><td>16-18</td><td>1 Gelatinous Cube</td><td>2</td><td style="color:var(--yellow);">Hard</td></tr>
        <tr><td>19</td><td>1d3 Shadows</td><td>1/2 each</td><td style="color:var(--red);">Hard</td></tr>
        <tr><td>20</td><td>1 Mimic</td><td>2</td><td style="color:var(--red);">Deadly</td></tr>
      </table>
    `;
  }
  function buildBossFight() { return buildEncounterBuilder(); }

  function buildWeaponEditor() {
    let html = '<input class="search-input" placeholder="Search weapons...">';
    html += '<table class="ref-table"><tr><th>Name</th><th>Type</th><th>Damage</th><th>Weight</th><th>Properties</th><th>Cost</th></tr>';
    WEAPONS.forEach(w => {
      html += `<tr><td style="font-weight:700;">${w.name}</td><td>${w.type}</td><td style="color:var(--red);">${w.damage}</td><td>${w.weight}</td><td style="font-size:11px;">${w.props}</td><td>${w.cost}</td></tr>`;
    });
    html += '</table>';
    html += '<div style="margin-top:12px;"><button class="btn btn-primary">Add Custom Weapon</button></div>';
    return html;
  }

  function buildArmorEditor() {
    let html = '<table class="ref-table"><tr><th>Name</th><th>Type</th><th>AC</th><th>STR Req</th><th>Stealth</th><th>Weight</th><th>Cost</th></tr>';
    ARMOR.forEach(a => {
      html += `<tr><td style="font-weight:700;">${a.name}</td><td>${a.type}</td><td style="color:var(--accent);">${a.ac}</td><td>${a.str}</td><td>${a.stealth}</td><td>${a.weight}</td><td>${a.cost}</td></tr>`;
    });
    html += '</table>';
    return html;
  }

  function buildMagicItemCreator() {
    return `
      <div class="form-row">
        <div class="form-group"><label>Item Name</label><input type="text" placeholder="Flame Tongue Sword"></div>
        <div class="form-group"><label>Rarity</label><select><option>Common</option><option>Uncommon</option><option selected>Rare</option><option>Very Rare</option><option>Legendary</option><option>Artifact</option></select></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Type</label><select><option>Weapon</option><option>Armor</option><option>Potion</option><option>Ring</option><option>Rod</option><option>Scroll</option><option>Staff</option><option>Wand</option><option>Wondrous Item</option></select></div>
        <div class="form-group"><label>Attunement</label><select><option selected>Requires Attunement</option><option>No Attunement</option><option>Attunement by Spellcaster</option><option>Attunement by Class</option></select></div>
      </div>
      <div class="form-group"><label>Description</label><textarea rows="3" placeholder="Describe the item's magical properties..."></textarea></div>
      <div class="form-group"><label>Mechanical Effects</label><textarea rows="2" placeholder="+1 to attack and damage, deals extra 2d6 fire damage on hit..."></textarea></div>
      <div style="display:flex;gap:8px;margin-top:12px;"><button class="btn btn-primary">Save Item</button><button class="btn">Export to Game Data</button></div>
    `;
  }

  function buildPotionBrewer() {
    const potions = [
      { name: 'Potion of Healing', rarity: 'Common', effect: 'Regain 2d4+2 HP', cost: '50 gp' },
      { name: 'Potion of Greater Healing', rarity: 'Uncommon', effect: 'Regain 4d4+4 HP', cost: '100 gp' },
      { name: 'Potion of Superior Healing', rarity: 'Rare', effect: 'Regain 8d4+8 HP', cost: '500 gp' },
      { name: 'Potion of Supreme Healing', rarity: 'Very Rare', effect: 'Regain 10d4+20 HP', cost: '5,000 gp' },
      { name: 'Potion of Fire Resistance', rarity: 'Uncommon', effect: 'Fire resistance for 1 hour', cost: '300 gp' },
      { name: 'Potion of Invisibility', rarity: 'Very Rare', effect: 'Invisible for 1 hour', cost: '5,000 gp' },
      { name: 'Potion of Speed', rarity: 'Very Rare', effect: 'Haste for 1 minute', cost: '5,000 gp' },
      { name: 'Potion of Giant Strength (Hill)', rarity: 'Uncommon', effect: 'STR 21 for 1 hour', cost: '500 gp' },
    ];
    let html = '<table class="ref-table"><tr><th>Potion</th><th>Rarity</th><th>Effect</th><th>Cost</th></tr>';
    potions.forEach(p => { html += `<tr><td style="font-weight:700;">${p.name}</td><td>${p.rarity}</td><td>${p.effect}</td><td>${p.cost}</td></tr>`; });
    html += '</table>';
    html += '<div style="margin-top:12px;"><button class="btn btn-primary">Create Custom Potion</button></div>';
    return html;
  }

  function buildScrollScriber() {
    return `
      <div class="form-row">
        <div class="form-group"><label>Spell</label><select><option>Select spell...</option>${SPELLS_SAMPLE.map(s => `<option>${s.name} (Level ${s.level})</option>`).join('')}</select></div>
        <div class="form-group"><label>Scroll Level</label><select><option>Cantrip</option><option>1st</option><option>2nd</option><option selected>3rd</option><option>4th</option><option>5th</option></select></div>
      </div>
      <table class="ref-table" style="margin-top:12px;">
        <tr><th>Spell Level</th><th>Rarity</th><th>Save DC</th><th>Attack Bonus</th><th>Cost</th><th>Crafting Time</th></tr>
        <tr><td>Cantrip</td><td>Common</td><td>13</td><td>+5</td><td>15 gp</td><td>1 day</td></tr>
        <tr><td>1st</td><td>Common</td><td>13</td><td>+5</td><td>25 gp</td><td>1 day</td></tr>
        <tr><td>2nd</td><td>Uncommon</td><td>13</td><td>+5</td><td>250 gp</td><td>3 days</td></tr>
        <tr><td>3rd</td><td>Uncommon</td><td>15</td><td>+7</td><td>500 gp</td><td>1 week</td></tr>
        <tr><td>4th</td><td>Rare</td><td>15</td><td>+7</td><td>2,500 gp</td><td>2 weeks</td></tr>
        <tr><td>5th</td><td>Rare</td><td>17</td><td>+9</td><td>5,000 gp</td><td>4 weeks</td></tr>
      </table>
    `;
  }

  function buildTreasureGen() {
    return `
      <div class="form-row" style="margin-bottom:12px;">
        <div class="form-group"><label>CR Range</label><select><option selected>CR 0-4</option><option>CR 5-10</option><option>CR 11-16</option><option>CR 17+</option></select></div>
        <div class="form-group"><label>Treasure Type</label><select><option>Individual</option><option selected>Hoard</option></select></div>
        <div class="form-group" style="padding-top:18px;"><button class="btn btn-primary">Generate Treasure</button></div>
      </div>
      <div style="background:#0a0a1a;padding:16px;border-radius:4px;margin:12px 0;">
        <div style="font-size:14px;font-weight:700;color:var(--yellow);margin-bottom:12px;">Treasure Hoard (CR 0-4)</div>
        <div style="font-size:13px;color:var(--text);line-height:2;">
          <div>💰 <strong>6d6 x 100</strong> copper pieces (avg 2,100)</div>
          <div>💰 <strong>3d6 x 100</strong> silver pieces (avg 1,050)</div>
          <div>💰 <strong>2d6 x 10</strong> gold pieces (avg 70)</div>
          <div style="margin-top:8px;">🎲 Roll d100 for magic items:</div>
          <div style="padding-left:12px;font-size:12px;color:var(--text2);">
            01-06: Nothing<br>
            07-26: 1d6 gems (10 gp each)<br>
            27-36: 1d4 art objects (25 gp each)<br>
            37-44: Roll 1d6 on Magic Item Table A<br>
            45-52: Roll 1d4 on Magic Item Table B<br>
          </div>
        </div>
      </div>
    `;
  }

  function buildShopInventory() {
    return `
      <div class="form-group"><label>Shop Name</label><input type="text" value="The Rusty Shield"></div>
      <div class="form-group"><label>Shop Type</label><select><option>General Store</option><option selected>Weapons & Armor</option><option>Magic Items</option><option>Potions & Scrolls</option><option>Adventuring Gear</option></select></div>
      <table class="ref-table">
        <tr><th>Item</th><th>Stock</th><th>Price</th><th>Actions</th></tr>
        <tr><td>Longsword</td><td>3</td><td>15 gp</td><td><button class="btn btn-sm">Edit</button></td></tr>
        <tr><td>Chain Mail</td><td>1</td><td>75 gp</td><td><button class="btn btn-sm">Edit</button></td></tr>
        <tr><td>Shield</td><td>5</td><td>10 gp</td><td><button class="btn btn-sm">Edit</button></td></tr>
        <tr><td>Potion of Healing</td><td>8</td><td>50 gp</td><td><button class="btn btn-sm">Edit</button></td></tr>
        <tr><td>Shortbow</td><td>2</td><td>25 gp</td><td><button class="btn btn-sm">Edit</button></td></tr>
        <tr><td>Arrows (20)</td><td>10</td><td>1 gp</td><td><button class="btn btn-sm">Edit</button></td></tr>
      </table>
      <div style="margin-top:12px;"><button class="btn btn-primary">Add Item</button> <button class="btn">Generate Random Stock</button></div>
    `;
  }

  function buildSpellDatabase() {
    let html = '<input class="search-input" placeholder="Search spells by name...">';
    html += '<div class="form-row" style="margin-bottom:12px;">';
    html += '<div class="form-group"><label>Level</label><select><option>All</option><option>Cantrip</option><option>1st</option><option>2nd</option><option>3rd</option><option>4th</option><option>5th</option><option>6th</option><option>7th</option><option>8th</option><option>9th</option></select></div>';
    html += '<div class="form-group"><label>School</label><select><option>All</option><option>Abjuration</option><option>Conjuration</option><option>Divination</option><option>Enchantment</option><option>Evocation</option><option>Illusion</option><option>Necromancy</option><option>Transmutation</option></select></div>';
    html += '<div class="form-group"><label>Class</label><select><option>All</option><option>Bard</option><option>Cleric</option><option>Druid</option><option>Paladin</option><option>Ranger</option><option>Sorcerer</option><option>Warlock</option><option>Wizard</option></select></div>';
    html += '</div>';
    SPELLS_SAMPLE.forEach(s => {
      html += `<div class="stat-block" style="margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;">
          <div class="stat-name" style="font-size:14px;">${s.name}</div>
          <div style="font-size:11px;color:var(--text2);">${s.level === 0 ? 'Cantrip' : 'Level ' + s.level} ${s.school}</div>
        </div>
        <div style="font-size:11px;color:var(--text2);margin:4px 0;">
          <strong>Casting Time:</strong> ${s.time} | <strong>Range:</strong> ${s.range} | <strong>Components:</strong> ${s.comp} | <strong>Duration:</strong> ${s.dur}
        </div>
        <div style="font-size:12px;color:var(--text);margin-top:4px;">${s.desc}</div>
        <div style="font-size:10px;color:var(--accent);margin-top:4px;">Classes: ${s.classes.join(', ')}</div>
      </div>`;
    });
    return html;
  }

  function buildSpellCreator() {
    return `
      <div class="form-row">
        <div class="form-group"><label>Spell Name</label><input type="text" placeholder="Custom Spell Name"></div>
        <div class="form-group"><label>Level</label><select><option>Cantrip</option><option selected>1st</option><option>2nd</option><option>3rd</option><option>4th</option><option>5th</option><option>6th</option><option>7th</option><option>8th</option><option>9th</option></select></div>
        <div class="form-group"><label>School</label><select><option>Abjuration</option><option>Conjuration</option><option>Divination</option><option>Enchantment</option><option selected>Evocation</option><option>Illusion</option><option>Necromancy</option><option>Transmutation</option></select></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Casting Time</label><select><option selected>1 action</option><option>1 bonus action</option><option>1 reaction</option><option>1 minute</option><option>10 minutes</option><option>1 hour</option></select></div>
        <div class="form-group"><label>Range</label><input type="text" value="60 ft"></div>
        <div class="form-group"><label>Duration</label><select><option selected>Instantaneous</option><option>1 round</option><option>1 minute</option><option>10 minutes</option><option>1 hour</option><option>Concentration, 1 minute</option><option>Concentration, 1 hour</option></select></div>
      </div>
      <div class="form-group"><label>Components</label>
        <div style="display:flex;gap:12px;font-size:12px;color:var(--text);">
          <label><input type="checkbox" checked> Verbal (V)</label>
          <label><input type="checkbox" checked> Somatic (S)</label>
          <label><input type="checkbox"> Material (M)</label>
        </div>
      </div>
      <div class="form-group"><label>Description</label><textarea rows="4" placeholder="Describe the spell's effect..."></textarea></div>
      <div class="form-group"><label>At Higher Levels</label><textarea rows="2" placeholder="When cast with a higher level slot..."></textarea></div>
      <div class="form-group"><label>Available to Classes</label>
        <div style="display:flex;gap:12px;flex-wrap:wrap;font-size:12px;color:var(--text);">
          <label><input type="checkbox"> Bard</label><label><input type="checkbox"> Cleric</label><label><input type="checkbox"> Druid</label>
          <label><input type="checkbox"> Paladin</label><label><input type="checkbox"> Ranger</label><label><input type="checkbox" checked> Sorcerer</label>
          <label><input type="checkbox"> Warlock</label><label><input type="checkbox" checked> Wizard</label>
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-top:12px;"><button class="btn btn-primary">Save Spell</button><button class="btn">Export to Game Data</button></div>
    `;
  }

  function buildSpellSlots() {
    const slots = [[2],[3],[4,2],[4,3],[4,3,2],[4,3,3],[4,3,3,1],[4,3,3,2],[4,3,3,3,1],[4,3,3,3,2],[4,3,3,3,2,1],[4,3,3,3,2,1],[4,3,3,3,2,1,1],[4,3,3,3,2,1,1],[4,3,3,3,2,1,1,1],[4,3,3,3,2,1,1,1],[4,3,3,3,2,1,1,1,1],[4,3,3,3,3,1,1,1,1],[4,3,3,3,3,2,1,1,1],[4,3,3,3,3,2,2,1,1]];
    return `
      <div class="form-row" style="margin-bottom:12px;">
        <div class="form-group"><label>Class</label><select><option>Wizard</option><option>Sorcerer</option><option>Cleric</option><option>Druid</option><option>Bard</option></select></div>
        <div class="form-group"><label>Level</label><input type="number" value="5" min="1" max="20"></div>
      </div>
      <div style="font-size:11px;color:var(--accent);font-weight:600;margin:8px 0;">SPELL SLOTS (Level 5 Full Caster)</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin:12px 0;">
        ${[1,2,3].map(lvl => {
          const max = [4,3,2][lvl-1];
          return `<div style="background:#1a1a36;border:1px solid #3a3a5c;border-radius:6px;padding:10px;text-align:center;min-width:80px;">
            <div style="font-size:10px;color:var(--text2);margin-bottom:4px;">Level ${lvl}</div>
            <div style="display:flex;gap:4px;justify-content:center;">
              ${Array(max).fill(0).map(() => `<div style="width:16px;height:16px;border-radius:50%;background:var(--accent);border:1px solid var(--accent);cursor:pointer;"></div>`).join('')}
            </div>
            <div style="font-size:10px;color:var(--text2);margin-top:4px;">${max}/${max}</div>
          </div>`;
        }).join('')}
      </div>
      <div style="font-size:11px;color:var(--text2);">Click slots to mark as used. Slots recover on long rest (short rest for Warlock Pact Magic).</div>
    `;
  }

  function buildConcentration() {
    return `
      <div style="font-size:12px;color:var(--text2);margin-bottom:12px;">
        Concentration: Only one concentration spell at a time. Taking damage requires a CON save (DC 10 or half damage, whichever is higher).
      </div>
      <div class="form-group"><label>Active Concentration Spell</label>
        <select><option>None</option>${SPELLS_SAMPLE.filter(s=>s.dur.includes('oncentration')||false).map(s=>`<option>${s.name}</option>`).join('')}<option>Bless</option><option>Hex</option><option>Hunter's Mark</option><option>Hold Person</option><option>Haste</option></select>
      </div>
      <div class="form-group"><label>Duration Remaining</label><input type="text" value="10 rounds"></div>
      <div class="form-row">
        <div class="form-group"><label>CON Save Modifier</label><input type="number" value="3"></div>
        <div class="form-group"><label>Damage Taken</label><input type="number" value="0"></div>
        <div class="form-group"><label>Save DC</label><input type="text" value="10" readonly></div>
      </div>
      <div style="margin-top:12px;"><button class="btn btn-primary">Roll Concentration Save</button></div>
    `;
  }

  function buildDungeonGen() {
    return `
      <div class="form-row">
        <div class="form-group"><label>Dungeon Size</label><select><option>Small (5-8 rooms)</option><option selected>Medium (9-15 rooms)</option><option>Large (16-25 rooms)</option></select></div>
        <div class="form-group"><label>Theme</label><select><option>Classic Dungeon</option><option>Cave System</option><option>Crypt/Tomb</option><option>Temple</option><option>Sewer</option><option>Tower</option><option>Castle</option></select></div>
        <div class="form-group"><label>Difficulty</label><select><option>Low (CR 0-2)</option><option selected>Medium (CR 2-5)</option><option>High (CR 5-10)</option></select></div>
      </div>
      <div style="text-align:center;margin:16px 0;"><button class="btn btn-primary">Generate Dungeon</button></div>
      <div style="background:#0a0a1a;padding:16px;border-radius:4px;">
        <div style="font-size:14px;font-weight:700;color:var(--accent);margin-bottom:8px;">Generated Dungeon: The Forgotten Crypt</div>
        <div style="font-size:12px;color:var(--text);line-height:1.8;">
          <strong>Floor 1 - 12 rooms</strong><br>
          Room 1: Entrance Hall (20x30 ft) - 2 Skeletons guard the door<br>
          Room 2: Corridor (10x40 ft) - Pit trap (DC 13, 2d6 fall)<br>
          Room 3: Guard Room (15x15 ft) - 3 Goblins, chest with 25 gp<br>
          Room 4: Storage (10x10 ft) - Crates, barrels, 1d4 rations<br>
          Room 5: Crypt Chamber (25x25 ft) - 4 Zombies, sarcophagus<br>
          Room 6: Secret Passage - DC 15 Investigation to find<br>
          Room 7: Treasure Room (15x15 ft) - Locked (DC 14), Potion of Healing, 50 gp<br>
          Room 8: Boss Chamber (30x30 ft) - Wight (CR 3), Longsword +1<br>
        </div>
      </div>
      <div style="margin-top:12px;"><button class="btn">Export Map Data</button> <button class="btn">Export to Game</button></div>
    `;
  }

  function buildRoomEditor() {
    return `
      <div class="form-row">
        <div class="form-group"><label>Room Name</label><input type="text" value="Guard Chamber"></div>
        <div class="form-group"><label>Room Type</label><select><option>Combat</option><option>Puzzle</option><option>Treasure</option><option>Trap</option><option>Rest</option><option>Boss</option><option>Corridor</option></select></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Width (ft)</label><input type="number" value="20"></div>
        <div class="form-group"><label>Height (ft)</label><input type="number" value="20"></div>
        <div class="form-group"><label>Lighting</label><select><option>Bright</option><option selected>Dim</option><option>Darkness</option></select></div>
      </div>
      <div class="form-group"><label>Description</label><textarea rows="2" placeholder="Describe the room...">A dusty stone chamber with crumbling pillars. Torches flicker on the walls.</textarea></div>
      <div class="form-group"><label>Monsters</label><textarea rows="2" placeholder="List monsters...">2x Skeleton (CR 1/4)\n1x Skeleton Archer (CR 1/4)</textarea></div>
      <div class="form-group"><label>Treasure</label><textarea rows="2" placeholder="List treasure...">Chest: 15 gp, 30 sp, Potion of Healing</textarea></div>
      <div class="form-group"><label>Exits</label><input type="text" value="North: Room 3, East: Room 5 (locked DC 12)"></div>
    `;
  }

  function buildTrapDesigner() {
    const traps = [
      { name: 'Pit Trap', dc: 10, damage: '1d10 falling', severity: 'Setback' },
      { name: 'Poison Dart', dc: 12, damage: '1d4 piercing + 2d6 poison', severity: 'Setback' },
      { name: 'Falling Net', dc: 11, damage: 'Restrained', severity: 'Setback' },
      { name: 'Poison Needle', dc: 15, damage: '1 piercing + 4d6 poison', severity: 'Dangerous' },
      { name: 'Fire Trap', dc: 14, damage: '4d10 fire', severity: 'Dangerous' },
      { name: 'Collapsing Room', dc: 16, damage: '4d10 bludgeoning', severity: 'Deadly' },
      { name: 'Sphere of Annihilation', dc: 20, damage: '10d10 force', severity: 'Deadly' },
    ];
    let html = '<table class="ref-table"><tr><th>Trap</th><th>Save DC</th><th>Damage/Effect</th><th>Severity</th></tr>';
    traps.forEach(t => {
      const color = t.severity === 'Setback' ? 'var(--green)' : t.severity === 'Dangerous' ? 'var(--yellow)' : 'var(--red)';
      html += `<tr><td style="font-weight:700;">${t.name}</td><td>${t.dc}</td><td>${t.damage}</td><td style="color:${color};">${t.severity}</td></tr>`;
    });
    html += '</table>';
    html += `<div style="margin-top:16px;font-size:12px;color:var(--text2);">
      <strong>Trap DCs by severity:</strong> Setback: DC 10-11 | Dangerous: DC 12-15 | Deadly: DC 16-20<br>
      <strong>Attack bonus:</strong> Setback: +3-5 | Dangerous: +6-8 | Deadly: +9-12
    </div>`;
    html += '<div style="margin-top:12px;"><button class="btn btn-primary">Create Custom Trap</button></div>';
    return html;
  }

  function buildPuzzleCreator() {
    return `
      <div class="form-group"><label>Puzzle Name</label><input type="text" placeholder="Riddle of the Sphinx"></div>
      <div class="form-row">
        <div class="form-group"><label>Difficulty</label><select><option>Easy (DC 10)</option><option selected>Medium (DC 15)</option><option>Hard (DC 20)</option></select></div>
        <div class="form-group"><label>Type</label><select><option selected>Riddle</option><option>Logic</option><option>Pattern</option><option>Physical</option><option>Combination</option></select></div>
      </div>
      <div class="form-group"><label>Puzzle Description (shown to players)</label><textarea rows="3" placeholder="An inscription on the wall reads..."></textarea></div>
      <div class="form-group"><label>Solution</label><textarea rows="2" placeholder="The answer is..."></textarea></div>
      <div class="form-group"><label>Hint (on failed check)</label><textarea rows="2" placeholder="If they fail, provide this hint..."></textarea></div>
      <div class="form-group"><label>Reward for Solving</label><input type="text" placeholder="Door opens, treasure revealed, etc."></div>
      <div class="form-group"><label>Consequence for Failure</label><input type="text" placeholder="Trap activates, monster appears, etc."></div>
    `;
  }

  function buildNPCGen() {
    return `
      <div style="display:flex;gap:8px;margin-bottom:16px;"><button class="btn btn-primary">Generate Random NPC</button></div>
      <div class="stat-block">
        <div class="stat-name">Theron Blackwood</div>
        <div class="stat-type">Male Human Merchant, Neutral Good</div>
        <div class="stat-divider"></div>
        <div><strong>Appearance:</strong> Tall, weathered face, salt-and-pepper beard, worn traveling clothes</div>
        <div><strong>Personality:</strong> Jovial and talkative, always has a story to share</div>
        <div><strong>Ideal:</strong> "Fair trade benefits everyone"</div>
        <div><strong>Bond:</strong> Searching for his missing daughter who disappeared in the dungeon</div>
        <div><strong>Flaw:</strong> Can never resist a good gamble</div>
        <div class="stat-divider"></div>
        <div><strong>Role:</strong> Quest giver, merchant, information source</div>
        <div><strong>Location:</strong> The Rusty Shield tavern, Floor 1 safe room</div>
        <div><strong>Quest:</strong> "Find my daughter Lyra in the dungeon depths"</div>
        <div><strong>Reward:</strong> 100 gp, Potion of Greater Healing, map to secret room</div>
      </div>
    `;
  }

  function buildFactionManager() {
    return `
      <table class="ref-table">
        <tr><th>Faction</th><th>Alignment</th><th>Reputation</th><th>Leader</th><th>Territory</th></tr>
        <tr><td style="font-weight:700;color:var(--green);">Order of the Silver Shield</td><td>Lawful Good</td><td>Friendly</td><td>Commander Aldara</td><td>Floors 1-2</td></tr>
        <tr><td style="font-weight:700;color:var(--text);">Merchant's Guild</td><td>True Neutral</td><td>Neutral</td><td>Guildmaster Voss</td><td>Safe Rooms</td></tr>
        <tr><td style="font-weight:700;color:var(--red);">Goblin Warband</td><td>Chaotic Evil</td><td>Hostile</td><td>Warchief Grak</td><td>Floors 2-3</td></tr>
        <tr><td style="font-weight:700;color:var(--purple);">Cult of the Dragon</td><td>Neutral Evil</td><td>Hostile</td><td>High Priest Malachar</td><td>Floors 6-8</td></tr>
        <tr><td style="font-weight:700;color:var(--yellow);">Thieves' Network</td><td>Chaotic Neutral</td><td>Neutral</td><td>The Shadow</td><td>Hidden passages</td></tr>
      </table>
      <div style="margin-top:12px;"><button class="btn btn-primary">Add Faction</button></div>
    `;
  }

  function buildCalendar() {
    return `
      <div class="form-row">
        <div class="form-group"><label>Calendar System</label><select><option selected>Harptos (Forgotten Realms)</option><option>Greyhawk</option><option>Custom</option></select></div>
        <div class="form-group"><label>Current Date</label><input type="text" value="15 Mirtul, 1492 DR"></div>
      </div>
      <div style="font-size:12px;color:var(--text2);margin:12px 0;">Harptos Calendar: 12 months of 30 days + 5 festival days = 365 days/year</div>
      <table class="ref-table">
        <tr><th>Month</th><th>Name</th><th>Common Name</th><th>Days</th></tr>
        <tr><td>1</td><td>Hammer</td><td>Deepwinter</td><td>30</td></tr>
        <tr><td>-</td><td colspan="2" style="color:var(--yellow);">Midwinter (festival)</td><td>1</td></tr>
        <tr><td>2</td><td>Alturiak</td><td>The Claw of Winter</td><td>30</td></tr>
        <tr><td>3</td><td>Ches</td><td>The Claw of Sunsets</td><td>30</td></tr>
        <tr><td>4</td><td>Tarsakh</td><td>The Claw of Storms</td><td>30</td></tr>
        <tr><td>-</td><td colspan="2" style="color:var(--yellow);">Greengrass (festival)</td><td>1</td></tr>
        <tr><td>5</td><td style="color:var(--accent);">Mirtul</td><td>The Melting</td><td>30</td></tr>
        <tr><td>6</td><td>Kythorn</td><td>The Time of Flowers</td><td>30</td></tr>
        <tr><td>7</td><td>Flamerule</td><td>Summertide</td><td>30</td></tr>
      </table>
    `;
  }

  function buildWeather() {
    return `
      <div class="form-row">
        <div class="form-group"><label>Season</label><select><option>Spring</option><option selected>Summer</option><option>Autumn</option><option>Winter</option></select></div>
        <div class="form-group"><label>Terrain</label><select><option selected>Temperate</option><option>Arctic</option><option>Desert</option><option>Tropical</option><option>Underground</option></select></div>
        <div class="form-group" style="padding-top:18px;"><button class="btn btn-primary">Roll Weather</button></div>
      </div>
      <div style="background:#0a0a1a;padding:16px;border-radius:4px;margin:12px 0;text-align:center;">
        <div style="font-size:36px;">☀️</div>
        <div style="font-size:16px;font-weight:700;color:var(--accent);margin:8px 0;">Clear Skies</div>
        <div style="font-size:12px;color:var(--text2);">Temperature: 75°F (24°C) | Wind: Light breeze | Visibility: Normal</div>
      </div>
      <table class="ref-table">
        <tr><th>d20</th><th>Weather</th><th>Effect</th></tr>
        <tr><td>1-14</td><td>Normal for season</td><td>No effect</td></tr>
        <tr><td>15-17</td><td>1d4×10°F colder/hotter</td><td>Extreme heat/cold rules may apply</td></tr>
        <tr><td>18-20</td><td>Precipitation</td><td>Light/heavy rain/snow, fog</td></tr>
      </table>
    `;
  }

  function buildCombatRef() {
    return `
      <div style="font-size:12px;line-height:1.8;color:var(--text);">
        <h3 style="color:var(--accent);margin-bottom:8px;">Combat Round Structure</h3>
        <ol style="padding-left:20px;margin-bottom:16px;">
          <li><strong>Determine Surprise</strong> - DM determines if anyone is surprised</li>
          <li><strong>Establish Positions</strong> - DM decides where creatures are</li>
          <li><strong>Roll Initiative</strong> - d20 + DEX modifier for each combatant</li>
          <li><strong>Take Turns</strong> - Each combatant takes a turn in initiative order</li>
          <li><strong>Begin Next Round</strong> - Repeat step 4 until combat ends</li>
        </ol>
        <h3 style="color:var(--accent);margin-bottom:8px;">Your Turn</h3>
        <ul style="padding-left:20px;margin-bottom:16px;">
          <li><strong>Move</strong> - Up to your speed in feet</li>
          <li><strong>Action</strong> - Attack, Cast Spell, Dash, Disengage, Dodge, Help, Hide, Ready, Search, Use Object</li>
          <li><strong>Bonus Action</strong> - If you have a feature/spell that uses one</li>
          <li><strong>Free Interaction</strong> - Draw/sheathe weapon, open door, speak briefly</li>
        </ul>
        <h3 style="color:var(--accent);margin-bottom:8px;">Attack Rolls</h3>
        <div style="margin-bottom:16px;">
          <strong>Melee:</strong> d20 + STR modifier + proficiency bonus<br>
          <strong>Ranged:</strong> d20 + DEX modifier + proficiency bonus<br>
          <strong>Finesse:</strong> Choose STR or DEX<br>
          <strong>Natural 20:</strong> Critical hit (double damage dice)<br>
          <strong>Natural 1:</strong> Automatic miss
        </div>
        <h3 style="color:var(--accent);margin-bottom:8px;">Damage</h3>
        <div>Roll damage dice + ability modifier. Critical hits: roll damage dice twice. Resistance: half damage. Vulnerability: double damage. Immunity: no damage.</div>
      </div>
    `;
  }

  function buildConditionsRef() {
    let html = '';
    CONDITIONS.forEach(c => {
      html += `<div class="stat-block" style="margin-bottom:8px;">
        <div class="stat-name" style="font-size:14px;">${c.name}</div>
        ${c.effects.map(e => `<div style="font-size:12px;margin:2px 0;">• ${e}</div>`).join('')}
      </div>`;
    });
    return html;
  }

  function buildActionsRef() {
    const actions = [
      { name: 'Attack', desc: 'Make one melee or ranged attack (more with Extra Attack feature)' },
      { name: 'Cast a Spell', desc: 'Cast a spell with casting time of 1 action' },
      { name: 'Dash', desc: 'Gain extra movement equal to your speed for the current turn' },
      { name: 'Disengage', desc: 'Your movement doesn\'t provoke opportunity attacks for the rest of the turn' },
      { name: 'Dodge', desc: 'Until next turn, attacks against you have disadvantage (if you can see attacker), DEX saves have advantage' },
      { name: 'Help', desc: 'Give an ally advantage on their next ability check or attack roll against a target within 5 ft of you' },
      { name: 'Hide', desc: 'Make a Dexterity (Stealth) check to become hidden' },
      { name: 'Ready', desc: 'Prepare an action to trigger on a specific condition (uses your reaction)' },
      { name: 'Search', desc: 'Make a Wisdom (Perception) or Intelligence (Investigation) check' },
      { name: 'Use an Object', desc: 'Interact with a second object (first is free), drink potion, etc.' },
      { name: 'Grapple (special attack)', desc: 'Replace one attack with Athletics vs Athletics/Acrobatics contest. Target\'s speed becomes 0.' },
      { name: 'Shove (special attack)', desc: 'Replace one attack with Athletics vs Athletics/Acrobatics contest. Push 5 ft or knock prone.' },
    ];
    let html = '<table class="ref-table"><tr><th>Action</th><th>Description</th></tr>';
    actions.forEach(a => { html += `<tr><td style="font-weight:700;white-space:nowrap;">${a.name}</td><td style="font-size:12px;">${a.desc}</td></tr>`; });
    html += '</table>';
    html += `<div style="margin-top:16px;font-size:12px;color:var(--text);">
      <h3 style="color:var(--accent);margin-bottom:8px;">Reactions</h3>
      <strong>Opportunity Attack:</strong> When a hostile creature you can see moves out of your reach, you can use your reaction to make one melee attack against it.
    </div>`;
    return html;
  }

  function buildMovementRef() {
    return `
      <table class="ref-table">
        <tr><th>Movement Type</th><th>Description</th></tr>
        <tr><td>Walking</td><td>Normal speed (usually 25-30 ft)</td></tr>
        <tr><td>Difficult Terrain</td><td>Costs 2 ft of movement per 1 ft moved</td></tr>
        <tr><td>Climbing</td><td>Costs 2 ft per 1 ft (unless climbing speed)</td></tr>
        <tr><td>Swimming</td><td>Costs 2 ft per 1 ft (unless swimming speed)</td></tr>
        <tr><td>Crawling</td><td>Costs 2 ft per 1 ft</td></tr>
        <tr><td>Jumping (Long)</td><td>Running: STR score ft. Standing: half</td></tr>
        <tr><td>Jumping (High)</td><td>Running: 3 + STR mod ft. Standing: half</td></tr>
      </table>
      <h3 style="color:var(--accent);margin:16px 0 8px;">Travel Pace</h3>
      <table class="ref-table">
        <tr><th>Pace</th><th>Per Minute</th><th>Per Hour</th><th>Per Day</th><th>Effect</th></tr>
        <tr><td>Fast</td><td>400 ft</td><td>4 miles</td><td>30 miles</td><td>-5 passive Perception</td></tr>
        <tr><td>Normal</td><td>300 ft</td><td>3 miles</td><td>24 miles</td><td>-</td></tr>
        <tr><td>Slow</td><td>200 ft</td><td>2 miles</td><td>18 miles</td><td>Can use Stealth</td></tr>
      </table>
    `;
  }

  function buildRestingRef() {
    return `
      <div class="stat-block" style="margin-bottom:12px;">
        <div class="stat-name" style="font-size:14px;">Short Rest</div>
        <div class="stat-divider"></div>
        <div style="font-size:12px;line-height:1.8;">
          <strong>Duration:</strong> At least 1 hour<br>
          <strong>Activity:</strong> Eating, drinking, reading, tending wounds (no strenuous activity)<br>
          <strong>Recovery:</strong> Spend Hit Dice to regain HP (roll HD + CON modifier each)<br>
          <strong>Class Features:</strong> Warlock Pact Magic slots, Fighter Action Surge, Monk Ki points, etc.<br>
          <strong>Interrupted by:</strong> Combat, casting spells, 1+ hours of walking, similar adventuring activity
        </div>
      </div>
      <div class="stat-block">
        <div class="stat-name" style="font-size:14px;">Long Rest</div>
        <div class="stat-divider"></div>
        <div style="font-size:12px;line-height:1.8;">
          <strong>Duration:</strong> At least 8 hours<br>
          <strong>Activity:</strong> Sleep for 6+ hours, light activity for 2 hours (reading, talking, eating, keeping watch)<br>
          <strong>Recovery:</strong> Regain all HP, regain spent Hit Dice (up to half your total), regain all spell slots<br>
          <strong>Limit:</strong> Max 1 long rest per 24 hours, must have at least 1 HP to benefit<br>
          <strong>Interrupted by:</strong> 1+ hours of walking, fighting, casting spells, similar adventuring activity
        </div>
      </div>
    `;
  }

  function buildDeathRef() {
    return `
      <div style="font-size:12px;line-height:1.8;color:var(--text);">
        <h3 style="color:var(--red);margin-bottom:8px;">Dropping to 0 Hit Points</h3>
        <p>When you drop to 0 HP, you either die outright or fall unconscious.</p>
        <h3 style="color:var(--red);margin:12px 0 8px;">Instant Death</h3>
        <p>If remaining damage after reaching 0 HP equals or exceeds your HP maximum, you die instantly.</p>
        <h3 style="color:var(--red);margin:12px 0 8px;">Death Saving Throws</h3>
        <p>At the start of each turn while at 0 HP, roll a d20:</p>
        <ul style="padding-left:20px;">
          <li><strong>10 or higher:</strong> One success</li>
          <li><strong>9 or lower:</strong> One failure</li>
          <li><strong>Natural 1:</strong> TWO failures</li>
          <li><strong>Natural 20:</strong> Regain 1 HP and wake up!</li>
          <li><strong>3 Successes:</strong> Stabilized (unconscious, no more saves)</li>
          <li><strong>3 Failures:</strong> You die</li>
        </ul>
        <h3 style="color:var(--red);margin:12px 0 8px;">Damage at 0 HP</h3>
        <p>Any damage while at 0 HP = 1 death save failure. Critical hit = 2 failures. Damage ≥ max HP = instant death.</p>
        <h3 style="color:var(--green);margin:12px 0 8px;">Stabilizing</h3>
        <p>DC 10 Wisdom (Medicine) check, or any amount of healing brings the creature back to consciousness.</p>
      </div>
    `;
  }

  function buildSkillsRef() {
    const skills = [
      { name: 'Acrobatics', ability: 'DEX', examples: 'Balance, tumble, dive, flip, escape bonds' },
      { name: 'Animal Handling', ability: 'WIS', examples: 'Calm animal, control mount, intuit animal intent' },
      { name: 'Arcana', ability: 'INT', examples: 'Recall lore about magic, spells, magical items, planes' },
      { name: 'Athletics', ability: 'STR', examples: 'Climb, swim, jump, grapple, shove' },
      { name: 'Deception', ability: 'CHA', examples: 'Lie, disguise, mislead, fast-talk, con' },
      { name: 'History', ability: 'INT', examples: 'Recall historical events, civilizations, wars, legends' },
      { name: 'Insight', ability: 'WIS', examples: 'Determine true intentions, detect lies, read body language' },
      { name: 'Intimidation', ability: 'CHA', examples: 'Threaten, coerce, bully, hostile persuasion' },
      { name: 'Investigation', ability: 'INT', examples: 'Search for clues, deduce, analyze, find traps' },
      { name: 'Medicine', ability: 'WIS', examples: 'Stabilize dying creature, diagnose illness, treat wounds' },
      { name: 'Nature', ability: 'INT', examples: 'Recall lore about terrain, plants, animals, weather' },
      { name: 'Perception', ability: 'WIS', examples: 'Spot, listen, detect presence, notice details' },
      { name: 'Performance', ability: 'CHA', examples: 'Sing, dance, act, tell stories, play instruments' },
      { name: 'Persuasion', ability: 'CHA', examples: 'Convince, negotiate, diplomacy, influence' },
      { name: 'Religion', ability: 'INT', examples: 'Recall lore about deities, rites, prayers, holy symbols' },
      { name: 'Sleight of Hand', ability: 'DEX', examples: 'Pickpocket, conceal object, plant item' },
      { name: 'Stealth', ability: 'DEX', examples: 'Sneak, hide, move silently, avoid detection' },
      { name: 'Survival', ability: 'WIS', examples: 'Track, forage, navigate, predict weather, avoid hazards' },
    ];
    let html = '<table class="ref-table"><tr><th>Skill</th><th>Ability</th><th>Examples</th></tr>';
    skills.forEach(s => { html += `<tr><td style="font-weight:700;">${s.name}</td><td style="color:var(--accent);">${s.ability}</td><td style="font-size:11px;">${s.examples}</td></tr>`; });
    html += '</table>';
    html += `<div style="margin-top:12px;font-size:12px;color:var(--text2);">
      <strong>Ability Check:</strong> d20 + ability modifier + proficiency bonus (if proficient)<br>
      <strong>Passive Score:</strong> 10 + all modifiers (advantage = +5, disadvantage = -5)
    </div>`;
    return html;
  }

  function buildSavesRef() {
    return `
      <div style="font-size:12px;line-height:1.8;color:var(--text);margin-bottom:16px;">
        <strong>Saving Throw:</strong> d20 + ability modifier + proficiency bonus (if proficient in that save)<br>
        <strong>DC:</strong> Set by the effect causing it (spell save DC = 8 + proficiency + spellcasting modifier)
      </div>
      <table class="ref-table">
        <tr><th>Save</th><th>Common Sources</th><th>Proficient Classes</th></tr>
        <tr><td style="font-weight:700;color:var(--accent);">STR</td><td>Resisting being pushed, restrained, or knocked prone</td><td>Barbarian, Fighter, Monk, Ranger</td></tr>
        <tr><td style="font-weight:700;color:var(--accent);">DEX</td><td>Dodging area effects (Fireball, traps), reflexes</td><td>Bard, Monk, Ranger, Rogue</td></tr>
        <tr><td style="font-weight:700;color:var(--accent);">CON</td><td>Enduring poison, disease, maintaining concentration</td><td>Barbarian, Fighter, Sorcerer, Artificer</td></tr>
        <tr><td style="font-weight:700;color:var(--accent);">INT</td><td>Resisting mental effects, illusions, psionic attacks</td><td>Druid, Rogue, Wizard</td></tr>
        <tr><td style="font-weight:700;color:var(--accent);">WIS</td><td>Resisting charm, fear, mind control</td><td>Cleric, Druid, Paladin, Warlock, Wizard</td></tr>
        <tr><td style="font-weight:700;color:var(--accent);">CHA</td><td>Resisting banishment, possession, force of personality</td><td>Bard, Cleric, Paladin, Sorcerer, Warlock</td></tr>
      </table>
    `;
  }

  function buildCoverRef() {
    return `
      <table class="ref-table">
        <tr><th>Cover Type</th><th>AC/DEX Save Bonus</th><th>Example</th></tr>
        <tr><td style="font-weight:700;">Half Cover</td><td style="color:var(--accent);">+2</td><td>Low wall, furniture, another creature</td></tr>
        <tr><td style="font-weight:700;">Three-Quarters Cover</td><td style="color:var(--accent);">+5</td><td>Portcullis, arrow slit, tree trunk</td></tr>
        <tr><td style="font-weight:700;">Total Cover</td><td style="color:var(--green);">Can't be targeted</td><td>Completely concealed behind wall</td></tr>
      </table>
    `;
  }

  function buildExhaustionRef() {
    return `
      <table class="ref-table">
        <tr><th>Level</th><th>Effect</th></tr>
        <tr><td style="font-weight:700;">1</td><td>Disadvantage on ability checks</td></tr>
        <tr><td style="font-weight:700;">2</td><td>Speed halved</td></tr>
        <tr><td style="font-weight:700;">3</td><td>Disadvantage on attack rolls and saving throws</td></tr>
        <tr><td style="font-weight:700;">4</td><td>Hit point maximum halved</td></tr>
        <tr><td style="font-weight:700;">5</td><td>Speed reduced to 0</td></tr>
        <tr><td style="font-weight:700;color:var(--red);">6</td><td style="color:var(--red);font-weight:700;">Death</td></tr>
      </table>
      <div style="margin-top:12px;font-size:12px;color:var(--text2);">
        <strong>Effects are cumulative.</strong> A creature with 2 levels has disadvantage on checks AND halved speed.<br>
        <strong>Recovery:</strong> Finishing a long rest reduces exhaustion by 1 level (if food/drink consumed).<br>
        <strong>Sources:</strong> Forced march, starvation, extreme temperatures, Berserker frenzy, certain spells
      </div>
    `;
  }
})();
