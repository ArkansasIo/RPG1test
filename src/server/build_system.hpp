/**
 * Enchantment Game Engine - Build System
 * Handles compilation and linking of Game Boy Color ROM
 */

#ifndef ENCHANTMENT_BUILD_SYSTEM_HPP
#define ENCHANTMENT_BUILD_SYSTEM_HPP

#include <string>
#include <vector>
#include <map>

/**
 * Build configuration
 */
struct BuildConfig {
    std::string gbdkPath;
    std::string projectName;
    int romBanks;
    int ramBanks;
    int cartType;
    bool debugMode;
    std::vector<std::string> sourceDirs;
    std::vector<std::string> includeDirs;
    std::string outputDir;
};

/**
 * Build result
 */
struct BuildResult {
    bool success;
    std::string output;
    std::vector<std::string> errors;
    std::vector<std::string> warnings;
    double buildTime;
};

/**
 * Build system for compiling Game Boy Color ROMs
 */
class BuildSystem {
public:
    explicit BuildSystem(const std::string& projectRoot);
    
    // Build operations
    std::string buildRom();
    std::string buildAssets();
    std::string buildAll();
    std::string clean();
    
    // Configuration
    void setConfig(const BuildConfig& config);
    BuildConfig getConfig() const { return m_config; }
    
    // Build info
    BuildResult getLastBuildResult() const { return m_lastResult; }
    std::string getRomPath() const;
    bool isRomBuilt() const;
    
private:
    std::string m_projectRoot;
    BuildConfig m_config;
    BuildResult m_lastResult;
    
    // Build steps
    bool compileSource(const std::string& sourceFile, std::string& output);
    bool linkObjects(const std::vector<std::string>& objectFiles, std::string& output);
    bool runMake(const std::string& target, std::string& output);
    
    // Utilities
    std::vector<std::string> findSourceFiles();
    std::string executeCommand(const std::string& command);
    void parseCompilerOutput(const std::string& output, BuildResult& result);
    void loadDefaultConfig();
};

#endif // ENCHANTMENT_BUILD_SYSTEM_HPP
