const assert = require('assert');

const mainModule = require('./main.js');

const pathPackage = require('path');
const OLSKFilesystem = require('OLSKFilesystem');

const kTesting = {
	StubSourcePath: function () {
		return pathPackage.join(__dirname, 'alfa');
	},
	StubDestinationPath: function (inputData) {
		return pathPackage.join(__dirname, 'bravo', '_alfa', inputData || '');
	},
};

describe('OLSKExternalAssetsCopyAssetsFromTo', function () {

	afterEach(function() {
		if (OLSKFilesystem.OLSKFilesystemInputDataIsRealDirectoryPath(kTesting.StubDestinationPath())) {
			OLSKFilesystem.OLSKFilesystemHelpDeleteDirectoryRecursive(kTesting.StubDestinationPath());
		}
	});

  it('throws if param1 not array', function () {
    assert.throws(function () {
    	mainModule.OLSKExternalAssetsCopyAssetsFromTo(null, 'alfa', 'bravo');
    }, /OLSKErrorInputInvalid/);
  });

  it('throws if param2 not string', function () {
    assert.throws(function () {
    	mainModule.OLSKExternalAssetsCopyAssetsFromTo([], null, 'alfa');
    }, /OLSKErrorInputInvalid/);
  });

  it('throws if param3 not string', function () {
    assert.throws(function () {
    	mainModule.OLSKExternalAssetsCopyAssetsFromTo([], 'alfa', null);
    }, /OLSKErrorInputInvalid/);
  });

  it('throws if param3 not real directory', function () {
    assert.throws(function () {
    	mainModule.OLSKExternalAssetsCopyAssetsFromTo([], 'alfa', 'alfa');
    }, /OLSKErrorInputInvalid/);
  });

  it('throws if param3 not real directory', function () {
    assert.throws(function () {
    	mainModule.OLSKExternalAssetsCopyAssetsFromTo([], 'alfa', 'alfa');
    }, /OLSKErrorInputInvalid/);
  });

  it('returns undefined', function () {
  	assert.strictEqual(mainModule.OLSKExternalAssetsCopyAssetsFromTo([], kTesting.StubSourcePath(), kTesting.StubDestinationPath()), undefined);
	});
	
  it('clears directory', function () {
  	mainModule.OLSKExternalAssetsCopyAssetsFromTo([], kTesting.StubSourcePath(), kTesting.StubDestinationPath());
  	assert.strictEqual(OLSKFilesystem.OLSKFilesystemInputDataIsRealFilePath(kTesting.StubDestinationPath('charlie/delta.js')), false);
	});

	context('if not declared', function () {

		beforeEach(function () {
			mainModule.OLSKExternalAssetsCopyAssetsFromTo(['charlie'], kTesting.StubSourcePath(), kTesting.StubDestinationPath());
		});
	
	  it('ignores', function () {
	  	assert.strictEqual(OLSKFilesystem.OLSKFilesystemInputDataIsRealFilePath(kTesting.StubDestinationPath('zulu/xylophone.js')), false);
		});

	});

	context('if declared', function () {

		beforeEach(function () {
			mainModule.OLSKExternalAssetsCopyAssetsFromTo(['charlie'], kTesting.StubSourcePath(), kTesting.StubDestinationPath());
		});
	
	  it('copies .js', function () {
	  	assert.strictEqual(OLSKFilesystem.OLSKFilesystemInputDataIsRealFilePath(kTesting.StubDestinationPath('charlie/delta.js')), true);
		});
	
	  it('copies .css', function () {
	  	assert.strictEqual(OLSKFilesystem.OLSKFilesystemInputDataIsRealFilePath(kTesting.StubDestinationPath('charlie/echo.css')), true);
		});
	
	  it('copies .map', function () {
	  	assert.strictEqual(OLSKFilesystem.OLSKFilesystemInputDataIsRealFilePath(kTesting.StubDestinationPath('charlie/foxtrot.map')), true);
		});
	
	  it('ignores', function () {
	  	assert.strictEqual(OLSKFilesystem.OLSKFilesystemInputDataIsRealFilePath(kTesting.StubDestinationPath('charlie/golf.md')), false);
		});

	});

});
