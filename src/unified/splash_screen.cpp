/**
 * Enchantment Game Engine - Splash Screen Implementation
 */

#include "splash_screen.hpp"
#include <iostream>
#include <thread>

#ifdef _WIN32
#include <windows.h>
#include <wingdi.h>

SplashScreen::SplashScreen()
    : m_visible(false)
    , m_progress(0)
    , m_hwnd(NULL)
    , m_logoBitmap(NULL)
{
}

SplashScreen::~SplashScreen() {
    hide();
}

LRESULT CALLBACK SplashScreen::WindowProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    SplashScreen* splash = nullptr;
    
    if (msg == WM_CREATE) {
        CREATESTRUCT* cs = (CREATESTRUCT*)lParam;
        splash = (SplashScreen*)cs->lpCreateParams;
        SetWindowLongPtr(hwnd, GWLP_USERDATA, (LONG_PTR)splash);
    } else {
        splash = (SplashScreen*)GetWindowLongPtr(hwnd, GWLP_USERDATA);
    }

    switch (msg) {
        case WM_PAINT: {
            PAINTSTRUCT ps;
            HDC hdc = BeginPaint(hwnd, &ps);
            if (splash) {
                splash->drawSplash(hdc);
            }
            EndPaint(hwnd, &ps);
            return 0;
        }
        
        case WM_ERASEBKGND:
            return 1; // Prevent flicker
    }

    return DefWindowProc(hwnd, msg, wParam, lParam);
}

void SplashScreen::createWindow() {
    // Register window class
    WNDCLASSEX wc = {};
    wc.cbSize = sizeof(WNDCLASSEX);
    wc.lpfnWndProc = WindowProc;
    wc.hInstance = GetModuleHandle(NULL);
    wc.lpszClassName = "EnchantmentSplashScreen";
    wc.hCursor = LoadCursor(NULL, IDC_ARROW);
    wc.hbrBackground = (HBRUSH)GetStockObject(BLACK_BRUSH);
    
    RegisterClassEx(&wc);

    // Get screen dimensions
    int screenWidth = GetSystemMetrics(SM_CXSCREEN);
    int screenHeight = GetSystemMetrics(SM_CYSCREEN);
    
    int width = 600;
    int height = 400;
    int x = (screenWidth - width) / 2;
    int y = (screenHeight - height) / 2;

    // Create window
    m_hwnd = CreateWindowEx(
        WS_EX_TOPMOST | WS_EX_TOOLWINDOW,
        "EnchantmentSplashScreen",
        "",
        WS_POPUP | WS_VISIBLE,
        x, y, width, height,
        NULL,
        NULL,
        GetModuleHandle(NULL),
        this
    );
}

void SplashScreen::drawLogo(HDC hdc, int x, int y, int width, int height) {
    // Draw dragon logo using GDI
    HPEN pen = CreatePen(PS_SOLID, 3, RGB(100, 200, 255));
    HPEN oldPen = (HPEN)SelectObject(hdc, pen);
    HBRUSH brush = CreateSolidBrush(RGB(50, 100, 150));
    HBRUSH oldBrush = (HBRUSH)SelectObject(hdc, brush);

    // Dragon head outline
    int centerX = x + width / 2;
    int centerY = y + height / 2;
    
    // Head
    Ellipse(hdc, centerX - 60, centerY - 40, centerX + 60, centerY + 40);
    
    // Eyes
    HBRUSH eyeBrush = CreateSolidBrush(RGB(255, 200, 0));
    SelectObject(hdc, eyeBrush);
    Ellipse(hdc, centerX - 30, centerY - 15, centerX - 10, centerY + 5);
    Ellipse(hdc, centerX + 10, centerY - 15, centerX + 30, centerY + 5);
    DeleteObject(eyeBrush);
    
    // Horns
    SelectObject(hdc, brush);
    POINT horn1[] = {
        {centerX - 50, centerY - 40},
        {centerX - 60, centerY - 70},
        {centerX - 40, centerY - 45}
    };
    Polygon(hdc, horn1, 3);
    
    POINT horn2[] = {
        {centerX + 50, centerY - 40},
        {centerX + 60, centerY - 70},
        {centerX + 40, centerY - 45}
    };
    Polygon(hdc, horn2, 3);
    
    // Nostrils
    HBRUSH nostrilBrush = CreateSolidBrush(RGB(30, 60, 90));
    SelectObject(hdc, nostrilBrush);
    Ellipse(hdc, centerX - 20, centerY + 15, centerX - 10, centerY + 25);
    Ellipse(hdc, centerX + 10, centerY + 15, centerX + 20, centerY + 25);
    DeleteObject(nostrilBrush);

    SelectObject(hdc, oldPen);
    SelectObject(hdc, oldBrush);
    DeleteObject(pen);
    DeleteObject(brush);
}

void SplashScreen::drawSplash(HDC hdc) {
    RECT rect;
    GetClientRect(m_hwnd, &rect);
    
    // Background gradient
    TRIVERTEX vertices[2] = {
        {0, 0, 0x1000, 0x1800, 0x2200, 0xFF00},
        {rect.right, rect.bottom, 0x0800, 0x1000, 0x1800, 0xFF00}
    };
    GRADIENT_RECT gradRect = {0, 1};
    GradientFill(hdc, vertices, 2, &gradRect, 1, GRADIENT_FILL_RECT_V);
    
    // Draw logo
    drawLogo(hdc, rect.right / 2 - 100, 50, 200, 150);
    
    // Title
    SetBkMode(hdc, TRANSPARENT);
    SetTextColor(hdc, RGB(100, 200, 255));
    
    HFONT titleFont = CreateFont(
        36, 0, 0, 0, FW_BOLD, FALSE, FALSE, FALSE,
        DEFAULT_CHARSET, OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS,
        ANTIALIASED_QUALITY, DEFAULT_PITCH | FF_DONTCARE,
        "Segoe UI"
    );
    HFONT oldFont = (HFONT)SelectObject(hdc, titleFont);
    
    RECT titleRect = {0, 220, rect.right, 260};
    DrawText(hdc, "ENCHANTMENT ENGINE", -1, &titleRect, DT_CENTER | DT_VCENTER | DT_SINGLELINE);
    
    // Subtitle
    SetTextColor(hdc, RGB(150, 200, 255));
    HFONT subtitleFont = CreateFont(
        16, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE,
        DEFAULT_CHARSET, OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS,
        ANTIALIASED_QUALITY, DEFAULT_PITCH | FF_DONTCARE,
        "Segoe UI"
    );
    SelectObject(hdc, subtitleFont);
    
    RECT subtitleRect = {0, 260, rect.right, 285};
    DrawText(hdc, "Game Boy Color Development Suite", -1, &subtitleRect, DT_CENTER | DT_VCENTER | DT_SINGLELINE);
    
    // Status text
    if (!m_status.empty()) {
        SetTextColor(hdc, RGB(200, 220, 255));
        RECT statusRect = {0, 310, rect.right, 335};
        DrawText(hdc, m_status.c_str(), -1, &statusRect, DT_CENTER | DT_VCENTER | DT_SINGLELINE);
    }
    
    // Progress bar
    int barWidth = 400;
    int barHeight = 8;
    int barX = (rect.right - barWidth) / 2;
    int barY = 350;
    
    // Background
    HBRUSH barBgBrush = CreateSolidBrush(RGB(30, 50, 70));
    RECT barBgRect = {barX, barY, barX + barWidth, barY + barHeight};
    FillRect(hdc, &barBgRect, barBgBrush);
    DeleteObject(barBgBrush);
    
    // Progress
    if (m_progress > 0) {
        int progressWidth = (barWidth * m_progress) / 100;
        HBRUSH progressBrush = CreateSolidBrush(RGB(100, 200, 255));
        RECT progressRect = {barX, barY, barX + progressWidth, barY + barHeight};
        FillRect(hdc, &progressRect, progressBrush);
        DeleteObject(progressBrush);
    }
    
    // Version
    SetTextColor(hdc, RGB(100, 120, 140));
    HFONT versionFont = CreateFont(
        12, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE,
        DEFAULT_CHARSET, OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS,
        ANTIALIASED_QUALITY, DEFAULT_PITCH | FF_DONTCARE,
        "Segoe UI"
    );
    SelectObject(hdc, versionFont);
    
    RECT versionRect = {0, rect.bottom - 30, rect.right, rect.bottom - 10};
    DrawText(hdc, "Version 3.0.0", -1, &versionRect, DT_CENTER | DT_VCENTER | DT_SINGLELINE);
    
    SelectObject(hdc, oldFont);
    DeleteObject(titleFont);
    DeleteObject(subtitleFont);
    DeleteObject(versionFont);
}

void SplashScreen::show() {
    if (m_visible) return;
    
    createWindow();
    
    if (m_hwnd) {
        ShowWindow(m_hwnd, SW_SHOW);
        UpdateWindow(m_hwnd);
        m_visible = true;
        
        // Process messages to show window
        MSG msg;
        while (PeekMessage(&msg, m_hwnd, 0, 0, PM_REMOVE)) {
            TranslateMessage(&msg);
            DispatchMessage(&msg);
        }
    }
}

void SplashScreen::hide() {
    if (!m_visible) return;
    
    if (m_hwnd) {
        DestroyWindow(m_hwnd);
        m_hwnd = NULL;
    }
    
    m_visible = false;
}

void SplashScreen::setStatus(const std::string& status) {
    m_status = status;
    
    if (m_hwnd && m_visible) {
        InvalidateRect(m_hwnd, NULL, FALSE);
        UpdateWindow(m_hwnd);
        
        // Process messages
        MSG msg;
        while (PeekMessage(&msg, m_hwnd, 0, 0, PM_REMOVE)) {
            TranslateMessage(&msg);
            DispatchMessage(&msg);
        }
    }
}

void SplashScreen::setProgress(int percent) {
    m_progress = percent;
    
    if (m_hwnd && m_visible) {
        InvalidateRect(m_hwnd, NULL, FALSE);
        UpdateWindow(m_hwnd);
    }
}

#else
// Linux/macOS implementation

SplashScreen::SplashScreen()
    : m_visible(false)
    , m_progress(0)
    , m_window(nullptr)
{
}

SplashScreen::~SplashScreen() {
    hide();
}

void SplashScreen::show() {
    m_visible = true;
    std::cout << "\n";
    std::cout << "╔═══════════════════════════════════════════════════════╗\n";
    std::cout << "║                                                       ║\n";
    std::cout << "║              🐉 ENCHANTMENT ENGINE 🐉                 ║\n";
    std::cout << "║         Game Boy Color Development Suite             ║\n";
    std::cout << "║                                                       ║\n";
    std::cout << "╚═══════════════════════════════════════════════════════╝\n";
    std::cout << "\n";
}

void SplashScreen::hide() {
    m_visible = false;
}

void SplashScreen::setStatus(const std::string& status) {
    m_status = status;
    if (m_visible) {
        std::cout << "  " << status << std::endl;
    }
}

void SplashScreen::setProgress(int percent) {
    m_progress = percent;
}

#endif
