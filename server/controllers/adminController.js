const AllowedEmail = require('../models/AllowedEmail');
const User = require('../models/User');

// @desc    Get all allowed emails
// @route   GET /api/admin/allowed-emails
// @access  Private (Admin Only)
exports.getAllowedEmails = async (req, res) => {
    try {
        const allowedEmails = await AllowedEmail.find();
        res.status(200).json({ success: true, data: allowedEmails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
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


// @desc    Get all allowed emails for students only
// @route   GET /api/admin/students/allowed
// @access  Private (Admin Only)
exports.getStudentAllowedEmails = async (req, res) => {
    try {
        const allowedEmails = await AllowedEmail.find({ role: 'student' }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: allowedEmails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete an allowed email by MongoDB id
// @route   DELETE /api/admin/students/allowed/:id
// @access  Private (Admin Only)
exports.deleteAllowedEmailById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await AllowedEmail.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: 'Allowed email not found' });
        }
        res.status(200).json({ success: true, message: 'Allowed email deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all registered students from users collection
// @route   GET /api/admin/students/registered
// @access  Private (Admin Only)
exports.getRegisteredStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: students });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a registered student user by id
// @route   DELETE /api/admin/students/registered/:id
// @access  Private (Admin Only)
exports.deleteRegisteredStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await User.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: 'Student user not found' });
        }
        res.status(200).json({ success: true, message: 'Student deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
