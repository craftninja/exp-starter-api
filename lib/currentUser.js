const jwt = require('jsonwebtoken');

module.exports = token => {
  return jwt.verify(token, process.env.JWT_SECRET).user;
};
