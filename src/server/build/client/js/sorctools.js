(function() {
  "use strict";

  window.openSorcTool = function(action) {
    const tools = {
      'sorc:autoSprite': { title: 'Auto-Sprite', build: buildAutoSprite },
      'sorc:spriteAnalyzer': { title: 'Sprite Analyzer', build: buildSpriteAnalyzer },
      'sorc:truePixel': { title: 'True Pixel', build: buildTruePixel },
      'sorc:sfxEditor': { title: 'SFX Editor', build: buildSorcSFXEditor },
      'sorc:slicer': { title: 'Slicer', build: buildSlicer },
      'sorc:3dto2d': { title: '3D to 2D', build: build3Dto2D },
      'sorc:creatureRig': { title: 'Creature Rigging', build: buildCreatureRig },
      'sorc:tilesetForge': { title: 'Tileset Forge', build: buildTilesetForge },
      'sorc:canvas': { title: 'Canvas', build: buildCanvas },
      'sorc:quickSprites': { title: 'Quick Sprites', build: buildQuickSprites },
      'sorc:seamlessTile': { title: 'Seamless Tile Gen', build: buildSeamlessTile },
      'sorc:bgRemover': { title: 'BG Remover', build: buildBGRemover },
      'sorc:expander': { title: 'Expander', build: buildExpander },
      'sorc:batchUtils': { title: 'Batch Utilities', build: buildBatchUtils },
      'sorc:notes': { title: 'Notes', build: buildNotes },
      'sorc:layoutPreview': { title: 'Layout Preview', build: buildLayoutPreview },
    };

    const tool = tools[action];
    if (tool) {
      window.openModal(tool.title, tool.build());
      if (tool.init) setTimeout(tool.init, 50);
    }
  };

  function fileUploadArea(id, accept, label) {
    return `<div id="${id}" style="background:#0a0a1a;border:2px dashed #3a3a5c;border-radius:6px;padding:32px;text-align:center;cursor:pointer;transition:border-color 0.2s;" onclick="document.getElementById('${id}_input').click();" ondragover="event.preventDefault();this.style.borderColor='var(--accent)';" ondragleave="this.style.borderColor='#3a3a5c';" ondrop="event.preventDefault();this.style.borderColor='#3a3a5c';window._sorcHandleDrop&&window._sorcHandleDrop(event,'${id}');">
      <input type="file" id="${id}_input" accept="${accept}" style="display:none;" onchange="window._sorcHandleFile&&window._sorcHandleFile(event,'${id}');">
      <div style="font-size:28px;margin-bottom:8px;">📁</div>
      <div style="color:var(--text2);font-size:12px;">${label || 'Drag & drop or click to upload'}</div>
    </div>`;
  }

  function previewCanvas(id, w, h, scale) {
    const sw = (w * (scale || 1));
    const sh = (h * (scale || 1));
    return `<canvas id="${id}" width="${w}" height="${h}" style="image-rendering:pixelated;width:${sw}px;height:${sh}px;border:1px solid var(--border);background:#111;display:block;margin:0 auto;"></canvas>`;
  }

  window._sorcHandleFile = function(e, id) {
    const file = e.target.files[0];
    if (!file) return;
    const ev = new CustomEvent('sorcfile', { detail: { file: file, targetId: id } });
    document.dispatchEvent(ev);
  };

  window._sorcHandleDrop = function(e, id) {
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const ev = new CustomEvent('sorcfile', { detail: { file: file, targetId: id } });
    document.dispatchEvent(ev);
  };

  function buildAutoSprite() {
    return `
      <div style="font-size:12px;color:var(--text2);margin-bottom:12px;">
        Upload a video or image to automatically extract sprite frames with background removal.
      </div>
      ${fileUploadArea('autoSprite_upload', 'image/*,video/*', 'Upload video or image file')}
      <div class="form-row" style="margin-top:12px;">
        <div class="form-group"><label>Background Removal</label>
          <select id="autoSprite_bgRemoval"><option selected>Auto Detect</option><option>Chroma Key (Green)</option><option>Chroma Key (Blue)</option><option>Manual Threshold</option><option>None</option></select>
        </div>
        <div class="form-group"><label>Frame Size</label>
          <select id="autoSprite_frameSize"><option>8x8</option><option selected>16x16</option><option>32x32</option><option>64x64</option><option>Custom</option></select>
        </div>
        <div class="form-group"><label>Crop Mode</label>
          <select><option selected>Auto Crop</option><option>Fixed Size</option><option>Manual</option></select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Crop X</label><input type="number" value="0" min="0"></div>
        <div class="form-group"><label>Crop Y</label><input type="number" value="0" min="0"></div>
        <div class="form-group"><label>Crop W</label><input type="number" value="0" min="0"></div>
        <div class="form-group"><label>Crop H</label><input type="number" value="0" min="0"></div>
      </div>
      <div style="margin:12px 0;">
        <div style="font-size:11px;color:var(--text2);margin-bottom:6px;">SPRITE SHEET PREVIEW</div>
        <div style="background:#0a0a1a;padding:16px;border-radius:4px;text-align:center;min-height:120px;position:relative;">
          ${previewCanvas('autoSprite_canvas', 256, 128, 2)}
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Frame Grid</label>
          <div class="form-row">
            <div class="form-group"><label>Columns</label><input type="number" value="4" min="1" max="32"></div>
            <div class="form-group"><label>Rows</label><input type="number" value="2" min="1" max="32"></div>
          </div>
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-top:12px;">
        <button class="btn btn-primary" onclick="window._sorcAutoSpriteProcess&&window._sorcAutoSpriteProcess();">Process</button>
        <button class="btn" onclick="window._sorcExportCanvas&&window._sorcExportCanvas('autoSprite_canvas','auto_sprite.png');">Export PNG</button>
      </div>
    `;
  }

  function buildSpriteAnalyzer() {
    return `
      <div style="font-size:12px;color:var(--text2);margin-bottom:12px;">
        Analyze an existing sprite sheet to detect grid layout, preview individual frames, and export frame data.
      </div>
      ${fileUploadArea('spriteAnalyzer_upload', 'image/*', 'Upload sprite sheet image')}
      <div class="form-row" style="margin-top:12px;">
        <div class="form-group"><label>Grid Detection</label>
          <select id="spriteAnalyzer_detect"><option selected>Auto Detect</option><option>Manual</option></select>
        </div>
        <div class="form-group"><label>Frame Width</label><input type="number" id="spriteAnalyzer_fw" value="16" min="1"></div>
        <div class="form-group"><label>Frame Height</label><input type="number" id="spriteAnalyzer_fh" value="16" min="1"></div>
      </div>
      <div style="margin:12px 0;">
        <div style="font-size:11px;color:var(--text2);margin-bottom:6px;">SOURCE IMAGE</div>
        <div style="background:#0a0a1a;padding:16px;border-radius:4px;text-align:center;overflow:auto;max-height:300px;">
          ${previewCanvas('spriteAnalyzer_src', 256, 256, 1)}
        </div>
      </div>
      <div style="margin:12px 0;">
        <div style="font-size:11px;color:var(--text2);margin-bottom:6px;">FRAME PREVIEW &amp; ANIMATION</div>
        <div style="background:#0a0a1a;padding:16px;border-radius:4px;">
          <div style="display:flex;align-items:center;gap:16px;justify-content:center;">
            ${previewCanvas('spriteAnalyzer_frame', 64, 64, 2)}
            <div>
              <div class="form-group"><label>Current Frame</label><input type="number" id="spriteAnalyzer_frameIdx" value="0" min="0" style="width:60px;"></div>
              <div class="form-group"><label>FPS</label><input type="number" id="spriteAnalyzer_fps" value="12" min="1" max="60" style="width:60px;"></div>
              <div style="display:flex;gap:4px;margin-top:8px;">
                <button class="btn btn-sm" id="spriteAnalyzer_play" onclick="window._sorcSpriteAnimPlay&&window._sorcSpriteAnimPlay();">▶ Play</button>
                <button class="btn btn-sm" onclick="window._sorcSpriteAnimStop&&window._sorcSpriteAnimStop();">■ Stop</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-primary" onclick="window._sorcAnalyzeSheet&&window._sorcAnalyzeSheet();">Analyze</button>
        <button class="btn" onclick="window._sorcExportFrameData&&window._sorcExportFrameData();">Export Frame Data</button>
      </div>
    `;
  }

  function buildTruePixel() {
    return `
      <div style="font-size:12px;color:var(--text2);margin-bottom:12px;">
        Convert any image to pixel art with adjustable pixelation, palette limiting, and chroma keying.
      </div>
      ${fileUploadArea('truePixel_upload', 'image/*', 'Upload image to pixelate')}
      <div class="form-row" style="margin-top:12px;">
        <div class="form-group"><label>Pixelation Level</label><input type="range" id="truePixel_level" min="1" max="64" value="8" style="width:100%;" oninput="document.getElementById('truePixel_levelVal').textContent=this.value+'x'"><span id="truePixel_levelVal" style="font-size:11px;color:var(--accent);">8x</span></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Palette Size</label>
          <select id="truePixel_palette"><option value="4" selected>4 Colors (GB)</option><option value="8">8 Colors</option><option value="16">16 Colors (NES)</option><option value="32">32 Colors</option><option value="64">64 Colors</option><option value="256">256 Colors</option></select>
        </div>
        <div class="form-group"><label>Chroma Key</label>
          <div style="display:flex;gap:6px;align-items:center;">
            <input type="color" id="truePixel_chroma" value="#00ff00" style="width:36px;height:28px;border:1px solid var(--border);background:none;cursor:pointer;">
            <label style="font-size:11px;margin:0;"><input type="checkbox" id="truePixel_chromaEnable"> Enable</label>
          </div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Edge Cleanup</label>
          <label style="font-size:12px;margin:0;"><input type="checkbox" id="truePixel_edgeClean" checked> Smooth edges</label>
        </div>
        <div class="form-group"><label>Batch Processing</label>
          <label style="font-size:12px;margin:0;"><input type="checkbox" id="truePixel_batch"> Process multiple files</label>
        </div>
      </div>
      <div style="display:flex;gap:16px;margin:12px 0;">
        <div style="flex:1;text-align:center;">
          <div style="font-size:11px;color:var(--text2);margin-bottom:6px;">ORIGINAL</div>
          <div style="background:#0a0a1a;padding:8px;border-radius:4px;">${previewCanvas('truePixel_orig', 128, 128, 2)}</div>
        </div>
        <div style="display:flex;align-items:center;font-size:24px;color:var(--accent);">→</div>
        <div style="flex:1;text-align:center;">
          <div style="font-size:11px;color:var(--text2);margin-bottom:6px;">PIXELATED</div>
          <div style="background:#0a0a1a;padding:8px;border-radius:4px;">${previewCanvas('truePixel_out', 128, 128, 2)}</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-primary" onclick="window._sorcTruePixelProcess&&window._sorcTruePixelProcess();">Convert</button>
        <button class="btn" onclick="window._sorcExportCanvas&&window._sorcExportCanvas('truePixel_out','pixel_art.png');">Export PNG</button>
      </div>
    `;
  }

  function buildSorcSFXEditor() {
    return `
      <div style="font-size:12px;color:var(--text2);margin-bottom:12px;">
        Upload, edit, and export sound effects with waveform visualization and audio processing.
      </div>
      ${fileUploadArea('sfxEditor_upload', 'audio/*', 'Upload audio file (WAV, MP3, OGG)')}
      <div style="margin:12px 0;">
        <div style="font-size:11px;color:var(--text2);margin-bottom:6px;">WAVEFORM</div>
        <div style="background:#0a0a1a;padding:8px;border-radius:4px;">
          <canvas id="sfxEditor_waveform" width="700" height="120" style="width:100%;height:120px;border:1px solid var(--border);background:#050510;display:block;"></canvas>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Trim Start</label><input type="range" id="sfxEditor_trimStart" min="0" max="100" value="0" style="width:100%;"></div>
        <div class="form-group"><label>Trim End</label><input type="range" id="sfxEditor_trimEnd" min="0" max="100" value="100" style="width:100%;"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Fade In (ms)</label><input type="number" id="sfxEditor_fadeIn" value="0" min="0" max="5000"></div>
        <div class="form-group"><label>Fade Out (ms)</label><input type="number" id="sfxEditor_fadeOut" value="0" min="0" max="5000"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Volume</label><input type="range" id="sfxEditor_volume" min="0" max="200" value="100" style="width:100%;" oninput="document.getElementById('sfxEditor_volVal').textContent=this.value+'%'"><span id="sfxEditor_volVal" style="font-size:11px;color:var(--accent);">100%</span></div>
        <div class="form-group"><label>Pitch</label><input type="range" id="sfxEditor_pitch" min="25" max="400" value="100" style="width:100%;" oninput="document.getElementById('sfxEditor_pitchVal').textContent=this.value+'%'"><span id="sfxEditor_pitchVal" style="font-size:11px;color:var(--accent);">100%</span></div>
      </div>
      <div style="display:flex;gap:8px;margin-top:12px;">
        <button class="btn btn-primary" id="sfxEditor_playBtn" onclick="window._sorcSFXPlay&&window._sorcSFXPlay();">▶ Play Preview</button>
        <button class="btn" onclick="window._sorcSFXStop&&window._sorcSFXStop();">■ Stop</button>
        <button class="btn" onclick="window._sorcSFXExport&&window._sorcSFXExport();">Export WAV</button>
      </div>
    `;
  }

  function buildSlicer() {
    return `
      <div style="font-size:12px;color:var(--text2);margin-bottom:12px;">
        Slice an image into a grid of individual frames. Select which frames to export.
      </div>
      ${fileUploadArea('slicer_upload', 'image/*', 'Upload image to slice')}
      <div class="form-row" style="margin-top:12px;">
        <div class="form-group"><label>Columns</label><input type="number" id="slicer_cols" value="4" min="1" max="64"></div>
        <div class="form-group"><label>Rows</label><input type="number" id="slicer_rows" value="4" min="1" max="64"></div>
        <div class="form-group"><label>Padding</label><input type="number" id="slicer_pad" value="0" min="0" max="32"></div>
      </div>
      <div style="margin:12px 0;">
        <div style="font-size:11px;color:var(--text2);margin-bottom:6px;">GRID OVERLAY PREVIEW</div>
        <div style="background:#0a0a1a;padding:16px;border-radius:4px;text-align:center;overflow:auto;max-height:400px;">
          ${previewCanvas('slicer_canvas', 256, 256, 2)}
        </div>
      </div>
      <div style="margin:12px 0;">
        <div style="font-size:11px;color:var(--text2);margin-bottom:6px;">INDIVIDUAL FRAMES (click to select/deselect)</div>
        <div id="slicer_frames" style="display:flex;flex-wrap:wrap;gap:4px;background:#0a0a1a;padding:12px;border-radius:4px;min-height:60px;">
          <div style="color:var(--text2);font-size:11px;">Upload an image and click Slice to see frames</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-primary" onclick="window._sorcSlice&&window._sorcSlice();">Slice</button>
        <button class="btn" onclick="window._sorcSliceSelectAll&&window._sorcSliceSelectAll();">Select All</button>
        <button class="btn" onclick="window._sorcSliceDeselectAll&&window._sorcSliceDeselectAll();">Deselect All</button>
        <button class="btn" onclick="window._sorcSliceExport&&window._sorcSliceExport();">Export Selected</button>
      </div>
    `;
  }

  function build3Dto2D() {
    return `
      <div style="font-size:12px;color:var(--text2);margin-bottom:12px;">
        Convert 3D models into 2D sprite sheets. Upload a model, select angles, configure lighting, and export.
      </div>
      <div style="background:#12122a;border:1px solid #3a3a5c;border-radius:6px;padding:24px;text-align:center;margin-bottom:16px;">
        <div style="font-size:48px;margin-bottom:12px;">🧊</div>
        <div style="font-size:14px;font-weight:600;color:var(--accent);margin-bottom:8px;">3D to 2D Renderer</div>
        <div style="font-size:12px;color:var(--text2);max-width:400px;margin:0 auto;">
          Upload a 3D model file (.obj, .gltf, .fbx) to render it from multiple angles into a 2D sprite sheet.
        </div>
      </div>
      ${fileUploadArea('3dto2d_upload', '.obj,.gltf,.glb,.fbx', 'Upload 3D model (.obj, .gltf, .fbx)')}
      <div class="form-row" style="margin-top:12px;">
        <div class="form-group"><label>Rotation Angles</label>
          <select><option>8 Directions (45°)</option><option>4 Directions (90°)</option><option>16 Directions (22.5°)</option><option>Custom</option></select>
        </div>
        <div class="form-group"><label>Elevation</label>
          <select><option>Top-down (90°)</option><option selected>Isometric (30°)</option><option>Side View (0°)</option><option>Custom</option></select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Lighting</label>
          <select><option selected>Default (Top-Left)</option><option>Flat</option><option>Ambient Only</option><option>Custom Direction</option></select>
        </div>
        <div class="form-group"><label>Output Size</label>
          <select><option>16x16</option><option selected>32x32</option><option>64x64</option><option>128x128</option></select>
        </div>
      </div>
      <div class="form-group"><label>Background</label>
        <select><option selected>Transparent</option><option>Solid Color</option><option>Chroma Key Green</option></select>
      </div>
      <div style="margin:12px 0;">
        <div style="font-size:11px;color:var(--text2);margin-bottom:6px;">SPRITE SHEET OUTPUT</div>
        <div style="background:#0a0a1a;padding:16px;border-radius:4px;text-align:center;">
          ${previewCanvas('3dto2d_canvas', 256, 128, 2)}
        </div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-primary">Render</button>
        <button class="btn">Export PNG</button>
      </div>
    `;
  }

  function buildCreatureRig() {
    return `
      <div style="font-size:12px;color:var(--text2);margin-bottom:12px;">
        Create walk cycle animations for multi-legged creatures with configurable rigging.
      </div>
      <div style="background:#12122a;border:1px solid #3a3a5c;border-radius:6px;padding:24px;text-align:center;margin-bottom:16px;">
        <div style="font-size:48px;margin-bottom:12px;">🕷️</div>
        <div style="font-size:14px;font-weight:600;color:var(--accent);margin-bottom:8px;">Creature Rigging Tool</div>
        <div style="font-size:12px;color:var(--text2);max-width:400px;margin:0 auto;">
          Configure multi-legged character rigs to generate walk cycle sprite animations.
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Creature Type</label>
          <select id="creatureRig_type"><option>Biped (2 legs)</option><option>Quadruped (4 legs)</option><option>Hexapod (6 legs)</option><option selected>Arachnid (8 legs)</option><option>Centipede (Many)</option><option>Custom</option></select>
        </div>
        <div class="form-group"><label>Leg Count</label><input type="number" id="creatureRig_legs" value="8" min="2" max="32"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Body Shape</label>
          <select><option>Oval</option><option selected>Segmented</option><option>Round</option><option>Elongated</option></select>
        </div>
        <div class="form-group"><label>Walk Cycle Frames</label><input type="number" value="8" min="2" max="32"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Leg Style</label>
          <select><option selected>Jointed</option><option>Straight</option><option>Curved</option><option>Tentacle</option></select>
        </div>
        <div class="form-group"><label>Animation Speed</label>
          <select><option>Slow</option><option selected>Normal</option><option>Fast</option></select>
        </div>
      </div>
      <div style="margin:12px 0;">
        <div style="font-size:11px;color:var(--text2);margin-bottom:6px;">WALK CYCLE PREVIEW</div>
        <div style="background:#0a0a1a;padding:16px;border-radius:4px;text-align:center;">
          ${previewCanvas('creatureRig_canvas', 256, 128, 2)}
        </div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-primary">Generate Walk Cycle</button>
        <button class="btn">▶ Preview Animation</button>
        <button class="btn">Export Sprite Sheet</button>
      </div>
    `;
  }

  function buildTilesetForge() {
    return `
      <div style="font-size:12px;color:var(--text2);margin-bottom:12px;">
        Arrange source tiles into a tileset grid. Set tile dimensions, preview, and export.
      </div>
      ${fileUploadArea('tilesetForge_upload', 'image/*', 'Upload source tile images (multiple supported)')}
      <div class="form-row" style="margin-top:12px;">
        <div class="form-group"><label>Tile Width</label><input type="number" id="tilesetForge_tw" value="8" min="1"></div>
        <div class="form-group"><label>Tile Height</label><input type="number" id="tilesetForge_th" value="8" min="1"></div>
        <div class="form-group"><label>Columns</label><input type="number" id="tilesetForge_cols" value="16" min="1" max="64"></div>
        <div class="form-group"><label>Spacing</label><input type="number" id="tilesetForge_spacing" value="0" min="0" max="16"></div>
      </div>
      <div style="margin:12px 0;">
        <div style="font-size:11px;color:var(--text2);margin-bottom:6px;">TILESET PREVIEW</div>
        <div style="background:#0a0a1a;padding:16px;border-radius:4px;text-align:center;overflow:auto;max-height:400px;">
          ${previewCanvas('tilesetForge_canvas', 256, 256, 2)}
        </div>
      </div>
      <div id="tilesetForge_tiles" style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:12px;">
        <div style="color:var(--text2);font-size:11px;">Loaded tiles will appear here for arrangement</div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-primary" onclick="window._sorcForgeArrange&&window._sorcForgeArrange();">Arrange Tiles</button>
        <button class="btn" onclick="window._sorcExportCanvas&&window._sorcExportCanvas('tilesetForge_canvas','tileset.png');">Export Tileset</button>
      </div>
    `;
  }

  function buildCanvas() {
    var notesLayers = (typeof localStorage !== 'undefined' && localStorage.getItem('sorcCanvasLayers')) || '1';
    return `
      <div style="display:flex;gap:12px;height:500px;">
        <div style="width:48px;display:flex;flex-direction:column;gap:4px;padding:4px;background:#12122a;border-radius:4px;">
          <button class="btn btn-sm" id="canvas_tool_pencil" title="Pencil (B)" onclick="window._sorcCanvasTool&&window._sorcCanvasTool('pencil')" style="background:var(--accent);color:#000;">✏️</button>
          <button class="btn btn-sm" id="canvas_tool_eraser" title="Eraser (E)" onclick="window._sorcCanvasTool&&window._sorcCanvasTool('eraser')">🧽</button>
          <button class="btn btn-sm" id="canvas_tool_fill" title="Fill (G)" onclick="window._sorcCanvasTool&&window._sorcCanvasTool('fill')">🪣</button>
          <button class="btn btn-sm" id="canvas_tool_line" title="Line (L)" onclick="window._sorcCanvasTool&&window._sorcCanvasTool('line')">📏</button>
          <button class="btn btn-sm" id="canvas_tool_rect" title="Rectangle (R)" onclick="window._sorcCanvasTool&&window._sorcCanvasTool('rect')">⬜</button>
          <button class="btn btn-sm" id="canvas_tool_circle" title="Circle (C)" onclick="window._sorcCanvasTool&&window._sorcCanvasTool('circle')">⭕</button>
          <button class="btn btn-sm" id="canvas_tool_eyedrop" title="Eyedropper (I)" onclick="window._sorcCanvasTool&&window._sorcCanvasTool('eyedrop')">💧</button>
          <div style="height:1px;background:#3a3a5c;margin:4px 0;"></div>
          <button class="btn btn-sm" title="Undo (Ctrl+Z)" onclick="window._sorcCanvasUndo&&window._sorcCanvasUndo()">↩️</button>
          <button class="btn btn-sm" title="Redo (Ctrl+Y)" onclick="window._sorcCanvasRedo&&window._sorcCanvasRedo()">↪️</button>
          <div style="height:1px;background:#3a3a5c;margin:4px 0;"></div>
          <button class="btn btn-sm" title="Grid Toggle" onclick="window._sorcCanvasGrid&&window._sorcCanvasGrid()">🔲</button>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;">
          <div style="flex:1;background:#0a0a1a;border-radius:4px;overflow:auto;display:flex;align-items:center;justify-content:center;position:relative;">
            <canvas id="canvas_main" width="128" height="128" style="image-rendering:pixelated;width:512px;height:512px;border:1px solid var(--border);background:#111;cursor:crosshair;"></canvas>
          </div>
          <div style="display:flex;align-items:center;gap:8px;padding:8px 0;font-size:11px;color:var(--text2);">
            <span>Size:</span>
            <input type="number" id="canvas_w" value="128" min="1" max="1024" style="width:50px;padding:2px 4px;font-size:11px;background:#12122a;border:1px solid #3a3a5c;color:var(--text);border-radius:2px;">
            <span>x</span>
            <input type="number" id="canvas_h" value="128" min="1" max="1024" style="width:50px;padding:2px 4px;font-size:11px;background:#12122a;border:1px solid #3a3a5c;color:var(--text);border-radius:2px;">
            <button class="btn btn-sm" onclick="window._sorcCanvasResize&&window._sorcCanvasResize();">Resize</button>
            <span style="flex:1;"></span>
            <span id="canvas_coords">0, 0</span>
          </div>
        </div>
        <div style="width:140px;display:flex;flex-direction:column;gap:8px;">
          <div>
            <div style="font-size:10px;color:var(--text2);margin-bottom:4px;text-transform:uppercase;">Color</div>
            <input type="color" id="canvas_color" value="#ffffff" style="width:100%;height:32px;border:1px solid var(--border);background:none;cursor:pointer;border-radius:4px;">
          </div>
          <div>
            <div style="font-size:10px;color:var(--text2);margin-bottom:4px;text-transform:uppercase;">Palette</div>
            <div id="canvas_palette" style="display:grid;grid-template-columns:repeat(4,1fr);gap:2px;">
              ${['#000000','#555555','#aaaaaa','#ffffff','#ff0000','#00ff00','#0000ff','#ffff00','#ff00ff','#00ffff','#ff8800','#8800ff','#081820','#346856','#88c070','#e0f8d0'].map(c =>
                `<div style="width:100%;aspect-ratio:1;background:${c};border:1px solid #3a3a5c;border-radius:2px;cursor:pointer;" onclick="document.getElementById('canvas_color').value='${c}';"></div>`
              ).join('')}
            </div>
          </div>
          <div>
            <div style="font-size:10px;color:var(--text2);margin-bottom:4px;text-transform:uppercase;">Brush Size</div>
            <input type="range" id="canvas_brush" min="1" max="16" value="1" style="width:100%;">
            <div style="text-align:center;font-size:10px;color:var(--text2);" id="canvas_brushVal">1px</div>
          </div>
          <div>
            <div style="font-size:10px;color:var(--text2);margin-bottom:4px;text-transform:uppercase;">Layers</div>
            <div id="canvas_layers" style="background:#12122a;border-radius:4px;padding:4px;font-size:11px;">
              <div style="display:flex;align-items:center;gap:4px;padding:4px;background:#1e1e3a;border-radius:2px;margin-bottom:2px;cursor:pointer;border:1px solid var(--accent);">
                <span>👁</span><span style="flex:1;">Layer 1</span>
              </div>
            </div>
            <button class="btn btn-sm" style="width:100%;margin-top:4px;" onclick="window._sorcCanvasAddLayer&&window._sorcCanvasAddLayer();">+ Add Layer</button>
          </div>
          <div style="margin-top:auto;">
            <button class="btn btn-primary btn-sm" style="width:100%;" onclick="window._sorcExportCanvas&&window._sorcExportCanvas('canvas_main','pixel_art.png');">Export PNG</button>
          </div>
        </div>
      </div>
    `;
  }

  function buildQuickSprites() {
    return `
      <div style="font-size:12px;color:var(--text2);margin-bottom:12px;">
        Quickly generate sprite placeholders based on description, animation type, and size options.
      </div>
      <div class="form-group"><label>Sprite Description</label>
        <textarea id="quickSprites_prompt" rows="3" placeholder="e.g., A small knight character with sword and shield, facing right" style="resize:vertical;"></textarea>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Animation Type</label>
          <select id="quickSprites_anim">
            <option>Idle</option>
            <option selected>Walk Cycle</option>
            <option>Run Cycle</option>
            <option>Attack</option>
            <option>Jump</option>
            <option>Death</option>
            <option>Cast Spell</option>
            <option>All Animations</option>
          </select>
        </div>
        <div class="form-group"><label>Sprite Size</label>
          <select id="quickSprites_size"><option>8x8</option><option selected>16x16</option><option>32x32</option><option>64x64</option></select>
        </div>
        <div class="form-group"><label>Frame Count</label>
          <input type="number" id="quickSprites_frames" value="4" min="1" max="32">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Style</label>
          <select><option selected>Pixel Art</option><option>Retro NES</option><option>Game Boy</option><option>16-bit</option></select>
        </div>
        <div class="form-group"><label>Color Palette</label>
          <select><option>Game Boy (4 color)</option><option>NES</option><option>SNES</option><option selected>Custom</option></select>
        </div>
      </div>
      <div style="margin:12px 0;">
        <div style="font-size:11px;color:var(--text2);margin-bottom:6px;">PREVIEW</div>
        <div style="background:#0a0a1a;padding:24px;border-radius:4px;text-align:center;min-height:100px;">
          ${previewCanvas('quickSprites_canvas', 256, 64, 2)}
          <div id="quickSprites_info" style="font-size:11px;color:var(--text2);margin-top:8px;">Generate sprites to see preview</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-primary" onclick="window._sorcQuickGenerate&&window._sorcQuickGenerate();">Generate Placeholder</button>
        <button class="btn" onclick="window._sorcExportCanvas&&window._sorcExportCanvas('quickSprites_canvas','quick_sprite.png');">Export PNG</button>
      </div>
    `;
  }

  function buildSeamlessTile() {
    return `
      <div style="font-size:12px;color:var(--text2);margin-bottom:12px;">
        Generate or convert images into seamlessly tiling textures. Preview in a 3x3 tiled grid.
      </div>
      <div class="form-row" style="margin-bottom:12px;">
        <div class="form-group"><label>Input Mode</label>
          <select id="seamlessTile_mode"><option selected>Upload Image</option><option>Text Prompt</option></select>
        </div>
        <div class="form-group"><label>Tile Size</label>
          <select id="seamlessTile_size"><option>8x8</option><option selected>16x16</option><option>32x32</option><option>64x64</option><option>128x128</option></select>
        </div>
      </div>
      ${fileUploadArea('seamlessTile_upload', 'image/*', 'Upload image to make seamless')}
      <div class="form-group" style="margin-top:12px;"><label>Or Describe Tile</label>
        <input type="text" id="seamlessTile_prompt" placeholder="e.g., grass, stone floor, water, brick wall">
      </div>
      <div style="display:flex;gap:16px;margin:12px 0;">
        <div style="flex:1;text-align:center;">
          <div style="font-size:11px;color:var(--text2);margin-bottom:6px;">SINGLE TILE</div>
          <div style="background:#0a0a1a;padding:8px;border-radius:4px;">
            ${previewCanvas('seamlessTile_single', 64, 64, 2)}
          </div>
        </div>
        <div style="flex:2;text-align:center;">
          <div style="font-size:11px;color:var(--text2);margin-bottom:6px;">SEAMLESS PREVIEW (3x3 GRID)</div>
          <div style="background:#0a0a1a;padding:8px;border-radius:4px;">
            ${previewCanvas('seamlessTile_grid', 192, 192, 2)}
          </div>
        </div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-primary" onclick="window._sorcMakeSeamless&&window._sorcMakeSeamless();">Make Seamless</button>
        <button class="btn" onclick="window._sorcExportCanvas&&window._sorcExportCanvas('seamlessTile_single','seamless_tile.png');">Export Tile</button>
      </div>
    `;
  }

  function buildBGRemover() {
    return `
      <div style="font-size:12px;color:var(--text2);margin-bottom:12px;">
        Remove backgrounds from images with adjustable threshold. Export transparent PNG.
      </div>
      ${fileUploadArea('bgRemover_upload', 'image/*', 'Upload image for background removal')}
      <div class="form-row" style="margin-top:12px;">
        <div class="form-group"><label>Detection Method</label>
          <select id="bgRemover_method"><option selected>Auto (Edge Detection)</option><option>Color Threshold</option><option>Chroma Key</option></select>
        </div>
        <div class="form-group"><label>Threshold</label>
          <input type="range" id="bgRemover_threshold" min="0" max="255" value="30" style="width:100%;" oninput="document.getElementById('bgRemover_threshVal').textContent=this.value">
          <span id="bgRemover_threshVal" style="font-size:11px;color:var(--accent);">30</span>
        </div>
      </div>
      <div class="form-group"><label>Key Color (for Chroma Key mode)</label>
        <input type="color" id="bgRemover_keyColor" value="#00ff00" style="width:48px;height:28px;border:1px solid var(--border);background:none;cursor:pointer;">
      </div>
      <div style="display:flex;gap:16px;margin:12px 0;">
        <div style="flex:1;text-align:center;">
          <div style="font-size:11px;color:var(--text2);margin-bottom:6px;">ORIGINAL</div>
          <div style="background:#0a0a1a;padding:8px;border-radius:4px;">
            ${previewCanvas('bgRemover_orig', 256, 256, 1)}
          </div>
        </div>
        <div style="flex:1;text-align:center;">
          <div style="font-size:11px;color:var(--text2);margin-bottom:6px;">RESULT (Checkerboard = Transparent)</div>
          <div style="padding:8px;border-radius:4px;background:repeating-conic-gradient(#808080 0% 25%, #c0c0c0 0% 50%) 50% / 16px 16px;">
            ${previewCanvas('bgRemover_result', 256, 256, 1)}
          </div>
        </div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-primary" onclick="window._sorcRemoveBG&&window._sorcRemoveBG();">Remove Background</button>
        <button class="btn" onclick="window._sorcExportCanvas&&window._sorcExportCanvas('bgRemover_result','transparent.png');">Export Transparent PNG</button>
      </div>
    `;
  }

  function buildExpander() {
    return `
      <div style="font-size:12px;color:var(--text2);margin-bottom:12px;">
        Expand an image in any direction by adding generated content to extend the canvas.
      </div>
      ${fileUploadArea('expander_upload', 'image/*', 'Upload image to expand')}
      <div style="margin:12px 0;text-align:center;">
        <div style="font-size:11px;color:var(--text2);margin-bottom:6px;">EXPAND DIRECTIONS</div>
        <div style="display:inline-grid;grid-template-columns:1fr 1fr 1fr;gap:4px;">
          <div></div>
          <button class="btn" onclick="window._sorcExpand&&window._sorcExpand('up');">⬆ Up</button>
          <div></div>
          <button class="btn" onclick="window._sorcExpand&&window._sorcExpand('left');">⬅ Left</button>
          <div style="width:64px;height:64px;background:#12122a;border:1px solid var(--border);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:20px;">🖼️</div>
          <button class="btn" onclick="window._sorcExpand&&window._sorcExpand('right');">Right ➡</button>
          <div></div>
          <button class="btn" onclick="window._sorcExpand&&window._sorcExpand('down');">⬇ Down</button>
          <div></div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Expand Amount (px)</label><input type="number" id="expander_amount" value="16" min="1" max="512"></div>
        <div class="form-group"><label>Fill Mode</label>
          <select id="expander_fill"><option selected>Edge Extend</option><option>Mirror</option><option>Wrap</option><option>Solid Color</option></select>
        </div>
      </div>
      <div style="margin:12px 0;">
        <div style="font-size:11px;color:var(--text2);margin-bottom:6px;">PREVIEW</div>
        <div style="background:#0a0a1a;padding:16px;border-radius:4px;text-align:center;overflow:auto;">
          ${previewCanvas('expander_canvas', 256, 256, 2)}
        </div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn" onclick="window._sorcExpandReset&&window._sorcExpandReset();">Reset</button>
        <button class="btn" onclick="window._sorcExportCanvas&&window._sorcExportCanvas('expander_canvas','expanded.png');">Export PNG</button>
      </div>
    `;
  }

  function buildBatchUtils() {
    return `
      <div style="font-size:12px;color:var(--text2);margin-bottom:12px;">
        Process multiple files at once with various image and audio operations.
      </div>
      <div id="batchUtils_dropzone" style="background:#0a0a1a;border:2px dashed #3a3a5c;border-radius:6px;padding:32px;text-align:center;cursor:pointer;margin-bottom:12px;" onclick="document.getElementById('batchUtils_input').click();" ondragover="event.preventDefault();this.style.borderColor='var(--accent)';" ondragleave="this.style.borderColor='#3a3a5c';" ondrop="event.preventDefault();this.style.borderColor='#3a3a5c';window._sorcBatchDrop&&window._sorcBatchDrop(event);">
        <input type="file" id="batchUtils_input" multiple accept="image/*,audio/*" style="display:none;" onchange="window._sorcBatchFiles&&window._sorcBatchFiles(event);">
        <div style="font-size:28px;margin-bottom:8px;">📁</div>
        <div style="color:var(--text2);font-size:12px;">Drag & drop multiple files or click to upload</div>
      </div>
      <div id="batchUtils_fileList" style="background:#12122a;border-radius:4px;padding:8px;margin-bottom:12px;max-height:150px;overflow-y:auto;font-size:11px;color:var(--text2);">
        No files selected
      </div>
      <div class="form-group"><label>Operation</label>
        <select id="batchUtils_op">
          <option value="compressJpg">Compress as JPG</option>
          <option value="convertPng">Convert to PNG</option>
          <option value="resize" selected>Resize Images</option>
          <option value="reduceColors">Reduce Colors</option>
          <option value="compressMp3">Compress MP3</option>
        </select>
      </div>
      <div id="batchUtils_options">
        <div class="form-row">
          <div class="form-group"><label>Width</label><input type="number" id="batchUtils_w" value="64" min="1"></div>
          <div class="form-group"><label>Height</label><input type="number" id="batchUtils_h" value="64" min="1"></div>
          <div class="form-group"><label>Maintain Aspect Ratio</label>
            <label style="font-size:12px;margin:0;"><input type="checkbox" id="batchUtils_aspect" checked> Yes</label>
          </div>
        </div>
      </div>
      <div style="margin:12px 0;">
        <div style="font-size:11px;color:var(--text2);margin-bottom:6px;">OUTPUT PREVIEW</div>
        <div id="batchUtils_output" style="background:#0a0a1a;padding:12px;border-radius:4px;min-height:60px;display:flex;flex-wrap:wrap;gap:8px;">
          <div style="color:var(--text2);font-size:11px;">Process files to see output</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-primary" onclick="window._sorcBatchProcess&&window._sorcBatchProcess();">Process All</button>
        <button class="btn" onclick="window._sorcBatchDownload&&window._sorcBatchDownload();">Download All</button>
      </div>
    `;
  }

  function buildNotes() {
    var savedNotes = {};
    try { savedNotes = JSON.parse(localStorage.getItem('sorcNotes') || '{}'); } catch(e) {}
    var tabs = Object.keys(savedNotes);
    if (tabs.length === 0) {
      tabs = ['General'];
      savedNotes['General'] = '';
    }
    var tabsHTML = tabs.map(function(t, i) {
      return '<button class="btn btn-sm' + (i === 0 ? ' active' : '') + '" data-note-tab="' + t + '" onclick="window._sorcNoteSwitch&&window._sorcNoteSwitch(\'' + t.replace(/'/g,"\\'") + '\')" style="' + (i === 0 ? 'background:var(--accent);color:#000;' : '') + '">' + t + '</button>';
    }).join('');

    return `
      <div style="display:flex;align-items:center;gap:4px;margin-bottom:12px;">
        <div id="notes_tabs" style="display:flex;gap:4px;flex-wrap:wrap;">${tabsHTML}</div>
        <button class="btn btn-sm" onclick="window._sorcNoteAdd&&window._sorcNoteAdd();" title="Add new tab">+</button>
        <button class="btn btn-sm" onclick="window._sorcNoteRemove&&window._sorcNoteRemove();" title="Remove current tab">−</button>
      </div>
      <textarea id="notes_editor" rows="18" style="width:100%;resize:vertical;background:#0a0a1a;border:1px solid #3a3a5c;color:var(--text);padding:12px;font-size:13px;font-family:inherit;border-radius:4px;line-height:1.6;" oninput="window._sorcNoteSave&&window._sorcNoteSave();">${savedNotes[tabs[0]] || ''}</textarea>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
        <span id="notes_status" style="font-size:11px;color:var(--text2);">Saved to localStorage</span>
        <div style="display:flex;gap:4px;">
          <button class="btn btn-sm" onclick="window._sorcNoteExport&&window._sorcNoteExport();">Export All</button>
          <button class="btn btn-sm" onclick="window._sorcNoteClear&&window._sorcNoteClear();">Clear</button>
        </div>
      </div>
    `;
  }

  function buildLayoutPreview() {
    return `
      <div style="font-size:12px;color:var(--text2);margin-bottom:12px;">
        Preview the current project at different screen sizes to test responsive layouts.
      </div>
      <div class="form-row" style="margin-bottom:12px;">
        <div class="form-group"><label>Device</label>
          <select id="layoutPreview_device" onchange="window._sorcLayoutResize&&window._sorcLayoutResize(this.value);">
            <option value="375x667">Phone (375x667)</option>
            <option value="768x1024">Tablet (768x1024)</option>
            <option value="1024x768">Tablet Landscape (1024x768)</option>
            <option value="1280x720" selected>Desktop (1280x720)</option>
            <option value="1920x1080">Desktop HD (1920x1080)</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div class="form-group"><label>Width</label><input type="number" id="layoutPreview_w" value="1280" min="100" max="3840"></div>
        <div class="form-group"><label>Height</label><input type="number" id="layoutPreview_h" value="720" min="100" max="2160"></div>
        <div class="form-group"><label>Scale</label>
          <select id="layoutPreview_scale" onchange="window._sorcLayoutScale&&window._sorcLayoutScale(this.value);">
            <option value="0.25">25%</option>
            <option value="0.5" selected>50%</option>
            <option value="0.75">75%</option>
            <option value="1">100%</option>
          </select>
        </div>
      </div>
      <div style="background:#0a0a1a;padding:16px;border-radius:4px;overflow:auto;text-align:center;">
        <div id="layoutPreview_frame" style="display:inline-block;border:2px solid var(--border);border-radius:4px;overflow:hidden;background:#fff;">
          <iframe id="layoutPreview_iframe" src="about:blank" style="width:1280px;height:720px;border:none;transform:scale(0.5);transform-origin:top left;" sandbox="allow-scripts allow-same-origin"></iframe>
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-top:12px;">
        <button class="btn btn-primary" onclick="window._sorcLayoutRefresh&&window._sorcLayoutRefresh();">Refresh</button>
        <button class="btn" onclick="window._sorcLayoutRotate&&window._sorcLayoutRotate();">Rotate</button>
        <span style="flex:1;"></span>
        <span id="layoutPreview_info" style="font-size:11px;color:var(--text2);align-self:center;">1280 x 720 @ 50%</span>
      </div>
    `;
  }

  window._sorcExportCanvas = function(canvasId, filename) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var link = document.createElement('a');
    link.download = filename || 'export.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  window._sorcNoteSave = function() {
    var editor = document.getElementById('notes_editor');
    if (!editor) return;
    var activeTab = document.querySelector('#notes_tabs .btn.active');
    var tabName = activeTab ? activeTab.getAttribute('data-note-tab') : 'General';
    var notes = {};
    try { notes = JSON.parse(localStorage.getItem('sorcNotes') || '{}'); } catch(e) {}
    notes[tabName] = editor.value;
    localStorage.setItem('sorcNotes', JSON.stringify(notes));
    var status = document.getElementById('notes_status');
    if (status) status.textContent = 'Saved';
  };

  window._sorcNoteSwitch = function(tabName) {
    var notes = {};
    try { notes = JSON.parse(localStorage.getItem('sorcNotes') || '{}'); } catch(e) {}
    var editor = document.getElementById('notes_editor');
    if (editor) editor.value = notes[tabName] || '';
    document.querySelectorAll('#notes_tabs .btn').forEach(function(b) {
      if (b.getAttribute('data-note-tab') === tabName) {
        b.classList.add('active');
        b.style.background = 'var(--accent)';
        b.style.color = '#000';
      } else {
        b.classList.remove('active');
        b.style.background = '';
        b.style.color = '';
      }
    });
  };

  window._sorcNoteAdd = function() {
    var name = prompt('Tab name:');
    if (!name) return;
    var notes = {};
    try { notes = JSON.parse(localStorage.getItem('sorcNotes') || '{}'); } catch(e) {}
    notes[name] = '';
    localStorage.setItem('sorcNotes', JSON.stringify(notes));
    var container = document.getElementById('notes_tabs');
    if (container) {
      var btn = document.createElement('button');
      btn.className = 'btn btn-sm';
      btn.setAttribute('data-note-tab', name);
      btn.textContent = name;
      btn.onclick = function() { window._sorcNoteSwitch(name); };
      container.appendChild(btn);
      window._sorcNoteSwitch(name);
    }
  };

  window._sorcNoteRemove = function() {
    var activeTab = document.querySelector('#notes_tabs .btn.active');
    if (!activeTab) return;
    var tabName = activeTab.getAttribute('data-note-tab');
    if (!confirm('Delete tab "' + tabName + '"?')) return;
    var notes = {};
    try { notes = JSON.parse(localStorage.getItem('sorcNotes') || '{}'); } catch(e) {}
    delete notes[tabName];
    localStorage.setItem('sorcNotes', JSON.stringify(notes));
    activeTab.remove();
    var first = document.querySelector('#notes_tabs .btn');
    if (first) {
      window._sorcNoteSwitch(first.getAttribute('data-note-tab'));
    } else {
      var editor = document.getElementById('notes_editor');
      if (editor) editor.value = '';
    }
  };

  window._sorcNoteExport = function() {
    var notes = {};
    try { notes = JSON.parse(localStorage.getItem('sorcNotes') || '{}'); } catch(e) {}
    var blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
    var link = document.createElement('a');
    link.download = 'notes.json';
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  window._sorcNoteClear = function() {
    if (!confirm('Clear all text in current tab?')) return;
    var editor = document.getElementById('notes_editor');
    if (editor) { editor.value = ''; window._sorcNoteSave(); }
  };

  window._sorcLayoutRefresh = function() {
    var iframe = document.getElementById('layoutPreview_iframe');
    if (iframe) iframe.src = window.location.origin;
  };

  window._sorcLayoutResize = function(val) {
    if (val === 'custom') return;
    var parts = val.split('x');
    var w = parseInt(parts[0]), h = parseInt(parts[1]);
    document.getElementById('layoutPreview_w').value = w;
    document.getElementById('layoutPreview_h').value = h;
    var iframe = document.getElementById('layoutPreview_iframe');
    if (iframe) { iframe.style.width = w + 'px'; iframe.style.height = h + 'px'; }
    var scale = parseFloat(document.getElementById('layoutPreview_scale').value);
    var frame = document.getElementById('layoutPreview_frame');
    if (frame) { frame.style.width = (w * scale) + 'px'; frame.style.height = (h * scale) + 'px'; }
    var info = document.getElementById('layoutPreview_info');
    if (info) info.textContent = w + ' x ' + h + ' @ ' + Math.round(scale * 100) + '%';
  };

  window._sorcLayoutScale = function(val) {
    var scale = parseFloat(val);
    var iframe = document.getElementById('layoutPreview_iframe');
    if (iframe) iframe.style.transform = 'scale(' + scale + ')';
    var w = parseInt(document.getElementById('layoutPreview_w').value);
    var h = parseInt(document.getElementById('layoutPreview_h').value);
    var frame = document.getElementById('layoutPreview_frame');
    if (frame) { frame.style.width = (w * scale) + 'px'; frame.style.height = (h * scale) + 'px'; }
    var info = document.getElementById('layoutPreview_info');
    if (info) info.textContent = w + ' x ' + h + ' @ ' + Math.round(scale * 100) + '%';
  };

  window._sorcLayoutRotate = function() {
    var wInput = document.getElementById('layoutPreview_w');
    var hInput = document.getElementById('layoutPreview_h');
    var tmp = wInput.value;
    wInput.value = hInput.value;
    hInput.value = tmp;
    var iframe = document.getElementById('layoutPreview_iframe');
    if (iframe) { iframe.style.width = wInput.value + 'px'; iframe.style.height = hInput.value + 'px'; }
    var scale = parseFloat(document.getElementById('layoutPreview_scale').value);
    var frame = document.getElementById('layoutPreview_frame');
    if (frame) { frame.style.width = (parseInt(wInput.value) * scale) + 'px'; frame.style.height = (parseInt(hInput.value) * scale) + 'px'; }
  };

  window._sorcRemoveBG = function() {
    var origCanvas = document.getElementById('bgRemover_orig');
    var resultCanvas = document.getElementById('bgRemover_result');
    if (!origCanvas || !resultCanvas) return;
    var ctx = origCanvas.getContext('2d');
    var rctx = resultCanvas.getContext('2d');
    var w = origCanvas.width, h = origCanvas.height;
    resultCanvas.width = w; resultCanvas.height = h;
    var imgData = ctx.getImageData(0, 0, w, h);
    var data = imgData.data;
    var method = document.getElementById('bgRemover_method').value;
    var threshold = parseInt(document.getElementById('bgRemover_threshold').value);
    var keyColor = document.getElementById('bgRemover_keyColor').value;
    var kr = parseInt(keyColor.substr(1,2),16), kg = parseInt(keyColor.substr(3,2),16), kb = parseInt(keyColor.substr(5,2),16);
    var bgR = data[0], bgG = data[1], bgB = data[2];
    for (var i = 0; i < data.length; i += 4) {
      var r = data[i], g = data[i+1], b = data[i+2];
      var remove = false;
      if (method.indexOf('Chroma') >= 0) {
        remove = Math.abs(r - kr) + Math.abs(g - kg) + Math.abs(b - kb) < threshold * 3;
      } else {
        remove = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB) < threshold * 3;
      }
      if (remove) data[i+3] = 0;
    }
    rctx.putImageData(imgData, 0, 0);
  };

  window._sorcTruePixelProcess = function() {
    var origCanvas = document.getElementById('truePixel_orig');
    var outCanvas = document.getElementById('truePixel_out');
    if (!origCanvas || !outCanvas) return;
    var level = parseInt(document.getElementById('truePixel_level').value);
    var paletteSize = parseInt(document.getElementById('truePixel_palette').value);
    var srcCtx = origCanvas.getContext('2d');
    var w = origCanvas.width, h = origCanvas.height;
    var pw = Math.max(1, Math.floor(w / level)), ph = Math.max(1, Math.floor(h / level));
    outCanvas.width = pw; outCanvas.height = ph;
    var outCtx = outCanvas.getContext('2d');
    outCtx.imageSmoothingEnabled = false;
    outCtx.drawImage(origCanvas, 0, 0, pw, ph);
    var imgData = outCtx.getImageData(0, 0, pw, ph);
    var data = imgData.data;
    var step = Math.max(1, Math.floor(256 / Math.pow(paletteSize, 1/3)));
    for (var i = 0; i < data.length; i += 4) {
      data[i] = Math.round(data[i] / step) * step;
      data[i+1] = Math.round(data[i+1] / step) * step;
      data[i+2] = Math.round(data[i+2] / step) * step;
    }
    outCtx.putImageData(imgData, 0, 0);
  };

  window._sorcQuickGenerate = function() {
    var canvas = document.getElementById('quickSprites_canvas');
    if (!canvas) return;
    var size = document.getElementById('quickSprites_size').value;
    var frames = parseInt(document.getElementById('quickSprites_frames').value) || 4;
    var parts = size.split('x');
    var fw = parseInt(parts[0]), fh = parseInt(parts[1]);
    canvas.width = fw * frames; canvas.height = fh;
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var f = 0; f < frames; f++) {
      var hue = (f / frames) * 360;
      ctx.fillStyle = 'hsl(' + hue + ', 60%, 40%)';
      ctx.fillRect(f * fw + 1, 1, fw - 2, fh - 2);
      ctx.fillStyle = 'hsl(' + hue + ', 70%, 60%)';
      var cx = f * fw + fw / 2, cy = fh / 2;
      var r = Math.min(fw, fh) / 3;
      ctx.beginPath();
      ctx.arc(cx, cy - 2 + (f % 2) * 2, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.fillRect(cx - r/3, cy - r/2 + (f % 2) * 2, 2, 2);
      ctx.fillRect(cx + r/3, cy - r/2 + (f % 2) * 2, 2, 2);
    }
    var info = document.getElementById('quickSprites_info');
    if (info) info.textContent = frames + ' frames @ ' + fw + 'x' + fh + ' (' + canvas.width + 'x' + canvas.height + ' sheet)';
  };

  window._sorcMakeSeamless = function() {
    var single = document.getElementById('seamlessTile_single');
    var grid = document.getElementById('seamlessTile_grid');
    if (!single || !grid) return;
    var sctx = single.getContext('2d');
    var tw = single.width, th = single.height;
    var gctx = grid.getContext('2d');
    grid.width = tw * 3; grid.height = th * 3;
    for (var gy = 0; gy < 3; gy++) {
      for (var gx = 0; gx < 3; gx++) {
        gctx.drawImage(single, gx * tw, gy * th);
      }
    }
  };

  document.addEventListener('sorcfile', function(e) {
    var file = e.detail.file;
    var targetId = e.detail.targetId;
    if (!file) return;

    if (file.type.startsWith('image/')) {
      var reader = new FileReader();
      reader.onload = function(ev) {
        var img = new Image();
        img.onload = function() {
          var canvasMap = {
            'bgRemover_upload': 'bgRemover_orig',
            'truePixel_upload': 'truePixel_orig',
            'slicer_upload': 'slicer_canvas',
            'expander_upload': 'expander_canvas',
            'autoSprite_upload': 'autoSprite_canvas',
            'spriteAnalyzer_upload': 'spriteAnalyzer_src',
            'seamlessTile_upload': 'seamlessTile_single',
            'tilesetForge_upload': 'tilesetForge_canvas',
          };
          var canvasId = canvasMap[targetId];
          if (canvasId) {
            var canvas = document.getElementById(canvasId);
            if (canvas) {
              canvas.width = img.width;
              canvas.height = img.height;
              var ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);
            }
          }
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    }

    if (file.type.startsWith('audio/') && targetId === 'sfxEditor_upload') {
      var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var freader = new FileReader();
      freader.onload = function(ev) {
        audioCtx.decodeAudioData(ev.target.result, function(buffer) {
          window._sorcSFXBuffer = buffer;
          window._sorcSFXAudioCtx = audioCtx;
          var canvas = document.getElementById('sfxEditor_waveform');
          if (canvas) {
            var ctx = canvas.getContext('2d');
            var data = buffer.getChannelData(0);
            var w = canvas.width, h = canvas.height;
            ctx.clearRect(0, 0, w, h);
            ctx.strokeStyle = 'var(--accent, #58a6ff)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            var step = Math.ceil(data.length / w);
            for (var i = 0; i < w; i++) {
              var idx = i * step;
              var val = data[idx] || 0;
              var y = (val + 1) / 2 * h;
              if (i === 0) ctx.moveTo(i, y);
              else ctx.lineTo(i, y);
            }
            ctx.stroke();
          }
        });
      };
      freader.readAsArrayBuffer(file);
    }
  });

  window._sorcSFXPlay = function() {
    if (!window._sorcSFXBuffer || !window._sorcSFXAudioCtx) return;
    var ctx = window._sorcSFXAudioCtx;
    var source = ctx.createBufferSource();
    source.buffer = window._sorcSFXBuffer;
    var volume = parseInt(document.getElementById('sfxEditor_volume').value) / 100;
    var pitch = parseInt(document.getElementById('sfxEditor_pitch').value) / 100;
    source.playbackRate.value = pitch;
    var gainNode = ctx.createGain();
    gainNode.gain.value = volume;
    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    source.start(0);
    window._sorcSFXSource = source;
  };

  window._sorcSFXStop = function() {
    if (window._sorcSFXSource) {
      try { window._sorcSFXSource.stop(); } catch(e) {}
    }
  };

  window._sorcSFXExport = function() {
    if (!window._sorcSFXBuffer) return;
    var buffer = window._sorcSFXBuffer;
    var numChannels = buffer.numberOfChannels;
    var sampleRate = buffer.sampleRate;
    var length = buffer.length;
    var wavBuffer = new ArrayBuffer(44 + length * numChannels * 2);
    var view = new DataView(wavBuffer);
    function writeString(offset, str) { for (var i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i)); }
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * numChannels * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * 2, true);
    view.setUint16(32, numChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * numChannels * 2, true);
    var offset = 44;
    for (var i = 0; i < length; i++) {
      for (var ch = 0; ch < numChannels; ch++) {
        var sample = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }
    var blob = new Blob([wavBuffer], { type: 'audio/wav' });
    var link = document.createElement('a');
    link.download = 'sfx_export.wav';
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  window._sorcSlice = function() {
    var canvas = document.getElementById('slicer_canvas');
    if (!canvas) return;
    var cols = parseInt(document.getElementById('slicer_cols').value) || 4;
    var rows = parseInt(document.getElementById('slicer_rows').value) || 4;
    var pad = parseInt(document.getElementById('slicer_pad').value) || 0;
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    var fw = Math.floor((w - pad * (cols - 1)) / cols);
    var fh = Math.floor((h - pad * (rows - 1)) / rows);
    ctx.strokeStyle = 'rgba(255,0,0,0.7)';
    ctx.lineWidth = 1;
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        ctx.strokeRect(c * (fw + pad), r * (fh + pad), fw, fh);
      }
    }
    var framesDiv = document.getElementById('slicer_frames');
    if (framesDiv) {
      framesDiv.innerHTML = '';
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          var fcanvas = document.createElement('canvas');
          fcanvas.width = fw; fcanvas.height = fh;
          var fctx = fcanvas.getContext('2d');
          fctx.drawImage(canvas, c * (fw + pad), r * (fh + pad), fw, fh, 0, 0, fw, fh);
          var div = document.createElement('div');
          div.style.cssText = 'border:2px solid var(--accent);border-radius:2px;cursor:pointer;padding:2px;background:#1a1a2e;';
          div.setAttribute('data-selected', 'true');
          div.onclick = function() {
            var sel = this.getAttribute('data-selected') === 'true';
            this.setAttribute('data-selected', sel ? 'false' : 'true');
            this.style.borderColor = sel ? '#3a3a5c' : 'var(--accent)';
            this.style.opacity = sel ? '0.4' : '1';
          };
          var img = document.createElement('img');
          img.src = fcanvas.toDataURL();
          img.style.cssText = 'width:32px;height:32px;image-rendering:pixelated;display:block;';
          div.appendChild(img);
          framesDiv.appendChild(div);
        }
      }
    }
  };

  window._sorcSliceSelectAll = function() {
    document.querySelectorAll('#slicer_frames > div').forEach(function(d) {
      d.setAttribute('data-selected', 'true');
      d.style.borderColor = 'var(--accent)';
      d.style.opacity = '1';
    });
  };

  window._sorcSliceDeselectAll = function() {
    document.querySelectorAll('#slicer_frames > div').forEach(function(d) {
      d.setAttribute('data-selected', 'false');
      d.style.borderColor = '#3a3a5c';
      d.style.opacity = '0.4';
    });
  };

  window._sorcSliceExport = function() {
    var selected = document.querySelectorAll('#slicer_frames > div[data-selected="true"] img');
    selected.forEach(function(img, i) {
      var link = document.createElement('a');
      link.download = 'frame_' + i + '.png';
      link.href = img.src;
      link.click();
    });
  };

  window._sorcExpand = function(dir) {
    var canvas = document.getElementById('expander_canvas');
    if (!canvas) return;
    var amount = parseInt(document.getElementById('expander_amount').value) || 16;
    var fill = document.getElementById('expander_fill').value;
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    var imgData = ctx.getImageData(0, 0, w, h);
    var nw = w, nh = h, dx = 0, dy = 0;
    if (dir === 'up') { nh += amount; dy = amount; }
    else if (dir === 'down') { nh += amount; }
    else if (dir === 'left') { nw += amount; dx = amount; }
    else if (dir === 'right') { nw += amount; }
    canvas.width = nw; canvas.height = nh;
    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, nw, nh);
    if (fill === 'Mirror') {
      ctx.save();
      if (dir === 'up') { ctx.translate(0, amount); ctx.scale(1, -1); ctx.drawImage(canvas, 0, 0); ctx.restore(); }
      else if (dir === 'down') { ctx.translate(0, nh); ctx.scale(1, -1); ctx.drawImage(canvas, 0, 0); ctx.restore(); }
    }
    ctx.putImageData(imgData, dx, dy);
    if (fill === 'Edge Extend') {
      if (dir === 'up') {
        var row = ctx.getImageData(0, dy, nw, 1);
        for (var i = 0; i < amount; i++) ctx.putImageData(row, 0, i);
      } else if (dir === 'down') {
        var row = ctx.getImageData(0, h - 1, nw, 1);
        for (var i = 0; i < amount; i++) ctx.putImageData(row, 0, h + i);
      } else if (dir === 'left') {
        var col = ctx.getImageData(dx, 0, 1, nh);
        for (var i = 0; i < amount; i++) ctx.putImageData(col, i, 0);
      } else if (dir === 'right') {
        var col = ctx.getImageData(w - 1, 0, 1, nh);
        for (var i = 0; i < amount; i++) ctx.putImageData(col, w + i, 0);
      }
    }
  };

  window._sorcBatchFiles = function(e) {
    window._sorcBatchFileList = Array.from(e.target.files);
    var listDiv = document.getElementById('batchUtils_fileList');
    if (listDiv) {
      listDiv.innerHTML = window._sorcBatchFileList.map(function(f) {
        return '<div style="padding:2px 0;">' + f.name + ' (' + (f.size / 1024).toFixed(1) + ' KB)</div>';
      }).join('');
    }
  };

  window._sorcBatchDrop = function(e) {
    window._sorcBatchFileList = Array.from(e.dataTransfer.files);
    var listDiv = document.getElementById('batchUtils_fileList');
    if (listDiv) {
      listDiv.innerHTML = window._sorcBatchFileList.map(function(f) {
        return '<div style="padding:2px 0;">' + f.name + ' (' + (f.size / 1024).toFixed(1) + ' KB)</div>';
      }).join('');
    }
  };

  window._sorcBatchProcess = function() {
    if (!window._sorcBatchFileList || !window._sorcBatchFileList.length) return;
    var op = document.getElementById('batchUtils_op').value;
    var outputDiv = document.getElementById('batchUtils_output');
    if (!outputDiv) return;
    outputDiv.innerHTML = '';
    window._sorcBatchResults = [];

    window._sorcBatchFileList.forEach(function(file) {
      if (!file.type.startsWith('image/')) return;
      var reader = new FileReader();
      reader.onload = function(ev) {
        var img = new Image();
        img.onload = function() {
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');
          if (op === 'resize') {
            var tw = parseInt(document.getElementById('batchUtils_w').value) || 64;
            var th = parseInt(document.getElementById('batchUtils_h').value) || 64;
            canvas.width = tw; canvas.height = th;
            ctx.drawImage(img, 0, 0, tw, th);
          } else if (op === 'reduceColors') {
            canvas.width = img.width; canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var data = imgData.data;
            for (var i = 0; i < data.length; i += 4) {
              data[i] = Math.round(data[i] / 64) * 64;
              data[i+1] = Math.round(data[i+1] / 64) * 64;
              data[i+2] = Math.round(data[i+2] / 64) * 64;
            }
            ctx.putImageData(imgData, 0, 0);
          } else {
            canvas.width = img.width; canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
          }
          var preview = document.createElement('div');
          preview.style.cssText = 'text-align:center;';
          var pimg = document.createElement('img');
          pimg.src = canvas.toDataURL('image/png');
          pimg.style.cssText = 'width:48px;height:48px;image-rendering:pixelated;border:1px solid var(--border);border-radius:2px;';
          var label = document.createElement('div');
          label.style.cssText = 'font-size:9px;color:var(--text2);margin-top:2px;max-width:60px;overflow:hidden;text-overflow:ellipsis;';
          label.textContent = file.name;
          preview.appendChild(pimg);
          preview.appendChild(label);
          outputDiv.appendChild(preview);
          window._sorcBatchResults.push({ name: file.name, dataUrl: pimg.src });
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  window._sorcBatchDownload = function() {
    if (!window._sorcBatchResults) return;
    window._sorcBatchResults.forEach(function(r) {
      var link = document.createElement('a');
      link.download = r.name;
      link.href = r.dataUrl;
      link.click();
    });
  };

})();
