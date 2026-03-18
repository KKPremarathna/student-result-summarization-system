const Complaint = require('../models/Complaint');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (Student/Lecturer)
exports.createComplaint = async (req, res) => {
    try {
        const { title, description, lecturerId, subjectId } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        const data = {
            title,
            description,
            status: 'Pending'
        };

        if (req.user.role === 'student') {
            if (!lecturerId || !subjectId) {
                return res.status(400).json({ message: 'Lecturer and subject are required for student complaints' });
            }
            data.studentId = req.user.id;
            data.lecturerId = lecturerId;
            data.subjectId = subjectId;
            data.isAdminRecipient = false;
        } else if (req.user.role === 'lecturer') {
            data.lecturerId = req.user.id;
            data.isAdminRecipient = true;
            // studentId and subjectId remain null/undefined
        } else {
            return res.status(403).json({ message: 'Admins cannot create complaints via this endpoint' });
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
            // Students see complaints they SENT
            filter = { studentId: req.user.id };
        } else if (req.user.role === 'lecturer') {
            // Lecturers see:
            // 1. Complaints RECEIVED from students (isAdminRecipient: false)
            // 2. Complaints they SENT to admin (isAdminRecipient: true)
            filter = { lecturerId: req.user.id };
        } else if (req.user.role === 'admin') {
            // Admins see all complaints directed TO them
            filter = { isAdminRecipient: true };
        }

        const complaints = await Complaint.find(filter)
            .populate('subjectId', 'courseCode courseName')
            .populate('studentId', 'firstName lastName studentENo')
            .populate('lecturerId', 'firstName lastName title position')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: complaints.length, data: complaints });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update complaint status
// @route   PATCH /api/complaints/:id/status
// @access  Private (Recipient: Lecturer or Admin)
exports.updateComplaintStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        let complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Authorization check
        let isAuthorized = false;

        if (req.user.role === 'admin' && complaint.isAdminRecipient) {
            isAuthorized = true;
        } else if (req.user.role === 'lecturer' && !complaint.isAdminRecipient && complaint.lecturerId.toString() === req.user.id.toString()) {
            isAuthorized = true;
        }

        if (!isAuthorized) {
            return res.status(401).json({ message: 'Not authorized to update status of this complaint' });
        }

        complaint.status = status;
        if (status === 'Resolved') {
            complaint.resolvedAt = Date.now();
        } else {
            complaint.resolvedAt = null;
        }
        
        await complaint.save();

        res.status(200).json({ success: true, data: complaint });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a specific complaint (Title/Description)
// @route   PUT /api/complaints/:id
// @access  Private (Sender)
exports.updateComplaint = async (req, res) => {
    try {
        const { title, description } = req.body;
        
        let complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Verify ownership (Sender check)
        // If student-to-lecturer, studentId is sender
        // If lecturer-to-admin, lecturerId is sender
        let isSender = false;
        if (req.user.role === 'student' && complaint.studentId && complaint.studentId.toString() === req.user.id.toString()) {
            isSender = true;
        } else if (req.user.role === 'lecturer' && complaint.isAdminRecipient && complaint.lecturerId.toString() === req.user.id.toString()) {
            isSender = true;
        }

        if (!isSender) {
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
// @access  Private (Sender)
exports.deleteComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Verify ownership
        let isSender = false;
        if (req.user.role === 'student' && complaint.studentId && complaint.studentId.toString() === req.user.id.toString()) {
            isSender = true;
        } else if (req.user.role === 'lecturer' && complaint.isAdminRecipient && complaint.lecturerId.toString() === req.user.id.toString()) {
            isSender = true;
        }

        if (!isSender) {
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
  deleteComplaint: exports.deleteComplaint,
  updateComplaintStatus: exports.updateComplaintStatus
};
