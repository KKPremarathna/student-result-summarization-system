const express = require('express');
const router = express.Router();
const { requestOTP, signup, login, forgotPassword, verifyResetOTP, resetPassword, changePassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/request-otp', requestOTP);
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password', resetPassword);
router.post('/change-password', authMiddleware, changePassword);

module.exports = router;
