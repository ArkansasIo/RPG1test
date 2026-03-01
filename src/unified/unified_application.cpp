/**
 * Enchantment Game Engine - Unified Application Implementation
 */

#include "unified_application.hpp"
#include "../server/server.hpp"
#include "../client-app/api_client.hpp"
#include "../client-app/browser_window.hpp"
#include <iostream>
#include <fstream>
#include <thread>
#include <chrono>

UnifiedApplication::UnifiedApplication(int argc, char* argv[], const std::string& projectPath)
    : m_serverPort(8080)
    , m_projectPath(projectPath)
    , m_serverRunning(false)
{
    parseCommandLine(argc, argv);
    loadConfiguration();
}

UnifiedApplication::~UnifiedApplication() {
    stopServer();
}

void UnifiedApplication::parseCommandLine(int argc, char* argv[]) {
    for (int i = 1; i < argc; i++) {
        std::string arg = argv[i];
        if (arg == "--port" && i + 1 < argc) {
            m_serverPort = std::stoi(argv[++i]);
        } else if (arg == "--project" && i + 1 < argc) {
            m_projectPath = argv[++i];
        } else if (arg == "--help") {
            std::cout << "Enchantment Game Engine - Unified Application\n";
            std::cout << "Usage: " << argv[0] << " [options]\n";
            std::cout << "Options:\n";
            std::cout << "  --port <port>       Server port (default: 8080)\n";
            std::cout << "  --project <path>    Project directory (default: .)\n";
            std::cout << "  --help              Show this help message\n";
            exit(0);
        }
    }
}

void UnifiedApplication::loadConfiguration() {
    std::ifstream config("enchantment.conf");
    if (config.is_open()) {
        std::string line;
        while (std::getline(config, line)) {
            if (line.find("port=") == 0) {
                m_serverPort = std::stoi(line.substr(5));
            } else if (line.find("project=") == 0) {
                m_projectPath = line.substr(8);
            }
        }
    }
}

void UnifiedApplication::saveConfiguration() {
    std::ofstream config("enchantment.conf");
    config << "port=" << m_serverPort << "\n";
    config << "project=" << m_projectPath << "\n";
}

std::string UnifiedApplication::getServerUrl() const {
    return "http://localhost:" + std::to_string(m_serverPort);
}

bool UnifiedApplication::startServer() {
    std::cout << "Starting integrated server on port " << m_serverPort << "..." << std::endl;

    try {
        m_server = std::make_unique<EnchantmentServer>(m_serverPort, m_projectPath);
        m_serverRunning = true;
        
        // Start server in background thread
        m_serverThread = std::make_unique<std::thread>([this]() {
            serverThread();
        });
        
        std::cout << "Server thread started" << std::endl;
        return true;
        
    } catch (const std::exception& e) {
        std::cerr << "Failed to start server: " << e.what() << std::endl;
        return false;
    }
}

void UnifiedApplication::serverThread() {
    try {
        std::cout << "Server listening on port " << m_serverPort << std::endl;
        std::cout << "Project directory: " << m_projectPath << std::endl;
        std::cout << "Web interface: " << getServerUrl() << std::endl;
        
        m_server->start();
        
    } catch (const std::exception& e) {
        std::cerr << "Server error: " << e.what() << std::endl;
        m_serverRunning = false;
    }
}

bool UnifiedApplication::stopServer() {
    if (!m_serverRunning) {
        return true;
    }

    std::cout << "Stopping integrated server..." << std::endl;
    
    if (m_server) {
        m_server->stop();
    }
    
    m_serverRunning = false;
    
    if (m_serverThread && m_serverThread->joinable()) {
        m_serverThread->join();
    }
    
    std::cout << "Server stopped" << std::endl;
    return true;
}

bool UnifiedApplication::waitForServer(int timeoutMs) {
    std::cout << "Waiting for server to be ready..." << std::endl;
    
    // Initialize API client
    m_apiClient = std::make_unique<ApiClient>(getServerUrl());
    
    auto startTime = std::chrono::steady_clock::now();
    
    while (true) {
        auto elapsed = std::chrono::duration_cast<std::chrono::milliseconds>(
            std::chrono::steady_clock::now() - startTime
        ).count();
        
        if (elapsed > timeoutMs) {
            std::cerr << "Server startup timeout" << std::endl;
            return false;
        }
        
        if (checkServerHealth()) {
            std::cout << "Server is ready!" << std::endl;
            return true;
        }
        
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }
}

bool UnifiedApplication::checkServerHealth() {
    try {
        auto response = m_apiClient->get("/");
        return response.statusCode == 200;
    } catch (...) {
        return false;
    }
}

bool UnifiedApplication::initializeUI() {
    std::cout << "Initializing user interface..." << std::endl;
    
    m_browserWindow = std::make_unique<BrowserWindow>(
        "Enchantment Game Engine",
        1280,
        800,
        getServerUrl()
    );
    
    return m_browserWindow->initialize();
}

int UnifiedApplication::run() {
    std::cout << "Running application..." << std::endl;
    std::cout << "IDE URL: " << getServerUrl() << std::endl;
    
    int result = m_browserWindow->run();
    
    // Cleanup
    stopServer();
    
    return result;
}
