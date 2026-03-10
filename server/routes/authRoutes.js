const express = require('express');
const router = express.Router();
const { requestOTP, signup, login } = require('../controllers/authController');

router.post('/request-otp', requestOTP);
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
