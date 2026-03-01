/**
 * Enchantment Engine - Code Editor Component
 */

#pragma once

#include <string>
#include <vector>

class CodeEditor {
public:
    CodeEditor();
    ~CodeEditor();
    
    // File operations
    bool loadFile(const std::string& path);
    bool saveFile(const std::string& path);
    void newFile();
    
    // Edit operations
    void undo();
    void redo();
    void cut();
    void copy();
    void paste();
    void selectAll();
    
    // Search operations
    void find(const std::string& text);
    void replace(const std::string& find, const std::string& replace);
    void goToLine(int line);
    
    // Syntax highlighting
    void setSyntaxHighlighting(bool enabled);
    void setLanguage(const std::string& language);
    
    // Settings
    void setFontSize(int size);
    void setTabSize(int size);
    void setWordWrap(bool enabled);
    void setLineNumbers(bool enabled);
    
private:
    std::string m_content;
    std::string m_filePath;
    std::vector<std::string> m_undoStack;
    std::vector<std::string> m_redoStack;
    bool m_modified;
    int m_fontSize;
    int m_tabSize;
    bool m_wordWrap;
    bool m_lineNumbers;
};
