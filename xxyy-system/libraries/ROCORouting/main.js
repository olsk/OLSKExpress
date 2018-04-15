/*!
 * xxyy-sample
 * Copyright(c) 2018 Rosano Coutinho
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

	if (inputData.ROCORouteRedirect !== undefined) {
		if (typeof inputData.ROCORouteRedirect !== 'string') {
			return false;
		};

		return true;
	};

	if (typeof inputData.ROCORouteMethod !== 'string') {
		return false;
	};

	if (typeof inputData.ROCORouteFunction !== 'function') {
		return false;
	};

	return true;
};

//_ ROCORoutingCanonicalPathWithRouteObjectAndOptionalParams

exports.ROCORoutingCanonicalPathWithRouteObjectAndOptionalParams = function (routeObject, optionalParams) {
	if (!exports.ROCORoutingInputDataIsRouteObject(routeObject)) {
		throw new Error('ROCOErrorInputInvalid');
	};

	var canonicalPath = routeObject.ROCORoutePath;

	var matches = routeObject.ROCORoutePath.match(/(:[A-Za-z0-9_]*)/g);
	if (matches) {
		if (typeof optionalParams !== 'object' || optionalParams === null) {
			throw new Error('ROCOErrorInputInvalid');
		};

		matches.forEach(function (e) {
			if (!optionalParams[e.split(':').pop()]) {
				throw new Error('ROCOErrorInputInvalid');
			};

			canonicalPath = canonicalPath.replace(e, optionalParams[e.split(':').pop()])
		});
	}

	if (optionalParams) {
		if (optionalParams.ROCORoutingLanguage) {
			canonicalPath = ['/', optionalParams.ROCORoutingLanguage, canonicalPath].join('');
		}
	}

	return canonicalPath;
};
