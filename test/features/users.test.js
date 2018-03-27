const expect = require('expect');
const jwt = require('jsonwebtoken');
const request = require('supertest');

require('../helpers/testSetup');

const app = require('../../app');

const { createUser } = require('../helpers/objectCreationMethods');

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
    const user = await createUser();
    const token = jwt.sign({ currentUserId: user.id }, process.env.JWT_SECRET);

    const resNotLoggedIn = await request(app)
      .get('/users')
      .expect(404);

    expect(resNotLoggedIn.body).toEqual({ message: 'Not Found', error: { status: 404 } });

    const resLoggedIn = await request(app)
      .get('/users')
      .set('jwt', token)
      .expect(200);

    expect(resLoggedIn.body.users.length).toEqual(1);
    const newUser = resLoggedIn.body.users[0];
    expect(resLoggedIn.jwt).toBe(undefined);
    expect(newUser.id).not.toBe(undefined);
    expect(newUser).toEqual({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      birthYear: user.birthYear,
      student: user.student,
    });
    expect(newUser.student).toEqual(true);

    expect(newUser.passwordDigest).toEqual(undefined);
    expect(newUser.createdAt).toEqual(undefined);
    expect(newUser.updatedAt).toEqual(undefined);
  });

  it('can be shown with a valid user id for a logged in user only', async () => {
    const user = await createUser();
    const token = jwt.sign({ currentUserId: user.id }, process.env.JWT_SECRET);

    const resNotLoggedIn = await request(app)
      .get(`/users/${user.id}`)
      .expect(404);

    expect(resNotLoggedIn.body).toEqual({ message: 'Not Found', error: { status: 404 } });

    const resLoggedInWrongId = await request(app)
      .get(`/users/${user.id + 10}`)
      .set('jwt', token)
      .expect(404);

    expect(resLoggedInWrongId.body).toEqual({ message: 'Not Found', error: { status: 404 } });

    const resLoggedIn = await request(app)
      .get(`/users/${user.id}`)
      .set('jwt', token)
      .expect(200);

    const showUser = resLoggedIn.body.user;
    expect(resLoggedIn.jwt).toBe(undefined);
    expect(showUser.id).not.toBe(undefined);
    expect(showUser).toEqual({
      id: showUser.id,
      firstName: showUser.firstName,
      lastName: showUser.lastName,
      email: showUser.email,
      birthYear: showUser.birthYear,
      student: showUser.student,
    });
    expect(showUser.student).toEqual(true);

    expect(showUser.passwordDigest).toEqual(undefined);
    expect(showUser.createdAt).toEqual(undefined);
    expect(showUser.updatedAt).toEqual(undefined);
  });

  it('can update self only', async () => {
    const self = await createUser();
    const other = await createUser();
    const selfToken = jwt.sign({ currentUserId: self.id }, process.env.JWT_SECRET);

    const resOther = await request(app)
      .put(`/users/${other.id}`)
      .set('jwt', selfToken)
      .send({
        firstName: 'Elowyn',
        lastName: 'Platzer Bartel',
        email: 'elowyn@example.com',
        birthYear: 2015,
        student: true,
        password: 'password',
      })
      .expect(404);

    expect(resOther.body).toEqual({ message: 'Not Found', error: { status: 404 } });

    const resSelf = await request(app)
      .put(`/users/${self.id}`)
      .set('jwt', selfToken)
      .send({
        firstName: 'Elowyn',
      })
      .expect(200);

    expect(resSelf.body.user.firstName).toBe('Elowyn');
    expect(resSelf.body.user.lastName).toBe(self.lastName);
    expect(resSelf.body.user.email).toBe(self.email);
    expect(resSelf.body.user.birthYear).toBe(self.birthYear);
    expect(resSelf.body.user.student).toBe(self.student);
  });

  it('can update to with same pre-existing email address', async () => {
    const user = await createUser();
    const token = jwt.sign({ currentUserId: user.id }, process.env.JWT_SECRET);

    const res = await request(app)
      .put(`/users/${user.id}`)
      .set('jwt', token)
      .send({
        firstName: 'Elowyn',
      })
      .expect(200);

    expect(res.body.user).toEqual({
      id: user.id,
      birthYear: user.birthYear,
      email: user.email,
      firstName: 'Elowyn',
      lastName: user.lastName,
      student: user.student,
    });
  });

  it('cannot update to pre-existing email address', async () => {
    const firstUser = await createUser();
    const secondUser = await createUser();
    const token = jwt.sign({ currentUserId: secondUser.id }, process.env.JWT_SECRET);

    const res = await request(app)
      .put(`/users/${secondUser.id}`)
      .set('jwt', token)
      .send({
        email: firstUser.email,
      })
      .expect(200);

    expect(res.body.user).toEqual({ errors: ['Email already taken'] });
  });

  it('returns logged in user details at /me with valid jwt', async () => {
    const user = await createUser({ email: 'user1@example.com ' });
    const token = jwt.sign({ currentUserId: user.id }, process.env.JWT_SECRET);

    const resInvalid = await request(app)
      .get('/users/me')
      .set('jwt', `${token}invalid`)
      .expect(404);

    expect(resInvalid.body).toEqual({ error: { status: 404 }, message: 'Not Found' });

    const resValid = await request(app)
      .get('/users/me')
      .set('jwt', token)
      .expect(200);

    expect(resValid.body.user.email).toEqual('user1@example.com');
  });
});
