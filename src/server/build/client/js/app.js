(function() {
  "use strict";

  let currentRomData = null;
  let muted = false;
  let currentTileImage = null;
  let currentTileName = null;
  let tilePixelData = null;
  let selectedColor = 0;
  const GB_COLORS = ['#FFFFFF', '#AAAAAA', '#555555', '#000000'];

  function setStatus(text, type) {
    document.getElementById('statusText').textContent = text;
    const dot = document.getElementById('statusDot');
    dot.style.background = type === 'error' ? 'var(--red)' : type === 'building' ? 'var(--yellow)' : 'var(--green)';
  }

  document.querySelectorAll('.ttab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.ttab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('panel-' + tab.dataset.panel);
      if (panel) panel.classList.add('active');
      if (tab.dataset.panel === 'tiles') loadTiles();
      if (tab.dataset.panel === 'maps') loadMaps();
      if (tab.dataset.panel === 'strings') loadStrings();
      if (tab.dataset.panel === 'tables') loadTables();
      if (tab.dataset.panel === 'source') loadSrcFiles();
      if (tab.dataset.panel === 'build') checkRomStatus();
    });
  });

  const keyMap = {
    ArrowRight: 'right', ArrowLeft: 'left', ArrowUp: 'up', ArrowDown: 'down',
    KeyZ: 'a', KeyX: 'b', ShiftRight: 'select', Enter: 'start',
    KeyA: 'left', KeyD: 'right', KeyW: 'up', KeyS: 'down',
  };

  document.addEventListener('keydown', (e) => {
    const k = keyMap[e.code];
    if (k && typeof GameBoyKeyDown === 'function') { GameBoyKeyDown(k); e.preventDefault(); }
  });
  document.addEventListener('keyup', (e) => {
    const k = keyMap[e.code];
    if (k && typeof GameBoyKeyUp === 'function') { GameBoyKeyUp(k); e.preventDefault(); }
  });

  function setupTouchButton(btn) {
    const key = btn.dataset.key;
    if (!key) return;
    const down = () => { btn.classList.add('pressed'); if (typeof GameBoyKeyDown === 'function') GameBoyKeyDown(key); };
    const up = () => { btn.classList.remove('pressed'); if (typeof GameBoyKeyUp === 'function') GameBoyKeyUp(key); };
    btn.addEventListener('mousedown', down); btn.addEventListener('mouseup', up); btn.addEventListener('mouseleave', up);
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); down(); });
    btn.addEventListener('touchend', (e) => { e.preventDefault(); up(); });
  }
  document.querySelectorAll('.dpad-btn[data-key], .ab-btn, .ss-btn').forEach(setupTouchButton);

  function resumeAudio() {
    if (typeof ensureAudioContext === 'function') ensureAudioContext();
    if (typeof XAudioJSWebAudioContextHandle !== 'undefined' && XAudioJSWebAudioContextHandle && XAudioJSWebAudioContextHandle.state === 'suspended') {
      XAudioJSWebAudioContextHandle.resume().then(function() { console.log('[Audio] Context resumed'); });
    }
  }

  function loadRomData(data) {
    resumeAudio();
    currentRomData = '';
    for (let i = 0; i < data.length; i++) currentRomData += String.fromCharCode(data[i]);
    const canvas = document.getElementById('gbCanvas');
    try {
      start(canvas, currentRomData);
      setStatus('ROM loaded and running', 'ok');
      document.getElementById('romStatus').textContent = 'ROM loaded (' + Math.round(data.length / 1024) + ' KB)';
      setTimeout(resumeAudio, 100);
    } catch(e) {
      setStatus('Emulator error: ' + e.message, 'error');
      console.error(e);
    }
  }

  document.getElementById('romFileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const arr = new Uint8Array(ev.target.result);
      loadRomData(arr);
      document.getElementById('romStatus').textContent = file.name + ' (' + Math.round(file.size / 1024) + ' KB)';
    };
    reader.readAsArrayBuffer(file);
  });

  document.getElementById('loadBuiltRom').addEventListener('click', async () => {
    setStatus('Loading built ROM...', 'building');
    try {
      const resp = await fetch('/LabyrinthOfTheDragon.gbc');
      if (!resp.ok) throw new Error('ROM not found. Build it first.');
      const buf = await resp.arrayBuffer();
      loadRomData(new Uint8Array(buf));
    } catch(e) {
      setStatus('Failed: ' + e.message, 'error');
    }
  });

  document.getElementById('emuPlay').addEventListener('click', () => {
    resumeAudio();
    if (typeof run === 'function') { run(); setStatus('Playing', 'ok'); }
  });
  document.getElementById('emuPause').addEventListener('click', () => {
    if (typeof pause === 'function') { pause(); setStatus('Paused', 'ok'); }
  });
  document.getElementById('emuReset').addEventListener('click', () => {
    if (currentRomData) {
      resumeAudio();
      const canvas = document.getElementById('gbCanvas');
      start(canvas, currentRomData);
      setStatus('Reset', 'ok');
    }
  });
  document.getElementById('emuSpeed').addEventListener('change', (e) => {
    if (typeof settings !== 'undefined') settings[6] = parseInt(e.target.value);
  });
  document.getElementById('emuSave').addEventListener('click', () => {
    if (typeof save === 'function') { save(); setStatus('State saved', 'ok'); }
  });
  document.getElementById('emuMute').addEventListener('click', () => {
    muted = !muted;
    if (typeof settings !== 'undefined') {
      settings[0] = !muted;
      if (!muted) {
        resumeAudio();
        settings[3] = 1;
        if (typeof gameboy !== 'undefined' && gameboy && gameboy.audioHandle) {
          gameboy.audioHandle.changeVolume(1);
        }
      } else {
        if (typeof gameboy !== 'undefined' && gameboy && gameboy.audioHandle) {
          gameboy.audioHandle.changeVolume(0);
        }
      }
    }
    document.getElementById('emuMute').textContent = muted ? 'Unmute' : 'Mute';
    document.getElementById('emuMute').classList.toggle('active', muted);
  });

  async function loadTiles() {
    try {
      const resp = await fetch('/api/tiles');
      const tiles = await resp.json();
      const sidebar = document.getElementById('tileSidebar');
      sidebar.innerHTML = '<div class="sidebar-header">Tile Sheets</div>';
      tiles.forEach(t => {
        const item = document.createElement('div');
        item.className = 'sidebar-item';
        item.textContent = t.replace('.png', '').replace(/_/g, ' ');
        item.addEventListener('click', () => {
          sidebar.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));
          item.classList.add('active');
          openTileEditor(t);
        });
        sidebar.appendChild(item);
      });
    } catch(e) { console.error('Failed to load tiles', e); }
  }

  function openTileEditor(filename) {
    currentTileName = filename;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      currentTileImage = img;
      const canvas = document.getElementById('tileCanvas');
      const scale = Math.min(Math.floor(600 / img.width), Math.floor(400 / img.height), 8);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.dataset.scale = scale;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const tmpCanvas = document.createElement('canvas');
      tmpCanvas.width = img.width; tmpCanvas.height = img.height;
      const tmpCtx = tmpCanvas.getContext('2d');
      tmpCtx.drawImage(img, 0, 0);
      tilePixelData = tmpCtx.getImageData(0, 0, img.width, img.height);

      document.getElementById('tileInfo').textContent =
        filename + ' (' + img.width + 'x' + img.height + ') - ' + (img.width * img.height / 64) + ' tiles';
      document.getElementById('saveTileBtn').style.display = 'inline-block';
    };
    img.src = '/assets/tiles/' + filename;
  }

  const tileCanvas = document.getElementById('tileCanvas');
  tileCanvas.addEventListener('mousedown', (e) => { drawOnTile(e); tileCanvas._drawing = true; });
  tileCanvas.addEventListener('mousemove', (e) => { if (tileCanvas._drawing) drawOnTile(e); });
  tileCanvas.addEventListener('mouseup', () => { tileCanvas._drawing = false; });
  tileCanvas.addEventListener('mouseleave', () => { tileCanvas._drawing = false; });

  function drawOnTile(e) {
    if (!tilePixelData || !currentTileImage) return;
    const canvas = document.getElementById('tileCanvas');
    const scale = parseInt(canvas.dataset.scale) || 1;
    const rect = canvas.getBoundingClientRect();
    const px = Math.floor((e.clientX - rect.left) / scale);
    const py = Math.floor((e.clientY - rect.top) / scale);
    if (px < 0 || py < 0 || px >= currentTileImage.width || py >= currentTileImage.height) return;

    const colors = [[255,255,255],[170,170,170],[85,85,85],[0,0,0]];
    const c = colors[selectedColor];
    const idx = (py * currentTileImage.width + px) * 4;
    tilePixelData.data[idx] = c[0]; tilePixelData.data[idx+1] = c[1]; tilePixelData.data[idx+2] = c[2]; tilePixelData.data[idx+3] = 255;

    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = currentTileImage.width; tmpCanvas.height = currentTileImage.height;
    const tmpCtx = tmpCanvas.getContext('2d');
    tmpCtx.putImageData(tilePixelData, 0, 0);

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tmpCanvas, 0, 0, canvas.width, canvas.height);
  }

  document.querySelectorAll('.palette-color').forEach(pc => {
    pc.addEventListener('click', () => {
      document.querySelectorAll('.palette-color').forEach(p => p.classList.remove('active'));
      pc.classList.add('active');
      selectedColor = parseInt(pc.dataset.color);
    });
  });

  document.getElementById('saveTileBtn').addEventListener('click', async () => {
    if (!tilePixelData || !currentTileName) return;
    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = currentTileImage.width; tmpCanvas.height = currentTileImage.height;
    const tmpCtx = tmpCanvas.getContext('2d');
    tmpCtx.putImageData(tilePixelData, 0, 0);
    const blob = await new Promise(r => tmpCanvas.toBlob(r, 'image/png'));
    const formData = new FormData();
    formData.append('file', blob, currentTileName);
    try {
      const resp = await fetch('/api/upload-tile', { method: 'POST', body: blob, headers: { 'X-Filename': currentTileName } });
      const result = await resp.json();
      if (result.success) { setStatus('Tile saved: ' + currentTileName, 'ok'); }
      else { setStatus('Save failed', 'error'); }
    } catch(e) { setStatus('Save error: ' + e.message, 'error'); }
  });

  let currentMapBytes = null;
  let currentMapName = null;
  let currentMapView = 'grid';
  let currentMapWidth = 20;
  let currentMapHeight = 18;

  async function loadMaps() {
    try {
      const [tilemaps, maps] = await Promise.all([
        fetch('/api/tilemaps').then(r => r.json()),
        fetch('/api/maps').then(r => r.json()),
      ]);
      const sidebar = document.getElementById('mapSidebar');
      sidebar.innerHTML = '<div class="sidebar-header">Tilemaps</div>';
      tilemaps.forEach(t => {
        const item = document.createElement('div');
        item.className = 'sidebar-item';
        item.textContent = t.replace('.tilemap', '');
        item.addEventListener('click', () => {
          sidebar.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));
          item.classList.add('active');
          viewTilemap(t);
        });
        sidebar.appendChild(item);
      });
      if (maps.length) {
        const hdr = document.createElement('div');
        hdr.className = 'sidebar-header'; hdr.textContent = 'Maps';
        sidebar.appendChild(hdr);
        maps.forEach(m => {
          const item = document.createElement('div');
          item.className = 'sidebar-item';
          item.textContent = m;
          item.addEventListener('click', () => {
            sidebar.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));
            item.classList.add('active');
            viewTilemap(m);
          });
          sidebar.appendChild(item);
        });
      }
    } catch(e) { console.error('Failed to load maps', e); }
  }

  function detectMapDimensions(byteLen) {
    const knownSizes = [
      { w: 20, h: 18 }, { w: 32, h: 32 }, { w: 20, h: 12 },
      { w: 17, h: 12 }, { w: 11, h: 13 }, { w: 16, h: 16 },
      { w: 10, h: 9 }, { w: 32, h: 30 }, { w: 20, h: 20 },
    ];
    for (const s of knownSizes) {
      if (s.w * s.h === byteLen) return s;
    }
    for (let w = 32; w >= 4; w--) {
      if (byteLen % w === 0) {
        const h = byteLen / w;
        if (h >= 4 && h <= 256) return { w, h };
      }
    }
    const sq = Math.ceil(Math.sqrt(byteLen));
    return { w: sq, h: Math.ceil(byteLen / sq) };
  }

  function setMapViewMode(mode) {
    currentMapView = mode;
    document.getElementById('mapViewGrid').classList.toggle('map-view-btn-active', mode === 'grid');
    document.getElementById('mapViewHex').classList.toggle('map-view-btn-active', mode === 'hex');
    document.getElementById('mapViewVisual').classList.toggle('map-view-btn-active', mode === 'visual');
    renderMapView();
  }

  function renderMapView() {
    if (!currentMapBytes) return;
    const canvas = document.getElementById('mapCanvas');
    const gridView = document.getElementById('mapGridView');
    const hexView = document.getElementById('mapHexView');
    const hoverInfo = document.getElementById('mapHoverInfo');

    canvas.style.display = 'none';
    gridView.style.display = 'none';
    hexView.style.display = 'none';
    hoverInfo.textContent = '';

    const w = currentMapWidth;
    const h = currentMapHeight;
    const bytes = currentMapBytes;

    if (currentMapView === 'grid') {
      gridView.style.display = 'grid';
      gridView.style.gridTemplateColumns = 'repeat(' + w + ', 32px)';
      let html = '';
      for (let i = 0; i < w * h && i < bytes.length; i++) {
        const v = bytes[i];
        const row = Math.floor(i / w);
        const col = i % w;
        const hue = (v * 7) % 360;
        const bg = 'hsl(' + hue + ', 40%, 20%)';
        html += '<div class="map-grid-cell" style="background:' + bg + '" title="Tile ' + v + ' (0x' + v.toString(16).toUpperCase().padStart(2, '0') + ') at [' + col + ',' + row + ']" data-idx="' + i + '">' + v.toString(16).toUpperCase().padStart(2, '0') + '</div>';
      }
      gridView.innerHTML = html;
      gridView.querySelectorAll('.map-grid-cell').forEach(cell => {
        cell.addEventListener('mouseenter', () => {
          const idx = parseInt(cell.dataset.idx);
          const v = bytes[idx];
          const row = Math.floor(idx / w);
          const col = idx % w;
          hoverInfo.textContent = 'Tile #' + v + ' (0x' + v.toString(16).toUpperCase().padStart(2, '0') + ') | Position: [' + col + ', ' + row + '] | Offset: 0x' + idx.toString(16).toUpperCase().padStart(4, '0');
        });
        cell.addEventListener('mouseleave', () => { hoverInfo.textContent = ''; });
      });
    } else if (currentMapView === 'hex') {
      hexView.style.display = 'block';
      let html = '';
      for (let offset = 0; offset < bytes.length; offset += 16) {
        const offsetStr = '<span class="hex-offset">' + offset.toString(16).toUpperCase().padStart(4, '0') + '</span>  ';
        let hexPart = '';
        let asciiPart = '';
        for (let j = 0; j < 16; j++) {
          if (offset + j < bytes.length) {
            const b = bytes[offset + j];
            hexPart += '<span class="hex-byte">' + b.toString(16).toUpperCase().padStart(2, '0') + '</span> ';
            asciiPart += (b >= 32 && b < 127) ? String.fromCharCode(b) : '.';
          } else {
            hexPart += '   ';
            asciiPart += ' ';
          }
          if (j === 7) hexPart += ' ';
        }
        html += offsetStr + hexPart + ' <span class="hex-ascii">|' + asciiPart + '|</span>\n';
      }
      hexView.innerHTML = html;
    } else {
      canvas.style.display = 'block';
      const showGrid = document.getElementById('mapGridLines').checked;
      const cellSize = Math.max(8, Math.min(24, Math.floor(600 / Math.max(w, h))));
      canvas.width = w * cellSize;
      canvas.height = h * cellSize;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;

      for (let i = 0; i < w * h && i < bytes.length; i++) {
        const v = bytes[i];
        const col = i % w;
        const row = Math.floor(i / w);
        const x = col * cellSize;
        const y = row * cellSize;
        const hue = (v * 7) % 360;
        ctx.fillStyle = 'hsl(' + hue + ', 60%, ' + (30 + (v % 40)) + '%)';
        ctx.fillRect(x, y, cellSize, cellSize);
      }

      if (showGrid) {
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= w; x++) {
          ctx.beginPath();
          ctx.moveTo(x * cellSize + 0.5, 0);
          ctx.lineTo(x * cellSize + 0.5, h * cellSize);
          ctx.stroke();
        }
        for (let y = 0; y <= h; y++) {
          ctx.beginPath();
          ctx.moveTo(0, y * cellSize + 0.5);
          ctx.lineTo(w * cellSize, y * cellSize + 0.5);
          ctx.stroke();
        }
      }

      if (cellSize >= 14) {
        ctx.fillStyle = '#fff';
        ctx.font = (cellSize > 16 ? 9 : 7) + 'px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (let i = 0; i < w * h && i < bytes.length; i++) {
          const v = bytes[i];
          const col = i % w;
          const row = Math.floor(i / w);
          ctx.fillText(v.toString(16).toUpperCase().padStart(2, '0'), col * cellSize + cellSize / 2, row * cellSize + cellSize / 2);
        }
      }

      canvas.onmousemove = function(e) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const sx = canvas.width / rect.width;
        const sy = canvas.height / rect.height;
        const col = Math.floor(mx * sx / cellSize);
        const row = Math.floor(my * sy / cellSize);
        if (col >= 0 && col < w && row >= 0 && row < h) {
          const idx = row * w + col;
          if (idx < bytes.length) {
            const v = bytes[idx];
            hoverInfo.textContent = 'Tile #' + v + ' (0x' + v.toString(16).toUpperCase().padStart(2, '0') + ') | Position: [' + col + ', ' + row + '] | Offset: 0x' + idx.toString(16).toUpperCase().padStart(4, '0');
          }
        }
      };
      canvas.onmouseleave = function() { hoverInfo.textContent = ''; };
    }
  }

  async function viewTilemap(name) {
    try {
      const resp = await fetch('/api/tilemap-data?name=' + encodeURIComponent(name));
      const data = await resp.json();
      const raw = atob(data.data);
      const bytes = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);

      currentMapBytes = bytes;
      currentMapName = name;

      const dims = detectMapDimensions(bytes.length);
      currentMapWidth = dims.w;
      currentMapHeight = dims.h;

      document.getElementById('mapWidth').value = dims.w;
      document.getElementById('mapHeight').value = dims.h;

      const info = document.getElementById('mapInfo');
      info.textContent = name + ' - ' + data.size + ' bytes';

      const dimsInfo = document.getElementById('mapDimsInfo');
      dimsInfo.textContent = 'Dimensions: ' + dims.w + ' x ' + dims.h + ' (' + bytes.length + ' bytes) | Tile range: 0x00-0x' + Math.max(...bytes).toString(16).toUpperCase().padStart(2, '0');

      setMapViewMode(currentMapView);
    } catch(e) { console.error('Failed to load tilemap', e); }
  }

  document.getElementById('mapViewGrid').addEventListener('click', () => setMapViewMode('grid'));
  document.getElementById('mapViewHex').addEventListener('click', () => setMapViewMode('hex'));
  document.getElementById('mapViewVisual').addEventListener('click', () => setMapViewMode('visual'));
  document.getElementById('mapApplyDims').addEventListener('click', () => {
    currentMapWidth = parseInt(document.getElementById('mapWidth').value) || 20;
    currentMapHeight = parseInt(document.getElementById('mapHeight').value) || 18;
    if (currentMapBytes) {
      const dimsInfo = document.getElementById('mapDimsInfo');
      dimsInfo.textContent = 'Dimensions: ' + currentMapWidth + ' x ' + currentMapHeight + ' (' + currentMapBytes.length + ' bytes) | Tile range: 0x00-0x' + Math.max(...currentMapBytes).toString(16).toUpperCase().padStart(2, '0');
      renderMapView();
    }
  });
  document.getElementById('mapGridLines').addEventListener('change', () => {
    if (currentMapView === 'visual') renderMapView();
  });
  setMapViewMode('grid');

  async function loadStrings() {
    try {
      const resp = await fetch('/api/strings');
      const data = await resp.json();
      document.getElementById('stringsEditor').value = data.content;
    } catch(e) { console.error(e); }
  }
  document.getElementById('saveStrings').addEventListener('click', async () => {
    try {
      const resp = await fetch('/api/strings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: document.getElementById('stringsEditor').value })
      });
      const r = await resp.json();
      if (r.success) setStatus('Strings saved', 'ok');
    } catch(e) { setStatus('Save failed: ' + e.message, 'error'); }
  });

  let tableData = { headers: [], types: [], rows: [] };
  let tableFilteredRows = null;
  let tableSortCol = -1;
  let tableSortDir = 0;
  let tableSelectedRow = -1;
  let tableRawMode = false;

  function parseCSV(text) {
    const lines = text.trim().split('\n').map(l => l.split(','));
    if (lines.length < 2) return { headers: [], types: [], rows: [] };
    return { headers: lines[0], types: lines[1], rows: lines.slice(2) };
  }

  function tableToCSV() {
    const lines = [tableData.headers.join(','), tableData.types.join(',')];
    tableData.rows.forEach(r => lines.push(r.join(',')));
    return lines.join('\n');
  }

  function renderSpreadsheet() {
    const head = document.getElementById('spreadsheetHead');
    const body = document.getElementById('spreadsheetBody');
    const info = document.getElementById('tableInfoBar');
    const rows = tableFilteredRows || tableData.rows;
    info.textContent = tableData.headers.length + ' columns, ' + tableData.rows.length + ' rows' +
      (tableFilteredRows ? ' (' + tableFilteredRows.length + ' shown)' : '') +
      ' | Types: ' + (tableData.types.slice(0, 5).join(', ')) + (tableData.types.length > 5 ? '...' : '');

    let headHtml = '<tr><th class="row-num">#</th>';
    tableData.headers.forEach((h, i) => {
      const cls = tableSortCol === i ? (tableSortDir === 1 ? ' sort-asc' : ' sort-desc') : '';
      headHtml += '<th class="' + cls + '" data-col="' + i + '" title="' + (tableData.types[i] || '') + '">' + h + '</th>';
    });
    headHtml += '</tr>';
    head.innerHTML = headHtml;

    let bodyHtml = '';
    rows.forEach((row, ri) => {
      const origIdx = tableFilteredRows ? tableData.rows.indexOf(row) : ri;
      const sel = origIdx === tableSelectedRow ? ' selected' : '';
      bodyHtml += '<tr class="' + sel + '" data-row="' + origIdx + '"><td class="row-num">' + (origIdx + 1) + '</td>';
      tableData.headers.forEach((_, ci) => {
        const val = row[ci] !== undefined ? row[ci] : '';
        const isNum = !isNaN(val) && val !== '';
        bodyHtml += '<td contenteditable="true" class="' + (isNum ? 'cell-number' : '') + '" data-row="' + origIdx + '" data-col="' + ci + '">' + val + '</td>';
      });
      bodyHtml += '</tr>';
    });
    body.innerHTML = bodyHtml;

    head.querySelectorAll('th[data-col]').forEach(th => {
      th.addEventListener('click', () => {
        const col = parseInt(th.dataset.col);
        if (tableSortCol === col) { tableSortDir = tableSortDir === 1 ? -1 : tableSortDir === -1 ? 0 : 1; }
        else { tableSortCol = col; tableSortDir = 1; }
        if (tableSortDir === 0) { tableSortCol = -1; tableFilteredRows = null; }
        else {
          const sorted = [...(tableFilteredRows || tableData.rows)];
          sorted.sort((a, b) => {
            const av = a[col] || '', bv = b[col] || '';
            const an = parseFloat(av), bn = parseFloat(bv);
            if (!isNaN(an) && !isNaN(bn)) return (an - bn) * tableSortDir;
            return av.localeCompare(bv) * tableSortDir;
          });
          tableFilteredRows = sorted;
        }
        renderSpreadsheet();
      });
    });

    body.querySelectorAll('td[contenteditable]').forEach(td => {
      td.addEventListener('blur', () => {
        const r = parseInt(td.dataset.row), c = parseInt(td.dataset.col);
        if (tableData.rows[r]) tableData.rows[r][c] = td.textContent;
      });
      td.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          const next = e.shiftKey ? td.previousElementSibling : td.nextElementSibling;
          if (next && next.contentEditable === 'true') next.focus();
        }
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          const tr = td.parentElement;
          const ci = Array.from(tr.children).indexOf(td);
          const nextTr = e.ctrlKey ? tr.previousElementSibling : tr.nextElementSibling;
          if (nextTr && nextTr.children[ci]) nextTr.children[ci].focus();
        }
      });
    });

    body.querySelectorAll('tr').forEach(tr => {
      tr.addEventListener('click', () => {
        tableSelectedRow = parseInt(tr.dataset.row);
        body.querySelectorAll('tr').forEach(r => r.classList.remove('selected'));
        tr.classList.add('selected');
      });
    });
  }

  function applyTableFilter(query) {
    if (!query.trim()) { tableFilteredRows = null; renderSpreadsheet(); return; }
    const match = query.match(/^(\w+)\s*(=|!=|>|<|>=|<=|LIKE)\s*(.+)$/i);
    if (match) {
      const col = match[1].toLowerCase(), op = match[2].toUpperCase(), val = match[3].trim().replace(/^['"]|['"]$/g, '');
      const ci = tableData.headers.findIndex(h => h.toLowerCase() === col);
      if (ci === -1) { tableFilteredRows = null; renderSpreadsheet(); return; }
      tableFilteredRows = tableData.rows.filter(row => {
        const cv = row[ci] || '';
        if (op === '=') return cv === val;
        if (op === '!=') return cv !== val;
        if (op === 'LIKE') return cv.toLowerCase().includes(val.toLowerCase().replace(/%/g, ''));
        const cn = parseFloat(cv), vn = parseFloat(val);
        if (isNaN(cn) || isNaN(vn)) return false;
        if (op === '>') return cn > vn;
        if (op === '<') return cn < vn;
        if (op === '>=') return cn >= vn;
        if (op === '<=') return cn <= vn;
        return false;
      });
    } else {
      const q = query.toLowerCase();
      tableFilteredRows = tableData.rows.filter(row => row.some(c => (c || '').toLowerCase().includes(q)));
    }
    renderSpreadsheet();
  }

  async function loadTables() {
    try {
      const resp = await fetch('/api/tables');
      const data = await resp.json();
      document.getElementById('tablesEditor').value = data.content;
      tableData = parseCSV(data.content);
      tableFilteredRows = null;
      tableSortCol = -1;
      tableSortDir = 0;
      renderSpreadsheet();
    } catch(e) { console.error(e); }
  }

  document.getElementById('tableAddRow').addEventListener('click', () => {
    const newRow = tableData.headers.map(() => '0');
    tableData.rows.push(newRow);
    renderSpreadsheet();
  });
  document.getElementById('tableAddCol').addEventListener('click', () => {
    const name = prompt('Column name:');
    if (!name) return;
    const type = prompt('Type (uint8_t, uint16_t, int8_t):', 'uint8_t') || 'uint8_t';
    tableData.headers.push(name);
    tableData.types.push(type);
    tableData.rows.forEach(r => r.push('0'));
    renderSpreadsheet();
  });
  document.getElementById('tableDelRow').addEventListener('click', () => {
    if (tableSelectedRow >= 0 && tableSelectedRow < tableData.rows.length) {
      tableData.rows.splice(tableSelectedRow, 1);
      tableSelectedRow = -1;
      renderSpreadsheet();
    }
  });
  document.getElementById('tableDelCol').addEventListener('click', () => {
    if (tableData.headers.length === 0) return;
    const name = prompt('Column to delete:', tableData.headers[tableData.headers.length - 1]);
    const ci = tableData.headers.findIndex(h => h === name);
    if (ci === -1) return;
    tableData.headers.splice(ci, 1);
    tableData.types.splice(ci, 1);
    tableData.rows.forEach(r => r.splice(ci, 1));
    renderSpreadsheet();
  });
  document.getElementById('tableFilterBtn').addEventListener('click', () => {
    applyTableFilter(document.getElementById('tableFilter').value);
  });
  document.getElementById('tableFilter').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') applyTableFilter(e.target.value);
  });
  document.getElementById('tableClearFilter').addEventListener('click', () => {
    document.getElementById('tableFilter').value = '';
    tableFilteredRows = null;
    tableSortCol = -1;
    tableSortDir = 0;
    renderSpreadsheet();
  });
  document.getElementById('tableToggleRaw').addEventListener('click', () => {
    tableRawMode = !tableRawMode;
    document.getElementById('spreadsheetWrap').style.display = tableRawMode ? 'none' : '';
    document.getElementById('rawCsvArea').style.display = tableRawMode ? 'flex' : 'none';
    if (tableRawMode) {
      document.getElementById('tablesEditor').value = tableToCSV();
    } else {
      tableData = parseCSV(document.getElementById('tablesEditor').value);
      renderSpreadsheet();
    }
  });

  document.getElementById('saveTables').addEventListener('click', async () => {
    const content = tableRawMode ? document.getElementById('tablesEditor').value : tableToCSV();
    try {
      const resp = await fetch('/api/tables', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const r = await resp.json();
      if (r.success) setStatus('Tables saved', 'ok');
    } catch(e) { setStatus('Save failed: ' + e.message, 'error'); }
  });

  async function loadSrcFiles() {
    try {
      const resp = await fetch('/api/src-files');
      const files = await resp.json();
      const sidebar = document.getElementById('srcSidebar');
      sidebar.innerHTML = '<div class="sidebar-header">Source Files</div>';
      const cFiles = files.filter(f => f.endsWith('.c')).sort();
      const hFiles = files.filter(f => f.endsWith('.h')).sort();
      [...hFiles, ...cFiles].forEach(f => {
        const item = document.createElement('div');
        item.className = 'sidebar-item';
        item.textContent = f;
        item.addEventListener('click', () => {
          sidebar.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));
          item.classList.add('active');
          openSrcFile(f);
        });
        sidebar.appendChild(item);
      });
    } catch(e) { console.error(e); }
  }

  let currentSrcFile = null;
  async function openSrcFile(name) {
    try {
      const resp = await fetch('/api/src-file?name=' + encodeURIComponent(name));
      const data = await resp.json();
      document.getElementById('srcEditor').value = data.content;
      document.getElementById('srcFileName').textContent = 'src/' + name;
      document.getElementById('saveSrc').style.display = 'inline-block';
      currentSrcFile = name;
    } catch(e) { console.error(e); }
  }
  document.getElementById('saveSrc').addEventListener('click', async () => {
    if (!currentSrcFile) return;
    try {
      const resp = await fetch('/api/src-file', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: currentSrcFile, content: document.getElementById('srcEditor').value })
      });
      const r = await resp.json();
      if (r.success) setStatus('Saved ' + currentSrcFile, 'ok');
    } catch(e) { setStatus('Save failed: ' + e.message, 'error'); }
  });

  async function doBuild(target) {
    const output = document.getElementById('buildOutput');
    output.textContent = 'Building (' + target + ')...\n';
    setStatus('Building...', 'building');
    document.getElementById('quickBuild').disabled = true;
    try {
      const resp = await fetch('/api/build', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target })
      });
      const data = await resp.json();
      output.textContent += data.output + '\n';
      if (data.success) {
        output.textContent += '\n--- BUILD SUCCESSFUL ---\n';
        setStatus('Build complete', 'ok');
        checkRomStatus();
      } else {
        output.textContent += '\n--- BUILD FAILED ---\n' + (data.error || '');
        setStatus('Build failed', 'error');
      }
    } catch(e) {
      output.textContent += '\nError: ' + e.message;
      setStatus('Build error', 'error');
    }
    document.getElementById('quickBuild').disabled = false;
  }

  document.getElementById('buildAssets').addEventListener('click', () => doBuild('assets'));
  document.getElementById('buildRom').addEventListener('click', () => doBuild('rom'));
  document.getElementById('buildAll').addEventListener('click', () => doBuild('all'));
  document.getElementById('quickBuild').addEventListener('click', () => {
    document.querySelectorAll('.ttab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelector('.ttab[data-panel="build"]').classList.add('active');
    document.getElementById('panel-build').classList.add('active');
    doBuild('all');
  });

  window.triggerBuild = function(target) {
    doBuild(target || 'all');
  };

  window.getTableCSV = function() {
    if (tableRawMode) return document.getElementById('tablesEditor').value;
    return tableToCSV();
  };

  window.reloadTableFromCSV = function(csvText) {
    tableData = parseCSV(csvText);
    tableFilteredRows = null;
    tableSortCol = -1;
    tableSortDir = 0;
    renderSpreadsheet();
  };

  async function checkRomStatus() {
    try {
      const resp = await fetch('/api/rom-info');
      const info = await resp.json();
      const dlBtn = document.getElementById('downloadRom');
      if (info.exists) {
        dlBtn.style.display = 'inline-block';
        dlBtn.textContent = 'Download ROM (' + Math.round(info.size / 1024) + ' KB)';
      } else {
        dlBtn.style.display = 'none';
      }
    } catch(e) {}
  }
  document.getElementById('downloadRom').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = '/LabyrinthOfTheDragon.gbc'; a.download = 'LabyrinthOfTheDragon.gbc'; a.click();
  });

  checkRomStatus();
})();
