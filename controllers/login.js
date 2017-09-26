const User = require('../models/user');

exports.create = async (req, res, next) => {
  res.json(await User.authenticate(req.body));
};
