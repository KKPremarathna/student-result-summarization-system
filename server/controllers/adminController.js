const AllowedEmail = require('../models/AllowedEmail');

// @desc    Add an email to the allowed list
// @route   POST /api/admin/allowed-emails
// @access  Private (Admin Only - simplified for now)
exports.addAllowedEmail = async (req, res) => {
    const { email, role } = req.body;

    try {
        const existing = await AllowedEmail.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email already in allowed list.' });
        }

        const allowedEmail = await AllowedEmail.create({ email, role });
        res.status(201).json({ success: true, data: allowedEmail });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

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
