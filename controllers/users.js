const jwt = require('jsonwebtoken');

const userSerializer = require('../serializers/user');
const User = require('../models/user');

exports.index = async (req, res, next) => {
  const users = await User.all();
  const serializedUsers = users.map(user => userSerializer(user));
  res.json({ users: serializedUsers });
};

exports.create = async (req, res, next) => {
  const user = await User.create(req.body);
  if (user.errors) {
    res.json({ user });
  } else {
    const serializedUser = await userSerializer(user);
    const token = jwt.sign({ user: serializedUser }, process.env.JWT_SECRET);
    res.json({ jwt: token, user: serializedUser });
  }
};

exports.show = async (req, res, next) => {
  try {
    const user = await User.find(req.params.id);
    const serializedUser = await userSerializer(user);
    res.json({ user: serializedUser });
  } catch (e) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
};

exports.update = async (req, res, next) => {
  const user = await User.find(req.params.id);
  const updatedUser = await User.update({
    ...req.body,
    ...{ id: req.params.id },
  });

  if (updatedUser.errors) {
    res.json({ user: updatedUser });
  } else {
    const serializedUser = await userSerializer(updatedUser);
    res.json({ user: serializedUser });
  }
};
