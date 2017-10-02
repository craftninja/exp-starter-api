const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users');
const verifyLoggedInUser = require('../lib/verifyLoggedInUser');
const verifySelf = require('../lib/verifySelf');

router.post('/', usersController.create);

router.use(verifyLoggedInUser);

router.get('/', usersController.index);
router.get('/:id', usersController.show);

router.use('/:id', verifySelf);

router.put('/:id', usersController.update);

module.exports = router;
