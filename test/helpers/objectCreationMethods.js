const User = require('../../models/user');

const randomDigits = () => {
  const pad = '0000';
  const num = Math.floor(Math.random() * 9999);
  return (pad + num).slice(-4);
};

const randomYear = () => {
  const min = 1900;
  const max = new Date().getFullYear();
  return Math.floor(Math.random() * (max - min)) + min;
};

exports.createUser = async overrides => {
  const randomId = randomDigits();

  const defaults = {
    firstName: `Elowyn${randomId}`,
    lastName: `Platzer Bartel${randomId}`,
    email: `elowyn${randomId}@example.com`,
    birthYear: randomYear(),
    student: true,
    password: 'password',
  };

  return await User.create({ ...defaults, ...overrides });
};
