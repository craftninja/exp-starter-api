const User = require('../../models/user');

exports.createUser = async overrides => {
  const defaults = {
    firstName: 'Elowyn',
    lastName: 'Platzer Bartel',
    email: 'elowyn@example.com',
    birthYear: 2015,
    student: true,
    password: 'password',
  };

  return await User.create({ ...defaults, ...overrides });
};
