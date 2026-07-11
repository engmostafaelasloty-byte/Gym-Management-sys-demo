import mongoose from 'mongoose';

const MeasurementSchema = new mongoose.Schema({
    subscriber: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscriber', required: true },
    weight: { type: Number }, // كجم
    height: { type: Number }, // سم
    bodyFat: { type: Number }, // نسبة الدهون
    muscleMass: { type: Number }, // كتلة العضلات
    chest: { type: Number }, // محيط الصدر
    waist: { type: Number }, // محيط الخصر
    hips: { type: Number }, // محيط الأرداف
    arms: { type: Number }, // محيط الذراع
    thighs: { type: Number }, // محيط الفخذ
    notes: { type: String },
    photo: { type: String }, // صورة التقدم
    measuredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
}, { timestamps: true });

export default mongoose.models.Measurement || mongoose.model('Measurement', MeasurementSchema);
