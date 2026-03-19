const User = require('../models/User');
const bcrypt = require('bcryptjs');

const Subject = require('../models/Subject');

// @desc    Get user details
// @route   GET /api/user/details
// @access  Private
exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Fetch subjects assigned to this user
        const subjects = await Subject.find({ createdBy: req.user.id });

        res.status(200).json({ success: true, data: user, subjects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user profile (picture and/or password)
// @route   PUT /api/user/update-profile
// @access  Private
exports.updateProfile = async (req, res) => {
    const { 
        firstName, 
        lastName, 
        profilePicture, 
        oldPassword, 
        newPassword, 
        title, 
        position, 
        faculty, 
        university, 
        department,
        lecturerId,
        phone,
        dob
    } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let updatedFields = {};
        
        // 1. Update Profile Fields if provided
        if (firstName !== undefined) updatedFields.firstName = firstName;
        if (lastName !== undefined) updatedFields.lastName = lastName;
        if (profilePicture !== undefined) updatedFields.profilePicture = profilePicture;
        if (title !== undefined) updatedFields.title = title;
        if (position !== undefined) updatedFields.position = position;
        if (faculty !== undefined) updatedFields.faculty = faculty;
        if (university !== undefined) updatedFields.university = university;
        if (department !== undefined) updatedFields.department = department;
        if (lecturerId !== undefined) updatedFields.lecturerId = lecturerId;
        if (phone !== undefined) updatedFields.phone = phone;
        if (dob !== undefined) updatedFields.dob = dob;

        // 2. Update Password if both old & new are provided
        if (oldPassword && newPassword) {
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid old password.' });
            }

            const salt = await bcrypt.genSalt(10);
            updatedFields.password = await bcrypt.hash(newPassword, salt);
        } else if ((oldPassword && !newPassword) || (!oldPassword && newPassword)) {
             return res.status(400).json({ message: 'Both old and new password are required to update password.' });
        }

        // 3. Save updates if any
        if (Object.keys(updatedFields).length > 0) {
            const updatedUser = await User.findByIdAndUpdate(
                req.user.id,
                { $set: updatedFields },
                { new: true, runValidators: true }
            ).select('-password');

            return res.status(200).json({ success: true, message: 'Profile updated successfully', data: updatedUser });
        } else {
            return res.status(200).json({ success: true, message: 'No changes made', data: user });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
