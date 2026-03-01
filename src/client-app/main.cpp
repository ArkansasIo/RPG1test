/**
 * Enchantment Game Engine - Desktop Client
 * Main entry point with splash screen and server launcher
 */

#include "application.hpp"
#include "splash_screen.hpp"
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

        // Initialize application
        splash.setStatus("Loading configuration...");
        EnchantmentApplication app(argc, argv);
        std::this_thread::sleep_for(std::chrono::milliseconds(300));

        // Start backend server
        splash.setStatus("Starting backend server...");
        if (!app.startServer()) {
            splash.hide();
            std::cerr << "Failed to start backend server!" << std::endl;
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
