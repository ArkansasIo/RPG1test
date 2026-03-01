/**
 * Enchantment Engine - Main Editor Window
 * Complete IDE with menus, tools, and game engine integration
 */

#pragma once

#include <string>
#include <vector>
#include <memory>

#ifdef _WIN32
    #include <windows.h>
    #include <commctrl.h>
#endif

// Forward declarations
class CodeEditor;
class AssetManager;
class BuildSystem;
class Debugger;
class ProjectExplorer;
class OutputConsole;
class PropertiesPanel;

struct EditorConfig {
    std::string projectPath;
    std::string serverUrl;
    int serverPort;
    bool darkMode;
    int fontSize;
    bool autoSave;
    bool showLineNumbers;
    bool wordWrap;
};

class EditorWindow {
public:
    EditorWindow(const std::string& projectPath, const std::string& serverUrl);
    ~EditorWindow();

    // Main functions
    bool initialize();
    int run();
    void shutdown();

private:
#ifdef _WIN32
    HWND m_hwnd;
    HWND m_statusBar;
    HWND m_toolbar;
    HWND m_tabControl;
    HMENU m_menuBar;
    HFONT m_font;
    
    // Editor components
    std::unique_ptr<CodeEditor> m_codeEditor;
    std::unique_ptr<AssetManager> m_assetManager;
    std::unique_ptr<BuildSystem> m_buildSystem;
    std::unique_ptr<Debugger> m_debugger;
    std::unique_ptr<ProjectExplorer> m_projectExplorer;
    std::unique_ptr<OutputConsole> m_outputConsole;
    std::unique_ptr<PropertiesPanel> m_propertiesPanel;
    
    EditorConfig m_config;
    std::vector<std::string> m_openFiles;
    int m_currentFileIndex;
    
    // Window procedure
    static LRESULT CALLBACK WindowProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam);
    
    // Event handlers
    void onCreate();
    void onPaint();
    void onCommand(WPARAM wParam);
    void onSize(int width, int height);
    void onDestroy();
    void onNotify(LPARAM lParam);
    
    // Menu creation
    void createMenuBar();
    void createFileMenu(HMENU parent);
    void createEditMenu(HMENU parent);
    void createViewMenu(HMENU parent);
    void createProjectMenu(HMENU parent);
    void createBuildMenu(HMENU parent);
    void createDebugMenu(HMENU parent);
    void createToolsMenu(HMENU parent);
    void createWindowMenu(HMENU parent);
    void createHelpMenu(HMENU parent);
    
    // UI creation
    void createToolbar();
    void createStatusBar();
    void createTabControl();
    void createPanels();
    void updateLayout(int width, int height);
    
    // File operations
    void newFile();
    void openFile();
    void saveFile();
    void saveFileAs();
    void saveAll();
    void closeFile();
    void closeAllFiles();
    void recentFile(int index);
    
    // Edit operations
    void undo();
    void redo();
    void cut();
    void copy();
    void paste();
    void selectAll();
    void find();
    void replace();
    void findInFiles();
    void goToLine();
    
    // View operations
    void toggleProjectExplorer();
    void toggleOutputConsole();
    void togglePropertiesPanel();
    void toggleToolbar();
    void toggleStatusBar();
    void zoomIn();
    void zoomOut();
    void resetZoom();
    
    // Project operations
    void newProject();
    void openProject();
    void closeProject();
    void projectSettings();
    void addNewItem();
    void addExistingItem();
    void showInExplorer();
    
    // Build operations
    void buildProject();
    void rebuildProject();
    void cleanProject();
    void buildAssets();
    void buildROM();
    void stopBuild();
    void buildConfiguration();
    
    // Debug operations
    void startDebugging();
    void startWithoutDebugging();
    void stopDebugging();
    void stepOver();
    void stepInto();
    void stepOut();
    void toggleBreakpoint();
    void clearAllBreakpoints();
    
    // Tools operations
    void tileEditor();
    void mapEditor();
    void spriteEditor();
    void stringEditor();
    void tableEditor();
    void paletteEditor();
    void soundEditor();
    void emulator();
    void assetBrowser();
    void options();
    
    // Window operations
    void newWindow();
    void splitHorizontal();
    void splitVertical();
    void closeAllTabs();
    void nextTab();
    void previousTab();
    
    // Help operations
    void viewHelp();
    void apiReference();
    void gbdkDocumentation();
    void keyboardShortcuts();
    void checkForUpdates();
    void about();
    
    // Utility functions
    void updateTitle();
    void updateStatusBar(const std::string& text);
    void loadConfig();
    void saveConfig();
    void addRecentFile(const std::string& path);
#endif
};
