module.exports = function (rootDirectory, optionsObject = {}) {
	const expressPackage = require('express');
	const expressApp = expressPackage();

	//# OLSKStartSecurity

	(function OLSKStartSecurity() {
		var helmetPackage = require('helmet');

		expressApp.disable('x-powered-by');

		expressApp.use(helmetPackage());

		if (process.env.OLSK_SECURITY_HTTPS_ALWAYS) {
			expressApp.use(function(req, res, next) {
				if (req.secure) {
					return next();
				}

				return res.redirect(307, 'https://' + req.get('host') + req.originalUrl);
			});
		}
	})();

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

		var kOLSKLiveSettings = {};

		if (filesystemLibrary.OLSKFilesystemInputDataIsRealFilePath(pathPackage.join(rootDirectory, filesystemLibrary.OLSKFilesystemAppDirectoryName(), 'os-settings.yaml'))) {
			kOLSKLiveSettings = jsYAMLPackage.safeLoad(fsPackage.readFileSync(pathPackage.join(rootDirectory, filesystemLibrary.OLSKFilesystemAppDirectoryName(), 'os-settings.yaml'), filesystemLibrary.OLSKFilesystemDefaultTextEncoding())) || {}
		}

		OLSKLive.OLSKLiveRootDirectoryAbsolutePath = function() {
			return rootDirectory;
		};

		OLSKLive.OLSKLiveAppDirectoryAbsolutePath = function() {
			return pathPackage.join(OLSKLive.OLSKLiveRootDirectoryAbsolutePath(), filesystemLibrary.OLSKFilesystemAppDirectoryName());
		};

		OLSKLive.OLSKLivePublicDirectoryAbsolutePath = function() {
			return pathPackage.join(OLSKLive.OLSKLiveRootDirectoryAbsolutePath(), filesystemLibrary.OLSKFilesystemPublicDirectoryName());
		};

		OLSKLive.OLSKLivePathJoin = pathPackage.join;

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

			return next();
		});
	})();

	//# OLSKStartFilesystem

	(function OLSKStartFilesystem() {
		var filesystemLibrary = require('OLSKFilesystem');

		expressApp.use(function(req, res, next) {
			req.OLSKFilesystemMakeDirIfDoesNotExist = filesystemLibrary.OLSKFilesystemHelpCreateDirectoryIfDoesNotExist;
			req.OLSKFilesystemIsRealFilePath = filesystemLibrary.OLSKFilesystemInputDataIsRealFilePath;
			req.OLSKFilesystemIsRealDirectoryPath = filesystemLibrary.OLSKFilesystemInputDataIsRealDirectoryPath;
			req.OLSKFilesystemSafeBasenameFor = filesystemLibrary.OLSKFilesystemSafeBasenameFor;

			return next();
		});
	})();

	//# OLSKStartCache

	(function OLSKStartCache() {
		var cacheLibrary = require('OLSKCache');

		let cacheFunctions = {
			OLSKCacheWriteWithCacheKeyAndCacheObject: function(cacheKey, cacheObject) {
				cacheLibrary.OLSKCacheWriteCacheObjectFileWithCacheObjectCacheKeyAndRootDirectory(cacheObject, cacheKey, OLSKLive.OLSKLiveRootDirectoryAbsolutePath());
			},

			OLSKCacheReadForCacheKey: function(cacheKey) {
				return cacheLibrary.OLSKCacheReadCacheObjectFileWithCacheKeyAndRootDirectory(cacheKey, OLSKLive.OLSKLiveRootDirectoryAbsolutePath());
			},
		};

		Object.assign(OLSKLive, cacheFunctions);

		expressApp.use(function(req, res, next) {
			Object.assign(req, cacheFunctions);

			return next();
		});
	})();

	//# OLSKStartCookies

	(function OLSKStartCookies() {
		if (optionsObject.OLSKOptionSkipCookies) {
			return;
		}

		if (!OLSKLive.OLSKLiveSettings().OLSKCookieSessionKeys) {
			return console.info('- Skipping OLSKStartCookies (OLSKCookieSessionKeys not found in os-app/os-settings.yaml)');
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
		if (optionsObject.OLSKOptionSkipSessions) {
			return;
		}

		if (!OLSKLive.OLSKLiveSettings().OLSKSessionSecret) {
			return console.info('- Skipping OLSKStartSessions (OLSKSessionSecret not found in os-app/os-settings.yaml)');
		}

		var expressSessionPackage = require('express-session');

		expressApp.use(expressSessionPackage({
			secret: OLSKLive.OLSKLiveSettings().OLSKSessionSecret,
			resave: false,
			saveUninitialized: true,
		}));
	})();

	//# OLSKStartBodyParsing

	(function OLSKStartBodyParsing() {
		var bodyParserPackage = require('body-parser');

		expressApp.use(bodyParserPackage.json());
		expressApp.use(bodyParserPackage.urlencoded({
			extended: true,
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

			return next();
		});
	})();

	//# OLSKStartControllers

	var OLSKStartControllersArray = [];

	(function OLSKStartControllers() {
		var globPackage = require('glob');
		var pathPackage = require('path');

		globPackage.sync('controller.js', {
			matchBase: true,
			cwd: OLSKLive.OLSKLiveAppDirectoryAbsolutePath(),
		}).forEach(function(e) {
			OLSKStartControllersArray.push(Object.assign(require(pathPackage.join(OLSKLive.OLSKLiveAppDirectoryAbsolutePath(), e)), {
				OLSKControllerSlug: function() {
					return pathPackage.dirname(e);
				},
			}));
		});
	})();

	//# OLSKStartSharedConnections

	var OLSKStartSharedConnectionsCleanupFunctionsArray = [];

	(function OLSKStartSharedConnections() {
		var OLSKSharedConnections = {};

		OLSKStartControllersArray
			.filter(function(e) {
				return typeof e.OLSKControllerSharedConnections === 'function';
			})
			.map(function(e) {
				return e.OLSKControllerSharedConnections();
			})
			.filter(function(e) {
				return typeof e === 'object';
			})
			.forEach(function(e) {
				Object.assign(OLSKSharedConnections, e);
			});

		var OLSKConnectionObjects = {};

		Object.keys(OLSKSharedConnections).forEach(function(e) {
			if (typeof OLSKSharedConnections[e] !== 'object') {
				throw new Error('OLSKErrorConnectionMissingObject', e);
			}

			if (typeof OLSKSharedConnections[e].OLSKConnectionCleanup !== 'function') {
				throw new Error('OLSKErrorConnectionMissingCleanup', e);
			}

			if (typeof OLSKSharedConnections[e].OLSKConnectionInitializer !== 'function') {
				throw new Error('OLSKErrorConnectionMissingInitializer', e);
			}

			OLSKConnectionObjects[e] = {
				OLSKConnectionName: e,
				OLSKConnectionAttempted: false,
				OLSKConnectionError: undefined,
				OLSKConnectionClient: undefined,
			};

			OLSKSharedConnections[e].OLSKConnectionInitializer(function(error, client) {
				OLSKConnectionObjects[e].OLSKConnectionAttempted = true;

				if (error) {
					OLSKConnectionObjects[e].OLSKConnectionError = error;
					return;
				}

				OLSKConnectionObjects[e].OLSKConnectionClient = client;

				OLSKStartSharedConnectionsCleanupFunctionsArray.push(function() {
					OLSKSharedConnections[e].OLSKConnectionCleanup(client);
				});
			});
		});

		function OLSKSharedConnectionFor(inputData) {
			if (Object.keys(OLSKConnectionObjects).indexOf(inputData) === -1) {
				throw new Error('OLSKErrorConnectionDoesNotExist');
			}

			return OLSKConnectionObjects[inputData];
		}

		expressApp.use(function(req, res, next) {
			req.OLSKSharedConnectionFor = OLSKSharedConnectionFor;

			return next();
		});

		OLSKLive.OLSKSharedConnectionFor = OLSKSharedConnectionFor;
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

			return next();
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

			return next();
		});
	})();

	//# OLSKStartSharedPrivateConstants

	(function OLSKStartSharedPrivateConstants() {
		OLSKLive.OLSKSharedPrivateConstants = OLSKLive.OLSKLiveSettings().OLSKSharedPrivateConstants;

		expressApp.use(function(req, res, next) {
			req.OLSKSharedPrivateConstants = OLSKLive.OLSKSharedPrivateConstants;

			return next();
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

	//# OLSKStartInternationalization

	var OLSKStartInternationalizationTranslations = {};

	(function OLSKStartInternationalization() {
		const underscorePackage = require('underscore');
		var globPackage = require('glob');
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

			return next();
		});

		// Set OLSKSharedRequestLanguage if possible

		expressApp.use(function(req, res, next) {
			var pathSegments = req.url.split('/');
			var firstElement = pathSegments.splice(1, 1).pop();

			if (Object.keys(OLSKStartInternationalizationTranslations).indexOf(firstElement) === -1) {
				return next();
				return;
			}

			req.OLSKSharedRequestLanguage = firstElement;
			req.url = pathSegments.length <= 1 ? '/' : pathSegments.join('/');

			return next();
		});

		// Load translation strings into OLSKStartInternationalizationTranslations

		globPackage.sync('*i18n*.yaml', {
			matchBase: true,
			cwd: OLSKLive.OLSKLiveAppDirectoryAbsolutePath(),
		})
		.filter(function(e) {
			return internationalLibrary.OLSKInternationalInputDataIsTranslationFileBasename(pathPackage.basename(e));
		})
		.filter(function(e) {
			return Object.keys(OLSKStartInternationalizationTranslations).indexOf(internationalLibrary.OLSKInternationalLanguageIDForTranslationFileBasename(pathPackage.basename(e))) !== -1;
		})
		.forEach(function(e) {
			OLSKStartInternationalizationTranslations[internationalLibrary.OLSKInternationalLanguageIDForTranslationFileBasename(pathPackage.basename(e))] = Object.assign(
				OLSKStartInternationalizationTranslations[internationalLibrary.OLSKInternationalLanguageIDForTranslationFileBasename(pathPackage.basename(e))],
				jsYAMLPackage.safeLoad(fsPackage.readFileSync(pathPackage.join(OLSKLive.OLSKLiveAppDirectoryAbsolutePath(), e), filesystemLibrary.OLSKFilesystemDefaultTextEncoding()))
			);
		});

		// Create translation string macro

		expressApp.use(function(req, res, next) {
			res.locals.OLSKLocalized = function(translationConstant) {
				return internationalLibrary.OLSKInternationalLocalizedStringWithTranslationKeyAndTranslationDictionary(translationConstant, OLSKStartInternationalizationTranslations[req.OLSKSharedCurrentLanguage]);
			};

			return next();
		});
	})();

	//# OLSKStartRouting

	(function OLSKStartRouting() {
		var expressRouter = require('express').Router();
		const underscorePackage = require('underscore');

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
			res.locals.OLSKRouteObjectFor = function(routeConstant) {
				return allRoutes[routeConstant];
			};

			res.locals.OLSKCanonicalFor = function(routeConstant, optionalParams) {
				return routingLibrary.OLSKRoutingCanonicalPathWithRoutePathAndOptionalParams(allRoutes[routeConstant].OLSKRoutePath, optionalParams);
			};

			res.locals.OLSKCanonicalSubstitutionFunctionFor = function(routeConstant) {
				return routingLibrary.OLSKRoutingSubstitutionFunctionForRoutePath(allRoutes[routeConstant].OLSKRoutePath);
			};

			if (req.OLSKSharedCurrentLanguage) {
				res.locals.OLSKCanonicalLocalizedFor = function(routeConstant, optionalParams) {
					return res.locals.OLSKCanonicalFor(routeConstant, Object.assign({
						OLSKRoutingLanguage: req.OLSKSharedCurrentLanguage,
					}, optionalParams));
				};
			}

			return next();
		});

		// Create routing middlewares

		Object.keys(allRoutes).forEach(function(key) {
			var e = allRoutes[key];

			if (e.OLSKRouteIsHidden) {
				return;
			}

			if (e.OLSKRouteRedirect) {
				return expressRouter[e.OLSKRouteMethod](e.OLSKRoutePath, function(req, res) {
					return res.redirect(e.OLSKRouteRedirect);
				});
			}

			expressRouter[e.OLSKRouteMethod](e.OLSKRoutePath, function(req, res, next) {
				res.locals.OLSKSharedActiveRouteConstant = key;
				res.locals.OLSKSharedPageControllerSlug = e._OLSKRouteControllerSlug;

				return next();
			});

			if (e.OLSKRouteMiddlewares && e.OLSKRouteMiddlewares.length) {
				e.OLSKRouteMiddlewares.map(function(e) {
					return OLSKLive.OLSKSharedMiddlewares[e];
				}).filter(function(e) {
					return !!e;
				}).forEach(function(middlewares) {
					return underscorePackage.flatten([middlewares]).forEach(function(middleware) {
						return expressRouter[e.OLSKRouteMethod](e.OLSKRoutePath, middleware);
					});
				});
			}

			return expressRouter[e.OLSKRouteMethod](e.OLSKRoutePath, function(req, res, next) {

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

				return e.OLSKRouteFunction(req, res, next);
			});
		});

		expressApp.use('/', expressRouter);
	})();

	//# OLSKStartStaticFiles

	(function OLSKStartStaticFiles() {
		const pathPackage = require('path');
		const OLSKFilesystem = require('OLSKFilesystem');

		let OLSKStartStaticAssetsArray = OLSKStartControllersArray
			.filter(function(e) {
				return typeof e.OLSKControllerStaticAssetFiles === 'function';
			})
			.map(function(e) {
				return e.OLSKControllerStaticAssetFiles().map(function (path) {
					return pathPackage.join(e.OLSKControllerSlug(), path);
				});
			})
			.reduce(function(coll, e) {
				return coll.concat(e);
			}, []);

		let OLSKStartStaticAssetsFoldersArray = OLSKStartControllersArray
			.filter(function(e) {
				return typeof e.OLSKControllerSharedStaticAssetFolders === 'function';
			})
			.map(function(e) {
				return e.OLSKControllerSharedStaticAssetFolders();
			})
			.reduce(function(coll, e) {
				return coll.concat(e);
			}, []);

		expressApp.use(function(req, res, next) {
			if (!OLSKFilesystem.OLSKFilesystemInputDataIsRealFilePath(pathPackage.join(OLSKLive.OLSKLiveAppDirectoryAbsolutePath(), req.url))) {
				return next();
			}

			if (pathPackage.basename(req.url).match(/^ui-/)) {
				return next();
			}

			if (pathPackage.dirname(req.url).match(/ui-/)) {
				return next();
			}

			if (OLSKStartStaticAssetsArray.indexOf(req.url.slice(1)) !== -1) {
				return next();
			}

			if (OLSKStartStaticAssetsFoldersArray.filter(function (e) {
				return req.url.match(e);
			}).length) {
				return next();
			}

			return next(new Error('OLSKRoutingErrorNotFound'));
		});

		expressApp.use(expressPackage.static(pathPackage.join(OLSKLive.OLSKLiveAppDirectoryAbsolutePath()), {
			redirect: false,
		}));
	})();

	//# OLSKStartPublicDirectory

	(function OLSKStartPublicDirectory() {
		expressApp.use(expressPackage.static(OLSKLive.OLSKLivePublicDirectoryAbsolutePath(), {
			redirect: false,
		}));
	})();

	//# OLSKStartServer

	(function OLSKStartServer() {
		if (optionsObject.OLSKOptionSkipServer) {
			return;
		}

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
		expressApp.use(function(err, req, res, next) {
			if (err.message === 'OLSKRoutingErrorNotFound') {
				return next();
			}

			return next(err);
		});

		expressApp.use(function(req, res, next) {
			res.status(404);

			return next(new Error('OLSKRoutingErrorNotFound'));
		});

		// If the request language available, set current language
		expressApp.use(function(err, req, res, next) {
			if (req.OLSKSharedRequestLanguage && (Object.keys(OLSKStartInternationalizationTranslations).indexOf(req.OLSKSharedRequestLanguage) !== -1)) {
				req.OLSKSharedCurrentLanguage = req.OLSKSharedRequestLanguage;
			}

			return next(err);
		});

		// Call shared error handlers
		OLSKStartControllersArray
			.filter(function(e) {
				return typeof e.OLSKControllerSharedErrorHandlers === 'function';
			})
			.map(function(e) {
				return e.OLSKControllerSharedErrorHandlers();
			})
			.filter(function(e) {
				return Array.isArray(e);
			})
			.reduce(function(array, e) {
				return array.concat(e)
			}, [])
			.forEach(function(e) {
				expressApp.use(e);
			});

		// Call 404 handler
		expressApp.use(function(err, req, res, next) {
			if (res.statusCode !== 404) {
				return next(err);
			}

			return res.send(err.message);
		});

		// Call final handler
		expressApp.use(function(err, req, res, next) {
			if (res.statusCode === 200) {
				res.status(500);
			}

			return res.send('<!DOCTYPE html><html><head><title>error</title></head><body><pre>' + err.stack.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</pre></body></html>');
		});
	})();

	//# OLSKStartTasks

	(function OLSKStartTasks() {
		const underscorePackage = require('underscore');

		const OLSKTasks = require('OLSKTasks');

		underscorePackage.chain(OLSKStartControllersArray)
			.filter(function(e) {
				return typeof e.OLSKControllerTasks === 'function';
			})
			.map(function(e) {
				return e.OLSKControllerTasks();
			})
			.flatten()
			.filter(OLSKTasks.OLSKTasksInputDataIsTaskObject)
			.each(function(e) {
				console.info('OLSKStartTasks', e.OLSKTaskName);
				
				OLSKTasks.OLSKTasksTimeoutForTaskObject(e, {
					OLSKLive: OLSKLive,
				});
			});
	})();

	//# OLSKStartCleanup

	(function OLSKStartCleanup() {
		if (optionsObject.OLSKOptionSkipCleanup) {
			return;
		}

		var callback = function () {
			OLSKStartSharedConnectionsCleanupFunctionsArray.forEach(function(e) {
				e();
			});
			process.exit(0);
		};

		process.on('SIGINT', callback);
		process.on('SIGTERM', callback);
	})();

	return expressApp;

};
