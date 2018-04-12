/*!
 * rofo-sample
 * Copyright(c) 2016-2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');
var kConstants = require('../kConstants/testing.main').ROCOTestingConstants();

var routingLibrary = require('./main');

describe('ROCORoutingInputDataIsRouteObject', function testROCORoutingInputDataIsRouteObject () {

	it('returns false if not object', function () {
		assert.strictEqual(routingLibrary.ROCORoutingInputDataIsRouteObject(null), false);
	});
	
	it('returns false if ROCORoutePath not string', function () {
		assert.strictEqual(routingLibrary.ROCORoutingInputDataIsRouteObject(Object.assign(kConstants.ROCOTestingRouteObjectValid(), {
			ROCORoutePath: null,
		})), false);
	});
	
	it('returns true if valid taskObject', function () {
		assert.strictEqual(routingLibrary.ROCORoutingInputDataIsRouteObject(kConstants.ROCOTestingRouteObjectValid()), true);
	});

});
