#!/usr/bin/env node

require('./main.js')(process.cwd(), {
	OLSKOptionCustomAppDirectory: process.argv.length === 2 ? undefined : process.argv.slice(-1).pop(),
});
