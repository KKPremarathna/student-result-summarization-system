const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    senderRole: {
        type: String,
        enum: ['student', 'lecturer', 'admin'],
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, // For student->lecturer this is the lecturer. For lecturer->admin, this is an Admin ID.
    },
    receiverRole: {
        type: String,
        enum: ['lecturer', 'admin'],
        required: true,
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        default: null, // Optional. Mainly used for student complaints about a specific subject.
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved'],
        default: 'Pending',
    },
    resolvedAt: {
        type: Date,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create a TTL index that automatically deletes documents 30 days after `resolvedAt` is set.
// It will only apply to documents where resolvedAt is a valid Date (not null).
complaintSchema.index({ resolvedAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60, partialFilterExpression: { status: 'Resolved' } });

module.exports = mongoose.model('Complaint', complaintSchema);
