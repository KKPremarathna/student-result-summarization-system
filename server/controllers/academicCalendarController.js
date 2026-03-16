const AcademicCalendar = require('../models/AcademicCalendar');
const supabase = require('../config/supabase');
const path = require('path');

// Upload a new Academic Calendar (PDF)
exports.uploadCalendar = async(req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a PDF file.' });
        }

        const { title, year } = req.body;

        if (!title || !year) {
            return res.status(400).json({ message: 'Title and year are required.' });
        }

        const fileName = `calendar-${Date.now()}${path.extname(req.file.originalname)}`;
        const filePath = `calendars/${fileName}`;

        const { data, error } = await supabase.storage
            .from('academic-calendars')
            .upload(filePath, req.file.buffer, {
                contentType: 'application/pdf',
                upsert: false
            });

        if (error) {
            console.error('Supabase Upload Error:', error);
            return res.status(500).json({ 
                message: 'Failed to upload to cloud storage.', 
                error: error.message 
            });
        }

        const { data: { publicUrl } } = supabase.storage
            .from('academic-calendars')
            .getPublicUrl(filePath);

        const calendar = await AcademicCalendar.create({
            title,
            year,
            fileUrl: publicUrl,
            supabasePath: filePath,
            uploadedBy: req.user._id
        });

        res.status(201).json({
            success: true,
            message: 'Academic calendar uploaded successfully.',
            data: calendar
        });
    } catch (error) {
        console.error("Upload Calendar Error:", error);
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

        const { error } = await supabase.storage
            .from('academic-calendars')
            .remove([calendar.supabasePath]);

        if (error) {
            console.error('Supabase Deletion Error:', error);
            return res.status(500).json({ message: 'Failed to delete from cloud storage.' });
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