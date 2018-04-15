/*!
 * xxyy-sample
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var filesystemLibrary = require('../libraries/ROCOFilesystem/main');

var pathPackage = require('path');

var kROCOLiveAppDirectory = filesystemLibrary.ROCOFilesystemRootDirectoryAbsolutePath();

exports.ROCOLiveAppDirectory = function () {
	return kROCOLiveAppDirectory;
};

exports.ROCOLiveSystemPath = function () {
	return pathPackage.join(kROCOLiveAppDirectory, filesystemLibrary.ROCOFilesystemSystemDirectoryName());
};
