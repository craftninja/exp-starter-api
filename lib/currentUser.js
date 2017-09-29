const jwt = require('jsonwebtoken');

module.exports = token => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET).user;
  } catch (err) {
    return undefined;
  }
};
