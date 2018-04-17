/*!
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');
var kConstants = require('../kConstants/testing.main').ROCOTestingConstants();

var environmentLibrary = require('./main');

describe('ROCOEnvironmentIsProductionForNODE_ENV', function testROCOEnvironmentIsProductionForNODE_ENV () {
	
	it('returns false if param1 not production', function () {
		assert.strictEqual(environmentLibrary.ROCOEnvironmentIsProductionForNODE_ENV(null), false);
		assert.strictEqual(environmentLibrary.ROCOEnvironmentIsProductionForNODE_ENV('development'), false);
	});
	
	it('returns false if param1 not production', function () {
		assert.strictEqual(environmentLibrary.ROCOEnvironmentIsProductionForNODE_ENV('production'), true);
	});

});
