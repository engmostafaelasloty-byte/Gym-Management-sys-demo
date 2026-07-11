import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    subscriber: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscriber', required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    date: { type: Date, required: true },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'completed', 'no-show'],
        default: 'confirmed'
    },
    attended: { type: Boolean, default: false },
    rating: { type: Number, min: 1, max: 5 }, // تقييم الحصة
    feedback: { type: String }, // ملاحظات المشترك
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
