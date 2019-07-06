const assert = require('assert');

const mainModule = require('./main.js');

const pathPackage = require('path');
const OLSKDisk = require('OLSKDisk');

const kTesting = {
	StubSourcePath: function () {
		return pathPackage.join(__dirname, 'alfa');
	},
	StubDestinationPath: function (inputData) {
		return pathPackage.join(__dirname, 'bravo', '_alfa', inputData || '');
	},
};

describe('OLSKAssetsCopyAssetsFromTo', function () {

	afterEach(function() {
		if (OLSKDisk.OLSKDiskIsRealFolderPath(kTesting.StubDestinationPath())) {
			OLSKDisk.OLSKDiskDeleteFolder(kTesting.StubDestinationPath());
		}
	});

  it('throws if param1 not array', function () {
    assert.throws(function () {
    	mainModule.OLSKAssetsCopyAssetsFromTo(null, 'alfa', 'bravo');
    }, /OLSKErrorInputInvalid/);
  });

  it('throws if param2 not string', function () {
    assert.throws(function () {
    	mainModule.OLSKAssetsCopyAssetsFromTo([], null, 'alfa');
    }, /OLSKErrorInputInvalid/);
  });

  it('throws if param3 not string', function () {
    assert.throws(function () {
    	mainModule.OLSKAssetsCopyAssetsFromTo([], 'alfa', null);
    }, /OLSKErrorInputInvalid/);
  });

  it('throws if param3 not real folder', function () {
    assert.throws(function () {
    	mainModule.OLSKAssetsCopyAssetsFromTo([], 'alfa', 'alfa');
    }, /OLSKErrorInputInvalid/);
  });

  it('throws if param3 not real folder', function () {
    assert.throws(function () {
    	mainModule.OLSKAssetsCopyAssetsFromTo([], 'alfa', 'alfa');
    }, /OLSKErrorInputInvalid/);
  });

  it('returns undefined', function () {
  	assert.strictEqual(mainModule.OLSKAssetsCopyAssetsFromTo([], kTesting.StubSourcePath(), kTesting.StubDestinationPath()), undefined);
	});
	
  it('clears folder', function () {
  	mainModule.OLSKAssetsCopyAssetsFromTo([], kTesting.StubSourcePath(), kTesting.StubDestinationPath());
  	assert.strictEqual(OLSKDisk.OLSKDiskIsRealFilePath(kTesting.StubDestinationPath('charlie/delta.js')), false);
	});

	context('if not declared', function () {

		beforeEach(function () {
			mainModule.OLSKAssetsCopyAssetsFromTo(['charlie'], kTesting.StubSourcePath(), kTesting.StubDestinationPath());
		});
	
	  it('ignores', function () {
	  	assert.strictEqual(OLSKDisk.OLSKDiskIsRealFilePath(kTesting.StubDestinationPath('zulu/xylophone.js')), false);
		});

	});

	context('if declared', function () {

		beforeEach(function () {
			mainModule.OLSKAssetsCopyAssetsFromTo(['charlie'], kTesting.StubSourcePath(), kTesting.StubDestinationPath());
		});
	
	  it('copies .js', function () {
	  	assert.strictEqual(OLSKDisk.OLSKDiskIsRealFilePath(kTesting.StubDestinationPath('charlie/delta.js')), true);
		});
	
	  it('copies .css', function () {
	  	assert.strictEqual(OLSKDisk.OLSKDiskIsRealFilePath(kTesting.StubDestinationPath('charlie/echo.css')), true);
		});
	
	  it('copies .map', function () {
	  	assert.strictEqual(OLSKDisk.OLSKDiskIsRealFilePath(kTesting.StubDestinationPath('charlie/foxtrot.map')), true);
		});
	
	  it('ignores', function () {
	  	assert.strictEqual(OLSKDisk.OLSKDiskIsRealFilePath(kTesting.StubDestinationPath('charlie/golf.md')), false);
		});

	});

});