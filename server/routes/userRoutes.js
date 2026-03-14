const express = require('express');
const router = express.Router();
const { getUserDetails, updateProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all routes
router.use(authMiddleware);

router.get('/details', getUserDetails);
router.put('/update-profile', updateProfile);

module.exports = router;
