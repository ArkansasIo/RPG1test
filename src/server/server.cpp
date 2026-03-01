/**
 * Enchantment Game Engine - HTTP Server Implementation
 */

#include "server.hpp"
#include "file_manager.hpp"
#include "build_system.hpp"
#include "asset_processor.hpp"
#include "json_utils.hpp"
#include <iostream>
#include <sstream>
#include <cstring>
#include <thread>
#include <iomanip>

#ifdef _WIN32
    #include <winsock2.h>
    #include <ws2tcpip.h>
    #pragma comment(lib, "ws2_32.lib")
    typedef int socklen_t;
#else
    #include <sys/socket.h>
    #include <netinet/in.h>
    #include <unistd.h>
    #include <arpa/inet.h>
    #define SOCKET int
    #define INVALID_SOCKET -1
    #define SOCKET_ERROR -1
    #define closesocket close
#endif

// HttpResponse methods
void HttpResponse::setJson(const std::string& json) {
    headers["Content-Type"] = "application/json";
    body = json;
    isBinary = false;
}

void HttpResponse::setHtml(const std::string& html) {
    headers["Content-Type"] = "text/html; charset=utf-8";
    body = html;
    isBinary = false;
}

void HttpResponse::setText(const std::string& text) {
    headers["Content-Type"] = "text/plain; charset=utf-8";
    body = text;
    isBinary = false;
}

void HttpResponse::setBinary(const std::vector<uint8_t>& data, const std::string& contentType) {
    headers["Content-Type"] = contentType;
    binaryData = data;
    isBinary = true;
}

void HttpResponse::setError(int code, const std::string& message) {
    statusCode = code;
    setJson("{\"error\":\"" + message + "\"}");
}

// EnchantmentServer implementation
EnchantmentServer::EnchantmentServer(int port, const std::string& projectPath)
    : m_port(port)
    , m_projectPath(projectPath)
    , m_serverSocket(INVALID_SOCKET)
    , m_running(false)
{
    m_fileManager = std::make_unique<FileManager>(projectPath);
    m_buildSystem = std::make_unique<BuildSystem>(projectPath);
    m_assetProcessor = std::make_unique<AssetProcessor>(projectPath);
    
    setupRoutes();
}

EnchantmentServer::~EnchantmentServer() {
    stop();
}

void EnchantmentServer::setupRoutes() {
    m_routes["GET /api/files"] = [this](const HttpRequest& req, HttpResponse& res) {
        handleListFiles(req, res);
    };
    
    m_routes["GET /api/file"] = [this](const HttpRequest& req, HttpResponse& res) {
        handleGetFile(req, res);
    };
    
    m_routes["POST /api/file"] = [this](const HttpRequest& req, HttpResponse& res) {
        handleSaveFile(req, res);
    };
    
    m_routes["POST /api/build/assets"] = [this](const HttpRequest& req, HttpResponse& res) {
        handleBuildAssets(req, res);
    };
    
    m_routes["POST /api/build/rom"] = [this](const HttpRequest& req, HttpResponse& res) {
        handleBuildRom(req, res);
    };
    
    m_routes["GET /api/rom"] = [this](const HttpRequest& req, HttpResponse& res) {
        handleGetRom(req, res);
    };
}

void EnchantmentServer::start() {
#ifdef _WIN32
    WSADATA wsaData;
    if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
        throw std::runtime_error("WSAStartup failed");
    }
#endif

    m_serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (m_serverSocket == INVALID_SOCKET) {
        throw std::runtime_error("Failed to create socket");
    }

    // Set socket options
    int opt = 1;
    setsockopt(m_serverSocket, SOL_SOCKET, SO_REUSEADDR, (char*)&opt, sizeof(opt));

    sockaddr_in serverAddr;
    memset(&serverAddr, 0, sizeof(serverAddr));
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = INADDR_ANY;
    serverAddr.sin_port = htons(m_port);

    if (bind(m_serverSocket, (sockaddr*)&serverAddr, sizeof(serverAddr)) == SOCKET_ERROR) {
        closesocket(m_serverSocket);
        throw std::runtime_error("Failed to bind socket");
    }

    if (listen(m_serverSocket, 10) == SOCKET_ERROR) {
        closesocket(m_serverSocket);
        throw std::runtime_error("Failed to listen on socket");
    }

    m_running = true;
    std::cout << "Server listening on port " << m_port << std::endl;

    while (m_running) {
        sockaddr_in clientAddr;
        socklen_t clientLen = sizeof(clientAddr);
        SOCKET clientSocket = accept(m_serverSocket, (sockaddr*)&clientAddr, &clientLen);
        
        if (clientSocket == INVALID_SOCKET) {
            if (m_running) {
                std::cerr << "Failed to accept connection" << std::endl;
            }
            continue;
        }

        // Handle request in a new thread
        std::thread([this, clientSocket]() {
            handleRequest(clientSocket);
        }).detach();
    }
}

void EnchantmentServer::stop() {
    m_running = false;
    if (m_serverSocket != INVALID_SOCKET) {
        closesocket(m_serverSocket);
        m_serverSocket = INVALID_SOCKET;
    }
#ifdef _WIN32
    WSACleanup();
#endif
}

void EnchantmentServer::handleRequest(int clientSocket) {
    char buffer[8192];
    int bytesRead = recv(clientSocket, buffer, sizeof(buffer) - 1, 0);
    
    if (bytesRead <= 0) {
        closesocket(clientSocket);
        return;
    }
    
    buffer[bytesRead] = '\0';
    std::string requestData(buffer);
    
    HttpRequest request = parseRequest(requestData);
    HttpResponse response;
    
    // Find and execute route handler
    std::string routeKey = request.method + " " + request.path;
    auto it = m_routes.find(routeKey);
    
    if (it != m_routes.end()) {
        try {
            it->second(request, response);
        } catch (const std::exception& e) {
            response.setError(500, e.what());
        }
    } else {
        // Try static file serving
        handleStaticFile(request, response);
    }
    
    // Send response
    std::string responseStr = buildResponse(response);
    send(clientSocket, responseStr.c_str(), responseStr.length(), 0);
    
    if (response.isBinary && !response.binaryData.empty()) {
        send(clientSocket, (char*)response.binaryData.data(), response.binaryData.size(), 0);
    }
    
    closesocket(clientSocket);
}

HttpRequest EnchantmentServer::parseRequest(const std::string& requestData) {
    HttpRequest request;
    std::istringstream stream(requestData);
    std::string line;
    
    // Parse request line
    if (std::getline(stream, line)) {
        std::istringstream lineStream(line);
        std::string path;
        lineStream >> request.method >> path;
        
        // Parse path and query params
        size_t queryPos = path.find('?');
        if (queryPos != std::string::npos) {
            request.path = path.substr(0, queryPos);
            std::string query = path.substr(queryPos + 1);
            
            // Parse query parameters
            size_t pos = 0;
            while (pos < query.length()) {
                size_t eqPos = query.find('=', pos);
                size_t ampPos = query.find('&', pos);
                if (ampPos == std::string::npos) ampPos = query.length();
                
                if (eqPos != std::string::npos && eqPos < ampPos) {
                    std::string key = query.substr(pos, eqPos - pos);
                    std::string value = query.substr(eqPos + 1, ampPos - eqPos - 1);
                    request.params[key] = value;
                }
                
                pos = ampPos + 1;
            }
        } else {
            request.path = path;
        }
    }
    
    // Parse headers
    while (std::getline(stream, line) && line != "\r") {
        size_t colonPos = line.find(':');
        if (colonPos != std::string::npos) {
            std::string key = line.substr(0, colonPos);
            std::string value = line.substr(colonPos + 2);
            if (!value.empty() && value.back() == '\r') {
                value.pop_back();
            }
            request.headers[key] = value;
        }
    }
    
    // Parse body
    std::string body;
    while (std::getline(stream, line)) {
        body += line + "\n";
    }
    request.body = body;
    
    return request;
}

std::string EnchantmentServer::buildResponse(const HttpResponse& response) {
    std::ostringstream stream;
    
    // Status line
    stream << "HTTP/1.1 " << response.statusCode << " ";
    switch (response.statusCode) {
        case 200: stream << "OK"; break;
        case 404: stream << "Not Found"; break;
        case 500: stream << "Internal Server Error"; break;
        default: stream << "Unknown";
    }
    stream << "\r\n";
    
    // Headers
    for (const auto& header : response.headers) {
        stream << header.first << ": " << header.second << "\r\n";
    }
    
    // Content-Length
    size_t contentLength = response.isBinary ? response.binaryData.size() : response.body.length();
    stream << "Content-Length: " << contentLength << "\r\n";
    stream << "Access-Control-Allow-Origin: *\r\n";
    stream << "\r\n";
    
    // Body (if not binary)
    if (!response.isBinary) {
        stream << response.body;
    }
    
    return stream.str();
}

void EnchantmentServer::handleGetFile(const HttpRequest& req, HttpResponse& res) {
    try {
        auto it = req.params.find("path");
        if (it == req.params.end()) {
            res.setError(400, "Missing path parameter");
            return;
        }
        
        std::string content = m_fileManager->readFile(it->second);
        res.setText(content);
        
    } catch (const std::exception& e) {
        res.setError(404, std::string("File not found: ") + e.what());
    }
}

void EnchantmentServer::handleSaveFile(const HttpRequest& req, HttpResponse& res) {
    try {
        // Parse JSON body
        auto data = JsonUtils::parseSimpleJson(req.body);
        
        auto pathIt = data.find("path");
        auto contentIt = data.find("content");
        
        if (pathIt == data.end() || contentIt == data.end()) {
            res.setError(400, "Missing path or content in request body");
            return;
        }
        
        m_fileManager->writeFile(pathIt->second, contentIt->second);
        res.setJson("{\"success\":true}");
        
    } catch (const std::exception& e) {
        res.setError(500, std::string("Failed to save file: ") + e.what());
    }
}

void EnchantmentServer::handleListFiles(const HttpRequest& req, HttpResponse& res) {
    try {
        std::string directory = "src";
        auto it = req.params.find("dir");
        if (it != req.params.end()) {
            directory = it->second;
        }
        
        auto files = m_fileManager->listFiles(directory);
        
        std::ostringstream json;
        json << "{\"files\":" << JsonUtils::createJsonArray(files) << "}";
        
        res.setJson(json.str());
        
    } catch (const std::exception& e) {
        res.setError(500, std::string("Failed to list files: ") + e.what());
    }
}

void EnchantmentServer::handleBuildAssets(const HttpRequest& req, HttpResponse& res) {
    try {
        std::string output = m_assetProcessor->processAssets();
        
        std::map<std::string, std::string> response;
        response["success"] = "true";
        response["output"] = output;
        
        res.setJson(JsonUtils::createJson(response));
        
    } catch (const std::exception& e) {
        res.setError(500, std::string("Asset build failed: ") + e.what());
    }
}

void EnchantmentServer::handleBuildRom(const HttpRequest& req, HttpResponse& res) {
    try {
        std::string output = m_buildSystem->buildRom();
        
        std::map<std::string, std::string> response;
        response["success"] = "true";
        response["output"] = output;
        
        res.setJson(JsonUtils::createJson(response));
        
    } catch (const std::exception& e) {
        res.setError(500, std::string("ROM build failed: ") + e.what());
    }
}

void EnchantmentServer::handleGetRom(const HttpRequest& req, HttpResponse& res) {
    auto romData = m_fileManager->readBinaryFile("LabyrinthOfTheDragon.gbc");
    res.setBinary(romData, "application/octet-stream");
}

void EnchantmentServer::handleStaticFile(const HttpRequest& req, HttpResponse& res) {
    std::string filePath = "src/client" + req.path;
    if (req.path == "/") {
        filePath = "src/client/index.html";
    }
    
    try {
        std::string content = m_fileManager->readFile(filePath);
        
        // Determine content type
        std::string contentType = "text/plain";
        if (filePath.ends_with(".html")) contentType = "text/html";
        else if (filePath.ends_with(".css")) contentType = "text/css";
        else if (filePath.ends_with(".js")) contentType = "application/javascript";
        else if (filePath.ends_with(".json")) contentType = "application/json";
        else if (filePath.ends_with(".png")) contentType = "image/png";
        else if (filePath.ends_with(".jpg") || filePath.ends_with(".jpeg")) contentType = "image/jpeg";
        
        res.headers["Content-Type"] = contentType;
        res.body = content;
    } catch (...) {
        res.setError(404, "File not found");
    }
}
