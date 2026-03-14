const IncourseResult = require('../models/IncourseResult');
const { convertEmailToRegNum } = require('../utils/regUtils');
const Complaint = require('../models/Complaint');
const Subject = require('../models/Subject');

// @desc    Get all subjects the student has incourse marks for
// @route   GET /api/student/incourse/subjects
// @access  Private (Student)
exports.getMyIncourseSubjects = async (req, res) => {
    try {
        let studentENo;
        try {
            // E.g., user.email: 2021e140@eng.jfn.ac.lk -> studentENo: 2021/E/140
            studentENo = convertEmailToRegNum(req.user.email);
        } catch (error) {
            return res.status(400).json({ message: 'User email is not a valid student email pattern.' });
        }

        // Find all distinct subjects where this student has records
        const results = await IncourseResult.find({ studentENo: studentENo.toUpperCase() })
            .populate('subject', 'courseCode courseName batch');
        
        // Return only the populated subjects for the dropdown
        const subjects = results.map(r => r.subject).filter(s => s !== null);

        res.status(200).json({ success: true, count: subjects.length, studentENo, data: subjects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get specific incourse marks for the selected subject
// @route   GET /api/student/incourse/marks/:subjectId
// @access  Private (Student)
exports.getMyIncourseMarks = async (req, res) => {
    try {
        const { subjectId } = req.params;

        let studentENo;
        try {
            studentENo = convertEmailToRegNum(req.user.email);
        } catch (error) {
            return res.status(400).json({ message: 'User email is not a valid student email pattern.' });
        }

        const result = await IncourseResult.findOne({ 
            subject: subjectId, 
            studentENo: studentENo.toUpperCase() 
        }).populate('subject', 'courseCode courseName assessments');

        if (!result) {
            return res.status(404).json({ message: 'No marks found for this subject.' });
        }

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a complaint about a specific subject
// @route   POST /api/student/complaints
// @access  Private (Student)
exports.submitComplaint = async (req, res) => {
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
