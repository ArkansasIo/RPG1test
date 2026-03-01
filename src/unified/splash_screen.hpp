/**
 * Enchantment Game Engine - Splash Screen
 * Startup splash screen with logo and progress
 */

#ifndef ENCHANTMENT_SPLASH_SCREEN_HPP
#define ENCHANTMENT_SPLASH_SCREEN_HPP

#include <string>

#ifdef _WIN32
    #include <windows.h>
#endif

/**
 * Splash screen displayed during application startup
 */
class SplashScreen {
public:
    SplashScreen();
    ~SplashScreen();

    void show();
    void hide();
    void setStatus(const std::string& status);
    void setProgress(int percent);

private:
    bool m_visible;
    std::string m_status;
    int m_progress;

#ifdef _WIN32
    HWND m_hwnd;
    HBITMAP m_logoBitmap;
    
    static LRESULT CALLBACK WindowProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam);
    void createWindow();
    void drawSplash(HDC hdc);
    void drawLogo(HDC hdc, int x, int y, int width, int height);
#else
    void* m_window;
#endif
};

#endif // ENCHANTMENT_SPLASH_SCREEN_HPP
