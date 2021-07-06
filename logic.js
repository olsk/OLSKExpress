const mod = {

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
