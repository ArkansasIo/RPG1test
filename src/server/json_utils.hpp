/**
 * Enchantment Game Engine - Simple JSON Utilities
 * Lightweight JSON parsing for basic operations
 */

#ifndef ENCHANTMENT_JSON_UTILS_HPP
#define ENCHANTMENT_JSON_UTILS_HPP

#include <string>
#include <map>
#include <sstream>

namespace JsonUtils {

/**
 * Simple JSON parser for basic key-value pairs
 * Handles: {"key": "value", "key2": "value2"}
 */
inline std::map<std::string, std::string> parseSimpleJson(const std::string& json) {
    std::map<std::string, std::string> result;
    
    size_t pos = 0;
    while (pos < json.length()) {
        // Find key start
        size_t keyStart = json.find('"', pos);
        if (keyStart == std::string::npos) break;
        keyStart++;
        
        // Find key end
        size_t keyEnd = json.find('"', keyStart);
        if (keyEnd == std::string::npos) break;
        
        std::string key = json.substr(keyStart, keyEnd - keyStart);
        
        // Find colon
        size_t colon = json.find(':', keyEnd);
        if (colon == std::string::npos) break;
        
        // Find value start
        size_t valueStart = json.find('"', colon);
        if (valueStart == std::string::npos) break;
        valueStart++;
        
        // Find value end
        size_t valueEnd = json.find('"', valueStart);
        if (valueEnd == std::string::npos) break;
        
        std::string value = json.substr(valueStart, valueEnd - valueStart);
        
        result[key] = value;
        pos = valueEnd + 1;
    }
    
    return result;
}

/**
 * Escape special characters for JSON strings
 */
inline std::string escapeJson(const std::string& str) {
    std::ostringstream escaped;
    for (char c : str) {
        switch (c) {
            case '"':  escaped << "\\\""; break;
            case '\\': escaped << "\\\\"; break;
            case '\b': escaped << "\\b"; break;
            case '\f': escaped << "\\f"; break;
            case '\n': escaped << "\\n"; break;
            case '\r': escaped << "\\r"; break;
            case '\t': escaped << "\\t"; break;
            default:
                if (c < 32) {
                    escaped << "\\u" << std::hex << std::setw(4) << std::setfill('0') << (int)c;
                } else {
                    escaped << c;
                }
        }
    }
    return escaped.str();
}

/**
 * Create simple JSON object from key-value pairs
 */
inline std::string createJson(const std::map<std::string, std::string>& data) {
    std::ostringstream json;
    json << "{";
    
    bool first = true;
    for (const auto& pair : data) {
        if (!first) json << ",";
        json << "\"" << pair.first << "\":\"" << escapeJson(pair.second) << "\"";
        first = false;
    }
    
    json << "}";
    return json.str();
}

/**
 * Create JSON array from strings
 */
inline std::string createJsonArray(const std::vector<std::string>& items) {
    std::ostringstream json;
    json << "[";
    
    for (size_t i = 0; i < items.size(); i++) {
        if (i > 0) json << ",";
        json << "\"" << escapeJson(items[i]) << "\"";
    }
    
    json << "]";
    return json.str();
}

} // namespace JsonUtils

#endif // ENCHANTMENT_JSON_UTILS_HPP
