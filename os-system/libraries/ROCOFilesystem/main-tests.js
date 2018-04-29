/*!
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');
var kConstants = require('../kConstants/testing.main').ROCOTestingConstants();

var filesystemLibrary = require('./main');
var pathPackage = require('path');
var fsPackage = require('fs');
var mkdirpPackage = require('mkdirp');

var testAppDirectory = pathPackage.join(
	kConstants.ROCOTestingLiveDirectoryAbsolutePath,
	filesystemLibrary.ROCOFilesystemWorkspaceTestingDirectorySubfolderNameFor('os.filesystem'));

describe('ROCOFilesystemInputDataIsRealDirectoryPath', function testROCOFilesystemInputDataIsRealDirectoryPath() {

	beforeEach(function() {
		if (fsPackage.existsSync(testAppDirectory)) {
			filesystemLibrary.ROCOFilesystemHelpDeleteDirectoryRecursive(testAppDirectory);
		};
	});

	it('returns null if parameter not filesystem path', function() {
		assert.strictEqual(filesystemLibrary.ROCOFilesystemInputDataIsRealDirectoryPath(''), false);
	});

	it('returns null if directory path does not exist', function() {
		assert.strictEqual(filesystemLibrary.ROCOFilesystemInputDataIsRealDirectoryPath(testAppDirectory), false);
	});

	it('returns null if path not directory', function() {
		var fileFullPath = pathPackage.join(
			testAppDirectory,
			'alpha.txt'
		);
		mkdirpPackage.sync(testAppDirectory);
		fsPackage.writeFileSync(fileFullPath, '');
		assert.strictEqual(filesystemLibrary.ROCOFilesystemInputDataIsRealDirectoryPath(fileFullPath), false);
	});

	it('returns true if directory exists', function() {
		mkdirpPackage.sync(testAppDirectory);
		assert.strictEqual(filesystemLibrary.ROCOFilesystemInputDataIsRealDirectoryPath(testAppDirectory), true);
	});

});

describe('ROCOFilesystemInputDataIsRealFilePath', function testROCOFilesystemInputDataIsRealFilePath() {

	beforeEach(function() {
		if (fsPackage.existsSync(testAppDirectory)) {
			filesystemLibrary.ROCOFilesystemHelpDeleteDirectoryRecursive(testAppDirectory);
		};
	});

	var fileFullPath = pathPackage.join(
		testAppDirectory,
		'alpha.txt'
	);

	it('returns null if parameter not filesystem path', function() {
		assert.strictEqual(filesystemLibrary.ROCOFilesystemInputDataIsRealFilePath(''), false);
	});

	it('returns null if file path does not exist', function() {
		assert.strictEqual(filesystemLibrary.ROCOFilesystemInputDataIsRealFilePath(fileFullPath), false);
	});

	it('returns null if path not file', function() {
		mkdirpPackage.sync(testAppDirectory);
		assert.strictEqual(filesystemLibrary.ROCOFilesystemInputDataIsRealFilePath(testAppDirectory), false);
	});

	it('returns true if file exists', function() {
		mkdirpPackage.sync(testAppDirectory);
		fsPackage.writeFileSync(fileFullPath, '');
		assert.strictEqual(filesystemLibrary.ROCOFilesystemInputDataIsRealFilePath(fileFullPath), true);
	});

});

describe('ROCOFilesystemHelpCreateDirectoryIfDoesNotExist', function testROCOFilesystemHelpCreateDirectoryIfDoesNotExist() {

	beforeEach(function() {
		if (fsPackage.existsSync(testAppDirectory)) {
			filesystemLibrary.ROCOFilesystemHelpDeleteDirectoryRecursive(testAppDirectory);
		};
	});

	it('returns null and creates directory', function() {
		var directoryFullPath = pathPackage.join(testAppDirectory, 'alpha');

		assert.strictEqual(fsPackage.existsSync(directoryFullPath), false);
		assert.strictEqual(filesystemLibrary.ROCOFilesystemHelpCreateDirectoryIfDoesNotExist(directoryFullPath), null);
		assert.strictEqual(fsPackage.existsSync(directoryFullPath), true);
	});

	it('does not delete existing directory', function() {
		var directoryFullPath = pathPackage.join(testAppDirectory, 'alpha');
		mkdirpPackage.sync(directoryFullPath);

		var fileFullPath = pathPackage.join(directoryFullPath, 'bravo.txt');
		fsPackage.writeFileSync(fileFullPath, '');
		assert.strictEqual(fsPackage.existsSync(fileFullPath), true);

		assert.strictEqual(filesystemLibrary.ROCOFilesystemHelpCreateDirectoryIfDoesNotExist(directoryFullPath), null);
		assert.strictEqual(fsPackage.existsSync(fileFullPath), true);
	});

});

describe('ROCOFilesystemHelpDeleteDirectoryRecursive', function testROCOFilesystemHelpDeleteDirectoryRecursive() {

	beforeEach(function() {
		if (fsPackage.existsSync(testAppDirectory)) {
			filesystemLibrary.ROCOFilesystemHelpDeleteDirectoryRecursive(testAppDirectory);
		};
		mkdirpPackage.sync(testAppDirectory);
	});

	it('returns 0 if path does not exist', function() {
		var directoryFullPath = pathPackage.join(
			testAppDirectory,
			'alpha'
		);

		assert.strictEqual(fsPackage.existsSync(directoryFullPath), false);
		assert.strictEqual(filesystemLibrary.ROCOFilesystemHelpDeleteDirectoryRecursive(directoryFullPath), 0);
	});

	it('returns 0 if path not directory', function() {
		var fileFullPath = pathPackage.join(
			testAppDirectory,
			'alpha.txt'
		);
		mkdirpPackage.sync(testAppDirectory);
		fsPackage.writeFileSync(fileFullPath, '');

		assert.strictEqual(filesystemLibrary.ROCOFilesystemHelpDeleteDirectoryRecursive(fileFullPath), 0);
	});

	it('returns 1 and deletes directory', function() {
		var directoryFullPath = pathPackage.join(
			testAppDirectory,
			'alpha'
		);
		assert.strictEqual(fsPackage.existsSync(directoryFullPath), false);

		var fileFullPath = pathPackage.join(
			directoryFullPath,
			'alpha.txt'
		);
		mkdirpPackage.sync(directoryFullPath);
		fsPackage.writeFileSync(fileFullPath, '');
		assert.strictEqual(fsPackage.existsSync(fileFullPath), true);

		assert.strictEqual(filesystemLibrary.ROCOFilesystemHelpDeleteDirectoryRecursive(testAppDirectory), 1);
		assert.strictEqual(fsPackage.existsSync(directoryFullPath), false);
		assert.strictEqual(fsPackage.existsSync(testAppDirectory), false);
	});

});

describe('ROCOFilesystemAppDirectoryName', function testROCOFilesystemAppDirectoryName() {

	it('returns app directory name', function() {
		assert.strictEqual(filesystemLibrary.ROCOFilesystemAppDirectoryName(), 'os-app');
	});

});

describe('ROCOFilesystemCacheDirectoryName', function testROCOFilesystemCacheDirectoryName() {

	it('returns cache directory name', function() {
		assert.strictEqual(filesystemLibrary.ROCOFilesystemCacheDirectoryName(), 'os-cache');
	});

});

describe('ROCOFilesystemDataDirectoryName', function testROCOFilesystemDataDirectoryName() {

	it('returns data directory name', function() {
		assert.strictEqual(filesystemLibrary.ROCOFilesystemDataDirectoryName(), 'os-data');
	});

});

describe('ROCOFilesystemPublicDirectoryName', function testROCOFilesystemPublicDirectoryName() {

	it('returns public directory name', function() {
		assert.strictEqual(filesystemLibrary.ROCOFilesystemPublicDirectoryName(), 'os-public');
	});

});

describe('ROCOFilesystemSystemDirectoryName', function testROCOFilesystemSystemDirectoryName() {

	it('returns system directory name', function() {
		assert.strictEqual(filesystemLibrary.ROCOFilesystemSystemDirectoryName(), 'os-system');
	});

});

describe('ROCOFilesystemWorkspaceTestingDirectoryName', function testROCOFilesystemWorkspaceTestingDirectoryName() {

	it('returns workspace testing directory name', function() {
		assert.strictEqual(filesystemLibrary.ROCOFilesystemWorkspaceTestingDirectoryName(), 'os-workspace-testing');
	});

});

describe('ROCOFilesystemWorkspaceTestingDirectorySubfolderNameFor', function testROCOFilesystemWorkspaceTestingDirectorySubfolderNameFor() {

	it('throws error if param1 not string', function() {
		assert.throws(function() {
			filesystemLibrary.ROCOFilesystemWorkspaceTestingDirectorySubfolderNameFor(null);
		}, /ROCOErrorInputInvalid/);
	});

	it('throws error if param1 empty', function() {
		assert.throws(function() {
			filesystemLibrary.ROCOFilesystemWorkspaceTestingDirectorySubfolderNameFor('');
		}, /ROCOErrorInputInvalid/);
	});

	it('returns subfolderName', function() {
		assert.strictEqual(filesystemLibrary.ROCOFilesystemWorkspaceTestingDirectorySubfolderNameFor('os-alpha'), 'test-os-alpha');
		assert.strictEqual(filesystemLibrary.ROCOFilesystemWorkspaceTestingDirectorySubfolderNameFor('os-bravo.charlie'), 'test-os-bravo-charlie');
	});

});

describe('ROCOFilesystemLaunchFileName', function testROCOFilesystemLaunchFileName() {

	it('returns launch file name', function() {
		assert.strictEqual(filesystemLibrary.ROCOFilesystemLaunchFileName(), 'os-launch.js');
	});

});

describe('_ROCOFilesystemAbsolutePathRootDirectory', function test_ROCOFilesystemAbsolutePathRootDirectory() {

	it('returns app directory absolutePath', function() {
		assert.strictEqual(filesystemLibrary.ROCOFilesystemInputDataIsRealFilePath(pathPackage.join(filesystemLibrary._ROCOFilesystemAbsolutePathRootDirectory(), filesystemLibrary.ROCOFilesystemLaunchFileName())), true);
	});

});

describe('_ROCOFilesystemAbsolutePathWorkspaceTestingDirectory', function test_ROCOFilesystemAbsolutePathWorkspaceTestingDirectory() {

	it('returns workspace testing absolutePath', function() {
		assert.strictEqual(filesystemLibrary._ROCOFilesystemAbsolutePathWorkspaceTestingDirectory(), pathPackage.join(filesystemLibrary._ROCOFilesystemAbsolutePathRootDirectory(), filesystemLibrary.ROCOFilesystemWorkspaceTestingDirectoryName()));
	});

});

describe('ROCOFilesystemSharedFileExtensionJSON', function testROCOFilesystemSharedFileExtensionJSON() {

	it('returns json', function() {
		assert.strictEqual(filesystemLibrary.ROCOFilesystemSharedFileExtensionJSON(), 'json');
	});

});

describe('ROCOFilesystemSharedFileExtensionYAML', function testROCOFilesystemSharedFileExtensionYAML() {

	it('returns yaml', function() {
		assert.strictEqual(filesystemLibrary.ROCOFilesystemSharedFileExtensionYAML(), 'yaml');
	});

});

describe('ROCOFilesystemDefaultTextEncoding', function testROCOFilesystemDefaultTextEncoding() {

	it('returns system directory name', function() {
		assert.strictEqual(filesystemLibrary.ROCOFilesystemDefaultTextEncoding(), 'utf8');
	});

});
