import mongoose from 'mongoose';

const DiscountSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true },
    type: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true
    },
    value: { type: Number, required: true }, // نسبة أو مبلغ ثابت
    minPurchase: { type: Number, default: 0 }, // الحد الأدنى للشراء
    maxDiscount: { type: Number }, // الحد الأقصى للخصم (للنسبة المئوية)
    usageLimit: { type: Number }, // عدد مرات الاستخدام المسموح
    usedCount: { type: Number, default: 0 },
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date },
    applicableTo: {
        type: String,
        enum: ['all', 'subscription', 'class', 'product'],
        default: 'all'
    },
    active: { type: Boolean, default: true },
    description: { type: String },
    descriptionAr: { type: String },
}, { timestamps: true });

// دالة للتحقق من صلاحية الكوبون
DiscountSchema.methods.isValid = function () {
    const now = new Date();
    return this.active &&
        now >= this.validFrom &&
        (!this.validUntil || now <= this.validUntil) &&
        (!this.usageLimit || this.usedCount < this.usageLimit);
};

export default mongoose.models.Discount || mongoose.model('Discount', DiscountSchema);
