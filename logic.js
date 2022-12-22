const mod = {

	OLSKClientKeyHeaderGuard (param1, param2) {
		if (typeof param1 !== 'object' || param1 === null) {
			throw new Error('RCSErrorInputNotValid');
		}

		if (typeof param2 !== 'string') {
			throw new Error('RCSErrorInputNotValid');
		}

		if (param1['x-client-key'] !== param2) {
			return new Error('OLSKRoutingErrorNotFound');
		}
	},

	OLSKClientKeyHeaderGuardMiddlewareFunction (inputData) {
		return function (req, res, next) {
			return next(mod.OLSKClientKeyHeaderGuard(req.headers, inputData));
		};
	},

	OLSKAllowAllOriginsMiddleware (req, res, next) {
		if (typeof res !== 'object' || res === null) {
			throw new Error('OLSKErrorInputNotValid');
		}

		if (typeof res.header !== 'function') {
			throw new Error('OLSKErrorInputNotValid');
		}

		res.header('Access-Control-Allow-Origin', '*');

		return next();
	},

	OLSKCommonMiddlewares () {
		return Object.fromEntries(Object.entries(mod).filter(function (e) {
			return e[0].match(/Middleware$/) && !e[0].match(/(_|Error)/);
		}));
	},

};

Object.assign(exports, mod);
