/*!
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

//_ ROCOEnvironmentIsProductionForNODE_ENV

exports.ROCOEnvironmentIsProductionForNODE_ENV = function (inputData) {
	return inputData === 'production';
};
