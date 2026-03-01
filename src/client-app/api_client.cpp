/**
 * Enchantment Game Engine - API Client Implementation
 */

#include "api_client.hpp"
#include <iostream>
#include <sstream>
#include <cstring>

#ifdef _WIN32
    #include <winsock2.h>
    #include <ws2tcpip.h>
    #pragma comment(lib, "ws2_32.lib")
#else
    #include <sys/socket.h>
    #include <netinet/in.h>
    #include <arpa/inet.h>
    #include <netdb.h>
    #include <unistd.h>
    #define closesocket close
#endif

ApiClient::ApiClient(const std::string& baseUrl)
    : m_baseUrl(baseUrl)
    , m_timeoutMs(30000)
{
#ifdef _WIN32
    WSADATA wsaData;
    WSAStartup(MAKEWORD(2, 2), &wsaData);
#endif
}

ApiClient::~ApiClient() {
#ifdef _WIN32
    WSACleanup();
#endif
}

std::string ApiClient::buildUrl(const std::string& path) {
    if (path.empty() || path[0] != '/') {
        return m_baseUrl + "/" + path;
    }
    return m_baseUrl + path;
}

ApiResponse ApiClient::request(const std::string& method, const std::string& path, const std::string& body) {
    ApiResponse response;
    response.statusCode = 0;
    response.isBinary = false;

    try {
        // Parse URL
        std::string url = buildUrl(path);
        std::string host = "localhost";
        int port = 8080;
        std::string requestPath = path;

        // Extract host and port from URL
        if (url.find("http://") == 0) {
            size_t hostStart = 7;
            size_t hostEnd = url.find(':', hostStart);
            if (hostEnd != std::string::npos) {
                host = url.substr(hostStart, hostEnd - hostStart);
                size_t portEnd = url.find('/', hostEnd);
                if (portEnd != std::string::npos) {
                    port = std::stoi(url.substr(hostEnd + 1, portEnd - hostEnd - 1));
                    requestPath = url.substr(portEnd);
                } else {
                    port = std::stoi(url.substr(hostEnd + 1));
                }
            }
        }

        // Create socket
        int sock = socket(AF_INET, SOCK_STREAM, 0);
        if (sock < 0) {
            throw std::runtime_error("Failed to create socket");
        }

        // Connect to server
        sockaddr_in serverAddr = {};
        serverAddr.sin_family = AF_INET;
        serverAddr.sin_port = htons(port);
        inet_pton(AF_INET, host.c_str(), &serverAddr.sin_addr);

        if (connect(sock, (sockaddr*)&serverAddr, sizeof(serverAddr)) < 0) {
            closesocket(sock);
            throw std::runtime_error("Failed to connect to server");
        }

        // Build HTTP request
        std::ostringstream request;
        request << method << " " << requestPath << " HTTP/1.1\r\n";
        request << "Host: " << host << "\r\n";
        request << "Connection: close\r\n";
        
        if (!body.empty()) {
            request << "Content-Type: application/json\r\n";
            request << "Content-Length: " << body.length() << "\r\n";
        }
        
        request << "\r\n";
        
        if (!body.empty()) {
            request << body;
        }

        // Send request
        std::string requestStr = request.str();
        send(sock, requestStr.c_str(), requestStr.length(), 0);

        // Receive response
        char buffer[4096];
        std::string responseData;
        int bytesRead;
        
        while ((bytesRead = recv(sock, buffer, sizeof(buffer), 0)) > 0) {
            responseData.append(buffer, bytesRead);
        }

        closesocket(sock);

        // Parse response
        size_t headerEnd = responseData.find("\r\n\r\n");
        if (headerEnd != std::string::npos) {
            std::string headers = responseData.substr(0, headerEnd);
            response.body = responseData.substr(headerEnd + 4);

            // Parse status code
            size_t statusStart = headers.find(' ') + 1;
            size_t statusEnd = headers.find(' ', statusStart);
            response.statusCode = std::stoi(headers.substr(statusStart, statusEnd - statusStart));

            // Parse headers
            std::istringstream headerStream(headers);
            std::string line;
            std::getline(headerStream, line); // Skip status line
            
            while (std::getline(headerStream, line)) {
                if (line.empty() || line == "\r") break;
                
                size_t colonPos = line.find(':');
                if (colonPos != std::string::npos) {
                    std::string key = line.substr(0, colonPos);
                    std::string value = line.substr(colonPos + 2);
                    if (!value.empty() && value.back() == '\r') {
                        value.pop_back();
                    }
                    response.headers[key] = value;
                }
            }
        }

    } catch (const std::exception& e) {
        std::cerr << "API request failed: " << e.what() << std::endl;
        response.statusCode = 0;
    }

    return response;
}

ApiResponse ApiClient::get(const std::string& path) {
    return request("GET", path);
}

ApiResponse ApiClient::post(const std::string& path, const std::string& body) {
    return request("POST", path, body);
}

ApiResponse ApiClient::put(const std::string& path, const std::string& body) {
    return request("PUT", path, body);
}

ApiResponse ApiClient::del(const std::string& path) {
    return request("DELETE", path);
}

std::vector<std::string> ApiClient::listFiles(const std::string& directory) {
    std::vector<std::string> files;
    
    auto response = get("/api/files?dir=" + urlEncode(directory));
    if (response.statusCode == 200) {
        // Parse JSON response (simple parsing)
        // TODO: Use proper JSON library
        std::string json = response.body;
        size_t pos = json.find("[");
        if (pos != std::string::npos) {
            size_t end = json.find("]", pos);
            std::string filesStr = json.substr(pos + 1, end - pos - 1);
            
            // Split by comma
            std::istringstream stream(filesStr);
            std::string file;
            while (std::getline(stream, file, ',')) {
                // Remove quotes and whitespace
                file.erase(0, file.find_first_not_of(" \t\n\r\""));
                file.erase(file.find_last_not_of(" \t\n\r\"") + 1);
                if (!file.empty()) {
                    files.push_back(file);
                }
            }
        }
    }
    
    return files;
}

std::string ApiClient::readFile(const std::string& path) {
    auto response = get("/api/file?path=" + urlEncode(path));
    if (response.statusCode == 200) {
        return response.body;
    }
    return "";
}

bool ApiClient::saveFile(const std::string& path, const std::string& content) {
    std::string json = "{\"path\":\"" + path + "\",\"content\":\"" + content + "\"}";
    auto response = post("/api/file", json);
    return response.statusCode == 200;
}

std::string ApiClient::buildAssets() {
    auto response = post("/api/build/assets", "");
    if (response.statusCode == 200) {
        return response.body;
    }
    return "Build failed";
}

std::string ApiClient::buildRom() {
    auto response = post("/api/build/rom", "");
    if (response.statusCode == 200) {
        return response.body;
    }
    return "Build failed";
}

std::string ApiClient::buildAll() {
    auto response = post("/api/build/all", "");
    if (response.statusCode == 200) {
        return response.body;
    }
    return "Build failed";
}

std::vector<uint8_t> ApiClient::downloadRom() {
    auto response = get("/api/rom");
    if (response.statusCode == 200) {
        return std::vector<uint8_t>(response.body.begin(), response.body.end());
    }
    return {};
}

std::string ApiClient::urlEncode(const std::string& str) {
    std::ostringstream encoded;
    for (char c : str) {
        if (isalnum(c) || c == '-' || c == '_' || c == '.' || c == '~') {
            encoded << c;
        } else {
            encoded << '%' << std::hex << std::uppercase << (int)(unsigned char)c;
        }
    }
    return encoded.str();
}


// Additional File Operations
bool ApiClient::deleteFile(const std::string& path) {
    auto response = del("/api/file?path=" + urlEncode(path));
    return response.statusCode == 200;
}

bool ApiClient::newFile(const std::string& path) {
    std::string json = "{\"path\":\"" + path + "\"}";
    auto response = post("/api/file/new", json);
    return response.statusCode == 200;
}

bool ApiClient::renameFile(const std::string& oldPath, const std::string& newPath) {
    std::string json = "{\"oldPath\":\"" + oldPath + "\",\"newPath\":\"" + newPath + "\"}";
    auto response = post("/api/file/rename", json);
    return response.statusCode == 200;
}

// Project Operations
std::string ApiClient::getProjectInfo() {
    auto response = get("/api/project/info");
    if (response.statusCode == 200) {
        return response.body;
    }
    return "{}";
}

bool ApiClient::saveProjectSettings(const std::map<std::string, std::string>& settings) {
    std::ostringstream json;
    json << "{";
    bool first = true;
    for (const auto& [key, value] : settings) {
        if (!first) json << ",";
        json << "\"" << key << "\":\"" << value << "\"";
        first = false;
    }
    json << "}";
    
    auto response = post("/api/project/settings", json.str());
    return response.statusCode == 200;
}

// Build Operations
std::string ApiClient::cleanBuild() {
    auto response = post("/api/build/clean", "");
    if (response.statusCode == 200) {
        return response.body;
    }
    return "Clean failed";
}

std::string ApiClient::getBuildStatus() {
    auto response = get("/api/build/status");
    if (response.statusCode == 200) {
        return response.body;
    }
    return "{}";
}

// Asset Operations
std::string ApiClient::listAssets() {
    auto response = get("/api/assets/list");
    if (response.statusCode == 200) {
        return response.body;
    }
    return "{}";
}

std::vector<std::string> ApiClient::getTiles() {
    std::vector<std::string> tiles;
    auto response = get("/api/assets/tiles");
    if (response.statusCode == 200) {
        // Parse JSON array (simple parsing)
        std::string json = response.body;
        size_t pos = json.find("[");
        if (pos != std::string::npos) {
            size_t end = json.find("]", pos);
            std::string tilesStr = json.substr(pos + 1, end - pos - 1);
            
            std::istringstream stream(tilesStr);
            std::string tile;
            while (std::getline(stream, tile, ',')) {
                tile.erase(0, tile.find_first_not_of(" \t\n\r\""));
                tile.erase(tile.find_last_not_of(" \t\n\r\"") + 1);
                if (!tile.empty()) {
                    tiles.push_back(tile);
                }
            }
        }
    }
    return tiles;
}

std::vector<std::string> ApiClient::getMaps() {
    std::vector<std::string> maps;
    auto response = get("/api/assets/maps");
    if (response.statusCode == 200) {
        // Parse JSON array (simple parsing)
        std::string json = response.body;
        size_t pos = json.find("[");
        if (pos != std::string::npos) {
            size_t end = json.find("]", pos);
            std::string mapsStr = json.substr(pos + 1, end - pos - 1);
            
            std::istringstream stream(mapsStr);
            std::string map;
            while (std::getline(stream, map, ',')) {
                map.erase(0, map.find_first_not_of(" \t\n\r\""));
                map.erase(map.find_last_not_of(" \t\n\r\"") + 1);
                if (!map.empty()) {
                    maps.push_back(map);
                }
            }
        }
    }
    return maps;
}

std::vector<std::string> ApiClient::getSprites() {
    std::vector<std::string> sprites;
    auto response = get("/api/assets/sprites");
    if (response.statusCode == 200) {
        // Parse JSON array (simple parsing)
        std::string json = response.body;
        size_t pos = json.find("[");
        if (pos != std::string::npos) {
            size_t end = json.find("]", pos);
            std::string spritesStr = json.substr(pos + 1, end - pos - 1);
            
            std::istringstream stream(spritesStr);
            std::string sprite;
            while (std::getline(stream, sprite, ',')) {
                sprite.erase(0, sprite.find_first_not_of(" \t\n\r\""));
                sprite.erase(sprite.find_last_not_of(" \t\n\r\"") + 1);
                if (!sprite.empty()) {
                    sprites.push_back(sprite);
                }
            }
        }
    }
    return sprites;
}

// ROM Operations
std::string ApiClient::getRomInfo() {
    auto response = get("/api/rom/info");
    if (response.statusCode == 200) {
        return response.body;
    }
    return "{}";
}

// Debug Operations
std::string ApiClient::getDebugSymbols() {
    auto response = get("/api/debug/symbols");
    if (response.statusCode == 200) {
        return response.body;
    }
    return "{}";
}

bool ApiClient::setBreakpoint(const std::string& address) {
    std::string json = "{\"address\":\"" + address + "\"}";
    auto response = post("/api/debug/breakpoint", json);
    return response.statusCode == 200;
}

// Tools Operations
std::string ApiClient::tileEditorAction(const std::string& action, const std::string& data) {
    std::string json = "{\"action\":\"" + action + "\",\"data\":\"" + data + "\"}";
    auto response = post("/api/tools/tile-editor", json);
    if (response.statusCode == 200) {
        return response.body;
    }
    return "{\"success\":false}";
}

std::string ApiClient::mapEditorAction(const std::string& action, const std::string& data) {
    std::string json = "{\"action\":\"" + action + "\",\"data\":\"" + data + "\"}";
    auto response = post("/api/tools/map-editor", json);
    if (response.statusCode == 200) {
        return response.body;
    }
    return "{\"success\":false}";
}

std::string ApiClient::spriteEditorAction(const std::string& action, const std::string& data) {
    std::string json = "{\"action\":\"" + action + "\",\"data\":\"" + data + "\"}";
    auto response = post("/api/tools/sprite-editor", json);
    if (response.statusCode == 200) {
        return response.body;
    }
    return "{\"success\":false}";
}

// System Operations
std::string ApiClient::getSystemStatus() {
    auto response = get("/api/system/status");
    if (response.statusCode == 200) {
        return response.body;
    }
    return "{}";
}

std::string ApiClient::getSystemVersion() {
    auto response = get("/api/system/version");
    if (response.statusCode == 200) {
        return response.body;
    }
    return "{}";
}
