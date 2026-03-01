(function() {
  "use strict";

  var widgetState = {
    leftOpen: true,
    rightOpen: true,
    bottomOpen: true,
    leftWidth: 260,
    rightWidth: 280,
    bottomHeight: 200,
    activeLeftTab: 'outliner',
    activeRightTab: 'details',
    activeBottomTab: 'content-browser',
    resizing: null
  };

  var WIDGET_TABS = {
    left: [
      { id: 'outliner', label: 'Outliner', icon: '&#128065;' },
      { id: 'modes', label: 'Modes', icon: '&#9881;' },
      { id: 'world', label: 'World', icon: '&#127758;' }
    ],
    right: [
      { id: 'details', label: 'Details', icon: '&#128196;' },
      { id: 'properties', label: 'Properties', icon: '&#9881;' },
      { id: 'palette', label: 'Palette', icon: '&#127912;' }
    ],
    bottom: [
      { id: 'content-browser', label: 'Content Browser', icon: '&#128194;' },
      { id: 'output-log', label: 'Output Log', icon: '&#128195;' },
      { id: 'console', label: 'Console', icon: '&#62;_' },
      { id: 'anim-timeline', label: 'Animation', icon: '&#127916;' },
      { id: 'event-graph', label: 'Event Graph', icon: '&#128200;' }
    ]
  };

  function buildWidgetTabs(position) {
    var tabs = WIDGET_TABS[position];
    var activeId = widgetState['active' + position.charAt(0).toUpperCase() + position.slice(1) + 'Tab'];
    var html = '<div class="widget-tabs">';
    tabs.forEach(function(tab) {
      html += '<div class="widget-tab' + (tab.id === activeId ? ' active' : '') + '" data-tab="' + tab.id + '" data-pos="' + position + '" onclick="window._widgetSwitchTab(\'' + position + '\',\'' + tab.id + '\')">';
      html += '<span class="widget-tab-icon">' + tab.icon + '</span>';
      html += '<span class="widget-tab-label">' + tab.label + '</span>';
      html += '</div>';
    });
    html += '</div>';
    return html;
  }

  function buildOutlinerContent() {
    var p = window.PlatformConfig ? window.PlatformConfig.get() : { name: 'GBC', resolution: '160x144' };
    var html = '<div class="widget-content-inner">';
    html += '<div class="widget-search"><input type="text" placeholder="Search scene..." oninput="window._widgetFilterOutliner(this.value)"></div>';
    html += '<div class="outliner-tree" id="outlinerTree">';
    html += '<div class="otree-node open" data-node="scene">';
    html += '<div class="otree-hdr" onclick="window._widgetToggleNode(this)"><span class="otree-arrow">&#9660;</span> &#127758; Scene Root</div>';
    html += '<div class="otree-children">';
    html += '<div class="otree-node open"><div class="otree-hdr" onclick="window._widgetToggleNode(this)"><span class="otree-arrow">&#9660;</span> &#128247; Camera</div><div class="otree-children">';
    html += '<div class="otree-leaf selected">&#127916; MainCamera</div>';
    html += '</div></div>';
    html += '<div class="otree-node open"><div class="otree-hdr" onclick="window._widgetToggleNode(this)"><span class="otree-arrow">&#9660;</span> &#128161; Lighting</div><div class="otree-children">';
    html += '<div class="otree-leaf">&#9728; AmbientLight</div>';
    html += '<div class="otree-leaf">&#128294; TorchLight_01</div>';
    html += '<div class="otree-leaf">&#128294; TorchLight_02</div>';
    html += '</div></div>';
    html += '<div class="otree-node open"><div class="otree-hdr" onclick="window._widgetToggleNode(this)"><span class="otree-arrow">&#9660;</span> &#128100; Characters</div><div class="otree-children">';
    html += '<div class="otree-leaf">&#9876; PlayerHero</div>';
    html += '<div class="otree-leaf">&#128100; NPC_Merchant</div>';
    html += '<div class="otree-leaf">&#128100; NPC_QuestGiver</div>';
    html += '</div></div>';
    html += '<div class="otree-node"><div class="otree-hdr" onclick="window._widgetToggleNode(this)"><span class="otree-arrow">&#9654;</span> &#128126; Enemies</div><div class="otree-children" style="display:none">';
    html += '<div class="otree-leaf">&#128128; Goblin_01</div>';
    html += '<div class="otree-leaf">&#128128; Goblin_02</div>';
    html += '<div class="otree-leaf">&#128128; Skeleton_Guard</div>';
    html += '<div class="otree-leaf">&#128009; Dragon_Boss</div>';
    html += '</div></div>';
    html += '<div class="otree-node"><div class="otree-hdr" onclick="window._widgetToggleNode(this)"><span class="otree-arrow">&#9654;</span> &#128230; Items</div><div class="otree-children" style="display:none">';
    html += '<div class="otree-leaf">&#128163; TreasureChest_01</div>';
    html += '<div class="otree-leaf">&#127864; HealthPotion_Spawn</div>';
    html += '<div class="otree-leaf">&#128481; Key_Gold</div>';
    html += '</div></div>';
    html += '<div class="otree-node"><div class="otree-hdr" onclick="window._widgetToggleNode(this)"><span class="otree-arrow">&#9654;</span> &#127959; Environment</div><div class="otree-children" style="display:none">';
    html += '<div class="otree-leaf">&#128695; Door_Main</div>';
    html += '<div class="otree-leaf">&#128695; Door_Secret</div>';
    html += '<div class="otree-leaf">&#128695; Stairs_Down</div>';
    html += '<div class="otree-leaf">&#9970; Trap_Spike</div>';
    html += '<div class="otree-leaf">&#128293; Brazier_01</div>';
    html += '</div></div>';
    html += '<div class="otree-node"><div class="otree-hdr" onclick="window._widgetToggleNode(this)"><span class="otree-arrow">&#9654;</span> &#127912; UI Layer</div><div class="otree-children" style="display:none">';
    html += '<div class="otree-leaf">&#128147; HPBar</div>';
    html += '<div class="otree-leaf">&#128153; MPBar</div>';
    html += '<div class="otree-leaf">&#128172; DialogBox</div>';
    html += '<div class="otree-leaf">&#128221; MenuOverlay</div>';
    html += '</div></div>';
    html += '</div></div>';
    html += '</div>';
    html += '</div>';
    return html;
  }

  function buildModesContent() {
    var html = '<div class="widget-content-inner">';
    html += '<div class="widget-section-hdr">Editor Modes</div>';
    var modes = [
      { id: 'select', icon: '&#128433;', label: 'Select', desc: 'Select and transform objects' },
      { id: 'tile', icon: '&#9638;', label: 'Tile Paint', desc: 'Paint tiles on map layers' },
      { id: 'entity', icon: '&#128100;', label: 'Place Entity', desc: 'Place entities from prefabs' },
      { id: 'collision', icon: '&#9632;', label: 'Collision', desc: 'Edit collision volumes' },
      { id: 'trigger', icon: '&#9889;', label: 'Triggers', desc: 'Place event trigger zones' },
      { id: 'path', icon: '&#10132;', label: 'Pathfinding', desc: 'Edit navigation mesh/grid' },
      { id: 'light', icon: '&#128161;', label: 'Lighting', desc: 'Place and edit light sources' },
      { id: 'particle', icon: '&#10047;', label: 'Particles', desc: 'Place particle emitters' },
      { id: 'sound', icon: '&#128266;', label: 'Sound', desc: 'Place audio sources' },
      { id: 'script', icon: '&#128196;', label: 'Scripting', desc: 'Visual event scripting' }
    ];
    modes.forEach(function(m) {
      html += '<div class="widget-mode-btn' + (m.id === 'select' ? ' active' : '') + '" onclick="window._widgetSetMode(\'' + m.id + '\',this)" title="' + m.desc + '">';
      html += '<span class="widget-mode-icon">' + m.icon + '</span>';
      html += '<span>' + m.label + '</span>';
      html += '</div>';
    });
    html += '<div class="widget-section-hdr" style="margin-top:12px;">Quick Actions</div>';
    html += '<button class="widget-action-btn" onclick="if(window.openEngineTool)window.openEngineTool(\'engine:sceneManager\')">Open Scene Manager</button>';
    html += '<button class="widget-action-btn" onclick="if(window.openEngineTool)window.openEngineTool(\'engine:entityEditor\')">Open Entity Editor</button>';
    html += '<button class="widget-action-btn" onclick="if(window.openEngineTool)window.openEngineTool(\'engine:eventEditor\')">Open Event Editor</button>';
    html += '<button class="widget-action-btn" onclick="if(window.openEngineTool)window.openEngineTool(\'engine:collisionEditor\')">Open Collision Editor</button>';
    html += '</div>';
    return html;
  }

  function buildWorldContent() {
    var p = window.PlatformConfig ? window.PlatformConfig.get() : { name: 'GBC' };
    var html = '<div class="widget-content-inner">';
    html += '<div class="widget-section-hdr">World Settings</div>';
    html += '<div class="widget-prop"><label>World Name</label><input type="text" value="Labyrinth of the Dragon"></div>';
    html += '<div class="widget-prop"><label>Map Type</label><select><option>Dungeon Crawler (Grid)</option><option>Overworld (Tile)</option><option>Side-Scroll (Platform)</option><option>Isometric</option><option selected>RPG Top-Down</option></select></div>';
    html += '<div class="widget-prop"><label>Tile Size</label><select><option>8x8</option><option selected>16x16</option><option>32x32</option></select></div>';
    html += '<div class="widget-prop"><label>Gravity</label><input type="number" value="0" step="0.1"></div>';
    html += '<div class="widget-prop"><label>Day/Night Cycle</label><input type="checkbox"></div>';
    html += '<div class="widget-section-hdr">RPG Settings</div>';
    html += '<div class="widget-prop"><label>Max Party Size</label><input type="number" value="4" min="1" max="8"></div>';
    html += '<div class="widget-prop"><label>Level Cap</label><input type="number" value="20" min="1" max="99"></div>';
    html += '<div class="widget-prop"><label>XP Curve</label><select><option selected>Standard D&D</option><option>Linear</option><option>Exponential</option><option>Custom</option></select></div>';
    html += '<div class="widget-prop"><label>Encounter Rate</label><input type="range" min="0" max="100" value="15"><span>15%</span></div>';
    html += '<div class="widget-prop"><label>Currency Name</label><input type="text" value="Gold"></div>';
    html += '<div class="widget-section-hdr">MMORPG Settings</div>';
    html += '<div class="widget-prop"><label>Multiplayer Mode</label><select><option selected>Single Player</option><option>Co-op (2P Link)</option><option>MMO (Server)</option></select></div>';
    html += '<div class="widget-prop"><label>World Instances</label><input type="number" value="1" min="1" max="99"></div>';
    html += '<div class="widget-prop"><label>Respawn Timer</label><input type="number" value="30" min="0"> sec</div>';
    html += '</div>';
    return html;
  }

  function buildDetailsContent() {
    var html = '<div class="widget-content-inner">';
    html += '<div class="widget-section-hdr">Selected: PlayerHero</div>';
    html += '<div class="widget-detail-section open">';
    html += '<div class="widget-detail-hdr" onclick="this.parentElement.classList.toggle(\'open\')">&#9660; Transform</div>';
    html += '<div class="widget-detail-body">';
    html += '<div class="widget-prop-row"><label>Position</label><div class="widget-vec"><label>X</label><input type="number" value="5"><label>Y</label><input type="number" value="3"></div></div>';
    html += '<div class="widget-prop-row"><label>Size</label><div class="widget-vec"><label>W</label><input type="number" value="16"><label>H</label><input type="number" value="16"></div></div>';
    html += '<div class="widget-prop-row"><label>Layer</label><input type="number" value="1" min="0" max="3"></div>';
    html += '<div class="widget-prop-row"><label>Visible</label><input type="checkbox" checked></div>';
    html += '</div></div>';
    html += '<div class="widget-detail-section open">';
    html += '<div class="widget-detail-hdr" onclick="this.parentElement.classList.toggle(\'open\')">&#9660; Sprite Renderer</div>';
    html += '<div class="widget-detail-body">';
    html += '<div class="widget-prop-row"><label>Sprite Sheet</label><select><option>hero_walk</option><option>hero_attack</option><option>hero_idle</option></select></div>';
    html += '<div class="widget-prop-row"><label>Frame</label><input type="number" value="0" min="0" max="15"></div>';
    html += '<div class="widget-prop-row"><label>Flip H</label><input type="checkbox"></div>';
    html += '<div class="widget-prop-row"><label>Palette</label><select><option>OBP0</option><option>OBP1</option></select></div>';
    html += '<div class="widget-prop-row"><label>Priority</label><input type="checkbox" checked></div>';
    html += '</div></div>';
    html += '<div class="widget-detail-section open">';
    html += '<div class="widget-detail-hdr" onclick="this.parentElement.classList.toggle(\'open\')">&#9660; RPG Stats</div>';
    html += '<div class="widget-detail-body">';
    html += '<div class="widget-prop-row"><label>Class</label><select><option>Fighter</option><option>Wizard</option><option>Rogue</option><option>Cleric</option><option>Ranger</option><option>Paladin</option></select></div>';
    html += '<div class="widget-prop-row"><label>Level</label><input type="number" value="1" min="1" max="20"></div>';
    html += '<div class="widget-prop-row"><label>HP / Max HP</label><div class="widget-vec"><input type="number" value="12"><span>/</span><input type="number" value="12"></div></div>';
    html += '<div class="widget-prop-row"><label>STR</label><input type="number" value="14" min="1" max="20"></div>';
    html += '<div class="widget-prop-row"><label>DEX</label><input type="number" value="12" min="1" max="20"></div>';
    html += '<div class="widget-prop-row"><label>CON</label><input type="number" value="13" min="1" max="20"></div>';
    html += '<div class="widget-prop-row"><label>INT</label><input type="number" value="10" min="1" max="20"></div>';
    html += '<div class="widget-prop-row"><label>WIS</label><input type="number" value="8" min="1" max="20"></div>';
    html += '<div class="widget-prop-row"><label>CHA</label><input type="number" value="10" min="1" max="20"></div>';
    html += '</div></div>';
    html += '<div class="widget-detail-section">';
    html += '<div class="widget-detail-hdr" onclick="this.parentElement.classList.toggle(\'open\')">&#9654; Collision Box</div>';
    html += '<div class="widget-detail-body">';
    html += '<div class="widget-prop-row"><label>Type</label><select><option>AABB</option><option>Circle</option><option>Pixel</option></select></div>';
    html += '<div class="widget-prop-row"><label>Solid</label><input type="checkbox" checked></div>';
    html += '</div></div>';
    html += '<div class="widget-detail-section">';
    html += '<div class="widget-detail-hdr" onclick="this.parentElement.classList.toggle(\'open\')">&#9654; Movement</div>';
    html += '<div class="widget-detail-body">';
    html += '<div class="widget-prop-row"><label>Speed</label><input type="number" value="2" min="0" max="8"></div>';
    html += '<div class="widget-prop-row"><label>Type</label><select><option>Grid 4-Dir</option><option>Grid 8-Dir</option><option>Free</option></select></div>';
    html += '</div></div>';
    html += '<div class="widget-detail-section">';
    html += '<div class="widget-detail-hdr" onclick="this.parentElement.classList.toggle(\'open\')">&#9654; Inventory</div>';
    html += '<div class="widget-detail-body">';
    html += '<div class="widget-prop-row"><label>Slots</label><input type="number" value="16" min="1" max="99"></div>';
    html += '<div class="widget-prop-row"><label>Gold</label><input type="number" value="0"></div>';
    html += '</div></div>';
    html += '<div class="widget-detail-section">';
    html += '<div class="widget-detail-hdr" onclick="this.parentElement.classList.toggle(\'open\')">&#9654; AI / Behavior</div>';
    html += '<div class="widget-detail-body">';
    html += '<div class="widget-prop-row"><label>Controller</label><select><option>Player Input</option><option>NPC AI</option><option>Enemy AI</option><option>Boss AI</option></select></div>';
    html += '</div></div>';
    html += '<div style="padding:8px;"><button class="widget-action-btn" style="width:100%;">+ Add Component</button></div>';
    html += '</div>';
    return html;
  }

  function buildPropertiesContent() {
    var p = window.PlatformConfig ? window.PlatformConfig.get() : {};
    var html = '<div class="widget-content-inner">';
    html += '<div class="widget-section-hdr">Scene Properties</div>';
    html += '<div class="widget-prop"><label>Scene Name</label><input type="text" value="Floor1_Entrance"></div>';
    html += '<div class="widget-prop"><label>Map Width</label><input type="number" value="20" min="1"></div>';
    html += '<div class="widget-prop"><label>Map Height</label><input type="number" value="18" min="1"></div>';
    html += '<div class="widget-prop"><label>Tileset</label><select><option>dungeon_tiles</option><option>forest_tiles</option><option>town_tiles</option><option>cave_tiles</option></select></div>';
    html += '<div class="widget-prop"><label>Music Track</label><select><option>dungeon_theme</option><option>battle_theme</option><option>town_theme</option><option>boss_theme</option></select></div>';
    html += '<div class="widget-prop"><label>Encounter Table</label><select><option>floor1_encounters</option><option>floor2_encounters</option><option>boss_encounters</option><option>none</option></select></div>';
    html += '<div class="widget-section-hdr">Quest Properties</div>';
    html += '<div class="widget-prop"><label>Active Quests</label><select multiple style="height:60px;"><option>Main: Defeat the Dragon</option><option>Side: Find Lost Sword</option><option>Side: Rescue Villagers</option></select></div>';
    html += '<div class="widget-section-hdr">Spawn Points</div>';
    html += '<div class="widget-mini-list">';
    html += '<div class="widget-mini-item">&#128681; Player Start (5,3)</div>';
    html += '<div class="widget-mini-item">&#128128; Enemy Spawn A (12,8)</div>';
    html += '<div class="widget-mini-item">&#128128; Enemy Spawn B (7,14)</div>';
    html += '<div class="widget-mini-item">&#128163; Chest Spawn (18,2)</div>';
    html += '</div>';
    html += '<button class="widget-action-btn" style="width:100%;margin-top:8px;">+ Add Spawn Point</button>';
    html += '</div>';
    return html;
  }

  function buildPaletteContent() {
    var html = '<div class="widget-content-inner">';
    html += '<div class="widget-section-hdr">Color Palettes</div>';
    html += '<div class="widget-prop"><label>Active Palette</label><select id="widgetPalSel"><option>BG Palette 0</option><option>BG Palette 1</option><option>BG Palette 2</option><option>BG Palette 3</option><option>OBJ Palette 0</option><option>OBJ Palette 1</option></select></div>';
    var colors = [['#081820','#346856','#88c070','#e0f8d0'],['#332c50','#46878f','#94e344','#e2f3e4'],['#1f1833','#5e315b','#8c3f5d','#ba6156'],['#2c2137','#764462','#c7a17c','#f0dab1']];
    colors.forEach(function(pal, pi) {
      html += '<div style="display:flex;align-items:center;gap:4px;margin-bottom:4px;"><span style="color:#888;font-size:10px;width:30px;">P' + pi + ':</span>';
      pal.forEach(function(c) {
        html += '<div style="width:24px;height:24px;background:' + c + ';border:1px solid #444;border-radius:2px;cursor:pointer;" title="' + c + '"></div>';
      });
      html += '</div>';
    });
    html += '<div class="widget-section-hdr" style="margin-top:8px;">Tileset Preview</div>';
    html += '<div style="display:grid;grid-template-columns:repeat(8,1fr);gap:1px;padding:4px;">';
    for (var ti = 0; ti < 32; ti++) {
      var shade = Math.floor(Math.random() * 4);
      var bg = ['#081820','#346856','#88c070','#e0f8d0'][shade];
      html += '<div style="width:100%;aspect-ratio:1;background:' + bg + ';border:1px solid #222;"></div>';
    }
    html += '</div>';
    html += '<div class="widget-section-hdr" style="margin-top:8px;">Sprite Sheet</div>';
    html += '<div class="widget-mini-list">';
    html += '<div class="widget-mini-item">&#127912; hero_walk (4 frames)</div>';
    html += '<div class="widget-mini-item">&#127912; hero_attack (3 frames)</div>';
    html += '<div class="widget-mini-item">&#127912; goblin_walk (4 frames)</div>';
    html += '<div class="widget-mini-item">&#127912; skeleton_walk (4 frames)</div>';
    html += '<div class="widget-mini-item">&#127912; npc_idle (2 frames)</div>';
    html += '</div>';
    html += '</div>';
    return html;
  }

  function buildContentBrowserContent() {
    var html = '<div class="widget-content-inner widget-content-horiz">';
    html += '<div class="cb-sidebar">';
    html += '<div class="cb-folder open" onclick="this.classList.toggle(\'open\')">&#128194; Project Root</div>';
    html += '<div class="cb-children">';
    var folders = ['Assets','Tiles','Maps','Sprites','Audio','Scripts','Prefabs','Data','Scenes','UI','Particles','Fonts'];
    folders.forEach(function(f) {
      html += '<div class="cb-folder" onclick="window._widgetBrowseFolder(\'' + f + '\',this)">&#128193; ' + f + '</div>';
    });
    html += '</div>';
    html += '</div>';
    html += '<div class="cb-content" id="cbContentArea">';
    html += '<div class="cb-toolbar">';
    html += '<input type="text" placeholder="Search assets..." class="cb-search" oninput="window._widgetSearchAssets(this.value)">';
    html += '<select class="cb-filter" onchange="window._widgetFilterAssets(this.value)">';
    html += '<option value="all">All Types</option><option value="tile">Tiles</option><option value="sprite">Sprites</option><option value="map">Maps</option><option value="audio">Audio</option><option value="script">Scripts</option><option value="prefab">Prefabs</option><option value="font">Fonts</option>';
    html += '</select>';
    html += '<span class="cb-count" id="cbCount">12 items</span>';
    html += '</div>';
    html += '<div class="cb-grid" id="cbGrid">';
    var assets = [
      { name: 'new_tiles.png', type: 'tile', icon: '&#9638;' },
      { name: 'hero_walk.png', type: 'sprite', icon: '&#128100;' },
      { name: 'hero_attack.png', type: 'sprite', icon: '&#128100;' },
      { name: 'goblin.png', type: 'sprite', icon: '&#128128;' },
      { name: 'skeleton.png', type: 'sprite', icon: '&#128128;' },
      { name: 'floor1.map', type: 'map', icon: '&#127758;' },
      { name: 'floor2.map', type: 'map', icon: '&#127758;' },
      { name: 'dungeon_theme.mod', type: 'audio', icon: '&#127925;' },
      { name: 'battle_theme.mod', type: 'audio', icon: '&#127925;' },
      { name: 'sfx_hit.wav', type: 'audio', icon: '&#128266;' },
      { name: 'player.prefab', type: 'prefab', icon: '&#128230;' },
      { name: 'chest.prefab', type: 'prefab', icon: '&#128230;' }
    ];
    assets.forEach(function(a) {
      html += '<div class="cb-asset" data-type="' + a.type + '" title="' + a.name + '">';
      html += '<div class="cb-asset-icon">' + a.icon + '</div>';
      html += '<div class="cb-asset-name">' + a.name + '</div>';
      html += '</div>';
    });
    html += '</div>';
    html += '</div>';
    html += '</div>';
    return html;
  }

  function buildOutputLogContent() {
    var html = '<div class="widget-content-inner">';
    html += '<div class="cb-toolbar">';
    html += '<select class="cb-filter"><option>All</option><option>Info</option><option>Warning</option><option>Error</option></select>';
    html += '<button class="widget-action-btn" onclick="document.getElementById(\'outputLogArea\').textContent=\'\'">Clear</button>';
    html += '</div>';
    html += '<div class="output-log-area" id="outputLogArea">';
    html += '<div class="log-info">[Info] Enchantment Engine v2.1.0 initialized</div>';
    html += '<div class="log-info">[Info] Platform: ' + (window.PlatformConfig ? window.PlatformConfig.get().name : 'GBC') + '</div>';
    html += '<div class="log-info">[Info] GBDK-2020 ready at ~/gbdk/</div>';
    html += '<div class="log-warn">[Warn] No ROM loaded - emulator idle</div>';
    html += '<div class="log-info">[Info] Scene: Floor1_Entrance loaded (20x18 tiles)</div>';
    html += '<div class="log-info">[Info] 5 entities spawned, 3 triggers active</div>';
    html += '<div class="log-info">[Info] Widget panels initialized</div>';
    html += '</div>';
    html += '</div>';
    return html;
  }

  function buildConsoleContent() {
    var html = '<div class="widget-content-inner">';
    html += '<div class="output-log-area" id="consoleLogArea" style="flex:1;">';
    html += '<div class="log-info">Enchantment Engine Console</div>';
    html += '<div class="log-info">Type commands below. Use "help" for available commands.</div>';
    html += '</div>';
    html += '<div class="console-input-row">';
    html += '<span class="console-prompt">&gt;</span>';
    html += '<input type="text" class="console-input" id="consoleInput" placeholder="Enter command..." onkeydown="if(event.key===\'Enter\')window._widgetExecConsole(this.value)">';
    html += '</div>';
    html += '</div>';
    return html;
  }

  function buildAnimTimelineContent() {
    var html = '<div class="widget-content-inner">';
    html += '<div class="cb-toolbar">';
    html += '<button class="widget-action-btn">&#9654; Play</button>';
    html += '<button class="widget-action-btn">&#9632; Stop</button>';
    html += '<button class="widget-action-btn">&#9198; Prev</button>';
    html += '<button class="widget-action-btn">&#9197; Next</button>';
    html += '<span style="color:#888;font-size:11px;margin-left:8px;">Frame: <strong style="color:#58a6ff">0</strong> / 3</span>';
    html += '<span style="color:#888;font-size:11px;margin-left:8px;">FPS: <input type="number" value="8" min="1" max="60" style="width:40px;background:#111;color:#ccc;border:1px solid #333;padding:2px;font-size:11px;"></span>';
    html += '</div>';
    html += '<div class="anim-timeline">';
    html += '<div class="anim-track"><span class="anim-track-label">Sprite</span>';
    for (var f = 0; f < 12; f++) {
      html += '<div class="anim-keyframe' + (f < 4 ? ' has-key' : '') + (f === 0 ? ' current' : '') + '" title="Frame ' + f + '"></div>';
    }
    html += '</div>';
    html += '<div class="anim-track"><span class="anim-track-label">Position</span>';
    for (var f = 0; f < 12; f++) {
      html += '<div class="anim-keyframe' + (f === 0 || f === 6 ? ' has-key' : '') + (f === 0 ? ' current' : '') + '"></div>';
    }
    html += '</div>';
    html += '<div class="anim-track"><span class="anim-track-label">Events</span>';
    for (var f = 0; f < 12; f++) {
      html += '<div class="anim-keyframe' + (f === 2 ? ' has-key event' : '') + (f === 0 ? ' current' : '') + '"></div>';
    }
    html += '</div>';
    html += '</div>';
    html += '</div>';
    return html;
  }

  function buildEventGraphContent() {
    var html = '<div class="widget-content-inner">';
    html += '<div class="cb-toolbar">';
    html += '<select class="cb-filter"><option>PlayerHero</option><option>NPC_Merchant</option><option>TreasureChest_01</option><option>Door_Main</option><option>Goblin_01</option></select>';
    html += '<button class="widget-action-btn">+ Add Node</button>';
    html += '<button class="widget-action-btn">Compile</button>';
    html += '</div>';
    html += '<div class="event-graph-area">';
    html += '<div class="eg-node" style="left:20px;top:20px;"><div class="eg-node-hdr eg-event">Event: OnInteract</div><div class="eg-node-body"><div class="eg-pin-out">Exec &#9654;</div></div></div>';
    html += '<div class="eg-conn" style="left:180px;top:40px;">&#10230;</div>';
    html += '<div class="eg-node" style="left:220px;top:10px;"><div class="eg-node-hdr eg-condition">Branch: HasKey?</div><div class="eg-node-body"><div class="eg-pin-out" style="color:#3fb950;">True &#9654;</div><div class="eg-pin-out" style="color:#f85149;">False &#9654;</div></div></div>';
    html += '<div class="eg-conn" style="left:390px;top:28px;">&#10230;</div>';
    html += '<div class="eg-node" style="left:430px;top:10px;"><div class="eg-node-hdr eg-action">Action: OpenDoor</div><div class="eg-node-body"><div class="eg-pin-in">&#9654; Exec</div><div class="eg-pin-out">Done &#9654;</div></div></div>';
    html += '<div class="eg-conn" style="left:390px;top:60px;">&#10230;</div>';
    html += '<div class="eg-node" style="left:430px;top:60px;"><div class="eg-node-hdr eg-action">Action: ShowDialog</div><div class="eg-node-body"><div class="eg-pin-in">&#9654; Exec</div><div class="eg-prop">Text: "Door is locked"</div></div></div>';
    html += '</div>';
    html += '</div>';
    return html;
  }

  function getWidgetContent(tabId) {
    switch(tabId) {
      case 'outliner': return buildOutlinerContent();
      case 'modes': return buildModesContent();
      case 'world': return buildWorldContent();
      case 'details': return buildDetailsContent();
      case 'properties': return buildPropertiesContent();
      case 'palette': return buildPaletteContent();
      case 'content-browser': return buildContentBrowserContent();
      case 'output-log': return buildOutputLogContent();
      case 'console': return buildConsoleContent();
      case 'anim-timeline': return buildAnimTimelineContent();
      case 'event-graph': return buildEventGraphContent();
      default: return '<div class="widget-content-inner"><p style="color:#666;padding:16px;">Widget content placeholder</p></div>';
    }
  }

  function initWidgets() {
    var app = document.getElementById('app');
    if (!app) return;

    var mainContent = app.querySelector('.main-content');
    if (!mainContent) return;

    var leftPanel = document.createElement('div');
    leftPanel.id = 'widgetLeft';
    leftPanel.className = 'widget-panel widget-left';
    leftPanel.innerHTML = buildWidgetTabs('left') +
      '<div class="widget-content" id="widgetLeftContent">' + getWidgetContent(widgetState.activeLeftTab) + '</div>' +
      '<div class="widget-collapse-btn" onclick="window._widgetToggle(\'left\')" title="Toggle Left Panel">&#9664;</div>';

    var rightPanel = document.createElement('div');
    rightPanel.id = 'widgetRight';
    rightPanel.className = 'widget-panel widget-right';
    rightPanel.innerHTML = buildWidgetTabs('right') +
      '<div class="widget-content" id="widgetRightContent">' + getWidgetContent(widgetState.activeRightTab) + '</div>' +
      '<div class="widget-collapse-btn" onclick="window._widgetToggle(\'right\')" title="Toggle Right Panel">&#9654;</div>';

    var bottomPanel = document.createElement('div');
    bottomPanel.id = 'widgetBottom';
    bottomPanel.className = 'widget-panel widget-bottom';
    bottomPanel.innerHTML = '<div class="widget-resize-handle widget-resize-v" id="widgetBottomResize"></div>' +
      buildWidgetTabs('bottom') +
      '<div class="widget-content" id="widgetBottomContent">' + getWidgetContent(widgetState.activeBottomTab) + '</div>' +
      '<div class="widget-collapse-btn widget-collapse-bottom" onclick="window._widgetToggle(\'bottom\')" title="Toggle Bottom Panel">&#9660;</div>';

    var wrapper = document.createElement('div');
    wrapper.id = 'editorLayout';
    wrapper.className = 'editor-layout';

    var centerWrapper = document.createElement('div');
    centerWrapper.className = 'editor-center';

    var middleRow = document.createElement('div');
    middleRow.className = 'editor-middle';

    mainContent.parentNode.insertBefore(wrapper, mainContent);
    middleRow.appendChild(leftPanel);

    var mainWrap = document.createElement('div');
    mainWrap.className = 'editor-viewport';
    mainContent.parentNode.removeChild(mainContent);
    mainWrap.appendChild(mainContent);
    middleRow.appendChild(mainWrap);
    middleRow.appendChild(rightPanel);

    centerWrapper.appendChild(middleRow);
    centerWrapper.appendChild(bottomPanel);
    wrapper.appendChild(centerWrapper);

    leftPanel.style.width = widgetState.leftWidth + 'px';
    rightPanel.style.width = widgetState.rightWidth + 'px';
    bottomPanel.style.height = widgetState.bottomHeight + 'px';

    setupResizeHandles();
    setupWidgetInteractions();
  }

  function setupResizeHandles() {
    var bottomHandle = document.getElementById('widgetBottomResize');
    if (bottomHandle) {
      bottomHandle.addEventListener('mousedown', function(e) {
        e.preventDefault();
        widgetState.resizing = 'bottom';
        document.body.style.cursor = 'ns-resize';
        document.body.style.userSelect = 'none';
      });
    }

    document.addEventListener('mousemove', function(e) {
      if (!widgetState.resizing) return;
      if (widgetState.resizing === 'bottom') {
        var panel = document.getElementById('widgetBottom');
        if (!panel) return;
        var parent = panel.parentElement;
        var rect = parent.getBoundingClientRect();
        var newH = rect.bottom - e.clientY;
        if (newH >= 80 && newH <= 500) {
          widgetState.bottomHeight = newH;
          panel.style.height = newH + 'px';
        }
      }
    });

    document.addEventListener('mouseup', function() {
      if (widgetState.resizing) {
        widgetState.resizing = null;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    });
  }

  function setupWidgetInteractions() {
    window._widgetSwitchTab = function(position, tabId) {
      var key = 'active' + position.charAt(0).toUpperCase() + position.slice(1) + 'Tab';
      widgetState[key] = tabId;
      var panel = document.getElementById('widget' + position.charAt(0).toUpperCase() + position.slice(1));
      if (!panel) return;
      panel.querySelectorAll('.widget-tab').forEach(function(t) {
        t.classList.toggle('active', t.getAttribute('data-tab') === tabId);
      });
      var content = panel.querySelector('.widget-content');
      if (content) content.innerHTML = getWidgetContent(tabId);
    };

    window._widgetToggle = function(position) {
      var key = position + 'Open';
      widgetState[key] = !widgetState[key];
      var id = 'widget' + position.charAt(0).toUpperCase() + position.slice(1);
      var panel = document.getElementById(id);
      if (!panel) return;
      panel.classList.toggle('collapsed', !widgetState[key]);
      var btn = panel.querySelector('.widget-collapse-btn');
      if (position === 'left') btn.innerHTML = widgetState[key] ? '&#9664;' : '&#9654;';
      else if (position === 'right') btn.innerHTML = widgetState[key] ? '&#9654;' : '&#9664;';
      else btn.innerHTML = widgetState[key] ? '&#9660;' : '&#9650;';
    };

    window._widgetToggleNode = function(hdrEl) {
      var node = hdrEl.parentElement;
      var children = node.querySelector('.otree-children');
      var arrow = hdrEl.querySelector('.otree-arrow');
      if (!children) return;
      var open = children.style.display !== 'none';
      children.style.display = open ? 'none' : 'block';
      if (arrow) arrow.innerHTML = open ? '&#9654;' : '&#9660;';
      node.classList.toggle('open', !open);
    };

    window._widgetFilterOutliner = function(query) {
      query = query.toLowerCase();
      var tree = document.getElementById('outlinerTree');
      if (!tree) return;
      tree.querySelectorAll('.otree-leaf').forEach(function(leaf) {
        leaf.style.display = (!query || leaf.textContent.toLowerCase().indexOf(query) >= 0) ? 'block' : 'none';
      });
    };

    window._widgetSetMode = function(modeId, btn) {
      document.querySelectorAll('.widget-mode-btn').forEach(function(b) { b.classList.remove('active'); });
      if (btn) btn.classList.add('active');
    };

    window._widgetBrowseFolder = function(folder, el) {
      document.querySelectorAll('.cb-folder').forEach(function(f) { f.classList.remove('selected'); });
      if (el) el.classList.add('selected');
    };

    window._widgetSearchAssets = function(query) {
      query = query.toLowerCase();
      var grid = document.getElementById('cbGrid');
      if (!grid) return;
      var count = 0;
      grid.querySelectorAll('.cb-asset').forEach(function(a) {
        var show = !query || a.getAttribute('title').toLowerCase().indexOf(query) >= 0;
        a.style.display = show ? '' : 'none';
        if (show) count++;
      });
      var countEl = document.getElementById('cbCount');
      if (countEl) countEl.textContent = count + ' items';
    };

    window._widgetFilterAssets = function(type) {
      var grid = document.getElementById('cbGrid');
      if (!grid) return;
      var count = 0;
      grid.querySelectorAll('.cb-asset').forEach(function(a) {
        var show = type === 'all' || a.getAttribute('data-type') === type;
        a.style.display = show ? '' : 'none';
        if (show) count++;
      });
      var countEl = document.getElementById('cbCount');
      if (countEl) countEl.textContent = count + ' items';
    };

    window._widgetExecConsole = function(cmd) {
      var log = document.getElementById('consoleLogArea');
      var input = document.getElementById('consoleInput');
      if (!log || !input) return;
      log.innerHTML += '<div class="log-cmd">&gt; ' + cmd + '</div>';
      cmd = cmd.trim().toLowerCase();
      if (cmd === 'help') {
        log.innerHTML += '<div class="log-info">Commands: help, clear, platform, scene, entities, stats, spawn &lt;type&gt;, tp &lt;x&gt; &lt;y&gt;, heal, damage &lt;n&gt;, level &lt;n&gt;, gold &lt;n&gt;, quest, inventory, save, load</div>';
      } else if (cmd === 'clear') {
        log.innerHTML = '';
      } else if (cmd === 'platform') {
        var p = window.PlatformConfig ? window.PlatformConfig.get() : {};
        log.innerHTML += '<div class="log-info">Platform: ' + (p.name || 'Unknown') + ' | CPU: ' + (p.cpu || '?') + ' | Res: ' + (p.resolution || '?') + '</div>';
      } else if (cmd === 'scene') {
        log.innerHTML += '<div class="log-info">Current Scene: Floor1_Entrance (20x18) | Tileset: dungeon_tiles | Music: dungeon_theme</div>';
      } else if (cmd === 'entities') {
        log.innerHTML += '<div class="log-info">Entities: PlayerHero, NPC_Merchant, NPC_QuestGiver, Goblin_01, Goblin_02, Skeleton_Guard, Dragon_Boss, TreasureChest_01, HealthPotion_Spawn, Key_Gold</div>';
      } else if (cmd === 'stats') {
        log.innerHTML += '<div class="log-info">PlayerHero: LV 1 Fighter | HP 12/12 | STR 14 DEX 12 CON 13 INT 10 WIS 8 CHA 10 | Gold: 0</div>';
      } else if (cmd === 'quest') {
        log.innerHTML += '<div class="log-info">Active Quests: [Main] Defeat the Dragon (0/1), [Side] Find Lost Sword (0/1), [Side] Rescue Villagers (0/3)</div>';
      } else if (cmd === 'inventory') {
        log.innerHTML += '<div class="log-info">Inventory: [Empty x16] | Gold: 0</div>';
      } else if (cmd.startsWith('spawn ')) {
        log.innerHTML += '<div class="log-info">Spawned: ' + cmd.substring(6) + ' at current position</div>';
      } else if (cmd === 'heal') {
        log.innerHTML += '<div class="log-info">PlayerHero healed to full HP (12/12)</div>';
      } else if (cmd === 'save') {
        log.innerHTML += '<div class="log-info">Game state saved to SRAM slot 0</div>';
      } else if (cmd === 'load') {
        log.innerHTML += '<div class="log-info">Game state loaded from SRAM slot 0</div>';
      } else {
        log.innerHTML += '<div class="log-warn">Unknown command: ' + cmd + '. Type "help" for available commands.</div>';
      }
      log.scrollTop = log.scrollHeight;
      input.value = '';
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidgets);
  } else {
    setTimeout(initWidgets, 100);
  }

  window.addEventListener('platformChanged', function() {
    var rightContent = document.getElementById('widgetRightContent');
    if (rightContent) rightContent.innerHTML = getWidgetContent(widgetState.activeRightTab);
    var bottomContent = document.getElementById('widgetBottomContent');
    if (bottomContent && widgetState.activeBottomTab === 'output-log') {
      bottomContent.innerHTML = getWidgetContent('output-log');
    }
  });

})();
