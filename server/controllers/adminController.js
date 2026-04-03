const AllowedEmail = require('../models/AllowedEmail');
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const Subject = require('../models/Subject');
const { convertRegNumToEmail, generateEmailsFromRange, isValidEmail } = require('../utils/regUtils');

// Add a single allowed email from reg num

exports.addAllowedEmail = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'Request body is missing. Please ensure you are sending JSON data with Content-Type: application/json' });
        }
        const { regNum, role } = req.body;

        if (!regNum || !role) {
            return res.status(400).json({ message: 'Please provide registration number and role' });
        }

        let email;
        try {
            email = convertRegNumToEmail(regNum);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }

        const existingEmail = await AllowedEmail.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists in allowed list' });
        }

        const allowedEmail = await AllowedEmail.create({
            email,
            role,
        });

        res.status(201).json({
            message: 'Email added successfully',
            data: allowedEmail,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add bulk allowed emails from reg num range
exports.addBulkAllowedEmails = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'Request body is missing. Please ensure you are sending JSON data with Content-Type: application/json' });
        }
        const { startRegNum, endRegNum, role } = req.body;

        if (!startRegNum || !endRegNum || !role) {
            return res.status(400).json({ message: 'Please provide start registration number, end registration number, and role' });
        }

        let emails;
        try {
            emails = generateEmailsFromRange(startRegNum, endRegNum);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }

        const emailsToAdd = emails.map(email => ({
            email,
            role,
        }));

        // Filter out existing emails to avoid unique constraint errors
        const existingEmails = await AllowedEmail.find({
            email: { $in: emailsToAdd.map(e => e.email) }
        });
        const existingEmailSet = new Set(existingEmails.map(e => e.email));

        const finalEmailsToAdd = emailsToAdd.filter(e => !existingEmailSet.has(e.email));

        if (finalEmailsToAdd.length === 0) {
            return res.status(200).json({ message: 'No new emails to add' });
        }

        const result = await AllowedEmail.insertMany(finalEmailsToAdd, { ordered: false });

        res.status(201).json({
            message: `${result.length} emails added successfully`,
            data: result,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a lecturer allowed email directly
exports.addLecturerEmail = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'Request body is missing' });
        }
        const { email, department } = req.body;

        if (!email || !department) {
            return res.status(400).json({ message: 'Please provide email and department' });
        }

        // Email format validation
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Invalid email address format' });
        }

        const existingEmail = await AllowedEmail.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists in allowed list' });
        }

        const allowedEmail = await AllowedEmail.create({
            email,
            role: 'lecturer',
            department,
        });

        res.status(201).json({
            message: 'Lecturer email added successfully',
            data: allowedEmail,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get allowed emails
exports.getAllowedEmails = async (req, res) => {
    try {
        const { role, department } = req.query;
        const filter = {};

        if (role) {
            filter.role = role;
        }

        if (role === 'lecturer' && department) {
            filter.department = department;
        }

        const allowedEmails = await AllowedEmail.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: allowedEmails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get registered users
exports.getRegisteredUsers = async (req, res) => {
    try {
        const { role, department } = req.query;
        if (!role) {
            return res.status(400).json({ message: 'Please provide a role (student or lecturer)' });
        }

        const filter = { role };
        if (role === 'lecturer' && department) {
            filter.department = department;
        }

        const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all complaints for admin
exports.getAdminComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate('lecturerId', 'firstName lastName email')
            .populate('studentId', 'firstName lastName studentENo email')
            .populate('subjectId', 'courseCode courseName')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: complaints.length, data: complaints });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update complaint status (Resolved, etc.)
exports.updateComplaintStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        complaint.status = status || complaint.status;
        if (status === 'Resolved') {
            complaint.resolvedAt = Date.now();
        }

        await complaint.save();

        res.status(200).json({ success: true, data: complaint });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all subjects (courses) for admin
exports.getAdminSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find();
        res.status(200).json({ success: true, count: subjects.length, data: subjects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get subject by details (courseCode, batch, semester) for auto-fill
exports.getSubjectByDetails = async (req, res) => {
    try {
        const { courseCode, batch, semester } = req.query;
        
        if (!courseCode || !batch || !semester) {
            return res.status(400).json({ message: 'Missing required parameters' });
        }

        // Find subject and populate lecturer details
        const subject = await Subject.findOne({ 
            courseCode: courseCode.toUpperCase(), 
            batch, 
            semester 
        }).populate('createdBy', 'firstName lastName email');

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        res.status(200).json({ 
            success: true, 
            data: {
                courseName: subject.courseName,
                lecturerEmail: subject.createdBy.email,
                lecturerName: `${subject.createdBy.firstName} ${subject.createdBy.lastName}`
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
