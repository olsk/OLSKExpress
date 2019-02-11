const supertestPackage = require('supertest');
const mainModule = require('./start.js');

const kTesting = {
  StubApp: function() {
    return mainModule(__dirname, {
      OLSKOptionSkipCookies: true,
      OLSKOptionSkipSessions: true,
      OLSKOptionSkipServer: true,
      OLSKOptionSkipCleanup: true,
    });
  },
};

describe.skip('public', function () {

  it('returns 404 if not found', function () {
    return supertestPackage(kTesting.StubApp())
      .get('/bravo.txt')
      .expect(404);
  });

  it('returns 200', function () {
    return supertestPackage(kTesting.StubApp())
      .get('/alfa.txt')
      .expect('Content-Type', /text/)
      .expect(200, 'bravo');
  });

});

describe('app', function () {

  it('returns 500 if undeclared', function () {
    return supertestPackage(kTesting.StubApp())
      .get('/echo.js')
      .expect(404);
  });

  it('returns 200 if declared', function () {
    return supertestPackage(kTesting.StubApp())
      .get('/alfa-bravo/charlie.txt')
      .expect('Content-Type', /text/)
      .expect(200, 'delta');
  });

  it('returns 200 if prefixed with ui-', function () {
    return supertestPackage(kTesting.StubApp())
      .get('/ui-golf.js')
      .expect('Content-Type', /javascript/)
      .expect(200, 'hotel');
  });

  it('returns 200 if inside ui-* folder', function () {
    return supertestPackage(kTesting.StubApp())
      .get('/ui-text/indigo.txt')
      .expect('Content-Type', /text/)
      .expect(200, 'juliet');
  });

  it('returns 200 if inside declared folder', function () {
    return supertestPackage(kTesting.StubApp())
      .get('/_shared/external/kilo.json')
      .expect('Content-Type', /json/)
      .expect(200, '{"llama":1}');
  });

});