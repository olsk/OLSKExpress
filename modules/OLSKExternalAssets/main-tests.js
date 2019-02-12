const assert = require('assert');

const mainModule = require('./main.js');

describe('OLSKExternalAssetsCopyAssetsFromTo', function () {

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

  it('throws if param2 not real directory', function () {
    assert.throws(function () {
    	mainModule.OLSKExternalAssetsCopyAssetsFromTo([], 'alfa', 'alfa');
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


});
