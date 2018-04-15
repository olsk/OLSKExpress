/*!
 * xxyy-sample
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

//_ ROCOEnvironmentIDTesting

exports.ROCOEnvironmentIDTesting = function () {
	return 'kROCOEnvironmentIDTesting';
};

//_ ROCOEnvironmentIsProductionForNODE_ENV

exports.ROCOEnvironmentIsProductionForNODE_ENV = function (inputData) {
	return inputData === 'production';
};

//_ ROCOEnvironmentIsWorkerFor

exports.ROCOEnvironmentIsWorkerFor = function (inputData) {
	if (inputData === null || typeof inputData !== 'object') {
		return false;
	};

	return inputData.ROCO_SERVER_TYPE === 'ROCOServerTypeWorker';
};
