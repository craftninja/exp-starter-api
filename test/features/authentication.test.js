const expect = require('expect');
const request = require('supertest');

require('../helpers');

const app = require('../../app');

const User = require('../../models/user');

describe('Authentication - ', () => {
  it('users can log in and receive a JWT', async () => {
    const userParams = {
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      birthYear: 2015,
      student: true,
      password: 'password',
    };

    const user = await User.create(userParams);
    const res = await request(app)
      .post('/login')
      .send({ email: 'elowyn@example.com', password: 'password' })
      .expect(200);
    expect(res.body.jwt).not.toBe(undefined);
    expect(res.body.user).toEqual({
      id: user.id,
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      birthYear: 2015,
      student: true,
    });
    expect(res.body.passwordDigest).toEqual(undefined);
    expect(res.body.createdAt).toEqual(undefined);
    expect(res.body.updatedAt).toEqual(undefined);
  });
});
