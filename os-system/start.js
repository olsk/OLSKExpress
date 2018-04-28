/*!
 * OldSkool
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var expressPackage = require('express');
var pathPackage = require('path');
var fsPackage = require('fs');
var underscorePackage = require('underscore');
var filesystemLibrary = require('./libraries/ROCOFilesystem/main');

var expressApp = expressPackage();

//# OLSKLive

var OLSKLive = {};

(function OLSKStartLive() {
	var jsYAMLPackage = require('js-yaml');

	var kOLSKLiveRootDirectoryAbsolutePath = pathPackage.join(__dirname, '/../');
	var kOLSKLiveSettings = jsYAMLPackage.safeLoad(fsPackage.readFileSync(pathPackage.join(kOLSKLiveRootDirectoryAbsolutePath, filesystemLibrary.ROCOFilesystemAppDirectoryName(), 'settings.yaml'), filesystemLibrary.ROCOFilesystemDefaultTextEncoding())) || {};

	OLSKLive.OLSKLiveRootDirectoryAbsolutePath = function () {
		return kOLSKLiveRootDirectoryAbsolutePath;
	};

	OLSKLive.OLSKLiveAppDirectoryAbsolutePath = function () {
		return pathPackage.join(OLSKLive.OLSKLiveRootDirectoryAbsolutePath(), filesystemLibrary.ROCOFilesystemAppDirectoryName());
	};

	OLSKLive.OLSKLivePublicDirectoryAbsolutePath = function () {
		return pathPackage.join(OLSKLive.OLSKLiveRootDirectoryAbsolutePath(), filesystemLibrary.ROCOFilesystemPublicDirectoryName());
	};

	OLSKLive.OLSKLiveSystemDirectoryAbsolutePath = function () {
		return pathPackage.join(OLSKLive.OLSKLiveRootDirectoryAbsolutePath(), filesystemLibrary.ROCOFilesystemSystemDirectoryName());
	};

	OLSKLive.OLSKLiveSettings = function () {
		return kOLSKLiveSettings;
	};

	expressApp.use(function (req, res, next) {
		req.OLSKLive = OLSKLive;

		if (OLSKLive.OLSKLiveSettings().OLSKDefaultPageTitle) {
			res.locals.OLSKSharedDefaultPageTitle = OLSKLive.OLSKLiveSettings().OLSKDefaultPageTitle;
		}

		if (OLSKLive.OLSKLiveSettings().OLSKDefaultPageDescription) {
			res.locals.OLSKSharedDefaultPageDescription = OLSKLive.OLSKLiveSettings().OLSKDefaultPageDescription;
		}

		next();
	});
})();

//# OLSKStartFilesystem

(function OLSKStartFilesystem() {
	var filesystemLibrary = require('./libraries/ROCOFilesystem/main');

	expressApp.use(function (req, res, next) {
		req.OLSKFilesystemMakeDirIfDoesNotExist = filesystemLibrary.ROCOFilesystemHelpCreateDirectoryIfDoesNotExist;
		req.OLSKFilesystemIsRealFilePath = filesystemLibrary.ROCOFilesystemInputDataIsRealFilePath;
		req.OLSKFilesystemIsRealDirectoryPath = filesystemLibrary.ROCOFilesystemInputDataIsRealDirectoryPath;

		next();
	});
})();

//# OLSKStartCache

(function OLSKStartCache() {
	var cacheLibrary = require('./libraries/ROCOCache/main');

	expressApp.use(function (req, res, next) {
		req.OLSKCacheWriteWithCacheKeyAndCacheObject = function (cacheKey, cacheObject) {
			cacheLibrary.ROCOCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndAppDirectory(cacheObject, cacheKey, OLSKLive.OLSKLiveRootDirectoryAbsolutePath());
		};

		req.OLSKCacheReadForCacheKey = function (cacheKey) {
			cacheLibrary.ROCOCacheReadCacheObjectFileWithCacheKeyAndAppDirectory(cacheKey, OLSKLive.OLSKLiveRootDirectoryAbsolutePath());
		};

		next();
	});
})();

//# OLSKStartCookies

(function OLSKStartCookies() {
	var cookieParserPackage = require('cookie-parser');

	expressApp.use(cookieParserPackage());
})();

//# OLSKStartSessions

(function OLSKStartSessions() {
	var expressSessionPackage = require('express-session');

	expressApp.use(expressSessionPackage({
		secret: OLSKLive.OLSKLiveSettings().OLSKSessionSecret,
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
		OLSKLive.OLSKLiveAppDirectoryAbsolutePath(),
	]);

	// Create string format macro

	expressApp.use(function (req, res, next) {
		res.locals.OLSKFormatted = require('./libraries/ROCOString/main').ROCOStringWithFormat;

		next();
	});
})();

//# OLSKStartControllers

var OLSKStartControllersArray = [];

(function OLSKStartControllers() {
	fsPackage.readdirSync(OLSKLive.OLSKLiveAppDirectoryAbsolutePath()).forEach(function (dirItem, index) {
		var itemPath = pathPackage.join(filesystemLibrary.ROCOFilesystemAppDirectoryName(), dirItem, 'controller.js');
		if (!filesystemLibrary.ROCOFilesystemInputDataIsRealFilePath(pathPackage.join(OLSKLive.OLSKLiveRootDirectoryAbsolutePath(), itemPath))) {
			return;
		};

		OLSKStartControllersArray.push(Object.assign(require('../' + itemPath), {
			OLSKControllerSlug: function () {
				return dirItem;
			},
		}));
	});
})();

//# OLSKStartSharedLocals

(function OLSKStartSharedLocals() {
	OLSKLive.OLSKSharedLocals = {};

	underscorePackage.chain(OLSKStartControllersArray)
		.filter(function (e) {
			return typeof e.OLSKControllerSharedLocals === 'function';
		})
		.map(function (e) {
			return e.OLSKControllerSharedLocals();
		})
		.filter(function (e) {
			return typeof e === 'object';
		})
		.each(function (e) {
			Object.assign(OLSKLive.OLSKSharedLocals, e);
		});

	expressApp.use(function (req, res, next) {
		res.locals = Object.assign(res.locals, OLSKLive.OLSKSharedLocals);

		next();
	});
})();

//# OLSKStartSharedConstants

(function OLSKStartSharedConstants() {
	OLSKLive.OLSKSharedConstants = {};

	underscorePackage.chain(OLSKStartControllersArray)
		.filter(function (e) {
			return typeof e.OLSKControllerSharedConstants === 'function';
		})
		.map(function (e) {
			return e.OLSKControllerSharedConstants();
		})
		.filter(function (e) {
			return typeof e === 'object';
		})
		.each(function (e) {
			Object.assign(OLSKLive.OLSKSharedConstants, e);
		});

	expressApp.use(function (req, res, next) {
		res.locals.kConstants = function (constantString) {
			return OLSKLive.OLSKSharedConstants[constantString];
		};

		next();
	});
})();

//# OLSKStartSharedPrivateConstants

(function OLSKStartSharedPrivateConstants() {
	OLSKLive.OLSKSharedPrivateConstants = OLSKLive.OLSKLiveSettings().OLSKSharedPrivateConstants;

	expressApp.use(function (req, res, next) {
		req.OLSKSharedPrivateConstants = OLSKLive.OLSKSharedPrivateConstants;

		next();
	});
})();

//# OLSKStartPublicDirectory

(function OLSKStartPublicDirectory() {
	expressApp.use(expressPackage.static(OLSKLive.OLSKLivePublicDirectoryAbsolutePath(), {
		extensions:['html'],
	}));
})();

//# OLSKStartInternationalization

var OLSKStartInternationalizationTranslations = {};

(function OLSKStartInternationalization() {
	var internationalLibrary = require('./libraries/OLSKInternational/main');
	var jsYAMLPackage = require('js-yaml');

	// Aggregate unique languages specified in controller routes

	underscorePackage.chain(OLSKStartControllersArray)
		.map(function (e) {
			if (typeof e.OLSKControllerRoutes !== 'function') {
				return null;
			};

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

	expressApp.use(function (req, res, next) {
		req.OLSKSharedCurrentLanguage = Object.keys(OLSKStartInternationalizationTranslations).shift();

		next();
	});

	// Set OLSKSharedRequestLanguage if possible

	expressApp.use(function (req, res, next) {
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

	underscorePackage.chain(fsPackage.readdirSync(OLSKLive.OLSKLiveAppDirectoryAbsolutePath()))
		.map(function (e) {
			return pathPackage.join(filesystemLibrary.ROCOFilesystemAppDirectoryName(), e);
		})
		.filter(function (e) {
			return filesystemLibrary.ROCOFilesystemInputDataIsRealDirectoryPath(pathPackage.join(OLSKLive.OLSKLiveRootDirectoryAbsolutePath(), e))
		})
		.each(function (dirPath) {
			underscorePackage.chain(fsPackage.readdirSync(pathPackage.join(OLSKLive.OLSKLiveRootDirectoryAbsolutePath(), dirPath)))
				.filter(internationalLibrary.OLSKInternationalInputDataIsTranslationFilename)
				.reject(function (e) {
					return Object.keys(OLSKStartInternationalizationTranslations).indexOf(internationalLibrary.OLSKInternationalLanguageIDForTranslationFilename(e)) === -1;
				})
				.each(function (e) {
					OLSKStartInternationalizationTranslations[internationalLibrary.OLSKInternationalLanguageIDForTranslationFilename(e)] = Object.assign(
						OLSKStartInternationalizationTranslations[internationalLibrary.OLSKInternationalLanguageIDForTranslationFilename(e)],
						jsYAMLPackage.safeLoad(fsPackage.readFileSync(pathPackage.join(OLSKLive.OLSKLiveRootDirectoryAbsolutePath(), pathPackage.join(dirPath, e)), filesystemLibrary.ROCOFilesystemDefaultTextEncoding()))
						);
				});
		});

	// Create translation string macro

	expressApp.use(function (req, res, next) {
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

		allRoutes = Object.assign(allRoutes, underscorePackage.mapObject(e.OLSKControllerRoutes(), function(value, key) {
			return Object.assign(value, {
				_OLSKRouteControllerSlug: e.OLSKControllerSlug(),
			});
		}));
	});

	// Create canonical link macros

	expressApp.use(function (req, res, next) {
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

		if (e.OLSKRouteIsHidden) {
			return;
		};

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
				
				return res.redirect(307, pathSegments.join('/'));
			};

			res.locals.OLSKSharedPageLanguagesAvailable = e.OLSKRouteLanguages;
			res.locals.OLSKSharedPageCurrentLanguage = req.OLSKSharedCurrentLanguage;
			res.locals.OLSKSharedPageControllerSlug = e._OLSKRouteControllerSlug;

			return e.OLSKRouteFunction(req, res, next);
		});
	});

	expressApp.use('/', expressRouter);
})();

//# OLSKStartServer

(function OLSKStartServer() {
	var serverObject = expressApp.listen(process.env.PORT || '3000', process.env.HOST);

	serverObject.on('error', function (error) {
		if (error.syscall !== 'listen') {
			throw error;
		};

		var portBind = [
			(typeof error.port === 'string' ? 'Pipe' : 'Port'),
			error.port,
			].join(' ');

		if (error.code === 'EACCES') {
			console.error(portBind + ' requires elevated privileges');
			return process.exit(1);
		};

		if (error.code === 'EADDRINUSE') {
			console.error(portBind + ' is already in use');
			return process.exit(1);
		};

		throw error;
	});
	serverObject.on('listening', function () {
		console.log([
			'Listening on',
			[
				process.env.HOST || serverObject.address().host,
				serverObject.address().port,
			].join(':'),
		].join(' '));
	});
})();

//# OLSKStartErrorHandling

(function OLSKStartErrorHandling() {
	expressApp.use(function (req, res, next) {
		// If the request language available, set current language

		if (req.OLSKSharedRequestLanguage && (Object.keys(OLSKStartInternationalizationTranslations).indexOf(req.OLSKSharedRequestLanguage) !== -1)) {
			req.OLSKSharedCurrentLanguage = req.OLSKSharedRequestLanguage;
		};

		// Set OLSKSharedPageControllerSlug

		res.locals.OLSKSharedPageControllerSlug = OLSKLive.OLSKLiveSettings().OLSKErrorControllerSlug;

		next();
	});
	
	expressApp.use(function (req, res, next) {
		res.status(404);

		if (process.env.NODE_ENV !== 'production') {
			return res.type('txt').send('Not found'); // #localize
		};

		if (req.accepts('html')) {
			return res.render(OLSKLive.OLSKLiveSettings().OLSKErrorControllerSlug + '/404', {
				// url: req.url,
			});
		};

		if (req.accepts('json')) {
			return res.send({
				error: 'Not found', // #localize
			});
		};
	});

	expressApp.use(function (err, req, res, next) {
		res.status(err.status || 500);

		if (process.env.NODE_ENV !== 'production') {
			return res.send('<pre>' + JSON.stringify({error: err}, null, 4) + '</pre><pre>' + err.stack + '</pre>');
		};

		if (req.accepts('html')) {
			return res.render(OLSKLive.OLSKLiveSettings().OLSKErrorControllerSlug + '/500', {
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
})();

//# OLSKStartTasks

(function OLSKStartTasks() {
	var tasksLibrary = require('./libraries/ROCOTasks/main');

	underscorePackage.chain(OLSKStartControllersArray)
		.filter(function (e) {
			return typeof e.OLSKControllerTasks === 'function';
		})
		.map(function (e) {
			return e.OLSKControllerTasks();
		})
		.flatten()
		.filter(tasksLibrary.ROCOTasksInputDataIsTaskObject)
		.each(tasksLibrary.ROCOTasksTimeoutForTaskObject)
})();
