const mongoose = require("mongoose");

// Pre-defined notification templates
const NOTIFICATION_TEMPLATES = {
    INCOURSE_MARKS_ADDED: "New incourse marks for {courseCode} have been added.",
    FINAL_RESULTS_PUBLISHED: "Final results for {courseCode} have been published.",
    SENATE_APPROVED_RESULTS_ADDED: "Senate approved results for {courseCode} have been added.",
    COMPLAINT_RESPONDED: "Your complaint regarding {courseCode} has received a response.",
    SYSTEM_UPDATE: "System update: {message}"
};

const NotificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    templateType: {
        type: String,
        enum: Object.keys(NOTIFICATION_TEMPLATES),
        required: true
    },
    templateVars: {
        type: Map,
        of: String,
        default: {}
    },
    message: {
        type: String
    },
    status: {
        type: String,
        enum: ['UNREAD', 'READ'],
        default: 'UNREAD'
    },
    isSent: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Pre-save hook to generate the final message from the template and variables
NotificationSchema.pre('save', function(next) {
    if (this.isModified('templateType') || this.isModified('templateVars')) {
        let text = NOTIFICATION_TEMPLATES[this.templateType];

        if (text && this.templateVars) {
            this.templateVars.forEach((value, key) => {
                const regex = new RegExp(`{${key}}`, "g");
                text = text.replace(regex, value);
            });
        }

        this.message = text || "You have a new notification.";
    }
    next();
});

// Create a static helper to trigger notifications
NotificationSchema.statics.trigger = async function(userId, templateType, templateVars = {}) {
    try {
        const notification = await this.create({
            user: userId,
            templateType,
            templateVars
        });
        return notification;
    } catch (error) {
        console.error("Error triggering notification:", error);
        throw error;
    }
};

module.exports = {
    Notification: mongoose.model("Notification", NotificationSchema),
    NOTIFICATION_TEMPLATES
};