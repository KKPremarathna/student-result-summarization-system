const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
    uploadCalendar,
    getCalendars,
    deleteCalendar
} = require('../controllers/academicCalendarController');

const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const dir = './uploads/calendars';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function(req, file, cb) {
        cb(null, `calendar-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});

const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
        return res.status(400).json({ message: err.message });
    }
    next();
};

router.get('/', getCalendars);
router.use(authMiddleware);
router.use(requireRole('admin'));
router.post('/', upload.single('pdfFile'), handleUploadError, uploadCalendar);
router.delete('/:id', deleteCalendar);

module.exports = router;