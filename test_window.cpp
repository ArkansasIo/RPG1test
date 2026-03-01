#include <windows.h>
#include <iostream>

LRESULT CALLBACK WindowProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    switch (msg) {
        case WM_CREATE: {
            std::cout << "WM_CREATE received" << std::endl;
            
            // Create a button
            HWND button = CreateWindowA("BUTTON", "Click Me!",
                WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
                50, 50, 200, 50,
                hwnd, (HMENU)1, GetModuleHandle(NULL), NULL);
            
            if (button) {
                std::cout << "Button created successfully" << std::endl;
            } else {
                std::cout << "Button creation failed: " << GetLastError() << std::endl;
            }
            
            // Create a label
            HWND label = CreateWindowA("STATIC", "Hello from Enchantment Engine!",
                WS_CHILD | WS_VISIBLE | SS_CENTER,
                50, 120, 400, 30,
                hwnd, NULL, GetModuleHandle(NULL), NULL);
            
            if (label) {
                std::cout << "Label created successfully" << std::endl;
            } else {
                std::cout << "Label creation failed: " << GetLastError() << std::endl;
            }
            
            return 0;
        }
            
        case WM_COMMAND:
            if (LOWORD(wParam) == 1) {
                MessageBoxA(hwnd, "Button clicked!", "Test", MB_OK);
            }
            return 0;
            
        case WM_PAINT: {
            PAINTSTRUCT ps;
            HDC hdc = BeginPaint(hwnd, &ps);
            
            // Draw background
            RECT rect;
            GetClientRect(hwnd, &rect);
            HBRUSH brush = CreateSolidBrush(RGB(240, 240, 240));
            FillRect(hdc, &rect, brush);
            DeleteObject(brush);
            
            // Draw text
            SetBkMode(hdc, TRANSPARENT);
            SetTextColor(hdc, RGB(0, 0, 0));
            TextOutA(hdc, 50, 200, "If you see this, painting works!", 34);
            
            EndPaint(hwnd, &ps);
            return 0;
        }
        
        case WM_DESTROY:
            std::cout << "WM_DESTROY received" << std::endl;
            PostQuitMessage(0);
            return 0;
    }
    
    return DefWindowProc(hwnd, msg, wParam, lParam);
}

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
    // Allocate console for debug output
    AllocConsole();
    FILE* fp;
    freopen_s(&fp, "CONOUT$", "w", stdout);
    freopen_s(&fp, "CONOUT$", "w", stderr);
    
    std::cout << "=== Enchantment Engine - Window Test ===" << std::endl;
    std::cout << "Starting window creation..." << std::endl;
    
    // Register window class
    WNDCLASSA wc = {};
    wc.lpfnWndProc = WindowProc;
    wc.hInstance = hInstance;
    wc.lpszClassName = "TestWindow";
    wc.hCursor = LoadCursor(NULL, IDC_ARROW);
    wc.hbrBackground = CreateSolidBrush(RGB(240, 240, 240));
    wc.style = CS_HREDRAW | CS_VREDRAW;
    
    if (!RegisterClassA(&wc)) {
        std::cout << "RegisterClass failed: " << GetLastError() << std::endl;
        return 1;
    }
    
    std::cout << "Window class registered" << std::endl;
    
    // Create window
    HWND hwnd = CreateWindowExA(
        0,
        "TestWindow",
        "Enchantment Engine - Test Window",
        WS_OVERLAPPEDWINDOW | WS_VISIBLE,
        CW_USEDEFAULT, CW_USEDEFAULT, 600, 400,
        NULL, NULL, hInstance, NULL
    );
    
    if (!hwnd) {
        std::cout << "CreateWindow failed: " << GetLastError() << std::endl;
        return 1;
    }
    
    std::cout << "Window created successfully" << std::endl;
    std::cout << "Window handle: " << hwnd << std::endl;
    
    ShowWindow(hwnd, nCmdShow);
    UpdateWindow(hwnd);
    
    std::cout << "Window shown and updated" << std::endl;
    std::cout << "Entering message loop..." << std::endl;
    
    // Message loop
    MSG msg;
    while (GetMessage(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    
    std::cout << "Exiting..." << std::endl;
    
    return (int)msg.wParam;
}
