const express = require('express');
const router = express.Router();
const { addAllowedEmail, addBulkAllowedEmails, addLecturerEmail, getStudentAllowedEmails, deleteAllowedEmailById, getRegisteredStudents, deleteRegisteredStudentById } = require('../controllers/adminController');
const { deleteAllowedEmail, deleteBulkAllowedEmails, deleteLecturerEmail } = require('../controllers/adminDeleteController');
const { addBatchResults, updateResult, deleteResult, deleteSubjectResults } = require('../controllers/adminResultController');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');

router.use(authMiddleware);
router.use(requireRole('admin'));

router.post('/add-allowed-email', addAllowedEmail);
router.post('/add-bulk-allowed-emails', addBulkAllowedEmails);
router.post('/add-lecturer-email', addLecturerEmail);
router.delete('/delete-allowed-email', deleteAllowedEmail);
router.delete('/delete-bulk-allowed-emails', deleteBulkAllowedEmails);
router.delete('/delete-lecturer-email', deleteLecturerEmail);
router.post('/add-results', addBatchResults);
router.put('/update-result/:id', updateResult);
router.delete('/delete-result/:id', deleteResult);
router.delete('/delete-subject-results', deleteSubjectResults);

// Student list management routes
router.get('/students/allowed', getStudentAllowedEmails);
router.delete('/students/allowed/:id', deleteAllowedEmailById);
router.get('/students/registered', getRegisteredStudents);
router.delete('/students/registered/:id', deleteRegisteredStudentById);

module.exports = router;