/*!
 * OldSkool
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var filesystemLibrary = require('../ROCOFilesystem/main');

exports.ROCOTestingConstants = function() {
	return {
		ROCOTestingLiveDirectoryAbsolutePath: filesystemLibrary._ROCOFilesystemAbsolutePathWorkspaceTestingDirectory(),

	};
};
