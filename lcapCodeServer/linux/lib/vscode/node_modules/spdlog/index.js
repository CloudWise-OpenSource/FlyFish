const path = require('path');
const mkdirp = require('mkdirp');
const spdlog = require('bindings')('spdlog');

exports.version = spdlog.version;
exports.setLevel = spdlog.setLevel;
exports.setFlushOn = spdlog.setFlushOn;
exports.Logger = spdlog.Logger;

function createRotatingLogger(name, filepath, maxFileSize, maxFiles) {
	return createLogger('rotating', name, filepath, maxFileSize, maxFiles);
}

function createAsyncRotatingLogger(name, filepath, maxFileSize, maxFiles) {
	return createLogger('rotating_async', name, filepath, maxFileSize, maxFiles);
}

function createLogger(loggerType, name, filepath, maxFileSize, maxFiles) {
	return new Promise((c, e) => {
		const dirname = path.dirname(filepath);
		mkdirp(dirname, err => {
			if (err) {
				e(err);
			} else {
				c(new spdlog.Logger(loggerType, name, filepath, maxFileSize, maxFiles));
			}
		});
	});
}

exports.createRotatingLogger = createRotatingLogger;
exports.createAsyncRotatingLogger = createAsyncRotatingLogger;
