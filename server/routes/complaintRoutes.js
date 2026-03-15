const express = require('express');
const router = express.Router();
const { 
  createComplaint, 
  getLecturerComplaints, 
  updateComplaint, 
  deleteComplaint 
} = require('../controllers/complaintController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all routes with authMiddleware
router.use(authMiddleware);

router.post('/', createComplaint);
router.get('/my-complaints', getLecturerComplaints);
router.put('/:id', updateComplaint);
router.delete('/:id', deleteComplaint);

module.exports = router;
