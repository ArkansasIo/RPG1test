/**
 * Enchantment Engine - Asset Manager Implementation
 */

#include "asset_manager.hpp"
#include <filesystem>
#include <iostream>

namespace fs = std::filesystem;

AssetManager::AssetManager(const std::string& projectPath)
    : m_projectPath(projectPath)
{
    initializeAssetTypes();
    scanAssets();
}

AssetManager::~AssetManager() {
}

void AssetManager::initializeAssetTypes() {
    m_assetTypes[".png"] = "tile";
    m_assetTypes[".tilemap"] = "map";
    m_assetTypes[".js"] = "string";
    m_assetTypes[".csv"] = "table";
    m_assetTypes[".wav"] = "sound";
    m_assetTypes[".vgm"] = "sound";
}

void AssetManager::scanAssets() {
    m_assets.clear();
    
    std::string assetsPath = m_projectPath + "/assets";
    if (!fs::exists(assetsPath)) {
        return;
    }
    
    for (const auto& entry : fs::recursive_directory_iterator(assetsPath)) {
        if (entry.is_regular_file()) {
            Asset asset;
            asset.path = entry.path().string();
            asset.name = entry.path().filename().string();
            asset.type = detectAssetType(asset.path);
            asset.size = entry.file_size();
            asset.processed = false;
            
            m_assets.push_back(asset);
        }
    }
    
    std::cout << "Found " << m_assets.size() << " assets" << std::endl;
}

std::vector<Asset> AssetManager::getAssets() const {
    return m_assets;
}

std::vector<Asset> AssetManager::getAssetsByType(const std::string& type) const {
    std::vector<Asset> result;
    for (const auto& asset : m_assets) {
        if (asset.type == type) {
            result.push_back(asset);
        }
    }
    return result;
}

bool AssetManager::processAssets() {
    std::cout << "Processing assets..." << std::endl;
    
    bool success = true;
    for (auto& asset : m_assets) {
        if (!processAsset(asset.path)) {
            std::cerr << "Failed to process: " << asset.path << std::endl;
            success = false;
        } else {
            asset.processed = true;
        }
    }
    
    std::cout << "Asset processing complete" << std::endl;
    return success;
}

bool AssetManager::processAsset(const std::string& path) {
    std::string type = detectAssetType(path);
    
    if (type == "tile") {
        return processTiles(path);
    } else if (type == "map") {
        return processMaps(path);
    } else if (type == "sprite") {
        return processSprites(path);
    } else if (type == "string") {
        return processStrings(path);
    } else if (type == "table") {
        return processTables(path);
    } else if (type == "sound") {
        return processSounds(path);
    }
    
    return false;
}

bool AssetManager::processTiles(const std::string& path) {
    std::cout << "Processing tiles: " << path << std::endl;
    // Call png2bin tool
    std::string command = "node tools/png2bin \"" + path + "\"";
    return system(command.c_str()) == 0;
}

bool AssetManager::processMaps(const std::string& path) {
    std::cout << "Processing map: " << path << std::endl;
    // Process tilemap
    return true;
}

bool AssetManager::processSprites(const std::string& path) {
    std::cout << "Processing sprite: " << path << std::endl;
    return processTiles(path);
}

bool AssetManager::processStrings(const std::string& path) {
    std::cout << "Processing strings: " << path << std::endl;
    // Call strings2c tool
    std::string command = "node tools/strings2c \"" + path + "\"";
    return system(command.c_str()) == 0;
}

bool AssetManager::processTables(const std::string& path) {
    std::cout << "Processing table: " << path << std::endl;
    // Call tables2c tool
    std::string command = "node tools/tables2c \"" + path + "\"";
    return system(command.c_str()) == 0;
}

bool AssetManager::processSounds(const std::string& path) {
    std::cout << "Processing sound: " << path << std::endl;
    // Process sound file
    return true;
}

bool AssetManager::addAsset(const std::string& path) {
    Asset asset;
    asset.path = path;
    asset.name = fs::path(path).filename().string();
    asset.type = detectAssetType(path);
    asset.size = fs::file_size(path);
    asset.processed = false;
    
    m_assets.push_back(asset);
    return true;
}

bool AssetManager::removeAsset(const std::string& path) {
    auto it = std::remove_if(m_assets.begin(), m_assets.end(),
        [&path](const Asset& asset) { return asset.path == path; });
    
    if (it != m_assets.end()) {
        m_assets.erase(it, m_assets.end());
        return true;
    }
    
    return false;
}

bool AssetManager::renameAsset(const std::string& oldPath, const std::string& newPath) {
    for (auto& asset : m_assets) {
        if (asset.path == oldPath) {
            asset.path = newPath;
            asset.name = fs::path(newPath).filename().string();
            return true;
        }
    }
    return false;
}

Asset AssetManager::getAssetInfo(const std::string& path) const {
    for (const auto& asset : m_assets) {
        if (asset.path == path) {
            return asset;
        }
    }
    return Asset();
}

std::string AssetManager::getAssetType(const std::string& path) const {
    return detectAssetType(path);
}

std::string AssetManager::detectAssetType(const std::string& path) const {
    std::string ext = fs::path(path).extension().string();
    
    auto it = m_assetTypes.find(ext);
    if (it != m_assetTypes.end()) {
        return it->second;
    }
    
    return "unknown";
}
