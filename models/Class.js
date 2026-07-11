import mongoose from 'mongoose';

const ClassSchema = new mongoose.Schema({
    name: { type: String, required: true },
    nameAr: { type: String, required: true },
    description: { type: String },
    descriptionAr: { type: String },
    trainer: { type: String }, // اسم المدرب كـ string مباشرة
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }, // أو مرجع للموظف
    capacity: { type: Number, default: 20 },
    duration: { type: Number, default: 60 },
    price: { type: Number, default: 0 },
    time: { type: String }, // وقت الحصة مثل "09:00"
    schedule: [{
        day: { type: Number, min: 0, max: 6 }, // 0 = الأحد
        startTime: { type: String },
        endTime: { type: String },
    }],
    active: { type: Boolean, default: true },
    gender: { type: String, enum: ['male', 'female', 'mixed'], default: 'mixed' },
    systemType: { type: String, enum: ['mix', 'separate'], default: 'separate', index: true },
}, { timestamps: true });

if (mongoose.models.Class) delete mongoose.models.Class;
export default mongoose.model('Class', ClassSchema);
