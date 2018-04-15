/*!
 * xxyy-sample
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

//_ ROCOServerNormalizePort

exports.ROCOServerNormalizePort = function (inputData) {
	var outputInteger = parseInt(inputData, 10);

	if (isNaN(outputInteger)) { // named pipe
		return inputData;
	}

	if (outputInteger >= 0) { // port number
		return outputInteger;
	}

	return false;
};
