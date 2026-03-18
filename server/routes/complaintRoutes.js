const express = require('express');
const router = express.Router();
const { 
  createComplaint, 
  getMyComplaints, 
  updateComplaint, 
  deleteComplaint,
  updateComplaintStatus
} = require('../controllers/complaintController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all routes with authMiddleware
router.use(authMiddleware);

router.post('/', createComplaint);
router.get('/my-complaints', getMyComplaints);
router.put('/:id', updateComplaint);
router.delete('/:id', deleteComplaint);
router.patch('/:id/status', updateComplaintStatus);

module.exports = router;
