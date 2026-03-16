const Complaint = require('../models/Complaint');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (Student/Lecturer)
exports.createComplaint = async (req, res) => {
    try {
        const { title, description, lecturerId, subjectId } = req.body;

        const data = {
            title,
            description,
            status: 'Pending'
        };

        if (req.user.role === 'student') {
            data.studentId = req.user.id;
            data.lecturerId = lecturerId; // Student must provide the lecturer ID they are complaining to
            data.subjectId = subjectId;
        } else if (req.user.role === 'lecturer') {
            data.lecturerId = req.user.id; // Lecturer complaining (maybe legacy or for self-tracking)
            // Note: Current logic in model requires studentId too. 
            // I should make studentId optional if lecturer is creating? 
            // Or maybe separate Student and Lecturer complaints? 
            // The image shows student submitting.
        }

        const complaint = await Complaint.create(data);

        res.status(201).json({ success: true, data: complaint });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get my complaints
// @route   GET /api/complaints/my-complaints
// @access  Private
exports.getMyComplaints = async (req, res) => {
    try {
        let filter = {};
        if (req.user.role === 'student') {
            filter = { studentId: req.user.id };
        } else if (req.user.role === 'lecturer') {
            filter = { lecturerId: req.user.id };
        }

        const complaints = await Complaint.find(filter)
            .populate('subjectId', 'courseCode courseName')
            .populate('studentId', 'firstName lastName studentENo')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: complaints.length, data: complaints });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a specific complaint (Title/Description)
// @route   PUT /api/complaints/:id
// @access  Private (Lecturer)
exports.updateComplaint = async (req, res) => {
    try {
        const { title, description } = req.body;
        
        let complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Verify ownership
        if (complaint.lecturerId.toString() !== req.user.id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this complaint' });
        }

        // Only allow updating if it is still Pending
        if (complaint.status !== 'Pending') {
            return res.status(400).json({ message: 'Cannot update a complaint that is already In Progress or Resolved' });
        }

        complaint.title = title || complaint.title;
        complaint.description = description || complaint.description;
        
        await complaint.save();

        res.status(200).json({ success: true, data: complaint });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a complaint
// @route   DELETE /api/complaints/:id
// @access  Private (Lecturer)
exports.deleteComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Verify ownership
        if (complaint.lecturerId.toString() !== req.user.id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this complaint' });
        }

        // Only allow deleting if it is still Pending
        if (complaint.status !== 'Pending') {
             return res.status(400).json({ message: 'Cannot delete a complaint that is already In Progress or Resolved' });
        }

        await complaint.deleteOne();

        res.status(200).json({ success: true, message: 'Complaint deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
  createComplaint: exports.createComplaint,
  getMyComplaints: exports.getMyComplaints,
  updateComplaint: exports.updateComplaint,
  deleteComplaint: exports.deleteComplaint
};
