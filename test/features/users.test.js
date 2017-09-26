const expect = require('expect');
const request = require('supertest');

require('../helpers')

const app = require('../../app');

describe('Users', () => {
  it('can signup and receive a JWT', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        firstName: 'Elowyn',
        lastName: 'Platzer Bartel',
        email: 'elowyn@example.com',
        birthYear: 2015,
        student: true,
        password: 'password',
      })
      .expect(200);

    expect(res.body.jwt).not.toBe(undefined);
    expect(res.body.user.id).not.toBe(undefined);
    expect(res.body.user.firstName).toEqual('Elowyn');
    expect(res.body.user.lastName).toEqual('Platzer Bartel');
    expect(res.body.user.email).toEqual('elowyn@example.com');
    expect(res.body.user.birthYear).toEqual(2015);
    expect(res.body.user.student).toEqual(true);
    expect(res.body.passwordDigest).toEqual(undefined);
    expect(res.body.createdAt).toEqual(undefined);
    expect(res.body.updatedAt).toEqual(undefined);
  });

  it('index route with no users returns an empty list of users', async () => {
    const res = await request(app)
      .get('/users')
      .expect(200);

    expect(res.body).toEqual({users: []});
  });
});
