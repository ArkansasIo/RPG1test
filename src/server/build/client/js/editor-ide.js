(function() {
  "use strict";

  var TAB_SIZE = 4;
  var TAB_STR = '    ';

  var styleEl = document.createElement('style');
  styleEl.textContent = [
    '.ide-editor-wrap { display:flex; flex-direction:column; flex:1; overflow:hidden; background:var(--bg); }',
    '.ide-toolbar { display:flex; gap:4px; padding:4px 8px; background:var(--bg2); border-bottom:1px solid var(--border); align-items:center; flex-shrink:0; flex-wrap:wrap; }',
    '.ide-toolbar-btn { padding:3px 8px; background:var(--bg3); color:var(--text); border:1px solid var(--border); border-radius:3px; cursor:pointer; font-size:11px; white-space:nowrap; }',
    '.ide-toolbar-btn:hover { border-color:var(--accent); color:var(--accent); }',
    '.ide-toolbar-btn.active { background:var(--accent); color:#000; border-color:var(--accent); }',
    '.ide-toolbar-sep { width:1px; height:18px; background:var(--border); margin:0 4px; flex-shrink:0; }',
    '.ide-toolbar-info { font-size:11px; color:var(--text2); white-space:nowrap; margin-left:auto; }',
    '.ide-body { display:flex; flex:1; overflow:hidden; position:relative; }',
    '.ide-gutter { width:48px; background:var(--bg2); border-right:1px solid var(--border); overflow:hidden; flex-shrink:0; user-select:none; }',
    '.ide-gutter-inner { padding:16px 0; font-family:"Fira Code","Cascadia Code","Consolas",monospace; font-size:13px; line-height:1.6; color:var(--text2); text-align:right; }',
    '.ide-gutter-line { padding:0 8px 0 4px; }',
    '.ide-gutter-line.current { color:var(--accent); background:rgba(88,166,255,0.08); }',
    '.ide-gutter-fold { display:inline-block; width:12px; font-size:10px; color:var(--text2); cursor:pointer; text-align:center; }',
    '.ide-gutter-fold:hover { color:var(--accent); }',
    '.ide-textarea-wrap { flex:1; position:relative; overflow:hidden; }',
    '.ide-textarea-wrap textarea.code-editor { position:relative; z-index:2; background:transparent; color:var(--text); width:100%; height:100%; resize:none; white-space:pre; overflow:auto; }',
    '.ide-highlight-overlay { position:absolute; top:0; left:0; right:0; bottom:0; z-index:1; pointer-events:none; overflow:hidden; padding:16px; font-family:"Fira Code","Cascadia Code","Consolas",monospace; font-size:13px; line-height:1.6; white-space:pre; tab-size:4; color:transparent; }',
    '.ide-highlight-overlay .kw { color:#58a6ff; }',
    '.ide-highlight-overlay .str { color:#3fb950; }',
    '.ide-highlight-overlay .cmt { color:#8b949e; font-style:italic; }',
    '.ide-highlight-overlay .num { color:#bc8cff; }',
    '.ide-highlight-overlay .fn { color:#d29922; }',
    '.ide-highlight-overlay .op { color:#c9d1d9; }',
    '.ide-highlight-overlay .cur-line { background:rgba(88,166,255,0.06); display:block; }',
    '.ide-highlight-overlay .bracket-match { background:rgba(88,166,255,0.25); border-radius:2px; }',
    '.ide-minimap { width:60px; background:var(--bg2); border-left:1px solid var(--border); overflow:hidden; flex-shrink:0; cursor:pointer; position:relative; }',
    '.ide-minimap-canvas { width:100%; }',
    '.ide-minimap-viewport { position:absolute; left:0; right:0; background:rgba(88,166,255,0.15); border:1px solid rgba(88,166,255,0.3); pointer-events:none; }',
    '.ide-statusbar { display:flex; gap:16px; padding:2px 8px; background:var(--bg2); border-top:1px solid var(--border); font-size:10px; color:var(--text2); flex-shrink:0; align-items:center; }',
    '.ide-goto-overlay { position:absolute; top:40px; left:50%; transform:translateX(-50%); z-index:100; background:var(--bg2); border:1px solid var(--border); border-radius:6px; padding:12px 16px; box-shadow:0 4px 12px rgba(0,0,0,0.5); display:none; }',
    '.ide-goto-overlay.visible { display:flex; gap:8px; align-items:center; }',
    '.ide-goto-overlay label { font-size:12px; color:var(--text2); white-space:nowrap; }',
    '.ide-goto-overlay input { width:80px; padding:4px 8px; background:var(--bg); border:1px solid var(--border); color:var(--text); border-radius:3px; font-size:12px; outline:none; }',
    '.ide-goto-overlay input:focus { border-color:var(--accent); }',
    '.ide-goto-overlay button { padding:4px 10px; background:var(--accent); color:#000; border:none; border-radius:3px; cursor:pointer; font-size:11px; font-weight:600; }'
  ].join('\n');
  document.head.appendChild(styleEl);

  var JS_KEYWORDS = /\b(var|let|const|function|return|if|else|for|while|do|switch|case|break|continue|new|this|typeof|instanceof|in|of|try|catch|finally|throw|class|extends|import|export|default|from|async|await|yield|void|delete|null|undefined|true|false|NaN|Infinity)\b/g;

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function highlightJS(text) {
    var tokens = [];
    var i = 0;
    var len = text.length;
    while (i < len) {
      if (text[i] === '/' && text[i + 1] === '/') {
        var end = text.indexOf('\n', i);
        if (end === -1) end = len;
        tokens.push({ type: 'cmt', val: text.substring(i, end) });
        i = end;
      } else if (text[i] === '/' && text[i + 1] === '*') {
        var end2 = text.indexOf('*/', i + 2);
        if (end2 === -1) end2 = len - 2;
        tokens.push({ type: 'cmt', val: text.substring(i, end2 + 2) });
        i = end2 + 2;
      } else if (text[i] === '"' || text[i] === "'" || text[i] === '`') {
        var q = text[i];
        var j = i + 1;
        while (j < len && text[j] !== q) {
          if (text[j] === '\\') j++;
          j++;
        }
        tokens.push({ type: 'str', val: text.substring(i, j + 1) });
        i = j + 1;
      } else if (/[0-9]/.test(text[i]) && (i === 0 || !/[a-zA-Z_$]/.test(text[i - 1]))) {
        var j2 = i;
        if (text[j2] === '0' && (text[j2 + 1] === 'x' || text[j2 + 1] === 'X')) {
          j2 += 2;
          while (j2 < len && /[0-9a-fA-F]/.test(text[j2])) j2++;
        } else {
          while (j2 < len && /[0-9.eE]/.test(text[j2])) j2++;
        }
        tokens.push({ type: 'num', val: text.substring(i, j2) });
        i = j2;
      } else if (/[a-zA-Z_$]/.test(text[i])) {
        var j3 = i;
        while (j3 < len && /[a-zA-Z0-9_$]/.test(text[j3])) j3++;
        var word = text.substring(i, j3);
        var nextNonSpace = j3;
        while (nextNonSpace < len && text[nextNonSpace] === ' ') nextNonSpace++;
        if (JS_KEYWORDS.test(word)) {
          JS_KEYWORDS.lastIndex = 0;
          tokens.push({ type: 'kw', val: word });
        } else if (text[nextNonSpace] === '(') {
          tokens.push({ type: 'fn', val: word });
        } else {
          tokens.push({ type: 'text', val: word });
        }
        i = j3;
      } else {
        var j4 = i;
        while (j4 < len && !/[a-zA-Z0-9_$"'`\/]/.test(text[j4])) j4++;
        if (j4 === i) j4 = i + 1;
        tokens.push({ type: 'text', val: text.substring(i, j4) });
        i = j4;
      }
    }
    var html = '';
    for (var t = 0; t < tokens.length; t++) {
      var tk = tokens[t];
      var escaped = escapeHtml(tk.val);
      if (tk.type === 'text') {
        html += escaped;
      } else {
        html += '<span class="' + tk.type + '">' + escaped + '</span>';
      }
    }
    return html;
  }

  function findMatchingBracket(text, pos) {
    var open = '{[('.split('');
    var close = '}])'.split('');
    var ch = text[pos];
    var idx = open.indexOf(ch);
    if (idx !== -1) {
      var depth = 1;
      for (var i = pos + 1; i < text.length; i++) {
        if (text[i] === open[idx]) depth++;
        else if (text[i] === close[idx]) { depth--; if (depth === 0) return i; }
      }
      return -1;
    }
    idx = close.indexOf(ch);
    if (idx !== -1) {
      var depth2 = 1;
      for (var i2 = pos - 1; i2 >= 0; i2--) {
        if (text[i2] === close[idx]) depth2++;
        else if (text[i2] === open[idx]) { depth2--; if (depth2 === 0) return i2; }
      }
      return -1;
    }
    return -1;
  }

  function getLineCol(text, pos) {
    var lines = text.substring(0, pos).split('\n');
    return { line: lines.length, col: lines[lines.length - 1].length + 1 };
  }

  function wrapEditor(textarea) {
    if (textarea._ideWrapped) return;
    textarea._ideWrapped = true;

    var wordWrap = false;
    var fontSize = 13;
    var undoStack = [];
    var redoStack = [];
    var lastSavedContent = textarea.value;

    var parent = textarea.parentNode;

    var wrap = document.createElement('div');
    wrap.className = 'ide-editor-wrap';

    var toolbar = document.createElement('div');
    toolbar.className = 'ide-toolbar';

    function mkBtn(label, title) {
      var b = document.createElement('button');
      b.className = 'ide-toolbar-btn';
      b.textContent = label;
      if (title) b.title = title;
      return b;
    }
    function mkSep() {
      var s = document.createElement('span');
      s.className = 'ide-toolbar-sep';
      return s;
    }

    var btnSave = mkBtn('Save', 'Save file');
    var btnUndo = mkBtn('Undo', 'Undo');
    var btnRedo = mkBtn('Redo', 'Redo');
    var btnFormat = mkBtn('Format', 'Auto-format');
    var btnWrap = mkBtn('Word Wrap', 'Toggle word wrap');
    var btnFontUp = mkBtn('A+', 'Increase font size');
    var btnFontDown = mkBtn('A-', 'Decrease font size');
    var btnGoto = mkBtn('Go to Line', 'Ctrl+G');
    var cursorInfo = document.createElement('span');
    cursorInfo.className = 'ide-toolbar-info';
    cursorInfo.textContent = 'Ln 1, Col 1';

    toolbar.appendChild(btnSave);
    toolbar.appendChild(btnUndo);
    toolbar.appendChild(btnRedo);
    toolbar.appendChild(mkSep());
    toolbar.appendChild(btnFormat);
    toolbar.appendChild(btnWrap);
    toolbar.appendChild(btnFontUp);
    toolbar.appendChild(btnFontDown);
    toolbar.appendChild(mkSep());
    toolbar.appendChild(btnGoto);
    toolbar.appendChild(cursorInfo);

    var body = document.createElement('div');
    body.className = 'ide-body';

    var gutter = document.createElement('div');
    gutter.className = 'ide-gutter';
    var gutterInner = document.createElement('div');
    gutterInner.className = 'ide-gutter-inner';
    gutter.appendChild(gutterInner);

    var textareaWrap = document.createElement('div');
    textareaWrap.className = 'ide-textarea-wrap';

    var highlightOverlay = document.createElement('div');
    highlightOverlay.className = 'ide-highlight-overlay';

    var minimap = document.createElement('div');
    minimap.className = 'ide-minimap';
    var minimapCanvas = document.createElement('canvas');
    minimapCanvas.className = 'ide-minimap-canvas';
    var minimapViewport = document.createElement('div');
    minimapViewport.className = 'ide-minimap-viewport';
    minimap.appendChild(minimapCanvas);
    minimap.appendChild(minimapViewport);

    var statusbar = document.createElement('div');
    statusbar.className = 'ide-statusbar';

    var gotoOverlay = document.createElement('div');
    gotoOverlay.className = 'ide-goto-overlay';
    gotoOverlay.innerHTML = '<label>Go to Line:</label><input type="number" min="1" /><button>Go</button>';

    parent.insertBefore(wrap, textarea);
    wrap.appendChild(toolbar);
    wrap.appendChild(body);
    body.appendChild(gutter);
    body.appendChild(textareaWrap);
    textareaWrap.appendChild(highlightOverlay);
    textareaWrap.appendChild(textarea);
    body.appendChild(minimap);
    wrap.appendChild(statusbar);
    wrap.appendChild(gotoOverlay);

    function updateGutter() {
      var text = textarea.value;
      var lines = text.split('\n');
      var lc = getLineCol(text, textarea.selectionStart);
      var currentLine = lc.line;
      var html = '';
      for (var i = 0; i < lines.length; i++) {
        var cls = (i + 1 === currentLine) ? ' current' : '';
        var line = lines[i];
        var hasFold = /[\{\[\(]\s*$/.test(line);
        var foldHtml = hasFold ? '<span class="ide-gutter-fold">−</span>' : '<span class="ide-gutter-fold"> </span>';
        html += '<div class="ide-gutter-line' + cls + '">' + foldHtml + (i + 1) + '</div>';
      }
      gutterInner.innerHTML = html;
      gutterInner.style.paddingTop = '16px';
    }

    function updateHighlight() {
      var text = textarea.value;
      var highlighted = highlightJS(text);
      highlighted += '\n';
      highlightOverlay.innerHTML = highlighted;
    }

    function updateMinimap() {
      var text = textarea.value;
      var lines = text.split('\n');
      var lineH = 2;
      var w = 60;
      var h = Math.max(lines.length * lineH, 1);
      minimapCanvas.width = w;
      minimapCanvas.height = h;
      minimapCanvas.style.height = h + 'px';
      var ctx = minimapCanvas.getContext('2d');
      ctx.fillStyle = '#161b22';
      ctx.fillRect(0, 0, w, h);
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (line.trim().length === 0) continue;
        var len = Math.min(line.length, w);
        var brightness = 0.3 + Math.min(line.trim().length / 80, 0.5);
        ctx.fillStyle = 'rgba(201,209,217,' + brightness + ')';
        var indent = line.length - line.trimStart().length;
        var x = Math.min(indent, w - 1);
        ctx.fillRect(x, i * lineH, Math.min(len - indent, w - x), lineH);
      }
      updateMinimapViewport();
    }

    function updateMinimapViewport() {
      var totalH = minimapCanvas.height;
      var visibleRatio = textarea.clientHeight / (textarea.scrollHeight || 1);
      var scrollRatio = textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight || 1);
      var vpH = Math.max(totalH * visibleRatio, 10);
      var vpTop = (totalH - vpH) * (isNaN(scrollRatio) ? 0 : scrollRatio);
      minimapViewport.style.top = vpTop + 'px';
      minimapViewport.style.height = vpH + 'px';
    }

    function updateStatusBar() {
      var text = textarea.value;
      var lc = getLineCol(text, textarea.selectionStart);
      var lines = text.split('\n').length;
      var chars = text.length;
      var words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
      cursorInfo.textContent = 'Ln ' + lc.line + ', Col ' + lc.col;
      statusbar.innerHTML = '';
      var items = [
        'Ln ' + lc.line + ', Col ' + lc.col,
        lines + ' lines',
        words + ' words',
        chars + ' chars',
        'Tab Size: ' + TAB_SIZE,
        'UTF-8'
      ];
      for (var i = 0; i < items.length; i++) {
        var sp = document.createElement('span');
        sp.textContent = items[i];
        statusbar.appendChild(sp);
      }
    }

    function syncScroll() {
      highlightOverlay.scrollTop = textarea.scrollTop;
      highlightOverlay.scrollLeft = textarea.scrollLeft;
      gutter.scrollTop = textarea.scrollTop;
      updateMinimapViewport();
    }

    function pushUndo() {
      undoStack.push(textarea.value);
      if (undoStack.length > 200) undoStack.shift();
      redoStack = [];
    }

    function fullUpdate() {
      updateGutter();
      updateHighlight();
      updateMinimap();
      updateStatusBar();
    }

    textarea.addEventListener('input', function() {
      fullUpdate();
    });

    textarea.addEventListener('scroll', syncScroll);

    textarea.addEventListener('click', function() {
      updateGutter();
      updateStatusBar();
    });

    textarea.addEventListener('keyup', function(e) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home' || e.key === 'End') {
        updateGutter();
        updateStatusBar();
      }
    });

    textarea.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        var start = textarea.selectionStart;
        var end = textarea.selectionEnd;
        pushUndo();
        var val = textarea.value;
        textarea.value = val.substring(0, start) + TAB_STR + val.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + TAB_SIZE;
        fullUpdate();
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        var start2 = textarea.selectionStart;
        var val2 = textarea.value;
        var lineStart = val2.lastIndexOf('\n', start2 - 1) + 1;
        var currentLine = val2.substring(lineStart, start2);
        var indent = '';
        for (var ci = 0; ci < currentLine.length; ci++) {
          if (currentLine[ci] === ' ' || currentLine[ci] === '\t') indent += currentLine[ci];
          else break;
        }
        if (/[\{\[\(]\s*$/.test(currentLine.trimEnd())) {
          indent += TAB_STR;
        }
        pushUndo();
        var insert = '\n' + indent;
        textarea.value = val2.substring(0, start2) + insert + val2.substring(textarea.selectionEnd);
        textarea.selectionStart = textarea.selectionEnd = start2 + insert.length;
        fullUpdate();
      }

      if (e.key === 'g' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        showGoto();
      }

      if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
        if (undoStack.length > 0) {
          redoStack.push(textarea.value);
          textarea.value = undoStack.pop();
          fullUpdate();
        }
      }

      if ((e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey) || (e.key === 'y' && (e.ctrlKey || e.metaKey))) {
        e.preventDefault();
        if (redoStack.length > 0) {
          undoStack.push(textarea.value);
          textarea.value = redoStack.pop();
          fullUpdate();
        }
      }
    });

    btnSave.addEventListener('click', function() {
      var saveBtn = textarea.closest('.panel');
      if (saveBtn) {
        var realSave = saveBtn.querySelector('.save-btn');
        if (realSave) realSave.click();
      }
    });

    btnUndo.addEventListener('click', function() {
      if (undoStack.length > 0) {
        redoStack.push(textarea.value);
        textarea.value = undoStack.pop();
        fullUpdate();
      }
    });

    btnRedo.addEventListener('click', function() {
      if (redoStack.length > 0) {
        undoStack.push(textarea.value);
        textarea.value = redoStack.pop();
        fullUpdate();
      }
    });

    btnFormat.addEventListener('click', function() {
      pushUndo();
      var text = textarea.value;
      text = text.replace(/\t/g, TAB_STR);
      text = text.replace(/[ \t]+$/gm, '');
      textarea.value = text;
      fullUpdate();
    });

    btnWrap.addEventListener('click', function() {
      wordWrap = !wordWrap;
      textarea.style.whiteSpace = wordWrap ? 'pre-wrap' : 'pre';
      textarea.style.wordWrap = wordWrap ? 'break-word' : 'normal';
      highlightOverlay.style.whiteSpace = wordWrap ? 'pre-wrap' : 'pre';
      highlightOverlay.style.wordWrap = wordWrap ? 'break-word' : 'normal';
      btnWrap.classList.toggle('active', wordWrap);
      fullUpdate();
    });

    btnFontUp.addEventListener('click', function() {
      fontSize = Math.min(fontSize + 1, 24);
      textarea.style.fontSize = fontSize + 'px';
      highlightOverlay.style.fontSize = fontSize + 'px';
      gutterInner.style.fontSize = fontSize + 'px';
      fullUpdate();
    });

    btnFontDown.addEventListener('click', function() {
      fontSize = Math.max(fontSize - 1, 8);
      textarea.style.fontSize = fontSize + 'px';
      highlightOverlay.style.fontSize = fontSize + 'px';
      gutterInner.style.fontSize = fontSize + 'px';
      fullUpdate();
    });

    function showGoto() {
      gotoOverlay.classList.add('visible');
      var inp = gotoOverlay.querySelector('input');
      inp.value = '';
      inp.focus();
    }

    function hideGoto() {
      gotoOverlay.classList.remove('visible');
      textarea.focus();
    }

    function doGoto() {
      var inp = gotoOverlay.querySelector('input');
      var lineNum = parseInt(inp.value);
      if (isNaN(lineNum) || lineNum < 1) { hideGoto(); return; }
      var lines = textarea.value.split('\n');
      lineNum = Math.min(lineNum, lines.length);
      var pos = 0;
      for (var i = 0; i < lineNum - 1; i++) {
        pos += lines[i].length + 1;
      }
      textarea.selectionStart = textarea.selectionEnd = pos;
      textarea.focus();
      var lineH = textarea.scrollHeight / lines.length;
      textarea.scrollTop = Math.max(0, (lineNum - 5) * lineH);
      hideGoto();
      fullUpdate();
    }

    btnGoto.addEventListener('click', showGoto);
    gotoOverlay.querySelector('button').addEventListener('click', doGoto);
    gotoOverlay.querySelector('input').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') { e.preventDefault(); doGoto(); }
      if (e.key === 'Escape') { e.preventDefault(); hideGoto(); }
    });

    minimap.addEventListener('click', function(e) {
      var rect = minimap.getBoundingClientRect();
      var y = e.clientY - rect.top;
      var ratio = y / minimapCanvas.height;
      textarea.scrollTop = ratio * (textarea.scrollHeight - textarea.clientHeight);
      syncScroll();
    });

    textarea.style.whiteSpace = 'pre';
    textarea.style.overflowWrap = 'normal';

    setTimeout(fullUpdate, 0);

    textarea._ideCleanup = function() {
      var p = wrap.parentNode;
      if (p) {
        p.insertBefore(textarea, wrap);
        p.removeChild(wrap);
      }
      textarea._ideWrapped = false;
      textarea._ideCleanup = null;
    };
  }

  function unwrapEditor(textarea) {
    if (textarea._ideCleanup) textarea._ideCleanup();
  }

  function initAll() {
    var editors = document.querySelectorAll('textarea.code-editor');
    for (var i = 0; i < editors.length; i++) {
      wrapEditor(editors[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    setTimeout(initAll, 0);
  }

  window.IDEEditor = {
    wrapEditor: wrapEditor,
    unwrapEditor: unwrapEditor
  };

})();
