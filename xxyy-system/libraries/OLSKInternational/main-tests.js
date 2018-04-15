/*!
 * xxyy-sample
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var internationalLibrary = require('./main');

describe('OLSKIternationalDefaultIdentifier', function testOLSKIternationalDefaultIdentifier () {
	
	it('returns i18n', function () {
		assert.strictEqual(internationalLibrary.OLSKIternationalDefaultIdentifier(), 'i18n');
	});

});

describe('OLSKIternationalInputDataIsTranslationFilename', function testOLSKIternationalInputDataIsTranslationFilename () {
	
	it('returns false if not string', function () {
		assert.strictEqual(internationalLibrary.OLSKIternationalInputDataIsTranslationFilename(null), false);
	});
	
	it('returns false if without yaml extension', function () {
		assert.strictEqual(internationalLibrary.OLSKIternationalInputDataIsTranslationFilename('i18n.en.yml'), false);
	});
	
	it('returns false if without OLSKIternationalDefaultIdentifier', function () {
		assert.strictEqual(internationalLibrary.OLSKIternationalInputDataIsTranslationFilename('en.yaml'), false);
	});
	
	it('returns false if without languageID', function () {
		assert.strictEqual(internationalLibrary.OLSKIternationalInputDataIsTranslationFilename('i18n.yaml'), false);
	});
	
	it('returns true if valid translationFilename', function () {
		assert.strictEqual(internationalLibrary.OLSKIternationalInputDataIsTranslationFilename('i18n.en.yaml'), true);
	});

});

describe('OLSKIternationalLanguageIDForTranslationFilename', function testOLSKIternationalLanguageIDForTranslationFilename () {

	it('throws error if not translationFilename', function () {
		assert.throws(function () {
			internationalLibrary.OLSKIternationalLanguageIDForTranslationFilename(null);
		}, /OLSKErrorInputInvalid/);
	});
	
	it('returns languageID', function () {
		assert.strictEqual(internationalLibrary.OLSKIternationalLanguageIDForTranslationFilename('i18n.en.yaml'), 'en');
	});

});

describe('OLSKIternationalLocalizedStringWithTranslationKeyAndTranslationDictionary', function testOLSKIternationalLocalizedStringWithTranslationKeyAndTranslationDictionary () {

	it('throws error if param2 not object', function () {
		assert.throws(function () {
			internationalLibrary.OLSKIternationalLocalizedStringWithTranslationKeyAndTranslationDictionary('alpha', null);
		}, /OLSKErrorInputInvalid/);
	});
	
	it('returns localizedString', function () {
		assert.strictEqual(internationalLibrary.OLSKIternationalLocalizedStringWithTranslationKeyAndTranslationDictionary('alpha', {
			alpha: 'bravo',
		}), 'bravo');
	});
	
	it('returns alternate string if translation not available', function () {
		assert.strictEqual(internationalLibrary.OLSKIternationalLocalizedStringWithTranslationKeyAndTranslationDictionary('alpha', {
			charlie: 'bravo',
		}), 'TRANSLATION_MISSING');
	});

});
