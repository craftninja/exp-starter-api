const jwt = require('jsonwebtoken');

const currentUser = require('./currentUser');

module.exports = (req, res, next) => {
  const token = req.headers.jwt;
  try {
    currentUser(token);
  } catch (e) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
  next();
};
