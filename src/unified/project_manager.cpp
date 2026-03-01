/**
 * Enchantment Game Engine - Project Manager Implementation
 */

#include "project_manager.hpp"
#include <iostream>
#include <fstream>
#include <sstream>
#include <filesystem>

#ifdef _WIN32
    #include <shlobj.h>
    #include <commdlg.h>
#endif

namespace fs = std::filesystem;

// Control IDs
#define IDC_PROJECT_LISTBOX     1001
#define IDC_STATUS_BAR          1002
#define IDC_PREVIEW_PANEL       1003

// Menu IDs - File Menu
#define IDM_FILE_OPEN_PROJECT   2001
#define IDM_FILE_NEW_PROJECT    2002
#define IDM_FILE_OPEN_FOLDER    2003
#define IDM_FILE_OPEN_FILES     2004
#define IDM_FILE_RECENT_1       2010
#define IDM_FILE_RECENT_2       2011
#define IDM_FILE_RECENT_3       2012
#define IDM_FILE_RECENT_4       2013
#define IDM_FILE_RECENT_5       2014
#define IDM_FILE_EXIT           2020

// Menu IDs - Edit Menu
#define IDM_EDIT_REMOVE_RECENT  2101
#define IDM_EDIT_CLEAR_RECENT   2102

// Menu IDs - View Menu
#define IDM_VIEW_PREVIEW        2201
#define IDM_VIEW_REFRESH        2202

// Menu IDs - Tools Menu
#define IDM_TOOLS_SETTINGS      2301
#define IDM_TOOLS_LOCATION      2302

// Menu IDs - Help Menu
#define IDM_HELP_DOCS           2401
#define IDM_HELP_SHORTCUTS      2402
#define IDM_HELP_ABOUT          2403

ProjectManager::ProjectManager()
    : m_cancelled(false)
#ifdef _WIN32
    , m_hwnd(nullptr)
    , m_menuBar(nullptr)
    , m_font(nullptr)
    , m_titleFont(nullptr)
    , m_boldFont(nullptr)
    , m_projectListBox(nullptr)
    , m_statusBar(nullptr)
    , m_previewPanel(nullptr)
#endif
{
    loadRecentProjects();
}

ProjectManager::~ProjectManager() {
#ifdef _WIN32
    if (m_font) DeleteObject(m_font);
    if (m_titleFont) DeleteObject(m_titleFont);
    if (m_boldFont) DeleteObject(m_boldFont);
    if (m_menuBar) DestroyMenu(m_menuBar);
#endif
}

bool ProjectManager::showDialog() {
#ifdef _WIN32
    // Register window class
    WNDCLASSA wc = {};
    wc.lpfnWndProc = WindowProc;
    wc.hInstance = GetModuleHandle(NULL);
    wc.lpszClassName = "EnchantmentProjectManager";
    wc.hCursor = LoadCursor(NULL, IDC_ARROW);
    wc.hbrBackground = CreateSolidBrush(RGB(240, 240, 240));
    wc.style = CS_HREDRAW | CS_VREDRAW;
    
    RegisterClassA(&wc);
    
    // Create window with menu
    int width = 900;
    int height = 600;
    int screenWidth = GetSystemMetrics(SM_CXSCREEN);
    int screenHeight = GetSystemMetrics(SM_CYSCREEN);
    int x = (screenWidth - width) / 2;
    int y = (screenHeight - height) / 2;
    
    m_hwnd = CreateWindowExA(
        WS_EX_DLGMODALFRAME | WS_EX_TOPMOST,
        "EnchantmentProjectManager",
        "Enchantment Engine - Project Manager",
        WS_OVERLAPPEDWINDOW,
        x, y, width, height,
        NULL, NULL, GetModuleHandle(NULL), this
    );
    
    if (!m_hwnd) {
        return false;
    }
    
    // Create fonts
    m_font = CreateFontA(16, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE,
        DEFAULT_CHARSET, OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS,
        CLEARTYPE_QUALITY, DEFAULT_PITCH | FF_DONTCARE, "Segoe UI");
    
    m_titleFont = CreateFontA(24, 0, 0, 0, FW_BOLD, FALSE, FALSE, FALSE,
        DEFAULT_CHARSET, OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS,
        CLEARTYPE_QUALITY, DEFAULT_PITCH | FF_DONTCARE, "Segoe UI");
    
    m_boldFont = CreateFontA(16, 0, 0, 0, FW_BOLD, FALSE, FALSE, FALSE,
        DEFAULT_CHARSET, OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS,
        CLEARTYPE_QUALITY, DEFAULT_PITCH | FF_DONTCARE, "Segoe UI");
    
    // Show window
    ShowWindow(m_hwnd, SW_SHOW);
    UpdateWindow(m_hwnd);
    
    // Message loop
    MSG msg;
    while (GetMessage(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    
    return !m_cancelled;
#else
    // For non-Windows, use current directory
    m_selectedProject.path = ".";
    m_selectedProject.name = "Current Project";
    m_selectedProject.isNew = false;
    return true;
#endif
}

#ifdef _WIN32

LRESULT CALLBACK ProjectManager::WindowProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    ProjectManager* manager = nullptr;
    
    if (msg == WM_CREATE) {
        CREATESTRUCT* cs = (CREATESTRUCT*)lParam;
        manager = (ProjectManager*)cs->lpCreateParams;
        SetWindowLongPtr(hwnd, GWLP_USERDATA, (LONG_PTR)manager);
        manager->onCreate();
    } else {
        manager = (ProjectManager*)GetWindowLongPtr(hwnd, GWLP_USERDATA);
    }
    
    if (manager) {
        switch (msg) {
            case WM_PAINT:
                manager->onPaint();
                return 0;
            case WM_COMMAND:
                manager->onCommand(wParam);
                return 0;
            case WM_SIZE:
                manager->onSize(LOWORD(lParam), HIWORD(lParam));
                return 0;
            case WM_ERASEBKGND:
                return 1; // Prevent flicker
            case WM_DESTROY:
                manager->onDestroy();
                return 0;
        }
    }
    
    return DefWindowProc(hwnd, msg, wParam, lParam);
}

void ProjectManager::onCreate() {
    std::cout << "ProjectManager::onCreate() called" << std::endl;
    createMenuBar();
    std::cout << "Menu bar created" << std::endl;
    createControls();
    std::cout << "Controls created" << std::endl;
    createStatusBar();
    std::cout << "Status bar created" << std::endl;
    refreshProjectList();
    std::cout << "Project list refreshed" << std::endl;
}

void ProjectManager::createMenuBar() {
    m_menuBar = CreateMenu();
    
    // File Menu
    HMENU fileMenu = CreatePopupMenu();
    AppendMenuA(fileMenu, MF_STRING, IDM_FILE_OPEN_PROJECT, "📁 &Open Project...\tCtrl+O");
    AppendMenuA(fileMenu, MF_STRING, IDM_FILE_NEW_PROJECT, "✨ &New Project...\tCtrl+N");
    AppendMenuA(fileMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(fileMenu, MF_STRING, IDM_FILE_OPEN_FOLDER, "📂 Open &Folder...\tCtrl+K");
    AppendMenuA(fileMenu, MF_STRING, IDM_FILE_OPEN_FILES, "📄 Open &Files...\tCtrl+Shift+O");
    AppendMenuA(fileMenu, MF_SEPARATOR, 0, NULL);
    
    // Recent Projects submenu
    HMENU recentMenu = CreatePopupMenu();
    if (m_recentProjects.empty()) {
        AppendMenuA(recentMenu, MF_STRING | MF_GRAYED, 0, "(No recent projects)");
    } else {
        for (size_t i = 0; i < m_recentProjects.size() && i < 5; i++) {
            std::string menuText = std::to_string(i + 1) + ". " + m_recentProjects[i].name;
            AppendMenuA(recentMenu, MF_STRING, IDM_FILE_RECENT_1 + i, menuText.c_str());
        }
    }
    AppendMenuA(fileMenu, MF_POPUP, (UINT_PTR)recentMenu, "&Recent Projects");
    
    AppendMenuA(fileMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(fileMenu, MF_STRING, IDM_FILE_EXIT, "E&xit\tAlt+F4");
    AppendMenuA(m_menuBar, MF_POPUP, (UINT_PTR)fileMenu, "&File");
    
    // Edit Menu
    HMENU editMenu = CreatePopupMenu();
    AppendMenuA(editMenu, MF_STRING, IDM_EDIT_REMOVE_RECENT, "Remove from Recent");
    AppendMenuA(editMenu, MF_STRING, IDM_EDIT_CLEAR_RECENT, "Clear Recent Projects");
    AppendMenuA(m_menuBar, MF_POPUP, (UINT_PTR)editMenu, "&Edit");
    
    // View Menu
    HMENU viewMenu = CreatePopupMenu();
    AppendMenuA(viewMenu, MF_STRING | MF_CHECKED, IDM_VIEW_PREVIEW, "Show &Preview Panel");
    AppendMenuA(viewMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(viewMenu, MF_STRING, IDM_VIEW_REFRESH, "&Refresh\tF5");
    AppendMenuA(m_menuBar, MF_POPUP, (UINT_PTR)viewMenu, "&View");
    
    // Tools Menu
    HMENU toolsMenu = CreatePopupMenu();
    AppendMenuA(toolsMenu, MF_STRING, IDM_TOOLS_SETTINGS, "⚙️ &Settings...");
    AppendMenuA(toolsMenu, MF_STRING, IDM_TOOLS_LOCATION, "📍 Open Project &Location");
    AppendMenuA(m_menuBar, MF_POPUP, (UINT_PTR)toolsMenu, "&Tools");
    
    // Help Menu
    HMENU helpMenu = CreatePopupMenu();
    AppendMenuA(helpMenu, MF_STRING, IDM_HELP_DOCS, "📚 &Documentation");
    AppendMenuA(helpMenu, MF_STRING, IDM_HELP_SHORTCUTS, "⌨️ &Keyboard Shortcuts");
    AppendMenuA(helpMenu, MF_SEPARATOR, 0, NULL);
    AppendMenuA(helpMenu, MF_STRING, IDM_HELP_ABOUT, "&About Enchantment Engine");
    AppendMenuA(m_menuBar, MF_POPUP, (UINT_PTR)helpMenu, "&Help");
    
    SetMenu(m_hwnd, m_menuBar);
}

void ProjectManager::createControls() {
    HINSTANCE hInstance = GetModuleHandle(NULL);
    
    // Get client area
    RECT clientRect;
    GetClientRect(m_hwnd, &clientRect);
    int width = clientRect.right - clientRect.left;
    int height = clientRect.bottom - clientRect.top;
    
    // Title section
    HWND titleLabel = CreateWindowA("STATIC", "Enchantment Engine",
        WS_CHILD | WS_VISIBLE | SS_CENTER,
        20, 10, width - 40, 40,
        m_hwnd, NULL, hInstance, NULL);
    SendMessage(titleLabel, WM_SETFONT, (WPARAM)m_titleFont, TRUE);
    
    // Subtitle
    HWND subtitleLabel = CreateWindowA("STATIC", 
        "Select a project to open or create a new one",
        WS_CHILD | WS_VISIBLE | SS_CENTER,
        20, 55, width - 40, 25,
        m_hwnd, NULL, hInstance, NULL);
    SendMessage(subtitleLabel, WM_SETFONT, (WPARAM)m_font, TRUE);
    
    // Quick action buttons
    int btnY = 90;
    int btnWidth = (width - 80) / 4;
    
    HWND btnOpen = CreateWindowA("BUTTON", "Open",
        WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
        20, btnY, btnWidth, 40,
        m_hwnd, (HMENU)IDM_FILE_OPEN_PROJECT, hInstance, NULL);
    SendMessage(btnOpen, WM_SETFONT, (WPARAM)m_font, TRUE);
    
    HWND btnNew = CreateWindowA("BUTTON", "New",
        WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
        30 + btnWidth, btnY, btnWidth, 40,
        m_hwnd, (HMENU)IDM_FILE_NEW_PROJECT, hInstance, NULL);
    SendMessage(btnNew, WM_SETFONT, (WPARAM)m_font, TRUE);
    
    HWND btnFolder = CreateWindowA("BUTTON", "Folder",
        WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
        40 + btnWidth * 2, btnY, btnWidth, 40,
        m_hwnd, (HMENU)IDM_FILE_OPEN_FOLDER, hInstance, NULL);
    SendMessage(btnFolder, WM_SETFONT, (WPARAM)m_font, TRUE);
    
    HWND btnFiles = CreateWindowA("BUTTON", "Files",
        WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
        50 + btnWidth * 3, btnY, btnWidth, 40,
        m_hwnd, (HMENU)IDM_FILE_OPEN_FILES, hInstance, NULL);
    SendMessage(btnFiles, WM_SETFONT, (WPARAM)m_font, TRUE);
    
    // Projects section label
    HWND projectsLabel = CreateWindowA("STATIC", "Recent Projects:",
        WS_CHILD | WS_VISIBLE | SS_LEFT,
        20, 145, 300, 25,
        m_hwnd, NULL, hInstance, NULL);
    SendMessage(projectsLabel, WM_SETFONT, (WPARAM)m_boldFont, TRUE);
    
    // Project list box
    m_projectListBox = CreateWindowExA(
        WS_EX_CLIENTEDGE,
        "LISTBOX",
        NULL,
        WS_CHILD | WS_VISIBLE | WS_VSCROLL | LBS_NOTIFY | LBS_HASSTRINGS,
        20, 175, (width - 60) / 2, height - 220,
        m_hwnd, (HMENU)IDC_PROJECT_LISTBOX, hInstance, NULL);
    SendMessage(m_projectListBox, WM_SETFONT, (WPARAM)m_font, TRUE);
    
    // Preview panel
    m_previewPanel = CreateWindowExA(
        WS_EX_CLIENTEDGE,
        "STATIC",
        "Select a project to see details",
        WS_CHILD | WS_VISIBLE | SS_LEFT,
        (width - 60) / 2 + 40, 175, (width - 60) / 2, height - 220,
        m_hwnd, (HMENU)IDC_PREVIEW_PANEL, hInstance, NULL);
    SendMessage(m_previewPanel, WM_SETFONT, (WPARAM)m_font, TRUE);
    
    // Force redraw
    InvalidateRect(m_hwnd, NULL, TRUE);
    UpdateWindow(m_hwnd);
}

void ProjectManager::createStatusBar() {
    HINSTANCE hInstance = GetModuleHandle(NULL);
    
    m_statusBar = CreateWindowExA(
        0,
        "STATIC",
        "Ready | Press F1 for help",
        WS_CHILD | WS_VISIBLE | SS_LEFT,
        0, 0, 0, 0,  // Will be positioned in updateLayout
        m_hwnd, (HMENU)IDC_STATUS_BAR, hInstance, NULL);
    SendMessage(m_statusBar, WM_SETFONT, (WPARAM)m_font, TRUE);
}

void ProjectManager::updateLayout(int width, int height) {
    // Update status bar
    if (m_statusBar) {
        SetWindowPos(m_statusBar, NULL, 5, height - 25, width - 10, 20, SWP_NOZORDER);
    }
    
    // Update project list and preview panel
    if (m_projectListBox) {
        SetWindowPos(m_projectListBox, NULL, 20, 175, (width - 60) / 2, height - 220, SWP_NOZORDER);
    }
    
    if (m_previewPanel) {
        SetWindowPos(m_previewPanel, NULL, (width - 60) / 2 + 40, 175, (width - 60) / 2, height - 220, SWP_NOZORDER);
    }
}

void ProjectManager::refreshProjectList() {
    if (!m_projectListBox) return;
    
    // Clear list
    SendMessage(m_projectListBox, LB_RESETCONTENT, 0, 0);
    
    // Add recent projects
    for (const auto& project : m_recentProjects) {
        std::string displayText = "📁 " + project.name + "\n   " + project.path;
        SendMessageA(m_projectListBox, LB_ADDSTRING, 0, (LPARAM)displayText.c_str());
    }
    
    // Update status
    if (m_statusBar) {
        std::string status = "Ready | " + std::to_string(m_recentProjects.size()) + " recent projects";
        SetWindowTextA(m_statusBar, status.c_str());
    }
}

void ProjectManager::updatePreview() {
    if (!m_previewPanel || !m_projectListBox) return;
    
    int selectedIndex = SendMessage(m_projectListBox, LB_GETCURSEL, 0, 0);
    if (selectedIndex == LB_ERR || selectedIndex >= (int)m_recentProjects.size()) {
        SetWindowTextA(m_previewPanel, "Select a project to see details");
        return;
    }
    
    const auto& project = m_recentProjects[selectedIndex];
    std::string preview = "Project: " + project.name + "\n\n";
    preview += "Path:\n" + project.path + "\n\n";
    preview += "Type: " + std::string(project.isNew ? "New Project" : "Existing Project") + "\n\n";
    
    // Check if path exists
    if (fs::exists(project.path)) {
        preview += "Status: ✅ Available\n";
    } else {
        preview += "Status: ❌ Not Found\n";
    }
    
    SetWindowTextA(m_previewPanel, preview.c_str());
}

void ProjectManager::onPaint() {
    PAINTSTRUCT ps;
    HDC hdc = BeginPaint(m_hwnd, &ps);
    
    // Draw background
    RECT rect;
    GetClientRect(m_hwnd, &rect);
    
    // Fill with light gray background
    HBRUSH brush = CreateSolidBrush(RGB(240, 240, 240));
    FillRect(hdc, &rect, brush);
    DeleteObject(brush);
    
    EndPaint(m_hwnd, &ps);
}

void ProjectManager::onSize(int width, int height) {
    updateLayout(width, height);
}

void ProjectManager::onListBoxSelection() {
    updatePreview();
}

void ProjectManager::onCommand(WPARAM wParam) {
    int id = LOWORD(wParam);
    int notifyCode = HIWORD(wParam);
    
    // Handle listbox selection
    if (id == IDC_PROJECT_LISTBOX && notifyCode == LBN_SELCHANGE) {
        onListBoxSelection();
        return;
    }
    
    // Handle listbox double-click
    if (id == IDC_PROJECT_LISTBOX && notifyCode == LBN_DBLCLK) {
        int selectedIndex = SendMessage(m_projectListBox, LB_GETCURSEL, 0, 0);
        if (selectedIndex != LB_ERR && selectedIndex < (int)m_recentProjects.size()) {
            openRecentProject(selectedIndex);
        }
        return;
    }
    
    // File Menu
    switch (id) {
        case IDM_FILE_OPEN_PROJECT:
            openExistingProject();
            break;
        case IDM_FILE_NEW_PROJECT:
            createNewProject();
            break;
        case IDM_FILE_OPEN_FOLDER:
            openFolder();
            break;
        case IDM_FILE_OPEN_FILES:
            openFile();
            break;
        case IDM_FILE_RECENT_1:
        case IDM_FILE_RECENT_2:
        case IDM_FILE_RECENT_3:
        case IDM_FILE_RECENT_4:
        case IDM_FILE_RECENT_5:
            openRecentProject(id - IDM_FILE_RECENT_1);
            break;
        case IDM_FILE_EXIT:
            closeDialog();
            break;
            
        // Edit Menu
        case IDM_EDIT_REMOVE_RECENT:
            removeFromRecent();
            break;
        case IDM_EDIT_CLEAR_RECENT:
            clearRecentProjects();
            break;
            
        // View Menu
        case IDM_VIEW_PREVIEW:
            togglePreviewPanel();
            break;
        case IDM_VIEW_REFRESH:
            refreshView();
            break;
            
        // Tools Menu
        case IDM_TOOLS_SETTINGS:
            showSettings();
            break;
        case IDM_TOOLS_LOCATION:
            openProjectLocation();
            break;
            
        // Help Menu
        case IDM_HELP_DOCS:
            showHelp();
            break;
        case IDM_HELP_SHORTCUTS:
            showKeyboardShortcuts();
            break;
        case IDM_HELP_ABOUT:
            showAbout();
            break;
    }
}

void ProjectManager::onDestroy() {
    PostQuitMessage(0);
}

void ProjectManager::openExistingProject() {
    std::string folder = browseForFolder();
    if (!folder.empty()) {
        m_selectedProject.path = folder;
        m_selectedProject.name = fs::path(folder).filename().string();
        m_selectedProject.isNew = false;
        
        addRecentProject(m_selectedProject);
        saveRecentProjects();
        
        DestroyWindow(m_hwnd);
    }
}

void ProjectManager::createNewProject() {
    std::string folder = browseForFolder();
    if (!folder.empty()) {
        m_selectedProject.path = folder;
        m_selectedProject.name = fs::path(folder).filename().string();
        m_selectedProject.isNew = true;
        
        // Create project structure
        try {
            fs::create_directories(folder + "/src");
            fs::create_directories(folder + "/assets");
            fs::create_directories(folder + "/build");
            
            // Create basic Makefile
            std::ofstream makefile(folder + "/Makefile");
            makefile << "# Enchantment Engine Project Makefile\n";
            makefile << "PROJECT_NAME = " << m_selectedProject.name << "\n\n";
            makefile << "include $(GBDK_HOME)/Makefile.common\n";
            makefile.close();
            
            addRecentProject(m_selectedProject);
            saveRecentProjects();
            
            DestroyWindow(m_hwnd);
            
        } catch (const std::exception& e) {
            MessageBoxA(m_hwnd, 
                ("Failed to create project: " + std::string(e.what())).c_str(),
                "Error", MB_OK | MB_ICONERROR);
        }
    }
}

void ProjectManager::openFolder() {
    std::string folder = browseForFolder();
    if (!folder.empty()) {
        m_selectedProject.path = folder;
        m_selectedProject.name = fs::path(folder).filename().string();
        m_selectedProject.isNew = false;
        
        addRecentProject(m_selectedProject);
        saveRecentProjects();
        
        DestroyWindow(m_hwnd);
    }
}

void ProjectManager::openFile() {
    auto files = browseForFiles();
    if (!files.empty()) {
        // Use the directory of the first file as the project path
        m_selectedProject.path = fs::path(files[0]).parent_path().string();
        m_selectedProject.name = fs::path(m_selectedProject.path).filename().string();
        m_selectedProject.isNew = false;
        m_selectedProject.selectedFiles = files;  // Store selected files
        
        addRecentProject(m_selectedProject);
        saveRecentProjects();
        
        DestroyWindow(m_hwnd);
    }
}

std::vector<std::string> ProjectManager::browseForFiles() {
    std::vector<std::string> files;
    
    char fileNames[4096] = {0};
    
    OPENFILENAMEA ofn = {};
    ofn.lStructSize = sizeof(ofn);
    ofn.hwndOwner = m_hwnd;
    ofn.lpstrFile = fileNames;
    ofn.nMaxFile = sizeof(fileNames);
    ofn.lpstrFilter = "All Files (*.*)\0*.*\0"
                      "C Files (*.c)\0*.c\0"
                      "Header Files (*.h)\0*.h\0"
                      "C++ Files (*.cpp)\0*.cpp\0"
                      "JavaScript Files (*.js)\0*.js\0";
    ofn.nFilterIndex = 1;
    ofn.lpstrTitle = "Select File(s) to Open";
    ofn.Flags = OFN_PATHMUSTEXIST | OFN_FILEMUSTEXIST | OFN_ALLOWMULTISELECT | OFN_EXPLORER;
    
    if (GetOpenFileNameA(&ofn)) {
        // Parse multiple file selection
        char* p = fileNames;
        std::string directory = p;
        p += strlen(p) + 1;
        
        if (*p == '\0') {
            // Single file selected
            files.push_back(directory);
        } else {
            // Multiple files selected
            while (*p) {
                std::string fileName = p;
                files.push_back(directory + "\\" + fileName);
                p += strlen(p) + 1;
            }
        }
    }
    
    return files;
}

std::string ProjectManager::browseForFolder() {
    BROWSEINFOA bi = {};
    bi.hwndOwner = m_hwnd;
    bi.lpszTitle = "Select Project Folder";
    bi.ulFlags = BIF_RETURNONLYFSDIRS | BIF_NEWDIALOGSTYLE;
    
    LPITEMIDLIST pidl = SHBrowseForFolderA(&bi);
    if (pidl) {
        char path[MAX_PATH];
        if (SHGetPathFromIDListA(pidl, path)) {
            CoTaskMemFree(pidl);
            return std::string(path);
        }
        CoTaskMemFree(pidl);
    }
    
    return "";
}

void ProjectManager::openRecentProject(int index) {
    if (index >= 0 && index < (int)m_recentProjects.size()) {
        m_selectedProject = m_recentProjects[index];
        
        // Check if project still exists
        if (fs::exists(m_selectedProject.path)) {
            DestroyWindow(m_hwnd);
        } else {
            MessageBoxA(m_hwnd, 
                "Project folder no longer exists.",
                "Error", MB_OK | MB_ICONWARNING);
        }
    }
}

void ProjectManager::loadRecentProjects() {
    std::ifstream file("enchantment_recent.txt");
    if (file.is_open()) {
        std::string line;
        while (std::getline(file, line) && m_recentProjects.size() < 5) {
            if (!line.empty()) {
                ProjectInfo info;
                info.path = line;
                info.name = fs::path(line).filename().string();
                info.isNew = false;
                
                // Only add if it still exists
                if (fs::exists(line)) {
                    m_recentProjects.push_back(info);
                }
            }
        }
    }
}

void ProjectManager::saveRecentProjects() {
    std::ofstream file("enchantment_recent.txt");
    for (const auto& project : m_recentProjects) {
        file << project.path << "\n";
    }
}

void ProjectManager::addRecentProject(const ProjectInfo& project) {
    // Remove if already exists
    m_recentProjects.erase(
        std::remove_if(m_recentProjects.begin(), m_recentProjects.end(),
            [&](const ProjectInfo& p) { return p.path == project.path; }),
        m_recentProjects.end()
    );
    
    // Add to front
    m_recentProjects.insert(m_recentProjects.begin(), project);
    
    // Keep only 5 most recent
    if (m_recentProjects.size() > 5) {
        m_recentProjects.resize(5);
    }
}

void ProjectManager::showSettings() {
    MessageBoxA(m_hwnd,
        "Enchantment Engine Settings\n\n"
        "Configuration:\n"
        "• Recent projects: enchantment_recent.txt\n"
        "• Settings file: enchantment.conf\n"
        "• Default port: 8080\n"
        "• Project path: Current directory\n\n"
        "Command Line Options:\n"
        "  --port <port>       Server port\n"
        "  --project <path>    Project directory\n\n"
        "Keyboard Shortcuts:\n"
        "  Ctrl+O    Open Project\n"
        "  Ctrl+N    New Project\n"
        "  Ctrl+K    Open Folder\n"
        "  F5        Refresh\n"
        "  F1        Help",
        "Settings",
        MB_OK | MB_ICONINFORMATION);
}

void ProjectManager::closeDialog() {
    m_cancelled = true;
    DestroyWindow(m_hwnd);
}

void ProjectManager::removeFromRecent() {
    if (!m_projectListBox) return;
    
    int selectedIndex = SendMessage(m_projectListBox, LB_GETCURSEL, 0, 0);
    if (selectedIndex == LB_ERR || selectedIndex >= (int)m_recentProjects.size()) {
        MessageBoxA(m_hwnd, "Please select a project to remove.", "Remove from Recent", MB_OK | MB_ICONINFORMATION);
        return;
    }
    
    std::string projectName = m_recentProjects[selectedIndex].name;
    int result = MessageBoxA(m_hwnd, 
        ("Remove '" + projectName + "' from recent projects?").c_str(),
        "Confirm Removal", MB_YESNO | MB_ICONQUESTION);
    
    if (result == IDYES) {
        m_recentProjects.erase(m_recentProjects.begin() + selectedIndex);
        saveRecentProjects();
        refreshProjectList();
        
        if (m_statusBar) {
            SetWindowTextA(m_statusBar, "Project removed from recent list");
        }
    }
}

void ProjectManager::clearRecentProjects() {
    if (m_recentProjects.empty()) {
        MessageBoxA(m_hwnd, "Recent projects list is already empty.", "Clear Recent", MB_OK | MB_ICONINFORMATION);
        return;
    }
    
    int result = MessageBoxA(m_hwnd,
        "Clear all recent projects?\n\nThis cannot be undone.",
        "Confirm Clear", MB_YESNO | MB_ICONWARNING);
    
    if (result == IDYES) {
        m_recentProjects.clear();
        saveRecentProjects();
        refreshProjectList();
        
        if (m_statusBar) {
            SetWindowTextA(m_statusBar, "Recent projects cleared");
        }
    }
}

void ProjectManager::togglePreviewPanel() {
    if (!m_previewPanel) return;
    
    BOOL isVisible = IsWindowVisible(m_previewPanel);
    ShowWindow(m_previewPanel, isVisible ? SW_HIDE : SW_SHOW);
    
    // Update menu checkmark
    HMENU menu = GetMenu(m_hwnd);
    if (menu) {
        HMENU viewMenu = GetSubMenu(menu, 2);  // View menu is 3rd (index 2)
        if (viewMenu) {
            CheckMenuItem(viewMenu, IDM_VIEW_PREVIEW, 
                isVisible ? MF_UNCHECKED : MF_CHECKED);
        }
    }
    
    if (m_statusBar) {
        SetWindowTextA(m_statusBar, isVisible ? "Preview panel hidden" : "Preview panel shown");
    }
}

void ProjectManager::refreshView() {
    loadRecentProjects();
    refreshProjectList();
    updatePreview();
    
    if (m_statusBar) {
        SetWindowTextA(m_statusBar, "View refreshed");
    }
}

void ProjectManager::openProjectLocation() {
    if (!m_projectListBox) return;
    
    int selectedIndex = SendMessage(m_projectListBox, LB_GETCURSEL, 0, 0);
    if (selectedIndex == LB_ERR || selectedIndex >= (int)m_recentProjects.size()) {
        MessageBoxA(m_hwnd, "Please select a project first.", "Open Location", MB_OK | MB_ICONINFORMATION);
        return;
    }
    
    const auto& project = m_recentProjects[selectedIndex];
    if (fs::exists(project.path)) {
        std::string command = "explorer \"" + project.path + "\"";
        system(command.c_str());
    } else {
        MessageBoxA(m_hwnd, "Project folder no longer exists.", "Error", MB_OK | MB_ICONERROR);
    }
}

void ProjectManager::showHelp() {
    MessageBoxA(m_hwnd,
        "Enchantment Engine - Project Manager Help\n\n"
        "Getting Started:\n"
        "1. Open an existing project folder\n"
        "2. Create a new project with template structure\n"
        "3. Open any folder as a workspace\n"
        "4. Open specific files for editing\n\n"
        "Features:\n"
        "• Recent projects list with quick access\n"
        "• Project preview panel\n"
        "• Multi-file selection support\n"
        "• Keyboard shortcuts for common actions\n\n"
        "For more information, visit:\n"
        "https://github.com/ArkansasIo/RPG1test",
        "Help",
        MB_OK | MB_ICONINFORMATION);
}

void ProjectManager::showKeyboardShortcuts() {
    MessageBoxA(m_hwnd,
        "Keyboard Shortcuts\n\n"
        "File Operations:\n"
        "  Ctrl+O          Open Project\n"
        "  Ctrl+N          New Project\n"
        "  Ctrl+K          Open Folder\n"
        "  Ctrl+Shift+O    Open Files\n\n"
        "View:\n"
        "  F5              Refresh\n"
        "  Ctrl+P          Toggle Preview\n\n"
        "Navigation:\n"
        "  Up/Down         Navigate projects\n"
        "  Enter           Open selected project\n"
        "  Delete          Remove from recent\n\n"
        "General:\n"
        "  F1              Help\n"
        "  Alt+F4          Exit\n"
        "  Esc             Cancel",
        "Keyboard Shortcuts",
        MB_OK | MB_ICONINFORMATION);
}

void ProjectManager::showAbout() {
    MessageBoxA(m_hwnd,
        "🐉 Enchantment Engine\n"
        "Game Boy Color Development Suite\n\n"
        "Version: 3.0.0\n"
        "Release: March 1, 2026\n\n"
        "Features:\n"
        "• Desktop application with integrated IDE\n"
        "• C++ backend server with REST API\n"
        "• Web-based code editor and tools\n"
        "• Built-in Game Boy Color emulator\n"
        "• Complete asset processing pipeline\n"
        "• GBDK-2020 integration\n\n"
        "Example Game:\n"
        "Labyrinth of the Dragon - Complete RPG\n\n"
        "GitHub: ArkansasIo/RPG1test\n"
        "License: See LICENSE file\n\n"
        "© 2026 Enchantment Engine Team",
        "About Enchantment Engine",
        MB_OK | MB_ICONINFORMATION);
}

#endif // _WIN32
