/*!
 * rofo-sample
 * Copyright(c) 2016-2018 Rosano Coutinho
 * MIT Licensed
 */

var expressPackage = require('express');
var pathPackage = require('path');
var filesystemLibrary = require('./libraries/ROCOFilesystem/main');
var environmentLibrary = require('./libraries/ROCOEnvironment/main');

var expressApp = expressPackage();

//# ROCOStartCookies

(function ROCOStartCookies() {
	var cookieParserPackage = require('cookie-parser');

	expressApp.use(cookieParserPackage());
})();

//# ROCOStartSessions

(function ROCOStartSessions() {
	var expressSessionPackage = require('express-session');

	expressApp.use(expressSessionPackage({
		secret: 'clarinet-gulf-clencher',
		resave: false,
		saveUninitialized: true
	}));
})();

//# ROCOStartBodyParsing

(function ROCOStartBodyParsing() {
	var bodyParserPackage = require('body-parser');

	expressApp.use(bodyParserPackage.json());
	expressApp.use(bodyParserPackage.urlencoded({
		extended: true
	}));
})();

//# CONTROLLERS

var fsPackage = require('fs');

var controllersArray = [];
var controllersPath = pathPackage.join(filesystemLibrary.ROCOFilesystemAppDirectoryName(), filesystemLibrary.ROCOFilesystemAppControllersDirectoryName());
fsPackage.readdirSync(pathPackage.join(filesystemLibrary.ROCOFilesystemRootDirectoryAbsolutePath(), controllersPath)).forEach(function(dirItem, index) {

	var itemPath = pathPackage.join(controllersPath, dirItem, 'controller.js')
	if (!filesystemLibrary.ROCOFilesystemInputDataIsRealFilePath(pathPackage.join(filesystemLibrary.ROCOFilesystemRootDirectoryAbsolutePath(), itemPath))) {
		return;
	}

	controllersArray.push(require('../' + itemPath));
});

//# PUBLIC DIRECTORY

expressApp.use(expressPackage.static(pathPackage.join(filesystemLibrary.ROCOFilesystemRootDirectoryAbsolutePath(), filesystemLibrary.ROCOFilesystemPublicDirectoryName()), {
	extensions:['html'],
}));

//# ROUTING

var routingLibrary = require('./libraries/ROCORouting/main');
var expressRouter = require('express').Router();

var allRoutes = {};

controllersArray.forEach(function (e) {
	controllerRoutes = e.ROCOControllerRoutes();

	allRoutes = Object.assign(allRoutes, controllerRoutes);
});

expressApp.use(function(req, res, next) {
	res.locals.ROCOCanonicalFor = function (routeConstant, optionalParams) {
		return routingLibrary.ROCORoutingCanonicalPathWithRouteObjectAndOptionalParams(allRoutes[routeConstant], optionalParams);
	};

	next();
});

Object.keys(allRoutes).forEach(function (key) {
	var e = allRoutes[key];

	return expressRouter[e.ROCORouteMethods](e.ROCORoutePath, e.ROCORouteRedirect ? function (req, res) {
		return res.redirect(e.ROCORouteRedirect);
	} : function (req, res, next) {
		res.locals.ROCOSharedActiveRouteConstant = key;

		return e.ROCORouteFunction(req, res, next);
	});
});

expressApp.use('/', expressRouter);

//# TEMPLATING ENGINE

expressApp.set('view engine', 'ejs');
expressApp.set('views', [
	pathPackage.join(pathPackage.join(filesystemLibrary.ROCOFilesystemRootDirectoryAbsolutePath(), filesystemLibrary.ROCOFilesystemAppDirectoryName(), filesystemLibrary.ROCOFilesystemAppControllersDirectoryName())),
	]);

//# SERVER

var serverLibrary = require('./libraries/ROCOServer/main');
var httpPackage = require('http');
var serverModule = require('./modules/server');
var debugObject = require('debug')('rofo-sample-app:server');

var portValue = serverLibrary.ROCOServerNormalizePort(process.env.PORT || '3000');
var serverObject = httpPackage.createServer(expressApp);
expressApp.set('port', portValue);
serverObject.listen(portValue);
serverObject.on('error', serverModule.ROCOServerErrorCallback());
serverObject.on('listening', serverModule.ROCOServerListeningCallback(serverObject, debugObject));

//# ERROR HANDLING

expressApp.use(function(req, res, next){
	res.status(404);

	if (environmentLibrary.ROCOEnvironmentIsProductionForNODE_ENV(process.env.NODE_ENV)) {
		if (req.accepts('html')) {
			return res.render('public-error/404', {
				url: req.url,
			});
		};

		if (req.accepts('json')) {
			return res.send({
				error: 'Not found', // #localize
			});
		};
	};

	return res.type('txt').send('Not found'); // #localize
});

expressApp.use(function(err, req, res, next){
	res.status(err.status || 500);

	if (environmentLibrary.ROCOEnvironmentIsProductionForNODE_ENV(process.env.NODE_ENV)) {
		if (req.accepts('html')) {
			return res.render('public-error/500', {
				url: req.url,
			});
		};

		if (req.accepts('json')) {
			return res.send({
				error: 'System error', // #localize
			});
		};

		return res.type('txt').send('System error'); // #localize
	};

	res.send('<pre>' + JSON.stringify({error: err}, null, 4) + '</pre><pre>' + err.stack + '</pre>');
});

if (!environmentLibrary.ROCOEnvironmentIsProductionForNODE_ENV(process.env.NODE_ENV)) {
	var loggingPackage = require('morgan');
	expressApp.use(loggingPackage('dev'));
};
