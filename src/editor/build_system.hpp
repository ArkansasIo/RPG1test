/**
 * Enchantment Engine - Build System
 */

#pragma once

#include <string>
#include <vector>
#include <functional>

enum class BuildResult {
    Success,
    Failed,
    Cancelled
};

struct BuildConfig {
    std::string projectPath;
    std::string outputPath;
    std::string targetName;
    std::string buildType;  // "Debug" or "Release"
    bool verbose;
    std::vector<std::string> defines;
    std::vector<std::string> includePaths;
};

class BuildSystem {
public:
    BuildSystem(const std::string& projectPath);
    ~BuildSystem();
    
    // Build operations
    BuildResult build();
    BuildResult rebuild();
    BuildResult clean();
    void cancel();
    
    // Configuration
    void setConfig(const BuildConfig& config);
    BuildConfig getConfig() const;
    
    // Output callback
    using OutputCallback = std::function<void(const std::string&)>;
    void setOutputCallback(OutputCallback callback);
    
    // Status
    bool isBuilding() const;
    int getProgress() const;
    std::string getStatus() const;
    
private:
    BuildConfig m_config;
    OutputCallback m_outputCallback;
    bool m_building;
    bool m_cancelled;
    int m_progress;
    std::string m_status;
    
    // Build steps
    bool compileSource(const std::string& file);
    bool linkObjects();
    bool generateROM();
    
    // Utilities
    void output(const std::string& message);
    std::vector<std::string> findSourceFiles();
    std::string getObjectFile(const std::string& sourceFile);
};
