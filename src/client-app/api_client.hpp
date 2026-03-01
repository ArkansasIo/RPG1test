/**
 * Enchantment Game Engine - API Client
 * HTTP client for communicating with backend server
 */

#ifndef ENCHANTMENT_API_CLIENT_HPP
#define ENCHANTMENT_API_CLIENT_HPP

#include <string>
#include <map>
#include <vector>
#include <functional>

/**
 * API Response structure
 */
struct ApiResponse {
    int statusCode;
    std::map<std::string, std::string> headers;
    std::string body;
    std::vector<uint8_t> binaryData;
    bool isBinary;
};

/**
 * API Client for backend communication
 */
class ApiClient {
public:
    explicit ApiClient(const std::string& baseUrl);
    ~ApiClient();

    // HTTP methods
    ApiResponse get(const std::string& path);
    ApiResponse post(const std::string& path, const std::string& body);
    ApiResponse put(const std::string& path, const std::string& body);
    ApiResponse del(const std::string& path);

    // File operations
    std::vector<std::string> listFiles(const std::string& directory);
    std::string readFile(const std::string& path);
    bool saveFile(const std::string& path, const std::string& content);

    // Build operations
    std::string buildAssets();
    std::string buildRom();
    std::string buildAll();
    std::vector<uint8_t> downloadRom();

    // Configuration
    void setBaseUrl(const std::string& url) { m_baseUrl = url; }
    std::string getBaseUrl() const { return m_baseUrl; }
    void setTimeout(int timeoutMs) { m_timeoutMs = timeoutMs; }

private:
    std::string m_baseUrl;
    int m_timeoutMs;

    ApiResponse request(
        const std::string& method,
        const std::string& path,
        const std::string& body = ""
    );

    std::string urlEncode(const std::string& str);
    std::string buildUrl(const std::string& path);
};

#endif // ENCHANTMENT_API_CLIENT_HPP
