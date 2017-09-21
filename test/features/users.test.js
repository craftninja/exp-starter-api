const expect = require('expect');
const request = require('supertest');

const app = require('../../app');

describe('Users', () => {
  it('index route with no users returns an empty list of users', async () => {
    const res = await request(app)
      .get('/users')
      .expect(200);

    expect(res.body).toEqual({users: []});
  });
});
