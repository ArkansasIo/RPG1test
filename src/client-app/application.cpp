/**
 * Enchantment Game Engine - Application Implementation
 */

#include "application.hpp"
#include <iostream>
#include <fstream>
#include <thread>
#include <chrono>
#include <filesystem>

#ifdef _WIN32
    #include <windows.h>
#else
    #include <unistd.h>
    #include <signal.h>
    #include <sys/wait.h>
#endif

namespace fs = std::filesystem;

EnchantmentApplication::EnchantmentApplication(int argc, char* argv[])
    : m_serverPort(8080)
    , m_projectPath(".")
    , m_serverRunning(false)
#ifdef _WIN32
    , m_serverProcess{}
#else
    , m_serverPid(-1)
#endif
{
    parseCommandLine(argc, argv);
    loadConfiguration();
    
    m_apiClient = std::make_unique<ApiClient>(getServerUrl());
}

EnchantmentApplication::~EnchantmentApplication() {
    stopServer();
}

void EnchantmentApplication::parseCommandLine(int argc, char* argv[]) {
    for (int i = 1; i < argc; i++) {
        std::string arg = argv[i];
        if (arg == "--port" && i + 1 < argc) {
            m_serverPort = std::stoi(argv[++i]);
        } else if (arg == "--project" && i + 1 < argc) {
            m_projectPath = argv[++i];
        }
    }
}

void EnchantmentApplication::loadConfiguration() {
    // Load from config file if exists
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

void EnchantmentApplication::saveConfiguration() {
    std::ofstream config("enchantment.conf");
    config << "port=" << m_serverPort << "\n";
    config << "project=" << m_projectPath << "\n";
}

std::string EnchantmentApplication::getServerUrl() const {
    return "http://localhost:" + std::to_string(m_serverPort);
}

bool EnchantmentApplication::startServer() {
    std::cout << "Starting backend server on port " << m_serverPort << "..." << std::endl;

#ifdef _WIN32
    // Windows: Create process
    STARTUPINFOA si = {};
    si.cb = sizeof(si);
    si.dwFlags = STARTF_USESHOWWINDOW;
    si.wShowWindow = SW_HIDE; // Hide console window

    std::string serverPath = "src\\server\\build\\enchantment_server.exe";
    std::string cmdLine = serverPath + " --port " + std::to_string(m_serverPort) + 
                         " --project \"" + m_projectPath + "\"";

    char* cmdLineBuf = new char[cmdLine.length() + 1];
    strcpy(cmdLineBuf, cmdLine.c_str());

    BOOL success = CreateProcessA(
        NULL,
        cmdLineBuf,
        NULL,
        NULL,
        FALSE,
        CREATE_NO_WINDOW,
        NULL,
        NULL,
        &si,
        &m_serverProcess
    );

    delete[] cmdLineBuf;

    if (!success) {
        std::cerr << "Failed to start server process. Error: " << GetLastError() << std::endl;
        return false;
    }

    m_serverRunning = true;
    std::cout << "Server process started (PID: " << m_serverProcess.dwProcessId << ")" << std::endl;

#else
    // Unix: Fork and exec
    m_serverPid = fork();
    
    if (m_serverPid == -1) {
        std::cerr << "Failed to fork server process" << std::endl;
        return false;
    }
    
    if (m_serverPid == 0) {
        // Child process
        std::string serverPath = "./src/server/build/enchantment_server";
        std::string portArg = "--port";
        std::string portVal = std::to_string(m_serverPort);
        std::string projArg = "--project";
        
        char* args[] = {
            (char*)serverPath.c_str(),
            (char*)portArg.c_str(),
            (char*)portVal.c_str(),
            (char*)projArg.c_str(),
            (char*)m_projectPath.c_str(),
            NULL
        };
        
        execv(serverPath.c_str(), args);
        
        // If we get here, exec failed
        std::cerr << "Failed to exec server" << std::endl;
        exit(1);
    }
    
    m_serverRunning = true;
    std::cout << "Server process started (PID: " << m_serverPid << ")" << std::endl;
#endif

    return true;
}

bool EnchantmentApplication::stopServer() {
    if (!m_serverRunning) {
        return true;
    }

    std::cout << "Stopping backend server..." << std::endl;

#ifdef _WIN32
    if (m_serverProcess.hProcess) {
        TerminateProcess(m_serverProcess.hProcess, 0);
        WaitForSingleObject(m_serverProcess.hProcess, 5000);
        CloseHandle(m_serverProcess.hProcess);
        CloseHandle(m_serverProcess.hThread);
        m_serverProcess = {};
    }
#else
    if (m_serverPid > 0) {
        kill(m_serverPid, SIGTERM);
        int status;
        waitpid(m_serverPid, &status, 0);
        m_serverPid = -1;
    }
#endif

    m_serverRunning = false;
    std::cout << "Server stopped" << std::endl;
    return true;
}

bool EnchantmentApplication::waitForServer(int timeoutMs) {
    std::cout << "Waiting for server to be ready..." << std::endl;
    
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

bool EnchantmentApplication::checkServerHealth() {
    try {
        // Try to connect to server
        auto response = m_apiClient->get("/");
        return response.statusCode == 200;
    } catch (...) {
        return false;
    }
}

bool EnchantmentApplication::initializeUI() {
    std::cout << "Initializing user interface..." << std::endl;
    
    m_browserWindow = std::make_unique<BrowserWindow>(
        "Enchantment Game Engine",
        1280,
        800,
        getServerUrl()
    );
    
    return m_browserWindow->initialize();
}

int EnchantmentApplication::run() {
    std::cout << "Running application..." << std::endl;
    std::cout << "IDE URL: " << getServerUrl() << std::endl;
    
    return m_browserWindow->run();
}
