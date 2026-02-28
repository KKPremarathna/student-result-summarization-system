const User = require('../models/User');
const AllowedEmail = require('../models/AllowedEmail');
const OTP = require('../models/OTP');
const sendEmail = require('../utils/email');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// @desc    Request OTP for Signup
// @route   POST /api/auth/request-otp
// @access  Public
exports.requestOTP = async (req, res) => {
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
        await OTP.findOneAndUpdate(
            { email },
            { otp: otpIndex },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // 5. Send OTP via Email
        const message = `Your OTP for registration is: ${otpIndex}. It expires in 5 minutes.`;

        try {
            await sendEmail({
                email: email,
                subject: 'Student Result Summarization System - Registration OTP',
                message: message,
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
exports.signup = async (req, res) => {
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
