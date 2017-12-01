const currentUser = require('./currentUser');

module.exports = async (req, res, next) => {
  const token = req.headers.jwt;
  const currUser = await currentUser(token);
  const authorized = currUser.id === Number(req.params.id);

  if (!currUser || !authorized) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
  next();
};
