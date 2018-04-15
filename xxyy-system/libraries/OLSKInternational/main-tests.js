/*!
 * OldSkool
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var internationalLibrary = require('./main');

describe('OLSKInternationalDefaultIdentifier', function testOLSKInternationalDefaultIdentifier () {
	
	it('returns i18n', function () {
		assert.strictEqual(internationalLibrary.OLSKInternationalDefaultIdentifier(), 'i18n');
	});

});

describe('OLSKInternationalInputDataIsTranslationFilename', function testOLSKInternationalInputDataIsTranslationFilename () {
	
	it('returns false if not string', function () {
		assert.strictEqual(internationalLibrary.OLSKInternationalInputDataIsTranslationFilename(null), false);
	});
	
	it('returns false if without yaml extension', function () {
		assert.strictEqual(internationalLibrary.OLSKInternationalInputDataIsTranslationFilename('i18n.en.yml'), false);
	});
	
	it('returns false if without OLSKInternationalDefaultIdentifier', function () {
		assert.strictEqual(internationalLibrary.OLSKInternationalInputDataIsTranslationFilename('en.yaml'), false);
	});
	
	it('returns false if without languageID', function () {
		assert.strictEqual(internationalLibrary.OLSKInternationalInputDataIsTranslationFilename('i18n.yaml'), false);
	});
	
	it('returns true if valid translationFilename', function () {
		assert.strictEqual(internationalLibrary.OLSKInternationalInputDataIsTranslationFilename('i18n.en.yaml'), true);
	});

});

describe('OLSKInternationalLanguageIDForTranslationFilename', function testOLSKInternationalLanguageIDForTranslationFilename () {

	it('throws error if not translationFilename', function () {
		assert.throws(function () {
			internationalLibrary.OLSKInternationalLanguageIDForTranslationFilename(null);
		}, /OLSKErrorInputInvalid/);
	});
	
	it('returns languageID', function () {
		assert.strictEqual(internationalLibrary.OLSKInternationalLanguageIDForTranslationFilename('i18n.en.yaml'), 'en');
	});

});

describe('OLSKInternationalLocalizedStringWithTranslationKeyAndTranslationDictionary', function testOLSKInternationalLocalizedStringWithTranslationKeyAndTranslationDictionary () {

	it('throws error if param2 not object', function () {
		assert.throws(function () {
			internationalLibrary.OLSKInternationalLocalizedStringWithTranslationKeyAndTranslationDictionary('alpha', null);
		}, /OLSKErrorInputInvalid/);
	});
	
	it('returns localizedString', function () {
		assert.strictEqual(internationalLibrary.OLSKInternationalLocalizedStringWithTranslationKeyAndTranslationDictionary('alpha', {
			alpha: 'bravo',
		}), 'bravo');
	});
	
	it('returns alternate string if translation not available', function () {
		assert.strictEqual(internationalLibrary.OLSKInternationalLocalizedStringWithTranslationKeyAndTranslationDictionary('alpha', {
			charlie: 'bravo',
		}), 'TRANSLATION_MISSING');
	});

});
