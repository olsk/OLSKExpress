const supertestPackage = require('supertest');

const mod = require('./main.js');

describe('OLSKStartStaticFiles', function () {

  const item = mod.OLSKExpressStart(__dirname, {
    OLSKOptionSkipServer: true,
    OLSKOptionSkipCleanup: true,
  });

  it('returns 404 if undeclared', function () {
    return supertestPackage(item)
      .get('/alfa-bravo/echo.js')
      .expect(404);
  });

  it('returns 404 if undeclared (controller.js)', function () {
    return supertestPackage(item)
      .get('/alfa-bravo/controller.js')
      .expect(404);
  });

  it('returns 200 if declared', function () {
    return supertestPackage(item)
      .get('/alfa-bravo/charlie.txt')
      .expect('Content-Type', /text/)
      .expect(200, 'delta');
  });

  it('returns 200 if prefixed with ui-', function () {
    return supertestPackage(item)
      .get('/alfa-bravo/ui-golf.js')
      .expect('Content-Type', /javascript/)
      .expect(200, 'hotel');
  });

  it('returns 200 if inside ui-* folder', function () {
    return supertestPackage(item)
      .get('/alfa-bravo/ui-india/juliet.txt')
      .expect('Content-Type', /text/)
      .expect(200, 'kilo');
  });

  it('returns 200 if inside declared folder', function () {
    return supertestPackage(item)
      .get('/lima/mike.json')
      .expect('Content-Type', /json/)
      .expect(200, '{"november":1}');
  });

});