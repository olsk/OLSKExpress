/*!
 * OldSkool
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var filesystemLibrary = require('../ROCOFilesystem/main');

exports.ROCOTestingConstants = function() {
	return {
		ROCOTestingLiveDirectoryAbsolutePath: filesystemLibrary._ROCOFilesystemAbsolutePathWorkspaceTestingDirectory(),

		ROCOTestingTaskObjectValid: function(array) {
			return {
				ROCOTaskFireTimeInterval: 0.01,
				ROCOTaskShouldBePerformed: function() {
					return true;
				},
				ROCOTaskCallback: function() {
					if (!array) {
						return;
					}

					return array.push(new Date());
				},
			};
		},

	};
};
