/*!
 * xxyy-sample
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var filesystemLibrary = require('../libraries/ROCOFilesystem/main');

var pathPackage = require('path');

var kOLSKLiveAppDirectory = filesystemLibrary.ROCOFilesystemRootDirectoryAbsolutePath();

exports.OLSKLiveAppDirectory = function () {
	return kOLSKLiveAppDirectory;
};

exports.OLSKLiveSystemPath = function () {
	return pathPackage.join(kOLSKLiveAppDirectory, filesystemLibrary.ROCOFilesystemSystemDirectoryName());
};
