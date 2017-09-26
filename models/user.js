const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const query = require('../db/index').query;

const userSerializer = require('../serializers/user');

module.exports = {
  all: async () => {
    const users = (await query('SELECT * FROM "users"')).rows;
    return users;
  },
  authenticate: async credentials => {
    const user = (await query('SELECT * FROM "users" WHERE "email" = ($1)', [
      credentials.email,
    ])).rows[0];

    const valid = user
      ? await bcrypt.compare(credentials.password, user.passwordDigest)
      : false;
    if (valid) {
      const serializedUser = await userSerializer(user);
      const token = jwt.sign({ user: serializedUser }, process.env.JWT_SECRET);
      return Promise.resolve({
        jwt: token,
        user: serializedUser,
      });
    } else {
      return Promise.resolve({ error: 'Email or Password is incorrect' });
    }
  },
  create: async properties => {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordDigest = bcrypt.hashSync(properties.password, salt);

    const createdUser = (await query(
      `INSERT INTO "users"(
        "firstName",
        "lastName",
        "email",
        "birthYear",
        "student",
        "passwordDigest"
      ) values ($1, $2, $3, $4, $5, $6) returning *`,
      [
        properties.firstName,
        properties.lastName,
        properties.email,
        properties.birthYear,
        properties.student,
        passwordDigest,
      ]
    )).rows[0];
    return createdUser;
  },
}
