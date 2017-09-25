const bcrypt = require('bcryptjs');

const query = require('../db/index').query;

module.exports = {
  all: async () => {
    const users = (await query('SELECT * FROM "users"')).rows;
    return users;
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
