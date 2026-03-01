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
#define IDC_BTN_OPEN_EXISTING   1001
#define IDC_BTN_CREATE_NEW      1002
#define IDC_BTN_OPEN_FOLDER     1003
#define IDC_BTN_OPEN_FILE       1004
#define IDC_BTN_RECENT_1        1010
#define IDC_BTN_RECENT_2        1011
#define IDC_BTN_RECENT_3        1012
#define IDC_BTN_RECENT_4        1013
#define IDC_BTN_RECENT_5        1014
#define IDC_BTN_CONTINUE        1020
#define IDC_BTN_CANCEL          1021
#define IDC_BTN_SETTINGS        1022

ProjectManager::ProjectManager()
    : m_cancelled(false)
#ifdef _WIN32
    , m_hwnd(nullptr)
    , m_font(nullptr)
    , m_titleFont(nullptr)
#endif
{
    loadRecentProjects();
}

ProjectManager::~ProjectManager() {
#ifdef _WIN32
    if (m_font) DeleteObject(m_font);
    if (m_titleFont) DeleteObject(m_titleFont);
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
    wc.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
    
    RegisterClassA(&wc);
    
    // Create window
    int width = 600;
    int height = 500;
    int screenWidth = GetSystemMetrics(SM_CXSCREEN);
    int screenHeight = GetSystemMetrics(SM_CYSCREEN);
    int x = (screenWidth - width) / 2;
    int y = (screenHeight - height) / 2;
    
    m_hwnd = CreateWindowExA(
        WS_EX_DLGMODALFRAME | WS_EX_TOPMOST,
        "EnchantmentProjectManager",
        "Enchantment Engine - Project Manager",
        WS_POPUP | WS_CAPTION | WS_SYSMENU,
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
            case WM_DESTROY:
                manager->onDestroy();
                return 0;
        }
    }
    
    return DefWindowProc(hwnd, msg, wParam, lParam);
}

void ProjectManager::onCreate() {
    createControls();
}

void ProjectManager::createControls() {
    HINSTANCE hInstance = GetModuleHandle(NULL);
    
    // Title label
    HWND titleLabel = CreateWindowA("STATIC", "Select or Create a Project",
        WS_CHILD | WS_VISIBLE | SS_CENTER,
        20, 20, 560, 40,
        m_hwnd, NULL, hInstance, NULL);
    SendMessage(titleLabel, WM_SETFONT, (WPARAM)m_titleFont, TRUE);
    
    // Description
    HWND descLabel = CreateWindowA("STATIC", 
        "Choose an existing project folder or create a new one to get started.",
        WS_CHILD | WS_VISIBLE | SS_CENTER,
        20, 70, 560, 30,
        m_hwnd, NULL, hInstance, NULL);
    SendMessage(descLabel, WM_SETFONT, (WPARAM)m_font, TRUE);
    
    // Open existing project button
    HWND btnOpen = CreateWindowA("BUTTON", "📁 Open Existing Project",
        WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
        50, 120, 240, 40,
        m_hwnd, (HMENU)IDC_BTN_OPEN_EXISTING, hInstance, NULL);
    SendMessage(btnOpen, WM_SETFONT, (WPARAM)m_font, TRUE);
    
    // Create new project button
    HWND btnNew = CreateWindowA("BUTTON", "✨ Create New Project",
        WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
        310, 120, 240, 40,
        m_hwnd, (HMENU)IDC_BTN_CREATE_NEW, hInstance, NULL);
    SendMessage(btnNew, WM_SETFONT, (WPARAM)m_font, TRUE);
    
    // Open folder button
    HWND btnFolder = CreateWindowA("BUTTON", "📂 Open Folder",
        WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
        50, 170, 240, 40,
        m_hwnd, (HMENU)IDC_BTN_OPEN_FOLDER, hInstance, NULL);
    SendMessage(btnFolder, WM_SETFONT, (WPARAM)m_font, TRUE);
    
    // Open file button
    HWND btnFile = CreateWindowA("BUTTON", "📄 Open File(s)",
        WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
        310, 170, 240, 40,
        m_hwnd, (HMENU)IDC_BTN_OPEN_FILE, hInstance, NULL);
    SendMessage(btnFile, WM_SETFONT, (WPARAM)m_font, TRUE);
    
    // Recent projects section
    if (!m_recentProjects.empty()) {
        HWND recentLabel = CreateWindowA("STATIC", "Recent Projects:",
            WS_CHILD | WS_VISIBLE | SS_LEFT,
            50, 230, 500, 25,
            m_hwnd, NULL, hInstance, NULL);
        SendMessage(recentLabel, WM_SETFONT, (WPARAM)m_font, TRUE);
        
        int yPos = 260;
        for (size_t i = 0; i < m_recentProjects.size() && i < 5; i++) {
            std::string btnText = "📂 " + m_recentProjects[i].name;
            HWND btnRecent = CreateWindowA("BUTTON", btnText.c_str(),
                WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON | BS_LEFT,
                50, yPos, 500, 30,
                m_hwnd, (HMENU)(IDC_BTN_RECENT_1 + i), hInstance, NULL);
            SendMessage(btnRecent, WM_SETFONT, (WPARAM)m_font, TRUE);
            yPos += 35;
        }
    }
    
    // Settings button
    HWND btnSettings = CreateWindowA("BUTTON", "⚙️ Settings",
        WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
        20, 430, 100, 35,
        m_hwnd, (HMENU)IDC_BTN_SETTINGS, hInstance, NULL);
    SendMessage(btnSettings, WM_SETFONT, (WPARAM)m_font, TRUE);
    
    // Cancel button
    HWND btnCancel = CreateWindowA("BUTTON", "Cancel",
        WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
        480, 430, 100, 35,
        m_hwnd, (HMENU)IDC_BTN_CANCEL, hInstance, NULL);
    SendMessage(btnCancel, WM_SETFONT, (WPARAM)m_font, TRUE);
}

void ProjectManager::onPaint() {
    PAINTSTRUCT ps;
    HDC hdc = BeginPaint(m_hwnd, &ps);
    
    // Draw background gradient
    RECT rect;
    GetClientRect(m_hwnd, &rect);
    
    TRIVERTEX vertices[2] = {
        {0, 0, 0xF000, 0xF800, 0xFF00, 0xFF00},
        {rect.right, rect.bottom, 0xE000, 0xE800, 0xF000, 0xFF00}
    };
    
    GRADIENT_RECT gradRect = {0, 1};
    GradientFill(hdc, vertices, 2, &gradRect, 1, GRADIENT_FILL_RECT_V);
    
    EndPaint(m_hwnd, &ps);
}

void ProjectManager::onCommand(WPARAM wParam) {
    int id = LOWORD(wParam);
    
    switch (id) {
        case IDC_BTN_OPEN_EXISTING:
            openExistingProject();
            break;
        case IDC_BTN_CREATE_NEW:
            createNewProject();
            break;
        case IDC_BTN_OPEN_FOLDER:
            openFolder();
            break;
        case IDC_BTN_OPEN_FILE:
            openFile();
            break;
        case IDC_BTN_RECENT_1:
        case IDC_BTN_RECENT_2:
        case IDC_BTN_RECENT_3:
        case IDC_BTN_RECENT_4:
        case IDC_BTN_RECENT_5:
            openRecentProject(id - IDC_BTN_RECENT_1);
            break;
        case IDC_BTN_SETTINGS:
            showSettings();
            break;
        case IDC_BTN_CANCEL:
            m_cancelled = true;
            DestroyWindow(m_hwnd);
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

void ProjectManager::showSettings() {
    MessageBoxA(m_hwnd,
        "Settings:\n\n"
        "• Recent projects are stored in enchantment_recent.txt\n"
        "• Configuration is stored in enchantment.conf\n"
        "• Default port: 8080\n"
        "• Default project path: Current directory\n\n"
        "To change settings, edit enchantment.conf or use command line options:\n"
        "  --port <port>\n"
        "  --project <path>",
        "Enchantment Engine Settings",
        MB_OK | MB_ICONINFORMATION);
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

#endif // _WIN32
