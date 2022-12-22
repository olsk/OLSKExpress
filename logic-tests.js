const { throws, deepEqual } = require('assert');

const mod = require('./logic.js');

describe('OLSKClientKeyHeaderGuard', function test_OLSKClientKeyHeaderGuard() {

	const uHeaders = function (inputData) {
		return {
			'x-client-key': inputData,
		};
	};

	it('throws if param1 not object', function() {
		throws(function() {
			mod.OLSKClientKeyHeaderGuard(null, '');
		}, /RCSErrorInputNotValid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mod.OLSKClientKeyHeaderGuard({}, null);
		}, /RCSErrorInputNotValid/);
	});

	it('returns error if x-client-key not param2', function () {
		deepEqual(mod.OLSKClientKeyHeaderGuard(uHeaders(Math.random().toString()), Math.random().toString()), new Error('OLSKRoutingErrorNotFound'));
	});

	it('returns undefined', function () {
		const item = Math.random().toString();
		deepEqual(mod.OLSKClientKeyHeaderGuard(uHeaders(item), item), undefined);
	});

});

describe('OLSKAllowAllOriginsMiddleware', function test_OLSKAllowAllOriginsMiddleware() {

	const _OLSKAllowAllOriginsMiddleware = function (inputData) {
		return mod.OLSKAllowAllOriginsMiddleware({}, Object.assign({
			header: (function () {}),
		}, inputData), inputData.next || function () {});
	};

	it('throws if res not object', function() {
		throws(function() {
			mod.OLSKAllowAllOriginsMiddleware({}, {
				res: null,
			});
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if res.header not function', function() {
		throws(function() {
			_OLSKAllowAllOriginsMiddleware({
				header: null,
			});
		}, /OLSKErrorInputNotValid/);
	});

	it('calls header', function() {
		deepEqual(uCapture(function (header) {
			_OLSKAllowAllOriginsMiddleware({
				header,
			})
		}), ['Access-Control-Allow-Origin', '*']);
	});

	it('calls next', function() {
		const item = Math.random().toString();
		deepEqual(_OLSKAllowAllOriginsMiddleware({
			next: (function () {
				return item;
			}),
		}), item);
	});

});

describe('OLSKCommonMiddlewares', function test_OLSKCommonMiddlewares () {
	
	it('returns object', function () {
		deepEqual(mod.OLSKCommonMiddlewares(), Object.fromEntries(Object.entries(mod).filter(function (e) {
			return e[0].match(/Middleware$/) && !e[0].match(/(_|Error)/);
		})));
	});

});
