const { throws, deepEqual } = require('assert');

const mod = require('./logic.js');

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
