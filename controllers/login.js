const User = require('../models/user');

exports.create = async (req, res) => {
  res.json(await User.authenticate(req.body));
};
