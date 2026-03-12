const express = require('express');
const router = express.Router();
const { addAllowedEmail, addBulkAllowedEmails } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');

router.use(authMiddleware);
router.use(requireRole('admin'));

router.post('/add-allowed-email', addAllowedEmail);
router.post('/add-bulk-allowed-emails', addBulkAllowedEmails);

module.exports = router;