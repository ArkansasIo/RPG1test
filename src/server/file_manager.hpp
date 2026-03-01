/**
 * Enchantment Game Engine - File Manager
 * Handles file I/O operations for the project
 */

#ifndef ENCHANTMENT_FILE_MANAGER_HPP
#define ENCHANTMENT_FILE_MANAGER_HPP

#include <string>
#include <vector>
#include <filesystem>

namespace fs = std::filesystem;

/**
 * File manager for project file operations
 */
class FileManager {
public:
    explicit FileManager(const std::string& projectRoot);
    
    // File operations
    std::string readFile(const std::string& relativePath);
    std::vector<uint8_t> readBinaryFile(const std::string& relativePath);
    void writeFile(const std::string& relativePath, const std::string& content);
    void writeBinaryFile(const std::string& relativePath, const std::vector<uint8_t>& data);
    bool fileExists(const std::string& relativePath);
    void deleteFile(const std::string& relativePath);
    
    // Directory operations
    std::vector<std::string> listFiles(const std::string& directory, bool recursive = false);
    std::vector<std::string> listDirectories(const std::string& directory);
    void createDirectory(const std::string& relativePath);
    bool directoryExists(const std::string& relativePath);
    
    // Path operations
    std::string getAbsolutePath(const std::string& relativePath);
    std::string getRelativePath(const std::string& absolutePath);
    std::string getProjectRoot() const { return m_projectRoot.string(); }
    
    // File info
    size_t getFileSize(const std::string& relativePath);
    std::string getFileExtension(const std::string& path);
    std::string getFileName(const std::string& path);
    std::string getDirectory(const std::string& path);

private:
    fs::path m_projectRoot;
    
    void validatePath(const std::string& relativePath);
    fs::path resolvePath(const std::string& relativePath);
};

#endif // ENCHANTMENT_FILE_MANAGER_HPP
