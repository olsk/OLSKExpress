/*!
 * rofo-sample
 * Copyright(c) 2016-2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var homeController = require('./controller');

describe('ROCOControllerRoutes', function testROCOControllerRoutes () {
	
	it('returns route objects', function () {
		assert.deepEqual(homeController.ROCOControllerRoutes(), {
			XXYYRouteHome: {
				ROCORoutePath: '/',
				ROCORouteMethods: 'get',
				ROCORouteFunction: homeController.index,
				ROCORouteLocales: ['en', 'fr'],
			},
		});
	});

});
