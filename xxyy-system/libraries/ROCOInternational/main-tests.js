/*!
 * rofo-sample
 * Copyright(c) 2016-2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var internationalLibrary = require('./main');

describe('ROCOInternationalDefaultIdentifier', function testROCOInternationalDefaultIdentifier () {
	
	it('returns i18n', function () {
		assert.strictEqual(internationalLibrary.ROCOInternationalDefaultIdentifier(), 'i18n');
	});

});

