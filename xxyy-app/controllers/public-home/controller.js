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
			ROCORouteLanguages: ['fr', 'en'],
		},
	};
};

exports.index = function(req, res, next) {	
	res.render('public-home/index', {
		XXYYPageData1: (new Date()).valueOf(),
		XXYYPageData2: (new Date()).toLocaleString(req.ROCOInternationalCurrentLanguage),
	});
};
