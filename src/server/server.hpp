/**
 * Enchantment Game Engine - HTTP Server
 * Handles HTTP requests and WebSocket connections
 */

#ifndef ENCHANTMENT_SERVER_HPP
#define ENCHANTMENT_SERVER_HPP

#include <string>
#include <memory>
#include <map>
#include <functional>
#include <vector>

// Forward declarations
class FileManager;
class BuildSystem;
class AssetProcessor;

/**
 * HTTP Request structure
 */
struct HttpRequest {
    std::string method;
    std::string path;
    std::map<std::string, std::string> headers;
    std::map<std::string, std::string> params;
    std::string body;
};

/**
 * HTTP Response structure
 */
struct HttpResponse {
    int statusCode = 200;
    std::map<std::string, std::string> headers;
    std::string body;
    std::vector<uint8_t> binaryData;
    bool isBinary = false;

    void setJson(const std::string& json);
    void setHtml(const std::string& html);
    void setText(const std::string& text);
    void setBinary(const std::vector<uint8_t>& data, const std::string& contentType);
    void setError(int code, const std::string& message);
};

/**
 * Route handler function type
 */
using RouteHandler = std::function<void(const HttpRequest&, HttpResponse&)>;

/**
 * Main server class
 */
class EnchantmentServer {
public:
    EnchantmentServer(int port, const std::string& projectPath);
    ~EnchantmentServer();

    void start();
    void stop();
    bool isRunning() const { return m_running; }

private:
    void setupRoutes();
    void handleRequest(int clientSocket);
    HttpRequest parseRequest(const std::string& requestData);
    std::string buildResponse(const HttpResponse& response);
    
    // Route handlers - File Operations
    void handleGetFile(const HttpRequest& req, HttpResponse& res);
    void handleSaveFile(const HttpRequest& req, HttpResponse& res);
    void handleListFiles(const HttpRequest& req, HttpResponse& res);
    void handleDeleteFile(const HttpRequest& req, HttpResponse& res);
    void handleNewFile(const HttpRequest& req, HttpResponse& res);
    void handleRenameFile(const HttpRequest& req, HttpResponse& res);
    
    // Route handlers - Project Operations
    void handleProjectInfo(const HttpRequest& req, HttpResponse& res);
    void handleProjectSettings(const HttpRequest& req, HttpResponse& res);
    
    // Route handlers - Build Operations
    void handleBuildAssets(const HttpRequest& req, HttpResponse& res);
    void handleBuildRom(const HttpRequest& req, HttpResponse& res);
    void handleBuildAll(const HttpRequest& req, HttpResponse& res);
    void handleCleanBuild(const HttpRequest& req, HttpResponse& res);
    void handleBuildStatus(const HttpRequest& req, HttpResponse& res);
    
    // Route handlers - Asset Operations
    void handleListAssets(const HttpRequest& req, HttpResponse& res);
    void handleGetTiles(const HttpRequest& req, HttpResponse& res);
    void handleGetMaps(const HttpRequest& req, HttpResponse& res);
    void handleGetSprites(const HttpRequest& req, HttpResponse& res);
    
    // Route handlers - ROM Operations
    void handleGetRom(const HttpRequest& req, HttpResponse& res);
    void handleRomInfo(const HttpRequest& req, HttpResponse& res);
    
    // Route handlers - Debug Operations
    void handleDebugSymbols(const HttpRequest& req, HttpResponse& res);
    void handleSetBreakpoint(const HttpRequest& req, HttpResponse& res);
    
    // Route handlers - Tools Operations
    void handleTileEditor(const HttpRequest& req, HttpResponse& res);
    void handleMapEditor(const HttpRequest& req, HttpResponse& res);
    void handleSpriteEditor(const HttpRequest& req, HttpResponse& res);
    
    // Route handlers - System Operations
    void handleSystemStatus(const HttpRequest& req, HttpResponse& res);
    void handleSystemVersion(const HttpRequest& req, HttpResponse& res);
    
    // Static file handler
    void handleStaticFile(const HttpRequest& req, HttpResponse& res);

    int m_port;
    std::string m_projectPath;
    int m_serverSocket;
    bool m_running;
    
    std::map<std::string, RouteHandler> m_routes;
    std::unique_ptr<FileManager> m_fileManager;
    std::unique_ptr<BuildSystem> m_buildSystem;
    std::unique_ptr<AssetProcessor> m_assetProcessor;
};

#endif // ENCHANTMENT_SERVER_HPP
