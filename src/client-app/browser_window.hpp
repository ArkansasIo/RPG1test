/**
 * Enchantment Game Engine - Browser Window
 * Embedded web browser for IDE interface
 */

#ifndef ENCHANTMENT_BROWSER_WINDOW_HPP
#define ENCHANTMENT_BROWSER_WINDOW_HPP

#include <string>

#ifdef _WIN32
    #include <windows.h>
#endif

/**
 * Browser window using embedded web view
 */
class BrowserWindow {
public:
    BrowserWindow(const std::string& title, int width, int height, const std::string& url);
    ~BrowserWindow();

    bool initialize();
    int run();
    void close();

    // Window properties
    void setTitle(const std::string& title);
    void setSize(int width, int height);
    void navigate(const std::string& url);
    void reload();

    // JavaScript execution
    void executeScript(const std::string& script);

private:
    std::string m_title;
    int m_width;
    int m_height;
    std::string m_url;
    bool m_initialized;

#ifdef _WIN32
    HWND m_hwnd;
    void* m_webview; // IWebBrowser2 interface
    
    static LRESULT CALLBACK WindowProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam);
    bool initializeWebView();
#else
    void* m_window; // Platform-specific window handle
    void* m_webview; // Platform-specific webview
#endif
};

#endif // ENCHANTMENT_BROWSER_WINDOW_HPP
