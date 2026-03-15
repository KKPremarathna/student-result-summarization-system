const Complaint = require('../models/Complaint');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (Lecturer)
exports.createComplaint = async (req, res) => {
    try {
        const { title, description } = req.body;

        const complaint = await Complaint.create({
            senderId: req.user.id,
            senderRole: 'lecturer',
            receiverId: req.user.id, // Fallback Admin lookup pending, assigning self or a designated admin ID later
            receiverRole: 'admin',
            title,
            description,
            status: 'Pending'
        });

        res.status(201).json({ success: true, data: complaint });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all complaints assigned TO the logged-in lecturer (from students)
// @route   GET /api/complaints/my-complaints
// @access  Private (Lecturer)
exports.getLecturerComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ receiverId: req.user.id })
            .populate('senderId', 'firstName lastName email profilePicture')
            .populate('subjectId', 'courseCode courseName')
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

        // Verify ownership (can only update if they sent it)
        if (complaint.senderId.toString() !== req.user.id.toString()) {
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

        // Verify ownership (can only delete if they sent it) // Optional: allow receiver to delete as well, but standard is sender
        if (complaint.senderId.toString() !== req.user.id.toString() && complaint.receiverId.toString() !== req.user.id.toString()) {
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
