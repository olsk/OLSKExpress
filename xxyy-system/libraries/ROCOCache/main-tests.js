/*!
 * xxyy-sample
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');
var kConstants = require('../kConstants/testing.main').ROCOTestingConstants();

var cacheLibrary = require('./main');
var filesystemLibrary = require(kConstants.ROCOTestingSystemDirectoryAbsolutePath + '/libraries/ROCOFilesystem/main');

var fsPackage = require('fs');
var pathPackage = require('path');
var mkdirpPackage = require('mkdirp');

var testAppDirectory = pathPackage.join(
	kConstants.ROCOTestingLiveDirectoryAbsolutePath,
	filesystemLibrary.ROCOFilesystemWorkspaceTestingDirectorySubfolderNameFor('xxyy.cache'));

describe('ROCOCacheValueWithCallbackFunctionCacheKeyAndCacheObject', function testROCOCacheValueWithCallbackFunctionCacheKeyAndCacheObject () {

	it('throws error if param1 not function', function () {
		assert.throws(function () {
			cacheLibrary.ROCOCacheValueWithCallbackFunctionCacheKeyAndCacheObject(null, 'alpha', {});
		}, /ROCOErrorInputInvalid/);
	});

	it('throws error if param2 not string', function () {
		assert.throws(function () {
			cacheLibrary.ROCOCacheValueWithCallbackFunctionCacheKeyAndCacheObject(function () {}, null, {});
		}, /ROCOErrorInputInvalid/);
	});

	it('returns callback result if param3 not object', function () {
		assert.strictEqual(cacheLibrary.ROCOCacheValueWithCallbackFunctionCacheKeyAndCacheObject(function () {
			return 'zulu';
		}, 'alpha', 1), 'zulu');
	});

	it('sets cacheObject[key] to callback result', function () {
		var cacheObject = {};
		cacheLibrary.ROCOCacheValueWithCallbackFunctionCacheKeyAndCacheObject(function () {
			return 'zulu';
		}, 'alpha', cacheObject);
		assert.strictEqual(cacheObject['alpha'], 'zulu');
	});

	it('returns cached result if key exists', function () {
		var cacheObject = {};
		cacheLibrary.ROCOCacheValueWithCallbackFunctionCacheKeyAndCacheObject(function () {
			return 'zulu';
		}, 'alpha', cacheObject);
		assert.strictEqual(cacheLibrary.ROCOCacheValueWithCallbackFunctionCacheKeyAndCacheObject(function () {
			return 'bravo';
		}, 'alpha', cacheObject), 'zulu');
	});

});

describe('ROCOCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndAppDirectory', function testROCOCacheWriteCacheObjectFileWithCacheObjectAndAppDirectory () {

	beforeEach(function() {
		if (fsPackage.existsSync(testAppDirectory)) {
			filesystemLibrary.ROCOFilesystemHelpDeleteDirectoryRecursive(testAppDirectory)
		};
	});

	it('throws error if param1 not object', function () {
		assert.throws(function () {
			mkdirpPackage.sync(testAppDirectory);
			cacheLibrary.ROCOCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndAppDirectory(null, 'alpha', testAppDirectory);
		}, /ROCOErrorInputInvalid/);
	});

	it('throws error if param2 not string', function () {
		assert.throws(function () {
			mkdirpPackage.sync(testAppDirectory);
			cacheLibrary.ROCOCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndAppDirectory(kConstants.ROCOTestingCacheObjectValid(), null, testAppDirectory);
		}, /ROCOErrorInputInvalid/);
	});

	it('throws error if param3 not real directory', function () {
		assert.throws(function () {
			cacheLibrary.ROCOCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndAppDirectory(kConstants.ROCOTestingCacheObjectValid(), 'alpha', pathPackage.join(testAppDirectory, 'alpha'));
		}, /ROCOErrorInputInvalid/);
	});
	
	it('returns null and writes data for json', function () {
		var cacheObject = kConstants.ROCOTestingCacheObjectValid();
		mkdirpPackage.sync(testAppDirectory);
		assert.strictEqual(cacheLibrary.ROCOCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndAppDirectory(cacheObject, 'alpha', testAppDirectory), null);

		var patternFileFullPath = pathPackage.join(testAppDirectory, filesystemLibrary.ROCOFilesystemCacheDirectoryName(), 'alpha' + '.' + filesystemLibrary.ROCOFilesystemSharedFileExtensionJSON());
		assert.strictEqual(fsPackage.existsSync(patternFileFullPath), true);
		assert.strictEqual(fsPackage.readFileSync(patternFileFullPath, filesystemLibrary.ROCOFilesystemDefaultTextEncoding()), JSON.stringify(cacheObject, null, "\t"));
	});

});

describe('ROCOCacheReadCacheObjectFileWithCacheKeyAndAppDirectory', function testROCOCacheReadCacheObjectFileWithCacheKeyAndAppDirectory () {

	beforeEach(function() {
		if (fsPackage.existsSync(testAppDirectory)) {
			filesystemLibrary.ROCOFilesystemHelpDeleteDirectoryRecursive(testAppDirectory)
		};
	});

	it('throws error if param1 not string', function () {
		assert.throws(function () {
			mkdirpPackage.sync(pathPackage.join(testAppDirectory, filesystemLibrary.ROCOFilesystemCacheDirectoryName()));
			cacheLibrary.ROCOCacheReadCacheObjectFileWithCacheKeyAndAppDirectory(null, testAppDirectory);
		}, /ROCOErrorInputInvalid/);
	});

	it('throws error if param2 not real directory', function () {
		assert.throws(function () {
			cacheLibrary.ROCOCacheReadCacheObjectFileWithCacheKeyAndAppDirectory('alpha', pathPackage.join(testAppDirectory, 'alpha'));
		}, /ROCOErrorInputInvalid/);
	});
	
	it('returns null if cache directory does not exist', function () {
		mkdirpPackage.sync(testAppDirectory);
		assert.strictEqual(cacheLibrary.ROCOCacheReadCacheObjectFileWithCacheKeyAndAppDirectory('alpha', testAppDirectory), null);
	});
	
	it('returns null if cacheKey does not exist', function () {
		mkdirpPackage.sync(pathPackage.join(testAppDirectory, filesystemLibrary.ROCOFilesystemCacheDirectoryName()));
		assert.strictEqual(cacheLibrary.ROCOCacheReadCacheObjectFileWithCacheKeyAndAppDirectory('alpha', testAppDirectory), null);
	});
	
	it('returns cacheObject', function () {
		mkdirpPackage.sync(testAppDirectory);

		var cacheObject = kConstants.ROCOTestingCacheObjectValid();
		assert.strictEqual(cacheLibrary.ROCOCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndAppDirectory(cacheObject, 'alpha', testAppDirectory), null);
		assert.deepEqual(cacheLibrary.ROCOCacheReadCacheObjectFileWithCacheKeyAndAppDirectory('alpha', testAppDirectory), cacheObject);
	});

});
