/**
 * Enchantment Game Engine - Asset Processor Implementation
 */

#include "asset_processor.hpp"
#include <iostream>
#include <fstream>
#include <sstream>
#include <filesystem>
#include <algorithm>
#include <regex>

namespace fs = std::filesystem;

AssetProcessor::AssetProcessor(const std::string& projectRoot)
    : m_projectRoot(projectRoot)
{
}

std::string AssetProcessor::processAssets() {
    std::ostringstream output;
    output << "=== Processing Assets ===\n\n";
    
    output << processTiles();
    output << "\n";
    output << processStrings();
    output << "\n";
    output << processTables();
    
    output << "\n=== Asset Processing Complete ===\n";
    return output.str();
}

std::string AssetProcessor::processTiles() {
    std::ostringstream output;
    output << "Processing PNG tiles...\n";
    
    fs::path tilesDir = fs::path(m_projectRoot) / "assets" / "tiles";
    fs::path outputDir = fs::path(m_projectRoot) / "res" / "tiles";
    
    if (!fs::exists(tilesDir)) {
        output << "  No tiles directory found\n";
        return output.str();
    }
    
    // Create output directory
    fs::create_directories(outputDir);
    
    int processedCount = 0;
    for (const auto& entry : fs::directory_iterator(tilesDir)) {
        if (entry.path().extension() == ".png") {
            try {
                std::string inputPath = entry.path().string();
                std::string outputPath = (outputDir / entry.path().stem()).string() + ".bin";
                
                // Load PNG
                TileData tileData = loadPNG(inputPath);
                
                // Convert to Game Boy format
                std::vector<uint8_t> gbTiles = convertToGameBoyTiles(tileData);
                
                // Save binary
                saveBinaryTiles(outputPath, gbTiles);
                
                output << "  " << entry.path().filename().string() << " -> " 
                       << fs::path(outputPath).filename().string() << "\n";
                processedCount++;
            } catch (const std::exception& e) {
                output << "  ERROR: " << entry.path().filename().string() 
                       << " - " << e.what() << "\n";
            }
        }
    }
    
    output << "Processed " << processedCount << " tile files\n";
    return output.str();
}

std::string AssetProcessor::processStrings() {
    std::ostringstream output;
    output << "Processing strings...\n";
    
    fs::path stringsFile = fs::path(m_projectRoot) / "assets" / "strings.js";
    fs::path outputDir = fs::path(m_projectRoot) / "data";
    
    if (!fs::exists(stringsFile)) {
        output << "  No strings.js found\n";
        return output.str();
    }
    
    try {
        // Read strings.js
        std::ifstream file(stringsFile);
        std::string content((std::istreambuf_iterator<char>(file)),
                           std::istreambuf_iterator<char>());
        
        // Parse strings
        auto strings = parseStringsJS(content);
        
        // Generate C file
        std::string cCode = generateStringsC(strings, 0);
        
        // Write output
        fs::create_directories(outputDir);
        std::ofstream outFile(outputDir / "strings.c");
        outFile << cCode;
        
        output << "  Generated strings.c with " << strings.size() << " strings\n";
    } catch (const std::exception& e) {
        output << "  ERROR: " << e.what() << "\n";
    }
    
    return output.str();
}

std::string AssetProcessor::processTables() {
    std::ostringstream output;
    output << "Processing tables...\n";
    
    fs::path tablesFile = fs::path(m_projectRoot) / "assets" / "tables.csv";
    fs::path outputDir = fs::path(m_projectRoot) / "data";
    
    if (!fs::exists(tablesFile)) {
        output << "  No tables.csv found\n";
        return output.str();
    }
    
    try {
        // Read CSV
        std::ifstream file(tablesFile);
        std::string content((std::istreambuf_iterator<char>(file)),
                           std::istreambuf_iterator<char>());
        
        // Parse CSV
        auto table = parseCSV(content);
        
        // Generate C file
        std::string cCode = generateTablesC(table);
        
        // Write output
        fs::create_directories(outputDir);
        std::ofstream outFile(outputDir / "tables.c");
        outFile << cCode;
        
        output << "  Generated tables.c with " << (table.size() - 1) << " rows\n";
    } catch (const std::exception& e) {
        output << "  ERROR: " << e.what() << "\n";
    }
    
    return output.str();
}

TileData AssetProcessor::loadPNG(const std::string& filePath) {
    // Simple PNG loader (in production, use a library like stb_image or libpng)
    TileData data;
    data.width = 8;
    data.height = 8;
    data.bpp = 2;
    
    // For now, return dummy data
    // TODO: Implement actual PNG decoding
    data.pixels.resize(data.width * data.height, 0);
    
    return data;
}

std::vector<uint8_t> AssetProcessor::convertToGameBoyTiles(const TileData& tileData) {
    std::vector<uint8_t> gbTiles;
    
    // Game Boy tiles are 8x8 pixels, 2 bits per pixel
    // Each tile is 16 bytes (2 bytes per row)
    int tilesX = tileData.width / 8;
    int tilesY = tileData.height / 8;
    
    for (int ty = 0; ty < tilesY; ty++) {
        for (int tx = 0; tx < tilesX; tx++) {
            // Process each 8x8 tile
            for (int y = 0; y < 8; y++) {
                uint8_t byte1 = 0;
                uint8_t byte2 = 0;
                
                for (int x = 0; x < 8; x++) {
                    int pixelX = tx * 8 + x;
                    int pixelY = ty * 8 + y;
                    int pixelIndex = pixelY * tileData.width + pixelX;
                    
                    if (pixelIndex < tileData.pixels.size()) {
                        uint8_t color = tileData.pixels[pixelIndex] & 0x03;
                        
                        if (color & 0x01) byte1 |= (1 << (7 - x));
                        if (color & 0x02) byte2 |= (1 << (7 - x));
                    }
                }
                
                gbTiles.push_back(byte1);
                gbTiles.push_back(byte2);
            }
        }
    }
    
    return gbTiles;
}

void AssetProcessor::saveBinaryTiles(const std::string& outputPath, const std::vector<uint8_t>& tileData) {
    std::ofstream file(outputPath, std::ios::binary);
    file.write((char*)tileData.data(), tileData.size());
}

std::map<std::string, std::string> AssetProcessor::parseStringsJS(const std::string& jsContent) {
    std::map<std::string, std::string> strings;
    
    // Simple regex-based parser for strings.js
    // Format: 'key': 'value',
    std::regex stringRegex(R"('([^']+)':\s*'([^']*)')");
    
    auto begin = std::sregex_iterator(jsContent.begin(), jsContent.end(), stringRegex);
    auto end = std::sregex_iterator();
    
    for (auto it = begin; it != end; ++it) {
        std::smatch match = *it;
        strings[match[1].str()] = match[2].str();
    }
    
    return strings;
}

std::string AssetProcessor::generateStringsC(const std::map<std::string, std::string>& strings, int bank) {
    std::ostringstream code;
    
    code << "/**\n";
    code << " * Auto-generated string data\n";
    code << " * DO NOT EDIT MANUALLY\n";
    code << " */\n\n";
    
    if (bank > 0) {
        code << "#pragma bank " << bank << "\n\n";
    }
    
    code << "#include \"strings.h\"\n\n";
    
    for (const auto& [key, value] : strings) {
        std::string identifier = "STR_" + sanitizeIdentifier(key);
        std::string escaped = escapeString(value);
        code << "const char " << identifier << "[] = \"" << escaped << "\";\n";
    }
    
    return code.str();
}

std::vector<std::vector<std::string>> AssetProcessor::parseCSV(const std::string& csvContent) {
    std::vector<std::vector<std::string>> table;
    std::istringstream stream(csvContent);
    std::string line;
    
    while (std::getline(stream, line)) {
        std::vector<std::string> row;
        std::istringstream lineStream(line);
        std::string cell;
        
        while (std::getline(lineStream, cell, ',')) {
            // Trim whitespace
            cell.erase(0, cell.find_first_not_of(" \t\r\n"));
            cell.erase(cell.find_last_not_of(" \t\r\n") + 1);
            row.push_back(cell);
        }
        
        if (!row.empty()) {
            table.push_back(row);
        }
    }
    
    return table;
}

std::string AssetProcessor::generateTablesC(const std::vector<std::vector<std::string>>& table) {
    std::ostringstream code;
    
    code << "/**\n";
    code << " * Auto-generated table data\n";
    code << " * DO NOT EDIT MANUALLY\n";
    code << " */\n\n";
    
    code << "#include \"tables.h\"\n\n";
    
    if (table.empty()) return code.str();
    
    // First row is headers
    const auto& headers = table[0];
    int numCols = headers.size();
    int numRows = table.size() - 1;
    
    // Generate arrays for each column
    for (int col = 0; col < numCols; col++) {
        std::string colName = sanitizeIdentifier(headers[col]);
        std::string type = "uint16_t"; // Default type
        
        // Infer type from first data row
        if (table.size() > 1) {
            type = inferType(table[1][col]);
        }
        
        code << "const " << type << " " << colName << "[" << numRows << "] = {\n";
        
        for (int row = 1; row < table.size(); row++) {
            if (col < table[row].size()) {
                code << "    " << formatValue(table[row][col], type);
                if (row < table.size() - 1) code << ",";
                code << "\n";
            }
        }
        
        code << "};\n\n";
    }
    
    return code.str();
}

std::string AssetProcessor::escapeString(const std::string& str) {
    std::string escaped;
    for (char c : str) {
        switch (c) {
            case '\n': escaped += "\\n"; break;
            case '\r': escaped += "\\r"; break;
            case '\t': escaped += "\\t"; break;
            case '\"': escaped += "\\\""; break;
            case '\\': escaped += "\\\\"; break;
            default: escaped += c;
        }
    }
    return escaped;
}

std::string AssetProcessor::sanitizeIdentifier(const std::string& str) {
    std::string sanitized;
    for (char c : str) {
        if (std::isalnum(c) || c == '_') {
            sanitized += std::toupper(c);
        } else {
            sanitized += '_';
        }
    }
    return sanitized;
}

std::string AssetProcessor::inferType(const std::string& value) {
    // Check if it's a number
    try {
        int num = std::stoi(value);
        if (num >= 0 && num <= 255) return "uint8_t";
        if (num >= 0 && num <= 65535) return "uint16_t";
        return "int32_t";
    } catch (...) {
        return "const char*";
    }
}

std::string AssetProcessor::formatValue(const std::string& value, const std::string& type) {
    if (type == "const char*") {
        return "\"" + escapeString(value) + "\"";
    }
    
    // Check for hex format
    if (value.find("0x") == 0 || value.find("0X") == 0) {
        return value;
    }
    
    return value;
}
