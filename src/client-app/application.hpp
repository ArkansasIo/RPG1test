/**
 * Enchantment Game Engine - Application Class
 * Main application controller
 */

#ifndef ENCHANTMENT_APPLICATION_HPP
#define ENCHANTMENT_APPLICATION_HPP

#include "api_client.hpp"
#include "browser_window.hpp"
#include <string>
#include <memory>

#ifdef _WIN32
    #include <windows.h>
#endif

/**
 * Main application class
 */
class EnchantmentApplication {
public:
    EnchantmentApplication(int argc, char* argv[]);
    ~EnchantmentApplication();

    // Server management
    bool startServer();
    bool stopServer();
    bool waitForServer(int timeoutMs);
    bool isServerRunning() const { return m_serverRunning; }

    // UI management
    bool initializeUI();
    int run();

    // Configuration
    int getServerPort() const { return m_serverPort; }
    std::string getServerUrl() const;
    std::string getProjectPath() const { return m_projectPath; }

private:
    void parseCommandLine(int argc, char* argv[]);
    void loadConfiguration();
    void saveConfiguration();
    bool checkServerHealth();

    int m_serverPort;
    std::string m_projectPath;
    bool m_serverRunning;
    
#ifdef _WIN32
    PROCESS_INFORMATION m_serverProcess;
#else
    pid_t m_serverPid;
#endif

    std::unique_ptr<ApiClient> m_apiClient;
    std::unique_ptr<BrowserWindow> m_browserWindow;
};

#endif // ENCHANTMENT_APPLICATION_HPP
