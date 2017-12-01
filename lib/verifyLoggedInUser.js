const currentUser = require('./currentUser');

module.exports = async (req, res, next) => {
  const token = req.headers.jwt;
  if (!await currentUser(token)) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
  next();
};
