import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    subscriber: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscriber' },
    type: {
        type: String,
        enum: ['subscription_expiry', 'class_reminder', 'payment_due', 'birthday', 'promotion', 'general'],
        required: true
    },
    title: { type: String, required: true },
    titleAr: { type: String, required: true },
    message: { type: String, required: true },
    messageAr: { type: String, required: true },
    channel: {
        type: String,
        enum: ['email', 'sms', 'whatsapp', 'push', 'in_app'],
        default: 'in_app'
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'failed', 'read'],
        default: 'pending'
    },
    scheduledFor: { type: Date },
    sentAt: { type: Date },
    readAt: { type: Date },
    metadata: { type: mongoose.Schema.Types.Mixed }, // بيانات إضافية
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
