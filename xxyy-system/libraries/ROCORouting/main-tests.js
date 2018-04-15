/*!
 * xxyy-sample
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');
var kConstants = require('../kConstants/testing.main').ROCOTestingConstants();

var routingLibrary = require('./main');

describe('ROCORoutingInputDataIsRouteObject', function testROCORoutingInputDataIsRouteObject () {

	it('returns false if not object', function () {
		assert.strictEqual(routingLibrary.ROCORoutingInputDataIsRouteObject(null), false);
	});
	
	it('returns false if ROCORoutePath not string', function () {
		assert.strictEqual(routingLibrary.ROCORoutingInputDataIsRouteObject(Object.assign(kConstants.ROCOTestingRouteObjectValid(), {
			ROCORoutePath: null,
		})), false);
	});
	
	describe('redirects', function () {

		it('returns false if ROCORouteRedirect not string', function () {
			assert.strictEqual(routingLibrary.ROCORoutingInputDataIsRouteObject(Object.assign(kConstants.ROCOTestingRouteObjectValidRedirect(), {
				ROCORouteRedirect: null,
			})), false);
		});

		it('returns true', function () {
			assert.strictEqual(routingLibrary.ROCORoutingInputDataIsRouteObject(kConstants.ROCOTestingRouteObjectValidRedirect()), true);
		});

	});
	
	it('returns false if ROCORouteMethod not string', function () {
		assert.strictEqual(routingLibrary.ROCORoutingInputDataIsRouteObject(Object.assign(kConstants.ROCOTestingRouteObjectValid(), {
			ROCORouteMethod: null,
		})), false);
	});
	
	it('returns false if ROCORouteFunction not function', function () {
		assert.strictEqual(routingLibrary.ROCORoutingInputDataIsRouteObject(Object.assign(kConstants.ROCOTestingRouteObjectValid(), {
			ROCORouteFunction: null,
		})), false);
	});
	
	it('returns true if valid routeObject', function () {
		assert.strictEqual(routingLibrary.ROCORoutingInputDataIsRouteObject(kConstants.ROCOTestingRouteObjectValid()), true);
	});

});

describe('ROCORoutingCanonicalPathWithRouteObjectAndOptionalParams', function testROCORoutingCanonicalPathWithRouteObjectAndOptionalParams () {

	it('throws error if param1 not routeObject', function () {
		assert.throws(function () {
			routingLibrary.ROCORoutingCanonicalPathWithRouteObjectAndOptionalParams(null);
		}, /ROCOErrorInputInvalid/);
	});

	it('returns path', function () {
		assert.strictEqual(routingLibrary.ROCORoutingCanonicalPathWithRouteObjectAndOptionalParams(kConstants.ROCOTestingRouteObjectValid()), '/alpha');
	});

	it('returns localized path with ROCORoutingLanguage', function () {
		assert.strictEqual(routingLibrary.ROCORoutingCanonicalPathWithRouteObjectAndOptionalParams(kConstants.ROCOTestingRouteObjectValid(), {
			ROCORoutingLanguage: 'en'
		}), '/en/alpha');
	});

	describe('when route path has params', function () {

		it('throws error if param2 not object', function () {
			assert.throws(function () {
				routingLibrary.ROCORoutingCanonicalPathWithRouteObjectAndOptionalParams(Object.assign(kConstants.ROCOTestingRouteObjectValid(), {
					ROCORoutePath: '/alpha/:bravo',
				}));
			}, /ROCOErrorInputInvalid/);
		});

		it('throws error if param2 without matching single param', function () {
			assert.throws(function () {
				routingLibrary.ROCORoutingCanonicalPathWithRouteObjectAndOptionalParams(Object.assign(kConstants.ROCOTestingRouteObjectValid(), {
					ROCORoutePath: '/alpha/:bravo',
				}), {});
			}, /ROCOErrorInputInvalid/);
		});

		it('returns path with single param substituted', function () {
			assert.strictEqual(routingLibrary.ROCORoutingCanonicalPathWithRouteObjectAndOptionalParams(Object.assign(kConstants.ROCOTestingRouteObjectValid(), {
					ROCORoutePath: '/alpha/:bravo',
				}), {
				bravo: 'charlie',
			}), '/alpha/charlie');
		});

		it('throws error if param2 without matching multiple params', function () {
			assert.throws(function () {
				routingLibrary.ROCORoutingCanonicalPathWithRouteObjectAndOptionalParams(Object.assign(kConstants.ROCOTestingRouteObjectValid(), {
					ROCORoutePath: '/alpha/:bravo/:delta',
				}), {
				bravo: 'charlie',
			});
			}, /ROCOErrorInputInvalid/);
		});

		it('returns path with multiple params substituted', function () {
			assert.strictEqual(routingLibrary.ROCORoutingCanonicalPathWithRouteObjectAndOptionalParams(Object.assign(kConstants.ROCOTestingRouteObjectValid(), {
					ROCORoutePath: '/alpha/:bravo/:delta',
				}), {
				bravo: 'charlie',
				delta: 'echo'
			}), '/alpha/charlie/echo');
		});

	});

});
