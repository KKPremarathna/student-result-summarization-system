const AllowedEmail = require('../models/AllowedEmail');
const { convertRegNumToEmail, generateEmailsFromRange, isValidEmail } = require('../utils/regUtils');

// Delete a single allowed email using reg num
exports.deleteAllowedEmail = async(req, res) => {
    try {
        const { regNum } = req.body;
        if (!regNum) {
            return res.status(400).json({ message: 'Please provide registration number' });
        }

        let email;
        try {
            email = convertRegNumToEmail(regNum);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }

        const result = await AllowedEmail.findOneAndDelete({ email });
        if (!result) {
            return res.status(404).json({ message: 'Email not found in allowed list' });
        }

        res.status(200).json({ message: 'Email deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete bulk allowed emails using reg num range
exports.deleteBulkAllowedEmails = async(req, res) => {
    try {
        const { startRegNum, endRegNum } = req.body;
        if (!startRegNum || !endRegNum) {
            return res.status(400).json({ message: 'Please provide start and end registration numbers' });
        }

        let emails;
        try {
            emails = generateEmailsFromRange(startRegNum, endRegNum);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }

        const result = await AllowedEmail.deleteMany({ email: { $in: emails } });

        res.status(200).json({
            message: `${result.deletedCount} emails deleted successfully`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete lecturer allowed email by email address
exports.deleteLecturerEmail = async(req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Please provide email' });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Invalid email address format' });
        }

        const result = await AllowedEmail.findOneAndDelete({ email, role: 'lecturer' });
        if (!result) {
            return res.status(404).json({ message: 'Lecturer email not found in allowed list' });
        }

        res.status(200).json({ message: 'Lecturer email deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};