const AcademicCalendar = require('../models/AcademicCalendar');
const fs = require('fs');
const path = require('path');

// Upload a new Academic Calendar (PDF)
exports.uploadCalendar = async(req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a PDF file.' });
        }

        const { title, year } = req.body;

        if (!title || !year) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: 'Title and year are required.' });
        }

        const calendar = await AcademicCalendar.create({
            title,
            year,
            filePath: req.file.path,
            uploadedBy: req.user._id
        });

        res.status(201).json({
            success: true,
            message: 'Academic calendar uploaded successfully.',
            data: calendar
        });
    } catch (error) {
        console.error("Upload Calendar Error:", error);
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all Academic Calendars
exports.getCalendars = async(req, res) => {
    try {
        const calendars = await AcademicCalendar.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: calendars.length,
            data: calendars
        });
    } catch (error) {
        console.error("Get Calendars Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete an Academic Calendar
exports.deleteCalendar = async(req, res) => {
    try {
        const calendar = await AcademicCalendar.findById(req.params.id);

        if (!calendar) {
            return res.status(404).json({ message: 'Calendar not found.' });
        }

        if (fs.existsSync(calendar.filePath)) {
            fs.unlinkSync(calendar.filePath);
        }

        await AcademicCalendar.deleteOne({ _id: req.params.id });

        res.status(200).json({
            success: true,
            message: 'Academic calendar deleted successfully.'
        });
    } catch (error) {
        console.error("Delete Calendar Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};