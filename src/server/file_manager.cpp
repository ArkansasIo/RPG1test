/**
 * Enchantment Game Engine - File Manager Implementation
 */

#include "file_manager.hpp"
#include <fstream>
#include <sstream>
#include <stdexcept>
#include <algorithm>

FileManager::FileManager(const std::string& projectRoot)
    : m_projectRoot(fs::absolute(projectRoot))
{
    if (!fs::exists(m_projectRoot)) {
        throw std::runtime_error("Project root does not exist: " + projectRoot);
    }
    if (!fs::is_directory(m_projectRoot)) {
        throw std::runtime_error("Project root is not a directory: " + projectRoot);
    }
}

void FileManager::validatePath(const std::string& relativePath) {
    // Prevent directory traversal attacks
    if (relativePath.find("..") != std::string::npos) {
        throw std::runtime_error("Invalid path: contains '..'");
    }
}

fs::path FileManager::resolvePath(const std::string& relativePath) {
    validatePath(relativePath);
    return m_projectRoot / relativePath;
}

std::string FileManager::readFile(const std::string& relativePath) {
    fs::path fullPath = resolvePath(relativePath);
    
    if (!fs::exists(fullPath)) {
        throw std::runtime_error("File not found: " + relativePath);
    }
    
    std::ifstream file(fullPath, std::ios::in);
    if (!file.is_open()) {
        throw std::runtime_error("Failed to open file: " + relativePath);
    }
    
    std::ostringstream content;
    content << file.rdbuf();
    return content.str();
}

std::vector<uint8_t> FileManager::readBinaryFile(const std::string& relativePath) {
    fs::path fullPath = resolvePath(relativePath);
    
    if (!fs::exists(fullPath)) {
        throw std::runtime_error("File not found: " + relativePath);
    }
    
    std::ifstream file(fullPath, std::ios::binary | std::ios::ate);
    if (!file.is_open()) {
        throw std::runtime_error("Failed to open file: " + relativePath);
    }
    
    std::streamsize size = file.tellg();
    file.seekg(0, std::ios::beg);
    
    std::vector<uint8_t> buffer(size);
    if (!file.read((char*)buffer.data(), size)) {
        throw std::runtime_error("Failed to read file: " + relativePath);
    }
    
    return buffer;
}

void FileManager::writeFile(const std::string& relativePath, const std::string& content) {
    fs::path fullPath = resolvePath(relativePath);
    
    // Create parent directories if they don't exist
    fs::path parentPath = fullPath.parent_path();
    if (!fs::exists(parentPath)) {
        fs::create_directories(parentPath);
    }
    
    std::ofstream file(fullPath, std::ios::out | std::ios::trunc);
    if (!file.is_open()) {
        throw std::runtime_error("Failed to open file for writing: " + relativePath);
    }
    
    file << content;
}

void FileManager::writeBinaryFile(const std::string& relativePath, const std::vector<uint8_t>& data) {
    fs::path fullPath = resolvePath(relativePath);
    
    // Create parent directories if they don't exist
    fs::path parentPath = fullPath.parent_path();
    if (!fs::exists(parentPath)) {
        fs::create_directories(parentPath);
    }
    
    std::ofstream file(fullPath, std::ios::binary | std::ios::trunc);
    if (!file.is_open()) {
        throw std::runtime_error("Failed to open file for writing: " + relativePath);
    }
    
    file.write((char*)data.data(), data.size());
}

bool FileManager::fileExists(const std::string& relativePath) {
    fs::path fullPath = resolvePath(relativePath);
    return fs::exists(fullPath) && fs::is_regular_file(fullPath);
}

void FileManager::deleteFile(const std::string& relativePath) {
    fs::path fullPath = resolvePath(relativePath);
    
    if (!fs::exists(fullPath)) {
        throw std::runtime_error("File not found: " + relativePath);
    }
    
    fs::remove(fullPath);
}

std::vector<std::string> FileManager::listFiles(const std::string& directory, bool recursive) {
    fs::path dirPath = resolvePath(directory);
    std::vector<std::string> files;
    
    if (!fs::exists(dirPath) || !fs::is_directory(dirPath)) {
        return files;
    }
    
    if (recursive) {
        for (const auto& entry : fs::recursive_directory_iterator(dirPath)) {
            if (entry.is_regular_file()) {
                fs::path relativePath = fs::relative(entry.path(), m_projectRoot);
                files.push_back(relativePath.string());
            }
        }
    } else {
        for (const auto& entry : fs::directory_iterator(dirPath)) {
            if (entry.is_regular_file()) {
                fs::path relativePath = fs::relative(entry.path(), m_projectRoot);
                files.push_back(relativePath.string());
            }
        }
    }
    
    std::sort(files.begin(), files.end());
    return files;
}

std::vector<std::string> FileManager::listDirectories(const std::string& directory) {
    fs::path dirPath = resolvePath(directory);
    std::vector<std::string> directories;
    
    if (!fs::exists(dirPath) || !fs::is_directory(dirPath)) {
        return directories;
    }
    
    for (const auto& entry : fs::directory_iterator(dirPath)) {
        if (entry.is_directory()) {
            fs::path relativePath = fs::relative(entry.path(), m_projectRoot);
            directories.push_back(relativePath.string());
        }
    }
    
    std::sort(directories.begin(), directories.end());
    return directories;
}

void FileManager::createDirectory(const std::string& relativePath) {
    fs::path fullPath = resolvePath(relativePath);
    fs::create_directories(fullPath);
}

bool FileManager::directoryExists(const std::string& relativePath) {
    fs::path fullPath = resolvePath(relativePath);
    return fs::exists(fullPath) && fs::is_directory(fullPath);
}

std::string FileManager::getAbsolutePath(const std::string& relativePath) {
    return resolvePath(relativePath).string();
}

std::string FileManager::getRelativePath(const std::string& absolutePath) {
    fs::path absPath(absolutePath);
    fs::path relativePath = fs::relative(absPath, m_projectRoot);
    return relativePath.string();
}

size_t FileManager::getFileSize(const std::string& relativePath) {
    fs::path fullPath = resolvePath(relativePath);
    
    if (!fs::exists(fullPath)) {
        throw std::runtime_error("File not found: " + relativePath);
    }
    
    return fs::file_size(fullPath);
}

std::string FileManager::getFileExtension(const std::string& path) {
    fs::path p(path);
    return p.extension().string();
}

std::string FileManager::getFileName(const std::string& path) {
    fs::path p(path);
    return p.filename().string();
}

std::string FileManager::getDirectory(const std::string& path) {
    fs::path p(path);
    return p.parent_path().string();
}
