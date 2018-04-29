/*!
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var pathPackage = require('path');
var fsPackage = require('fs');
var mkdirpPackage = require('mkdirp');

//_ ROCOFilesystemInputDataIsRealDirectoryPath

exports.ROCOFilesystemInputDataIsRealDirectoryPath = function(inputData) {
	if (!fsPackage.existsSync(inputData)) {
		return false;
	};

	return fsPackage.lstatSync(inputData).isDirectory();
};

//_ ROCOFilesystemInputDataIsRealFilePath

exports.ROCOFilesystemInputDataIsRealFilePath = function(inputData) {
	if (!fsPackage.existsSync(inputData)) {
		return false;
	};

	return fsPackage.lstatSync(inputData).isFile();
};

//_ ROCOFilesystemHelpCreateDirectoryIfDoesNotExist

exports.ROCOFilesystemHelpCreateDirectoryIfDoesNotExist = function(directoryPath) {
	if (!fsPackage.existsSync(directoryPath)) {
		mkdirpPackage.sync(directoryPath);
	};

	return null;
};

//_ ROCOFilesystemHelpDeleteDirectoryRecursive

exports.ROCOFilesystemHelpDeleteDirectoryRecursive = function(directoryPath) {
	if (!fsPackage.existsSync(directoryPath)) {
		return 0;
	};

	if (!fsPackage.lstatSync(directoryPath).isDirectory()) {
		return 0;
	};

	fsPackage.readdirSync(directoryPath).forEach(function(fileName, index) {
		var currentPath = directoryPath + '/' + fileName;
		if (fsPackage.lstatSync(currentPath).isDirectory()) {
			exports.ROCOFilesystemHelpDeleteDirectoryRecursive(currentPath);
		} else {
			fsPackage.unlinkSync(currentPath);
		};
	});

	fsPackage.rmdirSync(directoryPath);
	return 1;
};

//_ ROCOFilesystemAppDirectoryName

exports.ROCOFilesystemAppDirectoryName = function() {
	return 'os-app';
};

//_ ROCOFilesystemCacheDirectoryName

exports.ROCOFilesystemCacheDirectoryName = function() {
	return 'os-cache';
};

//_ ROCOFilesystemDataDirectoryName

exports.ROCOFilesystemDataDirectoryName = function() {
	return 'os-data';
};

//_ ROCOFilesystemPublicDirectoryName

exports.ROCOFilesystemPublicDirectoryName = function() {
	return 'os-public';
};

//_ ROCOFilesystemSystemDirectoryName

exports.ROCOFilesystemSystemDirectoryName = function() {
	return 'os-system';
};

//_ ROCOFilesystemWorkspaceTestingDirectoryName

exports.ROCOFilesystemWorkspaceTestingDirectoryName = function() {
	return 'os-workspace-testing';
};

//_ ROCOFilesystemWorkspaceTestingDirectorySubfolderNameFor

exports.ROCOFilesystemWorkspaceTestingDirectorySubfolderNameFor = function(inputData) {
	if (typeof inputData !== 'string') {
		throw new Error('ROCOErrorInputInvalid');
	};

	if (inputData === '') {
		throw new Error('ROCOErrorInputInvalid');
	};

	return ['test', inputData].join('.').replace(/\./g, '-');
};

//_ ROCOFilesystemLaunchFileName

exports.ROCOFilesystemLaunchFileName = function() {
	return 'os-launch.js';
};

//_ _ROCOFilesystemAbsolutePathRootDirectory

exports._ROCOFilesystemAbsolutePathRootDirectory = function() {
	return pathPackage.join(
		__dirname,
		'/../../../'
	);
};

//_ _ROCOFilesystemAbsolutePathWorkspaceTestingDirectory

exports._ROCOFilesystemAbsolutePathWorkspaceTestingDirectory = function() {
	return pathPackage.join(exports._ROCOFilesystemAbsolutePathRootDirectory(), exports.ROCOFilesystemWorkspaceTestingDirectoryName());
};

//_ ROCOFilesystemSharedFileExtensionJSON

exports.ROCOFilesystemSharedFileExtensionJSON = function() {
	return 'json';
};

//_ ROCOFilesystemSharedFileExtensionYAML

exports.ROCOFilesystemSharedFileExtensionYAML = function() {
	return 'yaml';
};

//_ ROCOFilesystemDefaultTextEncoding

exports.ROCOFilesystemDefaultTextEncoding = function() {
	return 'utf8';
};
