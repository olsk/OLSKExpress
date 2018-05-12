/*!
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var filesystemLibrary = require('../ROCOFilesystem/main');

var fsPackage = require('fs');
var pathPackage = require('path');
var mkdirpPackage = require('mkdirp');

//_ ROCOCacheValueWithCallbackFunctionCacheKeyAndCacheObject

exports.ROCOCacheValueWithCallbackFunctionCacheKeyAndCacheObject = function(callback, key, cacheObject) {
	if (typeof callback !== 'function') {
		throw new Error('ROCOErrorInputInvalid');
	}

	if (typeof key !== 'string') {
		throw new Error('ROCOErrorInputInvalid');
	}

	if (typeof cacheObject !== 'object' || cacheObject === null) {
		return callback();
	}

	if (cacheObject[key] === undefined) {
		cacheObject[key] = callback();
	}

	return cacheObject[key];
};

//_ ROCOCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory

exports.ROCOCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory = function(inputData, cacheKey, rootDirectory) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('ROCOErrorInputInvalid');
	}

	if (typeof cacheKey !== 'string') {
		throw new Error('ROCOErrorInputInvalid');
	}

	if (!filesystemLibrary.ROCOFilesystemInputDataIsRealDirectoryPath(rootDirectory)) {
		throw new Error('ROCOErrorInputInvalid');
	}

	var cacheDirectory = pathPackage.join(rootDirectory, filesystemLibrary.ROCOFilesystemCacheDirectoryName());

	if (!fsPackage.existsSync(cacheDirectory)) {
		mkdirpPackage.sync(cacheDirectory);
	}

	fsPackage.writeFileSync(pathPackage.join(cacheDirectory, [cacheKey, '.', filesystemLibrary.ROCOFilesystemSharedFileExtensionJSON()].join('')), JSON.stringify(inputData, null, '\t'));

	return null;
};

//_ ROCOCacheReadCacheObjectFileWithCacheKeyAndRootDirectory

exports.ROCOCacheReadCacheObjectFileWithCacheKeyAndRootDirectory = function(inputData, rootDirectory) {
	if (typeof inputData !== 'string') {
		throw new Error('ROCOErrorInputInvalid');
	}

	if (!filesystemLibrary.ROCOFilesystemInputDataIsRealDirectoryPath(rootDirectory)) {
		throw new Error('ROCOErrorInputInvalid');
	}

	var cacheDirectory = pathPackage.join(rootDirectory, filesystemLibrary.ROCOFilesystemCacheDirectoryName());

	if (!fsPackage.existsSync(cacheDirectory)) {
		return null;
	}

	var cacheObjectFileFullPath = pathPackage.join(cacheDirectory, [inputData, '.', filesystemLibrary.ROCOFilesystemSharedFileExtensionJSON()].join(''));

	if (!fsPackage.existsSync(cacheObjectFileFullPath)) {
		return null;
	}

	return JSON.parse(fsPackage.readFileSync(cacheObjectFileFullPath, filesystemLibrary.ROCOFilesystemDefaultTextEncoding()));
};
