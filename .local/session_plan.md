# Objective
Expand the Enchantment Engine RPG Workbench with:
1. All video game genres support (RPG, platformer, shooter, racing, puzzle, etc.)
2. Expanded platform support (PC: Windows/Mac/Linux, Mobile: iOS/Android, Consoles: Switch 1/2, PS1-PS5, Xbox series)
3. RPG Maker-style layout, graphics, tools, menus, submenus, and game engine logic
4. Full text editor IDE for the strings editor (with syntax highlighting, line numbers, minimap, find/replace, etc.)
5. Integration of UE5-style dockable widget panels (left/right/bottom) into HTML/CSS layout

# Tasks

### T001: Expand platformconfig.js with all platforms and genre system
- **Blocked By**: []
- **Details**:
  - Add platforms to `src/client/js/platformconfig.js` after the existing n64 entry (line 156, before the closing `};` of the platforms object): windows, macos, linux, ios, android, switch, switch2, ps1, ps2, ps3, ps4, ps5, xbox, xbox360, xboxone, xboxsx
  - Each new platform needs: id, name, bits, cpu, clockSpeed, resolution, colors, maxColors, vram, wram, soundChannels, maxRom, features[], fileExtension, buildTools{}, graphicsModes[], romSizes[], cartTypes[], sramSizes[], memoryMap{}, registers[], audioSpec{}
  - After the `window.PlatformConfig = {...}` block (after line 225), add `window.GenreConfig` with genre profiles: rpg, platformer, action, adventure, shooter, racing, puzzle, fighting, strategy, simulation, horror, sports, rhythm, visual_novel, roguelike, mmorpg, sandbox, metroidvania, rpg_maker
  - Each genre has: id, name, description, defaultFeatures[], requiredSystems[], defaultUI{}, templateEntities[]
  - Add `GenreConfig.get()`, `.set(id)`, `.getAll()`, fires `genreChanged` CustomEvent
  - Also update `getEngineFeatures` function to handle bits > 64 (for modern platforms, treat as 64)
  - Files: `src/client/js/platformconfig.js`
  - Acceptance: `PlatformConfig.platforms` has all 21 platforms, `GenreConfig.get()` returns current genre

### T002: Create widget panels CSS
- **Blocked By**: []
- **Details**:
  - Create `src/client/css/widgets.css` with full styling for the UE5-style dockable panels
  - Use existing CSS variables from main.css: --bg, --bg2, --bg3, --border, --text, --text2, --accent, --accent2, --red, --green, --yellow, --purple
  - Styles for layout structure: `.editor-layout` (flex column, flex:1), `.editor-middle` (flex row, flex:1), `.editor-center` (flex column, flex:1), `.editor-viewport` (flex:1, overflow:hidden, contain main-content)
  - Widget panel base: `.widget-panel` (background bg2, border, overflow hidden, flex-shrink:0, display:flex, flex-direction:column)
  - Position variants: `.widget-left` (border-right), `.widget-right` (border-left), `.widget-bottom` (border-top, flex-direction:column)
  - Collapsed state: `.widget-panel.collapsed` - left/right: width 24px !important, bottom: height 28px !important, overflow hidden
  - Widget tabs: `.widget-tabs` (display flex, background bg3, border-bottom, height 28px, flex-shrink 0), `.widget-tab` (padding 4px 10px, font-size 11px, cursor pointer, color text2, border-bottom 2px transparent), `.widget-tab.active` (color accent, border-bottom-color accent, background bg2)
  - Widget content: `.widget-content` (flex:1, overflow-y:auto), `.widget-content-inner` (padding 8px), `.widget-content-horiz` (display flex, flex:1)
  - Outliner tree: `.otree-node` (margin-left 8px), `.otree-hdr` (padding 3px 4px, cursor pointer, font-size 12px, color text, hover bg3, display flex, align-items center, gap 4px), `.otree-arrow` (color text2, font-size 10px, width 12px), `.otree-leaf` (padding 3px 4px 3px 24px, font-size 12px, color text, cursor pointer, hover bg3), `.otree-leaf.selected` (background accent/10%, color accent, border-left 2px accent), `.otree-children` (border-left 1px solid border)
  - Modes: `.widget-mode-btn` (display flex, align-items center, gap 8px, padding 6px 10px, cursor pointer, font-size 12px, color text, hover bg3, border-bottom 1px solid border), `.widget-mode-btn.active` (background accent/15%, color accent, border-left 3px solid accent), `.widget-mode-icon` (font-size 16px, width 20px)
  - Properties: `.widget-prop` (padding 4px 8px, display flex, align-items center, gap 6px, font-size 12px), `.widget-prop label` (color text2, width 90px, flex-shrink 0, font-size 11px), `.widget-prop input/select` (flex:1, bg bg, border 1px border, color text, padding 3px 6px, border-radius 3px, font-size 11px), `.widget-prop-row` (same as widget-prop), `.widget-vec` (display flex, gap 4px, align-items center, flex 1, inputs width 50px)
  - Detail sections: `.widget-detail-section` (border-bottom 1px border), `.widget-detail-hdr` (padding 6px 8px, cursor pointer, font-size 12px, color text2, hover bg3, font-weight 600), `.widget-detail-body` (display none, padding 4px 0), `.widget-detail-section.open .widget-detail-body` (display block)
  - Content Browser: `.cb-sidebar` (width 140px, border-right 1px border, overflow-y auto, background bg, flex-shrink 0, padding 4px 0), `.cb-content` (flex:1, display flex, flex-direction column), `.cb-toolbar` (display flex, gap 6px, padding 4px 8px, align-items center, background bg2, border-bottom 1px border, flex-shrink 0), `.cb-search` (flex:1, bg bg, border 1px border, color text, padding 3px 8px, border-radius 3px, font-size 11px), `.cb-filter` (bg bg2, border 1px border, color text, padding 3px, font-size 11px, border-radius 3px), `.cb-count` (font-size 10px, color text2, white-space nowrap)
  - `.cb-grid` (display grid, grid-template-columns repeat(auto-fill minmax(80px 1fr)), gap 6px, padding 8px, overflow-y auto, flex 1), `.cb-asset` (display flex, flex-direction column, align-items center, padding 8px 4px, background bg, border 1px border, border-radius 4px, cursor pointer, transition all .15s, hover border-color accent), `.cb-asset-icon` (font-size 28px, margin-bottom 4px), `.cb-asset-name` (font-size 10px, color text2, text-align center, word-break break-all, max-width 100%)
  - `.cb-folder` (padding 3px 8px 3px 16px, font-size 11px, color text2, cursor pointer, hover bg3), `.cb-folder.selected` (color accent, background bg3), `.cb-children` (margin-left 8px)
  - Output log: `.output-log-area` (flex:1, overflow-y auto, padding 6px 8px, font-family monospace, font-size 11px, background bg, line-height 1.6), `.log-info` (color text2), `.log-warn` (color yellow), `.log-error` (color red), `.log-cmd` (color accent2)
  - Console: `.console-input-row` (display flex, align-items center, padding 4px 8px, background bg2, border-top 1px border, gap 4px), `.console-input` (flex:1, bg bg, border 1px border, color accent2, padding 4px 8px, font-family monospace, font-size 12px, border-radius 3px, outline none), `.console-prompt` (color accent, font-family monospace, font-weight bold)
  - Animation timeline: `.anim-timeline` (padding 4px 8px), `.anim-track` (display flex, align-items center, gap 4px, margin-bottom 2px), `.anim-track-label` (width 60px, font-size 10px, color text2, flex-shrink 0), `.anim-keyframe` (width 20px, height 18px, background bg3, border 1px border, border-radius 2px, cursor pointer), `.anim-keyframe.has-key` (background accent, border-color accent), `.anim-keyframe.current` (outline 2px solid accent2, outline-offset -1px), `.anim-keyframe.event` (background purple)
  - Event graph: `.event-graph-area` (position relative, min-height 200px, background bg, border 1px border, border-radius 4px, overflow auto, padding 8px), `.eg-node` (position relative, display inline-block, background bg2, border 1px border, border-radius 4px, margin 4px, min-width 150px, vertical-align top), `.eg-node-hdr` (padding 4px 8px, font-size 11px, font-weight 600, border-bottom 1px border, border-radius 4px 4px 0 0), `.eg-event` (background: purple/20%, color purple), `.eg-condition` (background yellow/20%, color yellow), `.eg-action` (background accent/20%, color accent), `.eg-node-body` (padding 4px 8px, font-size 11px), `.eg-pin-out/.eg-pin-in` (padding 2px 0, color text2), `.eg-prop` (color text2, font-size 10px, padding 2px 0), `.eg-conn` (display inline-block, color text2, font-size 16px, vertical-align middle, margin 0 4px)
  - Section header: `.widget-section-hdr` (padding 6px 8px, font-size 10px, font-weight 700, color text2, text-transform uppercase, letter-spacing .5px, background bg3, border-bottom 1px border)
  - Action button: `.widget-action-btn` (padding 4px 10px, background bg3, color text, border 1px border, border-radius 3px, cursor pointer, font-size 11px, hover border-color accent and color accent)
  - Mini list: `.widget-mini-list` (padding 0 8px), `.widget-mini-item` (padding 3px 4px, font-size 11px, color text, border-bottom 1px solid border, cursor pointer, hover bg3)
  - Search: `.widget-search` (padding 4px 8px), `.widget-search input` (width 100%, bg bg, border 1px border, color text, padding 4px 8px, border-radius 3px, font-size 11px)
  - Collapse buttons: `.widget-collapse-btn` (position absolute, top 2px, padding 2px 6px, font-size 10px, color text2, cursor pointer, background bg3, border 1px border, border-radius 3px, z-index 5, hover color accent), `.widget-left .widget-collapse-btn` (right 2px), `.widget-right .widget-collapse-btn` (left 2px), `.widget-collapse-bottom` (position absolute, right 8px, top 2px)
  - Resize: `.widget-resize-handle` (position absolute, z-index 10), `.widget-resize-v` (top 0, left 0, right 0, height 4px, cursor ns-resize, hover background accent/30%)
  - Widget panel must have `position: relative` for collapse btn positioning
  - Files: `src/client/css/widgets.css` (new)
  - Acceptance: All widget classes styled, dark theme consistent

### T003: Build the full text editor IDE for strings panel
- **Blocked By**: []
- **Details**:
  - Create `src/client/js/editor-ide.js` that enhances textarea editors
  - The IDE wraps any textarea with class `code-editor` and adds:
    - Line numbers gutter (div on left side, updates on scroll/input, syncs scroll)
    - Syntax highlighting overlay (transparent div over textarea with colored spans for JS: keywords blue, strings green, comments gray, numbers purple, functions yellow) using a pre/code overlay approach
    - Minimap panel (narrow div on right, scaled-down rendering of full content using tiny font)
    - Enhanced toolbar above editor: Save, Undo, Redo, | Format, Word Wrap toggle, Font Size +/-, | Go to Line (Ctrl+G), | Cursor position display "Ln X, Col Y" 
    - Tab key inserts 4 spaces (or 2 configurable)
    - Auto-indent on Enter (maintains previous line indentation)
    - Current line highlight (subtle bg color on current line)
    - Word count, line count, character count in bottom status strip
    - Bracket matching (highlights matching { } [ ] ( ))
    - Ctrl+G opens Go to Line dialog
    - Code folding indicators (small - buttons next to foldable blocks)
  - The IDE creates a wrapper structure:
    ```
    .ide-editor-wrap
      .ide-toolbar (buttons)
      .ide-body
        .ide-gutter (line numbers)
        .ide-textarea-wrap
          textarea.code-editor (original)
          .ide-highlight-overlay (syntax coloring)
        .ide-minimap
      .ide-statusbar (Ln/Col, word count)
    ```
  - Auto-initialize: on DOMContentLoaded, find all `.code-editor` textareas and wrap them
  - Expose `window.IDEEditor` with methods: `wrapEditor(textarea)`, `unwrapEditor(textarea)`
  - Add CSS styles directly inside the JS file using a style element injection (to keep it self-contained)
  - Files: `src/client/js/editor-ide.js` (new)
  - Acceptance: All code-editor textareas get line numbers, syntax highlighting overlay, toolbar, minimap, status bar

### T004: Update index.html with new script tags, CSS links, and layout integration
- **Blocked By**: [T001, T002, T003]
- **Details**:
  - Add `<link rel="stylesheet" href="/css/widgets.css">` after the menus.css link (line 8)
  - Add `<script src="/js/editor-ide.js"></script>` BEFORE app.js (before line 234)
  - Ensure `<script src="/js/widgets.js"></script>` is BEFORE app.js
  - Script order should be: glue.js -> emulators -> platformconfig.js -> menus.js -> tools.js -> dnd5e.js -> dnd5e-pixelart.js -> sorctools.js -> editor-ide.js -> widgets.js -> app.js
  - Update version string in status bar from "v2.1.0" to "v3.0.0"
  - Files: `src/client/index.html`
  - Acceptance: All new CSS/JS files are loaded in correct order, version shows v3.0.0

### T005: Add genre-aware menus and RPG Maker-style tools to menus.js
- **Blocked By**: [T001]
- **Details**:
  - In `src/client/js/menus.js`, add a new "Genre" top-level menu entry in the menuData array (insert after "Game Engine" menu, before "D&D 5e"):
    ```
    { label: 'Genre', items: [
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
    ]}
    ```
  - Update Build > Target Platform submenu to include ALL platforms organized by category:
    ```
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
    ]}
    ```
  - In handleMenuAction, add handler for `genre:` prefix:
    ```
    if (action.startsWith('genre:')) {
      var genreId = action.split(':')[1];
      if (window.GenreConfig) {
        window.GenreConfig.set(genreId);
        setStatusFromMenu('Genre: ' + window.GenreConfig.get().name, 'ok');
      }
      return;
    }
    ```
  - In handleMenuAction, add handler for `rpgmaker:` prefix:
    ```
    if (action.startsWith('rpgmaker:')) {
      if (typeof window.openRPGMakerTool === 'function') window.openRPGMakerTool(action);
      else openModal('RPG Maker - ' + action.split(':').pop(), buildRPGMakerToolHTML(action));
      return;
    }
    ```
  - Add `buildRPGMakerToolHTML(action)` function that creates modal content for each RPG Maker tool
  - Add all new target:* platform cases to the target switching logic (in the existing target: switch/case block)
  - Files: `src/client/js/menus.js`
  - Acceptance: Genre menu visible with all entries, Build > Target shows all platforms by category, RPG Maker submenu opens tool modals
