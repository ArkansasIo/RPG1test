cmake_minimum_required(VERSION 3.15)
project(EnchantmentEditor)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Source files
set(SOURCES
    editor_window.cpp
    code_editor.cpp
    asset_manager.cpp
    build_system.cpp
)

# Header files
set(HEADERS
    editor_window.hpp
    code_editor.hpp
    asset_manager.hpp
    build_system.hpp
)

# Create executable
add_executable(enchantment_editor ${SOURCES} ${HEADERS})

# Windows specific settings
if(WIN32)
    target_link_libraries(enchantment_editor
        comctl32
        shell32
        ole32
        comdlg32
        gdi32
        user32
    )
    
    # Set subsystem to Windows (GUI application)
    set_target_properties(enchantment_editor PROPERTIES
        WIN32_EXECUTABLE TRUE
    )
endif()

# Output directory
set_target_properties(enchantment_editor PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_SOURCE_DIR}/../../bin"
)

# Install target
install(TARGETS enchantment_editor
    RUNTIME DESTINATION bin
)
