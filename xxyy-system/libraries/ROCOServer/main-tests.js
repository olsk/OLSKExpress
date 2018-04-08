/*!
 * rofo-sample
 * Copyright(c) 2016-2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var serverLibrary = require('./main');

describe('ROCOServerNormalizePort', function testROCOServerNormalizePort () {
	
	it('returns parameter if NaN', function () {
		assert.strictEqual(serverLibrary.ROCOServerNormalizePort(null), null);
		assert.strictEqual(serverLibrary.ROCOServerNormalizePort('alpha'), 'alpha');
	});
	
	it('returns false if param1 below 0', function () {
		assert.strictEqual(serverLibrary.ROCOServerNormalizePort('-123'), false);
		assert.strictEqual(serverLibrary.ROCOServerNormalizePort(-123), false);
	});
	
	it('returns integer if param1 0', function () {
		assert.strictEqual(serverLibrary.ROCOServerNormalizePort('0'), 0);
		assert.strictEqual(serverLibrary.ROCOServerNormalizePort(0), 0);
	});
	
	it('returns integer if param1 above 0', function () {
		assert.strictEqual(serverLibrary.ROCOServerNormalizePort('123'), 123);
		assert.strictEqual(serverLibrary.ROCOServerNormalizePort(123), 123);
	});

});
