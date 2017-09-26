const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users')

router.get('/', function(req, res, next) {
  res.status(200);
  res.json({users: []});
});

router.post('/', usersController.create);

module.exports = router;
