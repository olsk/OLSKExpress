/*!
 * rofo-sample
 * Copyright(c) 2016-2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');
var kConstants = require('../kConstants/testing.main').ROCOTestingConstants();

var environmentLibrary = require('./main');

describe('ROCOEnvironmentIDTesting', function testROCOEnvironmentIDTesting () {
	
	it('returns kROCOEnvironmentIDTesting', function () {
		assert.strictEqual(environmentLibrary.ROCOEnvironmentIDTesting(), 'kROCOEnvironmentIDTesting');
	});

});

describe('ROCOEnvironmentIsProductionForNODE_ENV', function testROCOEnvironmentIsProductionForNODE_ENV () {
	
	it('returns false if param1 not production', function () {
		assert.strictEqual(environmentLibrary.ROCOEnvironmentIsProductionForNODE_ENV(null), false);
		assert.strictEqual(environmentLibrary.ROCOEnvironmentIsProductionForNODE_ENV('development'), false);
	});
	
	it('returns false if param1 not production', function () {
		assert.strictEqual(environmentLibrary.ROCOEnvironmentIsProductionForNODE_ENV('production'), true);
	});

});

describe('ROCOEnvironmentIsWorkerFor', function testROCOEnvironmentIsWorkerFor () {
	
	it('returns false if param1 not object', function () {
		assert.strictEqual(environmentLibrary.ROCOEnvironmentIsWorkerFor(null), false);
	});
	
	it('returns false if ROCO_SERVER_TYPE not string', function () {
		assert.strictEqual(environmentLibrary.ROCOEnvironmentIsWorkerFor({ROCO_SERVER_TYPE: null}), false);
	});
	
	it('returns true if ROCO_SERVER_TYPE ROCOServerTypeWorker', function () {
		assert.strictEqual(environmentLibrary.ROCOEnvironmentIsWorkerFor({ROCO_SERVER_TYPE: 'ROCOServerTypeWorker'}), true);
	});

});
