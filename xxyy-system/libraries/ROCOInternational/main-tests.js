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

describe('ROCOInternationalInputDataIsTranslationFilename', function testROCOInternationalInputDataIsTranslationFilename () {
	
	it('returns false if not string', function () {
		assert.strictEqual(internationalLibrary.ROCOInternationalInputDataIsTranslationFilename(null), false);
	});
	
	it('returns false if without yaml extension', function () {
		assert.strictEqual(internationalLibrary.ROCOInternationalInputDataIsTranslationFilename('i18n.en.yml'), false);
	});
	
	it('returns false if without ROCOInternationalDefaultIdentifier', function () {
		assert.strictEqual(internationalLibrary.ROCOInternationalInputDataIsTranslationFilename('en.yaml'), false);
	});
	
	it('returns false if without locale', function () {
		assert.strictEqual(internationalLibrary.ROCOInternationalInputDataIsTranslationFilename('i18n.yaml'), false);
	});
	
	it('returns true', function () {
		assert.strictEqual(internationalLibrary.ROCOInternationalInputDataIsTranslationFilename('en.i18n.yaml'), true);
	});

});
