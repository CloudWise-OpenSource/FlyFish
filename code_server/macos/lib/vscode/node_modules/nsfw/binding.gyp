{
    "targets": [{
        "target_name": "nsfw",

        "sources": [
            "src/NSFW.cpp",
            "src/Queue.cpp",
            "src/NativeInterface.cpp"
        ],
        "include_dirs": [
            "includes",
            "<!@(node -p \"require('node-addon-api').include\")"
        ],
        "cflags!": ["-fno-exceptions"],
        "cflags_cc!": ["-fno-exceptions"],
        "xcode_settings": {
            "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
            "CLANG_CXX_LIBRARY": "libc++",
            "MACOSX_DEPLOYMENT_TARGET": "10.7",
        },
        "msvs_settings": {
            "VCCLCompilerTool": { "ExceptionHandling": 1 },
        },
        "conditions": [
            ["OS=='win'", {
                "sources": [
                    "src/win32/Controller.cpp",
                    "src/win32/Watcher.cpp"
                ],
                "msvs_settings": {
                    "VCCLCompilerTool": {
                        "DisableSpecificWarnings": [ "4506", "4538", "4793" ]
                    },
                    "VCLinkerTool": {
                        "AdditionalOptions": [ "/ignore:4248" ]
                    }
                }
            }],
            ["OS=='mac'", {
                "cflags+": ["-fvisibility-hidden"],
                "sources": [
                    "src/osx/RunLoop.cpp",
                    "src/osx/FSEventsService.cpp"
                ],
                "xcode_settings": {
                    "GCC_SYMBOLS_PRIVATE_EXTERN": "YES", # -fvisibility=hidden
                    "MACOSX_DEPLOYMENT_TARGET": "10.7",
                    "OTHER_CFLAGS": [
                        "-std=c++11",
                        "-stdlib=libc++"
                    ],
                },
                "link_settings": {
                    "xcode_settings": {
                        "OTHER_LDFLAGS": [
                            "-framework CoreServices"
                        ],
                        "OTHER_CFLAGS": [
                            "-Wno-unknown-pragmas"
                        ]
                    }
                }
            }],
            ["OS=='linux' or OS=='freebsd'", {
                "defines": [
                    "NSFW_TEST_SLOW_<!(node -p process.env.NSFW_TEST_SLOW)"
                ],
                "sources": [
                    "src/linux/InotifyEventLoop.cpp",
                    "src/linux/InotifyTree.cpp",
                    "src/linux/InotifyService.cpp"
                ],
                "cflags": [
                    "-Wno-unknown-pragmas",
                    "-std=c++11"
                ]
            }],
            ["OS=='win'", {
                "conditions": [
                    ["target_arch=='x64'", {
                        "VCLibrarianTool": {
                          "AdditionalOptions": [
                            "/MACHINE:X64"
                          ]
                        }
                    }, {
                        "VCLibrarianTool": {
                          "AdditionalOptions": [
                            "/MACHINE:x86"
                          ]
                        }
                    }]
                ]
            }],
            ["OS=='mac' or OS=='linux' or OS=='freebsd'", {
                "defines": [
                    "HAVE_STDDEF_H=1",
                    "HAVE_STDLIB_H=1",
                    "HAVE_UNISTD_H=1"
                ]
            }],
            ["OS=='freebsd'", {
                "include_dirs": [
                    "/usr/local/include"
                ],
                "libraries": [
                    "-L/usr/local/lib",
                    "-linotify"
                ]
            }],
        ]
    }]
}
