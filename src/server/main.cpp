/**
 * Enchantment Game Engine - Server
 * Main entry point for the C++ backend server
 */

#include "server.hpp"
#include "file_manager.hpp"
#include "build_system.hpp"
#include "asset_processor.hpp"
#include <iostream>
#include <csignal>

static EnchantmentServer* g_server = nullptr;

void signalHandler(int signum) {
    std::cout << "\nInterrupt signal (" << signum << ") received.\n";
    if (g_server) {
        g_server->stop();
    }
    exit(signum);
}

int main(int argc, char* argv[]) {
    std::cout << "===========================================\n";
    std::cout << "  Enchantment Game Engine Server v3.0.0\n";
    std::cout << "  Game Boy Color RPG Development Suite\n";
    std::cout << "===========================================\n\n";

    // Parse command line arguments
    int port = 8080;
    std::string projectPath = ".";
    
    for (int i = 1; i < argc; i++) {
        std::string arg = argv[i];
        if (arg == "--port" && i + 1 < argc) {
            port = std::stoi(argv[++i]);
        } else if (arg == "--project" && i + 1 < argc) {
            projectPath = argv[++i];
        } else if (arg == "--help") {
            std::cout << "Usage: " << argv[0] << " [options]\n";
            std::cout << "Options:\n";
            std::cout << "  --port <port>       Server port (default: 8080)\n";
            std::cout << "  --project <path>    Project directory (default: .)\n";
            std::cout << "  --help              Show this help message\n";
            return 0;
        }
    }

    // Register signal handlers
    signal(SIGINT, signalHandler);
    signal(SIGTERM, signalHandler);

    try {
        // Initialize server
        EnchantmentServer server(port, projectPath);
        g_server = &server;

        std::cout << "Server starting on port " << port << "...\n";
        std::cout << "Project directory: " << projectPath << "\n";
        std::cout << "Web interface: http://localhost:" << port << "\n\n";
        std::cout << "Press Ctrl+C to stop the server.\n\n";

        // Start server
        server.start();

    } catch (const std::exception& e) {
        std::cerr << "Fatal error: " << e.what() << std::endl;
        return 1;
    }

    return 0;
}
