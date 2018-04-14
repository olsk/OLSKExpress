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

	if (!exports._ROCOInternationalLocaleForInputData(inputData)) {
		return false;
	};

	return true;
};

//_ ROCOInternationalLocaleForTranslationFilename

exports.ROCOInternationalLocaleForTranslationFilename = function (inputData) {
	if (!exports.ROCOInternationalInputDataIsTranslationFilename(inputData)) {
		throw new Error('ROCOErrorInputInvalid');
	};

	return exports._ROCOInternationalLocaleForInputData(inputData);
};

//_ _ROCOInternationalLocaleForInputData

exports._ROCOInternationalLocaleForInputData = function (inputData) {
	var elements = inputData.split('.');

	elements.pop();
	elements.shift();

	return elements.pop();
};
