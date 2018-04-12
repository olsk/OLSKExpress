/*!
 * rofo-sample
 * Copyright(c) 2016-2018 Rosano Coutinho
 * MIT Licensed
 */

//_ ROCORoutingInputDataIsRouteObject

exports.ROCORoutingInputDataIsRouteObject = function (inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return false;
	};

	if (typeof inputData.ROCORoutePath !== 'string') {
		return false;
	};

	return true;
};
