const OLSKFilesystem = require('OLSKFilesystem');

//_ OLSKExternalAssetsCopyAssetsFromTo

exports.OLSKExternalAssetsCopyAssetsFromTo = function(param1, param2, param3) {
	if (!Array.isArray(param1)) {
		throw new Error('OLSKErrorInputInvalid');
	}

	if (typeof param2 !== 'string') {
		throw new Error('OLSKErrorInputInvalid');
	}

	if (!OLSKFilesystem.OLSKFilesystemInputDataIsRealDirectoryPath(param2)) {
		throw new Error('OLSKErrorInputInvalid');
	}

	if (typeof param3 !== 'string') {
		throw new Error('OLSKErrorInputInvalid');
	}

	if (!OLSKFilesystem.OLSKFilesystemInputDataIsRealDirectoryPath(param3)) {
		throw new Error('OLSKErrorInputInvalid');
	}
};