const { Notification } = require('../models/Notification');

// Get all notifications for logged-in user
exports.getNotifications = async(req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications
        });
    } catch (error) {
        console.error("Fetch notifications error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Mark  as read
exports.markAsRead = async(req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.status = 'READ';
        await notification.save();

        res.status(200).json({
            success: true,
            data: notification
        });
    } catch (error) {
        console.error("Mark notification read error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Mark all user notifications as read
exports.markAllAsRead = async(req, res) => {
    try {
        await Notification.updateMany({ user: req.user._id, status: 'UNREAD' }, { $set: { status: 'READ' } });

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        console.error("Mark all notifications read error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};