/**
 * Enchantment Engine - Editor Main Entry Point
 */

#include "editor_window.hpp"
#include <iostream>

#ifdef _WIN32
#include <windows.h>

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
    // Parse command line
    std::string projectPath = ".";
    std::string serverUrl = "http://localhost:8080";
    
    int argc;
    LPWSTR* argv = CommandLineToArgvW(GetCommandLineW(), &argc);
    
    for (int i = 1; i < argc; i++) {
        std::wstring arg(argv[i]);
        if (arg == L"--project" && i + 1 < argc) {
            std::wstring wpath(argv[++i]);
            projectPath = std::string(wpath.begin(), wpath.end());
        } else if (arg == L"--server" && i + 1 < argc) {
            std::wstring wurl(argv[++i]);
            serverUrl = std::string(wurl.begin(), wurl.end());
        }
    }
    
    LocalFree(argv);
    
    // Create and run editor
    EditorWindow editor(projectPath, serverUrl);
    
    if (!editor.initialize()) {
        MessageBoxA(NULL, "Failed to initialize editor", "Error", MB_OK | MB_ICONERROR);
        return 1;
    }
    
    return editor.run();
}

#else

int main(int argc, char* argv[]) {
    std::string projectPath = ".";
    std::string serverUrl = "http://localhost:8080";
    
    for (int i = 1; i < argc; i++) {
        std::string arg = argv[i];
        if (arg == "--project" && i + 1 < argc) {
            projectPath = argv[++i];
        } else if (arg == "--server" && i + 1 < argc) {
            serverUrl = argv[++i];
        }
    }
    
    EditorWindow editor(projectPath, serverUrl);
    
    if (!editor.initialize()) {
        std::cerr << "Failed to initialize editor" << std::endl;
        return 1;
    }
    
    return editor.run();
}

#endif
