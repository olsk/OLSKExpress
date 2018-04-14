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
	
	it('returns false if without localeId', function () {
		assert.strictEqual(internationalLibrary.ROCOInternationalInputDataIsTranslationFilename('i18n.yaml'), false);
	});
	
	it('returns true if valid translationFilename', function () {
		assert.strictEqual(internationalLibrary.ROCOInternationalInputDataIsTranslationFilename('i18n.en.yaml'), true);
	});

});

describe('ROCOInternationalLocaleForTranslationFilename', function testROCOInternationalLocaleForTranslationFilename () {

	it('throws error if not translationFilename', function () {
		assert.throws(function () {
			internationalLibrary.ROCOInternationalLocaleForTranslationFilename(null);
		}, /ROCOErrorInputInvalid/);
	});
	
	it('returns localeId', function () {
		assert.strictEqual(internationalLibrary.ROCOInternationalLocaleForTranslationFilename('i18n.en.yaml'), 'en');
	});

});
