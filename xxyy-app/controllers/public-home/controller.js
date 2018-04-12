/*!
 * rofo-sample
 * Copyright(c) 2016-2018 Rosano Coutinho
 * MIT Licensed
 */

exports.ROCOControllerRoutes = function () {
	return [
		{
			ROCORoutePath: '/',
			ROCORouteMethods: 'get',
			ROCORouteFunction: exports.index,
			ROCORouteConstant: 'XXYYRouteHome',
		},
	];
}

exports.index = function(req, res, next) {
	res.render('public-home/index', {
		XXYYPageContent: 'Hello world', // #localize
	});
};
