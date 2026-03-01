cmake_minimum_required(VERSION 3.15)
project(EnchantmentEngine VERSION 3.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Platform-specific settings
if(WIN32)
    add_definitions(-D_WIN32_WINNT=0x0601)
    set(PLATFORM_LIBS ws2_32 gdi32 user32 shell32 msimg32 ole32 comdlg32)
else()
    set(PLATFORM_LIBS pthread)
endif()

# Source files
set(UNIFIED_SOURCES
    main.cpp
    unified_application.cpp
    splash_screen.cpp
    project_manager.cpp
    ../client-app/api_client.cpp
    ../client-app/browser_window.cpp
    ../server/server.cpp
    ../server/file_manager.cpp
    ../server/build_system.cpp
    ../server/asset_processor.cpp
)

set(UNIFIED_HEADERS
    unified_application.hpp
    splash_screen.hpp
    project_manager.hpp
    ../client-app/api_client.hpp
    ../client-app/browser_window.hpp
    ../server/server.hpp
    ../server/file_manager.hpp
    ../server/build_system.hpp
    ../server/asset_processor.hpp
    ../server/json_utils.hpp
)

# Create executable
add_executable(enchantment_engine ${UNIFIED_SOURCES} ${UNIFIED_HEADERS})

# Link libraries
target_link_libraries(enchantment_engine PRIVATE ${PLATFORM_LIBS})

# Windows-specific settings
if(WIN32)
    # Hide console window for release builds
    if(CMAKE_BUILD_TYPE STREQUAL "Release")
        set_target_properties(enchantment_engine PROPERTIES
            WIN32_EXECUTABLE TRUE
        )
    endif()
    
    # Set executable icon (if available)
    # target_sources(enchantment_engine PRIVATE resources.rc)
endif()

# Installation
install(TARGETS enchantment_engine
    RUNTIME DESTINATION bin
)

# Output directory
set_target_properties(enchantment_engine PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}"
)

message(STATUS "Enchantment Engine - Unified Build Configuration")
message(STATUS "  Version: ${PROJECT_VERSION}")
message(STATUS "  C++ Standard: ${CMAKE_CXX_STANDARD}")
message(STATUS "  Build Type: ${CMAKE_BUILD_TYPE}")
message(STATUS "  Platform: ${CMAKE_SYSTEM_NAME}")
