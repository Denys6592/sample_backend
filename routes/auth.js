const express = require('express');
const { signup, login, sendResetPasswordEmail } = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/sendResetPasswordEmail', sendResetPasswordEmail);

module.exports = router;
