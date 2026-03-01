/**
 * Enchantment Game Engine - Unified Application
 * Combined server and client in a single executable
 */

#include "unified_application.hpp"
#include "splash_screen.hpp"
#include "project_manager.hpp"
#include <iostream>
#include <thread>
#include <chrono>

#ifdef _WIN32
    #include <windows.h>
#endif

int main(int argc, char* argv[]) {
    try {
        // Show splash screen
        SplashScreen splash;
        splash.show();
        splash.setStatus("Initializing Enchantment Engine...");
        std::this_thread::sleep_for(std::chrono::milliseconds(500));

        splash.setStatus("Loading components...");
        std::this_thread::sleep_for(std::chrono::milliseconds(500));
        
        // Hide splash before showing project manager
        splash.hide();
        
        // Show project manager
        ProjectManager projectManager;
        if (!projectManager.showDialog()) {
            std::cout << "User cancelled project selection" << std::endl;
            return 0;
        }
        
        ProjectInfo project = projectManager.getSelectedProject();
        std::cout << "Selected project: " << project.name << std::endl;
        std::cout << "Project path: " << project.path << std::endl;
        
        // Show splash again for server startup
        splash.show();
        splash.setStatus("Loading project...");
        std::this_thread::sleep_for(std::chrono::milliseconds(300));

        // Initialize unified application with selected project
        splash.setStatus("Loading configuration...");
        UnifiedApplication app(argc, argv, project.path);
        std::this_thread::sleep_for(std::chrono::milliseconds(300));

        // Start integrated server
        splash.setStatus("Starting integrated server...");
        if (!app.startServer()) {
            splash.hide();
            std::cerr << "Failed to start integrated server!" << std::endl;
            return 1;
        }
        std::this_thread::sleep_for(std::chrono::milliseconds(500));

        // Wait for server to be ready
        splash.setStatus("Waiting for server...");
        if (!app.waitForServer(5000)) {
            splash.hide();
            std::cerr << "Server failed to start in time!" << std::endl;
            return 1;
        }
        std::this_thread::sleep_for(std::chrono::milliseconds(300));

        // Initialize UI
        splash.setStatus("Loading user interface...");
        if (!app.initializeUI()) {
            splash.hide();
            std::cerr << "Failed to initialize UI!" << std::endl;
            return 1;
        }
        std::this_thread::sleep_for(std::chrono::milliseconds(500));

        // Hide splash and show main window
        splash.setStatus("Ready!");
        std::this_thread::sleep_for(std::chrono::milliseconds(300));
        splash.hide();

        // Run application
        return app.run();

    } catch (const std::exception& e) {
        std::cerr << "Fatal error: " << e.what() << std::endl;
        return 1;
    }
}
