const express = require('express');
const router = express.Router();
const { addAllowedEmail, addBulkAllowedEmails, addLecturerEmail } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');

router.use(authMiddleware);
router.use(requireRole('admin'));

router.post('/add-allowed-email', addAllowedEmail);
router.post('/add-bulk-allowed-emails', addBulkAllowedEmails);
router.post('/add-lecturer-email', addLecturerEmail);

module.exports = router;