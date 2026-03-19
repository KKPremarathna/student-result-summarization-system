const User = require('../models/User');
const AllowedEmail = require('../models/AllowedEmail');
const OTP = require('../models/OTP');
const sendEmail = require('../utils/email');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// @desc    Request OTP for Signup
// @route   POST /api/auth/request-otp
// @access  Public
exports.requestOTP = async(req, res) => {
    const { email } = req.body;

    try {
        // 1. Check if email is in AllowedEmail collection
        const allowedEmail = await AllowedEmail.findOne({ email });
        if (!allowedEmail) {
            return res.status(403).json({ message: 'Email not allowed for registration.' });
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // 3. Generate OTP
        const otpIndex = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP

        // 4. Save OTP to DB (upsert to replace existing OTP for same email)
        // Reset createdAt to ensure the 5-minute TTL starts fresh
        await OTP.findOneAndUpdate(
            { email }, 
            { otp: otpIndex, createdAt: new Date() }, 
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // 5. Send OTP via Email
        const message = `Your OTP for registration is: ${otpIndex}. It expires in 5 minutes.`;
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
                <h2 style="color: #4ea0f0;">Registration OTP</h2>
                <p>Thank you for registering with the Student Result Summarization System.</p>
                <p>Your OTP for registration is: <strong style="font-size: 20px; color: #4ea0f0;">${otpIndex}</strong></p>
                <p>This OTP will expire in 5 minutes.</p>
                <hr style="border: 0; border-top: 1px solid #eee;" />
                <p style="font-size: 12px; color: #777;">If you did not request this, please ignore this email.</p>
            </div>
        `;

        try {
            await sendEmail({
                email: email,
                subject: 'Registration OTP - Student Result System',
                message: message,
                html: html
            });

            res.status(200).json({ message: 'OTP sent to email.' });
        } catch (emailError) {
            console.error("Email send error:", emailError);
            // Optionally delete the OTP if email fails, but keep it simple for now or retry
            return res.status(500).json({ message: 'Email could not be sent. Please try again.' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async(req, res) => {
    const { firstName, lastName, email, phone, dob, password, otp } = req.body;

    try {
        // 1. Verify OTP
        const validOTP = await OTP.findOne({ email, otp });
        if (!validOTP) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        // 2. Check allowed email again (security best practice) & get role
        const allowedEmail = await AllowedEmail.findOne({ email });
        if (!allowedEmail) {
            return res.status(403).json({ message: 'Email not allowed.' });
        }

        // 3. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create User
        const user = await User.create({
            firstName,
            lastName,
            email,
            phone,
            dob,
            password: hashedPassword,
            role: allowedEmail.role
        });

        // 5. Delete OTP
        await OTP.deleteOne({ email });

        res.status(201).json({ success: true, data: user });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
exports.login = async(req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // 2. Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // 3. Generate JWT
        const token = jwt.sign({ id: user._id, role: user.role },
            process.env.JWT_SECRET, { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Forgot Password (Send OTP)
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async(req, res) => {
    const { email } = req.body;

    try {
        // 1. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User with this email does not exist.' });
        }

        // 2. Generate new OTP
        const otpIndex = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP

        // 3. Save OTP to DB
        await OTP.findOneAndUpdate(
            { email }, 
            { otp: otpIndex, isVerified: false, createdAt: new Date() }, // Explicitly reset createdAt
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // 4. Send Email
        const message = `Your OTP to reset your password is: ${otpIndex}. It expires in 5 minutes.`;
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
                <h2 style="color: #4ea0f0;">Password Reset OTP</h2>
                <p>We received a request to reset your password for the Student Result Summarization System.</p>
                <p>Your OTP to reset your password is: <strong style="font-size: 20px; color: #4ea0f0;">${otpIndex}</strong></p>
                <p>This OTP will expire in 5 minutes.</p>
                <hr style="border: 0; border-top: 1px solid #eee;" />
                <p style="font-size: 12px; color: #777;">If you did not request this, please ignore this email.</p>
            </div>
        `;

        try {
            await sendEmail({
                email: email,
                subject: 'Password Reset OTP - Student Result System',
                message: message,
                html: html
            });

            res.status(200).json({ message: 'Password reset OTP sent to your email.' });
        } catch (emailError) {
            console.error("Email send error for password reset:", emailError);
            return res.status(500).json({ message: 'Email could not be sent. Please try again.' });
        }

    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Verify Reset OTP
// @route   POST /api/auth/verify-reset-otp
// @access  Public
exports.verifyResetOTP = async(req, res) => {
    const { email, otp } = req.body;

    try {
        // 1. Verify OTP
        const validOTP = await OTP.findOne({ email, otp });
        if (!validOTP) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        // 2. Mark as verified
        validOTP.isVerified = true;
        await validOTP.save();

        res.status(200).json({ message: 'OTP verified successfully.' });

    } catch (error) {
        console.error("Verify reset OTP error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Reset Password using OTP
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async(req, res) => {
    const { email, newPassword } = req.body; // No longer taking OTP from body

    try {
        // 1. Verify OTP session is marked as verified
        const validSession = await OTP.findOne({ email, isVerified: true });
        if (!validSession) {
            return res.status(403).json({ message: 'Unauthorized request. OTP was not verified or has expired.' });
        }

        // 2. Hash New Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 3. Update User Password
        const updatedUser = await User.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found during password update.' });
        }

        // 4. Delete the used OTP
        await OTP.deleteOne({ email });

        res.status(200).json({ message: 'Password has been reset successfully.' });

    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Change password for logged-in user
// @route   POST /api/auth/change-password
// @access  Private
exports.changePassword = async(req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        if (oldPassword === newPassword) {
            return res.status(400).json({ message: 'New password cannot be the same as the current password.' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully.' });

    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};