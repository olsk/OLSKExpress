/*!
 * OldSkool
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var filesystemLibrary = require('../ROCOFilesystem/main');

//_ OLSKInternationalDefaultIdentifier

exports.OLSKInternationalDefaultIdentifier = function() {
	return 'i18n';
};

//_ OLSKInternationalInputDataIsTranslationFilename

exports.OLSKInternationalInputDataIsTranslationFilename = function(inputData) {
	if (typeof inputData !== 'string') {
		return false;
	};

	if (inputData.split('.').pop() !== filesystemLibrary.ROCOFilesystemSharedFileExtensionYAML()) {
		return false;
	};

	if (inputData.split('.').shift() !== exports.OLSKInternationalDefaultIdentifier()) {
		return false;
	};

	if (!exports._OLSKInternationalLanguageIDForInputData(inputData)) {
		return false;
	};

	return true;
};

//_ OLSKInternationalLanguageIDForTranslationFilename

exports.OLSKInternationalLanguageIDForTranslationFilename = function(inputData) {
	if (!exports.OLSKInternationalInputDataIsTranslationFilename(inputData)) {
		throw new Error('OLSKErrorInputInvalid');
	};

	return exports._OLSKInternationalLanguageIDForInputData(inputData);
};

//_ _OLSKInternationalLanguageIDForInputData

exports._OLSKInternationalLanguageIDForInputData = function(inputData) {
	var elements = inputData.split('.');

	elements.pop();
	elements.shift();

	return elements.pop();
};

//_ OLSKInternationalLocalizedStringWithTranslationKeyAndTranslationDictionary

exports.OLSKInternationalLocalizedStringWithTranslationKeyAndTranslationDictionary = function(translationKey, translationDictionary) {
	if (typeof translationDictionary !== 'object' || translationDictionary === null) {
		throw new Error('OLSKErrorInputInvalid');
	};

	var localizedString = translationDictionary[translationKey];

	if (!localizedString) {
		localizedString = 'TRANSLATION_MISSING';
	};

	return localizedString;
};
