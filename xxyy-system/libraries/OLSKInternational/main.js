/*!
 * xxyy-sample
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var filesystemLibrary = require('../ROCOFilesystem/main');

//_ OLSKIternationalDefaultIdentifier

exports.OLSKIternationalDefaultIdentifier = function () {
	return 'i18n';
};

//_ OLSKIternationalInputDataIsTranslationFilename

exports.OLSKIternationalInputDataIsTranslationFilename = function (inputData) {
	if (typeof inputData !== 'string') {
		return false;
	};

	if (inputData.split('.').pop() !== filesystemLibrary.ROCOFilesystemSharedFileExtensionYAML()) {
		return false;
	};

	if (inputData.split('.').shift() !== exports.OLSKIternationalDefaultIdentifier()) {
		return false;
	};

	if (!exports._OLSKIternationalLanguageIDForInputData(inputData)) {
		return false;
	};

	return true;
};

//_ OLSKIternationalLanguageIDForTranslationFilename

exports.OLSKIternationalLanguageIDForTranslationFilename = function (inputData) {
	if (!exports.OLSKIternationalInputDataIsTranslationFilename(inputData)) {
		throw new Error('OLSKErrorInputInvalid');
	};

	return exports._OLSKIternationalLanguageIDForInputData(inputData);
};

//_ _OLSKIternationalLanguageIDForInputData

exports._OLSKIternationalLanguageIDForInputData = function (inputData) {
	var elements = inputData.split('.');

	elements.pop();
	elements.shift();

	return elements.pop();
};

//_ OLSKIternationalLocalizedStringWithTranslationKeyAndTranslationDictionary

exports.OLSKIternationalLocalizedStringWithTranslationKeyAndTranslationDictionary = function (translationKey, translationDictionary) {
	if (typeof translationDictionary !== 'object' || translationDictionary === null) {
		throw new Error('OLSKErrorInputInvalid');
	};

	var localizedString = translationDictionary[translationKey];

	if (!localizedString) {
		localizedString = 'TRANSLATION_MISSING';
	};

	return localizedString;
};
