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
			ROCORouteMethods: 'get',
			ROCORouteFunction: exports.index,
		},
	};
};

exports.index = function(req, res, next) {
	res.render('public-home/index', {
		XXYYPageContent: 'Hello world', // #localize
	});
};
