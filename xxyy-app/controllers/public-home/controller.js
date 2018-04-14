/*!
 * rofo-sample
 * Copyright(c) 2016-2018 Rosano Coutinho
 * MIT Licensed
 */

//_ ROCOControllerRoutes

exports.ROCOControllerRoutes = function () {
	return {
		XXYYRouteHome: {
			ROCORoutePath: '/',
			ROCORouteMethod: 'get',
			ROCORouteFunction: exports.index,
			ROCORouteLocales: ['fr', 'en'],
		},
	};
};

exports.index = function(req, res, next) {
	res.render('public-home/index', {
		XXYYPageContent: 'Hello world', // #localize
	});
};
