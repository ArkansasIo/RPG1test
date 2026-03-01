cmake_minimum_required(VERSION 3.15)
project(EnchantmentEngine VERSION 3.0.0 LANGUAGES CXX)

# Set C++ standard
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Compiler flags
if(MSVC)
    add_compile_options(/W4 /WX-)
else()
    add_compile_options(-Wall -Wextra -Wpedantic)
endif()

# Source files
set(SERVER_SOURCES
    main.cpp
    server.cpp
    file_manager.cpp
    build_system.cpp
    asset_processor.cpp
)

# Headers
set(SERVER_HEADERS
    server.hpp
    file_manager.hpp
    build_system.hpp
    asset_processor.hpp
)

# Create executable
add_executable(enchantment_server ${SERVER_SOURCES} ${SERVER_HEADERS})

# Platform-specific libraries
if(WIN32)
    target_link_libraries(enchantment_server ws2_32)
else()
    target_link_libraries(enchantment_server pthread)
endif()

# Include directories
target_include_directories(enchantment_server PRIVATE ${CMAKE_CURRENT_SOURCE_DIR})

# Installation
install(TARGETS enchantment_server
    RUNTIME DESTINATION bin
)

# Copy client files to build directory
add_custom_command(TARGET enchantment_server POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_directory
    ${CMAKE_SOURCE_DIR}/../client
    ${CMAKE_BINARY_DIR}/client
    COMMENT "Copying client files to build directory"
)

# Print build information
message(STATUS "Enchantment Engine Server v${PROJECT_VERSION}")
message(STATUS "C++ Standard: ${CMAKE_CXX_STANDARD}")
message(STATUS "Build Type: ${CMAKE_BUILD_TYPE}")
message(STATUS "Compiler: ${CMAKE_CXX_COMPILER_ID} ${CMAKE_CXX_COMPILER_VERSION}")
