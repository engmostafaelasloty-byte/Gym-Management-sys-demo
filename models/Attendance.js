import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
    subscriber: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscriber', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date },
    method: {
        type: String,
        enum: ['manual', 'qr', 'card', 'fingerprint'],
        default: 'manual'
    },
    staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }, // من سجل الدخول
    notes: { type: String },
    systemType: { type: String, enum: ['mix', 'separate'], default: 'separate', index: true },
}, { timestamps: true });

// إنشاء index للبحث السريع
AttendanceSchema.index({ subscriber: 1, checkIn: -1 });

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
