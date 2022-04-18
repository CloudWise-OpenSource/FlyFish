const path = require('path');
const mkdirp = require('mkdirp');
const spdlog = require('bindings')('spdlog');

exports.version = spdlog.version;
exports.setAsyncMode = spdlog.setAsyncMode;
exports.setLevel = spdlog.setLevel;
exports.Logger = spdlog.Logger;

class RotatingLogger extends spdlog.Logger {
	constructor(name, filename, maxFileSize, maxFiles) {
		if (path.isAbsolute(filename)) {
			mkdirp.sync(path.dirname(filename));
		}

		super('rotating', name, filename, maxFileSize, maxFiles);
	}
}

function createRotatingLoggerAsync(name, filepath, maxFileSize, maxFiles) {
	return new Promise((c, e) => {
		const dirname = path.dirname(filepath);
		mkdirp(dirname, err => {
			if (err) {
				e(err);
			} else {
				c(createRotatingLogger(name, filepath, maxFileSize, maxFiles));
			}
		})
	});
}

function createRotatingLogger(name, filepath, maxFileSize, maxFiles) {
	return new spdlog.Logger('rotating', name, filepath, maxFileSize, maxFiles);
}

exports.createRotatingLoggerAsync = createRotatingLoggerAsync;
exports.createRotatingLogger = createRotatingLogger;
exports.RotatingLogger = RotatingLogger;