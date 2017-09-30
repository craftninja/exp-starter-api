const expect = require('expect');
const jwt = require('jsonwebtoken');
const request = require('supertest');

require('../helpers');

const app = require('../../app');

const User = require('../../models/user');
const userSerializer = require('../../serializers/user');

describe('Users', () => {
  it('can signup with unique email and receive a JWT', async () => {
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

    expect(res.body.user.passwordDigest).toEqual(undefined);
    expect(res.body.user.createdAt).toEqual(undefined);
    expect(res.body.user.updatedAt).toEqual(undefined);

    const duplicateEmailRes = await request(app)
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

      expect(duplicateEmailRes.body.jwt).toBe(undefined);
      expect(duplicateEmailRes.body.user.id).toBe(undefined);
      expect(duplicateEmailRes.body.user.errors).toEqual(['Email already taken']);
  });

  it('can be listed for a logged in user only', async () => {
    const user = await User.create({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      birthYear: 2015,
      student: true,
      password: 'password',
    });
    serializedUser = await userSerializer(user);
    token = jwt.sign({ user: serializedUser }, process.env.JWT_SECRET);

    const resNotLoggedIn = await request(app)
      .get('/users')
      .expect(404);

    const resLoggedIn = await request(app)
      .get('/users')
      .set('jwt', token)
      .expect(200);

    expect(resLoggedIn.body.users.length).toEqual(1);
    const newUser = resLoggedIn.body.users[0];
    expect(resLoggedIn.jwt).toBe(undefined);
    expect(newUser.id).not.toBe(undefined);
    expect(newUser.firstName).toEqual('Elowyn');
    expect(newUser.lastName).toEqual('Platzer Bartel');
    expect(newUser.email).toEqual('elowyn@example.com');
    expect(newUser.birthYear).toEqual(2015);
    expect(newUser.student).toEqual(true);

    expect(newUser.passwordDigest).toEqual(undefined);
    expect(newUser.createdAt).toEqual(undefined);
    expect(newUser.updatedAt).toEqual(undefined);
  });

  it('can be shown with a valid user id for a logged in user only', async () => {
    const user = await User.create({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      birthYear: 2015,
      student: true,
      password: 'password',
    });
    serializedUser = await userSerializer(user);
    token = jwt.sign({ user: serializedUser }, process.env.JWT_SECRET);

    const resNotLoggedIn = await request(app)
      .get(`/users/${user.id}`)
      .expect(404);

    const resLoggedInWrongId = await request(app)
      .get(`/users/${user.id + 10}`)
      .set('jwt', token)
      .expect(404);

    const resLoggedIn = await request(app)
      .get(`/users/${user.id}`)
      .set('jwt', token)
      .expect(200);

    const showUser = resLoggedIn.body.user;
    expect(resLoggedIn.jwt).toBe(undefined);
    expect(showUser.id).not.toBe(undefined);
    expect(showUser.firstName).toEqual('Elowyn');
    expect(showUser.lastName).toEqual('Platzer Bartel');
    expect(showUser.email).toEqual('elowyn@example.com');
    expect(showUser.birthYear).toEqual(2015);
    expect(showUser.student).toEqual(true);

    expect(showUser.passwordDigest).toEqual(undefined);
    expect(showUser.createdAt).toEqual(undefined);
    expect(showUser.updatedAt).toEqual(undefined);
  });
});
