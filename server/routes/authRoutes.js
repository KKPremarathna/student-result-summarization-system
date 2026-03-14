const express = require('express');
const router = express.Router();
const { requestOTP, signup, login, forgotPassword, verifyResetOTP, resetPassword } = require('../controllers/authController');

router.post('/request-otp', requestOTP);
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password', resetPassword);

module.exports = router;
