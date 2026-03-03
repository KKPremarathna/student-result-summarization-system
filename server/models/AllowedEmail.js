const mongoose = require('mongoose');

const allowedEmailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['student', 'lecturer'],
        required: true,
    },
});

module.exports = mongoose.model('AllowedEmail', allowedEmailSchema);
