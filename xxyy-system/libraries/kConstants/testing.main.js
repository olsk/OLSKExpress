/*!
 * xxyy-sample
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var filesystemLibrary = require('../ROCOFilesystem/main');

exports.ROCOTestingConstants = function () {
	return {
		ROCOTestingSystemDirectoryAbsolutePath: filesystemLibrary._ROCOFilesystemSystemDirectoryAbsolutePath(),
		ROCOTestingLiveDirectoryAbsolutePath: filesystemLibrary._ROCOFilesystemWorkspaceTestingDirectoryAbsolutePath(),

		ROCOTestingCacheObjectValid: function () {
			return {
				'test-1990-01-01T21:09:00.000Z': 12.34,
			};
		},

		OLSKTestingRouteObjectValid: function () {
			return {
				OLSKRoutePath: '/alpha',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: function () {},
			};
		},

		OLSKTestingRouteObjectValidRedirect: function () {
			return {
				OLSKRoutePath: '/alpha',
				OLSKRouteRedirect: '/bravo',
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
