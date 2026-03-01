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
