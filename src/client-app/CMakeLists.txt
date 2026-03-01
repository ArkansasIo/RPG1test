cmake_minimum_required(VERSION 3.15)
project(EnchantmentEngineClient VERSION 3.0.0 LANGUAGES CXX)

# Set C++ standard
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Compiler flags
if(MSVC)
    add_compile_options(/W4 /WX-)
    add_compile_definitions(_CRT_SECURE_NO_WARNINGS)
else()
    add_compile_options(-Wall -Wextra -Wpedantic)
endif()

# Source files
set(CLIENT_SOURCES
    main.cpp
    application.cpp
    api_client.cpp
    browser_window.cpp
    splash_screen.cpp
)

# Headers
set(CLIENT_HEADERS
    application.hpp
    api_client.hpp
    browser_window.hpp
    splash_screen.hpp
)

# Create executable
add_executable(enchantment_client ${CLIENT_SOURCES} ${CLIENT_HEADERS})

# Platform-specific libraries
if(WIN32)
    target_link_libraries(enchantment_client 
        ws2_32
        ole32
        oleaut32
        uuid
        comctl32
        gdi32
        user32
        msimg32
    )
    
    # Set subsystem to Windows (GUI app, no console)
    if(MSVC)
        set_target_properties(enchantment_client PROPERTIES
            WIN32_EXECUTABLE TRUE
            LINK_FLAGS "/SUBSYSTEM:WINDOWS /ENTRY:mainCRTStartup"
        )
    else()
        set_target_properties(enchantment_client PROPERTIES
            WIN32_EXECUTABLE TRUE
            LINK_FLAGS "-mwindows"
        )
    endif()
    
    # Add icon resource
    if(EXISTS "${CMAKE_CURRENT_SOURCE_DIR}/app_icon.rc")
        target_sources(enchantment_client PRIVATE app_icon.rc)
    endif()
else()
    target_link_libraries(enchantment_client pthread)
endif()

# Include directories
target_include_directories(enchantment_client PRIVATE ${CMAKE_CURRENT_SOURCE_DIR})

# Installation
install(TARGETS enchantment_client
    RUNTIME DESTINATION bin
)

# Copy to root directory for easy access
add_custom_command(TARGET enchantment_client POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy
    $<TARGET_FILE:enchantment_client>
    ${CMAKE_SOURCE_DIR}/../../EnchantmentEngine.exe
    COMMENT "Copying executable to root directory"
)

# Print build information
message(STATUS "Enchantment Engine Client v${PROJECT_VERSION}")
message(STATUS "C++ Standard: ${CMAKE_CXX_STANDARD}")
message(STATUS "Build Type: ${CMAKE_BUILD_TYPE}")
message(STATUS "Compiler: ${CMAKE_CXX_COMPILER_ID} ${CMAKE_CXX_COMPILER_VERSION}")
