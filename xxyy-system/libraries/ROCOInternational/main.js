/*!
 * rofo-sample
 * Copyright(c) 2016-2018 Rosano Coutinho
 * MIT Licensed
 */

var filesystemLibrary = require('../ROCOFilesystem/main');

//_ ROCOInternationalDefaultIdentifier

exports.ROCOInternationalDefaultIdentifier = function () {
	return 'i18n';
};

//_ ROCOInternationalInputDataIsTranslationFilename

exports.ROCOInternationalInputDataIsTranslationFilename = function (inputData) {
	if (typeof inputData !== 'string') {
		return false;
	};

	if (inputData.split('.').pop() !== filesystemLibrary.ROCOFilesystemSharedFileExtensionYAML()) {
		return false;
	};

	if (inputData.split('.').shift() !== exports.ROCOInternationalDefaultIdentifier()) {
		return false;
	};

	if (!exports._ROCOInternationalLanguageIDForInputData(inputData)) {
		return false;
	};

	return true;
};

//_ ROCOInternationalLanguageIDForTranslationFilename

exports.ROCOInternationalLanguageIDForTranslationFilename = function (inputData) {
	if (!exports.ROCOInternationalInputDataIsTranslationFilename(inputData)) {
		throw new Error('ROCOErrorInputInvalid');
	};

	return exports._ROCOInternationalLanguageIDForInputData(inputData);
};

//_ _ROCOInternationalLanguageIDForInputData

exports._ROCOInternationalLanguageIDForInputData = function (inputData) {
	var elements = inputData.split('.');

	elements.pop();
	elements.shift();

	return elements.pop();
};

//_ ROCOInternationalLocalizedStringWithTranslationKeyTranslationDictionaryAndOptions

exports.ROCOInternationalLocalizedStringWithTranslationKeyTranslationDictionaryAndOptions = function (translationKey, translationDictionary, options) {
	if (typeof translationDictionary !== 'object' || translationDictionary === null) {
		throw new Error('ROCOErrorInputInvalid');
	};

	var localizedString = translationDictionary[translationKey];

	if (!localizedString) {
		localizedString = 'TRANSLATION_MISSING';
	};

	return localizedString;
};
