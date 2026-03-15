const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');

const {
    getMyIncourseSubjects,
    getMyIncourseMarks,
    submitComplaint,
    getStudentGPA
} = require('../controllers/studentController');

// All routes require student role
router.use(authMiddleware);
router.use(requireRole('student'));

router.get('/gpa', getStudentGPA);
router.get('/incourse/subjects', getMyIncourseSubjects);
router.get('/incourse/marks/:courseCode', getMyIncourseMarks);
router.post('/complaints', submitComplaint);

module.exports = router;