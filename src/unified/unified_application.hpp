/**
 * Enchantment Game Engine - Unified Application Header
 * Combines server and client functionality
 */

#pragma once

#include <string>
#include <memory>
#include <thread>
#include <atomic>

// Forward declarations
class EnchantmentServer;
class ApiClient;
class BrowserWindow;

class UnifiedApplication {
public:
    UnifiedApplication(int argc, char* argv[], const std::string& projectPath = ".");
    ~UnifiedApplication();

    bool startServer();
    bool stopServer();
    bool waitForServer(int timeoutMs);
    bool checkServerHealth();
    bool initializeUI();
    int run();

private:
    void parseCommandLine(int argc, char* argv[]);
    void loadConfiguration();
    void saveConfiguration();
    std::string getServerUrl() const;
    void serverThread();

    int m_serverPort;
    std::string m_projectPath;
    
    std::unique_ptr<EnchantmentServer> m_server;
    std::unique_ptr<ApiClient> m_apiClient;
    std::unique_ptr<BrowserWindow> m_browserWindow;
    
    std::unique_ptr<std::thread> m_serverThread;
    std::atomic<bool> m_serverRunning;
};
