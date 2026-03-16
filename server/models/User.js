const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'lecturer', 'admin'],
        default: 'student',
    },
    department: {
        type: String,
        default: '',
    },
    profilePicture: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    },
    title: {
        type: String,
        default: '',
        enum: ['Dr.', 'Mr.', 'Mrs.', 'Miss', 'Prof.', ''],
    },
    position: {
        type: String,
        default: '',
    },
    faculty: {
        type: String,
        default: '',
    },
    university: {
        type: String,
        default: '',
    },
    lecturerId: {
        type: String,
        default: '',
    },
    studentENo: {
        type: String,
        default: '',
        unique: true,
        sparse: true, // Allow multiple users with empty string if not a student
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);
