{
	"targets": [{
		"target_name": "spdlog",
		"sources": [
			"src/main.cc",
			"src/logger.cc"
		],
		"include_dirs": [
			"<!(node -e \"require('nan')\")",
			"deps/spdlog/include"
		],
		'cflags!': ['-fno-exceptions'],
		'cflags_cc!': ['-fno-exceptions'],
		'conditions': [
			['OS=="mac"', {
				'xcode_settings': {
					'GCC_ENABLE_CPP_EXCEPTIONS': 'YES'
				}
			}]
		]
	}]
}
