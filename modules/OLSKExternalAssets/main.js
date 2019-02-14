const globPackage = require('glob');
const fsPackage = require('fs');
const pathPackage = require('path');
const OLSKDisk = require('OLSKDisk');

//_ OLSKExternalAssetsCopyAssetsFromTo

exports.OLSKExternalAssetsCopyAssetsFromTo = function(param1, param2, param3) {
	if (!Array.isArray(param1)) {
		throw new Error('OLSKErrorInputInvalid');
	}

	if (typeof param2 !== 'string') {
		throw new Error('OLSKErrorInputInvalid');
	}

	if (!OLSKDisk.OLSKDiskInputDataIsRealDirectoryPath(param2)) {
		throw new Error('OLSKErrorInputInvalid');
	}

	if (typeof param3 !== 'string') {
		throw new Error('OLSKErrorInputInvalid');
	}

	OLSKDisk.OLSKDiskHelpDeleteDirectoryRecursive(param3);

	return globPackage.sync(`+(${ param1.join('|') })/**/*.+(js|css|map)`, {
		matchBase: true,
		cwd: param2,
	}).forEach(function(e) {
		OLSKDisk.OLSKDiskHelpCreateDirectoryIfDoesNotExist(pathPackage.dirname(pathPackage.join(param3, e)));
		fsPackage.copyFileSync(pathPackage.join(param2, e), pathPackage.join(param3, e));
	});
};
