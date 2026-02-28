const express = require('express');
const router = express.Router();
const { requestOTP, signup } = require('../controllers/authController');

router.post('/request-otp', requestOTP);
router.post('/signup', signup);

module.exports = router;
