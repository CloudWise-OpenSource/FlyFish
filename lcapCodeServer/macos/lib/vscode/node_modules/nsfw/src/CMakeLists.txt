# platform independent code
set (NSFW_LIBRARY_SOURCES
    Queue.cpp
    NativeInterface.cpp
)

if (WIN32)
    message (STATUS "compiling windows specific file system service")
    set (NSFW_LIBRARY_SOURCES ${NSFW_LIBRARY_SOURCES}
        win32/Controller.cpp
        win32/Watcher.cpp
    )
endif(WIN32)

if (UNIX)
    if (APPLE)
        message (STATUS "compiling macOS specific file system service")
        set (NSFW_LIBRARY_SOURCES ${NSFW_LIBRARY_SOURCES}
            osx/RunLoop.cpp
            osx/FSEventsService.cpp
        )
    else (APPLE)
        message (STATUS "compiling linux specific file system service")
        set (NSFW_LIBRARY_SOURCES ${NSFW_LIBRARY_SOURCES}
            linux/InotifyEventLoop.cpp
            linux/InotifyService.cpp
            linux/InotifyTree.cpp
        )
    endif(APPLE)
endif (UNIX)

set (CMAKE_CXX_STANDARD 11)

add_library(nsfw STATIC ${NSFW_LIBRARY_SOURCES})
target_include_directories(nsfw PUBLIC ${NSFW_INCLUDE_DIR})
