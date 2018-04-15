/*!
 * xxyy-sample
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function () {
	return {
		XXYYRouteHome: {
			OLSKRoutePath: '/',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.index,
			OLSKRouteLanguages: ['en', 'fr'],
		},
	};
};

exports.index = function(req, res, next) {	
	res.render('open-home/index', {
		XXYYPageData1: (new Date()).valueOf(),
		XXYYPageData2: (new Date()).toLocaleString(req.OLSKInternationalCurrentLanguage),
	});
};
