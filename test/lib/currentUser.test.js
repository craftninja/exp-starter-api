const expect = require('expect');
const jwt = require('jsonwebtoken');

require('../helpers/testSetup');

const currentUser = require('../../lib/currentUser');
const User = require('../../models/user');
const userSerializer = require('../../serializers/user');

describe('currentUser', () => {
  it('returns a User when passed a valid token', async () => {
    const createdUser = await User.create({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      birthYear: 2015,
      student: true,
      password: 'password',
    });
    const serializedUser = userSerializer(createdUser);
    const validToken = jwt.sign(
      { user: serializedUser },
      process.env.JWT_SECRET
    );

    const user = currentUser(validToken);
    expect(user).toEqual(serializedUser);
  });

  it('returns undefined when passed an invalid token', async () => {
    const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

    const user = currentUser(invalidToken);
    expect(user).toEqual(undefined);
  });
});
