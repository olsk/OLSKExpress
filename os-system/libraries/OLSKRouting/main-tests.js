/*!
 * OldSkool
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');
var kConstants = require('../kConstants/testing.main').ROCOTestingConstants();

var routingLibrary = require('./main');

describe('OLSKRoutingInputDataIsRouteObject', function testOLSKRoutingInputDataIsRouteObject() {

	it('returns false if not object', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(null), false);
	});

	it('returns false if OLSKRoutePath not string', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(Object.assign(kConstants.OLSKTestingRouteObjectValid(), {
			OLSKRoutePath: null,
		})), false);
	});

	describe('OLSKRouteRedirect', function() {

		it('returns false if not string', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(Object.assign(kConstants.OLSKTestingRouteObjectValidRedirect(), {
				OLSKRouteRedirect: null,
			})), false);
		});

		it('returns true', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(kConstants.OLSKTestingRouteObjectValidRedirect()), true);
		});

	});

	it('returns false if OLSKRouteMethod not string', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(Object.assign(kConstants.OLSKTestingRouteObjectValid(), {
			OLSKRouteMethod: null,
		})), false);
	});

	it('returns false if OLSKRouteFunction not function', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(Object.assign(kConstants.OLSKTestingRouteObjectValid(), {
			OLSKRouteFunction: null,
		})), false);
	});

	it('returns true', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(kConstants.OLSKTestingRouteObjectValid()), true);
	});

	describe('OLSKRouteIsHidden', function() {

		it('returns false if not boolean', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(Object.assign(kConstants.OLSKTestingRouteObjectValid(), {
				OLSKRouteIsHidden: 'true',
			})), false);
		});

		it('returns true', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(Object.assign(kConstants.OLSKTestingRouteObjectValid(), {
				OLSKRouteIsHidden: true,
			})), true);
		});

	});

	describe('OLSKRouteMiddlewares', function() {

		it('returns false if not array', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(Object.assign(kConstants.OLSKTestingRouteObjectValid(), {
				OLSKRouteMiddlewares: 'alpha',
			})), false);
		});

		it('returns true', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(Object.assign(kConstants.OLSKTestingRouteObjectValid(), {
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
		assert.strictEqual(routingLibrary.OLSKRoutingCanonicalPathWithRouteObjectAndOptionalParams(kConstants.OLSKTestingRouteObjectValid()), '/alpha');
	});

	it('returns localized path with OLSKRoutingLanguage', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingCanonicalPathWithRouteObjectAndOptionalParams(kConstants.OLSKTestingRouteObjectValid(), {
			OLSKRoutingLanguage: 'en'
		}), '/en/alpha');
	});

	describe('when route path has params', function() {

		it('throws error if param2 not object', function() {
			assert.throws(function() {
				routingLibrary.OLSKRoutingCanonicalPathWithRouteObjectAndOptionalParams(Object.assign(kConstants.OLSKTestingRouteObjectValid(), {
					OLSKRoutePath: '/alpha/:bravo',
				}));
			}, /OLSKErrorInputInvalid/);
		});

		it('throws error if param2 without matching single param', function() {
			assert.throws(function() {
				routingLibrary.OLSKRoutingCanonicalPathWithRouteObjectAndOptionalParams(Object.assign(kConstants.OLSKTestingRouteObjectValid(), {
					OLSKRoutePath: '/alpha/:bravo',
				}), {});
			}, /OLSKErrorInputInvalid/);
		});

		it('returns path with single param substituted', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingCanonicalPathWithRouteObjectAndOptionalParams(Object.assign(kConstants.OLSKTestingRouteObjectValid(), {
				OLSKRoutePath: '/alpha/:bravo',
			}), {
				bravo: 'charlie',
			}), '/alpha/charlie');
		});

		it('throws error if param2 without matching multiple params', function() {
			assert.throws(function() {
				routingLibrary.OLSKRoutingCanonicalPathWithRouteObjectAndOptionalParams(Object.assign(kConstants.OLSKTestingRouteObjectValid(), {
					OLSKRoutePath: '/alpha/:bravo/:delta',
				}), {
					bravo: 'charlie',
				});
			}, /OLSKErrorInputInvalid/);
		});

		it('returns path with multiple params substituted', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingCanonicalPathWithRouteObjectAndOptionalParams(Object.assign(kConstants.OLSKTestingRouteObjectValid(), {
				OLSKRoutePath: '/alpha/:bravo/:delta',
			}), {
				bravo: 'charlie',
				delta: 'echo'
			}), '/alpha/charlie/echo');
		});

	});

});
