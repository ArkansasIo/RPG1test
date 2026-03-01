/**
 * Enchantment Game Engine - Project Manager
 * File and folder selection dialog before opening editor
 */

#pragma once

#include <string>
#include <vector>

#ifdef _WIN32
    #include <windows.h>
#endif

struct ProjectInfo {
    std::string path;
    std::string name;
    bool isNew;
    std::vector<std::string> selectedFiles;  // Files to open in editor
};

class ProjectManager {
public:
    ProjectManager();
    ~ProjectManager();

    // Show project selection dialog
    bool showDialog();
    
    // Get selected project
    ProjectInfo getSelectedProject() const { return m_selectedProject; }
    
    // Check if user cancelled
    bool wasCancelled() const { return m_cancelled; }

private:
    ProjectInfo m_selectedProject;
    bool m_cancelled;
    
#ifdef _WIN32
    HWND m_hwnd;
    HMENU m_menuBar;
    HFONT m_font;
    HFONT m_titleFont;
    HFONT m_boldFont;
    
    // UI Controls
    HWND m_projectListBox;
    HWND m_statusBar;
    HWND m_previewPanel;
    
    // Recent projects
    std::vector<ProjectInfo> m_recentProjects;
    
    // Window procedure
    static LRESULT CALLBACK WindowProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam);
    
    // Event handlers
    void onCreate();
    void onPaint();
    void onCommand(WPARAM wParam);
    void onDestroy();
    void onSize(int width, int height);
    void onListBoxSelection();
    
    // UI helpers
    void createMenuBar();
    void createControls();
    void createStatusBar();
    void updateLayout(int width, int height);
    void updatePreview();
    void loadRecentProjects();
    void saveRecentProjects();
    void addRecentProject(const ProjectInfo& project);
    void refreshProjectList();
    
    // Menu Actions - File Menu
    void openExistingProject();
    void createNewProject();
    void openFolder();
    void openFile();
    void openRecentProject(int index);
    void closeDialog();
    
    // Menu Actions - Edit Menu
    void removeFromRecent();
    void clearRecentProjects();
    
    // Menu Actions - View Menu
    void togglePreviewPanel();
    void refreshView();
    
    // Menu Actions - Tools Menu
    void showSettings();
    void showAbout();
    void openProjectLocation();
    
    // Menu Actions - Help Menu
    void showHelp();
    void showKeyboardShortcuts();
    
    // File dialogs
    std::string browseForFolder();
    std::string browseForProjectFile();
    std::vector<std::string> browseForFiles();
#endif
};
