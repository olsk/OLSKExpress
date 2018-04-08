/*!
 * rofo-sample
 * Copyright(c) 2016-2018 Rosano Coutinho
 * MIT Licensed
 */

var filesystemLibrary = require('../ROCOFilesystem/main');

var fsPackage = require('fs');
var pathPackage = require('path');
var mkdirpPackage = require('mkdirp');

//_ ROCOCacheValueWithCallbackFunctionCacheKeyAndCacheObject

exports.ROCOCacheValueWithCallbackFunctionCacheKeyAndCacheObject = function (callback, key, cacheObject) {
	if (typeof callback !== 'function') {
		throw new Error('ROCOErrorInputInvalid');
	};

	if (typeof key !== 'string') {
		throw new Error('ROCOErrorInputInvalid');
	};

	if (typeof cacheObject !== 'object' || cacheObject === null) {
		return callback();
	};

	if (cacheObject[key] === undefined) {
		cacheObject[key] = callback();
	};

	return cacheObject[key];
};

//_ ROCOCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndAppDirectory

exports.ROCOCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndAppDirectory = function (inputData, cacheKey, appDirectory) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('ROCOErrorInputInvalid');
	};

	if (typeof cacheKey !== 'string') {
		throw new Error('ROCOErrorInputInvalid');
	};

	if (!filesystemLibrary.ROCOFilesystemInputDataIsRealDirectoryPath(appDirectory)) {
		throw new Error('ROCOErrorInputInvalid');
	};

	var cacheDirectory = pathPackage.join(appDirectory, filesystemLibrary.ROCOFilesystemCacheDirectoryName());

	if (!fsPackage.existsSync(cacheDirectory)) {
		mkdirpPackage.sync(cacheDirectory);
	};

	fsPackage.writeFileSync(pathPackage.join(cacheDirectory, [cacheKey, '.', filesystemLibrary.ROCOFilesystemSharedFileExtensionJSON()].join('')), JSON.stringify(inputData, null, "\t"));

	return null;
};

//_ ROCOCacheReadCacheObjectFileWithCacheKeyAndAppDirectory

exports.ROCOCacheReadCacheObjectFileWithCacheKeyAndAppDirectory = function (inputData, appDirectory) {
	if (typeof inputData !== 'string') {
		throw new Error('ROCOErrorInputInvalid');
	};

	if (!filesystemLibrary.ROCOFilesystemInputDataIsRealDirectoryPath(appDirectory)) {
		throw new Error('ROCOErrorInputInvalid');
	};

	var cacheDirectory = pathPackage.join(appDirectory, filesystemLibrary.ROCOFilesystemCacheDirectoryName());

	if (!fsPackage.existsSync(cacheDirectory)) {
		return null;
	};

	var cacheObjectFileFullPath = pathPackage.join(cacheDirectory, [inputData, '.', filesystemLibrary.ROCOFilesystemSharedFileExtensionJSON()].join(''));

	if (!fsPackage.existsSync(cacheObjectFileFullPath)) {
		return null;
	};

	var cacheObject = JSON.parse(fsPackage.readFileSync(cacheObjectFileFullPath, filesystemLibrary.ROCOFilesystemDefaultTextEncoding()));
	return cacheObject;
};
