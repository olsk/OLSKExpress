/*!
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');
var kConstants = require('../kConstants/testing.main').ROCOTestingConstants();

var cacheLibrary = require('./main');
var filesystemLibrary = require('../ROCOFilesystem/main');

var fsPackage = require('fs');
var pathPackage = require('path');
var mkdirpPackage = require('mkdirp');

var testRootDirectory = pathPackage.join(
	kConstants.ROCOTestingLiveDirectoryAbsolutePath,
	filesystemLibrary.ROCOFilesystemWorkspaceTestingDirectorySubfolderNameFor('alpha.cache'));

var ROCOTestingCacheObjectValid = function() {
	return {
		'test-1990-01-01T21:09:00.000Z': 12.34,
	};
};

describe('ROCOCacheValueWithCallbackFunctionCacheKeyAndCacheObject', function testROCOCacheValueWithCallbackFunctionCacheKeyAndCacheObject() {

	it('throws error if param1 not function', function() {
		assert.throws(function() {
			cacheLibrary.ROCOCacheValueWithCallbackFunctionCacheKeyAndCacheObject(null, 'alpha', {});
		}, /ROCOErrorInputInvalid/);
	});

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			cacheLibrary.ROCOCacheValueWithCallbackFunctionCacheKeyAndCacheObject(function() {}, null, {});
		}, /ROCOErrorInputInvalid/);
	});

	it('returns callback result if param3 not object', function() {
		assert.strictEqual(cacheLibrary.ROCOCacheValueWithCallbackFunctionCacheKeyAndCacheObject(function() {
			return 'zulu';
		}, 'alpha', 1), 'zulu');
	});

	it('sets cacheObject[key] to callback result', function() {
		var cacheObject = {};
		cacheLibrary.ROCOCacheValueWithCallbackFunctionCacheKeyAndCacheObject(function() {
			return 'zulu';
		}, 'alpha', cacheObject);
		assert.strictEqual(cacheObject['alpha'], 'zulu');
	});

	it('returns cached result if key exists', function() {
		var cacheObject = {};
		cacheLibrary.ROCOCacheValueWithCallbackFunctionCacheKeyAndCacheObject(function() {
			return 'zulu';
		}, 'alpha', cacheObject);
		assert.strictEqual(cacheLibrary.ROCOCacheValueWithCallbackFunctionCacheKeyAndCacheObject(function() {
			return 'bravo';
		}, 'alpha', cacheObject), 'zulu');
	});

});

describe('ROCOCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory', function testROCOCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory() {

	beforeEach(function() {
		if (fsPackage.existsSync(testRootDirectory)) {
			filesystemLibrary.ROCOFilesystemHelpDeleteDirectoryRecursive(testRootDirectory);
		}
	});

	it('throws error if param1 not object', function() {
		assert.throws(function() {
			mkdirpPackage.sync(testRootDirectory);
			cacheLibrary.ROCOCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(null, 'alpha', testRootDirectory);
		}, /ROCOErrorInputInvalid/);
	});

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			mkdirpPackage.sync(testRootDirectory);
			cacheLibrary.ROCOCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(ROCOTestingCacheObjectValid(), null, testRootDirectory);
		}, /ROCOErrorInputInvalid/);
	});

	it('throws error if param3 not real directory', function() {
		assert.throws(function() {
			cacheLibrary.ROCOCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(ROCOTestingCacheObjectValid(), 'alpha', pathPackage.join(testRootDirectory, 'alpha'));
		}, /ROCOErrorInputInvalid/);
	});

	it('returns null and writes data for json', function() {
		var cacheObject = ROCOTestingCacheObjectValid();
		mkdirpPackage.sync(testRootDirectory);
		assert.strictEqual(cacheLibrary.ROCOCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(cacheObject, 'alpha', testRootDirectory), null);

		var patternFileFullPath = pathPackage.join(testRootDirectory, filesystemLibrary.ROCOFilesystemCacheDirectoryName(), 'alpha' + '.' + filesystemLibrary.ROCOFilesystemSharedFileExtensionJSON());
		assert.strictEqual(fsPackage.existsSync(patternFileFullPath), true);
		assert.strictEqual(fsPackage.readFileSync(patternFileFullPath, filesystemLibrary.ROCOFilesystemDefaultTextEncoding()), JSON.stringify(cacheObject, null, '\t'));
	});

});

describe('ROCOCacheReadCacheObjectFileWithCacheKeyAndRootDirectory', function testROCOCacheReadCacheObjectFileWithCacheKeyAndRootDirectory() {

	beforeEach(function() {
		if (fsPackage.existsSync(testRootDirectory)) {
			filesystemLibrary.ROCOFilesystemHelpDeleteDirectoryRecursive(testRootDirectory);
		}
	});

	it('throws error if param1 not string', function() {
		assert.throws(function() {
			mkdirpPackage.sync(pathPackage.join(testRootDirectory, filesystemLibrary.ROCOFilesystemCacheDirectoryName()));
			cacheLibrary.ROCOCacheReadCacheObjectFileWithCacheKeyAndRootDirectory(null, testRootDirectory);
		}, /ROCOErrorInputInvalid/);
	});

	it('throws error if param2 not real directory', function() {
		assert.throws(function() {
			cacheLibrary.ROCOCacheReadCacheObjectFileWithCacheKeyAndRootDirectory('alpha', pathPackage.join(testRootDirectory, 'alpha'));
		}, /ROCOErrorInputInvalid/);
	});

	it('returns null if cache directory does not exist', function() {
		mkdirpPackage.sync(testRootDirectory);
		assert.strictEqual(cacheLibrary.ROCOCacheReadCacheObjectFileWithCacheKeyAndRootDirectory('alpha', testRootDirectory), null);
	});

	it('returns null if cacheKey does not exist', function() {
		mkdirpPackage.sync(pathPackage.join(testRootDirectory, filesystemLibrary.ROCOFilesystemCacheDirectoryName()));
		assert.strictEqual(cacheLibrary.ROCOCacheReadCacheObjectFileWithCacheKeyAndRootDirectory('alpha', testRootDirectory), null);
	});

	it('returns cacheObject', function() {
		mkdirpPackage.sync(testRootDirectory);

		var cacheObject = ROCOTestingCacheObjectValid();
		assert.strictEqual(cacheLibrary.ROCOCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(cacheObject, 'alpha', testRootDirectory), null);
		assert.deepEqual(cacheLibrary.ROCOCacheReadCacheObjectFileWithCacheKeyAndRootDirectory('alpha', testRootDirectory), cacheObject);
	});

});
