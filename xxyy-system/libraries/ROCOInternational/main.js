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
	}

	if (inputData.indexOf(exports.ROCOInternationalDefaultIdentifier()) === -1) {
		return false;
	}

	if (inputData.split('.').splice(1).length !== 2) {
		return false;
	}

	return true;
};
