/**
 * Enchantment Game Engine - Browser Window Implementation
 * Uses webview library for cross-platform embedded browser
 */

#include "browser_window.hpp"
#include <iostream>

// Include webview library (header-only)
#define WEBVIEW_HEADER
#ifdef _WIN32
    #define WEBVIEW_WIN
#elif defined(__APPLE__)
    #define WEBVIEW_COCOA
#else
    #define WEBVIEW_GTK
#endif

// Simple webview implementation for Windows
#ifdef _WIN32
#include <windows.h>
#include <commctrl.h>
#include <exdisp.h>
#include <mshtml.h>
#include <mshtmhst.h>
#include <shobjidl.h>

#pragma comment(lib, "ole32.lib")
#pragma comment(lib, "oleaut32.lib")
#pragma comment(lib, "uuid.lib")
#pragma comment(lib, "comctl32.lib")
#endif

BrowserWindow::BrowserWindow(const std::string& title, int width, int height, const std::string& url)
    : m_title(title)
    , m_width(width)
    , m_height(height)
    , m_url(url)
    , m_initialized(false)
#ifdef _WIN32
    , m_hwnd(NULL)
    , m_webview(nullptr)
#else
    , m_window(nullptr)
    , m_webview(nullptr)
#endif
{
}

BrowserWindow::~BrowserWindow() {
    close();
}

#ifdef _WIN32

LRESULT CALLBACK BrowserWindow::WindowProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    BrowserWindow* window = nullptr;
    
    if (msg == WM_CREATE) {
        CREATESTRUCT* cs = (CREATESTRUCT*)lParam;
        window = (BrowserWindow*)cs->lpCreateParams;
        SetWindowLongPtr(hwnd, GWLP_USERDATA, (LONG_PTR)window);
    } else {
        window = (BrowserWindow*)GetWindowLongPtr(hwnd, GWLP_USERDATA);
    }

    switch (msg) {
        case WM_SIZE:
            if (window && window->m_webview) {
                RECT rect;
                GetClientRect(hwnd, &rect);
                // Resize webview
            }
            return 0;

        case WM_DESTROY:
            PostQuitMessage(0);
            return 0;
    }

    return DefWindowProc(hwnd, msg, wParam, lParam);
}

bool BrowserWindow::initialize() {
    std::cout << "Initializing browser window..." << std::endl;

    // Initialize COM
    CoInitializeEx(NULL, COINIT_APARTMENTTHREADED);

    // Register window class
    WNDCLASSEX wc = {};
    wc.cbSize = sizeof(WNDCLASSEX);
    wc.lpfnWndProc = WindowProc;
    wc.hInstance = GetModuleHandle(NULL);
    wc.lpszClassName = "EnchantmentEngineWindow";
    wc.hCursor = LoadCursor(NULL, IDC_ARROW);
    wc.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
    
    RegisterClassEx(&wc);

    // Create window
    m_hwnd = CreateWindowEx(
        0,
        "EnchantmentEngineWindow",
        m_title.c_str(),
        WS_OVERLAPPEDWINDOW,
        CW_USEDEFAULT, CW_USEDEFAULT,
        m_width, m_height,
        NULL,
        NULL,
        GetModuleHandle(NULL),
        this
    );

    if (!m_hwnd) {
        std::cerr << "Failed to create window" << std::endl;
        return false;
    }

    ShowWindow(m_hwnd, SW_SHOW);
    UpdateWindow(m_hwnd);

    m_initialized = true;

    // Navigate to URL
    navigate(m_url);

    return true;
}

int BrowserWindow::run() {
    if (!m_initialized) {
        return 1;
    }

    MSG msg;
    while (GetMessage(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }

    return (int)msg.wParam;
}

void BrowserWindow::close() {
    if (m_hwnd) {
        DestroyWindow(m_hwnd);
        m_hwnd = NULL;
    }
    
    CoUninitialize();
    m_initialized = false;
}

void BrowserWindow::setTitle(const std::string& title) {
    m_title = title;
    if (m_hwnd) {
        SetWindowTextA(m_hwnd, title.c_str());
    }
}

void BrowserWindow::setSize(int width, int height) {
    m_width = width;
    m_height = height;
    if (m_hwnd) {
        SetWindowPos(m_hwnd, NULL, 0, 0, width, height, SWP_NOMOVE | SWP_NOZORDER);
    }
}

void BrowserWindow::navigate(const std::string& url) {
    m_url = url;
    
    // For now, launch default browser
    // In production, would use embedded WebView2 or CEF
    ShellExecuteA(NULL, "open", url.c_str(), NULL, NULL, SW_SHOWNORMAL);
}

void BrowserWindow::reload() {
    navigate(m_url);
}

void BrowserWindow::executeScript(const std::string& script) {
    // Would execute JavaScript in embedded browser
    std::cout << "Execute script: " << script << std::endl;
}

#else
// Linux/macOS implementation would use WebKitGTK or WebKit

bool BrowserWindow::initialize() {
    std::cout << "Initializing browser window..." << std::endl;
    
    // Open URL in default browser for now
    std::string command = "xdg-open " + m_url;
    system(command.c_str());
    
    m_initialized = true;
    return true;
}

int BrowserWindow::run() {
    // Keep application running
    std::cout << "Press Enter to exit..." << std::endl;
    std::cin.get();
    return 0;
}

void BrowserWindow::close() {
    m_initialized = false;
}

void BrowserWindow::setTitle(const std::string& title) {
    m_title = title;
}

void BrowserWindow::setSize(int width, int height) {
    m_width = width;
    m_height = height;
}

void BrowserWindow::navigate(const std::string& url) {
    m_url = url;
}

void BrowserWindow::reload() {
}

void BrowserWindow::executeScript(const std::string& script) {
}

#endif
