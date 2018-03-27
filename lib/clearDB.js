const { query } = require('../db/index');

module.exports = async () => {
  await query('delete from "users"');
};
