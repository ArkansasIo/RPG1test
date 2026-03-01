/**
 * Enchantment Game Engine - Asset Processor
 * Converts PNG tiles, strings, and tables to C data
 */

#ifndef ENCHANTMENT_ASSET_PROCESSOR_HPP
#define ENCHANTMENT_ASSET_PROCESSOR_HPP

#include <string>
#include <vector>
#include <map>

/**
 * Tile data structure
 */
struct TileData {
    std::vector<uint8_t> pixels;
    int width;
    int height;
    int bpp; // bits per pixel
};

/**
 * Palette data structure
 */
struct PaletteData {
    std::vector<uint32_t> colors; // RGBA colors
};

/**
 * Asset processor for converting game assets
 */
class AssetProcessor {
public:
    explicit AssetProcessor(const std::string& projectRoot);
    
    // Main processing
    std::string processAssets();
    std::string processTiles();
    std::string processStrings();
    std::string processTables();
    
    // PNG processing
    TileData loadPNG(const std::string& filePath);
    std::vector<uint8_t> convertToGameBoyTiles(const TileData& tileData);
    void saveBinaryTiles(const std::string& outputPath, const std::vector<uint8_t>& tileData);
    
    // String processing
    std::map<std::string, std::string> parseStringsJS(const std::string& jsContent);
    std::string generateStringsC(const std::map<std::string, std::string>& strings, int bank);
    
    // Table processing
    std::vector<std::vector<std::string>> parseCSV(const std::string& csvContent);
    std::string generateTablesC(const std::vector<std::vector<std::string>>& table);
    
private:
    std::string m_projectRoot;
    
    // PNG helpers
    bool isPNG(const std::vector<uint8_t>& data);
    void decodePNG(const std::vector<uint8_t>& pngData, TileData& output);
    
    // String helpers
    std::string escapeString(const std::string& str);
    std::string sanitizeIdentifier(const std::string& str);
    
    // Table helpers
    std::string inferType(const std::string& value);
    std::string formatValue(const std::string& value, const std::string& type);
};

#endif // ENCHANTMENT_ASSET_PROCESSOR_HPP
