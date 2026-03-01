/**
 * Enchantment Game Engine - Build System Implementation
 */

#include "build_system.hpp"
#include <iostream>
#include <sstream>
#include <fstream>
#include <chrono>
#include <cstdlib>
#include <filesystem>

#ifdef _WIN32
    #include <windows.h>
#else
    #include <unistd.h>
#endif

namespace fs = std::filesystem;

BuildSystem::BuildSystem(const std::string& projectRoot)
    : m_projectRoot(projectRoot)
{
    loadDefaultConfig();
}

void BuildSystem::loadDefaultConfig() {
    m_config.projectName = "LabyrinthOfTheDragon";
    m_config.romBanks = 32;
    m_config.ramBanks = 4;
    m_config.cartType = 0x1B; // MBC5+RAM+BATTERY
    m_config.debugMode = false;
    m_config.sourceDirs = {"src", "data"};
    m_config.includeDirs = {"src"};
    m_config.outputDir = "obj";
    
    // Try to find GBDK installation
    const char* gbdkHome = std::getenv("GBDK_HOME");
    if (gbdkHome) {
        m_config.gbdkPath = gbdkHome;
    } else {
#ifdef _WIN32
        m_config.gbdkPath = "C:/gbdk";
#else
        m_config.gbdkPath = std::string(std::getenv("HOME")) + "/gbdk";
#endif
    }
}

void BuildSystem::setConfig(const BuildConfig& config) {
    m_config = config;
}

std::string BuildSystem::buildRom() {
    auto startTime = std::chrono::high_resolution_clock::now();
    
    std::ostringstream output;
    output << "=== Building ROM ===\n";
    output << "Project: " << m_config.projectName << "\n";
    output << "GBDK Path: " << m_config.gbdkPath << "\n\n";
    
    // Check if GBDK exists
    if (!fs::exists(m_config.gbdkPath)) {
        output << "ERROR: GBDK not found at " << m_config.gbdkPath << "\n";
        output << "Please install GBDK-2020 or set GBDK_HOME environment variable\n";
        m_lastResult.success = false;
        m_lastResult.output = output.str();
        return output.str();
    }
    
    // Run make
    std::string makeOutput;
    bool success = runMake("", makeOutput);
    output << makeOutput;
    
    auto endTime = std::chrono::high_resolution_clock::now();
    double buildTime = std::chrono::duration<double>(endTime - startTime).count();
    
    if (success) {
        output << "\n=== Build Successful ===\n";
        output << "ROM: " << getRomPath() << "\n";
        output << "Build time: " << buildTime << " seconds\n";
    } else {
        output << "\n=== Build Failed ===\n";
    }
    
    m_lastResult.success = success;
    m_lastResult.output = output.str();
    m_lastResult.buildTime = buildTime;
    
    return output.str();
}

std::string BuildSystem::buildAssets() {
    std::ostringstream output;
    output << "=== Building Assets ===\n\n";
    
    std::string makeOutput;
    bool success = runMake("assets", makeOutput);
    output << makeOutput;
    
    if (success) {
        output << "\n=== Assets Built Successfully ===\n";
    } else {
        output << "\n=== Asset Build Failed ===\n";
    }
    
    return output.str();
}

std::string BuildSystem::buildAll() {
    std::ostringstream output;
    output << "=== Building All ===\n\n";
    
    // Build assets first
    output << buildAssets();
    output << "\n";
    
    // Then build ROM
    output << buildRom();
    
    return output.str();
}

std::string BuildSystem::clean() {
    std::ostringstream output;
    output << "=== Cleaning Build ===\n\n";
    
    std::string makeOutput;
    runMake("clean", makeOutput);
    output << makeOutput;
    
    output << "\n=== Clean Complete ===\n";
    return output.str();
}

bool BuildSystem::runMake(const std::string& target, std::string& output) {
    std::ostringstream command;
    
#ifdef _WIN32
    command << "cd /d \"" << m_projectRoot << "\" && ";
    command << "set GBDK_HOME=" << m_config.gbdkPath << " && ";
    command << "make " << target << " 2>&1";
#else
    command << "cd \"" << m_projectRoot << "\" && ";
    command << "export GBDK_HOME=" << m_config.gbdkPath << " && ";
    command << "make " << target << " 2>&1";
#endif
    
    output = executeCommand(command.str());
    
    // Check if build was successful
    return output.find("Error") == std::string::npos &&
           output.find("error:") == std::string::npos;
}

std::string BuildSystem::executeCommand(const std::string& command) {
    std::ostringstream output;
    
#ifdef _WIN32
    FILE* pipe = _popen(command.c_str(), "r");
#else
    FILE* pipe = popen(command.c_str(), "r");
#endif
    
    if (!pipe) {
        return "ERROR: Failed to execute command\n";
    }
    
    char buffer[256];
    while (fgets(buffer, sizeof(buffer), pipe) != nullptr) {
        output << buffer;
    }
    
#ifdef _WIN32
    _pclose(pipe);
#else
    pclose(pipe);
#endif
    
    return output.str();
}

std::vector<std::string> BuildSystem::findSourceFiles() {
    std::vector<std::string> sourceFiles;
    
    for (const auto& dir : m_config.sourceDirs) {
        fs::path dirPath = fs::path(m_projectRoot) / dir;
        
        if (!fs::exists(dirPath)) continue;
        
        for (const auto& entry : fs::recursive_directory_iterator(dirPath)) {
            if (entry.is_regular_file()) {
                std::string ext = entry.path().extension().string();
                if (ext == ".c" || ext == ".cpp") {
                    sourceFiles.push_back(entry.path().string());
                }
            }
        }
    }
    
    return sourceFiles;
}

void BuildSystem::parseCompilerOutput(const std::string& output, BuildResult& result) {
    std::istringstream stream(output);
    std::string line;
    
    while (std::getline(stream, line)) {
        if (line.find("error:") != std::string::npos ||
            line.find("Error") != std::string::npos) {
            result.errors.push_back(line);
        } else if (line.find("warning:") != std::string::npos ||
                   line.find("Warning") != std::string::npos) {
            result.warnings.push_back(line);
        }
    }
}

std::string BuildSystem::getRomPath() const {
    return m_projectRoot + "/" + m_config.projectName + ".gbc";
}

bool BuildSystem::isRomBuilt() const {
    return fs::exists(getRomPath());
}

bool BuildSystem::compileSource(const std::string& sourceFile, std::string& output) {
    std::ostringstream command;
    
    fs::path sourcePath(sourceFile);
    fs::path objectPath = fs::path(m_config.outputDir) / sourcePath.filename().replace_extension(".o");
    
    command << m_config.gbdkPath << "/bin/lcc ";
    command << "-c ";
    
    for (const auto& includeDir : m_config.includeDirs) {
        command << "-I" << includeDir << " ";
    }
    
    if (m_config.debugMode) {
        command << "-debug ";
    }
    
    command << "-o " << objectPath.string() << " ";
    command << sourceFile;
    
    output = executeCommand(command.str());
    
    return output.find("error:") == std::string::npos;
}

bool BuildSystem::linkObjects(const std::vector<std::string>& objectFiles, std::string& output) {
    std::ostringstream command;
    
    command << m_config.gbdkPath << "/bin/lcc ";
    command << "-Wm-yC ";
    command << "-Wm-yt" << std::hex << m_config.cartType << " ";
    command << "-Wl-yo" << std::dec << m_config.romBanks << " ";
    command << "-Wl-ya" << m_config.ramBanks << " ";
    command << "-o " << getRomPath() << " ";
    
    for (const auto& objFile : objectFiles) {
        command << objFile << " ";
    }
    
    output = executeCommand(command.str());
    
    return output.find("error:") == std::string::npos;
}
