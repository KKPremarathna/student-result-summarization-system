const mongoose = require('mongoose');

const AcademicCalendarSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: String,
        required: true,
        trim: true
    },
    filePath: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('AcademicCalendar', AcademicCalendarSchema);