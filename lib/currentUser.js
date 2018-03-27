const jwt = require('jsonwebtoken');

const User = require('../models/user');
const userSerializer = require('../serializers/user');

module.exports = async token => {
  try {
    const { currentUserId } = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.find(currentUserId);
    const serializedUser = await userSerializer(currentUser);
    return serializedUser;
  } catch (err) {
    return undefined;
  }
};
