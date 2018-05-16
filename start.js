/*!
 * OldSkool
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

module.exports = function(rootDirectory) {

	var expressPackage = require('express');

	var expressApp = expressPackage();

	//# OLSKStartLive

	var OLSKLive = {};

	(function OLSKStartLive() {
		var fsPackage = require('fs');
		var pathPackage = require('path');
		var jsYAMLPackage = require('js-yaml');

		var filesystemLibrary = require('OLSKFilesystem');

		if (!filesystemLibrary.OLSKFilesystemInputDataIsRealDirectoryPath(rootDirectory)) {
			throw new Error('OLSKErrorNonexistantRootDirectory');
		}

		var kOLSKLiveSettings = jsYAMLPackage.safeLoad(fsPackage.readFileSync(pathPackage.join(rootDirectory, filesystemLibrary.OLSKFilesystemAppDirectoryName(), 'settings.yaml'), filesystemLibrary.OLSKFilesystemDefaultTextEncoding())) || {};

		OLSKLive.OLSKLiveRootDirectoryAbsolutePath = function() {
			return rootDirectory;
		};

		OLSKLive.OLSKLiveAppDirectoryAbsolutePath = function() {
			return pathPackage.join(OLSKLive.OLSKLiveRootDirectoryAbsolutePath(), filesystemLibrary.OLSKFilesystemAppDirectoryName());
		};

		OLSKLive.OLSKLivePublicDirectoryAbsolutePath = function() {
			return pathPackage.join(OLSKLive.OLSKLiveRootDirectoryAbsolutePath(), filesystemLibrary.OLSKFilesystemPublicDirectoryName());
		};

		OLSKLive.OLSKLiveSystemDirectoryAbsolutePath = function() {
			return pathPackage.join(OLSKLive.OLSKLiveRootDirectoryAbsolutePath(), filesystemLibrary.OLSKFilesystemSystemDirectoryName());
		};

		OLSKLive.OLSKLiveSettings = function() {
			return kOLSKLiveSettings;
		};

		expressApp.use(function(req, res, next) {
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
		var filesystemLibrary = require('OLSKFilesystem');

		expressApp.use(function(req, res, next) {
			req.OLSKFilesystemMakeDirIfDoesNotExist = filesystemLibrary.OLSKFilesystemHelpCreateDirectoryIfDoesNotExist;
			req.OLSKFilesystemIsRealFilePath = filesystemLibrary.OLSKFilesystemInputDataIsRealFilePath;
			req.OLSKFilesystemIsRealDirectoryPath = filesystemLibrary.OLSKFilesystemInputDataIsRealDirectoryPath;

			next();
		});
	})();

	//# OLSKStartCache

	(function OLSKStartCache() {
		var cacheLibrary = require('OLSKCache');

		expressApp.use(function(req, res, next) {
			req.OLSKCacheWriteWithCacheKeyAndCacheObject = function(cacheKey, cacheObject) {
				cacheLibrary.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(cacheObject, cacheKey, OLSKLive.OLSKLiveRootDirectoryAbsolutePath());
			};

			req.OLSKCacheReadForCacheKey = function(cacheKey) {
				return cacheLibrary.OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory(cacheKey, OLSKLive.OLSKLiveRootDirectoryAbsolutePath());
			};

			next();
		});
	})();

	//# OLSKStartCookies

	(function OLSKStartCookies() {
		if (!OLSKLive.OLSKLiveSettings().OLSKCookieSessionKeys) {
			return console.info('- Skipping OLSKStartCookies (OLSKCookieSessionKeys not found)');
		}
		var cookieSessionPackage = require('cookie-session');

		expressApp.set('trust proxy', OLSKLive.OLSKLiveSettings().OLSKCookieSessionTrustProxy);
		expressApp.use(cookieSessionPackage({
			name: OLSKLive.OLSKLiveSettings().OLSKCookieSessionName,
			keys: OLSKLive.OLSKLiveSettings().OLSKCookieSessionKeys,
			cookie: {
				secure: true,
				httpOnly: true,
				domain: OLSKLive.OLSKLiveSettings().OLSKCookieSessionDomain,
			},
		}));
	})();

	//# OLSKStartSessions

	(function OLSKStartSessions() {
		if (!OLSKLive.OLSKLiveSettings().OLSKSessionSecret) {
			return console.info('- Skipping OLSKStartSessions (OLSKSessionSecret not found)');
		}

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
		var stringLibrary = require('OLSKString');

		expressApp.set('view engine', 'ejs');
		expressApp.set('views', [
			OLSKLive.OLSKLiveAppDirectoryAbsolutePath(),
		]);

		// Create string format macro

		expressApp.use(function(req, res, next) {
			res.locals.OLSKFormatted = stringLibrary.OLSKStringWithFormat;

			next();
		});
	})();

	//# OLSKStartControllers

	var OLSKStartControllersArray = [];

	(function OLSKStartControllers() {
		var fsPackage = require('fs');
		var pathPackage = require('path');

		var filesystemLibrary = require('OLSKFilesystem');

		fsPackage.readdirSync(OLSKLive.OLSKLiveAppDirectoryAbsolutePath()).forEach(function(dirItem) {
			var itemPath = pathPackage.join(filesystemLibrary.OLSKFilesystemAppDirectoryName(), dirItem, 'controller.js');

			if (!filesystemLibrary.OLSKFilesystemInputDataIsRealFilePath(pathPackage.join(OLSKLive.OLSKLiveRootDirectoryAbsolutePath(), itemPath))) {
				return;
			}

			OLSKStartControllersArray.push(Object.assign(require(pathPackage.join(OLSKLive.OLSKLiveRootDirectoryAbsolutePath(), itemPath)), {
				OLSKControllerSlug: function() {
					return dirItem;
				},
			}));
		});
	})();

	//# OLSKStartSharedLocals

	(function OLSKStartSharedLocals() {
		OLSKLive.OLSKSharedLocals = {};

		OLSKStartControllersArray
			.filter(function(e) {
				return typeof e.OLSKControllerSharedLocals === 'function';
			})
			.map(function(e) {
				return e.OLSKControllerSharedLocals();
			})
			.filter(function(e) {
				return typeof e === 'object';
			})
			.forEach(function(e) {
				Object.assign(OLSKLive.OLSKSharedLocals, e);
			});

		expressApp.use(function(req, res, next) {
			res.locals = Object.assign(res.locals, OLSKLive.OLSKSharedLocals);

			next();
		});
	})();

	//# OLSKStartSharedConstants

	(function OLSKStartSharedConstants() {
		OLSKLive.OLSKSharedConstants = {};

		OLSKStartControllersArray
			.filter(function(e) {
				return typeof e.OLSKControllerSharedConstants === 'function';
			})
			.map(function(e) {
				return e.OLSKControllerSharedConstants();
			})
			.filter(function(e) {
				return typeof e === 'object';
			})
			.forEach(function(e) {
				Object.assign(OLSKLive.OLSKSharedConstants, e);
			});

		expressApp.use(function(req, res, next) {
			res.locals.kConstants = function(constantString) {
				return OLSKLive.OLSKSharedConstants[constantString];
			};

			next();
		});
	})();

	//# OLSKStartSharedPrivateConstants

	(function OLSKStartSharedPrivateConstants() {
		OLSKLive.OLSKSharedPrivateConstants = OLSKLive.OLSKLiveSettings().OLSKSharedPrivateConstants;

		expressApp.use(function(req, res, next) {
			req.OLSKSharedPrivateConstants = OLSKLive.OLSKSharedPrivateConstants;

			next();
		});
	})();

	//# OLSKStartSharedMiddlewares

	(function OLSKStartSharedMiddlewares() {
		OLSKLive.OLSKSharedMiddlewares = {};

		OLSKStartControllersArray
			.filter(function(e) {
				return typeof e.OLSKControllerSharedMiddlewares === 'function';
			})
			.map(function(e) {
				return e.OLSKControllerSharedMiddlewares();
			})
			.filter(function(e) {
				return typeof e === 'object';
			})
			.forEach(function(e) {
				Object.assign(OLSKLive.OLSKSharedMiddlewares, e);
			});
	})();

	//# OLSKStartPublicDirectory

	(function OLSKStartPublicDirectory() {
		expressApp.use(expressPackage.static(OLSKLive.OLSKLivePublicDirectoryAbsolutePath(), {
			extensions: ['html'],
		}));
	})();

	//# OLSKStartInternationalization

	var OLSKStartInternationalizationTranslations = {};

	(function OLSKStartInternationalization() {
		var underscorePackage = require('underscore');
		var pathPackage = require('path');
		var fsPackage = require('fs');
		var jsYAMLPackage = require('js-yaml');

		var filesystemLibrary = require('OLSKFilesystem');
		var internationalLibrary = require('OLSKInternational');

		// Aggregate unique languages specified in controller routes

		underscorePackage.chain(OLSKStartControllersArray)
			.map(function(e) {
				if (typeof e.OLSKControllerRoutes !== 'function') {
					return null;
				}

				return underscorePackage.pluck(Object.values(e.OLSKControllerRoutes()), 'OLSKRouteLanguages');
			})
			.flatten()
			.uniq()
			.reject(function(e) {
				return !e;
			})
			.each(function(e) {
				OLSKStartInternationalizationTranslations[e] = {};
			});

		// Skip internationalization code if there are no languages

		if (!Object.keys(OLSKStartInternationalizationTranslations).length) {
			return;
		}

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
			}

			req.OLSKSharedRequestLanguage = firstElement;
			req.url = pathSegments.length <= 1 ? '/' : pathSegments.join('/');

			next();
		});

		// Load translation strings into OLSKStartInternationalizationTranslations

		underscorePackage.chain(fsPackage.readdirSync(OLSKLive.OLSKLiveAppDirectoryAbsolutePath()))
			.map(function(e) {
				return pathPackage.join(filesystemLibrary.OLSKFilesystemAppDirectoryName(), e);
			})
			.filter(function(e) {
				return filesystemLibrary.OLSKFilesystemInputDataIsRealDirectoryPath(pathPackage.join(OLSKLive.OLSKLiveRootDirectoryAbsolutePath(), e));
			})
			.each(function(dirPath) {
				underscorePackage.chain(fsPackage.readdirSync(pathPackage.join(OLSKLive.OLSKLiveRootDirectoryAbsolutePath(), dirPath)))
					.filter(internationalLibrary.OLSKInternationalInputDataIsTranslationFilename)
					.reject(function(e) {
						return Object.keys(OLSKStartInternationalizationTranslations).indexOf(internationalLibrary.OLSKInternationalLanguageIDForTranslationFilename(e)) === -1;
					})
					.each(function(e) {
						OLSKStartInternationalizationTranslations[internationalLibrary.OLSKInternationalLanguageIDForTranslationFilename(e)] = Object.assign(
							OLSKStartInternationalizationTranslations[internationalLibrary.OLSKInternationalLanguageIDForTranslationFilename(e)],
							jsYAMLPackage.safeLoad(fsPackage.readFileSync(pathPackage.join(OLSKLive.OLSKLiveRootDirectoryAbsolutePath(), pathPackage.join(dirPath, e)), filesystemLibrary.OLSKFilesystemDefaultTextEncoding()))
						);
					});
			});

		// Create translation string macro

		expressApp.use(function(req, res, next) {
			res.locals.OLSKLocalized = function(translationConstant) {
				return internationalLibrary.OLSKInternationalLocalizedStringWithTranslationKeyAndTranslationDictionary(translationConstant, OLSKStartInternationalizationTranslations[req.OLSKSharedCurrentLanguage]);
			};

			next();
		});
	})();

	//# OLSKStartRouting

	(function OLSKStartRouting() {
		var expressRouter = require('express').Router();
		var underscorePackage = require('underscore');

		var routingLibrary = require('OLSKRouting');

		var allRoutes = {};

		// Aggregate all routes specified in controllers

		OLSKStartControllersArray.forEach(function(e) {
			if (typeof e.OLSKControllerRoutes !== 'function') {
				return;
			}

			allRoutes = Object.assign(allRoutes, underscorePackage.mapObject(e.OLSKControllerRoutes(), function(value) {
				return Object.assign(value, {
					_OLSKRouteControllerSlug: e.OLSKControllerSlug(),
				});
			}));
		});

		// Create canonical link macros

		expressApp.use(function(req, res, next) {
			res.locals.OLSKCanonicalFor = function(routeConstant, optionalParams) {
				return routingLibrary.OLSKRoutingCanonicalPathWithRouteObjectAndOptionalParams(allRoutes[routeConstant], optionalParams);
			};

			if (req.OLSKSharedCurrentLanguage) {
				res.locals.OLSKCanonicalLocalizedFor = function(routeConstant, optionalParams) {
					return res.locals.OLSKCanonicalFor(routeConstant, Object.assign({
						OLSKRoutingLanguage: req.OLSKSharedCurrentLanguage,
					}, optionalParams));
				};
			}

			next();
		});

		// Create routing middleware

		Object.keys(allRoutes).forEach(function(key) {
			var e = allRoutes[key];

			if (e.OLSKRouteIsHidden) {
				return;
			}

			return expressRouter[e.OLSKRouteMethod](e.OLSKRoutePath, e.OLSKRouteRedirect ? function(req, res) {
				return res.redirect(e.OLSKRouteRedirect);
			} : function(req, res, next) {
				res.locals.OLSKSharedActiveRouteConstant = key;

				var routeNext = function(inputData) {
					if (inputData instanceof Error) {
						return next(inputData);
					}

					// If the request language not available, pass

					if (req.OLSKSharedRequestLanguage && (e.OLSKRouteLanguages.indexOf(req.OLSKSharedRequestLanguage) === -1)) {
						res.locals.OLSKSharedPageLanguagesAvailable = e.OLSKRouteLanguages;
						res.locals.OLSKSharedPageCurrentLanguage = req.OLSKSharedCurrentLanguage;

						return next();
					}

					// If the request language available, set current language

					if (req.OLSKSharedRequestLanguage && (e.OLSKRouteLanguages.indexOf(req.OLSKSharedRequestLanguage) !== -1)) {
						req.OLSKSharedCurrentLanguage = req.OLSKSharedRequestLanguage;
					}

					// If no request language and preferred language available and not current, redirect

					var preferredLanguage = req.acceptsLanguages(e.OLSKRouteLanguages);
					if (!req.OLSKSharedRequestLanguage && preferredLanguage && e.OLSKRouteLanguages && (e.OLSKRouteLanguages.indexOf(preferredLanguage) !== -1) && (preferredLanguage !== req.OLSKSharedCurrentLanguage)) {
						var pathSegments = req.url.split('/');
						pathSegments.splice(1, 0, preferredLanguage);

						if (pathSegments.slice(-1).pop() === '') {
							pathSegments.pop();
						}

						return res.redirect(307, pathSegments.join('/'));
					}

					res.locals.OLSKSharedPageLanguagesAvailable = e.OLSKRouteLanguages;
					res.locals.OLSKSharedPageCurrentLanguage = req.OLSKSharedCurrentLanguage;
					res.locals.OLSKSharedPageControllerSlug = e._OLSKRouteControllerSlug;

					return e.OLSKRouteFunction(req, res, next);
				};

				if (e.OLSKRouteMiddlewares && e.OLSKRouteMiddlewares.length) {
					var callbackArray = [];

					e.OLSKRouteMiddlewares.map(function(e) {
						return OLSKLive.OLSKSharedMiddlewares[e];
					}).filter(function(e) {
						return !!e;
					}).reverse().forEach(function(e, i) {
						return callbackArray.push(function() {
							return e(req, res, i === 0 ? routeNext : callbackArray.slice(-1).pop());
						});
					});

					return callbackArray.slice(-1).pop()();
				}

				return routeNext();

			});
		});

		expressApp.use('/', expressRouter);
	})();

	//# OLSKStartServer

	(function OLSKStartServer() {
		var serverObject = expressApp.listen(process.env.PORT || '3000', process.env.HOST);

		serverObject.on('error', function(error) {
			if (error.syscall !== 'listen') {
				throw error;
			}

			var portBind = [
				(typeof error.port === 'string' ? 'Pipe' : 'Port'),
				error.port,
			].join(' ');

			if (error.code === 'EACCES') {
				console.error(portBind + ' requires elevated privileges');
				return process.exit(1);
			}

			if (error.code === 'EADDRINUSE') {
				console.error(portBind + ' is already in use');
				return process.exit(1);
			}

			throw error;
		});
		serverObject.on('listening', function() {
			console.info([
				'Listening on', [
					process.env.HOST || serverObject.address().host,
					serverObject.address().port,
				].join(':'),
			].join(' '));
		});
	})();

	//# OLSKStartErrorHandling

	(function OLSKStartErrorHandling() {
		expressApp.use(function(req, res, next) {
			// Set OLSKSharedPageControllerSlug

			res.locals.OLSKSharedPageControllerSlug = OLSKLive.OLSKLiveSettings().OLSKErrorControllerSlug;

			// If the request language available, set current language

			if (req.OLSKSharedRequestLanguage && (Object.keys(OLSKStartInternationalizationTranslations).indexOf(req.OLSKSharedRequestLanguage) !== -1)) {
				req.OLSKSharedCurrentLanguage = req.OLSKSharedRequestLanguage;
			}

			// If other languages available for route, show switcher

			if (req.OLSKSharedRequestLanguage && res.locals.OLSKSharedActiveRouteConstant) {
				return res.render(res.locals.OLSKSharedPageControllerSlug + '/lang', {});
			}

			next();
		});

		expressApp.use(function(req, res, next) {
			res.status(404);

			if (process.env.NODE_ENV === 'production') {
				return res.render(res.locals.OLSKSharedPageControllerSlug + '/404', {
					// url: req.url,
				});
			}

			return res.send({
				error: 'Not found', // #localize
			});
		});

		expressApp.use(function(err, req, res, next) {
			res.status(err.status || 500);

			if (process.env.NODE_ENV === 'production') {
				return res.render(res.locals.OLSKSharedPageControllerSlug + '/500', {
					// url: req.url,
				});
			}

			return res.send('<pre>' + JSON.stringify({
				error: err
			}, null, 4) + '</pre><pre>' + err.stack + '</pre>');
		});
	})();

	//# OLSKStartTasks

	(function OLSKStartTasks() {
		var underscorePackage = require('underscore');

		var tasksLibrary = require('OLSKTasks');

		underscorePackage.chain(OLSKStartControllersArray)
			.filter(function(e) {
				return typeof e.OLSKControllerTasks === 'function';
			})
			.map(function(e) {
				return e.OLSKControllerTasks();
			})
			.flatten()
			.filter(tasksLibrary.OLSKTasksInputDataIsTaskObject)
			.each(tasksLibrary.OLSKTasksTimeoutForTaskObject);
	})();

};
