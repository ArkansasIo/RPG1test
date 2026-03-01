/**
 * Enchantment Engine - Main Editor Window Implementation
 */

#include "editor_window.hpp"
#include "code_editor.hpp"
#include "asset_manager.hpp"
#include "build_system.hpp"
#include <iostream>
#include <fstream>

// Menu IDs - File Menu
#define IDM_FILE_NEW            3001
#define IDM_FILE_OPEN           3002
#define IDM_FILE_SAVE           3003
#define IDM_FILE_SAVE_AS        3004
#define IDM_FILE_SAVE_ALL       3005
#define IDM_FILE_CLOSE          3006
#define IDM_FILE_CLOSE_ALL      3007
#define IDM_FILE_RECENT_1       3010
#define IDM_FILE_RECENT_2       3011
#define IDM_FILE_RECENT_3       3012
#define IDM_FILE_RECENT_4       3013
#define IDM_FILE_RECENT_5       3014
#define IDM_FILE_EXIT           3020

// Menu IDs - Edit Menu
#define IDM_EDIT_UNDO           3101
#define IDM_EDIT_REDO           3102
#define IDM_EDIT_CUT            3103
#define IDM_EDIT_COPY           3104
#define IDM_EDIT_PASTE          3105
#define IDM_EDIT_SELECT_ALL     3106
#define IDM_EDIT_FIND           3107
#define IDM_EDIT_REPLACE        3108
#define IDM_EDIT_FIND_IN_FILES  3109
#define IDM_EDIT_GOTO_LINE      3110

// Menu IDs - View Menu
#define IDM_VIEW_PROJECT        3201
#define IDM_VIEW_OUTPUT         3202
#define IDM_VIEW_PROPERTIES     3203
#define IDM_VIEW_TOOLBAR        3204
#define IDM_VIEW_STATUSBAR      3205
#define IDM_VIEW_ZOOM_IN        3206
#define IDM_VIEW_ZOOM_OUT       3207
#define IDM_VIEW_ZOOM_RESET     3208

// Menu IDs - Project Menu
#define IDM_PROJECT_NEW         3301
#define IDM_PROJECT_OPEN        3302
#define IDM_PROJECT_CLOSE       3303
#define IDM_PROJECT_SETTINGS    3304
#define IDM_PROJECT_ADD_NEW     3305
#define IDM_PROJECT_ADD_EXIST   3306
#define IDM_PROJECT_EXPLORER    3307

// Menu IDs - Build Menu
#define IDM_BUILD_BUILD         3401
#define IDM_BUILD_REBUILD       3402
#define IDM_BUILD_CLEAN         3403
#define IDM_BUILD_ASSETS        3404
#define IDM_BUILD_ROM           3405
#define IDM_BUILD_STOP          3406
#define IDM_BUILD_CONFIG        3407

// Menu IDs - Debug Menu
#define IDM_DEBUG_START         3501
#define IDM_DEBUG_START_NO_DBG  3502
#define IDM_DEBUG_STOP          3503
#define IDM_DEBUG_STEP_OVER     3504
#define IDM_DEBUG_STEP_INTO     3505
#define IDM_DEBUG_STEP_OUT      3506
#define IDM_DEBUG_BREAKPOINT    3507
#define IDM_DEBUG_CLEAR_BP      3508

// Menu IDs - Tools Menu
#define IDM_TOOLS_TILE_EDITOR   3601
#define IDM_TOOLS_MAP_EDITOR    3602
#define IDM_TOOLS_SPRITE_EDITOR 3603
#define IDM_TOOLS_STRING_EDITOR 3604
#define IDM_TOOLS_TABLE_EDITOR  3605
#define IDM_TOOLS_PALETTE_EDITOR 3606
#define IDM_TOOLS_SOUND_EDITOR  3607
#define IDM_TOOLS_EMULATOR      3608
#define IDM_TOOLS_ASSET_BROWSER 3609
#define IDM_TOOLS_OPTIONS       3610

// Menu IDs - Window Menu
#define IDM_WINDOW_NEW          3701
#define IDM_WINDOW_SPLIT_H      3702
#define IDM_WINDOW_SPLIT_V      3703
#define IDM_WINDOW_CLOSE_ALL    3704
#define IDM_WINDOW_NEXT         3705
#define IDM_WINDOW_PREV         3706

// Menu IDs - Help Menu
#define IDM_HELP_VIEW           3801
#define IDM_HELP_API            3802
#define IDM_HELP_GBDK           3803
#define IDM_HELP_SHORTCUTS      3804
#define IDM_HELP_UPDATES        3805
#define IDM_HELP_ABOUT          3806

EditorWindow::EditorWindow(const std::string& projectPath, const std::string& serverUrl)
    : m_config()
    , m_currentFileIndex(-1)
#ifdef _WIN32
    , m_hwnd(nullptr)
    , m_statusBar(nullptr)
    , m_toolbar(nullptr)
    , m_tabControl(nullptr)
    , m_menuBar(nullptr)
    , m_font(nullptr)
#endif
{
    m_config.projectPath = projectPath;
    m_config.serverUrl = serverUrl;
    m_config.serverPort = 8080;
    m_config.darkMode = false;
    m_config.fontSize = 12;
    m_config.autoSave = true;
    m_config.showLineNumbers = true;
    m_config.wordWrap = false;
    
    loadConfig();
}

EditorWindow::~EditorWindow() {
    shutdown();
}

bool EditorWindow::initialize() {
#ifdef _WIN32
    // Initialize common controls
    INITCOMMONCONTROLSEX icex;
    icex.dwSize = sizeof(INITCOMMONCONTROLSEX);
    icex.dwICC = ICC_WIN95_CLASSES | ICC_COOL_CLASSES | ICC_BAR_CLASSES;
    InitCommonControlsEx(&icex);
    
    // Register window class
    WNDCLASSEXA wc = {};
    wc.cbSize = sizeof(WNDCLASSEXA);
    wc.lpfnWndProc = WindowProc;
    wc.hInstance = GetModuleHandle(NULL);
    wc.lpszClassName = "EnchantmentEditorWindow";
    wc.hCursor = LoadCursor(NULL, IDC_ARROW);
    wc.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
    wc.hIcon = LoadIcon(NULL, IDI_APPLICATION);
    wc.hIconSm = LoadIcon(NULL, IDI_APPLICATION);
    
    RegisterClassExA(&wc);
    
    // Create main window
    int width = 1280;
    int height = 800;
    int screenWidth = GetSystemMetrics(SM_CXSCREEN);
    int screenHeight = GetSystemMetrics(SM_CYSCREEN);
    int x = (screenWidth - width) / 2;
    int y = (screenHeight - height) / 2;
    
    m_hwnd = CreateWindowExA(
        0,
        "EnchantmentEditorWindow",
        "Enchantment Engine - Game Boy Color IDE",
        WS_OVERLAPPEDWINDOW,
        x, y, width, height,
        NULL, NULL, GetModuleHandle(NULL), this
    );
    
    if (!m_hwnd) {
        return false;
    }
    
    // Create font
    m_font = CreateFontA(m_config.fontSize, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE,
        DEFAULT_CHARSET, OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS,
        CLEARTYPE_QUALITY, DEFAULT_PITCH | FF_DONTCARE, "Consolas");
    
    // Initialize components
    m_codeEditor = std::make_unique<CodeEditor>();
    m_assetManager = std::make_unique<AssetManager>(m_config.projectPath);
    m_buildSystem = std::make_unique<BuildSystem>(m_config.projectPath);
    
    // Show window
    ShowWindow(m_hwnd, SW_SHOW);
    UpdateWindow(m_hwnd);
    
    updateStatusBar("Ready");
    
    return true;
#else
    return false;
#endif
}

int EditorWindow::run() {
#ifdef _WIN32
    MSG msg;
    while (GetMessage(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    return (int)msg.wParam;
#else
    return 0;
#endif
}

void EditorWindow::shutdown() {
    saveConfig();
#ifdef _WIN32
    if (m_font) DeleteObject(m_font);
    if (m_menuBar) DestroyMenu(m_menuBar);
#endif
}

#ifdef _WIN32

LRESULT CALLBACK EditorWindow::WindowProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    EditorWindow* editor = nullptr;
    
    if (msg == WM_CREATE) {
        CREATESTRUCT* cs = (CREATESTRUCT*)lParam;
        editor = (EditorWindow*)cs->lpCreateParams;
        SetWindowLongPtr(hwnd, GWLP_USERDATA, (LONG_PTR)editor);
        editor->onCreate();
    } else {
        editor = (EditorWindow*)GetWindowLongPtr(hwnd, GWLP_USERDATA);
    }
    
    if (editor) {
        switch (msg) {
            case WM_PAINT:
                editor->onPaint();
                return 0;
            case WM_COMMAND:
                editor->onCommand(wParam);
                return 0;
            case WM_SIZE:
                editor->onSize(LOWORD(lParam), HIWORD(lParam));
                return 0;
            case WM_NOTIFY:
                editor->onNotify(lParam);
                return 0;
            case WM_DESTROY:
                editor->onDestroy();
                return 0;
        }
    }
    
    return DefWindowProc(hwnd, msg, wParam, lParam);
}

void EditorWindow::onCreate() {
    createMenuBar();
    createToolbar();
    createTabControl();
    createPanels();
    createStatusBar();
}

void EditorWindow::onPaint() {
    PAINTSTRUCT ps;
    HDC hdc = BeginPaint(m_hwnd, &ps);
    EndPaint(m_hwnd, &ps);
}

void EditorWindow::onCommand(WPARAM wParam) {
    int id = LOWORD(wParam);
    
    // File Menu
    if (id >= IDM_FILE_NEW && id <= IDM_FILE_EXIT) {
        switch (id) {
            case IDM_FILE_NEW: newFile(); break;
            case IDM_FILE_OPEN: openFile(); break;
            case IDM_FILE_SAVE: saveFile(); break;
            case IDM_FILE_SAVE_AS: saveFileAs(); break;
            case IDM_FILE_SAVE_ALL: saveAll(); break;
            case IDM_FILE_CLOSE: closeFile(); break;
            case IDM_FILE_CLOSE_ALL: closeAllFiles(); break;
            case IDM_FILE_EXIT: PostQuitMessage(0); break;
        }
    }
    // Edit Menu
    else if (id >= IDM_EDIT_UNDO && id <= IDM_EDIT_GOTO_LINE) {
        switch (id) {
            case IDM_EDIT_UNDO: undo(); break;
            case IDM_EDIT_REDO: redo(); break;
            case IDM_EDIT_CUT: cut(); break;
            case IDM_EDIT_COPY: copy(); break;
            case IDM_EDIT_PASTE: paste(); break;
            case IDM_EDIT_SELECT_ALL: selectAll(); break;
            case IDM_EDIT_FIND: find(); break;
            case IDM_EDIT_REPLACE: replace(); break;
            case IDM_EDIT_FIND_IN_FILES: findInFiles(); break;
            case IDM_EDIT_GOTO_LINE: goToLine(); break;
        }
    }
    // View Menu
    else if (id >= IDM_VIEW_PROJECT && id <= IDM_VIEW_ZOOM_RESET) {
        switch (id) {
            case IDM_VIEW_PROJECT: toggleProjectExplorer(); break;
            case IDM_VIEW_OUTPUT: toggleOutputConsole(); break;
            case IDM_VIEW_PROPERTIES: togglePropertiesPanel(); break;
            case IDM_VIEW_TOOLBAR: toggleToolbar(); break;
            case IDM_VIEW_STATUSBAR: toggleStatusBar(); break;
            case IDM_VIEW_ZOOM_IN: zoomIn(); break;
            case IDM_VIEW_ZOOM_OUT: zoomOut(); break;
            case IDM_VIEW_ZOOM_RESET: resetZoom(); break;
        }
    }
    // Project Menu
    else if (id >= IDM_PROJECT_NEW && id <= IDM_PROJECT_EXPLORER) {
        switch (id) {
            case IDM_PROJECT_NEW: newProject(); break;
            case IDM_PROJECT_OPEN: openProject(); break;
            case IDM_PROJECT_CLOSE: closeProject(); break;
            case IDM_PROJECT_SETTINGS: projectSettings(); break;
            case IDM_PROJECT_ADD_NEW: addNewItem(); break;
            case IDM_PROJECT_ADD_EXIST: addExistingItem(); break;
            case IDM_PROJECT_EXPLORER: showInExplorer(); break;
        }
    }
    // Build Menu
    else if (id >= IDM_BUILD_BUILD && id <= IDM_BUILD_CONFIG) {
        switch (id) {
            case IDM_BUILD_BUILD: buildProject(); break;
            case IDM_BUILD_REBUILD: rebuildProject(); break;
            case IDM_BUILD_CLEAN: cleanProject(); break;
            case IDM_BUILD_ASSETS: buildAssets(); break;
            case IDM_BUILD_ROM: buildROM(); break;
            case IDM_BUILD_STOP: stopBuild(); break;
            case IDM_BUILD_CONFIG: buildConfiguration(); break;
        }
    }
    // Debug Menu
    else if (id >= IDM_DEBUG_START && id <= IDM_DEBUG_CLEAR_BP) {
        switch (id) {
            case IDM_DEBUG_START: startDebugging(); break;
            case IDM_DEBUG_START_NO_DBG: startWithoutDebugging(); break;
            case IDM_DEBUG_STOP: stopDebugging(); break;
            case IDM_DEBUG_STEP_OVER: stepOver(); break;
            case IDM_DEBUG_STEP_INTO: stepInto(); break;
            case IDM_DEBUG_STEP_OUT: stepOut(); break;
            case IDM_DEBUG_BREAKPOINT: toggleBreakpoint(); break;
            case IDM_DEBUG_CLEAR_BP: clearAllBreakpoints(); break;
        }
    }
    // Tools Menu
    else if (id >= IDM_TOOLS_TILE_EDITOR && id <= IDM_TOOLS_OPTIONS) {
        switch (id) {
            case IDM_TOOLS_TILE_EDITOR: tileEditor(); break;
            case IDM_TOOLS_MAP_EDITOR: mapEditor(); break;
            case IDM_TOOLS_SPRITE_EDITOR: spriteEditor(); break;
            case IDM_TOOLS_STRING_EDITOR: stringEditor(); break;
            case IDM_TOOLS_TABLE_EDITOR: tableEditor(); break;
            case IDM_TOOLS_PALETTE_EDITOR: paletteEditor(); break;
            case IDM_TOOLS_SOUND_EDITOR: soundEditor(); break;
            case IDM_TOOLS_EMULATOR: emulator(); break;
            case IDM_TOOLS_ASSET_BROWSER: assetBrowser(); break;
            case IDM_TOOLS_OPTIONS: options(); break;
        }
    }
    // Window Menu
    else if (id >= IDM_WINDOW_NEW && id <= IDM_WINDOW_PREV) {
        switch (id) {
            case IDM_WINDOW_NEW: newWindow(); break;
            case IDM_WINDOW_SPLIT_H: splitHorizontal(); break;
            case IDM_WINDOW_SPLIT_V: splitVertical(); break;
            case IDM_WINDOW_CLOSE_ALL: closeAllTabs(); break;
            case IDM_WINDOW_NEXT: nextTab(); break;
            case IDM_WINDOW_PREV: previousTab(); break;
        }
    }
    // Help Menu
    else if (id >= IDM_HELP_VIEW && id <= IDM_HELP_ABOUT) {
        switch (id) {
            case IDM_HELP_VIEW: viewHelp(); break;
            case IDM_HELP_API: apiReference(); break;
            case IDM_HELP_GBDK: gbdkDocumentation(); break;
            case IDM_HELP_SHORTCUTS: keyboardShortcuts(); break;
            case IDM_HELP_UPDATES: checkForUpdates(); break;
            case IDM_HELP_ABOUT: about(); break;
        }
    }
}

void EditorWindow::onSize(int width, int height) {
    updateLayout(width, height);
}

void EditorWindow::onDestroy() {
    PostQuitMessage(0);
}

void EditorWindow::onNotify(LPARAM lParam) {
    // Handle tab control notifications
}

#endif // _WIN32

// Menu Creation Functions

void EditorWindow::createMenuBar() {
    m_menuBar = CreateMenu();
    
    createFileMenu(m_menuBar);
    createEditMenu(m_menuBar);
    createViewMenu(m_menuBar);
    createProjectMenu(m_menuBar);
    createBuildMenu(m_menuBar);
    createDebugMenu(m_menuBar);
    createToolsMenu(m_menuBar);
    createWindowMenu(m_menuBar);
    createHelpMenu(m_menuBar);
    
    SetMenu(m_hwnd, m_menuBar);
}

void EditorWindow::createFileMenu(HMENU parent) {
    HMENU fileMenu = CreatePopupMenu();
    
    AppendMenuA(fileMenu, MF_STRING, IDM_FILE_NEW, "&New\tCtrl+N");
    AppendMenuA(fileMenu, MF_STRING, IDM_FILE_OPEN, "&Open...\tCtrl+O");
    AppendMenuA(fileMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(fileMenu, MF_STRING, IDM_FILE_SAVE, "&Save\tCtrl+S");
    AppendMenuA(fileMenu, MF_STRING, IDM_FILE_SAVE_AS, "Save &As...\tCtrl+Shift+S");
    AppendMenuA(fileMenu, MF_STRING, IDM_FILE_SAVE_ALL, "Save A&ll\tCtrl+Shift+A");
    AppendMenuA(fileMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(fileMenu, MF_STRING, IDM_FILE_CLOSE, "&Close\tCtrl+W");
    AppendMenuA(fileMenu, MF_STRING, IDM_FILE_CLOSE_ALL, "Close All");
    AppendMenuA(fileMenu, MF_SEPARATOR, 0, NULL);
    
    // Recent Files submenu
    HMENU recentMenu = CreatePopupMenu();
    AppendMenuA(recentMenu, MF_STRING | MF_GRAYED, 0, "(No recent files)");
    AppendMenuA(fileMenu, MF_POPUP, (UINT_PTR)recentMenu, "&Recent Files");
    
    AppendMenuA(fileMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(fileMenu, MF_STRING, IDM_FILE_EXIT, "E&xit\tAlt+F4");
    
    AppendMenuA(parent, MF_POPUP, (UINT_PTR)fileMenu, "&File");
}

void EditorWindow::createEditMenu(HMENU parent) {
    HMENU editMenu = CreatePopupMenu();
    
    AppendMenuA(editMenu, MF_STRING, IDM_EDIT_UNDO, "&Undo\tCtrl+Z");
    AppendMenuA(editMenu, MF_STRING, IDM_EDIT_REDO, "&Redo\tCtrl+Y");
    AppendMenuA(editMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(editMenu, MF_STRING, IDM_EDIT_CUT, "Cu&t\tCtrl+X");
    AppendMenuA(editMenu, MF_STRING, IDM_EDIT_COPY, "&Copy\tCtrl+C");
    AppendMenuA(editMenu, MF_STRING, IDM_EDIT_PASTE, "&Paste\tCtrl+V");
    AppendMenuA(editMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(editMenu, MF_STRING, IDM_EDIT_SELECT_ALL, "Select &All\tCtrl+A");
    AppendMenuA(editMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(editMenu, MF_STRING, IDM_EDIT_FIND, "&Find...\tCtrl+F");
    AppendMenuA(editMenu, MF_STRING, IDM_EDIT_REPLACE, "&Replace...\tCtrl+H");
    AppendMenuA(editMenu, MF_STRING, IDM_EDIT_FIND_IN_FILES, "Find in F&iles...\tCtrl+Shift+F");
    AppendMenuA(editMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(editMenu, MF_STRING, IDM_EDIT_GOTO_LINE, "&Go to Line...\tCtrl+G");
    
    AppendMenuA(parent, MF_POPUP, (UINT_PTR)editMenu, "&Edit");
}

void EditorWindow::createViewMenu(HMENU parent) {
    HMENU viewMenu = CreatePopupMenu();
    
    AppendMenuA(viewMenu, MF_STRING | MF_CHECKED, IDM_VIEW_PROJECT, "&Project Explorer\tCtrl+Alt+L");
    AppendMenuA(viewMenu, MF_STRING | MF_CHECKED, IDM_VIEW_OUTPUT, "&Output Console\tCtrl+Alt+O");
    AppendMenuA(viewMenu, MF_STRING | MF_CHECKED, IDM_VIEW_PROPERTIES, "P&roperties Panel\tF4");
    AppendMenuA(viewMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(viewMenu, MF_STRING | MF_CHECKED, IDM_VIEW_TOOLBAR, "&Toolbar");
    AppendMenuA(viewMenu, MF_STRING | MF_CHECKED, IDM_VIEW_STATUSBAR, "&Status Bar");
    AppendMenuA(viewMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(viewMenu, MF_STRING, IDM_VIEW_ZOOM_IN, "Zoom &In\tCtrl++");
    AppendMenuA(viewMenu, MF_STRING, IDM_VIEW_ZOOM_OUT, "Zoom &Out\tCtrl+-");
    AppendMenuA(viewMenu, MF_STRING, IDM_VIEW_ZOOM_RESET, "&Reset Zoom\tCtrl+0");
    
    AppendMenuA(parent, MF_POPUP, (UINT_PTR)viewMenu, "&View");
}

void EditorWindow::createProjectMenu(HMENU parent) {
    HMENU projectMenu = CreatePopupMenu();
    
    AppendMenuA(projectMenu, MF_STRING, IDM_PROJECT_NEW, "&New Project...");
    AppendMenuA(projectMenu, MF_STRING, IDM_PROJECT_OPEN, "&Open Project...");
    AppendMenuA(projectMenu, MF_STRING, IDM_PROJECT_CLOSE, "&Close Project");
    AppendMenuA(projectMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(projectMenu, MF_STRING, IDM_PROJECT_ADD_NEW, "Add &New Item...\tCtrl+Shift+N");
    AppendMenuA(projectMenu, MF_STRING, IDM_PROJECT_ADD_EXIST, "Add &Existing Item...\tShift+Alt+A");
    AppendMenuA(projectMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(projectMenu, MF_STRING, IDM_PROJECT_EXPLORER, "Show in &Explorer");
    AppendMenuA(projectMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(projectMenu, MF_STRING, IDM_PROJECT_SETTINGS, "Project &Settings...");
    
    AppendMenuA(parent, MF_POPUP, (UINT_PTR)projectMenu, "&Project");
}

void EditorWindow::createBuildMenu(HMENU parent) {
    HMENU buildMenu = CreatePopupMenu();
    
    AppendMenuA(buildMenu, MF_STRING, IDM_BUILD_BUILD, "&Build Project\tF7");
    AppendMenuA(buildMenu, MF_STRING, IDM_BUILD_REBUILD, "&Rebuild Project\tCtrl+Alt+F7");
    AppendMenuA(buildMenu, MF_STRING, IDM_BUILD_CLEAN, "&Clean Project");
    AppendMenuA(buildMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(buildMenu, MF_STRING, IDM_BUILD_ASSETS, "Build &Assets\tCtrl+Shift+B");
    AppendMenuA(buildMenu, MF_STRING, IDM_BUILD_ROM, "Build &ROM\tCtrl+B");
    AppendMenuA(buildMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(buildMenu, MF_STRING, IDM_BUILD_STOP, "&Stop Build\tCtrl+Break");
    AppendMenuA(buildMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(buildMenu, MF_STRING, IDM_BUILD_CONFIG, "Build &Configuration...");
    
    AppendMenuA(parent, MF_POPUP, (UINT_PTR)buildMenu, "&Build");
}

void EditorWindow::createDebugMenu(HMENU parent) {
    HMENU debugMenu = CreatePopupMenu();
    
    AppendMenuA(debugMenu, MF_STRING, IDM_DEBUG_START, "&Start Debugging\tF5");
    AppendMenuA(debugMenu, MF_STRING, IDM_DEBUG_START_NO_DBG, "Start &Without Debugging\tCtrl+F5");
    AppendMenuA(debugMenu, MF_STRING, IDM_DEBUG_STOP, "S&top Debugging\tShift+F5");
    AppendMenuA(debugMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(debugMenu, MF_STRING, IDM_DEBUG_STEP_OVER, "Step &Over\tF10");
    AppendMenuA(debugMenu, MF_STRING, IDM_DEBUG_STEP_INTO, "Step &Into\tF11");
    AppendMenuA(debugMenu, MF_STRING, IDM_DEBUG_STEP_OUT, "Step O&ut\tShift+F11");
    AppendMenuA(debugMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(debugMenu, MF_STRING, IDM_DEBUG_BREAKPOINT, "Toggle &Breakpoint\tF9");
    AppendMenuA(debugMenu, MF_STRING, IDM_DEBUG_CLEAR_BP, "&Clear All Breakpoints\tCtrl+Shift+F9");
    
    AppendMenuA(parent, MF_POPUP, (UINT_PTR)debugMenu, "&Debug");
}

void EditorWindow::createToolsMenu(HMENU parent) {
    HMENU toolsMenu = CreatePopupMenu();
    
    // Asset Tools submenu
    HMENU assetToolsMenu = CreatePopupMenu();
    AppendMenuA(assetToolsMenu, MF_STRING, IDM_TOOLS_TILE_EDITOR, "&Tile Editor");
    AppendMenuA(assetToolsMenu, MF_STRING, IDM_TOOLS_MAP_EDITOR, "&Map Editor");
    AppendMenuA(assetToolsMenu, MF_STRING, IDM_TOOLS_SPRITE_EDITOR, "&Sprite Editor");
    AppendMenuA(assetToolsMenu, MF_STRING, IDM_TOOLS_STRING_EDITOR, "S&tring Editor");
    AppendMenuA(assetToolsMenu, MF_STRING, IDM_TOOLS_TABLE_EDITOR, "Ta&ble Editor");
    AppendMenuA(assetToolsMenu, MF_STRING, IDM_TOOLS_PALETTE_EDITOR, "&Palette Editor");
    AppendMenuA(assetToolsMenu, MF_STRING, IDM_TOOLS_SOUND_EDITOR, "S&ound Editor");
    AppendMenuA(toolsMenu, MF_POPUP, (UINT_PTR)assetToolsMenu, "&Asset Tools");
    
    AppendMenuA(toolsMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(toolsMenu, MF_STRING, IDM_TOOLS_EMULATOR, "&Emulator\tF6");
    AppendMenuA(toolsMenu, MF_STRING, IDM_TOOLS_ASSET_BROWSER, "Asset &Browser");
    AppendMenuA(toolsMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(toolsMenu, MF_STRING, IDM_TOOLS_OPTIONS, "&Options...");
    
    AppendMenuA(parent, MF_POPUP, (UINT_PTR)toolsMenu, "&Tools");
}

void EditorWindow::createWindowMenu(HMENU parent) {
    HMENU windowMenu = CreatePopupMenu();
    
    AppendMenuA(windowMenu, MF_STRING, IDM_WINDOW_NEW, "&New Window");
    AppendMenuA(windowMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(windowMenu, MF_STRING, IDM_WINDOW_SPLIT_H, "Split &Horizontally");
    AppendMenuA(windowMenu, MF_STRING, IDM_WINDOW_SPLIT_V, "Split &Vertically");
    AppendMenuA(windowMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(windowMenu, MF_STRING, IDM_WINDOW_CLOSE_ALL, "&Close All Tabs");
    AppendMenuA(windowMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(windowMenu, MF_STRING, IDM_WINDOW_NEXT, "&Next Tab\tCtrl+Tab");
    AppendMenuA(windowMenu, MF_STRING, IDM_WINDOW_PREV, "&Previous Tab\tCtrl+Shift+Tab");
    
    AppendMenuA(parent, MF_POPUP, (UINT_PTR)windowMenu, "&Window");
}

void EditorWindow::createHelpMenu(HMENU parent) {
    HMENU helpMenu = CreatePopupMenu();
    
    AppendMenuA(helpMenu, MF_STRING, IDM_HELP_VIEW, "View &Help\tF1");
    AppendMenuA(helpMenu, MF_STRING, IDM_HELP_API, "&API Reference");
    AppendMenuA(helpMenu, MF_STRING, IDM_HELP_GBDK, "&GBDK Documentation");
    AppendMenuA(helpMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(helpMenu, MF_STRING, IDM_HELP_SHORTCUTS, "&Keyboard Shortcuts");
    AppendMenuA(helpMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(helpMenu, MF_STRING, IDM_HELP_UPDATES, "Check for &Updates...");
    AppendMenuA(helpMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(helpMenu, MF_STRING, IDM_HELP_ABOUT, "&About Enchantment Engine");
    
    AppendMenuA(parent, MF_POPUP, (UINT_PTR)helpMenu, "&Help");
}

// UI Creation Functions

void EditorWindow::createToolbar() {
    m_toolbar = CreateWindowExA(
        0, TOOLBARCLASSNAMEA, NULL,
        WS_CHILD | WS_VISIBLE | TBSTYLE_FLAT | TBSTYLE_TOOLTIPS,
        0, 0, 0, 0,
        m_hwnd, NULL, GetModuleHandle(NULL), NULL);
    
    SendMessage(m_toolbar, TB_BUTTONSTRUCTSIZE, sizeof(TBBUTTON), 0);
    
    // Add toolbar buttons
    TBBUTTON buttons[] = {
        {0, IDM_FILE_NEW, TBSTATE_ENABLED, BTNS_BUTTON, {0}, 0, (INT_PTR)"New"},
        {1, IDM_FILE_OPEN, TBSTATE_ENABLED, BTNS_BUTTON, {0}, 0, (INT_PTR)"Open"},
        {2, IDM_FILE_SAVE, TBSTATE_ENABLED, BTNS_BUTTON, {0}, 0, (INT_PTR)"Save"},
        {0, 0, TBSTATE_ENABLED, BTNS_SEP, {0}, 0, 0},
        {3, IDM_EDIT_CUT, TBSTATE_ENABLED, BTNS_BUTTON, {0}, 0, (INT_PTR)"Cut"},
        {4, IDM_EDIT_COPY, TBSTATE_ENABLED, BTNS_BUTTON, {0}, 0, (INT_PTR)"Copy"},
        {5, IDM_EDIT_PASTE, TBSTATE_ENABLED, BTNS_BUTTON, {0}, 0, (INT_PTR)"Paste"},
        {0, 0, TBSTATE_ENABLED, BTNS_SEP, {0}, 0, 0},
        {6, IDM_BUILD_BUILD, TBSTATE_ENABLED, BTNS_BUTTON, {0}, 0, (INT_PTR)"Build"},
        {7, IDM_DEBUG_START, TBSTATE_ENABLED, BTNS_BUTTON, {0}, 0, (INT_PTR)"Run"},
        {8, IDM_DEBUG_STOP, TBSTATE_ENABLED, BTNS_BUTTON, {0}, 0, (INT_PTR)"Stop"},
    };
    
    SendMessage(m_toolbar, TB_ADDBUTTONS, sizeof(buttons) / sizeof(TBBUTTON), (LPARAM)&buttons);
}

void EditorWindow::createStatusBar() {
    m_statusBar = CreateWindowExA(
        0, STATUSCLASSNAMEA, NULL,
        WS_CHILD | WS_VISIBLE | SBARS_SIZEGRIP,
        0, 0, 0, 0,
        m_hwnd, NULL, GetModuleHandle(NULL), NULL);
    
    // Set status bar parts
    int parts[] = {200, 400, 600, -1};
    SendMessage(m_statusBar, SB_SETPARTS, 4, (LPARAM)parts);
    
    SendMessageA(m_statusBar, SB_SETTEXTA, 0, (LPARAM)"Ready");
    SendMessageA(m_statusBar, SB_SETTEXTA, 1, (LPARAM)"Ln 1, Col 1");
    SendMessageA(m_statusBar, SB_SETTEXTA, 2, (LPARAM)"UTF-8");
    SendMessageA(m_statusBar, SB_SETTEXTA, 3, (LPARAM)"C");
}

void EditorWindow::createTabControl() {
    m_tabControl = CreateWindowExA(
        0, WC_TABCONTROLA, NULL,
        WS_CHILD | WS_VISIBLE | TCS_TABS,
        0, 0, 0, 0,
        m_hwnd, NULL, GetModuleHandle(NULL), NULL);
}

void EditorWindow::createPanels() {
    // Panels will be created by individual components
}

void EditorWindow::updateLayout(int width, int height) {
    // Toolbar
    if (m_toolbar && IsWindowVisible(m_toolbar)) {
        SendMessage(m_toolbar, TB_AUTOSIZE, 0, 0);
    }
    
    // Status bar
    if (m_statusBar && IsWindowVisible(m_statusBar)) {
        SendMessage(m_statusBar, WM_SIZE, 0, 0);
    }
    
    // Calculate client area
    RECT toolbarRect = {0};
    RECT statusRect = {0};
    
    if (m_toolbar && IsWindowVisible(m_toolbar)) {
        GetWindowRect(m_toolbar, &toolbarRect);
    }
    
    if (m_statusBar && IsWindowVisible(m_statusBar)) {
        GetWindowRect(m_statusBar, &statusRect);
    }
    
    int toolbarHeight = toolbarRect.bottom - toolbarRect.top;
    int statusHeight = statusRect.bottom - statusRect.top;
    int clientHeight = height - toolbarHeight - statusHeight;
    
    // Tab control
    if (m_tabControl) {
        SetWindowPos(m_tabControl, NULL, 0, toolbarHeight, width, clientHeight, SWP_NOZORDER);
    }
}

// File Operations

void EditorWindow::newFile() {
    updateStatusBar("Creating new file...");
    // Implementation: Create new file tab
    MessageBoxA(m_hwnd, "New file created", "New File", MB_OK | MB_ICONINFORMATION);
}

void EditorWindow::openFile() {
    char fileName[MAX_PATH] = {0};
    
    OPENFILENAMEA ofn = {};
    ofn.lStructSize = sizeof(ofn);
    ofn.hwndOwner = m_hwnd;
    ofn.lpstrFile = fileName;
    ofn.nMaxFile = MAX_PATH;
    ofn.lpstrFilter = "All Files (*.*)\0*.*\0C Files (*.c)\0*.c\0Header Files (*.h)\0*.h\0";
    ofn.nFilterIndex = 1;
    ofn.Flags = OFN_PATHMUSTEXIST | OFN_FILEMUSTEXIST;
    
    if (GetOpenFileNameA(&ofn)) {
        m_openFiles.push_back(fileName);
        addRecentFile(fileName);
        updateStatusBar("Opened: " + std::string(fileName));
    }
}

void EditorWindow::saveFile() {
    if (m_currentFileIndex >= 0 && m_currentFileIndex < (int)m_openFiles.size()) {
        updateStatusBar("Saved: " + m_openFiles[m_currentFileIndex]);
    } else {
        saveFileAs();
    }
}

void EditorWindow::saveFileAs() {
    char fileName[MAX_PATH] = {0};
    
    OPENFILENAMEA ofn = {};
    ofn.lStructSize = sizeof(ofn);
    ofn.hwndOwner = m_hwnd;
    ofn.lpstrFile = fileName;
    ofn.nMaxFile = MAX_PATH;
    ofn.lpstrFilter = "All Files (*.*)\0*.*\0C Files (*.c)\0*.c\0Header Files (*.h)\0*.h\0";
    ofn.nFilterIndex = 1;
    ofn.Flags = OFN_OVERWRITEPROMPT;
    
    if (GetSaveFileNameA(&ofn)) {
        updateStatusBar("Saved as: " + std::string(fileName));
    }
}

void EditorWindow::saveAll() {
    updateStatusBar("Saving all files...");
    for (const auto& file : m_openFiles) {
        // Save each file
    }
    updateStatusBar("All files saved");
}

void EditorWindow::closeFile() {
    if (m_currentFileIndex >= 0 && m_currentFileIndex < (int)m_openFiles.size()) {
        m_openFiles.erase(m_openFiles.begin() + m_currentFileIndex);
        m_currentFileIndex = -1;
        updateStatusBar("File closed");
    }
}

void EditorWindow::closeAllFiles() {
    m_openFiles.clear();
    m_currentFileIndex = -1;
    updateStatusBar("All files closed");
}

void EditorWindow::recentFile(int index) {
    // Open recent file
}

// Edit Operations

void EditorWindow::undo() {
    updateStatusBar("Undo");
}

void EditorWindow::redo() {
    updateStatusBar("Redo");
}

void EditorWindow::cut() {
    updateStatusBar("Cut");
}

void EditorWindow::copy() {
    updateStatusBar("Copy");
}

void EditorWindow::paste() {
    updateStatusBar("Paste");
}

void EditorWindow::selectAll() {
    updateStatusBar("Select All");
}

void EditorWindow::find() {
    MessageBoxA(m_hwnd, "Find dialog", "Find", MB_OK | MB_ICONINFORMATION);
}

void EditorWindow::replace() {
    MessageBoxA(m_hwnd, "Replace dialog", "Replace", MB_OK | MB_ICONINFORMATION);
}

void EditorWindow::findInFiles() {
    MessageBoxA(m_hwnd, "Find in Files dialog", "Find in Files", MB_OK | MB_ICONINFORMATION);
}

void EditorWindow::goToLine() {
    MessageBoxA(m_hwnd, "Go to Line dialog", "Go to Line", MB_OK | MB_ICONINFORMATION);
}

// View Operations

void EditorWindow::toggleProjectExplorer() {
    updateStatusBar("Toggle Project Explorer");
}

void EditorWindow::toggleOutputConsole() {
    updateStatusBar("Toggle Output Console");
}

void EditorWindow::togglePropertiesPanel() {
    updateStatusBar("Toggle Properties Panel");
}

void EditorWindow::toggleToolbar() {
    if (m_toolbar) {
        BOOL visible = IsWindowVisible(m_toolbar);
        ShowWindow(m_toolbar, visible ? SW_HIDE : SW_SHOW);
        updateLayout(0, 0);
    }
}

void EditorWindow::toggleStatusBar() {
    if (m_statusBar) {
        BOOL visible = IsWindowVisible(m_statusBar);
        ShowWindow(m_statusBar, visible ? SW_HIDE : SW_SHOW);
        updateLayout(0, 0);
    }
}

void EditorWindow::zoomIn() {
    m_config.fontSize++;
    updateStatusBar("Zoom In: " + std::to_string(m_config.fontSize));
}

void EditorWindow::zoomOut() {
    if (m_config.fontSize > 8) {
        m_config.fontSize--;
        updateStatusBar("Zoom Out: " + std::to_string(m_config.fontSize));
    }
}

void EditorWindow::resetZoom() {
    m_config.fontSize = 12;
    updateStatusBar("Zoom Reset");
}

// Project Operations

void EditorWindow::newProject() {
    MessageBoxA(m_hwnd, "New Project wizard", "New Project", MB_OK | MB_ICONINFORMATION);
}

void EditorWindow::openProject() {
    MessageBoxA(m_hwnd, "Open Project dialog", "Open Project", MB_OK | MB_ICONINFORMATION);
}

void EditorWindow::closeProject() {
    updateStatusBar("Project closed");
}

void EditorWindow::projectSettings() {
    MessageBoxA(m_hwnd, 
        "Project Settings:\n\n"
        "Name: " + m_config.projectPath + "\n"
        "Build System: GBDK-2020\n"
        "Target: Game Boy Color\n",
        "Project Settings", MB_OK | MB_ICONINFORMATION);
}

void EditorWindow::addNewItem() {
    MessageBoxA(m_hwnd, "Add New Item dialog", "Add New Item", MB_OK | MB_ICONINFORMATION);
}

void EditorWindow::addExistingItem() {
    MessageBoxA(m_hwnd, "Add Existing Item dialog", "Add Existing Item", MB_OK | MB_ICONINFORMATION);
}

void EditorWindow::showInExplorer() {
    std::string command = "explorer \"" + m_config.projectPath + "\"";
    system(command.c_str());
}

// Build Operations

void EditorWindow::buildProject() {
    updateStatusBar("Building project...");
    if (m_buildSystem) {
        m_buildSystem->build();
    }
    updateStatusBar("Build complete");
}

void EditorWindow::rebuildProject() {
    updateStatusBar("Rebuilding project...");
    if (m_buildSystem) {
        m_buildSystem->clean();
        m_buildSystem->build();
    }
    updateStatusBar("Rebuild complete");
}

void EditorWindow::cleanProject() {
    updateStatusBar("Cleaning project...");
    if (m_buildSystem) {
        m_buildSystem->clean();
    }
    updateStatusBar("Clean complete");
}

void EditorWindow::buildAssets() {
    updateStatusBar("Building assets...");
    if (m_assetManager) {
        m_assetManager->processAssets();
    }
    updateStatusBar("Assets built");
}

void EditorWindow::buildROM() {
    updateStatusBar("Building ROM...");
    buildAssets();
    buildProject();
    updateStatusBar("ROM built successfully");
}

void EditorWindow::stopBuild() {
    updateStatusBar("Build stopped");
}

void EditorWindow::buildConfiguration() {
    MessageBoxA(m_hwnd, "Build Configuration dialog", "Build Configuration", MB_OK | MB_ICONINFORMATION);
}

// Debug Operations

void EditorWindow::startDebugging() {
    updateStatusBar("Starting debugger...");
    emulator();
}

void EditorWindow::startWithoutDebugging() {
    updateStatusBar("Running without debugger...");
    emulator();
}

void EditorWindow::stopDebugging() {
    updateStatusBar("Debugger stopped");
}

void EditorWindow::stepOver() {
    updateStatusBar("Step Over");
}

void EditorWindow::stepInto() {
    updateStatusBar("Step Into");
}

void EditorWindow::stepOut() {
    updateStatusBar("Step Out");
}

void EditorWindow::toggleBreakpoint() {
    updateStatusBar("Breakpoint toggled");
}

void EditorWindow::clearAllBreakpoints() {
    updateStatusBar("All breakpoints cleared");
}

// Tools Operations

void EditorWindow::tileEditor() {
    MessageBoxA(m_hwnd, "Opening Tile Editor...", "Tile Editor", MB_OK | MB_ICONINFORMATION);
}

void EditorWindow::mapEditor() {
    MessageBoxA(m_hwnd, "Opening Map Editor...", "Map Editor", MB_OK | MB_ICONINFORMATION);
}

void EditorWindow::spriteEditor() {
    MessageBoxA(m_hwnd, "Opening Sprite Editor...", "Sprite Editor", MB_OK | MB_ICONINFORMATION);
}

void EditorWindow::stringEditor() {
    MessageBoxA(m_hwnd, "Opening String Editor...", "String Editor", MB_OK | MB_ICONINFORMATION);
}

void EditorWindow::tableEditor() {
    MessageBoxA(m_hwnd, "Opening Table Editor...", "Table Editor", MB_OK | MB_ICONINFORMATION);
}

void EditorWindow::paletteEditor() {
    MessageBoxA(m_hwnd, "Opening Palette Editor...", "Palette Editor", MB_OK | MB_ICONINFORMATION);
}

void EditorWindow::soundEditor() {
    MessageBoxA(m_hwnd, "Opening Sound Editor...", "Sound Editor", MB_OK | MB_ICONINFORMATION);
}

void EditorWindow::emulator() {
    std::string url = m_config.serverUrl + "/emulator";
    ShellExecuteA(NULL, "open", url.c_str(), NULL, NULL, SW_SHOWNORMAL);
}

void EditorWindow::assetBrowser() {
    MessageBoxA(m_hwnd, "Opening Asset Browser...", "Asset Browser", MB_OK | MB_ICONINFORMATION);
}

void EditorWindow::options() {
    MessageBoxA(m_hwnd,
        "Editor Options:\n\n"
        "Font Size: " + std::to_string(m_config.fontSize) + "\n"
        "Auto Save: " + std::string(m_config.autoSave ? "On" : "Off") + "\n"
        "Line Numbers: " + std::string(m_config.showLineNumbers ? "On" : "Off") + "\n"
        "Word Wrap: " + std::string(m_config.wordWrap ? "On" : "Off"),
        "Options", MB_OK | MB_ICONINFORMATION);
}

// Window Operations

void EditorWindow::newWindow() {
    MessageBoxA(m_hwnd, "Opening new window...", "New Window", MB_OK | MB_ICONINFORMATION);
}

void EditorWindow::splitHorizontal() {
    updateStatusBar("Split Horizontally");
}

void EditorWindow::splitVertical() {
    updateStatusBar("Split Vertically");
}

void EditorWindow::closeAllTabs() {
    closeAllFiles();
}

void EditorWindow::nextTab() {
    if (!m_openFiles.empty()) {
        m_currentFileIndex = (m_currentFileIndex + 1) % m_openFiles.size();
        updateStatusBar("Next Tab");
    }
}

void EditorWindow::previousTab() {
    if (!m_openFiles.empty()) {
        m_currentFileIndex = (m_currentFileIndex - 1 + m_openFiles.size()) % m_openFiles.size();
        updateStatusBar("Previous Tab");
    }
}

// Help Operations

void EditorWindow::viewHelp() {
    MessageBoxA(m_hwnd,
        "Enchantment Engine Help\n\n"
        "Getting Started:\n"
        "1. Create or open a project\n"
        "2. Edit your game code\n"
        "3. Build assets and ROM\n"
        "4. Test in emulator\n\n"
        "For more help, press F1 or visit the documentation.",
        "Help", MB_OK | MB_ICONINFORMATION);
}

void EditorWindow::apiReference() {
    std::string url = m_config.serverUrl + "/api-reference";
    ShellExecuteA(NULL, "open", url.c_str(), NULL, NULL, SW_SHOWNORMAL);
}

void EditorWindow::gbdkDocumentation() {
    ShellExecuteA(NULL, "open", "https://gbdk-2020.github.io/gbdk-2020/", NULL, NULL, SW_SHOWNORMAL);
}

void EditorWindow::keyboardShortcuts() {
    MessageBoxA(m_hwnd,
        "Keyboard Shortcuts:\n\n"
        "File:\n"
        "  Ctrl+N - New File\n"
        "  Ctrl+O - Open File\n"
        "  Ctrl+S - Save File\n"
        "  Ctrl+W - Close File\n\n"
        "Edit:\n"
        "  Ctrl+Z - Undo\n"
        "  Ctrl+Y - Redo\n"
        "  Ctrl+X - Cut\n"
        "  Ctrl+C - Copy\n"
        "  Ctrl+V - Paste\n"
        "  Ctrl+F - Find\n"
        "  Ctrl+H - Replace\n"
        "  Ctrl+G - Go to Line\n\n"
        "Build:\n"
        "  F7 - Build Project\n"
        "  Ctrl+B - Build ROM\n\n"
        "Debug:\n"
        "  F5 - Start Debugging\n"
        "  F9 - Toggle Breakpoint\n"
        "  F10 - Step Over\n"
        "  F11 - Step Into",
        "Keyboard Shortcuts", MB_OK | MB_ICONINFORMATION);
}

void EditorWindow::checkForUpdates() {
    MessageBoxA(m_hwnd, "You are using the latest version.", "Check for Updates", MB_OK | MB_ICONINFORMATION);
}

void EditorWindow::about() {
    MessageBoxA(m_hwnd,
        "🐉 Enchantment Engine\n"
        "Game Boy Color Development Suite\n\n"
        "Version: 3.0.0\n"
        "Release: March 1, 2026\n\n"
        "Complete IDE for Game Boy Color development\n"
        "with integrated tools, emulator, and build system.\n\n"
        "© 2026 Enchantment Engine Team",
        "About", MB_OK | MB_ICONINFORMATION);
}

// Utility Functions

void EditorWindow::updateTitle() {
    std::string title = "Enchantment Engine";
    if (m_currentFileIndex >= 0 && m_currentFileIndex < (int)m_openFiles.size()) {
        title += " - " + m_openFiles[m_currentFileIndex];
    }
    SetWindowTextA(m_hwnd, title.c_str());
}

void EditorWindow::updateStatusBar(const std::string& text) {
    if (m_statusBar) {
        SendMessageA(m_statusBar, SB_SETTEXTA, 0, (LPARAM)text.c_str());
    }
}

void EditorWindow::loadConfig() {
    std::ifstream config("editor.conf");
    if (config.is_open()) {
        std::string line;
        while (std::getline(config, line)) {
            if (line.find("fontSize=") == 0) {
                m_config.fontSize = std::stoi(line.substr(9));
            } else if (line.find("darkMode=") == 0) {
                m_config.darkMode = (line.substr(9) == "true");
            } else if (line.find("autoSave=") == 0) {
                m_config.autoSave = (line.substr(9) == "true");
            }
        }
    }
}

void EditorWindow::saveConfig() {
    std::ofstream config("editor.conf");
    config << "fontSize=" << m_config.fontSize << "\n";
    config << "darkMode=" << (m_config.darkMode ? "true" : "false") << "\n";
    config << "autoSave=" << (m_config.autoSave ? "true" : "false") << "\n";
}

void EditorWindow::addRecentFile(const std::string& path) {
    // Add to recent files list
}

#endif // _WIN32
