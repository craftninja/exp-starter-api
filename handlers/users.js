const express = require('express');
const router = express.Router();

const verifyLoggedInUser = require('../lib/verifyLoggedInUser');
const verifySelf = require('../lib/verifySelf');

router.get('/users(/*)?', verifyLoggedInUser);
router.put('/users/*', verifyLoggedInUser);
router.use('/users/:id', verifySelf);

module.exports = router;
