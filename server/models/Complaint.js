const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    lecturerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false, // Optional for lecturer-to-admin complaints
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: false, // Optional for lecturer-to-admin complaints
    },
    isAdminRecipient: {
        type: Boolean,
        default: false,
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
