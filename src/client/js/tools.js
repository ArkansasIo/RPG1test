(function() {
  "use strict";

  window.openEngineTool = function(action) {
    var tools = {
      'tool:memoryViewer': { title: 'Memory Viewer', build: buildMemoryViewer },
      'tool:registerInspector': { title: 'Register Inspector', build: buildRegisterInspector },
      'tool:vramViewer': { title: 'VRAM Viewer', build: buildVRAMViewer },
      'tool:oamViewer': { title: 'OAM Viewer', build: buildOAMViewer },
      'tool:tileDataViewer': { title: 'Tile Data Viewer', build: buildTileDataViewer },
      'tool:bgMapViewer': { title: 'BG Map Viewer', build: buildBGMapViewer },
      'tool:soundCH1': { title: 'CH1 - Square + Sweep', build: function() { return buildSoundChannel(1); } },
      'tool:soundCH2': { title: 'CH2 - Square', build: function() { return buildSoundChannel(2); } },
      'tool:soundCH3': { title: 'CH3 - Wave', build: function() { return buildSoundChannel(3); } },
      'tool:soundCH4': { title: 'CH4 - Noise', build: function() { return buildSoundChannel(4); } },
      'tool:musicComposer': { title: 'Music Composer', build: buildMusicComposer },
      'tool:sfxEditor': { title: 'SFX Editor', build: buildSFXEditor },
      'tool:waveEditor': { title: 'Wave Pattern Editor', build: buildWaveEditor },
      'tool:2bppConverter': { title: 'Tile Converter', build: build2BPPConverter },
      'tool:chrConverter': { title: 'CHR/NES Tile Converter', build: buildCHRConverter },
      'tool:colorPalette': { title: 'Color Palette Tool', build: buildColorPalette },
      'tool:spriteAnimator': { title: 'Sprite Animator', build: buildSpriteAnimator },
      'tool:bgComposer': { title: 'BG Layer Composer', build: buildBGComposer },
      'tool:romHeader': { title: 'ROM Header Editor', build: buildROMHeader },
      'tool:bankManager': { title: 'Bank Manager', build: buildBankManager },
      'tool:romSizeCalc': { title: 'ROM Size Calculator', build: buildROMSizeCalc },
      'tool:checksumValidator': { title: 'Checksum Validator', build: buildChecksumValidator },
      'tool:hexViewer': { title: 'Hex Viewer', build: buildHexViewer },
      'tool:disassembler': { title: 'Disassembler', build: buildDisassembler },
      'tool:memoryMap': { title: 'Memory Map', build: buildMemoryMap },
      'tool:breakpoints': { title: 'Breakpoint Manager', build: buildBreakpoints },
      'tool:profiler': { title: 'Performance Profiler', build: buildProfiler },
      'engine:sceneManager': { title: 'Scene Manager', build: buildSceneManager },
      'engine:sceneProps': { title: 'Scene Properties', build: buildSceneProps },
      'engine:transFade': { title: 'Fade Transition', build: function() { return buildTransition('fade'); } },
      'engine:transSlide': { title: 'Slide Transition', build: function() { return buildTransition('slide'); } },
      'engine:transWipe': { title: 'Wipe Transition', build: function() { return buildTransition('wipe'); } },
      'engine:transCustom': { title: 'Custom Transition', build: function() { return buildTransition('custom'); } },
      'engine:entityEditor': { title: 'Entity Editor', build: buildEntityEditor },
      'engine:componentBrowser': { title: 'Component Browser', build: buildComponentBrowser },
      'engine:prefabManager': { title: 'Prefab Manager', build: buildPrefabManager },
      'engine:entityInspector': { title: 'Entity Inspector', build: buildEntityInspector },
      'engine:eventEditor': { title: 'Event Editor', build: buildEventEditor },
      'engine:variableManager': { title: 'Variable Manager', build: buildVariableManager },
      'engine:scriptConsole': { title: 'Script Console', build: buildScriptConsole },
      'engine:stateMachine': { title: 'State Machine Editor', build: buildStateMachine },
      'engine:triggerSystem': { title: 'Trigger System', build: buildTriggerSystem },
      'engine:collisionEditor': { title: 'Collision Editor', build: buildCollisionEditor },
      'engine:hitboxTool': { title: 'Hitbox Tool', build: buildHitboxTool },
      'engine:movementSystem': { title: 'Movement System', build: buildMovementSystem },
      'engine:pathfinding': { title: 'Pathfinding Config', build: buildPathfinding },
      'engine:textboxEditor': { title: 'Text Box Editor', build: buildTextboxEditor },
      'engine:menuDesigner': { title: 'Menu Designer', build: buildMenuDesigner },
      'engine:hudLayout': { title: 'HUD Layout', build: buildHUDLayout },
      'engine:dialogTree': { title: 'Dialog Tree Editor', build: buildDialogTree },
      'engine:fontManager': { title: 'Font Manager', build: buildFontManager },
      'engine:sramLayout': { title: 'SRAM Layout', build: buildSRAMLayout },
      'engine:saveSlotManager': { title: 'Save Slot Manager', build: buildSaveSlotManager },
      'engine:checksumConfig': { title: 'Checksum Config', build: buildChecksumConfig },
    };

    var tool = tools[action];
    if (tool) {
      window.openModal(tool.title, tool.build());
    }
  };

  window.addEventListener('platformChanged', function() {
    var modal = document.querySelector('.modal-content');
    if (modal) {
      var titleEl = modal.querySelector('.modal-header h3, .modal-header .modal-title');
      if (titleEl) {
        var title = titleEl.textContent;
        var matchedAction = null;
        var tools = {
          'Memory Viewer': 'tool:memoryViewer',
          'Register Inspector': 'tool:registerInspector',
          'VRAM Viewer': 'tool:vramViewer',
          'OAM Viewer': 'tool:oamViewer',
          'Tile Data Viewer': 'tool:tileDataViewer',
          'BG Map Viewer': 'tool:bgMapViewer',
          'Music Composer': 'tool:musicComposer',
          'Color Palette Tool': 'tool:colorPalette',
          'ROM Header Editor': 'tool:romHeader',
          'Bank Manager': 'tool:bankManager',
          'ROM Size Calculator': 'tool:romSizeCalc',
          'Performance Profiler': 'tool:profiler',
          'Memory Map': 'tool:memoryMap',
          'Scene Manager': 'engine:sceneManager',
          'Entity Editor': 'engine:entityEditor',
          'Component Browser': 'engine:componentBrowser',
          'Collision Editor': 'engine:collisionEditor',
          'HUD Layout': 'engine:hudLayout',
          'Text Box Editor': 'engine:textboxEditor',
          'SRAM Layout': 'engine:sramLayout',
        };
        matchedAction = tools[title];
        if (matchedAction) {
          window.openEngineTool(matchedAction);
        }
      }
    }
  });

  function getPlatform() {
    return window.PlatformConfig ? window.PlatformConfig.get() : { id: 'gbc', name: 'Game Boy Color', bits: 8, resolution: '160x144', resW: 160, resH: 144, soundChannels: 4, maxSprites: 40, tileSize: 8, tileFormat: '2BPP', bpp: 2, colorFormat: 'RGB555', maxColors: 32768, vram: '16 KB', wram: '32 KB', cpu: 'Sharp LR35902 (Z80-like)', clockSpeed: '4.19 / 8.38 MHz', features: [], memoryMap: {}, registers: [], audioSpec: {}, buildTools: { compiler: 'GBDK-2020 lcc', sdk: 'GBDK-2020' }, fileExtension: '.gbc', graphicsModes: [] };
  }

  function getEngineFeatures() {
    return window.PlatformConfig ? window.PlatformConfig.getEngineFeatures(window.PlatformConfig.current) : { rendering: [], physics: [], entity: [], audio: [], save: [], input: [], scene: [] };
  }

  function platformBadge(p) {
    return '<div style="margin-bottom:12px;padding:6px 10px;background:rgba(88,166,255,0.1);border:1px solid rgba(88,166,255,0.2);border-radius:4px;font-size:11px;color:var(--accent);">' +
      '<strong>' + p.name + '</strong> | ' + p.bits + '-bit | ' + p.cpu + ' @ ' + p.clockSpeed + ' | ' + p.resolution + ' | ' + p.colors +
      '</div>';
  }

  function buildMemoryViewer() {
    var p = getPlatform();
    var regionOptions = '';
    var mapKeys = Object.keys(p.memoryMap || {});
    for (var i = 0; i < mapKeys.length; i++) {
      var k = mapKeys[i];
      var r = p.memoryMap[k];
      regionOptions += '<option>' + k + ' (' + r.start + '-' + r.end + ')</option>';
    }
    if (!regionOptions) {
      regionOptions = '<option>Full Memory</option>';
    }
    var addrWidth = (p.bits <= 8) ? 4 : 8;
    var defaultAddr = (p.bits <= 8) ? '0x0000' : '0x00000000';
    var memDesc = '';
    if (p.id === 'gb' || p.id === 'gbc') {
      memDesc = p.name + ' Memory: 64KB addressable | VRAM: ' + p.vram + ' | WRAM: ' + p.wram + ' | OAM: 160 bytes';
    } else if (p.id === 'gba') {
      memDesc = p.name + ' Memory: 32-bit address bus | EWRAM: 256KB | IWRAM: 32KB | VRAM: 96KB | ROM: up to 32MB';
    } else if (p.id === 'nds') {
      memDesc = p.name + ' Memory: Main RAM 4MB | VRAM: 656KB (9 banks) | ARM7 WRAM: 64KB';
    } else if (p.id === 'n64') {
      memDesc = p.name + ' Memory: 4MB RDRAM (8MB w/ Expansion) | Unified memory architecture | 64MB ROM max';
    } else {
      memDesc = p.name + ' Memory | VRAM: ' + p.vram + ' | WRAM: ' + p.wram;
    }
    return platformBadge(p) +
      '<div class="form-row">' +
        '<div class="form-group"><label>Address</label><input type="text" value="' + defaultAddr + '" id="memAddr"></div>' +
        '<div class="form-group"><label>Length</label><select><option>256</option><option>512</option><option selected>1024</option></select></div>' +
        '<div class="form-group"><label>Region</label><select>' + regionOptions + '</select></div>' +
      '</div>' +
      '<div style="background:#0a0a1a;padding:12px;border-radius:4px;font-family:monospace;font-size:11px;color:var(--green);max-height:400px;overflow:auto;">' +
        '<div style="color:var(--text2);margin-bottom:8px;">Address' + ' '.repeat(addrWidth) + '00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F  ASCII</div>' +
        generateHexRows(0x0000, 16, addrWidth) +
      '</div>' +
      '<div style="margin-top:8px;font-size:11px;color:var(--text2);">' + memDesc + '</div>';
  }

  function generateHexRows(startAddr, count, addrWidth) {
    var padLen = addrWidth || 4;
    var html = '';
    for (var r = 0; r < count; r++) {
      var addr = startAddr + r * 16;
      var hex = '', ascii = '';
      for (var c = 0; c < 16; c++) {
        var val = typeof gameboy !== 'undefined' && gameboy && gameboy.memory ? gameboy.memory[addr + c] || 0 : Math.floor(Math.random() * 256);
        hex += (val < 16 ? '0' : '') + val.toString(16).toUpperCase() + ' ';
        ascii += (val >= 32 && val < 127) ? String.fromCharCode(val) : '.';
      }
      html += '<div>' + addr.toString(16).toUpperCase().padStart(padLen, '0') + '   ' + hex + ' ' + ascii + '</div>';
    }
    return html;
  }

  function buildRegisterInspector() {
    var p = getPlatform();
    var regs = [];
    if (p.id === 'gb' || p.id === 'gbc') {
      regs = [
        { name: 'LCDC', addr: '0xFF40', desc: 'LCD Control', bits: ['BG Display', 'OBJ Enable', 'OBJ Size', 'BG Map', 'BG Tile Data', 'Window Enable', 'Window Map', 'LCD Enable'] },
        { name: 'STAT', addr: '0xFF41', desc: 'LCD Status' },
        { name: 'SCY', addr: '0xFF42', desc: 'Scroll Y' },
        { name: 'SCX', addr: '0xFF43', desc: 'Scroll X' },
        { name: 'LY', addr: '0xFF44', desc: 'LCD Y Coordinate' },
        { name: 'LYC', addr: '0xFF45', desc: 'LY Compare' },
        { name: 'DMA', addr: '0xFF46', desc: 'DMA Transfer' },
        { name: 'BGP', addr: '0xFF47', desc: 'BG Palette Data' },
        { name: 'OBP0', addr: '0xFF48', desc: 'OBJ Palette 0' },
        { name: 'OBP1', addr: '0xFF49', desc: 'OBJ Palette 1' },
        { name: 'WY', addr: '0xFF4A', desc: 'Window Y' },
        { name: 'WX', addr: '0xFF4B', desc: 'Window X' },
        { name: 'IE', addr: '0xFFFF', desc: 'Interrupt Enable' },
        { name: 'IF', addr: '0xFF0F', desc: 'Interrupt Flag' },
        { name: 'NR10', addr: '0xFF10', desc: 'Sound CH1 Sweep' },
        { name: 'NR11', addr: '0xFF11', desc: 'Sound CH1 Length/Duty' },
        { name: 'NR12', addr: '0xFF12', desc: 'Sound CH1 Volume' },
        { name: 'NR50', addr: '0xFF24', desc: 'Master Volume' },
        { name: 'NR51', addr: '0xFF25', desc: 'Sound Panning' },
        { name: 'NR52', addr: '0xFF26', desc: 'Sound On/Off' },
      ];
    } else if (p.id === 'gba') {
      regs = [
        { name: 'DISPCNT', addr: '0x04000000', desc: 'Display Control' },
        { name: 'DISPSTAT', addr: '0x04000004', desc: 'Display Status' },
        { name: 'VCOUNT', addr: '0x04000006', desc: 'Vertical Counter' },
        { name: 'BG0CNT', addr: '0x04000008', desc: 'BG0 Control' },
        { name: 'BG1CNT', addr: '0x0400000A', desc: 'BG1 Control' },
        { name: 'BG2CNT', addr: '0x0400000C', desc: 'BG2 Control' },
        { name: 'BG3CNT', addr: '0x0400000E', desc: 'BG3 Control' },
        { name: 'BG2PA-PD', addr: '0x04000020', desc: 'BG2 Affine Parameters' },
        { name: 'WIN0H/V', addr: '0x04000040', desc: 'Window 0 H/V' },
        { name: 'BLDCNT', addr: '0x04000050', desc: 'Blend Control' },
        { name: 'BLDALPHA', addr: '0x04000052', desc: 'Blend Alpha' },
        { name: 'SOUNDCNT_L', addr: '0x04000080', desc: 'Sound Control (PSG)' },
        { name: 'SOUNDCNT_H', addr: '0x04000082', desc: 'Sound Control (DMA)' },
        { name: 'DMA0SAD', addr: '0x040000B0', desc: 'DMA0 Source Address' },
        { name: 'TM0CNT', addr: '0x04000100', desc: 'Timer 0 Control' },
        { name: 'KEYINPUT', addr: '0x04000130', desc: 'Key Status' },
        { name: 'IE', addr: '0x04000200', desc: 'Interrupt Enable' },
        { name: 'IF', addr: '0x04000202', desc: 'Interrupt Flags' },
        { name: 'IME', addr: '0x04000208', desc: 'Interrupt Master Enable' },
      ];
    } else if (p.id === 'nds') {
      regs = [
        { name: 'DISPCNT (A)', addr: '0x04000000', desc: 'Engine A Display Control' },
        { name: 'DISPCNT (B)', addr: '0x04001000', desc: 'Engine B Display Control' },
        { name: 'VRAMCNT_A', addr: '0x04000240', desc: 'VRAM Bank A Control' },
        { name: 'POWCNT1', addr: '0x04000304', desc: 'Power Control' },
        { name: 'IPCSYNC', addr: '0x04000180', desc: 'IPC Sync Register' },
        { name: 'IPCFIFOCNT', addr: '0x04000184', desc: 'IPC FIFO Control' },
        { name: 'EXMEMCNT', addr: '0x04000204', desc: 'External Memory Control' },
        { name: 'GXSTAT', addr: '0x04000600', desc: '3D Geometry Engine Status' },
        { name: 'DISP3DCNT', addr: '0x04000060', desc: '3D Display Control' },
        { name: 'TOUCHCNT', addr: '0x04000000 (ARM7)', desc: 'Touchscreen Control (SPI)' },
        { name: 'SOUNDCNT', addr: '0x04000500', desc: 'Sound Control' },
        { name: 'IE', addr: '0x04000210', desc: 'Interrupt Enable' },
        { name: 'IF', addr: '0x04000214', desc: 'Interrupt Flags' },
        { name: 'IME', addr: '0x04000208', desc: 'Interrupt Master Enable' },
      ];
    } else {
      regs = [
        { name: 'SP_STATUS', addr: '0x04040010', desc: 'RSP Status Register' },
        { name: 'DPC_STATUS', addr: '0x0410000C', desc: 'RDP Status' },
        { name: 'MI_INTR', addr: '0x04300008', desc: 'MI Interrupt Register' },
        { name: 'MI_MASK', addr: '0x0430000C', desc: 'MI Interrupt Mask' },
        { name: 'VI_STATUS', addr: '0x04400000', desc: 'Video Interface Status' },
        { name: 'VI_ORIGIN', addr: '0x04400004', desc: 'Framebuffer Origin' },
        { name: 'VI_WIDTH', addr: '0x04400008', desc: 'Framebuffer Width' },
        { name: 'VI_V_INTR', addr: '0x0440000C', desc: 'Vertical Interrupt' },
        { name: 'VI_CURRENT', addr: '0x04400010', desc: 'Current Vertical Line' },
        { name: 'AI_DRAM_ADDR', addr: '0x04500000', desc: 'Audio DMA Address' },
        { name: 'AI_LEN', addr: '0x04500004', desc: 'Audio DMA Length' },
        { name: 'PI_STATUS', addr: '0x04600010', desc: 'Peripheral Interface Status' },
        { name: 'SI_STATUS', addr: '0x04800018', desc: 'Serial Interface Status' },
      ];
    }
    var html = platformBadge(p);
    html += '<div style="font-size:11px;color:var(--text2);margin-bottom:8px;">CPU Registers: ' + (p.registers || []).join(', ') + '</div>';
    html += '<table class="ref-table"><tr><th>Register</th><th>Address</th><th>Value</th><th>Description</th></tr>';
    for (var i = 0; i < regs.length; i++) {
      var r = regs[i];
      html += '<tr><td style="font-weight:700;color:var(--accent);">' + r.name + '</td><td style="font-family:monospace;">' + r.addr + '</td><td style="font-family:monospace;">0x00</td><td>' + r.desc + '</td></tr>';
    }
    html += '</table>';
    return html;
  }

  function buildVRAMViewer() {
    var p = getPlatform();
    var bankOptions = '';
    if (p.id === 'gb') {
      bankOptions = '<option>Bank 0</option>';
    } else if (p.id === 'gbc') {
      bankOptions = '<option>Bank 0</option><option>Bank 1</option>';
    } else if (p.id === 'gba') {
      bankOptions = '<option>Charblock 0 (0x06000000)</option><option>Charblock 1 (0x06004000)</option><option>Charblock 2 (0x06008000)</option><option>Charblock 3 (0x0600C000)</option><option>OBJ Tiles (0x06010000)</option>';
    } else if (p.id === 'nds') {
      bankOptions = '<option>Bank A (128KB)</option><option>Bank B (128KB)</option><option>Bank C (128KB)</option><option>Bank D (128KB)</option><option>Bank E (64KB)</option><option>Bank F (16KB)</option><option>Bank G (16KB)</option><option>Bank H (32KB)</option><option>Bank I (16KB)</option>';
    } else {
      bankOptions = '<option>RDRAM Framebuffer</option><option>TMEM (4KB texture cache)</option>';
    }
    var viewModes = '<option>Tiles</option>';
    if (p.id === 'gb' || p.id === 'gbc') {
      viewModes += '<option>BG Map 0</option><option>BG Map 1</option>';
    } else if (p.id === 'gba') {
      viewModes += '<option>BG Screenblock</option><option>Bitmap Mode</option>';
    } else if (p.id === 'nds') {
      viewModes += '<option>BG Map</option><option>3D Texture</option>';
    } else {
      viewModes = '<option>Framebuffer (16-bit)</option><option>Framebuffer (32-bit)</option><option>TMEM Textures</option>';
    }
    return platformBadge(p) +
      '<div class="form-row" style="margin-bottom:12px;">' +
        '<div class="form-group"><label>VRAM Bank</label><select>' + bankOptions + '</select></div>' +
        '<div class="form-group"><label>View Mode</label><select>' + viewModes + '</select></div>' +
      '</div>' +
      '<div style="background:#0a0a1a;padding:16px;border-radius:4px;text-align:center;">' +
        '<canvas id="vramCanvas" width="256" height="192" style="image-rendering:pixelated;border:1px solid var(--border);width:512px;height:384px;background:#111;"></canvas>' +
      '</div>' +
      '<div style="margin-top:8px;font-size:11px;color:var(--text2);">' +
        'VRAM: ' + p.vram + ' | ' + (p.vramBanks ? p.vramBanks + ' bank(s)' : 'Unified memory') + ' | Tile Format: ' + p.tileFormat +
      '</div>';
  }

  function buildOAMViewer() {
    var p = getPlatform();
    if (p.id === 'n64') {
      return platformBadge(p) +
        '<div style="font-size:12px;color:var(--text2);margin-bottom:12px;">N64 does not have hardware sprite OAM. Sprites are rendered as RDP textured rectangles in the framebuffer.</div>' +
        '<div style="padding:24px;text-align:center;color:var(--text2);background:#0a0a1a;border-radius:4px;">No OAM available — use RDP rectangle commands for 2D sprite rendering.</div>';
    }
    var spriteBytes = (p.id === 'gb' || p.id === 'gbc') ? 4 : 8;
    var totalSprites = p.maxSprites || 40;
    var oamAddr = (p.id === 'gb' || p.id === 'gbc') ? '0xFE00' : (p.id === 'gba' ? '0x07000000' : '0x07000000');
    var totalBytes = totalSprites * spriteBytes;
    var html = platformBadge(p);
    html += '<div style="margin-bottom:8px;font-size:12px;color:var(--text2);">Object Attribute Memory - ' + totalSprites + ' sprites, ' + spriteBytes + ' bytes each (' + totalBytes + ' bytes at ' + oamAddr + ')</div>';
    var headers = '<tr><th>#</th><th>Y</th><th>X</th><th>Tile</th><th>Flags</th>';
    if (p.bits >= 16) {
      headers += '<th>Size</th><th>Affine</th><th>Priority</th><th>Palette</th>';
    } else {
      headers += '<th>Priority</th><th>Flip X</th><th>Flip Y</th><th>Palette</th>';
    }
    headers += '</tr>';
    html += '<table class="ref-table">' + headers;
    var showCount = Math.min(totalSprites, 40);
    for (var i = 0; i < showCount; i++) {
      if (p.bits >= 16) {
        html += '<tr><td>' + i + '</td><td>0</td><td>0</td><td>0x000</td><td>0x0000</td><td>8x8</td><td>-</td><td>0</td><td>0</td></tr>';
      } else {
        html += '<tr><td>' + i + '</td><td>0</td><td>0</td><td>0x00</td><td>0x00</td><td>-</td><td>-</td><td>-</td><td>OBP0</td></tr>';
      }
    }
    if (totalSprites > 40) {
      html += '<tr><td colspan="' + (p.bits >= 16 ? 9 : 9) + '" style="text-align:center;color:var(--text2);">... ' + (totalSprites - 40) + ' more sprites</td></tr>';
    }
    html += '</table>';
    return html;
  }

  function buildTileDataViewer() {
    var p = getPlatform();
    if (p.id === 'n64') {
      return platformBadge(p) +
        '<div style="font-size:12px;color:var(--text2);margin-bottom:12px;">N64 uses a framebuffer-based rendering system. Textures are loaded into TMEM (4KB) for RDP rendering.</div>' +
        '<div class="form-row"><div class="form-group"><label>Texture Format</label><select><option>RGBA16</option><option>RGBA32</option><option>CI4 (16-color indexed)</option><option>CI8 (256-color indexed)</option><option>IA8</option><option>IA16</option></select></div></div>' +
        '<div style="background:#0a0a1a;padding:16px;border-radius:4px;text-align:center;">' +
          '<canvas width="128" height="128" style="image-rendering:pixelated;width:384px;height:384px;border:1px solid var(--border);background:#111;"></canvas>' +
        '</div>' +
        '<div style="margin-top:8px;font-size:11px;color:var(--text2);">TMEM: 4KB texture cache | Textures loaded via DMA from ROM/RDRAM</div>';
    }
    var blockOptions = '';
    if (p.id === 'gb' || p.id === 'gbc') {
      blockOptions = '<option>Block 0 (0x8000-0x87FF, tiles 0-127)</option><option>Block 1 (0x8800-0x8FFF, tiles 128-255)</option><option>Block 2 (0x9000-0x97FF, tiles 256-383)</option>';
    } else if (p.id === 'gba') {
      blockOptions = '<option>Charblock 0 (0x06000000)</option><option>Charblock 1 (0x06004000)</option><option>Charblock 2 (0x06008000)</option><option>Charblock 3 (0x0600C000)</option><option>OBJ Charblock (0x06010000)</option>';
    } else {
      blockOptions = '<option>BG Tiles Engine A</option><option>BG Tiles Engine B</option><option>OBJ Tiles Engine A</option><option>OBJ Tiles Engine B</option>';
    }
    var formatOptions = '<option>' + p.tileFormat + ' (' + p.name + ')</option>';
    if (p.id === 'gba' || p.id === 'nds') {
      formatOptions = '<option>4BPP (16 colors)</option><option>8BPP (256 colors)</option>';
    }
    var tileBytes = (p.bpp <= 2) ? 16 : (p.bpp === 4 ? 32 : 64);
    return platformBadge(p) +
      '<div class="form-row" style="margin-bottom:12px;">' +
        '<div class="form-group"><label>Tile Block</label><select>' + blockOptions + '</select></div>' +
        '<div class="form-group"><label>Format</label><select>' + formatOptions + '</select></div>' +
      '</div>' +
      '<div style="background:#0a0a1a;padding:16px;border-radius:4px;text-align:center;">' +
        '<canvas width="128" height="128" style="image-rendering:pixelated;width:384px;height:384px;border:1px solid var(--border);background:#111;"></canvas>' +
      '</div>' +
      '<div style="margin-top:8px;font-size:11px;color:var(--text2);">' +
        'Each tile: ' + p.tileSize + 'x' + p.tileSize + ' pixels, ' + tileBytes + ' bytes (' + p.tileFormat + ') | VRAM: ' + p.vram +
      '</div>';
  }

  function buildBGMapViewer() {
    var p = getPlatform();
    if (p.id === 'n64') {
      return platformBadge(p) +
        '<div style="font-size:12px;color:var(--text2);margin-bottom:12px;">N64 uses framebuffer rendering — no hardware BG tile maps. Background is rendered directly to the framebuffer by the RDP.</div>' +
        '<div style="background:#0a0a1a;padding:16px;border-radius:4px;text-align:center;">' +
          '<canvas width="320" height="240" style="image-rendering:pixelated;width:640px;height:480px;border:1px solid var(--border);background:#111;"></canvas>' +
        '</div>' +
        '<div style="margin-top:8px;font-size:11px;color:var(--text2);">Framebuffer: ' + p.resolution + ' | Rendered by RDP</div>';
    }
    var mapOptions = '';
    if (p.id === 'gb' || p.id === 'gbc') {
      mapOptions = '<option>Map 0 (0x9800-0x9BFF)</option><option>Map 1 (0x9C00-0x9FFF)</option>';
    } else if (p.id === 'gba') {
      mapOptions = '<option>Screenblock 0-3 (BG0)</option><option>Screenblock 4-7 (BG1)</option><option>Screenblock 8-11 (BG2)</option><option>Screenblock 12-15 (BG3)</option>';
    } else {
      mapOptions = '<option>Engine A BG0</option><option>Engine A BG1</option><option>Engine A BG2</option><option>Engine A BG3</option><option>Engine B BG0</option><option>Engine B BG1</option>';
    }
    var mapSize = (p.id === 'gb' || p.id === 'gbc') ? '32x32 tiles (256x256 pixels)' : (p.id === 'gba' ? '32x32 or 64x64 tiles' : '32x32 tiles (per screen)');
    return platformBadge(p) +
      '<div class="form-row" style="margin-bottom:12px;">' +
        '<div class="form-group"><label>BG Map</label><select>' + mapOptions + '</select></div>' +
        '<div class="form-group"><label>Overlay</label><select><option>None</option><option>Grid</option><option>Viewport</option><option>Scroll Position</option></select></div>' +
      '</div>' +
      '<div style="background:#0a0a1a;padding:16px;border-radius:4px;text-align:center;">' +
        '<canvas width="256" height="256" style="image-rendering:pixelated;width:512px;height:512px;border:1px solid var(--border);background:#111;"></canvas>' +
      '</div>' +
      '<div style="margin-top:8px;font-size:11px;color:var(--text2);">' +
        'BG Map: ' + mapSize + ' | Viewport: ' + p.resolution +
      '</div>';
  }

  function buildSoundChannel(ch) {
    var p = getPlatform();
    if (p.id === 'n64') {
      return platformBadge(p) +
        '<div style="font-size:12px;color:var(--text2);margin-bottom:12px;">N64 audio is processed by the RSP (Reality Signal Processor) using microcode. There are no fixed hardware sound channels.</div>' +
        '<div class="form-group"><label>Audio Details</label></div>' +
        '<div style="background:#0a0a1a;padding:12px;border-radius:4px;font-size:12px;line-height:2;">' +
          '<div><span style="color:var(--accent);">Processor:</span> RSP (microcode-based)</div>' +
          '<div><span style="color:var(--accent);">Voices:</span> 16-32 (depends on microcode budget)</div>' +
          '<div><span style="color:var(--accent);">Format:</span> ADPCM compressed, Raw PCM</div>' +
          '<div><span style="color:var(--accent);">Output:</span> 44.1 kHz stereo DAC</div>' +
        '</div>';
    }
    if (p.id === 'gba' && ch > 4) {
      return platformBadge(p) +
        '<h3 style="color:var(--accent);margin-bottom:12px;">DMA Sound Channel ' + (ch === 5 ? 'A' : 'B') + '</h3>' +
        '<div style="font-size:12px;color:var(--text2);margin-bottom:12px;">GBA Direct Sound: 8-bit PCM audio streamed via DMA</div>' +
        '<div class="form-row">' +
          '<div class="form-group"><label>DMA Channel</label><select><option>DMA1</option><option>DMA2</option></select></div>' +
          '<div class="form-group"><label>Sample Rate</label><select><option>16384 Hz</option><option>32768 Hz</option><option selected>65536 Hz</option></select></div>' +
          '<div class="form-group"><label>Timer</label><select><option>Timer 0</option><option>Timer 1</option></select></div>' +
        '</div>' +
        '<div class="form-row" style="margin-top:12px;"><button class="btn">Play Test</button><button class="btn">Stop</button><button class="btn">Export</button></div>';
    }
    if (p.id === 'nds' && ch > 4) {
      return platformBadge(p) +
        '<h3 style="color:var(--accent);margin-bottom:12px;">PCM Channel ' + ch + '</h3>' +
        '<div class="form-row">' +
          '<div class="form-group"><label>Format</label><select><option>PCM8</option><option selected>PCM16</option><option>IMA-ADPCM</option></select></div>' +
          '<div class="form-group"><label>Sample Rate</label><input type="number" value="22050" min="1" max="65536"></div>' +
          '<div class="form-group"><label>Volume</label><input type="range" min="0" max="127" value="127"></div>' +
          '<div class="form-group"><label>Pan</label><input type="range" min="0" max="127" value="64"></div>' +
        '</div>' +
        '<div class="form-row" style="margin-top:12px;"><button class="btn">Play Test</button><button class="btn">Stop</button><button class="btn">Export</button></div>';
    }
    var chInfo = {
      1: { name: 'Square Wave + Sweep', regs: ['NR10 (Sweep)', 'NR11 (Length/Duty)', 'NR12 (Volume Envelope)', 'NR13 (Frequency Lo)', 'NR14 (Frequency Hi/Control)'] },
      2: { name: 'Square Wave', regs: ['NR21 (Length/Duty)', 'NR22 (Volume Envelope)', 'NR23 (Frequency Lo)', 'NR24 (Frequency Hi/Control)'] },
      3: { name: 'Wave Output', regs: ['NR30 (DAC Enable)', 'NR31 (Length)', 'NR32 (Output Level)', 'NR33 (Frequency Lo)', 'NR34 (Frequency Hi/Control)'] },
      4: { name: 'Noise', regs: ['NR41 (Length)', 'NR42 (Volume Envelope)', 'NR43 (Polynomial Counter)', 'NR44 (Control)'] },
    };
    var info = chInfo[ch];
    if (!info) return '<div style="color:var(--text2);">Invalid channel</div>';
    var html = platformBadge(p);
    html += '<h3 style="color:var(--accent);margin-bottom:12px;">Channel ' + ch + ': ' + info.name + '</h3>';
    if (p.id === 'gba') {
      html += '<div style="font-size:11px;color:var(--text2);margin-bottom:8px;">Legacy GB sound channel (GBA also has 2 Direct Sound DMA channels)</div>';
    }
    html += '<div class="form-group"><label>Registers</label></div>';
    for (var i = 0; i < info.regs.length; i++) {
      html += '<div class="form-row"><div class="form-group"><label>' + info.regs[i] + '</label><input type="text" value="0x00" style="font-family:monospace;"></div></div>';
    }
    if (ch <= 2) {
      html += '<div class="form-group"><label>Duty Cycle</label><select><option>12.5%</option><option selected>25%</option><option>50%</option><option>75%</option></select></div>';
    }
    if (ch === 3) {
      html += '<div class="form-group"><label>Wave Pattern (32 x 4-bit samples)</label><input type="text" value="01234567 89ABCDEF FEDCBA98 76543210" style="font-family:monospace;"></div>';
    }
    html += '<div class="form-row" style="margin-top:12px;"><button class="btn" onclick="">Play Test</button><button class="btn" onclick="">Stop</button><button class="btn" onclick="">Export</button></div>';
    return html;
  }

  function buildMusicComposer() {
    var p = getPlatform();
    var chCount = p.soundChannels || 4;
    var chLabels = [];
    if (p.id === 'gb' || p.id === 'gbc') {
      chLabels = ['CH1 Square', 'CH2 Square', 'CH3 Wave', 'CH4 Noise'];
    } else if (p.id === 'gba') {
      chLabels = ['CH1 Square', 'CH2 Square', 'CH3 Wave', 'CH4 Noise', 'DMA A', 'DMA B'];
    } else if (p.id === 'nds') {
      chLabels = [];
      for (var i = 0; i < 16; i++) chLabels.push('CH' + i);
    } else {
      chLabels = ['RSP Voice 1', 'RSP Voice 2', 'RSP Voice 3', 'RSP Voice 4'];
      chCount = 4;
    }
    var dispCols = Math.min(chLabels.length, 8);
    var colWidth = '1fr '.repeat(dispCols);
    var chColors = ['#ff6b6b', '#51cf66', '#339af0', '#ffd43b', '#cc5de8', '#ff922b', '#20c997', '#868e96', '#f06595', '#5c7cfa', '#94d82d', '#fcc419', '#ff6b6b', '#51cf66', '#339af0', '#ffd43b'];
    var headerHtml = '<div style="color:var(--text2);">Row</div>';
    for (var j = 0; j < dispCols; j++) {
      headerHtml += '<div style="color:' + chColors[j % chColors.length] + ';text-align:center;">' + chLabels[j] + '</div>';
    }
    var exportLabel = (p.id === 'gb' || p.id === 'gbc') ? 'Export to GBT' : (p.id === 'gba' ? 'Export to Maxmod' : 'Export');
    return platformBadge(p) +
      '<div class="form-row" style="margin-bottom:12px;">' +
        '<div class="form-group"><label>Song</label><select><option>New Song</option><option>Title Theme</option><option>Battle Music</option><option>Dungeon Ambience</option><option>Victory Fanfare</option></select></div>' +
        '<div class="form-group"><label>Tempo (BPM)</label><input type="number" value="120" min="40" max="300"></div>' +
        '<div class="form-group"><label>Time Signature</label><select><option>4/4</option><option>3/4</option><option>6/8</option></select></div>' +
      '</div>' +
      '<div style="font-size:11px;color:var(--text2);margin-bottom:6px;">' + p.soundChannels + ' sound channels: ' + p.soundDesc + '</div>' +
      '<div style="background:#0a0a1a;padding:12px;border-radius:4px;margin-bottom:12px;">' +
        '<div style="font-size:11px;color:var(--text2);margin-bottom:8px;">TRACKER VIEW (' + chLabels.length + ' Channels)</div>' +
        '<div style="display:grid;grid-template-columns:40px ' + colWidth + ';gap:2px;font-family:monospace;font-size:11px;">' +
          headerHtml +
          generateTrackerRows(16, dispCols, chColors) +
        '</div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;">' +
        '<button class="btn btn-primary">Play</button>' +
        '<button class="btn">Stop</button>' +
        '<button class="btn">' + exportLabel + '</button>' +
        '<button class="btn">Import MID</button>' +
      '</div>';
  }

  function generateTrackerRows(count, cols, colors) {
    var html = '';
    var notes = ['C-4', 'D-4', 'E-4', 'F-4', 'G-4', 'A-4', 'B-4', 'C-5', '---', '---', '---', '---', 'C-4', '---', 'E-4', '---'];
    for (var i = 0; i < count; i++) {
      html += '<div style="color:var(--text2);text-align:right;">' + i.toString(16).toUpperCase().padStart(2, '0') + '</div>';
      for (var c = 0; c < cols; c++) {
        var note = (c === 0) ? notes[i % notes.length] + ' F 80' : (i % (c + 2) === 0 ? notes[(i + c) % notes.length] + ' A 80' : '--- - --');
        html += '<div style="color:' + colors[c % colors.length] + ';text-align:center;">' + note + '</div>';
      }
    }
    return html;
  }

  function buildSFXEditor() {
    var p = getPlatform();
    var channelOptions = '';
    if (p.id === 'gb' || p.id === 'gbc') {
      channelOptions = '<option>CH1</option><option>CH2</option><option>CH3</option><option selected>CH4</option>';
    } else if (p.id === 'gba') {
      channelOptions = '<option>CH1</option><option>CH2</option><option>CH3</option><option selected>CH4</option><option>DMA A</option><option>DMA B</option>';
    } else if (p.id === 'nds') {
      channelOptions = '';
      for (var i = 0; i < 16; i++) channelOptions += '<option' + (i === 0 ? ' selected' : '') + '>CH' + i + '</option>';
    } else {
      channelOptions = '<option selected>RSP Voice</option>';
    }
    return platformBadge(p) +
      '<div class="form-row">' +
        '<div class="form-group"><label>Sound Effect</label>' +
          '<select><option>New SFX</option><option>Menu Select</option><option>Menu Cancel</option><option>Attack Hit</option><option>Attack Miss</option><option>Critical Hit</option><option>Level Up</option><option>Item Pickup</option><option>Door Open</option><option>Chest Open</option><option>Damage Taken</option><option>Heal</option><option>Spell Cast</option><option>Victory</option><option>Game Over</option></select>' +
        '</div>' +
        '<div class="form-group"><label>Channel</label><select>' + channelOptions + '</select></div>' +
        '<div class="form-group"><label>Duration (frames)</label><input type="number" value="15" min="1" max="255"></div>' +
      '</div>' +
      '<div class="form-group"><label>Frequency Start</label><input type="range" min="0" max="2047" value="1024" style="width:100%;"></div>' +
      '<div class="form-group"><label>Frequency End</label><input type="range" min="0" max="2047" value="512" style="width:100%;"></div>' +
      '<div class="form-group"><label>Volume Envelope</label>' +
        '<div style="display:flex;gap:12px;">' +
          '<div class="form-group"><label>Initial Volume</label><input type="number" value="15" min="0" max="15"></div>' +
          '<div class="form-group"><label>Direction</label><select><option>Decrease</option><option>Increase</option></select></div>' +
          '<div class="form-group"><label>Sweep Pace</label><input type="number" value="3" min="0" max="7"></div>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;margin-top:12px;">' +
        '<button class="btn btn-primary">Preview</button><button class="btn">Save SFX</button><button class="btn">Export C Code</button>' +
      '</div>';
  }

  function buildWaveEditor() {
    var p = getPlatform();
    if (p.id === 'n64') {
      return platformBadge(p) +
        '<div style="font-size:12px;color:var(--text2);margin-bottom:12px;">N64 audio uses ADPCM samples processed by the RSP. There is no hardware wave RAM.</div>' +
        '<div style="padding:24px;text-align:center;color:var(--text2);background:#0a0a1a;border-radius:4px;">Use ADPCM sample editor for N64 audio content.</div>';
    }
    var desc = '';
    if (p.id === 'gb' || p.id === 'gbc') {
      desc = 'Wave RAM: 32 4-bit samples at 0xFF30-0xFF3F (16 bytes, 2 samples per byte)';
    } else if (p.id === 'gba') {
      desc = 'Wave RAM (legacy CH3): 32 4-bit samples, plus Direct Sound DMA for PCM audio';
    } else if (p.id === 'nds') {
      desc = 'PSG channels 8-13 support square wave, channels 14-15 support noise. PCM channels use sampled audio.';
    }
    return platformBadge(p) +
      '<div style="margin-bottom:12px;font-size:12px;color:var(--text2);">' + desc + '</div>' +
      '<div style="background:#0a0a1a;padding:16px;border-radius:4px;margin-bottom:12px;">' +
        '<canvas id="waveCanvas" width="320" height="120" style="width:100%;border:1px solid var(--border);background:#0a0a1a;"></canvas>' +
      '</div>' +
      '<div class="form-group"><label>Wave Data (hex)</label><input type="text" value="0123456789ABCDEFFEDCBA9876543210" style="font-family:monospace;"></div>' +
      '<div class="form-group"><label>Presets</label>' +
        '<div style="display:flex;gap:6px;flex-wrap:wrap;">' +
          '<button class="btn btn-sm">Sine</button><button class="btn btn-sm">Triangle</button><button class="btn btn-sm">Sawtooth</button>' +
          '<button class="btn btn-sm">Square 50%</button><button class="btn btn-sm">Square 25%</button><button class="btn btn-sm">Pulse</button><button class="btn btn-sm">Random</button>' +
        '</div>' +
      '</div>' +
      '<div class="form-group"><label>Output Level</label><select><option>Mute</option><option>100%</option><option>50%</option><option>25%</option></select></div>';
  }

  function build2BPPConverter() {
    var p = getPlatform();
    var inputFormats = '';
    var outputFormats = '';
    var tileInfo = '';
    if (p.id === 'gb' || p.id === 'gbc') {
      inputFormats = '<option>PNG Image</option><option>2BPP Binary</option><option>C Array</option><option>ASM Data</option>';
      outputFormats = '<option>2BPP Binary</option><option>PNG Image</option><option>C Array</option><option>ASM Data</option>';
      tileInfo = 'Each tile: 8x8 pixels, 16 bytes (2BPP) | 4 colors per tile';
    } else if (p.id === 'gba' || p.id === 'nds') {
      inputFormats = '<option>PNG Image</option><option>4BPP Binary</option><option>8BPP Binary</option><option>C Array</option>';
      outputFormats = '<option>4BPP Binary</option><option>8BPP Binary</option><option>PNG Image</option><option>C Array</option>';
      tileInfo = 'Tile formats: 4BPP (32 bytes, 16 colors) or 8BPP (64 bytes, 256 colors)';
    } else {
      inputFormats = '<option>PNG Image</option><option>RGBA16 Binary</option><option>RGBA32 Binary</option><option>CI4/CI8</option>';
      outputFormats = '<option>RGBA16 Binary</option><option>RGBA32 Binary</option><option>CI4/CI8</option><option>PNG Image</option>';
      tileInfo = 'N64 textures: RGBA16 (5551), RGBA32, CI4/CI8 indexed | TMEM: 4KB cache';
    }
    var palOptions = '';
    if (p.id === 'gb') {
      palOptions = '<option>DMG (4 shades)</option><option>Custom</option>';
    } else if (p.id === 'gbc') {
      palOptions = '<option>DMG (4 shades)</option><option>GBC Palette 0</option><option>Custom</option>';
    } else if (p.id === 'gba' || p.id === 'nds') {
      palOptions = '<option>16-color palette</option><option>256-color palette</option><option>Custom</option>';
    } else {
      palOptions = '<option>True Color (RGBA)</option><option>Color Index (CI)</option>';
    }
    return platformBadge(p) +
      '<div style="font-size:12px;color:var(--text2);margin-bottom:12px;">Convert between image formats and ' + p.name + ' tile/texture format.</div>' +
      '<div class="form-row">' +
        '<div class="form-group"><label>Input Format</label><select>' + inputFormats + '</select></div>' +
        '<div class="form-group"><label>Output Format</label><select>' + outputFormats + '</select></div>' +
      '</div>' +
      '<div class="form-row">' +
        '<div class="form-group"><label>Tile Size</label><select><option selected>8x8</option><option>8x16</option><option>16x16</option></select></div>' +
        '<div class="form-group"><label>Palette</label><select>' + palOptions + '</select></div>' +
      '</div>' +
      '<div style="display:flex;gap:16px;margin:16px 0;">' +
        '<div style="flex:1;background:#0a0a1a;padding:16px;border-radius:4px;text-align:center;border:1px dashed var(--border);">' +
          '<div style="font-size:11px;color:var(--text2);margin-bottom:8px;">INPUT</div>' +
          '<div style="color:var(--text2);">Drag & drop or click to select file</div>' +
        '</div>' +
        '<div style="display:flex;align-items:center;font-size:24px;color:var(--accent);">→</div>' +
        '<div style="flex:1;background:#0a0a1a;padding:16px;border-radius:4px;text-align:center;border:1px dashed var(--border);">' +
          '<div style="font-size:11px;color:var(--text2);margin-bottom:8px;">OUTPUT</div>' +
          '<div style="color:var(--text2);">Converted output will appear here</div>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;"><button class="btn btn-primary">Convert</button><button class="btn">Download Output</button></div>' +
      '<div style="margin-top:8px;font-size:11px;color:var(--text2);">' + tileInfo + '</div>';
  }

  function buildCHRConverter() {
    return buildCHRConverterStatic();
  }

  function buildCHRConverterStatic() {
    return '<div style="font-size:12px;color:var(--text2);margin-bottom:12px;">Convert NES CHR (Character ROM) format tiles. NES CHR uses planar 2BPP format (different bit arrangement than GB 2BPP).</div>' +
      '<div class="form-row">' +
        '<div class="form-group"><label>Input</label><select><option>NES CHR Binary</option><option>PNG Image</option><option>GB 2BPP</option></select></div>' +
        '<div class="form-group"><label>Output</label><select><option>GB 2BPP Binary</option><option>NES CHR Binary</option><option>PNG Image</option></select></div>' +
      '</div>' +
      '<div class="form-group"><label>NES Palette</label>' +
        '<div style="display:flex;gap:4px;">' +
          '<div style="width:24px;height:24px;background:#626262;border:1px solid var(--border);border-radius:2px;"></div>' +
          '<div style="width:24px;height:24px;background:#0000AB;border:1px solid var(--border);border-radius:2px;"></div>' +
          '<div style="width:24px;height:24px;background:#B53120;border:1px solid var(--border);border-radius:2px;"></div>' +
          '<div style="width:24px;height:24px;background:#FECCC5;border:1px solid var(--border);border-radius:2px;"></div>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;margin-top:12px;"><button class="btn btn-primary">Convert</button><button class="btn">Download</button></div>';
  }

  function buildColorPalette() {
    var p = getPlatform();
    var html = platformBadge(p);
    if (p.id === 'gb') {
      html += '<div style="font-size:12px;color:var(--text2);margin-bottom:12px;">DMG Game Boy: 4 shades of green, 1 BG palette + 2 OBJ palettes</div>';
      var dmgColors = [
        { name: 'BG Palette (BGP)', colors: ['#9BBC0F', '#8BAC0F', '#306230', '#0F380F'] },
        { name: 'OBJ Palette 0 (OBP0)', colors: ['transparent', '#9BBC0F', '#306230', '#0F380F'] },
        { name: 'OBJ Palette 1 (OBP1)', colors: ['transparent', '#9BBC0F', '#306230', '#0F380F'] },
      ];
      dmgColors.forEach(function(pal) {
        html += '<div style="margin-bottom:12px;"><div style="font-size:11px;color:var(--accent);margin-bottom:4px;font-weight:600;">' + pal.name + '</div><div style="display:flex;gap:6px;">';
        pal.colors.forEach(function(c, idx) {
          if (c === 'transparent') {
            html += '<div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="width:40px;height:30px;border:1px dashed var(--border);border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:8px;color:var(--text2);">TRANSP</div><span style="font-size:9px;color:var(--text2);">Color ' + idx + '</span></div>';
          } else {
            html += '<div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="width:40px;height:30px;background:' + c + ';border:1px solid var(--border);border-radius:2px;"></div><span style="font-size:9px;color:var(--text2);">Color ' + idx + '</span></div>';
          }
        });
        html += '</div></div>';
      });
      html += '<div style="font-size:11px;color:var(--text2);">DMG: 2-bit color (4 fixed shades) | No true color control</div>';
    } else if (p.id === 'gbc') {
      html += '<div style="font-size:12px;color:var(--text2);margin-bottom:12px;">GBC supports 8 BG palettes and 8 OBJ palettes, each with 4 colors (RGB555 format, 32768 colors total)</div>';
      var gbcPalettes = [
        { name: 'BG Palette 0', colors: ['#FFFFFF', '#AAAAAA', '#555555', '#000000'] },
        { name: 'BG Palette 1', colors: ['#E0F8D0', '#88C070', '#346856', '#081820'] },
        { name: 'BG Palette 2', colors: ['#F8D8B0', '#A09048', '#605020', '#201008'] },
        { name: 'OBJ Palette 0', colors: ['#FFFFFF', '#FF8888', '#883333', '#000000'] },
        { name: 'OBJ Palette 1', colors: ['#FFFFFF', '#88AAFF', '#334488', '#000000'] },
      ];
      gbcPalettes.forEach(function(pal) {
        html += '<div style="margin-bottom:12px;"><div style="font-size:11px;color:var(--accent);margin-bottom:4px;font-weight:600;">' + pal.name + '</div><div style="display:flex;gap:6px;">';
        pal.colors.forEach(function(c, idx) {
          html += '<div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><input type="color" value="' + c + '" style="width:40px;height:30px;border:1px solid var(--border);background:none;cursor:pointer;"><span style="font-size:9px;color:var(--text2);">Color ' + idx + '</span></div>';
        });
        html += '</div></div>';
      });
      html += '<div style="font-size:11px;color:var(--text2);">GBC RGB555: 5 bits per channel (32768 colors) | 8 BG palettes + 8 OBJ palettes x 4 colors each</div>';
    } else if (p.id === 'gba') {
      html += '<div style="font-size:12px;color:var(--text2);margin-bottom:12px;">GBA: RGB555 colors, 256 BG palette entries + 256 OBJ palette entries in Palette RAM (1KB total)</div>';
      html += '<div style="font-size:11px;color:var(--accent);font-weight:600;margin-bottom:4px;">BG Palette (256 entries, 16 sub-palettes of 16 colors)</div>';
      html += '<div style="display:flex;flex-wrap:wrap;gap:2px;margin-bottom:12px;">';
      for (var i = 0; i < 32; i++) {
        var hue = Math.floor(i * 360 / 32);
        html += '<div style="width:18px;height:18px;background:hsl(' + hue + ',60%,50%);border:1px solid var(--border);border-radius:2px;cursor:pointer;" title="Color ' + i + '"></div>';
      }
      html += '<div style="font-size:9px;color:var(--text2);width:100%;margin-top:4px;">Showing first 32 of 256 entries...</div></div>';
      html += '<div style="font-size:11px;color:var(--accent);font-weight:600;margin-bottom:4px;">OBJ Palette (256 entries)</div>';
      html += '<div style="display:flex;flex-wrap:wrap;gap:2px;margin-bottom:12px;">';
      for (var j = 0; j < 32; j++) {
        var hue2 = Math.floor(j * 360 / 32 + 180) % 360;
        html += '<div style="width:18px;height:18px;background:hsl(' + hue2 + ',60%,50%);border:1px solid var(--border);border-radius:2px;cursor:pointer;" title="Color ' + j + '"></div>';
      }
      html += '<div style="font-size:9px;color:var(--text2);width:100%;margin-top:4px;">Showing first 32 of 256 entries...</div></div>';
      html += '<div style="font-size:11px;color:var(--text2);">GBA RGB555: 5 bits per channel (32768 colors) | Palette RAM at 0x05000000 | 4BPP mode: 16 sub-palettes of 16 | 8BPP mode: 1 palette of 256</div>';
    } else if (p.id === 'nds') {
      html += '<div style="font-size:12px;color:var(--text2);margin-bottom:12px;">NDS: Extended palette support, standard + extended palette RAM per engine. RGB555 + alpha.</div>';
      html += '<div style="font-size:11px;color:var(--accent);font-weight:600;margin-bottom:4px;">Standard Palettes (Engine A)</div>';
      html += '<div style="display:flex;flex-wrap:wrap;gap:2px;margin-bottom:8px;">';
      for (var k = 0; k < 32; k++) {
        var hue3 = Math.floor(k * 360 / 32);
        html += '<div style="width:18px;height:18px;background:hsl(' + hue3 + ',70%,50%);border:1px solid var(--border);border-radius:2px;cursor:pointer;"></div>';
      }
      html += '</div>';
      html += '<div style="font-size:11px;color:var(--accent);font-weight:600;margin-bottom:4px;">Extended Palettes (16 slots x 256 colors)</div>';
      html += '<div style="font-size:11px;color:var(--text2);margin-bottom:8px;">Extended palettes allow 16 BG palette slots with 256 colors each (4096 total colors available).</div>';
      html += '<div style="font-size:11px;color:var(--text2);">NDS RGB555+alpha | ' + p.maxColors + ' colors total | Standard + Extended palettes per engine</div>';
    } else {
      html += '<div style="font-size:12px;color:var(--text2);margin-bottom:12px;">N64: True color rendering (RGBA8888 / RGBA5551). No palette-based tile system — colors are per-vertex or per-texture.</div>';
      html += '<div style="font-size:11px;color:var(--accent);font-weight:600;margin-bottom:4px;">Color Formats</div>';
      html += '<table class="ref-table"><tr><th>Format</th><th>Bits</th><th>Colors</th><th>Use</th></tr>';
      html += '<tr><td>RGBA5551</td><td>16-bit</td><td>32768 + alpha</td><td>Textures (compact)</td></tr>';
      html += '<tr><td>RGBA8888</td><td>32-bit</td><td>16.7M + alpha</td><td>High quality textures</td></tr>';
      html += '<tr><td>CI4</td><td>4-bit indexed</td><td>16 per palette</td><td>Small textures (saves TMEM)</td></tr>';
      html += '<tr><td>CI8</td><td>8-bit indexed</td><td>256 per palette</td><td>Medium textures</td></tr>';
      html += '<tr><td>IA8</td><td>8-bit</td><td>16 intensity + 16 alpha</td><td>Grayscale with alpha</td></tr>';
      html += '</table>';
      html += '<div style="font-size:11px;color:var(--text2);margin-top:8px;">N64 TMEM: 4KB texture cache | Textures must fit in TMEM or be split across multiple RDP loads</div>';
    }
    return html;
  }

  function buildSpriteAnimator() {
    var p = getPlatform();
    var sizeOptions = '';
    if (p.spriteSizes && p.spriteSizes.length > 0) {
      for (var i = 0; i < p.spriteSizes.length; i++) {
        var sel = (p.spriteSizes[i] === '16x16') ? ' selected' : '';
        sizeOptions += '<option' + sel + '>' + p.spriteSizes[i] + '</option>';
      }
    } else {
      sizeOptions = '<option>N/A (framebuffer rendering)</option>';
    }
    return platformBadge(p) +
      '<div class="form-row">' +
        '<div class="form-group"><label>Sprite Sheet</label><select id="animSpriteSelect"><option>Select tile sheet...</option></select></div>' +
        '<div class="form-group"><label>Animation Name</label><input type="text" value="walk_down"></div>' +
      '</div>' +
      '<div class="form-row">' +
        '<div class="form-group"><label>Frame Size</label><select>' + sizeOptions + '</select></div>' +
        '<div class="form-group"><label>Frame Rate (FPS)</label><input type="number" value="8" min="1" max="60"></div>' +
        '<div class="form-group"><label>Loop</label><select><option selected>Loop</option><option>Once</option><option>Ping-Pong</option></select></div>' +
      '</div>' +
      '<div style="background:#0a0a1a;padding:16px;border-radius:4px;text-align:center;margin:12px 0;">' +
        '<canvas width="64" height="64" style="image-rendering:pixelated;width:128px;height:128px;border:1px solid var(--border);background:#111;"></canvas>' +
        '<div style="margin-top:8px;font-size:11px;color:var(--text2);">Preview</div>' +
      '</div>' +
      '<div class="form-group"><label>Frames</label><input type="text" value="0, 1, 2, 1" placeholder="Tile indices separated by commas"></div>' +
      '<div style="display:flex;gap:8px;"><button class="btn btn-primary">Play</button><button class="btn">Stop</button><button class="btn">Export C Code</button></div>';
  }

  function buildBGComposer() {
    var p = getPlatform();
    var layerOptions = '';
    if (p.id === 'gb' || p.id === 'gbc') {
      layerOptions = '<option>BG Layer (Background)</option><option>Window Layer (Overlay)</option>';
    } else if (p.id === 'gba') {
      layerOptions = '<option>BG0 (Text/Tile)</option><option>BG1 (Text/Tile)</option><option>BG2 (Text/Affine)</option><option>BG3 (Text/Affine)</option>';
    } else if (p.id === 'nds') {
      layerOptions = '<option>Engine A BG0</option><option>Engine A BG1</option><option>Engine A BG2</option><option>Engine A BG3</option><option>Engine B BG0</option><option>Engine B BG1</option>';
    } else {
      layerOptions = '<option>Framebuffer Layer</option>';
    }
    var mapDesc = (p.id === 'n64') ? 'Framebuffer: ' + p.resolution + ' — rendered by RDP' : '32x32 tile grid — Click to place tiles';
    return platformBadge(p) +
      '<div class="form-row">' +
        '<div class="form-group"><label>Background Layer</label><select>' + layerOptions + '</select></div>' +
        '<div class="form-group"><label>Tile Source</label><select><option>Tile Block 0</option><option>Tile Block 1</option><option>Tile Block 2</option></select></div>' +
      '</div>' +
      '<div style="background:#0a0a1a;padding:16px;border-radius:4px;text-align:center;margin:12px 0;">' +
        '<canvas width="256" height="256" style="image-rendering:pixelated;width:512px;height:512px;border:1px solid var(--border);background:#111;cursor:crosshair;"></canvas>' +
        '<div style="margin-top:8px;font-size:11px;color:var(--text2);">' + mapDesc + '</div>' +
      '</div>' +
      '<div class="form-row">' +
        '<div class="form-group"><label>Scroll X</label><input type="number" value="0" min="0" max="255"></div>' +
        '<div class="form-group"><label>Scroll Y</label><input type="number" value="0" min="0" max="255"></div>' +
      '</div>';
  }

  function buildROMHeader() {
    var p = getPlatform();
    var html = platformBadge(p);
    if (p.id === 'gb' || p.id === 'gbc') {
      html += '<table class="ref-table">' +
        '<tr><th>Field</th><th>Address</th><th>Value</th><th>Description</th></tr>' +
        '<tr><td>Entry Point</td><td>0x0100-0x0103</td><td><input type="text" value="00 C3 50 01" style="font-family:monospace;background:#12122a;border:1px solid #3a3a5c;color:var(--text);padding:2px 6px;width:100px;"></td><td>NOP; JP 0x0150</td></tr>' +
        '<tr><td>Nintendo Logo</td><td>0x0104-0x0133</td><td style="color:var(--green);">Valid ✓</td><td>48-byte scrolling logo</td></tr>' +
        '<tr><td>Title</td><td>0x0134-0x0143</td><td><input type="text" value="LABYRINTH" maxlength="15" style="font-family:monospace;background:#12122a;border:1px solid #3a3a5c;color:var(--text);padding:2px 6px;width:120px;"></td><td>Game title (ASCII)</td></tr>' +
        '<tr><td>CGB Flag</td><td>0x0143</td><td><select style="background:#12122a;border:1px solid #3a3a5c;color:var(--text);padding:2px;"><option value="0x80"' + (p.id === 'gbc' ? '' : ' selected') + '>0x80 (GBC Compatible)</option><option value="0xC0"' + (p.id === 'gbc' ? ' selected' : '') + '>0xC0 (GBC Only)</option><option value="0x00"' + (p.id === 'gb' ? ' selected' : '') + '>0x00 (DMG)</option></select></td><td>Color GB support</td></tr>' +
        '<tr><td>Cart Type</td><td>0x0147</td><td><select style="background:#12122a;border:1px solid #3a3a5c;color:var(--text);padding:2px;"><option>0x00 ROM</option><option>0x01 MBC1</option><option>0x03 MBC1+RAM+BAT</option><option>0x13 MBC3+RAM+BAT</option><option>0x19 MBC5</option><option selected>0x1B MBC5+RAM+BAT</option></select></td><td>Cartridge type</td></tr>' +
        '<tr><td>ROM Size</td><td>0x0148</td><td><select style="background:#12122a;border:1px solid #3a3a5c;color:var(--text);padding:2px;"><option>0x00 (32 KB)</option><option>0x01 (64 KB)</option><option>0x02 (128 KB)</option><option>0x03 (256 KB)</option><option selected>0x04 (512 KB)</option><option>0x05 (1 MB)</option><option>0x06 (2 MB)</option></select></td><td>ROM size</td></tr>' +
        '<tr><td>RAM Size</td><td>0x0149</td><td><select style="background:#12122a;border:1px solid #3a3a5c;color:var(--text);padding:2px;"><option>0x00 (None)</option><option>0x01 (2 KB)</option><option>0x02 (8 KB)</option><option selected>0x03 (32 KB)</option><option>0x04 (128 KB)</option></select></td><td>External RAM size</td></tr>' +
        '<tr><td>Header Checksum</td><td>0x014D</td><td style="font-family:monospace;">0x00</td><td>Complement check</td></tr>' +
        '<tr><td>Global Checksum</td><td>0x014E-0x014F</td><td style="font-family:monospace;">0x0000</td><td>Sum of all bytes</td></tr>' +
      '</table>';
    } else if (p.id === 'gba') {
      html += '<table class="ref-table">' +
        '<tr><th>Field</th><th>Offset</th><th>Value</th><th>Description</th></tr>' +
        '<tr><td>Entry Point</td><td>0x000-0x003</td><td style="font-family:monospace;">EA 00 00 06</td><td>ARM branch instruction</td></tr>' +
        '<tr><td>Nintendo Logo</td><td>0x004-0x09F</td><td style="color:var(--green);">Valid ✓</td><td>156-byte compressed logo</td></tr>' +
        '<tr><td>Game Title</td><td>0x0A0-0x0AB</td><td><input type="text" value="LABYRINTH" maxlength="12" style="font-family:monospace;background:#12122a;border:1px solid #3a3a5c;color:var(--text);padding:2px 6px;width:120px;"></td><td>12-char game title</td></tr>' +
        '<tr><td>Game Code</td><td>0x0AC-0x0AF</td><td><input type="text" value="ALBE" maxlength="4" style="font-family:monospace;background:#12122a;border:1px solid #3a3a5c;color:var(--text);padding:2px 6px;width:60px;"></td><td>4-char game code</td></tr>' +
        '<tr><td>Maker Code</td><td>0x0B0-0x0B1</td><td style="font-family:monospace;">01</td><td>Developer code</td></tr>' +
        '<tr><td>Software Version</td><td>0x0BC</td><td style="font-family:monospace;">0x00</td><td>Version number</td></tr>' +
        '<tr><td>Header Checksum</td><td>0x0BD</td><td style="font-family:monospace;">0x00</td><td>Complement check</td></tr>' +
      '</table>';
    } else if (p.id === 'nds') {
      html += '<table class="ref-table">' +
        '<tr><th>Field</th><th>Offset</th><th>Value</th><th>Description</th></tr>' +
        '<tr><td>Game Title</td><td>0x000-0x00B</td><td><input type="text" value="LABYRINTH" maxlength="12" style="font-family:monospace;background:#12122a;border:1px solid #3a3a5c;color:var(--text);padding:2px 6px;width:120px;"></td><td>12-char game title</td></tr>' +
        '<tr><td>Game Code</td><td>0x00C-0x00F</td><td><input type="text" value="ALBE" maxlength="4" style="font-family:monospace;background:#12122a;border:1px solid #3a3a5c;color:var(--text);padding:2px 6px;width:60px;"></td><td>4-char game code</td></tr>' +
        '<tr><td>ARM9 ROM Offset</td><td>0x020</td><td style="font-family:monospace;">0x00004000</td><td>ARM9 binary offset in ROM</td></tr>' +
        '<tr><td>ARM9 Entry</td><td>0x024</td><td style="font-family:monospace;">0x02000000</td><td>ARM9 entry address</td></tr>' +
        '<tr><td>ARM9 Load</td><td>0x028</td><td style="font-family:monospace;">0x02000000</td><td>ARM9 load address (RAM)</td></tr>' +
        '<tr><td>ARM7 ROM Offset</td><td>0x030</td><td style="font-family:monospace;">0x00008000</td><td>ARM7 binary offset in ROM</td></tr>' +
        '<tr><td>ARM7 Entry</td><td>0x034</td><td style="font-family:monospace;">0x03800000</td><td>ARM7 entry address</td></tr>' +
        '<tr><td>Icon/Title Offset</td><td>0x068</td><td style="font-family:monospace;">0x00000000</td><td>Icon + title data</td></tr>' +
        '<tr><td>Header Checksum</td><td>0x15E</td><td style="font-family:monospace;">0x0000</td><td>CRC16 of header</td></tr>' +
      '</table>';
    } else {
      html += '<table class="ref-table">' +
        '<tr><th>Field</th><th>Offset</th><th>Value</th><th>Description</th></tr>' +
        '<tr><td>PI BSD Register</td><td>0x00-0x03</td><td style="font-family:monospace;">0x80371240</td><td>PI config values</td></tr>' +
        '<tr><td>Clock Rate</td><td>0x04-0x07</td><td style="font-family:monospace;">0x0000000F</td><td>Clock rate override</td></tr>' +
        '<tr><td>Entry Point</td><td>0x08-0x0B</td><td style="font-family:monospace;">0x80000400</td><td>Program counter start</td></tr>' +
        '<tr><td>Release</td><td>0x0C-0x0F</td><td style="font-family:monospace;">0x00001449</td><td>SDK version</td></tr>' +
        '<tr><td>CRC1</td><td>0x10-0x13</td><td style="font-family:monospace;">0x00000000</td><td>Checksum 1</td></tr>' +
        '<tr><td>CRC2</td><td>0x14-0x17</td><td style="font-family:monospace;">0x00000000</td><td>Checksum 2</td></tr>' +
        '<tr><td>Game Title</td><td>0x20-0x33</td><td><input type="text" value="LABYRINTH" maxlength="20" style="font-family:monospace;background:#12122a;border:1px solid #3a3a5c;color:var(--text);padding:2px 6px;width:160px;"></td><td>Internal name (20 chars)</td></tr>' +
        '<tr><td>Game Code</td><td>0x3B-0x3E</td><td><input type="text" value="NLBE" maxlength="4" style="font-family:monospace;background:#12122a;border:1px solid #3a3a5c;color:var(--text);padding:2px 6px;width:60px;"></td><td>4-char game code</td></tr>' +
        '<tr><td>Cart ID</td><td>0x3F</td><td style="font-family:monospace;">N</td><td>Cartridge type</td></tr>' +
        '<tr><td>Country</td><td>0x3E</td><td style="font-family:monospace;">E</td><td>Region code</td></tr>' +
      '</table>';
    }
    html += '<div style="display:flex;gap:8px;margin-top:12px;"><button class="btn btn-primary">Apply Changes</button><button class="btn">Recalculate Checksums</button></div>';
    return html;
  }

  function buildBankManager() {
    var p = getPlatform();
    if (p.id !== 'gb' && p.id !== 'gbc') {
      return platformBadge(p) +
        '<div style="font-size:12px;color:var(--text2);margin-bottom:12px;">' + p.name + ' uses a flat memory model — no ROM bank switching required.</div>' +
        '<div style="padding:24px;text-align:center;color:var(--text2);background:#0a0a1a;border-radius:4px;">' +
          '<div style="font-size:14px;margin-bottom:8px;">Bank switching is not applicable for ' + p.name + '.</div>' +
          '<div style="font-size:11px;">ROM is accessed linearly up to ' + p.maxRom + '. Use the ROM Size Calculator for capacity planning.</div>' +
        '</div>';
    }
    var banks = [
      { id: 0, name: 'Bank 00', size: '16,384', used: '14,210', pct: 87, desc: 'Main code, strings' },
      { id: 1, name: 'Bank 01', size: '16,384', used: '12,800', pct: 78, desc: 'Credits, data' },
      { id: 2, name: 'Bank 02', size: '16,384', used: '15,100', pct: 92, desc: 'Floor strings, maps' },
      { id: 3, name: 'Bank 03', size: '16,384', used: '11,400', pct: 70, desc: 'Battle strings, items' },
      { id: 4, name: 'Bank 04', size: '16,384', used: '8,900', pct: 54, desc: 'Player data' },
      { id: 5, name: 'Bank 05', size: '16,384', used: '16,000', pct: 98, desc: 'Tile data' },
    ];
    var maxBanks = (p.id === 'gbc') ? 512 : 128;
    var totalBanks = 32;
    var html = platformBadge(p);
    html += '<div style="font-size:12px;color:var(--text2);margin-bottom:12px;">ROM Banks: ' + totalBanks + ' x 16KB = ' + (totalBanks * 16) + 'KB total | ' + (p.id === 'gbc' ? 'MBC5 supports up to ' + maxBanks + ' banks (' + p.maxRom + ')' : 'MBC1/3 supports up to ' + maxBanks + ' banks (' + p.maxRom + ')') + '</div>';
    html += '<table class="ref-table"><tr><th>Bank</th><th>Size</th><th>Used</th><th>Usage</th><th>Contents</th></tr>';
    banks.forEach(function(b) {
      var color = b.pct > 90 ? 'var(--red)' : b.pct > 70 ? 'var(--yellow)' : 'var(--green)';
      html += '<tr><td style="font-weight:600;">' + b.name + '</td><td>' + b.size + '</td><td>' + b.used + '</td>' +
        '<td><div style="width:100px;height:14px;background:#1a1a2e;border-radius:7px;overflow:hidden;">' +
          '<div style="width:' + b.pct + '%;height:100%;background:' + color + ';border-radius:7px;"></div>' +
        '</div><span style="font-size:10px;color:var(--text2);"> ' + b.pct + '%</span></td>' +
        '<td style="font-size:11px;color:var(--text2);">' + b.desc + '</td></tr>';
    });
    for (var i = 6; i < totalBanks; i++) {
      html += '<tr><td style="color:var(--text2);">Bank ' + i.toString().padStart(2, '0') + '</td><td>16,384</td><td>0</td>' +
        '<td><div style="width:100px;height:14px;background:#1a1a2e;border-radius:7px;"></div><span style="font-size:10px;color:var(--text2);"> 0%</span></td>' +
        '<td style="font-size:11px;color:var(--text2);">Empty</td></tr>';
    }
    html += '</table>';
    return html;
  }

  function buildROMSizeCalc() {
    var p = getPlatform();
    var html = platformBadge(p);
    if (p.id === 'gb' || p.id === 'gbc') {
      html += '<div class="form-row">' +
        '<div class="form-group"><label>Number of ROM Banks</label><input type="number" value="32" min="2" max="512"></div>' +
        '<div class="form-group"><label>Bank Size</label><input type="text" value="16,384 bytes" readonly></div>' +
        '<div class="form-group"><label>Total ROM Size</label><input type="text" value="512 KB (524,288 bytes)" readonly></div>' +
      '</div>';
      html += '<div style="margin:16px 0;">' +
        '<div style="font-size:12px;color:var(--accent);margin-bottom:8px;font-weight:600;">Size Breakdown</div>' +
        '<div style="display:flex;height:30px;border-radius:4px;overflow:hidden;border:1px solid var(--border);">' +
          '<div style="width:30%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:10px;color:#000;font-weight:600;">Code (30%)</div>' +
          '<div style="width:25%;background:var(--green);display:flex;align-items:center;justify-content:center;font-size:10px;color:#000;font-weight:600;">Tiles (25%)</div>' +
          '<div style="width:20%;background:var(--yellow);display:flex;align-items:center;justify-content:center;font-size:10px;color:#000;font-weight:600;">Strings (20%)</div>' +
          '<div style="width:10%;background:var(--purple);display:flex;align-items:center;justify-content:center;font-size:10px;color:#000;font-weight:600;">Maps (10%)</div>' +
          '<div style="width:15%;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--text2);">Free (15%)</div>' +
        '</div>' +
      '</div>';
      html += '<table class="ref-table"><tr><th>MBC Type</th><th>Max ROM</th><th>Max RAM</th><th>Banks</th></tr>' +
        '<tr><td>ROM Only</td><td>32 KB</td><td>None</td><td>2</td></tr>' +
        '<tr><td>MBC1</td><td>2 MB</td><td>32 KB</td><td>128</td></tr>' +
        '<tr><td>MBC3</td><td>2 MB</td><td>32 KB</td><td>128</td></tr>' +
        '<tr style="background:rgba(88,166,255,0.1);"><td style="font-weight:700;">MBC5</td><td>8 MB</td><td>128 KB</td><td>512</td></tr>' +
      '</table>';
    } else {
      html += '<div class="form-row">' +
        '<div class="form-group"><label>ROM Size</label><select>';
      var sizes = p.romSizes || [];
      for (var i = 0; i < sizes.length; i++) {
        html += '<option>' + sizes[i] + '</option>';
      }
      html += '</select></div>' +
        '<div class="form-group"><label>Max ROM</label><input type="text" value="' + p.maxRom + '" readonly></div>' +
      '</div>';
      html += '<div style="margin:16px 0;">' +
        '<div style="font-size:12px;color:var(--accent);margin-bottom:8px;font-weight:600;">Size Breakdown</div>' +
        '<div style="display:flex;height:30px;border-radius:4px;overflow:hidden;border:1px solid var(--border);">' +
          '<div style="width:25%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:10px;color:#000;font-weight:600;">Code (25%)</div>' +
          '<div style="width:35%;background:var(--green);display:flex;align-items:center;justify-content:center;font-size:10px;color:#000;font-weight:600;">Assets (35%)</div>' +
          '<div style="width:15%;background:var(--yellow);display:flex;align-items:center;justify-content:center;font-size:10px;color:#000;font-weight:600;">Audio (15%)</div>' +
          '<div style="width:10%;background:var(--purple);display:flex;align-items:center;justify-content:center;font-size:10px;color:#000;font-weight:600;">Data (10%)</div>' +
          '<div style="width:15%;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--text2);">Free (15%)</div>' +
        '</div>' +
      '</div>';
      html += '<table class="ref-table"><tr><th>Save Type</th><th>Size</th><th>Notes</th></tr>';
      var srams = p.sramSizes || [];
      for (var j = 0; j < srams.length; j++) {
        html += '<tr><td>' + srams[j] + '</td><td>-</td><td>-</td></tr>';
      }
      html += '</table>';
    }
    return html;
  }

  function buildChecksumValidator() {
    var p = getPlatform();
    var checksumInfo = '';
    if (p.id === 'gb' || p.id === 'gbc') {
      checksumInfo = '<div style="margin-bottom:8px;"><span style="color:var(--text2);">Header Checksum (0x014D):</span> <span style="color:var(--green);">0xAB ✓ Valid</span></div>' +
        '<div style="margin-bottom:8px;"><span style="color:var(--text2);">Expected:</span> <span style="color:var(--accent);">0xAB</span></div>' +
        '<div style="margin-bottom:16px;"><span style="color:var(--text2);">Calculated:</span> <span style="color:var(--accent);">0xAB</span></div>' +
        '<div style="margin-bottom:8px;"><span style="color:var(--text2);">Global Checksum (0x014E):</span> <span style="color:var(--green);">0x1234 ✓ Valid</span></div>';
    } else if (p.id === 'gba') {
      checksumInfo = '<div style="margin-bottom:8px;"><span style="color:var(--text2);">Header Checksum (0x0BD):</span> <span style="color:var(--green);">0x00 ✓ Valid</span></div>' +
        '<div style="margin-bottom:8px;"><span style="color:var(--text2);">Complement of bytes 0xA0-0xBC</span></div>';
    } else if (p.id === 'nds') {
      checksumInfo = '<div style="margin-bottom:8px;"><span style="color:var(--text2);">Header CRC16 (0x15E):</span> <span style="color:var(--green);">0x0000 ✓ Valid</span></div>' +
        '<div style="margin-bottom:8px;"><span style="color:var(--text2);">Secure Area CRC16:</span> <span style="color:var(--green);">✓ Valid</span></div>';
    } else {
      checksumInfo = '<div style="margin-bottom:8px;"><span style="color:var(--text2);">CRC1 (0x10-0x13):</span> <span style="color:var(--green);">0x00000000 ✓ Valid</span></div>' +
        '<div style="margin-bottom:8px;"><span style="color:var(--text2);">CRC2 (0x14-0x17):</span> <span style="color:var(--green);">0x00000000 ✓ Valid</span></div>' +
        '<div style="margin-bottom:8px;"><span style="color:var(--text2);">Computed using IPL3 boot code algorithm</span></div>';
    }
    return platformBadge(p) +
      '<div style="font-size:12px;color:var(--text2);margin-bottom:16px;">Validates the ' + p.name + ' ROM checksums.</div>' +
      '<div style="background:#0a0a1a;padding:16px;border-radius:4px;margin-bottom:12px;font-family:monospace;font-size:13px;">' + checksumInfo + '</div>' +
      '<div style="display:flex;gap:8px;"><button class="btn btn-primary">Validate ROM</button><button class="btn">Fix Checksums</button></div>';
  }

  function buildHexViewer() {
    var p = getPlatform();
    var addrWidth = (p.bits <= 8) ? 4 : 8;
    var defaultOffset = (p.bits <= 8) ? '0x0000' : '0x00000000';
    return platformBadge(p) +
      '<div class="form-row" style="margin-bottom:12px;">' +
        '<div class="form-group"><label>Offset</label><input type="text" value="' + defaultOffset + '" style="font-family:monospace;"></div>' +
        '<div class="form-group"><label>Bytes to Show</label><select><option>256</option><option selected>512</option><option>1024</option></select></div>' +
        '<div class="form-group"><label>Source</label><select><option>Built ROM (' + p.fileExtension + ')</option><option>Uploaded ROM</option></select></div>' +
      '</div>' +
      '<div style="background:#0a0a1a;padding:12px;border-radius:4px;font-family:monospace;font-size:11px;color:var(--green);max-height:400px;overflow:auto;">' +
        '<div style="color:var(--text2);margin-bottom:8px;">Offset   00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F  ASCII</div>' +
        generateHexRows(0x0100, 32, addrWidth) +
      '</div>';
  }

  function buildDisassembler() {
    var p = getPlatform();
    var defaultAddr = (p.bits <= 8) ? '0x0150' : '0x00000000';
    var exampleAsm = '';
    if (p.id === 'gb' || p.id === 'gbc') {
      exampleAsm =
        '<div><span style="color:var(--text2);">0x0150:</span> <span style="color:var(--accent);">DI</span></div>' +
        '<div><span style="color:var(--text2);">0x0151:</span> <span style="color:var(--accent);">LD SP,</span> <span style="color:var(--green);">0xFFFE</span></div>' +
        '<div><span style="color:var(--text2);">0x0154:</span> <span style="color:var(--accent);">LD A,</span> <span style="color:var(--green);">0x00</span></div>' +
        '<div><span style="color:var(--text2);">0x0156:</span> <span style="color:var(--accent);">LDH</span> <span style="color:var(--yellow);">[0xFF26]</span>, <span style="color:var(--green);">A</span></div>' +
        '<div><span style="color:var(--text2);">0x0158:</span> <span style="color:var(--accent);">LD A,</span> <span style="color:var(--green);">0x80</span></div>' +
        '<div><span style="color:var(--text2);">0x015A:</span> <span style="color:var(--accent);">LDH</span> <span style="color:var(--yellow);">[0xFF40]</span>, <span style="color:var(--green);">A</span></div>' +
        '<div><span style="color:var(--text2);">0x015C:</span> <span style="color:var(--accent);">CALL</span> <span style="color:var(--purple);">0x0200</span></div>' +
        '<div><span style="color:var(--text2);">0x015F:</span> <span style="color:var(--accent);">EI</span></div>' +
        '<div><span style="color:var(--text2);">0x0160:</span> <span style="color:var(--accent);">JP</span> <span style="color:var(--purple);">0x0180</span></div>';
    } else if (p.id === 'gba' || p.id === 'nds') {
      exampleAsm =
        '<div><span style="color:var(--text2);">0x08000000:</span> <span style="color:var(--accent);">b</span> <span style="color:var(--purple);">0x080000C0</span></div>' +
        '<div><span style="color:var(--text2);">0x080000C0:</span> <span style="color:var(--accent);">mov</span> <span style="color:var(--green);">r0, #0x04000000</span></div>' +
        '<div><span style="color:var(--text2);">0x080000C4:</span> <span style="color:var(--accent);">ldr</span> <span style="color:var(--green);">r1, =0x0403</span></div>' +
        '<div><span style="color:var(--text2);">0x080000C8:</span> <span style="color:var(--accent);">strh</span> <span style="color:var(--green);">r1, [r0]</span></div>' +
        '<div><span style="color:var(--text2);">0x080000CC:</span> <span style="color:var(--accent);">bl</span> <span style="color:var(--purple);">0x08000200</span></div>';
    } else {
      exampleAsm =
        '<div><span style="color:var(--text2);">0x80000400:</span> <span style="color:var(--accent);">addiu</span> <span style="color:var(--green);">$sp, $sp, -0x18</span></div>' +
        '<div><span style="color:var(--text2);">0x80000404:</span> <span style="color:var(--accent);">sw</span> <span style="color:var(--green);">$ra, 0x14($sp)</span></div>' +
        '<div><span style="color:var(--text2);">0x80000408:</span> <span style="color:var(--accent);">jal</span> <span style="color:var(--purple);">0x80000500</span></div>' +
        '<div><span style="color:var(--text2);">0x8000040C:</span> <span style="color:var(--accent);">nop</span></div>' +
        '<div><span style="color:var(--text2);">0x80000410:</span> <span style="color:var(--accent);">lui</span> <span style="color:var(--green);">$t0, 0xA460</span></div>';
    }
    var isaLabel = (p.id === 'gb' || p.id === 'gbc') ? 'Z80-like (SM83)' : (p.id === 'gba' || p.id === 'nds' ? 'ARM / Thumb' : 'MIPS VR4300');
    return platformBadge(p) +
      '<div class="form-row" style="margin-bottom:12px;">' +
        '<div class="form-group"><label>Start Address</label><input type="text" value="' + defaultAddr + '" style="font-family:monospace;"></div>' +
        '<div class="form-group"><label>Instructions</label><input type="number" value="32" min="1" max="256"></div>' +
        '<div class="form-group"><label>ISA</label><input type="text" value="' + isaLabel + '" readonly></div>' +
      '</div>' +
      '<div style="background:#0a0a1a;padding:12px;border-radius:4px;font-family:monospace;font-size:12px;max-height:400px;overflow:auto;line-height:1.8;">' +
        exampleAsm +
      '</div>';
  }

  function buildMemoryMap() {
    var p = getPlatform();
    var map = p.memoryMap || {};
    var keys = Object.keys(map);
    var regionColors = ['#58a6ff', '#64ffda', '#bc8cff', '#d29922', '#3fb950', '#f85149', '#ffd43b', '#ff6b6b', '#339af0', '#cc5de8', '#20c997', '#868e96'];
    var html = platformBadge(p);
    html += '<table class="ref-table"><tr><th>Start</th><th>End</th><th>Size</th><th>Region</th><th>Description</th></tr>';
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var r = map[k];
      var color = regionColors[i % regionColors.length];
      html += '<tr><td style="font-family:monospace;">' + r.start + '</td><td style="font-family:monospace;">' + r.end + '</td><td>' + r.size + '</td>' +
        '<td><span style="display:inline-block;width:10px;height:10px;background:' + color + ';border-radius:2px;margin-right:6px;vertical-align:middle;"></span>' + k + '</td>' +
        '<td style="font-size:11px;color:var(--text2);">' + r.desc + '</td></tr>';
    }
    html += '</table>';
    return html;
  }

  function buildBreakpoints() {
    var p = getPlatform();
    var defaultAddr = (p.bits <= 8) ? '0x0150' : '0x00000000';
    return platformBadge(p) +
      '<div style="font-size:12px;color:var(--text2);margin-bottom:12px;">Set breakpoints for debugging. Breakpoints pause emulation at the specified address.</div>' +
      '<div class="form-row" style="margin-bottom:12px;">' +
        '<div class="form-group"><label>Address</label><input type="text" value="' + defaultAddr + '" style="font-family:monospace;" id="bpAddr"></div>' +
        '<div class="form-group"><label>Type</label><select><option>Execute</option><option>Read</option><option>Write</option></select></div>' +
        '<div class="form-group" style="padding-top:18px;"><button class="btn btn-primary">Add Breakpoint</button></div>' +
      '</div>' +
      '<table class="ref-table">' +
        '<tr><th>Enabled</th><th>Address</th><th>Type</th><th>Hits</th><th>Actions</th></tr>' +
        '<tr><td><input type="checkbox" checked></td><td style="font-family:monospace;">' + defaultAddr + '</td><td>Execute</td><td>0</td><td><button class="btn btn-sm btn-danger">Remove</button></td></tr>' +
      '</table>';
  }

  function buildProfiler() {
    var p = getPlatform();
    var clockHz = '4,194,304';
    var fps = '59.73';
    var cyclesPerFrame = '70,224';
    var metrics = [];
    if (p.id === 'gb' || p.id === 'gbc') {
      clockHz = p.id === 'gbc' ? '8,388,608 Hz (double speed)' : '4,194,304 Hz';
      fps = '59.73 FPS';
      cyclesPerFrame = p.id === 'gbc' ? '140,448' : '70,224';
      metrics = [
        { name: 'VBlank Handler', val: '1,200 cycles', budget: '4,560 cycles', pct: 26 },
        { name: 'HBlank Handler', val: '80 cycles', budget: '204 cycles', pct: 39 },
        { name: 'Main Loop', val: '45,000 cycles', budget: '65,664 cycles', pct: 69 },
        { name: 'OAM DMA', val: '640 cycles', budget: '640 cycles', pct: 100 },
      ];
    } else if (p.id === 'gba') {
      clockHz = '16,780,000 Hz';
      fps = '59.73 FPS';
      cyclesPerFrame = '280,896';
      metrics = [
        { name: 'VBlank Handler', val: '12,000 cycles', budget: '83,776 cycles', pct: 14 },
        { name: 'HBlank Handler', val: '200 cycles', budget: '1,232 cycles', pct: 16 },
        { name: 'Main Loop', val: '180,000 cycles', budget: '197,120 cycles', pct: 91 },
        { name: 'DMA Transfers', val: '4,000 cycles', budget: '-', pct: 0 },
      ];
    } else if (p.id === 'nds') {
      clockHz = '67,028,000 Hz (ARM9) + 33,514,000 Hz (ARM7)';
      fps = '59.83 FPS';
      cyclesPerFrame = '1,120,380 (ARM9)';
      metrics = [
        { name: 'ARM9 VBlank', val: '50,000 cycles', budget: '200,000 cycles', pct: 25 },
        { name: 'ARM9 Main Loop', val: '800,000 cycles', budget: '920,380 cycles', pct: 87 },
        { name: 'ARM7 Audio', val: '15,000 cycles', budget: '560,000 cycles', pct: 3 },
        { name: '3D Rendering', val: '200,000 cycles', budget: '-', pct: 0 },
      ];
    } else {
      clockHz = '93,750,000 Hz';
      fps = '60 FPS (NTSC) / 50 FPS (PAL)';
      cyclesPerFrame = '1,562,500 (NTSC)';
      metrics = [
        { name: 'CPU Main Loop', val: '800,000 cycles', budget: '1,562,500 cycles', pct: 51 },
        { name: 'RSP (Geometry)', val: '-', budget: 'RSP-limited', pct: 0 },
        { name: 'RDP (Rasterize)', val: '-', budget: 'Fillrate-limited', pct: 0 },
        { name: 'Audio (RSP)', val: '-', budget: 'Varies by voices', pct: 0 },
      ];
    }
    var html = platformBadge(p);
    html += '<div style="font-size:12px;color:var(--text2);margin-bottom:12px;">Performance profiling for ' + p.name + ' (' + p.cpu + ').</div>';
    html += '<div class="form-row" style="margin-bottom:16px;">' +
      '<div class="form-group"><label>CPU Clock</label><input type="text" value="' + clockHz + '" readonly></div>' +
      '<div class="form-group"><label>Frame Rate</label><input type="text" value="' + fps + '" readonly></div>' +
      '<div class="form-group"><label>Cycles/Frame</label><input type="text" value="' + cyclesPerFrame + '" readonly></div>' +
    '</div>';
    html += '<table class="ref-table"><tr><th>Metric</th><th>Value</th><th>Budget</th><th>Usage</th></tr>';
    for (var i = 0; i < metrics.length; i++) {
      var m = metrics[i];
      var color = m.pct === 0 ? 'var(--text2)' : m.pct > 90 ? 'var(--red)' : m.pct > 60 ? 'var(--yellow)' : 'var(--green)';
      html += '<tr><td>' + m.name + '</td><td>' + m.val + '</td><td>' + m.budget + '</td><td style="color:' + color + ';">' + (m.pct > 0 ? m.pct + '%' : '-') + '</td></tr>';
    }
    html += '</table>';
    html += '<div style="margin-top:12px;"><button class="btn btn-primary">Start Profiling</button> <button class="btn">Reset</button></div>';
    return html;
  }

  function buildSceneManager() {
    var p = getPlatform();
    var ef = getEngineFeatures();
    var sceneModes = '';
    if (p.id === 'n64') {
      sceneModes = 'Framebuffer-based (3D scenes, software 2D)';
    } else if (p.id === 'nds') {
      sceneModes = 'Tile-based 2D (both screens) + 3D (top screen)';
    } else if (p.id === 'gba') {
      sceneModes = 'Tile-based (Mode 0-2) / Bitmap (Mode 3-5)';
    } else {
      sceneModes = 'Tile-based (BG + Window + OAM sprites)';
    }
    var bankCol = (p.id === 'gb' || p.id === 'gbc') ? '<th>Bank</th>' : '';
    var html = platformBadge(p);
    html += '<div style="font-size:12px;color:var(--text2);margin-bottom:12px;">' +
      'Scene rendering: ' + sceneModes + ' | Resolution: ' + p.resolution +
    '</div>';
    html += '<table class="ref-table"><tr><th>Scene</th><th>ID</th><th>Init Function</th>' + bankCol + '<th>Status</th></tr>';
    var scenes = [
      { name: 'Title Screen', id: 0, init: 'title_screen_init', bank: 'Bank 00', status: 'Active' },
      { name: 'Main Menu', id: 1, init: 'main_menu_init', bank: 'Bank 00', status: 'Idle' },
      { name: 'Hero Select', id: 2, init: 'hero_select_init', bank: 'Bank 00', status: 'Idle' },
      { name: 'Map Explore', id: 3, init: 'map_init', bank: 'Bank 00', status: 'Idle' },
      { name: 'Battle', id: 4, init: 'battle_init', bank: 'Bank 00', status: 'Idle' },
      { name: 'Inventory', id: 5, init: 'item_menu_init', bank: 'Bank 00', status: 'Idle' },
      { name: 'Credits', id: 6, init: 'credits_init', bank: 'Bank 01', status: 'Idle' },
    ];
    for (var i = 0; i < scenes.length; i++) {
      var s = scenes[i];
      var statusColor = s.status === 'Active' ? 'var(--green)' : 'var(--text2)';
      html += '<tr><td style="font-weight:600;">' + s.name + '</td><td>' + s.id + '</td><td style="font-family:monospace;">' + s.init + '</td>';
      if (p.id === 'gb' || p.id === 'gbc') html += '<td>' + s.bank + '</td>';
      html += '<td style="color:' + statusColor + ';">' + s.status + '</td></tr>';
    }
    html += '</table>';
    if (ef.scene && ef.scene.length > 0) {
      html += '<div style="font-size:11px;color:var(--text2);margin-top:8px;">Available transitions: ' + ef.scene.join(', ') + '</div>';
    }
    html += '<div style="margin-top:12px;"><button class="btn btn-primary">Add Scene</button> <button class="btn">Edit Scene</button></div>';
    return html;
  }

  function buildSceneProps() {
    var p = getPlatform();
    var bankOption = '';
    if (p.id === 'gb' || p.id === 'gbc') {
      bankOption = '<div class="form-group"><label>ROM Bank</label><select><option>Bank 00 (fixed)</option><option>Bank 01</option><option>Bank 02</option></select></div>';
    }
    return platformBadge(p) +
      '<div class="form-group"><label>Scene Name</label><input type="text" value="Map Explore"></div>' +
      '<div class="form-row">' +
        '<div class="form-group"><label>Scene ID</label><input type="number" value="3"></div>' +
        bankOption +
      '</div>' +
      '<div class="form-group"><label>Init Function</label><input type="text" value="map_init" style="font-family:monospace;"></div>' +
      '<div class="form-group"><label>Update Function</label><input type="text" value="map_update" style="font-family:monospace;"></div>' +
      '<div class="form-group"><label>Render Function</label><input type="text" value="map_render" style="font-family:monospace;"></div>' +
      '<div class="form-group"><label>Tileset</label><select><option>dungeon_tiles</option><option>overworld_tiles</option><option>menu_tiles</option></select></div>' +
      '<div class="form-group"><label>Background Music</label><select><option>None</option><option>Dungeon Theme</option><option>Battle Theme</option><option>Menu Theme</option></select></div>';
  }

  function buildTransition(type) {
    var p = getPlatform();
    return platformBadge(p) +
      '<div class="form-group"><label>Transition Type</label>' +
        '<select><option ' + (type === 'fade' ? 'selected' : '') + '>Fade</option><option ' + (type === 'slide' ? 'selected' : '') + '>Slide</option><option ' + (type === 'wipe' ? 'selected' : '') + '>Wipe</option><option ' + (type === 'custom' ? 'selected' : '') + '>Custom</option></select>' +
      '</div>' +
      '<div class="form-row">' +
        '<div class="form-group"><label>Duration (frames)</label><input type="number" value="30" min="1" max="255"></div>' +
        '<div class="form-group"><label>Direction</label><select><option>Left</option><option>Right</option><option>Up</option><option>Down</option></select></div>' +
      '</div>' +
      '<div class="form-group"><label>Easing</label><select><option>Linear</option><option>Ease In</option><option>Ease Out</option><option>Ease In/Out</option></select></div>' +
      '<div style="background:#0a0a1a;padding:24px;border-radius:4px;text-align:center;margin:12px 0;">' +
        '<div style="display:flex;gap:16px;justify-content:center;align-items:center;">' +
          '<div style="width:80px;height:72px;background:#333;border:1px solid var(--border);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--text2);">Scene A</div>' +
          '<div style="font-size:24px;color:var(--accent);">→</div>' +
          '<div style="width:80px;height:72px;background:#333;border:1px solid var(--border);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--text2);">Scene B</div>' +
        '</div>' +
      '</div>' +
      '<button class="btn btn-primary">Preview Transition</button>';
  }

  function buildEntityEditor() {
    var p = getPlatform();
    var ef = getEngineFeatures();
    var components = ef.entity || [];
    var html = platformBadge(p);
    html += '<div class="form-group"><label>Entity Name</label><input type="text" value="Player"></div>' +
      '<div class="form-row">' +
        '<div class="form-group"><label>Entity Type</label><select><option>Player</option><option>NPC</option><option>Monster</option><option>Item</option><option>Trigger</option><option>Projectile</option></select></div>' +
        '<div class="form-group"><label>Sprite</label><select><option>hero_warrior</option><option>hero_mage</option><option>hero_rogue</option><option>hero_cleric</option></select></div>' +
      '</div>';
    html += '<div style="font-size:11px;color:var(--accent);font-weight:600;margin:12px 0 8px;">Components (' + p.name + ')</div>';
    html += '<table class="ref-table"><tr><th>Component</th><th>Enabled</th><th>Description</th></tr>';
    for (var i = 0; i < components.length; i++) {
      var c = components[i];
      var isComp = c.indexOf('Component:') === 0;
      if (isComp) {
        var compName = c.replace('Component: ', '');
        html += '<tr><td>' + compName + '</td><td><input type="checkbox" checked></td><td style="font-size:11px;color:var(--text2);">' + c + '</td></tr>';
      }
    }
    if (components.length === 0) {
      html += '<tr><td>Transform</td><td><input type="checkbox" checked></td><td>x: 80, y: 72</td></tr>' +
        '<tr><td>Sprite Renderer</td><td><input type="checkbox" checked></td><td>tile: 0, palette: 0</td></tr>' +
        '<tr><td>Collision</td><td><input type="checkbox" checked></td><td>8x8, solid</td></tr>';
    }
    html += '</table>';
    html += '<div style="margin-top:12px;"><button class="btn">Add Component</button></div>';
    return html;
  }

  function buildComponentBrowser() {
    var p = getPlatform();
    var ef = getEngineFeatures();
    var html = platformBadge(p);
    var categories = [
      { name: 'Rendering', items: ef.rendering || [] },
      { name: 'Physics', items: ef.physics || [] },
      { name: 'Entity', items: ef.entity || [] },
      { name: 'Audio', items: ef.audio || [] },
      { name: 'Input', items: ef.input || [] },
      { name: 'Save', items: ef.save || [] },
    ];
    for (var c = 0; c < categories.length; c++) {
      var cat = categories[c];
      if (cat.items.length === 0) continue;
      html += '<div style="font-size:11px;color:var(--accent);font-weight:600;margin:12px 0 6px;">' + cat.name + '</div>';
      html += '<div class="tool-grid">';
      for (var i = 0; i < cat.items.length; i++) {
        html += '<div class="tool-card"><div class="tool-name">' + cat.items[i] + '</div></div>';
      }
      html += '</div>';
    }
    return html;
  }

  function buildPrefabManager() {
    return '<table class="ref-table">' +
        '<tr><th>Prefab</th><th>Type</th><th>Components</th><th>Instances</th><th>Actions</th></tr>' +
        '<tr><td>Hero Warrior</td><td>Player</td><td>7</td><td>1</td><td><button class="btn btn-sm">Edit</button></td></tr>' +
        '<tr><td>Skeleton</td><td>Monster</td><td>5</td><td>12</td><td><button class="btn btn-sm">Edit</button></td></tr>' +
        '<tr><td>Goblin</td><td>Monster</td><td>5</td><td>8</td><td><button class="btn btn-sm">Edit</button></td></tr>' +
        '<tr><td>Treasure Chest</td><td>Interactable</td><td>3</td><td>24</td><td><button class="btn btn-sm">Edit</button></td></tr>' +
        '<tr><td>Door</td><td>Trigger</td><td>2</td><td>18</td><td><button class="btn btn-sm">Edit</button></td></tr>' +
        '<tr><td>NPC Merchant</td><td>NPC</td><td>4</td><td>3</td><td><button class="btn btn-sm">Edit</button></td></tr>' +
        '<tr><td>Health Potion</td><td>Item</td><td>2</td><td>15</td><td><button class="btn btn-sm">Edit</button></td></tr>' +
      '</table>' +
      '<div style="margin-top:12px;"><button class="btn btn-primary">New Prefab</button></div>';
  }

  function buildEntityInspector() { return buildEntityEditor(); }

  function buildEventEditor() {
    return '<div class="form-group"><label>Event Name</label><input type="text" value="on_chest_open"></div>' +
      '<div class="form-group"><label>Trigger</label><select><option>Player Interact (A button)</option><option>On Collision</option><option>On Enter Zone</option><option>On Timer</option><option>On Variable Change</option></select></div>' +
      '<div style="font-size:11px;color:var(--accent);font-weight:600;margin:12px 0 8px;">Actions (executed in order)</div>' +
      '<div style="background:#0a0a1a;padding:12px;border-radius:4px;font-size:12px;line-height:2;">' +
        '<div><span style="color:var(--yellow);">1.</span> <span style="color:var(--accent);">IF</span> variable <span style="color:var(--green);">chest_3_opened</span> == <span style="color:var(--purple);">0</span></div>' +
        '<div style="padding-left:20px;"><span style="color:var(--yellow);">2.</span> <span style="color:var(--accent);">SHOW_TEXT</span> <span style="color:var(--green);">"You found a Health Potion!"</span></div>' +
        '<div style="padding-left:20px;"><span style="color:var(--yellow);">3.</span> <span style="color:var(--accent);">ADD_ITEM</span> <span style="color:var(--green);">HEALTH_POTION</span> x <span style="color:var(--purple);">1</span></div>' +
        '<div style="padding-left:20px;"><span style="color:var(--yellow);">4.</span> <span style="color:var(--accent);">SET_VAR</span> <span style="color:var(--green);">chest_3_opened</span> = <span style="color:var(--purple);">1</span></div>' +
        '<div style="padding-left:20px;"><span style="color:var(--yellow);">5.</span> <span style="color:var(--accent);">PLAY_SFX</span> <span style="color:var(--green);">sfx_chest_open</span></div>' +
        '<div><span style="color:var(--yellow);">6.</span> <span style="color:var(--accent);">ELSE</span></div>' +
        '<div style="padding-left:20px;"><span style="color:var(--yellow);">7.</span> <span style="color:var(--accent);">SHOW_TEXT</span> <span style="color:var(--green);">"The chest is empty."</span></div>' +
        '<div><span style="color:var(--yellow);">8.</span> <span style="color:var(--accent);">END_IF</span></div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;margin-top:12px;">' +
        '<button class="btn btn-primary">Add Action</button>' +
        '<button class="btn">Test Event</button>' +
      '</div>';
  }

  function buildVariableManager() {
    return '<div class="form-row" style="margin-bottom:12px;">' +
        '<div class="form-group"><label>Name</label><input type="text" placeholder="variable_name" id="newVarName"></div>' +
        '<div class="form-group"><label>Type</label><select><option>uint8</option><option>uint16</option><option>int8</option><option>bool</option></select></div>' +
        '<div class="form-group"><label>Default</label><input type="number" value="0"></div>' +
        '<div class="form-group" style="padding-top:18px;"><button class="btn btn-primary">Add</button></div>' +
      '</div>' +
      '<table class="ref-table">' +
        '<tr><th>Name</th><th>Type</th><th>Value</th><th>SRAM</th><th>Description</th></tr>' +
        '<tr><td style="font-family:monospace;">player_hp</td><td>uint8</td><td>20</td><td>Yes</td><td>Current HP</td></tr>' +
        '<tr><td style="font-family:monospace;">player_max_hp</td><td>uint8</td><td>20</td><td>Yes</td><td>Maximum HP</td></tr>' +
        '<tr><td style="font-family:monospace;">player_level</td><td>uint8</td><td>1</td><td>Yes</td><td>Player level</td></tr>' +
        '<tr><td style="font-family:monospace;">current_floor</td><td>uint8</td><td>1</td><td>Yes</td><td>Current dungeon floor</td></tr>' +
        '<tr><td style="font-family:monospace;">gold</td><td>uint16</td><td>0</td><td>Yes</td><td>Gold currency</td></tr>' +
        '<tr><td style="font-family:monospace;">boss_defeated</td><td>bool</td><td>0</td><td>Yes</td><td>Floor boss flag</td></tr>' +
      '</table>';
  }

  function buildScriptConsole() {
    return '<div style="background:#0a0a1a;padding:12px;border-radius:4px;font-family:monospace;font-size:12px;height:300px;overflow-y:auto;margin-bottom:12px;color:var(--green);line-height:1.8;">' +
        '<div style="color:var(--text2);">[Enchantment Engine Script Console v2.1]</div>' +
        '<div style="color:var(--text2);">> Type commands to interact with the game engine</div>' +
        '<div>> set player_hp 20</div>' +
        '<div style="color:var(--accent);">  player_hp = 20</div>' +
        '<div>> get current_floor</div>' +
        '<div style="color:var(--accent);">  current_floor = 1</div>' +
        '<div>> list entities</div>' +
        '<div style="color:var(--accent);">  [0] Player (80, 72)</div>' +
        '<div style="color:var(--accent);">  [1] NPC_Merchant (120, 88)</div>' +
        '<div style="color:var(--accent);">  [2] Chest_01 (48, 32)</div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;">' +
        '<input type="text" placeholder="Enter command..." style="flex:1;padding:6px 10px;background:#12122a;border:1px solid #3a3a5c;color:var(--text);border-radius:4px;font-family:monospace;">' +
        '<button class="btn btn-primary">Run</button>' +
      '</div>';
  }

  function buildStateMachine() {
    return '<div class="form-group"><label>State Machine Name</label><input type="text" value="player_state"></div>' +
      '<div style="font-size:11px;color:var(--accent);font-weight:600;margin:12px 0 8px;">States</div>' +
      '<table class="ref-table">' +
        '<tr><th>State</th><th>Entry Action</th><th>Update</th><th>Transitions</th></tr>' +
        '<tr><td style="font-weight:700;color:var(--green);">IDLE</td><td>stop_animation</td><td>check_input</td><td>→ WALKING, → MENU</td></tr>' +
        '<tr><td style="font-weight:700;">WALKING</td><td>play_walk_anim</td><td>move_player</td><td>→ IDLE, → ENCOUNTER</td></tr>' +
        '<tr><td style="font-weight:700;">BATTLE</td><td>init_battle</td><td>battle_update</td><td>→ IDLE, → GAME_OVER</td></tr>' +
        '<tr><td style="font-weight:700;">MENU</td><td>open_menu</td><td>menu_update</td><td>→ IDLE</td></tr>' +
        '<tr><td style="font-weight:700;">ENCOUNTER</td><td>random_check</td><td>-</td><td>→ BATTLE, → WALKING</td></tr>' +
        '<tr><td style="font-weight:700;color:var(--red);">GAME_OVER</td><td>show_game_over</td><td>wait_input</td><td>→ TITLE</td></tr>' +
      '</table>' +
      '<div style="margin-top:12px;"><button class="btn btn-primary">Add State</button> <button class="btn">Export C Code</button></div>';
  }

  function buildTriggerSystem() { return buildEventEditor(); }

  function buildCollisionEditor() {
    var p = getPlatform();
    var ef = getEngineFeatures();
    var collisionTypes = '';
    var physicsItems = ef.physics || [];
    if (physicsItems.length > 0) {
      for (var i = 0; i < physicsItems.length; i++) {
        collisionTypes += '<option>' + physicsItems[i] + '</option>';
      }
    } else {
      collisionTypes = '<option>Tile-based</option><option>Pixel-based (AABB)</option>';
    }
    var tileSizeOptions = '<option selected>8x8</option><option>16x16</option>';
    if (p.id === 'n64') {
      tileSizeOptions = '<option>N/A (3D collision)</option>';
    }
    return platformBadge(p) +
      '<div class="form-row">' +
        '<div class="form-group"><label>Collision Type</label><select>' + collisionTypes + '</select></div>' +
        '<div class="form-group"><label>Tile Size</label><select>' + tileSizeOptions + '</select></div>' +
      '</div>' +
      '<div style="background:#0a0a1a;padding:16px;border-radius:4px;text-align:center;margin:12px 0;">' +
        '<canvas width="256" height="256" style="image-rendering:pixelated;width:512px;height:512px;border:1px solid var(--border);background:#111;cursor:crosshair;"></canvas>' +
        '<div style="margin-top:8px;font-size:11px;color:var(--text2);">Click tiles to toggle collision (red = solid, green = passable)</div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;">' +
        '<button class="btn" style="color:var(--red);">Paint Solid</button>' +
        '<button class="btn" style="color:var(--green);">Paint Passable</button>' +
        '<button class="btn">Clear All</button>' +
        '<button class="btn btn-primary">Export</button>' +
      '</div>';
  }

  function buildHitboxTool() { return buildCollisionEditor(); }

  function buildMovementSystem() {
    var p = getPlatform();
    var moveTypes = '';
    if (p.bits <= 8) {
      moveTypes = '<option selected>4-Directional Grid</option><option>8-Directional Grid</option><option>Free Movement</option>';
    } else if (p.bits === 16) {
      moveTypes = '<option>4-Directional Grid</option><option>8-Directional Grid</option><option selected>Free Movement</option><option>Platformer (with gravity)</option>';
    } else if (p.bits === 32) {
      moveTypes = '<option>4-Directional Grid</option><option selected>Free Movement (2D)</option><option>Platformer (with gravity)</option><option>3D Movement</option><option>Touch-based Movement</option>';
    } else {
      moveTypes = '<option>Free Movement (2D)</option><option>3D Movement (analog stick)</option><option selected>3D Camera-relative</option>';
    }
    var featuresList = '';
    if (p.bits >= 64) {
      featuresList =
        '<label><input type="checkbox" checked> Collision detection (3D)</label><br>' +
        '<label><input type="checkbox" checked> Camera-relative movement</label><br>' +
        '<label><input type="checkbox" checked> Analog stick sensitivity</label><br>' +
        '<label><input type="checkbox"> Jump (with gravity)</label><br>' +
        '<label><input type="checkbox"> Swimming/climbing</label><br>' +
        '<label><input type="checkbox" checked> Trigger encounters</label><br>';
    } else {
      featuresList =
        '<label><input type="checkbox" checked> Collision detection</label><br>' +
        '<label><input type="checkbox" checked> Face direction on stop</label><br>' +
        '<label><input type="checkbox" checked> Animate while moving</label><br>' +
        '<label><input type="checkbox"> Diagonal movement</label><br>' +
        '<label><input type="checkbox"> Sprint (hold B)</label><br>' +
        '<label><input type="checkbox" checked> Trigger random encounters</label><br>';
    }
    return platformBadge(p) +
      '<div class="form-row">' +
        '<div class="form-group"><label>Movement Type</label><select>' + moveTypes + '</select></div>' +
        '<div class="form-group"><label>Speed (pixels/frame)</label><input type="number" value="1" min="1" max="8"></div>' +
      '</div>' +
      '<div class="form-row">' +
        '<div class="form-group"><label>Grid Size</label><select><option>8x8</option><option selected>16x16</option></select></div>' +
        '<div class="form-group"><label>Animation Frames</label><input type="number" value="4" min="1" max="8"></div>' +
      '</div>' +
      '<div class="form-group"><label>Features</label>' +
        '<div style="font-size:12px;line-height:2;color:var(--text);">' + featuresList + '</div>' +
      '</div>';
  }

  function buildPathfinding() {
    var p = getPlatform();
    var algos = '';
    if (p.bits <= 8) {
      algos = '<option>Simple (4-dir check)</option><option>Breadth-First Search</option><option>A* Pathfinding</option>';
    } else if (p.bits <= 16) {
      algos = '<option>Simple (4-dir check)</option><option>Breadth-First Search</option><option selected>A* Pathfinding</option><option>Jump Point Search</option>';
    } else {
      algos = '<option>A* Pathfinding (2D)</option><option selected>Navigation Mesh</option><option>Waypoint Graph</option><option>Flow Field</option>';
    }
    var noteText = '';
    if (p.bits <= 8) {
      noteText = 'Note: Full pathfinding is memory-intensive on ' + p.name + '. Simple directional checks are recommended for most NPC movement. A* can be used for boss AI or puzzle elements with limited search areas.';
    } else if (p.bits <= 16) {
      noteText = p.name + ' has enough WRAM for moderate A* pathfinding. Keep search areas bounded for real-time performance.';
    } else if (p.bits === 32) {
      noteText = p.name + ' supports navmesh-based pathfinding for both 2D and 3D scenes. The dual CPU allows offloading pathfinding to ARM7.';
    } else {
      noteText = 'N64 supports full 3D navigation mesh pathfinding. CPU budget allows complex AI with multiple agents.';
    }
    return platformBadge(p) +
      '<div class="form-row">' +
        '<div class="form-group"><label>Algorithm</label><select>' + algos + '</select></div>' +
        '<div class="form-group"><label>Max Search Depth</label><input type="number" value="' + (p.bits <= 8 ? 16 : 64) + '" min="1" max="256"></div>' +
      '</div>' +
      '<div style="font-size:12px;color:var(--text2);margin-top:12px;">' + noteText + '</div>';
  }

  function buildTextboxEditor() {
    var p = getPlatform();
    var tilesW = Math.floor(p.resW / (p.tileSize || 8));
    var tilesH = Math.floor(p.resH / (p.tileSize || 8));
    var maxW = tilesW || 20;
    var maxH = tilesH || 18;
    var defaultW = Math.min(18, maxW);
    var defaultH = Math.min(5, maxH);
    if (p.id === 'nds') {
      maxW = 32;
      maxH = 24;
    }
    if (p.id === 'n64') {
      maxW = 40;
      maxH = 30;
      defaultW = 36;
      defaultH = 6;
    }
    var previewW = Math.min(defaultW * 8, 320);
    return platformBadge(p) +
      '<div style="font-size:11px;color:var(--text2);margin-bottom:8px;">Screen: ' + p.resolution + ' | Grid: ' + tilesW + 'x' + tilesH + ' tiles (' + (p.tileSize || 8) + 'px)</div>' +
      '<div class="form-row">' +
        '<div class="form-group"><label>Text Box Style</label><select><option>Standard (bottom)</option><option>Full Screen</option><option>Top Bar</option><option>Dialog (portrait)</option></select></div>' +
        '<div class="form-group"><label>Width (tiles)</label><input type="number" value="' + defaultW + '" min="4" max="' + maxW + '"></div>' +
        '<div class="form-group"><label>Height (tiles)</label><input type="number" value="' + defaultH + '" min="2" max="' + maxH + '"></div>' +
      '</div>' +
      '<div class="form-group"><label>Preview Text</label><textarea rows="3" style="font-family:monospace;">You found a treasure chest!\nIt contains a Health Potion.\n[Press A to continue]</textarea></div>' +
      '<div style="background:#111;padding:24px;border-radius:4px;text-align:center;margin:12px 0;">' +
        '<div style="background:#000;border:2px solid #fff;padding:8px;display:inline-block;text-align:left;font-family:monospace;font-size:14px;color:#fff;min-width:' + previewW + 'px;image-rendering:pixelated;">' +
          'You found a treasure<br>chest! It contains a<br>Health Potion.<br><span style="color:#aaa;">▼</span>' +
        '</div>' +
      '</div>' +
      '<div class="form-row">' +
        '<div class="form-group"><label>Text Speed</label><select><option>Instant</option><option>Fast</option><option selected>Normal</option><option>Slow</option></select></div>' +
        '<div class="form-group"><label>Border Style</label><select><option selected>Single Line</option><option>Double Line</option><option>Custom Tiles</option></select></div>' +
      '</div>';
  }

  function buildMenuDesigner() {
    return '<div class="form-group"><label>Menu Name</label><input type="text" value="Main Pause Menu"></div>' +
      '<div style="font-size:11px;color:var(--accent);font-weight:600;margin:12px 0 8px;">Menu Items</div>' +
      '<table class="ref-table">' +
        '<tr><th>#</th><th>Label</th><th>Action</th><th>Enabled</th></tr>' +
        '<tr><td>1</td><td><input type="text" value="Items" style="background:#12122a;border:1px solid #3a3a5c;color:var(--text);padding:2px 6px;"></td><td>open_inventory</td><td><input type="checkbox" checked></td></tr>' +
        '<tr><td>2</td><td><input type="text" value="Stats" style="background:#12122a;border:1px solid #3a3a5c;color:var(--text);padding:2px 6px;"></td><td>open_stats</td><td><input type="checkbox" checked></td></tr>' +
        '<tr><td>3</td><td><input type="text" value="Equipment" style="background:#12122a;border:1px solid #3a3a5c;color:var(--text);padding:2px 6px;"></td><td>open_equip</td><td><input type="checkbox" checked></td></tr>' +
        '<tr><td>4</td><td><input type="text" value="Save" style="background:#12122a;border:1px solid #3a3a5c;color:var(--text);padding:2px 6px;"></td><td>save_game</td><td><input type="checkbox" checked></td></tr>' +
      '</table>' +
      '<div style="margin-top:12px;"><button class="btn">Add Item</button></div>';
  }

  function buildHUDLayout() {
    var p = getPlatform();
    var displayW = p.resW * 2;
    var displayH = p.resH * 2;
    if (p.id === 'nds') {
      displayH = 192 * 2;
    }
    return platformBadge(p) +
      '<div style="font-size:12px;color:var(--text2);margin-bottom:12px;">HUD elements displayed during gameplay (' + p.resolution + ' screen)</div>' +
      '<div style="background:#111;padding:24px;border-radius:4px;text-align:center;margin:12px 0;">' +
        '<div style="width:' + displayW + 'px;height:' + displayH + 'px;background:#000;border:2px solid var(--border);margin:0 auto;position:relative;image-rendering:pixelated;">' +
          '<div style="position:absolute;top:4px;left:4px;font-family:monospace;font-size:12px;color:#fff;">HP: 20/20</div>' +
          '<div style="position:absolute;top:16px;left:4px;font-family:monospace;font-size:12px;color:#88f;">MP: 8/8</div>' +
          '<div style="position:absolute;top:4px;right:4px;font-family:monospace;font-size:12px;color:#ff8;">F1</div>' +
          '<div style="position:absolute;bottom:4px;left:4px;font-family:monospace;font-size:12px;color:#aaa;">LV: 1</div>' +
          '<div style="position:absolute;bottom:4px;right:4px;font-family:monospace;font-size:12px;color:#ff0;">G: 0</div>' +
        '</div>' +
      '</div>' +
      '<table class="ref-table">' +
        '<tr><th>Element</th><th>Position</th><th>Visible</th><th>Layer</th></tr>' +
        '<tr><td>HP Display</td><td>Top-Left (0,0)</td><td><input type="checkbox" checked></td><td>' + (p.bits <= 8 ? 'Window' : 'OBJ/Overlay') + '</td></tr>' +
        '<tr><td>MP Display</td><td>Top-Left (0,1)</td><td><input type="checkbox" checked></td><td>' + (p.bits <= 8 ? 'Window' : 'OBJ/Overlay') + '</td></tr>' +
        '<tr><td>Floor Number</td><td>Top-Right</td><td><input type="checkbox" checked></td><td>' + (p.bits <= 8 ? 'Window' : 'OBJ/Overlay') + '</td></tr>' +
        '<tr><td>Level</td><td>Bottom-Left</td><td><input type="checkbox" checked></td><td>' + (p.bits <= 8 ? 'Window' : 'OBJ/Overlay') + '</td></tr>' +
        '<tr><td>Gold</td><td>Bottom-Right</td><td><input type="checkbox" checked></td><td>' + (p.bits <= 8 ? 'Window' : 'OBJ/Overlay') + '</td></tr>' +
      '</table>';
  }

  function buildDialogTree() {
    return '<div class="form-group"><label>Dialog Tree Name</label><input type="text" value="npc_merchant_dialog"></div>' +
      '<div style="background:#0a0a1a;padding:16px;border-radius:4px;font-size:12px;line-height:2;margin:12px 0;">' +
        '<div style="color:var(--accent);font-weight:600;">Start Node</div>' +
        '<div style="padding-left:12px;">' +
          '<div style="color:var(--text);">"Welcome, adventurer! What do you need?"</div>' +
          '<div style="padding-left:12px;">' +
            '<div style="color:var(--green);">→ [Buy Items] → buy_menu</div>' +
            '<div style="color:var(--green);">→ [Sell Items] → sell_menu</div>' +
            '<div style="color:var(--green);">→ [Tell me about the dungeon] → dungeon_info</div>' +
            '<div style="color:var(--green);">→ [Goodbye] → end</div>' +
          '</div>' +
        '</div>' +
        '<div style="color:var(--accent);font-weight:600;margin-top:8px;">dungeon_info</div>' +
        '<div style="padding-left:12px;">' +
          '<div style="color:var(--text);">"The labyrinth holds many secrets..."</div>' +
          '<div style="padding-left:12px;">' +
            '<div style="color:var(--green);">→ [Continue] → start</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;"><button class="btn btn-primary">Add Node</button> <button class="btn">Test Dialog</button> <button class="btn">Export</button></div>';
  }

  function buildFontManager() {
    var p = getPlatform();
    var charW = (p.tileSize || 8);
    var charH = (p.tileSize || 8);
    var storageNote = '';
    if (p.id === 'gb' || p.id === 'gbc') {
      storageNote = 'GB fonts are stored as tiles in VRAM. ASCII 32-127 = 96 characters x 16 bytes = 1,536 bytes.';
    } else if (p.id === 'gba') {
      storageNote = 'GBA fonts: 4BPP tiles in VRAM. 96 chars x 32 bytes = 3,072 bytes (4BPP) or 6,144 bytes (8BPP).';
    } else if (p.id === 'nds') {
      storageNote = 'NDS fonts: Can use hardware tile engine or software rendering. Extended character sets supported.';
    } else {
      storageNote = 'N64 fonts: Software-rendered from texture data in ROM. Variable-width fonts possible.';
    }
    return platformBadge(p) +
      '<div class="form-group"><label>Font</label><select><option>Default (built-in)</option><option>Custom Font</option></select></div>' +
      '<div class="form-row">' +
        '<div class="form-group"><label>Character Width</label><input type="number" value="' + charW + '" min="4" max="16"></div>' +
        '<div class="form-group"><label>Character Height</label><input type="number" value="' + charH + '" min="8" max="16"></div>' +
        '<div class="form-group"><label>Characters</label><input type="text" value="96" readonly></div>' +
      '</div>' +
      '<div style="background:#0a0a1a;padding:16px;border-radius:4px;text-align:center;margin:12px 0;">' +
        '<div style="font-family:monospace;font-size:16px;color:#fff;image-rendering:pixelated;line-height:1.5;">' +
          'ABCDEFGHIJKLM<br>NOPQRSTUVWXYZ<br>abcdefghijklm<br>nopqrstuvwxyz<br>0123456789!?.,' +
        '</div>' +
      '</div>' +
      '<div style="font-size:11px;color:var(--text2);">' + storageNote + '</div>';
  }

  function buildSRAMLayout() {
    var p = getPlatform();
    var html = platformBadge(p);
    var sramDesc = '';
    if (p.id === 'gb' || p.id === 'gbc') {
      sramDesc = 'SRAM: ' + (p.id === 'gbc' ? '32 KB (4 banks of 8KB)' : '8 KB') + ' at 0xA000-0xBFFF, battery-backed for save data';
    } else if (p.id === 'gba') {
      sramDesc = 'Save memory: SRAM (32KB), Flash (64/128KB), or EEPROM (512B/8KB) — depends on cart type';
    } else if (p.id === 'nds') {
      sramDesc = 'Save memory: EEPROM (4/64KB), Flash (256/512KB), or NAND — accessed via SPI bus';
    } else {
      sramDesc = 'Save memory: EEPROM (512B/2KB), SRAM (32KB), Flash (128KB), or Controller Pak (32KB)';
    }
    html += '<div style="font-size:12px;color:var(--text2);margin-bottom:12px;">' + sramDesc + '</div>';
    html += '<table class="ref-table"><tr><th>Offset</th><th>Size</th><th>Field</th><th>Type</th><th>Description</th></tr>';
    html += '<tr><td style="font-family:monospace;">0x0000</td><td>2</td><td>magic</td><td>uint16</td><td>Save file magic number</td></tr>';
    html += '<tr><td style="font-family:monospace;">0x0002</td><td>1</td><td>version</td><td>uint8</td><td>Save format version</td></tr>';
    html += '<tr><td style="font-family:monospace;">0x0003</td><td>1</td><td>checksum</td><td>uint8</td><td>Data integrity checksum</td></tr>';
    html += '<tr><td style="font-family:monospace;">0x0004</td><td>15</td><td>hero_name</td><td>char[15]</td><td>Player character name</td></tr>';
    html += '<tr><td style="font-family:monospace;">0x0013</td><td>1</td><td>hero_class</td><td>uint8</td><td>Class ID (0-3)</td></tr>';
    html += '<tr><td style="font-family:monospace;">0x0014</td><td>1</td><td>level</td><td>uint8</td><td>Character level</td></tr>';
    html += '<tr><td style="font-family:monospace;">0x0015</td><td>2</td><td>experience</td><td>uint16</td><td>Total XP earned</td></tr>';
    html += '<tr><td style="font-family:monospace;">0x0017</td><td>1</td><td>hp</td><td>uint8</td><td>Current HP</td></tr>';
    html += '<tr><td style="font-family:monospace;">0x0018</td><td>1</td><td>max_hp</td><td>uint8</td><td>Maximum HP</td></tr>';
    html += '<tr><td style="font-family:monospace;">0x0019</td><td>6</td><td>stats[6]</td><td>uint8[6]</td><td>STR, DEX, CON, INT, WIS, CHA</td></tr>';
    html += '<tr><td style="font-family:monospace;">0x001F</td><td>1</td><td>floor</td><td>uint8</td><td>Current dungeon floor</td></tr>';
    html += '<tr><td style="font-family:monospace;">0x0020</td><td>2</td><td>gold</td><td>uint16</td><td>Gold currency</td></tr>';
    html += '<tr><td style="font-family:monospace;">0x0022</td><td>8</td><td>inventory[8]</td><td>uint8[8]</td><td>Inventory item IDs</td></tr>';
    html += '</table>';
    var sramSizes = p.sramSizes || [];
    if (sramSizes.length > 0) {
      html += '<div style="margin-top:8px;font-size:11px;color:var(--text2);">Available save sizes: ' + sramSizes.join(', ') + '</div>';
    }
    return html;
  }

  function buildSaveSlotManager() {
    return '<table class="ref-table">' +
        '<tr><th>Slot</th><th>Status</th><th>Character</th><th>Level</th><th>Floor</th><th>Play Time</th><th>Actions</th></tr>' +
        '<tr><td>Slot 1</td><td style="color:var(--green);">Active</td><td>Aldric (Warrior)</td><td>5</td><td>F3</td><td>2:34:12</td><td><button class="btn btn-sm">Load</button> <button class="btn btn-sm btn-danger">Delete</button></td></tr>' +
        '<tr><td>Slot 2</td><td style="color:var(--green);">Saved</td><td>Elara (Mage)</td><td>3</td><td>F2</td><td>1:12:45</td><td><button class="btn btn-sm">Load</button> <button class="btn btn-sm btn-danger">Delete</button></td></tr>' +
        '<tr><td>Slot 3</td><td style="color:var(--text2);">Empty</td><td>-</td><td>-</td><td>-</td><td>-</td><td><button class="btn btn-sm" disabled>Load</button></td></tr>' +
        '<tr><td>Slot 4</td><td style="color:var(--text2);">Empty</td><td>-</td><td>-</td><td>-</td><td>-</td><td><button class="btn btn-sm" disabled>Load</button></td></tr>' +
      '</table>';
  }

  function buildChecksumConfig() {
    return '<div class="form-group"><label>Checksum Algorithm</label><select><option selected>Simple Sum (mod 256)</option><option>CRC-8</option><option>XOR Checksum</option></select></div>' +
      '<div class="form-group"><label>Data Range</label>' +
        '<div class="form-row">' +
          '<div class="form-group"><label>Start Offset</label><input type="text" value="0x0004" style="font-family:monospace;"></div>' +
          '<div class="form-group"><label>End Offset</label><input type="text" value="0x007F" style="font-family:monospace;"></div>' +
        '</div>' +
      '</div>' +
      '<div class="form-group"><label>Checksum Offset</label><input type="text" value="0x0003" style="font-family:monospace;"></div>' +
      '<div style="font-size:12px;color:var(--text2);margin-top:12px;">' +
        'The checksum protects save data from corruption. On load, the engine recalculates the checksum ' +
        'and compares it to the stored value. If they don\'t match, the save is considered corrupted.' +
      '</div>';
  }
})();
