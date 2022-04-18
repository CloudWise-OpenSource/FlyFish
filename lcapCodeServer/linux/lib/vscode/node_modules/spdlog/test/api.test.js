/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// @ts-check

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const spdlog = require('..');

suite('API', function () {

	var tempDirectory;
	var logFile;
	var EOL = '\n';
	var testObject;

	var filesToDelete = [];

	suiteSetup(() => {
		tempDirectory = path.join(__dirname, 'logs');
		logFile = path.join(tempDirectory, 'test.log');
		filesToDelete.push(logFile);
		if (fs.existsSync(logFile)) {
			fs.unlinkSync(logFile);
		}

		if (typeof process === 'object') {
			if (process.platform === 'win32') {
				EOL = '\r\n';
			}
		} else if (typeof navigator === 'object') {
			let userAgent = navigator.userAgent;
			if (navigator.userAgent.indexOf('Windows') >= 0) {
				EOL = '\r\n'
			}
		}
	});

	teardown(() => {
		if (testObject) {
			testObject.drop();
		}
	});

	suiteTeardown(() => {
		filesToDelete.forEach(file => {
			if (fs.existsSync(file)) {
				fs.unlinkSync(file);
			}
		});
	});

	test('Version', function () {
		assert.strictEqual(spdlog.version, 10805);
	});

	test('Logger is present', function () {
		assert(typeof spdlog.Logger === 'function');
	});

	test('Create rotating logger', async function () {
		testObject = await aTestObject(logFile);
		assert.ok(fs.existsSync(logFile));
	});

	test('Log setFlushOn', async function () {
		spdlog.setFlushOn(3); // 3 = warn
		testObject = await aTestObject(logFile);
		testObject.warn('H');
		let actual = getLastLineNoFlushSync();
		assert.ok(actual.endsWith('[test] [warning] H'));
		testObject.info('1');
		testObject.info('2');
		testObject.info('3');
		actual = getLastLineNoFlushSync();
		assert.ok(actual.endsWith('[test] [warning] H'));
		testObject.warn('J');
		actual = getLastLineNoFlushSync();
		assert.ok(actual.endsWith('[test] [warning] J'));
	});

	test('Log critical message', async function () {
		testObject = await aTestObject(logFile);
		testObject.critical('Hello World');

		const actual = await getLastLine();
		assert.ok(actual.endsWith('[test] [critical] Hello World'));
	});

	test('Log error', async function () {
		testObject = await aTestObject(logFile);
		testObject.error('Hello World');
		testObject.flush();

		const actual = await getLastLine();
		assert.ok(actual.endsWith('[test] [error] Hello World'));
	});

	test('Log warning', async function () {
		testObject = await aTestObject(logFile);
		testObject.warn('Hello World');

		const actual = await getLastLine();
		assert.ok(actual.endsWith('[test] [warning] Hello World'));
	});

	test('Log info', async function () {
		testObject = await aTestObject(logFile);
		testObject.info('Hello World');

		const actual = await getLastLine();
		assert.ok(actual.endsWith('[test] [info] Hello World'));
	});

	test('Log debug', async function () {
		testObject = await aTestObject(logFile);
		testObject.setLevel(1);
		testObject.debug('Hello World');

		const actual = await getLastLine();
		assert.ok(actual.endsWith('[test] [debug] Hello World'));
	});

	test('Log trace', async function () {
		testObject = await aTestObject(logFile);
		testObject.setLevel(0);
		testObject.trace('Hello World');

		const actual = await getLastLine();
		assert.ok(actual.endsWith('[test] [trace] Hello World'));
	});


	test('set level', async function () {
		testObject = await aTestObject(logFile);
		testObject.setLevel(0);
		assert.strictEqual(testObject.getLevel(), 0);

		testObject.setLevel(1);
		assert.strictEqual(testObject.getLevel(), 1);

		testObject.setLevel(2);
		assert.strictEqual(testObject.getLevel(), 2);

		testObject.setLevel(3);
		assert.strictEqual(testObject.getLevel(), 3);

		testObject.setLevel(4);
		assert.strictEqual(testObject.getLevel(), 4);

		testObject.setLevel(5);
		assert.strictEqual(testObject.getLevel(), 5);

		testObject.setLevel(6);
		assert.strictEqual(testObject.getLevel(), 6);

		let failedToThrow = false;
		try {
			testObject.setLevel(7);
			failedToThrow = true;
		} catch {
			assert.strictEqual(testObject.getLevel(), 6);
		}
		try {
			testObject.setLevel(-1);
			failedToThrow = true;
		} catch {
			assert.strictEqual(testObject.getLevel(), 6);
		}
		assert.strictEqual(failedToThrow, false);
	});

	test('Off Log', async function () {
		testObject = await aTestObject(logFile);
		testObject.setLevel(6);
		testObject.critical('This message should not be written');
		testObject.flush();

		const actual = await getLastLine();
		assert.ok(!actual.endsWith('[test] [critical] This message should not be written'));
	});

	test('set log level to trace', async function () {
		testObject = await aTestObject(logFile);
		testObject.setLevel(0);
		testObject.trace('This trace message should be written');

		let actual = await getLastLine();
		assert.ok(actual.endsWith('[test] [trace] This trace message should be written'));
	});

	test('set log level to debug', async function () {
		testObject = await aTestObject(logFile);
		testObject.setLevel(1);
		testObject.trace('This trace message should not be written');

		let actual = await getLastLine();
		assert.ok(!actual.endsWith('[test] [trace] This trace message should not be written'));
	});

	test('set log level to info', async function () {
		testObject = await aTestObject(logFile);
		testObject.setLevel(2);
		testObject.trace('This trace message should not be written');
		testObject.flush();

		let actual = await getLastLine();
		assert.ok(!actual.endsWith('[test] [trace] This trace message should not be written'));

		testObject.debug('This debug message should not be written');

		actual = await getLastLine();
		assert.ok(!actual.endsWith('[test] [debug] This debug message should not be written'));
	});

	test('set global log level to trace', async function () {
		testObject = await aTestObject(logFile);
		spdlog.setLevel(0);

		testObject.trace('This trace message should be written');

		const actual = await getLastLine();
		assert.ok(actual.endsWith('[test] [trace] This trace message should be written'));
	});

	test('set global log level to debug', async function () {
		testObject = await aTestObject(logFile);
		spdlog.setLevel(1);

		testObject.trace('This trace message should not be written');

		let actual = await getLastLine();
		assert.ok(!actual.endsWith('[test] [trace] This trace message should not be written'));
	});

	test('set global log level to info', async function () {
		testObject = await aTestObject(logFile);
		spdlog.setLevel(2);

		testObject.trace('This trace message should not be written');

		let actual = await getLastLine();
		assert.ok(!actual.endsWith('[test] [trace] This trace message should not be written'));

		testObject.debug('This debug message should not be written');

		actual = await getLastLine();
		assert.ok(!actual.endsWith('[test] [debug] This debug message should not be written'));
	});

	test('drop logger and create logger with same name and same file', async function () {
		testObject = await aTestObject(logFile);
	});

	test('set pattern', async function () {
		testObject = await aTestObject(logFile);

		testObject.setPattern('%v');

		testObject.info('This message should be written as is');

		const actual = await getLastLine();
		assert.strictEqual(actual, 'This message should be written as is');
	});

	test('clear formatters', async function () {
		testObject = await aTestObject(logFile);

		testObject.clearFormatters();

		testObject.info('Cleared Formatters: ');
		testObject.info('This message ');
		testObject.info('should be ');
		testObject.info('written ');
		testObject.info('as is');

		const actuals = await getAllLines();
		assert.strictEqual(actuals[actuals.length - 1], 'Cleared Formatters: This message should be written as is');
	});

	test('create log file with special characters in file name', function () {
		let file = path.join(__dirname, 'abcdø', 'test.log');
		filesToDelete.push(file);
		testObject = new spdlog.Logger('rotating', 'test', file, 1048576 * 5, 2);
		assert.ok(testObject);
	});

	test('create log file with special characters in file name factory call', async function () {
		let file = path.join(__dirname, 'abcdø', 'test.log');
		filesToDelete.push(file);
		testObject = await spdlog.createRotatingLogger('test', file, 1048576 * 5, 2);
		assert.ok(testObject);
	});

	async function getLastLine() {
		const lines = await getAllLines();
		return lines[lines.length - 2];
	}

	async function aTestObject(logfile) {
		const logger = await spdlog.createAsyncRotatingLogger('test', logfile, 1048576 * 5, 2);
		logger.setPattern('%+');
		return logger;
	}

	async function getAllLines() {
		testObject.drop();
		const content = fs.readFileSync(logFile).toString();
		testObject = await aTestObject(logFile);
		return content.split(EOL);
	}

	function getLastLineNoFlushSync() {
		const lines = getAllLinesNoFlushSync();
		return lines[lines.length - 2];
	}

	function getAllLinesNoFlushSync() {
		const content = fs.readFileSync(logFile).toString();
		return content.split(EOL);
	}
});
