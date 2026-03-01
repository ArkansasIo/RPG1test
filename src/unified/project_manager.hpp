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
    HFONT m_font;
    HFONT m_titleFont;
    
    // Recent projects
    std::vector<ProjectInfo> m_recentProjects;
    
    // Window procedure
    static LRESULT CALLBACK WindowProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam);
    
    // Event handlers
    void onCreate();
    void onPaint();
    void onCommand(WPARAM wParam);
    void onDestroy();
    
    // UI helpers
    void createControls();
    void loadRecentProjects();
    void saveRecentProjects();
    void addRecentProject(const ProjectInfo& project);
    
    // Actions
    void openExistingProject();
    void createNewProject();
    void openFolder();
    void openFile();
    void openRecentProject(int index);
    void continueWithProject();
    void showSettings();
    
    // File dialogs
    std::string browseForFolder();
    std::string browseForProjectFile();
    std::vector<std::string> browseForFiles();
#endif
};
