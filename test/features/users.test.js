const expect = require('expect');
const request = require('supertest');

require('../helpers')

const app = require('../../app');

const User = require('../../models/user')

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

  it('can be listed, without users and with one added', async () => {
    const resNoUsers = await request(app)
      .get('/users')
      .expect(200);
    expect(resNoUsers.body).toEqual({users: []});

    await User.create({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      birthYear: 2015,
      student: true,
      password: 'password',
    })

    const resWithUsers = await request(app)
      .get('/users')
      .expect(200);

    expect(resWithUsers.body.users.length).toEqual(1);
    const newUser = resWithUsers.body.users[0]
    expect(resWithUsers.jwt).toBe(undefined);
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
});
