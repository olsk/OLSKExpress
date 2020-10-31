module.exports = function (rootDirectory, optionsObject = {}) {
	const expressPackage = require('express');
	const expressApp = expressPackage();

	console.info([
		Date.now(),
		rootDirectory,
	].join(' '));

	//# OLSKStartHelmet

	(function OLSKStartHelmet() {
		var helmetPackage = require('helmet');

		expressApp.disable('x-powered-by');

		expressApp.use(helmetPackage());
	})();

	//# OLSKStartPreferHTTPS

	(function OLSKStartPreferHTTPS() {
		if (!process.env.OLSK_SECURITY_HTTPS_ALWAYS) {
			return
		}

		return expressApp.use(require('express-sslify').HTTPS({ trustProtoHeader: true }));

		expressApp.use(function(req, res, next) {
			if (req.secure) {
				return next();
			}

			return res.redirect(307, 'https://' + req.get('host') + req.originalUrl);
		});
	})();

	//# OLSKStartLive

	var OLSKLive = {};

	(function OLSKStartLive() {
		if (!require('OLSKDisk').OLSKDiskIsRealFolderPath(rootDirectory)) {
			throw new Error('OLSKErrorNonexistantRootDirectory');
		}

		OLSKLive.OLSKLiveRootDirectoryAbsolutePath = function() {
			return rootDirectory;
		};

		OLSKLive.OLSKLiveAppDirectoryAbsolutePath = function() {
			return require('path').join(OLSKLive.OLSKLiveRootDirectoryAbsolutePath(), optionsObject.OLSKOptionCustomAppDirectory || require('OLSKDisk').OLSKDiskAppFolderName());
		};

		OLSKLive.OLSKLivePublicDirectoryAbsolutePath = function() {
			return require('path').join(OLSKLive.OLSKLiveRootDirectoryAbsolutePath(), require('OLSKDisk').OLSKDiskPublicFolderName());
		};

		OLSKLive.OLSKLivePathJoin = require('path').join;

		expressApp.use(function(req, res, next) {
			req.OLSKLive = OLSKLive;

			return next();
		});
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
		expressApp.engine('html', require('ejs').renderFile);
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
			if (e.match(require('OLSKDisk').OLSKDiskStandardIgnorePattern())) {
				return;
			}

			OLSKStartControllersArray.push(Object.assign(require(pathPackage.join(OLSKLive.OLSKLiveAppDirectoryAbsolutePath(), e)), {
				OLSKControllerSlug: function() {
					return pathPackage.dirname(e);
				},
				OLSKControllerFullPath: function() {
					return pathPackage.dirname(pathPackage.join(OLSKLive.OLSKLiveAppDirectoryAbsolutePath(), e));
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
			if (!Object.keys(OLSKConnectionObjects).includes(inputData)) {
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

		var OLSKDisk = require('OLSKDisk');

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

		// Set OLSKSharedCurrentLanguage to fallback locale

		expressApp.use(function(req, res, next) {
			req.OLSKSharedCurrentLanguage = Object.keys(OLSKStartInternationalizationTranslations).shift();

			return next();
		});

		// Set OLSKSharedRequestLanguage if possible

		expressApp.use(function(req, res, next) {
			var pathSegments = req.url.split('/');
			var firstElement = pathSegments.splice(1, 1).pop();

			if (!Object.keys(OLSKStartInternationalizationTranslations).includes(firstElement)) {
				return next();
				return;
			}

			req.OLSKSharedRequestLanguage = firstElement;
			req.url = pathSegments.length <= 1 ? '/' : pathSegments.join('/');

			return next();
		});

		// Load translation strings into OLSKStartInternationalizationTranslations

		Object.assign(OLSKStartInternationalizationTranslations, require('OLSKInternational').OLSKInternationalDictionary(OLSKLive.OLSKLiveAppDirectoryAbsolutePath()));

		// Create translation string macro

		expressApp.use(function(req, res, next) {
			const callback = require('OLSKInternational').OLSKInternationalLocalizedStringCallback(OLSKStartInternationalizationTranslations, ['en']);

			res.locals.OLSKLocalized = function(translationConstant) {
				return callback(translationConstant, [req.OLSKSharedCurrentLanguage]);
			};

			res.locals.OLSKLocalizedStringKeys = function() {
				return Object.keys(OLSKStartInternationalizationTranslations[req.OLSKSharedCurrentLanguage]);
			};

			return next();
		});
	})();

	//# OLSKStartRoutes

	(function OLSKStartRoutes() {
		var expressRouter = require('express').Router();
		const underscorePackage = require('underscore');

		var routingLibrary = require('OLSKRouting');

		var allRoutes = {};

		// Aggregate all routes specified in controllers

		OLSKStartControllersArray.forEach(function(e) {
			if (typeof e.OLSKControllerRoutes !== 'function') {
				return;
			}

			allRoutes = Object.assign(allRoutes, underscorePackage.mapObject(((function(inputData) {
				if (!Array.isArray(inputData)) {
					return inputData;
				};

				return inputData.reduce(function (coll, item) {
					coll[item.OLSKRouteSignature] = item;

					return coll;
				}, {})
			})(e.OLSKControllerRoutes())), function(value) {
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
				return routingLibrary.OLSKRoutingCanonicalPathWithRoutePathAndOptionalParams(allRoutes[routeConstant].OLSKRoutePath, Object.assign(Object.assign({}, req.params), optionalParams || {}));
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
				
				// If the request language not available, pass

				if (req.OLSKSharedRequestLanguage && !e.OLSKRouteLanguages.includes(req.OLSKSharedRequestLanguage)) {
					res.locals.OLSKSharedPageLanguagesAvailable = e.OLSKRouteLanguages;
					res.locals.OLSKSharedPageCurrentLanguage = req.OLSKSharedCurrentLanguage;

					return next();
				}

				// If the request language available, set current language

				if (req.OLSKSharedRequestLanguage && e.OLSKRouteLanguages.includes(req.OLSKSharedRequestLanguage)) {
					req.OLSKSharedCurrentLanguage = req.OLSKSharedRequestLanguage;
				}

				// If no request language and preferred language available and not current, redirect

				var preferredLanguage = req.acceptsLanguages(e.OLSKRouteLanguages);
				if (!req.OLSKSharedRequestLanguage && preferredLanguage && e.OLSKRouteLanguages && e.OLSKRouteLanguages.includes(preferredLanguage) && (preferredLanguage !== req.OLSKSharedCurrentLanguage)) {
					var pathSegments = req.url.split('/');
					pathSegments.splice(1, 0, preferredLanguage);

					if (pathSegments.slice(-1).pop() === '') {
						pathSegments.pop();
					}

					if (!e._OLSKRouteSkipLanguageRedirect) {
						return res.redirect(307, pathSegments.join('/'));
					}
					
					req.OLSKSharedCurrentLanguage = preferredLanguage;
				}

				res.locals.OLSKSharedPageLanguagesAvailable = e.OLSKRouteLanguages;
				res.locals.OLSKSharedPageCurrentLanguage = req.OLSKSharedCurrentLanguage;

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

			return expressRouter[e.OLSKRouteMethod](e.OLSKRoutePath, e.OLSKRouteFunction);
		});

		expressApp.use('/', expressRouter);
	})();

	//# OLSKStartStaticFiles

	(function OLSKStartStaticFiles() {
		const pathPackage = require('path');
		const OLSKDisk = require('OLSKDisk');

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
			if (!OLSKDisk.OLSKDiskIsRealFilePath(pathPackage.join(OLSKLive.OLSKLiveAppDirectoryAbsolutePath(), req.url))) {
				return next();
			}

			if (pathPackage.basename(req.url).match(/^ui-/)) {
				return next();
			}

			if (pathPackage.dirname(req.url).match(/ui-/)) {
				return next();
			}

			if (OLSKStartStaticAssetsArray.includes(req.url.slice(1))) {
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

		if (!process.env.OLSK_HTTPS_FILE_PATH_TEMPLATE) {
			return;
		}

		require('https').createServer({
		  key: require('fs').readFileSync(`${ process.env.OLSK_HTTPS_FILE_PATH_TEMPLATE }.key`),
		  cert: require('fs').readFileSync(`${ process.env.OLSK_HTTPS_FILE_PATH_TEMPLATE }.crt`)
		}, expressApp).listen(443).on('listening', function (a, b, c) {
			console.info([
				'Listening on port',
				this.address().port,
			].join(' '));
		});
	})();

	//# OLSKStartLivereload

	(function OLSKStartLivereload() {
		if (process.env.OLSK_TESTING_BEHAVIOUR === 'true') {
			return;
		}

		if (process.env.NODE_ENV !== 'development') {
			return;
		}

		const livereloadDirectories = OLSKStartControllersArray.filter(function (e) {
			if (typeof e.OLSKControllerUseLivereload !== 'function') {
				return false;
			};

			return e.OLSKControllerUseLivereload();
		}).map(function (e) {
			return e.OLSKControllerFullPath()
		})

		if (!livereloadDirectories.length) {
			return;
		}

		require('livereload').createServer({
			extraExts: [
				'md',
				'ejs',
			],
		}).watch(livereloadDirectories);
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
			if (req.OLSKSharedRequestLanguage && Object.keys(OLSKStartInternationalizationTranslations).includes(req.OLSKSharedRequestLanguage)) {
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
