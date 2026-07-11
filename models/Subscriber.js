import mongoose from 'mongoose';
import crypto from 'crypto';

const SubscriberSchema = new mongoose.Schema({
    // معلومات أساسية
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    gender: { type: String, enum: ['male', 'female'], required: true },
    dateOfBirth: { type: Date },
    photo: { type: String }, // رابط الصورة الشخصية

    // معلومات الاشتراك
    category: { type: String },
    price: { type: Number, required: true },
    months: { type: Number, required: true },
    count: { type: Number, default: 1 }, // عدد الأشخاص (للاشتراكات الجماعية)
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    active: { type: Boolean, default: true },
    isFrozen: { type: Boolean, default: false },
    planType: { type: String, enum: ['time', 'sessions'], default: 'time' },
    totalSessions: { type: Number, default: 0 },
    remainingSessions: { type: Number, default: 0 },
    freezeHistory: [{
        startDate: { type: Date },
        endDate: { type: Date },
        reason: { type: String },
    }],

    // معلومات صحية
    healthInfo: {
        height: { type: Number }, // سم
        weight: { type: Number }, // كجم
        bloodType: { type: String },
        chronicDiseases: [{ type: String }],
        allergies: [{ type: String }],
        medications: [{ type: String }],
        emergencyContact: {
            name: { type: String },
            phone: { type: String },
            relation: { type: String },
        }
    },

    // الهدف
    goal: {
        type: String,
        enum: ['weight_loss', 'muscle_gain', 'fitness', 'health', 'other'],
        default: 'fitness'
    },
    goalDetails: { type: String },

    // QR Code
    qrCode: { type: String, unique: true },

    // ملاحظات
    notes: { type: String },

    // إحصائيات
    stats: {
        totalVisits: { type: Number, default: 0 },
        lastVisit: { type: Date },
        totalPaid: { type: Number, default: 0 },
        totalRenewals: { type: Number, default: 0 },
    },

    // حالة الاشتراك
    subscriptionHistory: [{
        startDate: { type: Date },
        endDate: { type: Date },
        months: { type: Number },
        price: { type: Number },
        renewedAt: { type: Date, default: Date.now },
    }],

    // نوع النظام
    systemType: { type: String, enum: ['mix', 'separate'], default: 'separate', index: true },

}, { timestamps: true });

// إضافة فهارس إضافية لتحسين الأداء
SubscriberSchema.index({ name: 'text', phone: 1 });
SubscriberSchema.index({ endDate: 1 });
SubscriberSchema.index({ gender: 1 });

// توليد QR Code تلقائي عند الإنشاء
SubscriberSchema.pre('save', function (next) {
    if (!this.qrCode) {
        this.qrCode = crypto.randomBytes(16).toString('hex');
    }
    next();
});

// دالة للتحقق من انتهاء الاشتراك
SubscriberSchema.methods.isExpired = function () {
    return new Date() > this.endDate;
};

// دالة لحساب الأيام المتبقية
SubscriberSchema.methods.daysLeft = function () {
    const diff = this.endDate - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

if (mongoose.models.Subscriber) delete mongoose.models.Subscriber;
export default mongoose.model('Subscriber', SubscriberSchema);
