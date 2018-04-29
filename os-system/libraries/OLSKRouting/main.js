/*!
 * OldSkool
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

//_ OLSKRoutingInputDataIsRouteObject

exports.OLSKRoutingInputDataIsRouteObject = function(inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return false;
	};

	if (typeof inputData.OLSKRoutePath !== 'string') {
		return false;
	};

	if (inputData.OLSKRouteRedirect !== undefined) {
		if (typeof inputData.OLSKRouteRedirect !== 'string') {
			return false;
		};

		return true;
	};

	if (typeof inputData.OLSKRouteMethod !== 'string') {
		return false;
	};

	if (typeof inputData.OLSKRouteFunction !== 'function') {
		return false;
	};

	if (inputData.OLSKRouteIsHidden) {
		if (typeof inputData.OLSKRouteIsHidden !== 'boolean') {
			return false;
		};
	}

	return true;
};

//_ OLSKRoutingCanonicalPathWithRouteObjectAndOptionalParams

exports.OLSKRoutingCanonicalPathWithRouteObjectAndOptionalParams = function(routeObject, optionalParams) {
	if (!exports.OLSKRoutingInputDataIsRouteObject(routeObject)) {
		throw new Error('OLSKErrorInputInvalid');
	};

	var canonicalPath = routeObject.OLSKRoutePath;

	var matches = routeObject.OLSKRoutePath.match(/(:[A-Za-z0-9_]*)/g);
	if (matches) {
		if (typeof optionalParams !== 'object' || optionalParams === null) {
			throw new Error('OLSKErrorInputInvalid');
		};

		matches.forEach(function(e) {
			if (!optionalParams[e.split(':').pop()]) {
				throw new Error('OLSKErrorInputInvalid');
			};

			canonicalPath = canonicalPath.replace(e, optionalParams[e.split(':').pop()]);
		});
	};

	if (optionalParams && optionalParams.OLSKRoutingLanguage) {
		canonicalPath = ['/', optionalParams.OLSKRoutingLanguage, canonicalPath].join('');
	};

	return canonicalPath;
};
