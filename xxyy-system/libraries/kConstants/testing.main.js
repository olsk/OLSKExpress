/*!
 * rofo-sample
 * Copyright(c) 2016-2018 Rosano Coutinho
 * MIT Licensed
 */

var filesystemLibrary = require('../ROCOFilesystem/main');

exports.ROCOTestingConstants = function () {
	return {
		ROCOTestingPublicDirectoryAbsolutePath: filesystemLibrary.ROCOFilesystemPublicDirectoryAbsolutePath(),
		ROCOTestingSystemDirectoryAbsolutePath: filesystemLibrary.ROCOFilesystemSystemDirectoryAbsolutePath(),
		ROCOTestingLiveDirectoryAbsolutePath: filesystemLibrary.ROCOFilesystemWorkspaceTestingDirectoryAbsolutePath(),

		ROCOTestingCacheObjectValid: function () {
			return {
				'test-1990-01-01T21:09:00.000Z': 12.34,
			};
		},

		ROCOTestingRouteObjectValid: function () {
			return {
				ROCORoutePath: '/alpha',
				ROCORouteMethods: 'get',
				ROCORouteFunction: function () {},
			};
		},

		ROCOTestingTaskObjectValid: function (array) {
			return {
				ROCOTaskFireTimeInterval: 0.01,
				ROCOTaskShouldBePerformed: function () {
					return true;
				},
				ROCOTaskCallback: function () {
					if (!array) {
						return;
					};
					
					return array.push(new Date());
				},
			};
		},

	};
};
