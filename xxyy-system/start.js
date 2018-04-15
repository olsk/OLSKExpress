/*!
 * xxyy-sample
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var expressPackage = require('express');
var pathPackage = require('path');
var fsPackage = require('fs');
var filesystemLibrary = require('./libraries/ROCOFilesystem/main');
var environmentLibrary = require('./libraries/ROCOEnvironment/main');

var expressApp = expressPackage();

//# OLSKStartCookies

(function OLSKStartCookies() {
	var cookieParserPackage = require('cookie-parser');

	expressApp.use(cookieParserPackage());
})();

//# OLSKStartSessions

(function OLSKStartSessions() {
	var expressSessionPackage = require('express-session');

	expressApp.use(expressSessionPackage({
		secret: 'clarinet-gulf-clencher',
		resave: false,
		saveUninitialized: true
	}));
})();

//# OLSKStartBodyParsing

(function OLSKStartBodyParsing() {
	var bodyParserPackage = require('body-parser');

	expressApp.use(bodyParserPackage.json());
	expressApp.use(bodyParserPackage.urlencoded({
		extended: true
	}));
})();

//# OLSKStartTemplatingEngine

(function OLSKStartTemplatingEngine() {
	expressApp.set('view engine', 'ejs');
	expressApp.set('views', [
		pathPackage.join(pathPackage.join(filesystemLibrary.ROCOFilesystemRootDirectoryAbsolutePath(), filesystemLibrary.ROCOFilesystemAppDirectoryName())),
	]);

	// Create string format macro

	expressApp.use(function(req, res, next) {
		res.locals.OLSKFormatted = require('./libraries/ROCOString/main').ROCOStringWithFormat;

		next();
	});
})();

//# OLSKStartControllers

var OLSKStartControllersArray = [];

(function OLSKStartControllers() {
	fsPackage.readdirSync(pathPackage.join(filesystemLibrary.ROCOFilesystemRootDirectoryAbsolutePath(), filesystemLibrary.ROCOFilesystemAppDirectoryName())).forEach(function(dirItem, index) {
		var itemPath = pathPackage.join(filesystemLibrary.ROCOFilesystemAppDirectoryName(), dirItem, 'controller.js');
		if (!filesystemLibrary.ROCOFilesystemInputDataIsRealFilePath(pathPackage.join(filesystemLibrary.ROCOFilesystemRootDirectoryAbsolutePath(), itemPath))) {
			return;
		}

		OLSKStartControllersArray.push(require('../' + itemPath));
	});
})();

//# OLSKStartPublicDirectory

(function OLSKStartPublicDirectory() {
	expressApp.use(expressPackage.static(pathPackage.join(filesystemLibrary.ROCOFilesystemRootDirectoryAbsolutePath(), filesystemLibrary.ROCOFilesystemPublicDirectoryName()), {
		extensions:['html'],
	}));
})();

//# OLSKStartInternationalization

var OLSKStartInternationalizationTranslations = {};

(function OLSKStartInternationalization() {
	var internationalLibrary = require('./libraries/OLSKInternational/main');
	var underscorePackage = require('underscore');
	var jsYAMLPackage = require('js-yaml');

	// Aggregate unique languages specified in controller routes

	underscorePackage.chain(OLSKStartControllersArray)
		.map(function (e) {
			return underscorePackage.pluck(Object.values(e.OLSKControllerRoutes()), 'OLSKRouteLanguages');
		})
		.flatten()
		.uniq()
		.reject(function (e) {
			return !e;
		})
		.each(function (e) {
			OLSKStartInternationalizationTranslations[e] = {};
		});

	// Skip internationalization code if there are no languages

	if (!Object.keys(OLSKStartInternationalizationTranslations).length) {
		return;
	};

	// Set OLSKSharedCurrentLanguage to default value

	expressApp.use(function(req, res, next) {
		req.OLSKSharedCurrentLanguage = Object.keys(OLSKStartInternationalizationTranslations).shift();

		next();
	});

	// Set OLSKSharedRequestLanguage if possible

	expressApp.use(function(req, res, next) {
		var pathSegments = req.url.split('/');
		var firstElement = pathSegments.splice(1, 1).pop();
		
		if (Object.keys(OLSKStartInternationalizationTranslations).indexOf(firstElement) === -1) {
			next();
			return;
		};

		req.OLSKSharedRequestLanguage = firstElement;
		req.url = pathSegments.length <= 1 ? '/' : pathSegments.join('/');

		next();
	});

	// Load translation strings into OLSKStartInternationalizationTranslations

	underscorePackage.chain(fsPackage.readdirSync(pathPackage.join(filesystemLibrary.ROCOFilesystemRootDirectoryAbsolutePath(), filesystemLibrary.ROCOFilesystemAppDirectoryName())))
		.map(function(e) {
			return pathPackage.join(filesystemLibrary.ROCOFilesystemAppDirectoryName(), e);
		})
		.filter(function(e) {
			return filesystemLibrary.ROCOFilesystemInputDataIsRealDirectoryPath(pathPackage.join(filesystemLibrary.ROCOFilesystemRootDirectoryAbsolutePath(), e))
		})
		.each(function(dirPath) {
			underscorePackage.chain(fsPackage.readdirSync(pathPackage.join(filesystemLibrary.ROCOFilesystemRootDirectoryAbsolutePath(), dirPath)))
				.filter(internationalLibrary.OLSKInternationalInputDataIsTranslationFilename)
				.reject(function(e) {
					return Object.keys(OLSKStartInternationalizationTranslations).indexOf(internationalLibrary.OLSKInternationalLanguageIDForTranslationFilename(e)) === -1;
				})
				.each(function(e) {
					OLSKStartInternationalizationTranslations[internationalLibrary.OLSKInternationalLanguageIDForTranslationFilename(e)] = Object.assign(
						OLSKStartInternationalizationTranslations[internationalLibrary.OLSKInternationalLanguageIDForTranslationFilename(e)],
						jsYAMLPackage.safeLoad(fsPackage.readFileSync(pathPackage.join(filesystemLibrary.ROCOFilesystemRootDirectoryAbsolutePath(), pathPackage.join(dirPath, e)), filesystemLibrary.ROCOFilesystemDefaultTextEncoding()))
						);
				});
		});

	// Create translation string macro

	expressApp.use(function(req, res, next) {
		res.locals.OLSKTranslate = function (translationConstant) {
			return internationalLibrary.OLSKInternationalLocalizedStringWithTranslationKeyAndTranslationDictionary(translationConstant, OLSKStartInternationalizationTranslations[req.OLSKSharedCurrentLanguage]);
		};

		next();
	});
})();

//# OLSKStartRouting

(function OLSKStartRouting() {
	var routingLibrary = require('./libraries/OLSKRouting/main');
	var expressRouter = require('express').Router();

	var allRoutes = {};

	// Aggregate all routes specified in controllers

	OLSKStartControllersArray.forEach(function (e) {
		if (typeof e.OLSKControllerRoutes !== 'function') {
			return;
		};

		allRoutes = Object.assign(allRoutes, e.OLSKControllerRoutes());
	});

	// Create canonical link macros

	expressApp.use(function(req, res, next) {
		res.locals.OLSKCanonicalFor = function (routeConstant, optionalParams) {
			return routingLibrary.OLSKRoutingCanonicalPathWithRouteObjectAndOptionalParams(allRoutes[routeConstant], optionalParams);
		};

		if (req.OLSKSharedCurrentLanguage) {
			res.locals.OLSKCanonicalLocalizedFor = function (routeConstant, optionalParams) {
				return res.locals.OLSKCanonicalFor(routeConstant, Object.assign({
					OLSKRoutingLanguage: req.OLSKSharedCurrentLanguage,
				}, optionalParams));
			};
		};

		next();
	});

	// Create routing middleware

	Object.keys(allRoutes).forEach(function (key) {
		var e = allRoutes[key];

		return expressRouter[e.OLSKRouteMethod](e.OLSKRoutePath, e.OLSKRouteRedirect ? function (req, res) {
			return res.redirect(e.OLSKRouteRedirect);
		} : function (req, res, next) {
			res.locals.OLSKSharedActiveRouteConstant = key;

			// If the request language not available, pass

			if (req.OLSKSharedRequestLanguage && (e.OLSKRouteLanguages.indexOf(req.OLSKSharedRequestLanguage) === -1)) {
				return next();
			};

			// If the request language available, set current language

			if (req.OLSKSharedRequestLanguage && (e.OLSKRouteLanguages.indexOf(req.OLSKSharedRequestLanguage) !== -1)) {
				req.OLSKSharedCurrentLanguage = req.OLSKSharedRequestLanguage;
			};

			// If no request language and preferred language available and not current, redirect

			var preferredLanguage = req.acceptsLanguages(e.OLSKRouteLanguages);
			if (!req.OLSKSharedRequestLanguage && preferredLanguage && e.OLSKRouteLanguages && (e.OLSKRouteLanguages.indexOf(preferredLanguage) !== -1) && (preferredLanguage !== req.OLSKSharedCurrentLanguage)) {
				var pathSegments = req.url.split('/');
				pathSegments.splice(1, 0, preferredLanguage);

				if (pathSegments.slice(-1).pop() === '') {
					pathSegments.pop();
				};
				
				return res.redirect(pathSegments.join('/'));
			};

			res.locals.OLSKSharedPageLanguagesAvailable = e.OLSKRouteLanguages;
			res.locals.OLSKSharedPageCurrentLanguage = req.OLSKSharedCurrentLanguage

			return e.OLSKRouteFunction(req, res, next);
		});
	});

	expressApp.use('/', expressRouter);
})();

//# OLSKStartServer

(function OLSKStartServer() {
	var serverLibrary = require('./libraries/ROCOServer/main');
	var httpPackage = require('http');
	var serverModule = require('./modules/server');
	var debugObject = require('debug')('xxyy-sample-app:server');

	var portValue = serverLibrary.ROCOServerNormalizePort(process.env.PORT || '3000');
	var serverObject = httpPackage.createServer(expressApp);
	expressApp.set('port', portValue);
	serverObject.listen(portValue);
	serverObject.on('error', serverModule.ROCOServerErrorCallback());
	serverObject.on('listening', serverModule.ROCOServerListeningCallback(serverObject, debugObject));
})();

//# OLSKStartErrorHandling

(function OLSKStartErrorHandling() {
	expressApp.use(function(req, res, next) {
		res.status(404);

		if (!environmentLibrary.ROCOEnvironmentIsProductionForNODE_ENV(process.env.NODE_ENV)) {
			return res.type('txt').send('Not found'); // #localize
		};

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
	});

	expressApp.use(function(err, req, res, next) {
		res.status(err.status || 500);

		if (!environmentLibrary.ROCOEnvironmentIsProductionForNODE_ENV(process.env.NODE_ENV)) {
			return res.send('<pre>' + JSON.stringify({error: err}, null, 4) + '</pre><pre>' + err.stack + '</pre>');
		};

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
	});

	if (!environmentLibrary.ROCOEnvironmentIsProductionForNODE_ENV(process.env.NODE_ENV)) {
		var loggingPackage = require('morgan');
		expressApp.use(loggingPackage('dev'));
	};
})();
