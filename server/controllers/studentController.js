const IncourseResult = require('../models/IncourseResult');
const { convertEmailToRegNum, generateRegNoRegex } = require('../utils/regUtils');
const Complaint = require('../models/Complaint');
const Subject = require('../models/Subject');

// @desc    Get all subjects the student has incourse marks for
// @route   GET /api/student/incourse/subjects
// @access  Private (Student)
exports.getMyIncourseSubjects = async(req, res) => {
    try {
        let studentENo;
        try {
            // E.g., user.email: 2021e140@eng.jfn.ac.lk -> studentENo: 2021/E/140
            studentENo = convertEmailToRegNum(req.user.email);
        } catch (error) {
            return res.status(400).json({ message: 'User email is not a valid student email pattern.' });
        }

        const regNoRegex = generateRegNoRegex(studentENo);

        // Find all distinct subjects where this student has records
        const results = await IncourseResult.find({ studentENo: regNoRegex })
            .populate('subject', 'courseCode courseName batch');

        // Return only the populated subjects for the dropdown
        const subjects = results.map(r => r.subject).filter(s => s !== null);

        res.status(200).json({ success: true, count: subjects.length, studentENo, data: subjects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all incourse marks for a specific course code (including repeats)
// @route   GET /api/student/incourse/marks/:courseCode
// @access  Private (Student)
exports.getMyIncourseMarks = async(req, res) => {
    try {
        const { courseCode } = req.params;

        let studentENo;
        try {
            studentENo = convertEmailToRegNum(req.user.email);
        } catch (error) {
            return res.status(400).json({ message: 'User email is not a valid student email pattern.' });
        }

        // 1. Find all subjects with this course code
        const subjects = await Subject.find({ courseCode: courseCode.toUpperCase() });

        if (!subjects || subjects.length === 0) {
            return res.status(404).json({ message: 'No subjects found with this course code.' });
        }

        const subjectIds = subjects.map(s => s._id);

        const regNoRegex = generateRegNoRegex(studentENo);

        // 2. Find all results for this student in those subjects
        const results = await IncourseResult.find({
            subject: { $in: subjectIds },
            studentENo: regNoRegex
        }).populate('subject', 'courseCode courseName batch credit assessments');

        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'No marks found for this course.' });
        }

        res.status(200).json({ success: true, count: results.length, data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a complaint about a specific subject
// @route   POST /api/student/complaints
// @access  Private (Student)
exports.submitComplaint = async(req, res) => {
    try {
        const { subjectId, title, description } = req.body;

        if (!subjectId || !title || !description) {
            return res.status(400).json({ message: 'Please provide subjectId, title, and description' });
        }

        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        const complaint = await Complaint.create({
            senderId: req.user.id,
            senderRole: 'student',
            receiverId: subject.createdBy, // The lecturer who created the subject
            receiverRole: 'lecturer',
            subjectId: subjectId,
            title,
            description,
            status: 'Pending'
        });

        res.status(201).json({ success: true, data: complaint });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const { calculateStudentGPA } = require('../utils/gpaUtils');

// Get student's overall GPA

exports.getStudentGPA = async(req, res) => {
    try {
        let studentENo;
        try {
            studentENo = convertEmailToRegNum(req.user.email);
        } catch (error) {
            return res.status(400).json({ message: 'User email is not a valid student email pattern.' });
        }

        const gpaData = await calculateStudentGPA(studentENo);

        res.status(200).json({
            success: true,
            studentENo: studentENo.toUpperCase(),
            gpa: gpaData.gpa,
            totalCredits: gpaData.totalCredits,
            coursesCount: gpaData.coursesCount
        });

    } catch (error) {
        console.error("GPA Calculation error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};