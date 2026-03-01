/**
 * Enchantment Engine - Asset Manager
 */

#pragma once

#include <string>
#include <vector>
#include <map>

struct Asset {
    std::string name;
    std::string path;
    std::string type;  // "tile", "map", "sprite", "string", "table", "sound"
    size_t size;
    bool processed;
};

class AssetManager {
public:
    AssetManager(const std::string& projectPath);
    ~AssetManager();
    
    // Asset discovery
    void scanAssets();
    std::vector<Asset> getAssets() const;
    std::vector<Asset> getAssetsByType(const std::string& type) const;
    
    // Asset processing
    bool processAssets();
    bool processAsset(const std::string& path);
    bool processTiles(const std::string& path);
    bool processMaps(const std::string& path);
    bool processSprites(const std::string& path);
    bool processStrings(const std::string& path);
    bool processTables(const std::string& path);
    bool processSounds(const std::string& path);
    
    // Asset management
    bool addAsset(const std::string& path);
    bool removeAsset(const std::string& path);
    bool renameAsset(const std::string& oldPath, const std::string& newPath);
    
    // Asset info
    Asset getAssetInfo(const std::string& path) const;
    std::string getAssetType(const std::string& path) const;
    
private:
    std::string m_projectPath;
    std::vector<Asset> m_assets;
    std::map<std::string, std::string> m_assetTypes;
    
    void initializeAssetTypes();
    std::string detectAssetType(const std::string& path) const;
};
