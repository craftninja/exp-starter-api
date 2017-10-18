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

  const jillian = await User.create({
    firstName: 'Jillian',
    lastName: 'Holtzman',
    email: 'jillian@example.com',
    birthYear: 1984,
    student: false,
    password: 'password',
  });

  const leslie = await User.create({
    firstName: 'Leslie',
    lastName: 'Jones',
    email: 'leslie@example.com',
    birthYear: 1967,
    student: false,
    password: 'password',
  });

  const laverne = await User.create({
    firstName: 'Laverne',
    lastName: 'Cox',
    email: 'laverne@example.com',
    birthYear: 1972,
    student: false,
    password: 'password',
  });

  const users = [beyonce, jillian, leslie, laverne];
  /* eslint-disable no-console */
  console.log(`Created users \n${ users.map(user => '  ' + user.firstName + '\n') }`);
  /* eslint-enable no-console */
  await process.exit();
});
