const expect = require('expect');
const request = require('supertest');

const app = require('../../app');

describe('Undefined routes', () => {
  it('return 404 not found', async () => {
    const res = await request(app)
      .get('/undefinedRoute')
      .expect(404);

    const errorResponse = {
      "error": {"status": 404},
      "message": "Not Found"
    }
    expect(res.body).toEqual(errorResponse);
  });
});
