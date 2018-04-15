/*!
 * xxyy-sample
 * Copyright(c) 2016-2018 Rosano Coutinho
 * MIT Licensed
 */

//_ ROCOServerErrorCallback

exports.ROCOServerErrorCallback = function () {
	return function (error) {
		if (error.syscall !== 'listen') {
			throw error;
		}

		var bind = typeof error.port === 'string'
			? 'Pipe ' + error.port
			: 'Port ' + error.port;

		if (error.code === 'EACCES') {
			console.error(bind + ' requires elevated privileges');
			return process.exit(1);
		};

		if (error.code === 'EADDRINUSE') {
			console.error(bind + ' is already in use');
			return process.exit(1);
		};

		throw error;
	}
};

//_ ROCOServerListeningCallback

exports.ROCOServerListeningCallback = function (serverObject, debugObject) {
	return function () {
		var serverAddress = serverObject.address();
		var bind = typeof serverAddress === 'string'
			? 'pipe ' + serverAddress
			: 'port ' + serverAddress.port;
		debugObject('Listening on ' + bind);
	}
};
