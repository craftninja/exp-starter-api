if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const clearDB = require('../lib/clearDB');

const User = require('../models/user');

clearDB().then(async () => {
  const beyonce = await User.create({
    firstName: 'Beyoncé',
    lastName: 'Knowles-Carter',
    email: 'beyonce@example.com',
    birthYear: 1981,
    student: false,
    password: 'password',
  });

  /* eslint-disable no-console */
  console.log(`Created user ${ beyonce.firstName } ${ beyonce.lastName }`);
  /* eslint-enable no-console */
  await process.exit();
});
