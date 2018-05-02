const expect = require('expect');
const jwt = require('jsonwebtoken');

require('../helpers/testSetup');

const currentUser = require('../../lib/currentUser');
const User = require('../../models/user');
const userSerializer = require('../../serializers/user');

describe('currentUser', () => {
  it('returns a User when passed a valid token', async () => {
    const user = await User.create({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      birthYear: 2015,
      student: true,
      password: 'password',
    });
    const validToken = jwt.sign(
      { currentUserId: user.id },
      process.env.JWT_SECRET,
    );

    const userCurrent = await currentUser(validToken);
    const serializedUser = userSerializer(user);

    expect(userCurrent).toEqual(serializedUser);
  });

  it('returns undefined when passed an invalid token', async () => {
    const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

    const user = await currentUser(invalidToken);
    expect(user).toEqual(undefined);
  });
});
