/*!
 * xxyy-sample
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var homeController = require('./controller');

describe('ROCOControllerRoutes', function testROCOControllerRoutes () {
	
	it('returns route objects', function () {
		assert.deepEqual(homeController.ROCOControllerRoutes(), {
			XXYYRouteHome: {
				ROCORoutePath: '/',
				ROCORouteMethod: 'get',
				ROCORouteFunction: homeController.index,
				ROCORouteLanguages: ['en', 'fr'],
			},
		});
	});

});
