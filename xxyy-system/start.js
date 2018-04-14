/*!
 * rofo-sample
 * Copyright(c) 2016-2018 Rosano Coutinho
 * MIT Licensed
 */

var expressPackage = require('express');
var pathPackage = require('path');
var fsPackage = require('fs');
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

//# ROCOStartControllers

var ROCOStartControllersArray = [];

(function ROCOStartControllers() {
	var controllersPath = pathPackage.join(filesystemLibrary.ROCOFilesystemAppDirectoryName(), filesystemLibrary.ROCOFilesystemAppControllersDirectoryName());
	fsPackage.readdirSync(pathPackage.join(filesystemLibrary.ROCOFilesystemRootDirectoryAbsolutePath(), controllersPath)).forEach(function(dirItem, index) {
		var itemPath = pathPackage.join(controllersPath, dirItem, 'controller.js');
		if (!filesystemLibrary.ROCOFilesystemInputDataIsRealFilePath(pathPackage.join(filesystemLibrary.ROCOFilesystemRootDirectoryAbsolutePath(), itemPath))) {
			return;
		}

		ROCOStartControllersArray.push(require('../' + itemPath));
	});
})();

//# ROCOStartPublicDirectory

(function ROCOStartPublicDirectory() {
	expressApp.use(expressPackage.static(pathPackage.join(filesystemLibrary.ROCOFilesystemRootDirectoryAbsolutePath(), filesystemLibrary.ROCOFilesystemPublicDirectoryName()), {
		extensions:['html'],
	}));
})();

//# ROCOStartInternationalization

var ROCOStartInternationalizationTranslations = {};

(function ROCOStartInternationalization() {
	var internationalLibrary = require('./libraries/ROCOInternational/main');
	var jsYAMLPackage = require('js-yaml');

	var kDefaultLocale = 'en';

	// Aggregate unique locales specified in controllers

	ROCOStartControllersArray.forEach(function (e) {
		if (typeof e.ROCOControllerLocales !== 'function') {
			return;
		};
		
		e.ROCOControllerLocales().forEach(function (e) {
			if (Object.keys(ROCOStartInternationalizationTranslations).indexOf(e) !== -1) {
				return;
			};

			ROCOStartInternationalizationTranslations[e] = {};
		});
	});

	// Skip internationalization code if there are no locales

	if (!Object.keys(ROCOStartInternationalizationTranslations).length) {
		return;
	};

	// Set ROCOInternationalCurrentLocale to default value

	expressApp.use(function(req, res, next) {
		if (Object.keys(ROCOStartInternationalizationTranslations).indexOf(kDefaultLocale) !== -1) {
			req.ROCOInternationalCurrentLocale = kDefaultLocale;
		};

		if (!req.ROCOInternationalCurrentLocale) {
			req.ROCOInternationalCurrentLocale = Object.keys(ROCOStartInternationalizationTranslations)[0];
		};

		next();
	});

	// Set ROCOInternationalRequestLocale if possible

	expressApp.use(function(req, res, next) {
		var pathSegments = req.url.split('/');
		var firstElement = pathSegments.splice(1, 1).pop();
		
		if (Object.keys(ROCOStartInternationalizationTranslations).indexOf(firstElement) === -1) {
			next();
			return;
		};

		req.ROCOInternationalRequestLocale = firstElement;
		req.url = pathSegments.length <= 1 ? '/' : pathSegments.join('/');

		next();
	});

	// Load translation strings into ROCOStartInternationalizationTranslations

	var controllersPath = pathPackage.join(filesystemLibrary.ROCOFilesystemAppDirectoryName(), filesystemLibrary.ROCOFilesystemAppControllersDirectoryName());
	fsPackage.readdirSync(pathPackage.join(filesystemLibrary.ROCOFilesystemRootDirectoryAbsolutePath(), controllersPath)).forEach(function(dirItem, index) {
		var itemPath = pathPackage.join(controllersPath, dirItem);

		if (!filesystemLibrary.ROCOFilesystemInputDataIsRealDirectoryPath(pathPackage.join(filesystemLibrary.ROCOFilesystemRootDirectoryAbsolutePath(), itemPath))) {
			return;
		};

		fsPackage.readdirSync(pathPackage.join(filesystemLibrary.ROCOFilesystemRootDirectoryAbsolutePath(), itemPath)).forEach(function(dirItem, index) {
			if (!internationalLibrary.ROCOInternationalInputDataIsTranslationFilename(dirItem)) {
				return;
			};

			ROCOStartInternationalizationTranslations[internationalLibrary.ROCOInternationalLocaleForTranslationFilename(dirItem)] = Object.assign(
				ROCOStartInternationalizationTranslations[internationalLibrary.ROCOInternationalLocaleForTranslationFilename(dirItem)],
				jsYAMLPackage.safeLoad(fsPackage.readFileSync(pathPackage.join(filesystemLibrary.ROCOFilesystemRootDirectoryAbsolutePath(), pathPackage.join(itemPath, dirItem)), filesystemLibrary.ROCOFilesystemDefaultTextEncoding()))
				);
		});
	});

	// Create translation string macro

	expressApp.use(function(req, res, next) {
		res.locals.ROCOTranslate = function (translationConstant, optionalParams) {
			return ROCOStartInternationalizationTranslations[req.ROCOInternationalCurrentLocale][translationConstant];
		};

		next();
	});
})();

//# ROCOStartRouting

(function ROCOStartRouting() {
	var routingLibrary = require('./libraries/ROCORouting/main');
	var expressRouter = require('express').Router();

	var allRoutes = {};

	// Aggregate all routes specified in controllers

	ROCOStartControllersArray.forEach(function (e) {
		if (typeof e.ROCOControllerRoutes !== 'function') {
			return;
		};

		allRoutes = Object.assign(allRoutes, e.ROCOControllerRoutes());
	});

	// Create canonical link macros

	expressApp.use(function(req, res, next) {
		res.locals.ROCOCanonicalFor = function (routeConstant, optionalParams) {
			return routingLibrary.ROCORoutingCanonicalPathWithRouteObjectAndOptionalParams(allRoutes[routeConstant], optionalParams);
		};

		if (req.ROCOInternationalCurrentLocale) {
			res.locals.ROCOCanonicalLocalizedFor = function (routeConstant, optionalParams) {
				return res.locals.ROCOCanonicalFor(routeConstant, Object.assign({
					ROCORoutingLocale: req.ROCOInternationalCurrentLocale,
				}, optionalParams));
			};
		};

		next();
	});

	// Create routing middleware

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
})();

//# ROCOStartTemplatingEngine

(function ROCOStartTemplatingEngine() {
	expressApp.set('view engine', 'ejs');
	expressApp.set('views', [
		pathPackage.join(pathPackage.join(filesystemLibrary.ROCOFilesystemRootDirectoryAbsolutePath(), filesystemLibrary.ROCOFilesystemAppDirectoryName(), filesystemLibrary.ROCOFilesystemAppControllersDirectoryName())),
	]);
})();

//# ROCOStartServer

(function ROCOStartServer() {
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
})();

//# ROCOStartErrorHandling

(function ROCOStartErrorHandling() {
	expressApp.use(function(req, res, next){
		res.status(404);

		if (environmentLibrary.ROCOEnvironmentIsProductionForNODE_ENV(process.env.NODE_ENV)) {
			if (req.accepts('html')) {
				return res.render('public-error/404', {
					// url: req.url,
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
					// url: req.url,
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
})();
