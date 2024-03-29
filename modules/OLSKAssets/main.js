const globPackage = require('glob');
const fsPackage = require('fs');
const pathPackage = require('path');
const OLSKDisk = require('OLSKDisk');

//_ OLSKAssetsCopyAssetsFromTo

exports.OLSKAssetsCopyAssetsFromTo = function(param1, param2, param3) {
	if (!Array.isArray(param1)) {
		throw new Error('OLSKErrorInputNotValid');
	}

	if (typeof param2 !== 'string') {
		throw new Error('OLSKErrorInputNotValid');
	}

	if (!OLSKDisk.OLSKDiskIsRealFolderPath(param2)) {
		throw new Error('OLSKErrorInputNotValid');
	}

	if (typeof param3 !== 'string') {
		throw new Error('OLSKErrorInputNotValid');
	}

	OLSKDisk.OLSKDiskDeleteFolder(param3);

	return globPackage.globSync(`+(${ param1.join('|') })/**/*.+(js|css|map|svelte|y*(a)ml|svg|ejs|wasm)`, {
		matchBase: true,
		cwd: param2,
	}).forEach(function(e) {
		OLSKDisk.OLSKDiskCreateFolder(pathPackage.dirname(pathPackage.join(param3, e)));
		fsPackage.copyFileSync(pathPackage.join(param2, e), pathPackage.join(param3, e));
	});
};
