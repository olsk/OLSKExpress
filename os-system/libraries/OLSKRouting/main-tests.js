/*!
 * OldSkool
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var routingLibrary = require('./main');

var OLSKTestingRouteObjectValid = function() {
	return {
		OLSKRoutePath: '/alpha',
		OLSKRouteMethod: 'get',
		OLSKRouteFunction: function() {},
	};
};

var OLSKTestingRouteObjectValidRedirect = function() {
	return {
		OLSKRoutePath: '/alpha',
		OLSKRouteRedirect: '/bravo',
	};
};

describe('OLSKRoutingInputDataIsRouteObject', function testOLSKRoutingInputDataIsRouteObject() {

	it('returns false if not object', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(null), false);
	});

	it('returns false if OLSKRoutePath not string', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(Object.assign(OLSKTestingRouteObjectValid(), {
			OLSKRoutePath: null,
		})), false);
	});

	describe('OLSKRouteRedirect', function() {

		it('returns false if not string', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(Object.assign(OLSKTestingRouteObjectValidRedirect(), {
				OLSKRouteRedirect: null,
			})), false);
		});

		it('returns true', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(OLSKTestingRouteObjectValidRedirect()), true);
		});

	});

	it('returns false if OLSKRouteMethod not string', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(Object.assign(OLSKTestingRouteObjectValid(), {
			OLSKRouteMethod: null,
		})), false);
	});

	it('returns false if OLSKRouteFunction not function', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(Object.assign(OLSKTestingRouteObjectValid(), {
			OLSKRouteFunction: null,
		})), false);
	});

	it('returns true', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(OLSKTestingRouteObjectValid()), true);
	});

	describe('OLSKRouteIsHidden', function() {

		it('returns false if not boolean', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(Object.assign(OLSKTestingRouteObjectValid(), {
				OLSKRouteIsHidden: 'true',
			})), false);
		});

		it('returns true', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(Object.assign(OLSKTestingRouteObjectValid(), {
				OLSKRouteIsHidden: true,
			})), true);
		});

	});

	describe('OLSKRouteMiddlewares', function() {

		it('returns false if not array', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(Object.assign(OLSKTestingRouteObjectValid(), {
				OLSKRouteMiddlewares: 'alpha',
			})), false);
		});

		it('returns true', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(Object.assign(OLSKTestingRouteObjectValid(), {
				OLSKRouteMiddlewares: ['alpha'],
			})), true);
		});

	});

});

describe('OLSKRoutingCanonicalPathWithRouteObjectAndOptionalParams', function testOLSKRoutingCanonicalPathWithRouteObjectAndOptionalParams() {

	it('throws error if param1 not routeObject', function() {
		assert.throws(function() {
			routingLibrary.OLSKRoutingCanonicalPathWithRouteObjectAndOptionalParams(null);
		}, /OLSKErrorInputInvalid/);
	});

	it('returns path', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingCanonicalPathWithRouteObjectAndOptionalParams(OLSKTestingRouteObjectValid()), '/alpha');
	});

	it('returns localized path with OLSKRoutingLanguage', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingCanonicalPathWithRouteObjectAndOptionalParams(OLSKTestingRouteObjectValid(), {
			OLSKRoutingLanguage: 'en'
		}), '/en/alpha');
	});

	describe('when route path has params', function() {

		it('throws error if param2 not object', function() {
			assert.throws(function() {
				routingLibrary.OLSKRoutingCanonicalPathWithRouteObjectAndOptionalParams(Object.assign(OLSKTestingRouteObjectValid(), {
					OLSKRoutePath: '/alpha/:bravo',
				}));
			}, /OLSKErrorInputInvalid/);
		});

		it('throws error if param2 without matching single param', function() {
			assert.throws(function() {
				routingLibrary.OLSKRoutingCanonicalPathWithRouteObjectAndOptionalParams(Object.assign(OLSKTestingRouteObjectValid(), {
					OLSKRoutePath: '/alpha/:bravo',
				}), {});
			}, /OLSKErrorInputInvalid/);
		});

		it('returns path with single param substituted', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingCanonicalPathWithRouteObjectAndOptionalParams(Object.assign(OLSKTestingRouteObjectValid(), {
				OLSKRoutePath: '/alpha/:bravo',
			}), {
				bravo: 'charlie',
			}), '/alpha/charlie');
		});

		it('throws error if param2 without matching multiple params', function() {
			assert.throws(function() {
				routingLibrary.OLSKRoutingCanonicalPathWithRouteObjectAndOptionalParams(Object.assign(OLSKTestingRouteObjectValid(), {
					OLSKRoutePath: '/alpha/:bravo/:delta',
				}), {
					bravo: 'charlie',
				});
			}, /OLSKErrorInputInvalid/);
		});

		it('returns path with multiple params substituted', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingCanonicalPathWithRouteObjectAndOptionalParams(Object.assign(OLSKTestingRouteObjectValid(), {
				OLSKRoutePath: '/alpha/:bravo/:delta',
			}), {
				bravo: 'charlie',
				delta: 'echo'
			}), '/alpha/charlie/echo');
		});

	});

});
