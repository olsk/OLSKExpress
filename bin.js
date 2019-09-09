#!/usr/bin/env node

require('./main.js')(process.cwd(), {
	OLSKOptionControllersViaRootDirectory: process.argv.pop() === __filename,
});
