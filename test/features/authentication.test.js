const expect = require('expect');
const request = require('supertest');

require('../helpers/testSetup');

const app = require('../../app');

const User = require('../../models/user');

describe('Authentication - ', () => {
  it('users that log in receive JWT & their serialized user obj', async () => {
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
    expect(res.body.user.passwordDigest).toEqual(undefined);
    expect(res.body.user.createdAt).toEqual(undefined);
    expect(res.body.user.updatedAt).toEqual(undefined);
  });

  it('users cannot login without valid credentials', async () => {
    const userParams = {
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      birthYear: 2015,
      student: true,
      password: 'password',
    };

    const user = await User.create(userParams);
    const wrongPasswordRes = await request(app)
      .post('/login')
      .send({ email: 'elowyn@example.com', password: 'wrong password' })
      .expect(200);
    expect(wrongPasswordRes.body.jwt).toBe(undefined);
    expect(wrongPasswordRes.body.user).toEqual(undefined);
    expect(wrongPasswordRes.body.errors).toEqual([
      'Email or Password is incorrect',
    ]);

    const noUserRes = await request(app)
      .post('/login')
      .send({ email: 'wrongEmail@example.com', password: 'password' })
      .expect(200);
    expect(noUserRes.body.jwt).toBe(undefined);
    expect(noUserRes.body.user).toEqual(undefined);
    expect(noUserRes.body.errors).toEqual(['Email or Password is incorrect']);
  });
});
