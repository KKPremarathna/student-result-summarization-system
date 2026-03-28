const express = require('express');
const router = express.Router();
const { addAllowedEmail, addBulkAllowedEmails, addLecturerEmail, getAllowedEmails, getRegisteredUsers, getAdminComplaints, updateComplaintStatus, getAdminSubjects, getSubjectByDetails } = require('../controllers/adminController');
const { deleteAllowedEmail, deleteBulkAllowedEmails, deleteLecturerEmail } = require('../controllers/adminDeleteController');
const { addBatchResults, updateResult, deleteResult, deleteSubjectResults, getResults, importFromDepartment } = require('../controllers/adminResultController');
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
router.get('/allowed-emails', getAllowedEmails);
router.get('/registered-users', getRegisteredUsers);
router.get('/complaints', getAdminComplaints);
router.get('/get-results', getResults);
router.get('/import-results', importFromDepartment);
router.get('/subjects', getAdminSubjects);
router.get('/subject-details', getSubjectByDetails);
router.put('/complaints/:id', updateComplaintStatus);

module.exports = router;